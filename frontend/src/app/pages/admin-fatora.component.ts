import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../core/api-base';
import { SeoService } from '../core/seo.service';

interface FatoraTenant {
  id: number; phone: string; company: string | null; ice: string | null;
  identFiscal: string | null; taxePro: string | null; address: string | null;
  email: string | null; vat: number;
  lang: string | null; voice: boolean; status: string;
  hasStamp: boolean; hasLogo: boolean;
  plan: string; planLabel: string; price: number;
  used: number; limit: number; remaining: number; exhausted: boolean;
  planUntil?: string | null; expired?: boolean; daysLeft?: number | null;
  suspended?: boolean; note?: string;
  invoices?: number; lastInvoiceAt?: string | null; createdAt: string;
  clients?: number;
  clientList?: { id: number; name: string; ice: string | null; invoices: number; since: string }[];
  recent?: { id: number; number: string; client: string; date: string; totalTtc: number; items: number; status: string }[];
}
interface FatoraStats {
  tenants: number; active: number; onboarding: number; trial: number; paying: number;
  exhausted: number; mrr: number; invoices: number; invoicesMonth: number; billedMonth: number;
  cancelled?: number; suspended?: number; expired?: number; expiringSoon?: number;
}
interface FatoraInvoice {
  id: number; number: string; client: string; date: string;
  totalTtc: number; status: string; tenantId: number; tenant: string;
}
interface AdminLogRow { at: string; action: string; detail: string; author: string; }
interface EditForm {
  companyName: string; ice: string; identFiscal: string; taxePro: string;
  address: string; email: string; defaultVatRate: number; adminNote: string;
}

const PLAN_OPTIONS = [
  { key: 'trial', label: 'Essai — 2 factures', price: 0 },
  { key: 'p15', label: 'TPE — 15 factures', price: 30 },
  { key: 'p30', label: 'Commerce — 30 factures', price: 50 },
  { key: 'p100', label: 'Entreprise — 100 factures', price: 90 }
];

type Segment = '' | 'paying' | 'trial' | 'exhausted' | 'expiring' | 'onboarding' | 'suspended';

/**
 * Fatora-Bot — poste de commandement des abonnements.
 *
 * L'ancien écran RAPPORTAIT (onze tuiles grises). Celui-ci fait AGIR :
 * la file « À traiter aujourd'hui » transforme chaque signal — quota
 * épuisé, échéance proche, essai qui dort — en action à un clic, avec un
 * message WhatsApp déjà rédigé pour la situation. Un quota épuisé n'est
 * pas une alerte, c'est un client prêt à payer.
 */
