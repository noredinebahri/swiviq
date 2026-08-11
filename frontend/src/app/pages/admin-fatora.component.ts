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
  invoices?: number; lastInvoiceAt?: string | null; createdAt: string;
  clients?: number;
  clientList?: { id: number; name: string; ice: string | null; invoices: number; since: string }[];
  recent?: { id: number; number: string; client: string; date: string; totalTtc: number; items: number; status: string }[];
}
interface FatoraStats {
  tenants: number; active: number; onboarding: number; trial: number; paying: number;
  exhausted: number; mrr: number; invoices: number; invoicesMonth: number; billedMonth: number;
  cancelled?: number;
}

const PLAN_OPTIONS = [
  { key: 'trial', label: 'Essai — 2 factures', price: 0 },
  { key: 'p15', label: 'TPE — 15 factures', price: 30 },
  { key: 'p30', label: 'Commerce — 30 factures', price: 50 },
  { key: 'p100', label: 'Entreprise — 100 factures', price: 90 }
];

@Component({
  selector: 'svq-admin-fatora',
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `
    <h1 class="pg-title">Fatora-Bot — abonnements</h1>

    @if (error()) { <div class="alert">{{ error() }}</div> }

    <!-- Indicateurs -->
    @if (stats(); as s) {
      <div class="kpis">
        <div class="kpi"><b>{{ s.tenants }}</b><span>Comptes</span></div>
        <div class="kpi"><b>{{ s.paying }}</b><span>Abonnés payants</span></div>
        <div class="kpi gold"><b>{{ s.mrr | number:'1.0-0' }} DH</b><span>Revenu mensuel</span></div>
        <div class="kpi"><b>{{ s.trial }}</b><span>En essai</span></div>
        <div class="kpi" [class.warn]="s.exhausted > 0"><b>{{ s.exhausted }}</b><span>Quota épuisé</span></div>
        <div class="kpi"><b>{{ s.invoicesMonth }}</b><span>Factures ce mois</span></div>
        <div class="kpi"><b>{{ s.billedMonth | number:'1.0-0' }} DH</b><span>Facturé ce mois (hors annulées)</span></div>
      </div>
    }

    <!-- Filtres -->
    <div class="bar">
      <input [(ngModel)]="q" (keyup.enter)="load()" placeholder="Rechercher : société, téléphone, ICE…" />
      <select [(ngModel)]="planFilter" (change)="load()">
        <option value="">Tous les plans</option>
        @for (p of plans; track p.key) { <option [value]="p.key">{{ p.label }}</option> }
      </select>
      <button class="btn btn--ghost btn--sm" (click)="load()">Actualiser</button>
    </div>

    <!-- Comptes -->
    <div class="card tbl-wrap">
      <table class="table">
        <thead><tr>
          <th>Entreprise</th><th>WhatsApp</th><th>Plan</th><th>Quota</th>
          <th>Factures</th><th>Dernière</th><th>Actions</th>
        </tr></thead>
        <tbody>
          @for (t of tenants(); track t.id) {
            <tr [class.dim]="t.status === 'onboarding'">
              <td>
                <strong>{{ t.company || '(inscription en cours)' }}</strong>
                <div class="meta">
                  @if (t.ice) { <span>ICE {{ t.ice }}</span> }
                  @if (t.voice) { <span class="tag">vocal</span> }
                  @if (t.hasStamp) { <span class="tag">cachet</span> }
                  @if (t.hasLogo) { <span class="tag">logo</span> }
                  @if (t.lang) { <span class="tag">{{ t.lang }}</span> }
                </div>
              </td>
              <td><code>+{{ t.phone }}</code></td>
              <td>
                <select [value]="t.plan" (change)="changePlan(t, $event)">
                  @for (p of plans; track p.key) { <option [value]="p.key">{{ p.label }}</option> }
                </select>
                <div class="meta">{{ t.price }} DH/mois</div>
              </td>
              <td>
                <div class="quota"><i [style.width.%]="pct(t)" [class.full]="t.exhausted"></i></div>
                <div class="meta">{{ t.used }} / {{ t.limit }}</div>
              </td>
              <td>{{ t.invoices || 0 }}</td>
              <td>{{ t.lastInvoiceAt ? (t.lastInvoiceAt | date:'dd/MM/yy') : '—' }}</td>
              <td class="acts">
                <button class="btn btn--ghost btn--sm" (click)="open(t)">Détail</button>
                <button class="btn btn--ghost btn--sm" (click)="askMessage(t)">Message</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="empty-td">Aucun compte</td></tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Détail -->
    @if (detail(); as d) {
      <div class="modal" (click)="detail.set(null)">
        <div class="sheet" (click)="$event.stopPropagation()">
          <button class="x" (click)="detail.set(null)">×</button>
          <h2>{{ d.company || '(sans nom)' }}</h2>
          <div class="meta big">
            +{{ d.phone }} · {{ d.planLabel }} · {{ d.used }}/{{ d.limit }} factures ce mois
          </div>

          <h3>Identité de l’entreprise</h3>
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

          <h3>Compte et usage</h3>
          <div class="grid2">
            <div><span>Statut</span><b>{{ d.status === 'active' ? 'Actif' : 'Inscription en cours' }}</b></div>
            <div><span>Inscrit le</span><b>{{ d.createdAt | date:'dd/MM/yyyy' }}</b></div>
            <div><span>Abonnement</span><b>{{ d.planLabel }} — {{ d.price }} DH/mois</b></div>
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
        </div>
      </div>
    }
  `,
  styles: [`
    .pg-title { font-size: 1.5rem; margin-bottom: 1.25rem; }
    .alert { background: #fdecea; color: #b3261e; padding: .8rem 1rem; border-radius: 10px; margin-bottom: 1rem; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .75rem; margin-bottom: 1.25rem; }
    .kpi { background: var(--c-surface, #fff); border: 1px solid var(--c-border, #e3e6ee); border-radius: 12px; padding: .9rem 1rem;
      b { display: block; font-size: 1.4rem; } span { color: var(--c-text-soft, #6b7280); font-size: .78rem; } }
    .kpi.gold b { color: #a8761c; }
    .kpi.warn b { color: #b3261e; }
    .bar { display: flex; gap: .6rem; margin-bottom: 1rem; flex-wrap: wrap;
      input { flex: 1; min-width: 220px; } input, select { padding: .55rem .7rem; border-radius: 9px; border: 1.5px solid var(--c-border, #e3e6ee); } }
    .tbl-wrap { padding: .5rem; overflow-x: auto; }
    .table td { vertical-align: top; }
    tr.dim { opacity: .62; }
    .meta { color: var(--c-text-soft, #6b7280); font-size: .74rem; margin-top: 3px; display: flex; gap: 6px; flex-wrap: wrap; }
    .meta.big { font-size: .9rem; margin-bottom: 1rem; }
    .tag { background: #eef1f7; border-radius: 999px; padding: 1px 8px; }
    code { background: #f4f5f9; padding: 2px 6px; border-radius: 6px; font-size: .82rem; }
    select { padding: .35rem .5rem; border-radius: 8px; border: 1.5px solid var(--c-border, #e3e6ee); font-size: .85rem; }
    .quota { width: 90px; height: 7px; background: #eef1f7; border-radius: 6px; overflow: hidden;
      i { display: block; height: 100%; background: #2f9e6d; } i.full { background: #b3261e; } }
    .acts { display: flex; gap: .4rem; flex-wrap: wrap; }
    .empty-td { text-align: center; color: var(--c-text-soft, #6b7280); padding: 1.5rem; }
    .modal { position: fixed; inset: 0; background: rgba(10,12,20,.45); display: grid; place-items: center; z-index: 90; padding: 16px; }
    .sheet { position: relative; background: #fff; border-radius: 16px; padding: 26px; max-width: 640px; width: 100%; max-height: 86vh; overflow: auto;
      h2 { margin: 0 0 4px; } h3 { margin: 18px 0 8px; font-size: 1rem; } }
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
  `]
})
export class AdminFatoraComponent implements OnInit {
  private http = inject(HttpClient);
  private base = inject(API_BASE);
  private seo = inject(SeoService);

  readonly plans = PLAN_OPTIONS;
  stats = signal<FatoraStats | null>(null);
  tenants = signal<FatoraTenant[]>([]);
  detail = signal<FatoraTenant | null>(null);
  error = signal<string>('');
  q = '';
  planFilter = '';

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
    if (this.planFilter) params.push('plan=' + this.planFilter);
    this.http.get<FatoraTenant[]>(this.api('/tenants' + (params.length ? '?' + params.join('&') : '')))
      .subscribe({ next: (t) => this.tenants.set(t), error: () => {} });
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
    this.http.get<FatoraTenant>(this.api(`/tenants/${t.id}`))
      .subscribe({ next: (d) => this.detail.set(d), error: () => {} });
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