@Component({
  selector: 'svq-admin-fatora',
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `
    @if (error()) { <div class="alert">{{ error() }}</div> }

    <!-- ═══════════ COCKPIT ═══════════ -->
    <section class="hero">
      <div class="hero__brand">
        <div class="hero__mark">ف</div>
        <div>
          <h1>Fatora-Bot</h1>
          <span class="hero__date">{{ todayLabel }}</span>
        </div>
        <button class="hero__copy" (click)="copyBrief()" title="Copier le récap du jour pour WhatsApp">
          {{ copied() ? 'Récap copié ✓' : 'Copier le récap' }}
        </button>
      </div>

      @if (stats(); as s) {
        <div class="hero__grid">
          <div class="hero__mrr">
            <span class="lbl">Revenu mensuel récurrent</span>
            <strong>{{ s.mrr | number:'1.0-0' }} <em>DH</em></strong>
            @if (potentialMrr() > 0) {
              <span class="pot">+{{ potentialMrr() | number:'1.0-0' }} DH potentiels si les essais convertissent</span>
            } @else {
              <span class="pot dim">{{ s.paying }} abonnement(s) payant(s)</span>
            }
            <!-- Répartition du parc par plan -->
            <div class="dist" title="Répartition des comptes par plan">
              @for (d of planDist(); track d.key) {
                <i [style.flex-grow]="d.n" [class]="'seg-' + d.key" [title]="d.label + ' : ' + d.n"></i>
              }
            </div>
            <div class="dist-legend">
              @for (d of planDist(); track d.key) {
                @if (d.n > 0) { <span><i [class]="'dot seg-' + d.key"></i>{{ d.short }} {{ d.n }}</span> }
              }
            </div>
          </div>

          <div class="hero__funnel">
            <span class="lbl">Parcours de conversion</span>
            <div class="funnel">
              <div class="step">
                <b>{{ s.tenants }}</b><span>inscrits</span>
              </div>
              <div class="arr">→ {{ ratio(s.trial + s.paying, s.tenants) }}<span class="pcent">%</span></div>
              <div class="step">
                <b>{{ s.trial + s.paying }}</b><span>essais démarrés</span>
              </div>
              <div class="arr gold">→ {{ ratio(s.paying, s.trial + s.paying) }}<span class="pcent">%</span></div>
              <div class="step gold">
                <b>{{ s.paying }}</b><span>payants</span>
              </div>
            </div>
            <span class="funnel-hint">{{ conversionHint() }}</span>
          </div>

          <div class="hero__month">
            <span class="lbl">Ce mois</span>
            <div class="mrow"><b>{{ s.billedMonth | number:'1.0-0' }} DH</b><span>facturés par vos clients</span></div>
            <div class="mrow"><b>{{ s.invoicesMonth }}</b><span>factures émises</span></div>
            <div class="mrow" [class.warn]="(s.cancelled || 0) > 0"><b>{{ s.cancelled || 0 }}</b><span>annulées</span></div>
          </div>
        </div>
      }
    </section>

    <!-- ═══════════ À TRAITER AUJOURD'HUI ═══════════ -->
    @if (actionQueue().length) {
      <section class="queue">
        <h2>À traiter aujourd'hui <span class="badge">{{ actionQueue().length }}</span></h2>
        <div class="queue__scroll">
          @for (a of actionQueue(); track a.tenant.id) {
            <div class="qcard" [class]="'qcard q-' + a.kind">
              <div class="qhead">
                <span class="qtag">{{ a.tag }}</span>
                <span class="qwho">{{ a.tenant.company || '+' + a.tenant.phone }}</span>
              </div>
              <p class="qwhy">{{ a.why }}</p>
              <div class="qacts">
                <button class="qbtn qbtn--main" (click)="sendTemplate(a)">{{ a.cta }}</button>
                <a class="qbtn" [href]="waLink(a.tenant)" target="_blank" rel="noopener" title="Ouvrir WhatsApp">WhatsApp</a>
                <button class="qbtn" (click)="open(a.tenant)">Fiche</button>
              </div>
            </div>
          }
        </div>
      </section>
    }

    <!-- ═══════════ SEGMENTS + OUTILS ═══════════ -->
    <div class="segments">
      @for (seg of segments(); track seg.key) {
        <button [class.on]="segment() === seg.key" (click)="segment.set(seg.key)">
          {{ seg.label }} <b>{{ seg.n }}</b>
        </button>
      }
    </div>

    <div class="bar">
      <input [(ngModel)]="q" (keyup.enter)="load()" placeholder="Rechercher : société, téléphone, ICE…" />
      <select [(ngModel)]="sortMode">
        <option value="risk">Tri : à traiter d'abord</option>
        <option value="recent">Tri : plus récents</option>
        <option value="revenue">Tri : plus gros plans</option>
        <option value="usage">Tri : plus actifs</option>
      </select>
      <button class="btn btn--ghost btn--sm" (click)="load()">Actualiser</button>
      <button class="btn btn--ghost btn--sm" (click)="exportCsv()">Export CSV</button>
      <button class="btn btn--ghost btn--sm" (click)="toggleInvoices()">
        {{ showInvoices() ? 'Masquer les factures' : 'Gérer les factures' }}
      </button>
    </div>

    <!-- Gestion globale des factures : repérer et neutraliser les montants aberrants -->
    @if (showInvoices()) {
      <div class="card tbl-wrap inv-panel">
        <div class="bar">
          <input [(ngModel)]="invQ" (keyup.enter)="loadInvoices()" placeholder="N° de facture ou client…" />
          <select [(ngModel)]="invSort" (change)="loadInvoices()">
            <option value="amount">Montant décroissant</option>
            <option value="recent">Plus récentes</option>
          </select>
          <button class="btn btn--ghost btn--sm" (click)="loadInvoices()">Chercher</button>
        </div>
        <table class="table">
          <thead><tr><th>N°</th><th>Commerçant</th><th>Client</th><th>Date</th><th class="r">Montant</th><th></th></tr></thead>
          <tbody>
            @for (i of invoices(); track i.id) {
              <tr [class.cancelled]="i.status === 'cancelled'">
                <td><code>{{ i.number }}</code></td>
                <td>{{ i.tenant }}</td>
                <td>{{ i.client }}</td>
                <td>{{ i.date | date:'dd/MM/yy' }}</td>
                <td class="r"><strong>{{ i.totalTtc | number:'1.2-2' }} DH</strong></td>
                <td class="r">
                  <button class="btn btn--ghost btn--sm" (click)="setInvoiceStatus(i)">
                    {{ i.status === 'cancelled' ? 'Rétablir' : 'Annuler' }}
                  </button>
                </td>
              </tr>
            } @empty { <tr><td colspan="6" class="empty-td">Aucune facture</td></tr> }
          </tbody>
        </table>
      </div>
    }

    <!-- ═══════════ COMPTES ═══════════ -->
    <div class="card tbl-wrap">
      <table class="table">
        <thead><tr>
          <th>Entreprise</th><th>Santé</th><th>Plan</th><th>Quota</th>
          <th>Échéance</th><th>Activité</th><th>Actions</th>
        </tr></thead>
        <tbody>
          @for (t of visibleTenants(); track t.id) {
            <tr [class.dim]="t.status === 'onboarding'">
              <td>
                <div class="who">
                  <span class="avatar" [class.avatar--gold]="t.plan !== 'trial'">{{ initials(t) }}</span>
                  <div>
                    <strong>{{ t.company || '(inscription en cours)' }}</strong>
                    <div class="meta">
                      <code>+{{ t.phone }}</code>
                      @if (t.ice) { <span>ICE {{ t.ice }}</span> }
                      @if (t.voice) { <span class="tag">vocal</span> }
                      @if (t.hasStamp) { <span class="tag">cachet</span> }
                      @if (t.hasLogo) { <span class="tag">logo</span> }
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span [class]="'health h-' + health(t).key">
                  <i></i>{{ health(t).label }}
                </span>
              </td>
              <td>
                <select [class]="'plansel p-' + t.plan" (change)="changePlan(t, $event)">
                  @for (p of plans; track p.key) {
                    <option [value]="p.key" [selected]="p.key === t.plan">{{ p.label }}</option>
                  }
                </select>
                <div class="meta">{{ t.price }} DH/mois</div>
              </td>
              <td>
                <div class="quota">
                  <i [style.width.%]="pct(t)"
                     [class.mid]="pct(t) >= 60 && !t.exhausted"
                     [class.full]="t.exhausted"></i>
                </div>
                <div class="meta">{{ t.used }} / {{ t.limit }}
                  @if (t.exhausted) { <b class="opp">· prêt pour l'upgrade</b> }
                </div>
              </td>
              <td>
                @if (t.plan === 'trial') { <span class="meta">—</span> }
                @else if (t.expired) { <span class="tag ko">Expiré</span> }
                @else {
                  <span [class.soon]="(t.daysLeft ?? 99) <= 7">{{ t.planUntil | date:'dd/MM/yy' }}</span>
                  <div class="meta">{{ t.daysLeft }} j</div>
                }
              </td>
              <td>
                <b class="inv-n">{{ t.invoices || 0 }}</b>
                <div class="meta">{{ t.lastInvoiceAt ? 'dern. ' + (t.lastInvoiceAt | date:'dd/MM') : 'jamais facturé' }}</div>
              </td>
              <td class="acts">
                <a class="btn btn--ghost btn--sm wa" [href]="waLink(t)" target="_blank" rel="noopener"
                   title="Ouvrir la conversation WhatsApp">WhatsApp</a>
                <button class="btn btn--ghost btn--sm" (click)="open(t)">Détail</button>
                <button class="btn btn--ghost btn--sm" (click)="askMessage(t)">Message</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="empty-td">Aucun compte dans ce segment</td></tr>
          }
        </tbody>
      </table>
    </div>

    <!-- ═══════════ DÉTAIL ═══════════ -->
    @if (detail(); as d) {
      <div class="modal" (click)="detail.set(null)">
        <div class="sheet" (click)="$event.stopPropagation()">
          <button class="x" (click)="detail.set(null)">×</button>
          <div class="sheet-head">
            <span class="avatar avatar--big" [class.avatar--gold]="d.plan !== 'trial'">{{ initials(d) }}</span>
            <div>
              <h2>{{ d.company || '(sans nom)' }}</h2>
              <div class="meta big">+{{ d.phone }} · {{ d.planLabel }} · {{ d.used }}/{{ d.limit }} factures ce mois</div>
            </div>
          </div>

          <div class="acts-row">
            <a class="btn btn--primary btn--sm" [href]="waLink(d)" target="_blank" rel="noopener">Ouvrir WhatsApp</a>
            <button class="btn btn--ghost btn--sm" (click)="editing.set(!editing())">
              {{ editing() ? 'Annuler la modification' : 'Modifier la fiche' }}
            </button>
            <button class="btn btn--ghost btn--sm" (click)="toggleSuspend(d)">
              {{ d.suspended ? 'Réactiver le compte' : 'Suspendre le compte' }}
            </button>
            <button class="btn btn--ghost btn--sm" (click)="giveCredit(d)">Offrir / prolonger</button>
            <button class="btn btn--ghost btn--sm" (click)="askMessage(d)">Message</button>
          </div>

          <h3>Identité de l’entreprise</h3>
          @if (editing()) {
            <form class="editform" (ngSubmit)="saveEdit(d)">
              <label>Raison sociale<input name="companyName" [(ngModel)]="form.companyName" /></label>
              <div class="row3">
                <label>ICE<input name="ice" [(ngModel)]="form.ice" /></label>
                <label>IF<input name="identFiscal" [(ngModel)]="form.identFiscal" /></label>
                <label>Taxe pro<input name="taxePro" [(ngModel)]="form.taxePro" /></label>
              </div>
              <label>Adresse<input name="address" [(ngModel)]="form.address" /></label>
              <div class="row3">
                <label>Email<input name="email" type="email" [(ngModel)]="form.email" /></label>
                <label>TVA par défaut
                  <select name="vat" [(ngModel)]="form.defaultVatRate">
                    @for (v of [20,14,10,7,0]; track v) { <option [value]="v">{{ v }} %</option> }
                  </select>
                </label>
              </div>
              <label>Note interne (non visible du client)
                <textarea name="note" rows="2" [(ngModel)]="form.adminNote"></textarea></label>
              <button class="btn btn--primary btn--sm" type="submit">Enregistrer</button>
            </form>
          } @else {
            <div class="grid2">
              <div class="full"><span>Raison sociale</span><b>{{ d.company || '— (inscription non terminée)' }}</b></div>
              <div><span>ICE</span><b>{{ d.ice || '—' }}</b></div>
              <div><span>Identifiant fiscal (IF)</span><b>{{ d.identFiscal || '—' }}</b></div>
              <div><span>Taxe professionnelle</span><b>{{ d.taxePro || '—' }}</b></div>
              <div><span>TVA par défaut</span><b>{{ d.vat }} %</b></div>
              <div class="full"><span>Adresse</span><b>{{ d.address || '—' }}</b></div>
              <div><span>WhatsApp</span><b>+{{ d.phone }}</b></div>
              <div><span>Email</span><b>{{ d.email || '— (non communiqué)' }}</b></div>
            </div>
          }

          <h3>Compte et usage</h3>
          <div class="grid2">
            <div><span>Statut</span><b>{{ d.suspended ? 'Suspendu' : d.status === 'active' ? 'Actif' : 'Inscription en cours' }}</b></div>
            <div><span>Inscrit le</span><b>{{ d.createdAt | date:'dd/MM/yyyy' }}</b></div>
            <div><span>Abonnement</span><b>{{ d.planLabel }} — {{ d.price }} DH/mois</b></div>
            <div><span>Valable jusqu’au</span><b>{{ d.plan === 'trial' ? '— (essai)' : d.expired ? 'Expiré' : (d.planUntil | date:'dd/MM/yyyy') + ' (' + d.daysLeft + ' j)' }}</b></div>
            <div><span>Quota consommé</span><b>{{ d.used }} / {{ d.limit }}</b></div>
            <div><span>Clients enregistrés</span><b>{{ d.clients ?? 0 }}</b></div>
            <div><span>Langue / canal</span><b>{{ langLabel(d.lang) }}{{ d.voice ? ' · vocal' : '' }}</b></div>
            <div><span>Cachet</span><b>{{ d.hasStamp ? 'Enregistré' : 'Absent' }}</b></div>
            <div><span>Logo</span><b>{{ d.hasLogo ? 'Enregistré' : 'Absent' }}</b></div>
          </div>

          <h3>Clients enregistrés ({{ d.clients ?? 0 }})</h3>
          <table class="table mini">
            <tbody>
              @for (c of d.clientList || []; track c.id) {
                <tr>
                  <td><strong>{{ c.name }}</strong></td>
                  <td><small>{{ c.ice || '—' }}</small></td>
                  <td class="r">{{ c.invoices }} facture(s)</td>
                </tr>
              } @empty { <tr><td colspan="3" class="empty-td">Aucun client mémorisé</td></tr> }
            </tbody>
          </table>

          <h3>Dernières factures</h3>
          <table class="table mini">
            <tbody>
              @for (i of d.recent || []; track i.number) {
                <tr [class.cancelled]="i.status === 'cancelled'">
                  <td><code>{{ i.number }}</code></td><td>{{ i.client }}</td>
                  <td>{{ i.date | date:'dd/MM/yy' }}</td>
                  <td class="r"><strong>{{ i.totalTtc | number:'1.2-2' }} DH</strong></td>
                  <td class="r">
                    <button class="btn btn--ghost btn--sm" (click)="toggleInvoice(d, i)">
                      {{ i.status === 'cancelled' ? 'Rétablir' : 'Annuler' }}
                    </button>
                  </td>
                </tr>
              } @empty { <tr><td colspan="5" class="empty-td">Aucune facture</td></tr> }
            </tbody>
          </table>
          <p class="hint">Une facture annulée conserve son numéro (pas de trou dans la séquence) mais sort des totaux.</p>

          <h3>Journal des actions</h3>
          <table class="table mini">
            <tbody>
              @for (l of logs(); track $index) {
                <tr>
                  <td><small>{{ l.at | date:'dd/MM/yy HH:mm' }}</small></td>
                  <td><strong>{{ l.action }}</strong></td>
                  <td><small>{{ l.detail }}</small></td>
                </tr>
              } @empty { <tr><td colspan="3" class="empty-td">Aucune action enregistrée</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .alert { background: #fdecea; color: #b3261e; padding: .8rem 1rem; border-radius: 10px; margin-bottom: 1rem; }

    /* ─── Cockpit or-nuit ─── */
    .hero { background: linear-gradient(135deg, #14161f 0%, #1d2030 55%, #23273a 100%);
      border-radius: 18px; padding: 1.4rem 1.6rem 1.5rem; color: #fff; margin-bottom: 1.2rem;
      position: relative; overflow: hidden; }
    .hero::after { content: ''; position: absolute; top: -60px; right: -40px; width: 260px; height: 260px;
      background: radial-gradient(circle, rgba(232,182,76,.16), transparent 65%); pointer-events: none; }
    .hero__brand { display: flex; align-items: center; gap: .8rem; margin-bottom: 1.2rem; }
    .hero__mark { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center;
      background: linear-gradient(135deg, #f0c469, #c9902a); color: #17120a; font-weight: 800; font-size: 1.3rem; }
    .hero__brand h1 { font-size: 1.25rem; margin: 0; color: #fff; }
    .hero__date { font-size: .78rem; color: #9aa1b5; text-transform: capitalize; }
    .hero__copy { margin-left: auto; font-size: .78rem; font-weight: 700; color: #e8b64c;
      border: 1px solid rgba(232,182,76,.45); border-radius: 999px; padding: .45rem .9rem;
      background: rgba(232,182,76,.08); cursor: pointer; transition: .15s; }
    .hero__copy:hover { background: rgba(232,182,76,.18); }

    .hero__grid { display: grid; grid-template-columns: 1.15fr 1.3fr .8fr; gap: 1.6rem; }
    @media (max-width: 980px) { .hero__grid { grid-template-columns: 1fr; gap: 1.2rem; } }
    .lbl { display: block; font-size: .7rem; font-weight: 700; letter-spacing: .08em;
      text-transform: uppercase; color: #8b93a8; margin-bottom: .45rem; }

    .hero__mrr strong { font-size: 2.6rem; line-height: 1; color: #f0c469; font-weight: 800; }
    .hero__mrr strong em { font-style: normal; font-size: 1.1rem; color: #b99a55; }
    .pot { display: block; margin-top: .45rem; font-size: .82rem; color: #7fd6a6; font-weight: 600; }
    .pot.dim { color: #9aa1b5; }
    .dist { display: flex; gap: 3px; height: 9px; border-radius: 6px; overflow: hidden; margin-top: .9rem; }
    .dist i { display: block; min-width: 8px; }
    .seg-trial { background: #4a5164; } .seg-p15 { background: #6ea8fe; }
    .seg-p30 { background: #a885f7; } .seg-p100 { background: #f0c469; }
    .dist-legend { display: flex; gap: .9rem; flex-wrap: wrap; margin-top: .45rem; font-size: .72rem; color: #9aa1b5; }
    .dot { display: inline-block; width: 8px; height: 8px; border-radius: 3px; margin-right: .3rem; }

    .funnel { display: flex; align-items: center; gap: .7rem; flex-wrap: wrap; }
    .step { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
      border-radius: 12px; padding: .55rem .9rem; text-align: center; min-width: 84px; }
    .step b { display: block; font-size: 1.35rem; }
    .step span { font-size: .68rem; color: #9aa1b5; }
    .step.gold { border-color: rgba(232,182,76,.5); background: rgba(232,182,76,.1); }
    .step.gold b { color: #f0c469; }
    .arr { font-size: .8rem; color: #8b93a8; font-weight: 700; white-space: nowrap; }
    .arr .pcent { font-size: .65rem; }
    .arr.gold { color: #e8b64c; }
    .funnel-hint { display: block; margin-top: .55rem; font-size: .75rem; color: #9aa1b5; }

    .hero__month .mrow { display: flex; align-items: baseline; gap: .5rem; padding: .3rem 0; }
    .hero__month .mrow b { font-size: 1.05rem; min-width: 86px; }
    .hero__month .mrow span { font-size: .74rem; color: #9aa1b5; }
    .hero__month .mrow.warn b { color: #ff9c9c; }

    /* ─── File du jour ─── */
    .queue { margin-bottom: 1.2rem; }
    .queue h2 { font-size: 1rem; margin: 0 0 .7rem; display: flex; align-items: center; gap: .5rem; }
    .badge { background: #b45309; color: #fff; font-size: .72rem; font-weight: 800;
      border-radius: 999px; padding: .15rem .55rem; }
    .queue__scroll { display: flex; gap: .8rem; overflow-x: auto; padding-bottom: .4rem;
      scroll-snap-type: x proximity; }
    .qcard { flex: 0 0 265px; scroll-snap-align: start; border-radius: 14px; padding: .9rem 1rem;
      background: #fff; border: 1px solid var(--c-border, #e3e6ee); border-top: 3px solid #9aa1b5; }
    .qcard.q-upgrade { border-top-color: #c9902a; background: #fffdf6; }
    .qcard.q-renew { border-top-color: #b45309; background: #fffaf3; }
    .qcard.q-expired { border-top-color: #b3261e; background: #fff7f6; }
    .qcard.q-dormant { border-top-color: #6ea8fe; }
    .qhead { display: flex; justify-content: space-between; align-items: center; gap: .5rem; margin-bottom: .35rem; }
    .qtag { font-size: .64rem; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; color: #8b6a1f; }
    .q-renew .qtag, .q-expired .qtag { color: #b3261e; }
    .q-dormant .qtag { color: #3b6cb7; }
    .qwho { font-size: .82rem; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .qwhy { font-size: .76rem; color: var(--c-text-soft, #6b7280); margin: 0 0 .6rem; line-height: 1.45; }
    .qacts { display: flex; gap: .4rem; flex-wrap: wrap; }
    .qbtn { font-size: .72rem; font-weight: 700; border-radius: 999px; padding: .32rem .7rem;
      border: 1px solid var(--c-border, #e3e6ee); background: #fff; cursor: pointer;
      color: #10131c; text-decoration: none; }
    .qbtn--main { background: linear-gradient(135deg, #f0c469, #c9902a); border: 0; color: #17120a; }

    /* ─── Segments ─── */
    .segments { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .8rem; }
    .segments button { font-size: .8rem; font-weight: 600; padding: .42rem .8rem; border-radius: 999px;
      border: 1.5px solid var(--c-border, #e3e6ee); background: #fff; cursor: pointer; color: #4b5563; }
    .segments button b { font-weight: 800; margin-left: .25rem; color: #9aa1b5; }
    .segments button.on { background: #14161f; border-color: #14161f; color: #fff; }
    .segments button.on b { color: #f0c469; }

    .bar { display: flex; gap: .6rem; margin-bottom: 1rem; flex-wrap: wrap;
      input { flex: 1; min-width: 220px; } input, select { padding: .55rem .7rem; border-radius: 9px; border: 1.5px solid var(--c-border, #e3e6ee); } }
    .tbl-wrap { padding: .5rem; overflow-x: auto; }
    .table td { vertical-align: top; }
    .table tbody tr:hover { background: #fafbfd; }
    tr.dim { opacity: .62; }
    .meta { color: var(--c-text-soft, #6b7280); font-size: .74rem; margin-top: 3px; display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .meta.big { font-size: .9rem; margin: 0; }
    .tag { background: #eef1f7; border-radius: 999px; padding: 1px 8px; }
    code { background: #f4f5f9; padding: 2px 6px; border-radius: 6px; font-size: .82rem; }

    .who { display: flex; gap: .7rem; align-items: flex-start; }
    .avatar { width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0; display: grid; place-items: center;
      background: #e8eaf1; color: #4b5563; font-weight: 800; font-size: .82rem; }
    .avatar--gold { background: linear-gradient(135deg, #f0c469, #c9902a); color: #17120a; }
    .avatar--big { width: 48px; height: 48px; font-size: 1rem; }

    .health { display: inline-flex; align-items: center; gap: .38rem; font-size: .76rem; font-weight: 700;
      border-radius: 999px; padding: .28rem .65rem; white-space: nowrap; }
    .health i { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
    .h-active { background: #e7f8ef; color: #0c6b45; } .h-active i { background: #10b981; }
    .h-upgrade { background: #fdf3dd; color: #8b6a1f; } .h-upgrade i { background: #c9902a; }
    .h-renew { background: #fef3c7; color: #92400e; } .h-renew i { background: #d97706; }
    .h-expired { background: #fee2e2; color: #991b1b; } .h-expired i { background: #ef4444; }
    .h-dormant { background: #e8effc; color: #3b6cb7; } .h-dormant i { background: #6ea8fe; }
    .h-onboarding { background: #f1f2f4; color: #6b7280; } .h-onboarding i { background: #9aa1b5; }
    .h-suspended { background: #f1f2f4; color: #6b7280; } .h-suspended i { background: #6b7280; }

    .plansel { padding: .35rem .6rem; border-radius: 999px; border: 1.5px solid var(--c-border, #e3e6ee);
      font-size: .78rem; font-weight: 700; cursor: pointer; max-width: 170px; }
    .plansel.p-trial { background: #f1f2f4; color: #4b5563; }
    .plansel.p-p15 { background: #e8effc; color: #234f8d; border-color: #cddcf7; }
    .plansel.p-p30 { background: #efe9fd; color: #5b21b6; border-color: #ded1fa; }
    .plansel.p-p100 { background: #fdf3dd; color: #8b6a1f; border-color: #f1dfae; }

    .quota { width: 90px; height: 7px; background: #eef1f7; border-radius: 6px; overflow: hidden;
      i { display: block; height: 100%; background: #2f9e6d; }
      i.mid { background: #d99e06; } i.full { background: #b3261e; } }
    .opp { color: #8b6a1f; }
    .inv-n { font-size: .95rem; }
    .acts { display: flex; gap: .4rem; flex-wrap: wrap; }
    .wa { color: #0c6b45; }
    .empty-td { text-align: center; color: var(--c-text-soft, #6b7280); padding: 1.5rem; }
    .modal { position: fixed; inset: 0; background: rgba(10,12,20,.45); display: grid; place-items: center; z-index: 90; padding: 16px; }
    .sheet { position: relative; background: #fff; border-radius: 16px; padding: 26px; max-width: 640px; width: 100%; max-height: 86vh; overflow: auto;
      h2 { margin: 0 0 4px; } h3 { margin: 18px 0 8px; font-size: 1rem; } }
    .sheet-head { display: flex; gap: .9rem; align-items: center; margin-bottom: .9rem; }
    .x { position: absolute; top: 12px; right: 14px; border: 0; background: none; font-size: 1.6rem; cursor: pointer; line-height: 1; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
      > div { background: #f7f8fb; border-radius: 10px; padding: 10px 12px; }
      > div.full { grid-column: 1 / -1; }
      span { display: block; color: var(--c-text-soft, #6b7280); font-size: .72rem; margin-bottom: 2px; }
      b { font-size: .92rem; word-break: break-word; } }
    @media (max-width: 560px) { .grid2 { grid-template-columns: 1fr; } }
    .table.mini td { padding: .45rem .5rem; font-size: .85rem; } .r { text-align: right; }
    tr.cancelled { opacity: .5; text-decoration: line-through; }
    .hint { color: var(--c-text-soft, #6b7280); font-size: .76rem; margin-top: .5rem; }
    .tag.ko { background: #fde7e5; color: #b3261e; }
    .soon { color: #b3261e; font-weight: 700; }
    .inv-panel { margin-bottom: 1rem; }
    .acts-row { display: flex; gap: .5rem; flex-wrap: wrap; margin: .2rem 0 1rem; }
    .editform { display: flex; flex-direction: column; gap: .6rem;
      label { display: block; font-size: .74rem; color: var(--c-text-soft, #6b7280); }
      input, select, textarea { width: 100%; margin-top: 3px; padding: .5rem .6rem; font-size: .9rem;
        border: 1.5px solid var(--c-border, #e3e6ee); border-radius: 8px; font-family: inherit; color: #10131c; }
      .row3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; }
      button { align-self: flex-start; margin-top: .3rem; } }
    @media (max-width: 560px) { .editform .row3 { grid-template-columns: 1fr; } }
  `]
})
export class AdminFatoraComponent implements OnInit {
  private http = inject(HttpClient);
  private base = inject(API_BASE);
  private seo = inject(SeoService);

  readonly plans = PLAN_OPTIONS;
  readonly todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  stats = signal<FatoraStats | null>(null);
  tenants = signal<FatoraTenant[]>([]);
  detail = signal<FatoraTenant | null>(null);
  logs = signal<AdminLogRow[]>([]);
  invoices = signal<FatoraInvoice[]>([]);
  showInvoices = signal(false);
  editing = signal(false);
  copied = signal(false);
  error = signal<string>('');
  segment = signal<Segment>('');
  q = '';
  sortMode = 'risk';
  invQ = '';
  invSort = 'amount';
  form: EditForm = {
    companyName: '', ice: '', identFiscal: '', taxePro: '',
    address: '', email: '', defaultVatRate: 20, adminNote: ''
  };

  private api(path: string) { return `${this.base}/api/admin/fatora${path}`; }

  ngOnInit() {
    this.seo.noIndex('Fatora-Bot — SWIVIQ Admin');
    this.load();
  }

  load() {
    this.error.set('');
    this.http.get<FatoraStats>(this.api('/stats')).subscribe({
      next: (s) => this.stats.set(s),
      error: (e) => this.error.set(e?.error?.error || 'Service Fatora-Bot injoignable.')
    });
    const params: string[] = [];
    if (this.q.trim()) params.push('q=' + encodeURIComponent(this.q.trim()));
    this.http.get<FatoraTenant[]>(this.api('/tenants' + (params.length ? '?' + params.join('&') : '')))
      .subscribe({ next: (t) => this.tenants.set(t), error: () => {} });
  }

  // ─── Lecture du parc ───────────────────────────────────────

  /** Santé dérivée d'un compte — le tri et la file du jour s'appuient dessus. */
  health(t: FatoraTenant): { key: string; label: string; weight: number } {
    if (t.suspended) return { key: 'suspended', label: 'Suspendu', weight: 2 };
    if (t.status === 'onboarding') return { key: 'onboarding', label: 'Inscription', weight: 3 };
    if (t.expired) return { key: 'expired', label: 'Expiré', weight: 0 };
    if (t.exhausted) return { key: 'upgrade', label: 'À convertir', weight: 0 };
    if ((t.daysLeft ?? 99) <= 7 && t.plan !== 'trial') return { key: 'renew', label: 'À renouveler', weight: 1 };
    if (!t.invoices || this.daysSince(t.lastInvoiceAt) > 14) return { key: 'dormant', label: 'Dormant', weight: 4 };
    return { key: 'active', label: 'Actif', weight: 5 };
  }

  private daysSince(iso?: string | null): number {
    if (!iso) return 999;
    return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  }

  segments = computed(() => {
    const all = this.tenants();
    const n = (f: (t: FatoraTenant) => boolean) => all.filter(f).length;
    return [
      { key: '' as Segment, label: 'Tous', n: all.length },
      { key: 'paying' as Segment, label: 'Payants', n: n(t => t.plan !== 'trial' && !t.suspended) },
      { key: 'trial' as Segment, label: 'En essai', n: n(t => t.plan === 'trial' && t.status !== 'onboarding') },
      { key: 'exhausted' as Segment, label: 'Quota épuisé', n: n(t => t.exhausted) },
      { key: 'expiring' as Segment, label: 'Échéance ≤ 7 j', n: n(t => !t.expired && (t.daysLeft ?? 99) <= 7 && t.plan !== 'trial') },
      { key: 'onboarding' as Segment, label: 'Inscriptions', n: n(t => t.status === 'onboarding') },
      { key: 'suspended' as Segment, label: 'Suspendus', n: n(t => !!t.suspended) },
    ].filter(s => s.key === '' || s.n > 0);
  });

  visibleTenants = computed(() => {
    const seg = this.segment();
    let list = this.tenants().filter(t => {
      switch (seg) {
        case 'paying': return t.plan !== 'trial' && !t.suspended;
        case 'trial': return t.plan === 'trial' && t.status !== 'onboarding';
        case 'exhausted': return t.exhausted;
        case 'expiring': return !t.expired && (t.daysLeft ?? 99) <= 7 && t.plan !== 'trial';
        case 'onboarding': return t.status === 'onboarding';
        case 'suspended': return !!t.suspended;
        default: return true;
      }
    });
    const mode = this.sortMode;
    list = [...list];
    if (mode === 'risk') list.sort((a, b) => this.health(a).weight - this.health(b).weight);
    else if (mode === 'recent') list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    else if (mode === 'revenue') list.sort((a, b) => b.price - a.price);
    else if (mode === 'usage') list.sort((a, b) => (b.invoices || 0) - (a.invoices || 0));
    return list;
  });

  /** File du jour : chaque signal devient une action, message déjà rédigé. */
  actionQueue = computed(() => {
    const out: { kind: string; tag: string; tenant: FatoraTenant; why: string; cta: string; template: string }[] = [];
    for (const t of this.tenants()) {
      if (t.suspended || t.status === 'onboarding') continue;
      const name = t.company || 'cher client';
      if (t.exhausted) {
        out.push({
          kind: 'upgrade', tag: 'Revenu à prendre', tenant: t,
          why: `Quota ${t.used}/${t.limit} épuisé — il ne peut plus facturer. C'est le moment idéal pour proposer le plan supérieur.`,
          cta: 'Proposer l’upgrade',
          template: `Bonjour ${name}, votre quota de ${t.limit} factures est atteint — bravo pour l'activité ! Pour continuer sans interruption, je peux activer le plan supérieur immédiatement. Souhaitez-vous que je vous envoie les détails ?`
        });
      } else if (t.expired) {
        out.push({
          kind: 'expired', tag: 'Abonnement expiré', tenant: t,
          why: 'Son abonnement est arrivé à terme — chaque jour sans relance augmente le risque de le perdre.',
          cta: 'Relancer',
          template: `Bonjour ${name}, votre abonnement Fatora-Bot est arrivé à échéance. Vos données et votre numérotation sont intactes : un simple renouvellement et vous refacturez dans la minute. Je vous envoie les modalités ?`
        });
      } else if ((t.daysLeft ?? 99) <= 7 && t.plan !== 'trial') {
        out.push({
          kind: 'renew', tag: `Échéance dans ${t.daysLeft} j`, tenant: t,
          why: `Son plan ${t.planLabel} expire le ${new Date(t.planUntil!).toLocaleDateString('fr-FR')}. Une relance maintenant évite l'interruption.`,
          cta: 'Rappeler l’échéance',
          template: `Bonjour ${name}, petit rappel : votre abonnement Fatora-Bot arrive à échéance dans ${t.daysLeft} jour(s). Pour éviter toute interruption de facturation, je peux le renouveler dès maintenant. On procède ?`
        });
      } else if (t.plan === 'trial' && t.used >= t.limit - 1 && t.used > 0) {
        out.push({
          kind: 'upgrade', tag: 'Essai presque fini', tenant: t,
          why: `${t.used}/${t.limit} factures d'essai utilisées — il a testé, c'est le moment de convertir.`,
          cta: 'Proposer un plan',
          template: `Bonjour ${name}, vous avez bien pris en main Fatora-Bot. Pour continuer à facturer sans limite d'essai, le plan TPE démarre à 30 DH/mois. Je vous l'active ?`
        });
      } else if (t.plan === 'trial' && t.used === 0 && this.daysSince(t.createdAt) >= 2) {
        out.push({
          kind: 'dormant', tag: 'Essai jamais utilisé', tenant: t,
          why: `Inscrit il y a ${this.daysSince(t.createdAt)} j, aucune facture émise. Un petit coup de main le débloquerait.`,
          cta: 'Proposer de l’aide',
          template: `Bonjour ${name}, je vois que vous n'avez pas encore émis votre première facture sur Fatora-Bot. Voulez-vous que je vous guide ? Dictez simplement « فاتورة ل [nom du client] » et je m'occupe du reste.`
        });
      }
    }
    const order: Record<string, number> = { upgrade: 0, expired: 1, renew: 2, dormant: 3 };
    return out.sort((a, b) => (order[a.kind] ?? 9) - (order[b.kind] ?? 9)).slice(0, 8);
  });

  /** MRR supplémentaire si chaque essai actif passait au plan d'entrée. */
  potentialMrr = computed(() => {
    const entry = PLAN_OPTIONS.find(p => p.key === 'p15')?.price ?? 30;
    return this.tenants().filter(t => t.plan === 'trial' && t.status !== 'onboarding' && !t.suspended).length * entry;
  });

  planDist = computed(() => {
    const all = this.tenants();
    return [
      { key: 'p100', label: 'Entreprise', short: 'Ent.', n: all.filter(t => t.plan === 'p100').length },
      { key: 'p30', label: 'Commerce', short: 'Com.', n: all.filter(t => t.plan === 'p30').length },
      { key: 'p15', label: 'TPE', short: 'TPE', n: all.filter(t => t.plan === 'p15').length },
      { key: 'trial', label: 'Essai', short: 'Essai', n: all.filter(t => t.plan === 'trial').length },
    ];
  });

  ratio(a: number, b: number): number { return b > 0 ? Math.round((a / b) * 100) : 0; }

  conversionHint(): string {
    const s = this.stats();
    if (!s) return '';
    const started = s.trial + s.paying;
    if (!started) return 'Aucun essai démarré pour le moment.';
    const rate = this.ratio(s.paying, started);
    if (rate >= 40) return 'Excellente conversion — le produit convainc.';
    if (rate >= 20) return 'Conversion correcte — la file du jour aide à faire mieux.';
    return 'Marge de progression : chaque essai accompagné convertit mieux.';
  }

  // ─── Actions ───────────────────────────────────────────────

  /** Lien WhatsApp direct vers le commerçant, depuis votre propre téléphone. */
  waLink(t: FatoraTenant): string { return `https://wa.me/${t.phone.replace(/\D/g, '')}`; }

  initials(t: FatoraTenant): string {
    const src = (t.company || '').trim();
    if (!src) return '·';
    const parts = src.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || src[0].toUpperCase();
  }

  /** Envoie le message pré-rédigé de la file du jour — modifiable avant envoi. */
  sendTemplate(a: { tenant: FatoraTenant; template: string }) {
    const text = prompt(`Message WhatsApp à ${a.tenant.company || a.tenant.phone} (envoyé par le bot) :`, a.template);
    if (!text || !text.trim()) return;
    this.http.post(this.api(`/tenants/${a.tenant.id}/message`), { text }).subscribe({
      next: () => alert('Message envoyé.'),
      error: (e) => alert(e?.error?.error || 'Envoi impossible.')
    });
  }

  /** Récap du jour prêt à coller dans WhatsApp / notes. */
  copyBrief() {
    const s = this.stats();
    if (!s) return;
    const lines = [
      `Fatora-Bot — ${this.todayLabel}`,
      `MRR : ${s.mrr} DH (${s.paying} payants / ${s.tenants} comptes)`,
      `Ce mois : ${s.invoicesMonth} factures, ${Math.round(s.billedMonth).toLocaleString('fr-FR')} DH facturés`,
    ];
    const queue = this.actionQueue();
    if (queue.length) {
      lines.push('', 'A traiter :');
      for (const a of queue) lines.push(`- ${a.tenant.company || '+' + a.tenant.phone} : ${a.tag}`);
    } else {
      lines.push('', 'Rien a traiter aujourd’hui.');
    }
    navigator.clipboard?.writeText(lines.join('\n')).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    });
  }

  pct(t: FatoraTenant) { return Math.min(100, Math.round((t.used / Math.max(1, t.limit)) * 100)); }

  langLabel(lang: string | null) {
    return { fr: 'Français', darija_latin: 'Darija (latin)', darija_arabic: 'Darija (arabe)' }[lang || ''] || 'Non détectée';
  }

  changePlan(t: FatoraTenant, ev: Event) {
    const select = ev.target as HTMLSelectElement;
    const plan = select.value;
    const label = this.plans.find((p) => p.key === plan)?.label || plan;
    if (!confirm(`Activer « ${label} » pour ${t.company || t.phone} ?\nLe compteur du mois est remis à zéro et le client est prévenu sur WhatsApp.`)) {
      select.value = t.plan;
      return;
    }
    this.http.patch<FatoraTenant>(this.api(`/tenants/${t.id}/plan`), { plan, notify: true }).subscribe({
      next: () => this.load(),
      error: (e) => { select.value = t.plan; this.error.set(e?.error?.error || 'Changement de plan impossible.'); }
    });
  }

  open(t: FatoraTenant) {
    this.editing.set(false);
    this.http.get<FatoraTenant>(this.api(`/tenants/${t.id}`)).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.form = {
          companyName: d.company || '', ice: d.ice || '', identFiscal: d.identFiscal || '',
          taxePro: d.taxePro || '', address: d.address || '', email: d.email || '',
          defaultVatRate: d.vat, adminNote: d.note || ''
        };
      },
      error: () => {}
    });
    this.http.get<AdminLogRow[]>(this.api(`/tenants/${t.id}/logs`))
      .subscribe({ next: (l) => this.logs.set(l), error: () => this.logs.set([]) });
  }

  saveEdit(d: FatoraTenant) {
    this.http.patch<FatoraTenant>(this.api(`/tenants/${d.id}`), this.form).subscribe({
      next: () => { this.editing.set(false); this.open(d); this.load(); },
      error: (e) => this.error.set(e?.error?.error || 'Modification impossible.')
    });
  }

  toggleSuspend(d: FatoraTenant) {
    const next = !d.suspended;
    const verb = next ? 'Suspendre' : 'Réactiver';
    if (!confirm(`${verb} le compte de ${d.company || d.phone} ?\nLe client en sera informé sur WhatsApp.`)) return;
    this.http.post<FatoraTenant>(this.api(`/tenants/${d.id}/suspend`), { suspended: next }).subscribe({
      next: () => { this.open(d); this.load(); },
      error: (e) => this.error.set(e?.error?.error || 'Action impossible.')
    });
  }

  giveCredit(d: FatoraTenant) {
    const inv = Number(prompt('Combien de factures offrir ? (0 pour aucune)', '5') || 0);
    const days = Number(prompt('Combien de jours de validité ajouter ? (0 pour aucun)', '0') || 0);
    if (!inv && !days) return;
    this.http.post<FatoraTenant>(this.api(`/tenants/${d.id}/credit`), { invoices: inv, days }).subscribe({
      next: () => { this.open(d); this.load(); },
      error: (e) => this.error.set(e?.error?.error || 'Crédit impossible.')
    });
  }

  toggleInvoices() {
    this.showInvoices.set(!this.showInvoices());
    if (this.showInvoices()) this.loadInvoices();
  }

  loadInvoices() {
    const params: string[] = ['limit=60', 'sort=' + this.invSort];
    if (this.invQ.trim()) params.push('q=' + encodeURIComponent(this.invQ.trim()));
    this.http.get<FatoraInvoice[]>(this.api('/invoices?' + params.join('&')))
      .subscribe({ next: (r) => this.invoices.set(r), error: () => {} });
  }

  setInvoiceStatus(i: FatoraInvoice) {
    const next = i.status === 'cancelled' ? 'issued' : 'cancelled';
    if (!confirm(`${next === 'cancelled' ? 'Annuler' : 'Rétablir'} la facture ${i.number} (${i.totalTtc.toLocaleString('fr-FR')} DH) ?`)) return;
    this.http.patch(this.api(`/invoices/${i.id}/status`), { status: next }).subscribe({
      next: () => { i.status = next; this.load(); },
      error: (e) => this.error.set(e?.error?.error || 'Modification impossible.')
    });
  }

  exportCsv() {
    this.http.get(this.api('/export.csv'), { responseType: 'text' }).subscribe({
      next: (csv) => {
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `fatora-comptes-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.error.set('Export impossible.')
    });
  }

  toggleInvoice(d: FatoraTenant, inv: { id: number; number: string; status: string }) {
    const next = inv.status === 'cancelled' ? 'issued' : 'cancelled';
    const verb = next === 'cancelled' ? 'Annuler' : 'Rétablir';
    if (!confirm(`${verb} la facture ${inv.number} ?`)) return;
    this.http.patch(this.api(`/invoices/${inv.id}/status`), { status: next }).subscribe({
      next: () => { inv.status = next; this.load(); },
      error: (e) => this.error.set(e?.error?.error || 'Modification impossible.')
    });
  }

  askMessage(t: FatoraTenant) {
    const text = prompt(`Message WhatsApp à ${t.company || t.phone} :`);
    if (!text || !text.trim()) return;
    this.http.post(this.api(`/tenants/${t.id}/message`), { text }).subscribe({
      next: () => alert('Message envoyé.'),
      error: (e) => alert(e?.error?.error || 'Envoi impossible.')
    });
  }
}
