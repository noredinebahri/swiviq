import { Component, computed, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TPipe } from '../core/i18n/i18n.service';
import { SeoService } from '../core/seo.service';
import { AuthService } from '../core/auth.service';
import { ApiService, Invoice, Product, Plan, ProductPhoto, Subscriber, Quote } from '../core/api.service';
import { ToastService } from '../core/toast.service';
import { LogoComponent } from '../shared/svg';
import { API_BASE } from '../core/api-base';

/* ===================== LOGIN ===================== */
@Component({
  selector: 'svq-admin-login',
  imports: [FormsModule, TPipe, LogoComponent],
  template: `
    <div class="login">
      <form class="card login__box" (submit)="submit($event)">
        <svq-logo [size]="36" />
        <h1>{{ 'admin.login' | t }}</h1>
        <div class="field">
          <label for="a-email">{{ 'admin.email' | t }}</label>
          <input id="a-email" type="email" [(ngModel)]="email" name="email" required autocomplete="username" />
        </div>
        <div class="field">
          <label for="a-pass">{{ 'admin.password' | t }}</label>
          <input id="a-pass" type="password" [(ngModel)]="password" name="password" required autocomplete="current-password" />
        </div>
        @if (error()) { <p class="err">{{ 'admin.loginError' | t }}</p> }
        <button class="btn btn--primary" type="submit" [disabled]="loading()">
          @if (loading()) { <span class="spinner"></span> } @else { {{ 'admin.signin' | t }} }
        </button>
      </form>
    </div>
  `,
  styles: [`
    .login { min-height: 100vh; display: grid; place-items: center; background: var(--c-ink); padding: 1.5rem; }
    .login__box { width: min(400px, 100%); padding: 2.5rem; display: flex; flex-direction: column; gap: .4rem; }
    .login__box h1 { font-size: 1.3rem; margin: 1rem 0 1.4rem; }
    .err { color: var(--c-danger); font-size: .88rem; margin-bottom: .8rem; }
    .btn { width: 100%; }
  `],
})
export class AdminLoginComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private seo = inject(SeoService);

  email = '';
  password = '';
  loading = signal(false);
  error = signal(false);

  ngOnInit() { this.seo.noIndex('Admin — SWIVIQ'); }

  submit(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    this.error.set(false);
    // Les espaces collés par un copier-coller ne doivent pas faire échouer la connexion
    this.api.login(this.email.trim(), this.password.trim()).subscribe({
      next: res => { this.auth.setToken(res.token); this.router.navigateByUrl('/admin'); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}

/* ===================== LAYOUT ===================== */
@Component({
  selector: 'svq-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TPipe, LogoComponent],
  template: `
    <div class="adm">
      <!-- Barre mobile : logo + burger. Cachée sur desktop. -->
      <header class="adm__topbar">
        <a routerLink="/" class="adm__logo"><svq-logo [size]="26" variant="white" /></a>
        <button class="adm__burger" (click)="menuOpen.set(!menuOpen())"
                [attr.aria-expanded]="menuOpen()" aria-label="Menu">
          @if (menuOpen()) { ✕ } @else { ☰ }
        </button>
      </header>

      @if (menuOpen()) {
        <div class="adm__backdrop" (click)="menuOpen.set(false)"></div>
      }

      <aside class="adm__side" [class.open]="menuOpen()">
        <a routerLink="/" class="adm__logo adm__logo--side"><svq-logo [size]="28" variant="white" /></a>
        <nav (click)="menuOpen.set(false)">
          <a routerLink="/admin" routerLinkActive="on" [routerLinkActiveOptions]="{exact:true}">{{ 'admin.dashboard' | t }}</a>
          <a routerLink="/admin/devis" routerLinkActive="on">{{ 'admin.quotes' | t }}</a>
          <a routerLink="/admin/factures" routerLinkActive="on">{{ 'admin.invoices' | t }}</a>
          <a routerLink="/admin/produits" routerLinkActive="on">{{ 'admin.products' | t }}</a>
          <a routerLink="/admin/abonnés" routerLinkActive="on">{{ 'admin.subscribers' | t }}</a>
          <a routerLink="/admin/fatora" routerLinkActive="on" [routerLinkActiveOptions]="{exact:true}">Fatora-Bot</a>
          <a routerLink="/admin/fatora/supervision" routerLinkActive="on">Supervision</a>
          <a routerLink="/admin/generer" routerLinkActive="on">{{ 'admin.generateDoc' | t }}</a>
          <a routerLink="/admin/parametres" routerLinkActive="on">{{ 'admin.settings' | t }}</a>
        </nav>
        <button class="adm__logout" (click)="logout()">{{ 'admin.logout' | t }}</button>
      </aside>

      <main class="adm__main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .adm { display: grid; grid-template-columns: 230px 1fr; min-height: 100vh; background: var(--c-surface); }
    .adm__topbar { display: none; }
    .adm__backdrop { display: none; }
    .adm__side {
      background: var(--c-ink); padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 2rem;
      position: sticky; top: 0; height: 100vh;
    }
    .adm__logo { padding-inline: .6rem; }
    .adm__side nav { display: flex; flex-direction: column; gap: .3rem; flex: 1; overflow-y: auto; }
    .adm__side nav a {
      padding: .7rem .9rem; border-radius: 10px; color: var(--c-text-inverse-soft);
      font-weight: 600; font-size: .92rem; transition: .2s;
    }
    .adm__side nav a:hover { color: #fff; background: rgba(255,255,255,.06); }
    .adm__side nav a.on { color: #fff; background: var(--grad-brand); }
    .adm__logout { color: var(--c-text-inverse-soft); text-align: start; padding: .7rem .9rem; font-size: .9rem; }
    .adm__logout:hover { color: #fff; }
    /* min-width: 0 — sans lui, la colonne 1fr refuse de rétrécir sous la
       largeur des tableaux et TOUTES les pages débordent sur mobile. */
    .adm__main { padding: 2rem; min-width: 0; }

    @media (max-width: 900px) {
      .adm { display: block; }
      .adm__topbar {
        display: flex; align-items: center; justify-content: space-between;
        background: var(--c-ink); padding: .7rem 1rem;
        position: sticky; top: 0; z-index: 60;
      }
      .adm__burger {
        color: #fff; font-size: 1.35rem; line-height: 1; padding: .3rem .6rem;
        background: rgba(255,255,255,.08); border-radius: 8px;
      }
      .adm__backdrop {
        display: block; position: fixed; inset: 0; z-index: 55;
        background: rgba(0,0,0,.45);
      }
      .adm__side {
        position: fixed; top: 0; left: 0; z-index: 58; height: 100dvh;
        width: min(280px, 82vw); transform: translateX(-100%);
        transition: transform .22s ease; box-shadow: 8px 0 30px rgba(0,0,0,.35);
      }
      .adm__side.open { transform: translateX(0); }
      .adm__logo--side { margin-top: .2rem; }
      .adm__main { padding: 1rem; }
    }
  `],
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  menuOpen = signal(false);
  logout() { this.auth.logout(); this.router.navigateByUrl('/admin/login'); }
}

/* ===================== DASHBOARD ===================== */
interface FatoraStatsLite {
  tenants: number; paying: number; mrr: number; trial: number;
  exhausted: number; expiringSoon?: number; expired?: number; suspended?: number;
  invoicesMonth: number; billedMonth: number; cancelled?: number;
}

/**
 * Poste de pilotage — remplace la grille de sept compteurs qui laissait
 * l'écran d'accueil aux trois quarts vide. Tout est cliquable : un chiffre
 * mène toujours à l'écran qui permet d'agir dessus.
 */
@Component({
  selector: 'svq-admin-dashboard',
  imports: [DecimalPipe, DatePipe, RouterLink],
  template: `
    <div class="dash-head">
      <div>
        <h1 class="pg-title">Tableau de bord</h1>
        <p class="dash-date">{{ todayLabel }}</p>
      </div>
      <a class="btn btn--primary" routerLink="/admin/generer">Générer un document</a>
    </div>

    <!-- Ligne 1 : les quatre chiffres qui comptent -->
    <div class="hero-grid">
      <a class="card hero" routerLink="/admin/factures">
        <span class="hero-label">CA encaissé</span>
        <strong class="hero-value">{{ revenuePaid() | number:'1.0-0' }} <small>MAD</small></strong>
        <span class="hero-sub ok">{{ paidCount() }} facture(s) payée(s)</span>
      </a>
      <a class="card hero" routerLink="/admin/factures" [class.hero--warn]="unpaidTotal() > 0">
        <span class="hero-label">À encaisser</span>
        <strong class="hero-value">{{ unpaidTotal() | number:'1.0-0' }} <small>MAD</small></strong>
        <span class="hero-sub" [class.warn]="unpaidCount() > 0">{{ unpaidCount() }} facture(s) en attente</span>
      </a>
      <a class="card hero" routerLink="/admin/devis" [class.hero--warn]="newCount() > 0">
        <span class="hero-label">Devis à traiter</span>
        <strong class="hero-value">{{ newCount() }}</strong>
        <span class="hero-sub">sur {{ quotes().length }} devis reçus</span>
      </a>
      <a class="card hero hero--gold" routerLink="/admin/fatora">
        <span class="hero-label">Fatora-Bot — revenu mensuel</span>
        <strong class="hero-value">{{ (fatora()?.mrr ?? 0) | number:'1.0-0' }} <small>DH</small></strong>
        <span class="hero-sub">{{ fatora()?.paying ?? 0 }} payant(s) / {{ fatora()?.tenants ?? 0 }} comptes</span>
      </a>
    </div>

    <!-- Ligne 2 : facturation 6 mois + derniers devis -->
    <div class="two-col">
      <div class="card panel">
        <div class="panel-head">
          <h2>Facturation — 6 derniers mois</h2>
          <a routerLink="/admin/factures" class="see-all">Toutes les factures →</a>
        </div>
        @if (chart().max > 0) {
          <svg class="chart" viewBox="0 0 600 230" preserveAspectRatio="none" role="img"
               aria-label="Montants facturés par mois">
            @for (m of chart().months; track m.key; let i = $index) {
              <g>
                <rect [attr.x]="20 + i * 97" [attr.y]="180 - m.hTotal" width="34" [attr.height]="m.hTotal"
                      rx="5" class="bar-total" />
                <rect [attr.x]="20 + i * 97 + 40" [attr.y]="180 - m.hPaid" width="34" [attr.height]="m.hPaid"
                      rx="5" class="bar-paid" />
                <text [attr.x]="20 + i * 97 + 37" y="200" text-anchor="middle" class="axis">{{ m.label }}</text>
                <text [attr.x]="20 + i * 97 + 37" [attr.y]="172 - (m.hTotal > m.hPaid ? m.hTotal : m.hPaid)"
                      text-anchor="middle" class="val">{{ m.total | number:'1.0-0' }}</text>
              </g>
            }
          </svg>
          <div class="legend">
            <span><i class="dot dot-total"></i> Facturé TTC</span>
            <span><i class="dot dot-paid"></i> Encaissé</span>
          </div>
        } @else {
          <p class="empty">Aucune facture sur les six derniers mois.
            <a routerLink="/admin/generer">Créer la première →</a></p>
        }
      </div>

      <div class="card panel">
        <div class="panel-head">
          <h2>Derniers devis</h2>
          <a routerLink="/admin/devis" class="see-all">Tout voir →</a>
        </div>
        @if (recentQuotes().length) {
          <ul class="rows">
            @for (q of recentQuotes(); track q.id) {
              <li>
                <div class="row-main">
                  <strong>{{ q.number }}</strong>
                  <span class="row-client">{{ q.customer.name }}</span>
                </div>
                <div class="row-side">
                  <span class="row-amount">{{ q.totalTTC | number:'1.0-0' }} MAD</span>
                  <span [class]="'chip chip--' + chipTone(q.status)">{{ chipLabel(q.status) }}</span>
                </div>
              </li>
            }
          </ul>
        } @else {
          <p class="empty">Aucun devis pour le moment. Ils arrivent du formulaire du site.</p>
        }
      </div>
    </div>

    <!-- Ligne 3 : dernières factures + santé Fatora -->
    <div class="two-col">
      <div class="card panel">
        <div class="panel-head">
          <h2>Dernières factures</h2>
          <a routerLink="/admin/factures" class="see-all">Tout voir →</a>
        </div>
        @if (recentInvoices().length) {
          <ul class="rows">
            @for (f of recentInvoices(); track f.id) {
              <li>
                <div class="row-main">
                  <strong>{{ f.number }}</strong>
                  <span class="row-client">{{ f.customer.name }}</span>
                </div>
                <div class="row-side">
                  <span class="row-amount">{{ f.totalTTC | number:'1.0-0' }} MAD</span>
                  <span [class]="f.status === 'paid' ? 'chip chip--ok' : 'chip chip--warn'">
                    {{ f.status === 'paid' ? 'Payée' : 'En attente' }}
                  </span>
                </div>
              </li>
            }
          </ul>
        } @else {
          <p class="empty">Aucune facture émise pour l'instant.</p>
        }
      </div>

      <div class="card panel">
        <div class="panel-head">
          <h2>Fatora-Bot — santé</h2>
          <a routerLink="/admin/fatora" class="see-all">Gérer →</a>
        </div>
        @if (fatora(); as f) {
          <ul class="health">
            <li><span>En période d'essai</span><b>{{ f.trial }}</b></li>
            <li [class.alert]="f.exhausted > 0"><span>Quota épuisé</span><b>{{ f.exhausted }}</b></li>
            <li [class.alert]="(f.expiringSoon || 0) > 0"><span>Échéance sous 7 jours</span><b>{{ f.expiringSoon || 0 }}</b></li>
            <li [class.alert]="(f.expired || 0) > 0"><span>Abonnements expirés</span><b>{{ f.expired || 0 }}</b></li>
            <li><span>Factures émises ce mois</span><b>{{ f.invoicesMonth }}</b></li>
            <li><span>Facturé ce mois</span><b>{{ f.billedMonth | number:'1.0-0' }} DH</b></li>
          </ul>
          @if (f.exhausted > 0 || (f.expiringSoon || 0) > 0) {
            <p class="hint">Des clients sont à relancer — c'est du revenu qui attend.</p>
          }
        } @else {
          <p class="empty">Connexion à Fatora-Bot…</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .dash-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem;
      flex-wrap: wrap; margin-bottom: 1.6rem; }
    .pg-title { font-size: 1.5rem; margin: 0; }
    .dash-date { color: var(--c-text-soft); font-size: .9rem; margin: .3rem 0 0; text-transform: capitalize; }

    .hero-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 1rem; margin-bottom: 1.2rem; }
    .hero { display: flex; flex-direction: column; gap: .45rem; padding: 1.3rem 1.4rem;
      text-decoration: none; transition: transform .15s, box-shadow .15s; }
    .hero:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(15,15,15,.10); }
    .hero-label { font-size: .78rem; font-weight: 700; letter-spacing: .06em;
      text-transform: uppercase; color: var(--c-text-soft); }
    .hero-value { font-family: var(--font-display); font-size: 1.9rem; color: var(--c-primary); line-height: 1.1; }
    .hero-value small { font-size: .85rem; color: var(--c-text-soft); font-weight: 600; }
    .hero-sub { font-size: .82rem; color: var(--c-text-soft); }
    .hero-sub.ok { color: var(--c-success); }
    .hero-sub.warn { color: #b45309; font-weight: 600; }
    .hero--warn { border: 1px solid #f6c98f; background: #fffaf3; }
    .hero--gold .hero-value { color: #b8860b; }

    .two-col { display: grid; grid-template-columns: 1.25fr 1fr; gap: 1rem; margin-bottom: 1.2rem; }
    @media (max-width: 980px) { .two-col { grid-template-columns: 1fr; } }
    .panel { padding: 1.2rem 1.4rem; }
    .panel-head { display: flex; justify-content: space-between; align-items: baseline;
      gap: 1rem; margin-bottom: .9rem; }
    .panel-head h2 { font-size: 1.02rem; margin: 0; }
    .see-all { font-size: .82rem; color: var(--c-primary); text-decoration: none; font-weight: 600;
      white-space: nowrap; }

    .chart { width: 100%; height: 215px; }
    .bar-total { fill: var(--c-primary-300); opacity: .55; }
    .bar-paid { fill: var(--c-success); }
    .axis { font-size: 12px; fill: var(--c-text-soft); }
    .val { font-size: 10.5px; fill: var(--c-text-soft); }
    .legend { display: flex; gap: 1.2rem; font-size: .8rem; color: var(--c-text-soft); margin-top: .3rem; }
    .dot { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: .35rem; }
    .dot-total { background: var(--c-primary-300); opacity: .55; }
    .dot-paid { background: var(--c-success); }

    .rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .rows li { display: flex; justify-content: space-between; align-items: center; gap: 1rem;
      padding: .65rem 0; border-bottom: 1px solid rgba(15,15,15,.06); }
    .rows li:last-child { border-bottom: 0; }
    .row-main { display: flex; flex-direction: column; gap: .1rem; min-width: 0; }
    .row-main strong { font-size: .88rem; }
    .row-client { font-size: .8rem; color: var(--c-text-soft); overflow: hidden;
      text-overflow: ellipsis; white-space: nowrap; max-width: 190px; }
    .row-side { display: flex; align-items: center; gap: .7rem; flex-shrink: 0; }
    .row-amount { font-size: .86rem; font-weight: 700; }

    .chip { font-size: .7rem; font-weight: 700; padding: .22rem .55rem; border-radius: 999px;
      letter-spacing: .02em; white-space: nowrap; }
    .chip--new { background: #ede9fe; color: #5b21b6; }
    .chip--ok { background: #d1fae5; color: #065f46; }
    .chip--info { background: #dbeafe; color: #1e40af; }
    .chip--warn { background: #fef3c7; color: #92400e; }
    .chip--muted { background: #f1f2f4; color: #6b7280; }

    .health { list-style: none; margin: 0; padding: 0; }
    .health li { display: flex; justify-content: space-between; padding: .55rem 0;
      border-bottom: 1px solid rgba(15,15,15,.06); font-size: .88rem; }
    .health li:last-child { border-bottom: 0; }
    .health li span { color: var(--c-text-soft); }
    .health li b { font-weight: 700; }
    .health li.alert span, .health li.alert b { color: #b45309; }
    .hint { margin: .8rem 0 0; font-size: .82rem; color: #b45309; background: #fffaf3;
      border-radius: 8px; padding: .55rem .8rem; }

    .empty { color: var(--c-text-soft); font-size: .9rem; padding: 1.4rem 0; text-align: center; }
    .empty a { color: var(--c-primary); font-weight: 600; text-decoration: none; }
  `],
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  private http = inject(HttpClient);
  private base = inject(API_BASE);

  readonly todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  quotes = signal<Quote[]>([]);
  invoices = signal<Invoice[]>([]);
  fatora = signal<FatoraStatsLite | null>(null);

  newCount = computed(() => this.quotes().filter(q => q.status === 'new').length);
  paidCount = computed(() => this.invoices().filter(i => i.status === 'paid').length);
  revenuePaid = computed(() => this.invoices().filter(i => i.status === 'paid')
    .reduce((s, i) => s + Number(i.totalTTC || 0), 0));
  unpaidCount = computed(() => this.invoices().filter(i => i.status !== 'paid' && i.status !== 'cancelled').length);
  unpaidTotal = computed(() => this.invoices().filter(i => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((s, i) => s + Number(i.totalTTC || 0), 0));

  recentQuotes = computed(() => [...this.quotes()]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5));
  recentInvoices = computed(() => [...this.invoices()]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5));

  /** Six derniers mois de facturation, prêts à dessiner (hauteurs en pixels SVG). */
  chart = computed(() => {
    const now = new Date();
    const months: { key: string; label: string; total: number; paid: number; hTotal: number; hPaid: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString('fr-FR', { month: 'short' }),
        total: 0, paid: 0, hTotal: 0, hPaid: 0,
      });
    }
    const index = new Map(months.map((m, i) => [m.key, i] as const));
    for (const inv of this.invoices()) {
      if (inv.status === 'cancelled') continue;
      const d = new Date(inv.createdAt);
      const idx = index.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (idx === undefined) continue;
      const amount = Number(inv.totalTTC || 0);
      months[idx].total += amount;
      if (inv.status === 'paid') months[idx].paid += amount;
    }
    const max = Math.max(...months.map(m => m.total), 0);
    if (max > 0) {
      for (const m of months) {
        m.hTotal = Math.round((m.total / max) * 150);
        m.hPaid = Math.round((m.paid / max) * 150);
      }
    }
    return { months, max };
  });

  chipLabel(status: string): string {
    const map: Record<string, string> = {
      new: 'Nouveau', sent: 'Envoyé', accepted: 'Accepté',
      rejected: 'Refusé', expired: 'Expiré', invoiced: 'Facturé',
    };
    return map[status] || status;
  }
  chipTone(status: string): string {
    const map: Record<string, string> = {
      new: 'new', sent: 'info', accepted: 'ok', invoiced: 'ok',
      rejected: 'muted', expired: 'muted',
    };
    return map[status] || 'muted';
  }

  ngOnInit() {
    this.seo.noIndex('Dashboard — SWIVIQ Admin');
    this.api.adminQuotes().subscribe({ next: q => this.quotes.set(q), error: () => {} });
    this.api.adminInvoices().subscribe({ next: i => this.invoices.set(i), error: () => {} });
    this.http.get<FatoraStatsLite>(`${this.base}/api/admin/fatora/stats`)
      .subscribe({ next: s => this.fatora.set(s), error: () => {} });
  }
}

/* ===================== QUOTES ===================== */
@Component({
  selector: 'svq-admin-quotes',
  imports: [DatePipe, DecimalPipe, TPipe],
  template: `
    <div class="page-head">
      <h1 class="pg-title">{{ 'admin.quotes' | t }}</h1>
      <span class="count">{{ filtered().length }} / {{ quotes().length }}</span>
    </div>
    <div class="toolbar">
      <input class="search" type="search" placeholder="Rechercher : client, email, numéro…"
             [value]="search()" (input)="search.set($any($event.target).value)" />
      <select class="filter" [value]="statusFilter()" (change)="statusFilter.set($any($event.target).value)">
        <option value="">Tous les statuts</option>
        @for (st of statuses; track st) {
          <option [value]="st">{{ 'admin.statuses.' + st | t }}</option>
        }
      </select>
    </div>
    <div class="card tbl-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>{{ 'admin.number' | t }}</th><th>{{ 'admin.client' | t }}</th><th>{{ 'admin.date' | t }}</th>
            <th>{{ 'admin.amount' | t }}</th><th>{{ 'admin.status' | t }}</th><th>{{ 'admin.actions' | t }}</th>
          </tr>
        </thead>
        <tbody>
          @for (q of filtered(); track q.id) {
            <tr>
              <td><strong>{{ q.number }}</strong></td>
              <td>{{ q.customer.name }}<br /><small>{{ q.customer.email }}</small></td>
              <td>{{ q.createdAt | date:'dd/MM/yyyy' }}</td>
              <td>{{ q.totalTTC | number:'1.2-2' }} MAD</td>
              <td>
                <select class="chip-select" [class]="'chip-select st-' + q.status"
                        [value]="q.status" (change)="setStatus(q, $event)">
                  @for (s of statuses; track s) {
                    <option [value]="s" [selected]="q.status === s">{{ 'admin.statuses.' + s | t }}</option>
                  }
                </select>
              </td>
              <td class="acts">
                <a class="btn btn--ghost btn--sm" [href]="pdf(q)" target="_blank" rel="noopener">{{ 'admin.pdf' | t }}</a>
                <button class="btn btn--primary btn--sm" (click)="invoice(q)" [disabled]="busy()">{{ 'admin.createInvoice' | t }}</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty-td">Aucun devis ne correspond à cette recherche.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-head { display: flex; align-items: baseline; gap: .8rem; margin-bottom: 1rem; }
    .pg-title { font-size: 1.5rem; margin: 0; }
    .count { font-size: .82rem; font-weight: 700; color: var(--c-text-soft);
      background: #eef0f4; border-radius: 999px; padding: .25rem .7rem; }
    .toolbar { display: flex; gap: .7rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .search { flex: 1; min-width: 220px; padding: .6rem .9rem; border: 1.5px solid var(--c-border);
      border-radius: 10px; font-size: .9rem; }
    .filter { padding: .6rem .8rem; border: 1.5px solid var(--c-border); border-radius: 10px; font-size: .9rem; }
    .tbl-wrap { padding: .5rem; overflow-x: auto; }
    .table tbody tr:hover { background: #fafbfd; }
    .acts { display: flex; gap: .5rem; }
    .chip-select { padding: .35rem .6rem; border-radius: 999px; border: 1.5px solid var(--c-border);
      font-size: .8rem; font-weight: 700; cursor: pointer; }
    .chip-select.st-new { background: #ede9fe; color: #5b21b6; border-color: #ddd3fb; }
    .chip-select.st-sent { background: #dbeafe; color: #1e40af; border-color: #c4dafc; }
    .chip-select.st-accepted { background: #d1fae5; color: #065f46; border-color: #a7ecd1; }
    .chip-select.st-rejected { background: #f1f2f4; color: #6b7280; border-color: #e2e4e8; }
    small { color: var(--c-text-soft); }
    .empty-td { text-align: center; color: var(--c-text-soft); padding: 2rem; }
  `],
})
export class AdminQuotesComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private seo = inject(SeoService);
  private router = inject(Router);
  private apiBase = inject(API_BASE);
  quotes = signal<Quote[]>([]);
  busy = signal(false);
  statuses = ['new', 'sent', 'accepted', 'rejected'];
  search = signal('');
  statusFilter = signal('');
  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const st = this.statusFilter();
    return this.quotes().filter(x =>
      (!st || x.status === st) &&
      (!q || `${x.number} ${x.customer.name} ${x.customer.email}`.toLowerCase().includes(q)));
  });

  ngOnInit() {
    this.seo.noIndex('Devis — SWIVIQ Admin');
    this.api.adminQuotes().subscribe({ next: q => this.quotes.set(q), error: () => {} });
  }

  setStatus(q: Quote, e: Event) {
    const status = (e.target as HTMLSelectElement).value;
    this.api.updateQuoteStatus(q.id, status).subscribe({
      next: updated => this.quotes.update(list => list.map(x => x.id === q.id ? { ...x, status: updated.status } : x)),
      error: () => {},
    });
  }

  pdf(q: Quote) {
    return `${this.apiBase}/api/quotes/${q.id}/pdf?token=${q.publicToken}`;
  }

  invoice(q: Quote) {
    this.busy.set(true);
    this.api.createInvoiceFromQuote(q.id).subscribe({
      next: () => { this.busy.set(false); this.router.navigateByUrl('/admin/factures'); },
      error: () => this.busy.set(false),
    });
  }
}

/* ===================== INVOICES ===================== */
@Component({
  selector: 'svq-admin-invoices',
  imports: [DatePipe, DecimalPipe, TPipe],
  template: `
    <div class="page-head">
      <h1 class="pg-title">{{ 'admin.invoices' | t }}</h1>
      <span class="count">{{ filtered().length }} / {{ invoices().length }}</span>
    </div>
    <div class="toolbar">
      <input class="search" type="search" placeholder="Rechercher : client, numéro…"
             [value]="search()" (input)="search.set($any($event.target).value)" />
      <select class="filter" [value]="statusFilter()" (change)="statusFilter.set($any($event.target).value)">
        <option value="">Tous les statuts</option>
        <option value="paid">Payée</option>
        <option value="sent">Envoyée</option>
        <option value="draft">Brouillon</option>
      </select>
    </div>
    <div class="totals">
      <span>Total : <b>{{ totalAll() | number:'1.0-0' }} MAD</b></span>
      <span class="ok">Encaissé : <b>{{ totalPaid() | number:'1.0-0' }} MAD</b></span>
      <span class="warn">En attente : <b>{{ totalDue() | number:'1.0-0' }} MAD</b></span>
    </div>
    <div class="card tbl-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>{{ 'admin.number' | t }}</th><th>{{ 'admin.client' | t }}</th><th>{{ 'admin.date' | t }}</th>
            <th>{{ 'admin.amount' | t }}</th><th>{{ 'admin.status' | t }}</th><th>{{ 'admin.actions' | t }}</th>
          </tr>
        </thead>
        <tbody>
          @for (inv of filtered(); track inv.id) {
            <tr>
              <td><strong>{{ inv.number }}</strong></td>
              <td>{{ inv.customer.name }}</td>
              <td>{{ inv.createdAt | date:'dd/MM/yyyy' }}</td>
              <td>{{ inv.totalTTC | number:'1.2-2' }} MAD</td>
              <td><span [class]="'chip st-' + inv.status">{{ 'admin.statuses.' + inv.status | t }}</span></td>
              <td class="acts">
                <button class="btn btn--ghost btn--sm" (click)="openPdf(inv)">{{ 'admin.pdf' | t }}</button>
                @if (inv.status === 'draft') {
                  <button class="btn btn--ghost btn--sm" (click)="setStatus(inv, 'sent')">{{ 'admin.markSent' | t }}</button>
                }
                @if (inv.status !== 'paid') {
                  <button class="btn btn--primary btn--sm" (click)="setStatus(inv, 'paid')">{{ 'admin.markPaid' | t }}</button>
                }
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty-td">Aucune facture ne correspond à cette recherche.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-head { display: flex; align-items: baseline; gap: .8rem; margin-bottom: 1rem; }
    .pg-title { font-size: 1.5rem; margin: 0; }
    .count { font-size: .82rem; font-weight: 700; color: var(--c-text-soft);
      background: #eef0f4; border-radius: 999px; padding: .25rem .7rem; }
    .toolbar { display: flex; gap: .7rem; margin-bottom: .8rem; flex-wrap: wrap; }
    .search { flex: 1; min-width: 220px; padding: .6rem .9rem; border: 1.5px solid var(--c-border);
      border-radius: 10px; font-size: .9rem; }
    .filter { padding: .6rem .8rem; border: 1.5px solid var(--c-border); border-radius: 10px; font-size: .9rem; }
    .totals { display: flex; gap: 1.2rem; flex-wrap: wrap; margin-bottom: 1rem; font-size: .88rem;
      color: var(--c-text-soft); }
    .totals b { color: inherit; }
    .totals .ok { color: var(--c-success); }
    .totals .warn { color: #b45309; }
    .tbl-wrap { padding: .5rem; overflow-x: auto; }
    .table tbody tr:hover { background: #fafbfd; }
    .acts { display: flex; gap: .5rem; flex-wrap: wrap; }
    .chip { font-size: .74rem; font-weight: 700; padding: .28rem .65rem; border-radius: 999px; }
    .chip.st-paid { background: #d1fae5; color: #065f46; }
    .chip.st-sent { background: #dbeafe; color: #1e40af; }
    .chip.st-draft { background: #f1f2f4; color: #6b7280; }
    .chip.st-cancelled { background: #fee2e2; color: #991b1b; }
    .empty-td { text-align: center; color: var(--c-text-soft); padding: 2rem; }
  `],
})
export class AdminInvoicesComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private seo = inject(SeoService);
  private apiBase = inject(API_BASE);
  invoices = signal<Invoice[]>([]);
  search = signal('');
  statusFilter = signal('');
  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    const st = this.statusFilter();
    return this.invoices().filter(x =>
      (!st || x.status === st) &&
      (!q || `${x.number} ${x.customer.name} ${x.customer.email}`.toLowerCase().includes(q)));
  });
  totalAll = computed(() => this.filtered().reduce((t, i) => t + Number(i.totalTTC || 0), 0));
  totalPaid = computed(() => this.filtered().filter(i => i.status === 'paid')
    .reduce((t, i) => t + Number(i.totalTTC || 0), 0));
  totalDue = computed(() => this.filtered().filter(i => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((t, i) => t + Number(i.totalTTC || 0), 0));

  ngOnInit() {
    this.seo.noIndex('Factures — SWIVIQ Admin');
    this.load();
  }
  load() { this.api.adminInvoices().subscribe({ next: i => this.invoices.set(i), error: () => {} }); }

  setStatus(inv: Invoice, status: string) {
    this.api.updateInvoiceStatus(inv.id, status).subscribe({ next: () => this.load(), error: () => {} });
  }

  openPdf(inv: Invoice) {
    // authenticated fetch → blob (PDF endpoint requires JWT)
    fetch(`${this.apiBase}/api/invoices/${inv.id}/pdf`, {
      headers: { Authorization: `Bearer ${this.auth.token()}` },
    })
      .then(r => r.blob())
      .then(b => window.open(URL.createObjectURL(b), '_blank'));
  }
}

/* ===================== SETTINGS ===================== */
@Component({
  selector: 'svq-admin-settings',
  imports: [FormsModule, TPipe],
  template: `
    <h1 class="pg-title">{{ 'admin.settings' | t }}</h1>
    @if (settings(); as s) {
      <form (submit)="save($event)">
        <div class="card blk">
          <h2>{{ 'admin.pricingTitle' | t }} — {{ 'admin.baseServices' | t }}</h2>
          @for (svc of s.pricing.services; track svc.id; let i = $index) {
            <div class="row">
              <input [(ngModel)]="svc.label" [name]="'sl-' + svc.id" class="grow"
                     [class.invalid]="invalidFields().has('pricing.services.' + i + '.label')"
                     (ngModelChange)="clearInvalid('pricing.services.' + i + '.label')" />
              <input type="number" [(ngModel)]="svc.basePrice" [name]="'sp-' + svc.id" min="0" step="100"
                     [class.invalid]="invalidFields().has('pricing.services.' + i + '.basePrice')"
                     (ngModelChange)="clearInvalid('pricing.services.' + i + '.basePrice')" />
            </div>
          }
        </div>

        <div class="card blk">
          <h2>{{ 'admin.options' | t }}</h2>
          @for (opt of s.pricing.options; track opt.id; let i = $index) {
            <div class="row">
              <input [(ngModel)]="opt.label" [name]="'ol-' + opt.id" class="grow"
                     [class.invalid]="invalidFields().has('pricing.options.' + i + '.label')"
                     (ngModelChange)="clearInvalid('pricing.options.' + i + '.label')" />
              <input type="number" [(ngModel)]="opt.price" [name]="'op-' + opt.id" min="0" step="100"
                     [class.invalid]="invalidFields().has('pricing.options.' + i + '.price')"
                     (ngModelChange)="clearInvalid('pricing.options.' + i + '.price')" />
            </div>
          }
        </div>

        <div class="card blk">
          <h2>{{ 'admin.companyTitle' | t }}</h2>
          <div class="grid grid-2">
            @for (f of companyFields; track f.key) {
              <div class="field">
                <label [class.invalid-label]="invalidFields().has('company.' + f.key)">{{ f.label }}</label>
                <input [(ngModel)]="s.company[f.key]" [name]="'c-' + f.key"
                       [class.invalid]="invalidFields().has('company.' + f.key)"
                       (ngModelChange)="clearInvalid('company.' + f.key)" />
              </div>
            }
          </div>
        </div>

        @if (saved()) { <p class="ok">{{ 'admin.saved' | t }}</p> }
        <button class="btn btn--primary" type="submit" [disabled]="busy()">{{ 'admin.save' | t }}</button>
      </form>
    } @else {
      <div class="spinner"></div>
    }
  `,
  styles: [`
    .pg-title { font-size: 1.5rem; margin-bottom: 1.5rem; }
    .blk { margin-bottom: 1.5rem; }
    .blk h2 { font-size: 1.05rem; margin-bottom: 1rem; }
    .row { display: flex; gap: .8rem; margin-bottom: .6rem; flex-wrap: wrap; }
    .row input { padding: .55rem .8rem; border: 1.5px solid var(--c-border); border-radius: 8px; min-width: 0; }
    .row input[type=number] { width: 130px; flex-shrink: 0; }
    .row .grow { flex: 1 1 200px; }
    .grow { flex: 1; }
    .ok { color: var(--c-success); font-weight: 600; margin-bottom: 1rem; }
    input.invalid {
      border-color: var(--c-danger) !important;
      background: rgba(239, 68, 68, .07);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, .15);
    }
    label.invalid-label { color: var(--c-danger); }
  `],
})
export class AdminSettingsComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  private toast = inject(ToastService);
  settings = signal<any | null>(null);
  busy = signal(false);
  saved = signal(false);
  invalidFields = signal<Set<string>>(new Set());
  companyFields: { key: string; label: string }[] = [
    { key: 'raisonSociale', label: 'Raison sociale' },
    { key: 'email', label: 'Email' },
    { key: 'site', label: 'Site web' },
    { key: 'siegeSocial', label: 'Siège social' },
    { key: 'ice', label: 'ICE' },
    { key: 'identifiantFiscal', label: 'IF' },
    { key: 'rc', label: 'RC' },
    { key: 'rcTribunal', label: 'Tribunal RC' },
    { key: 'taxeProfessionnelle', label: 'Taxe professionnelle' },
    { key: 'capital', label: 'Capital' },
    { key: 'gerant', label: 'Gérant' },
  ];

  ngOnInit() {
    this.seo.noIndex('Paramètres — SWIVIQ Admin');
    this.api.adminSettings().subscribe({ next: s => this.settings.set(s), error: () => {} });
  }

  clearInvalid(path: string) {
    if (!this.invalidFields().has(path)) return;
    this.invalidFields.update((set) => {
      const next = new Set(set);
      next.delete(path);
      return next;
    });
  }

  save(e: Event) {
    e.preventDefault();
    this.busy.set(true);
    this.saved.set(false);
    this.api.saveAdminSettings(this.settings()).subscribe({
      next: () => {
        this.busy.set(false);
        this.saved.set(true);
        this.invalidFields.set(new Set());
        this.toast.success('Paramètres enregistrés avec succès.');
      },
      error: (err) => {
        this.busy.set(false);
        const issues: string[] | undefined = err?.error?.details?.issues;
        const fields: string[] | undefined = err?.error?.details?.fields;
        this.invalidFields.set(new Set(fields ?? []));
        this.toast.error(err?.error?.error || 'Erreur lors de l’enregistrement.', issues);
      },
    });
  }
}

/* ===================== PRODUCTS LIST ===================== */
@Component({
  selector: 'svq-admin-products',
  imports: [RouterLink, CommonModule, TPipe],
  template: `
    <div class="flex-row">
      <h1 class="pg-title">{{ 'admin.productsTitle' | t }}</h1>
      <a routerLink="/admin/produits/nouveau" class="btn btn--primary btn--sm">{{ 'admin.addProduct' | t }}</a>
    </div>
    <div class="card tbl-wrap">
      <table class="table">
        <thead><tr>
          <th>Image</th><th>{{ 'admin.productName' | t }}</th><th>Slug</th><th>{{ 'admin.productType' | t }}</th><th>Statut</th><th>{{ 'admin.actions' | t }}</th>
        </tr></thead>
        <tbody>
          @for (p of products(); track p.id) {
            <tr>
              <td><img [src]="p.coverUrl" class="mini-img" /></td>
              <td><strong>{{ p.name }}</strong><br><small>{{ p.tagline }}</small></td>
              <td>{{ p.slug }}</td>
              <td><span class="chip chip--type">{{ p.type }}</span></td>
              <td><span [class]="'chip st-' + p.status">{{ p.status }}</span></td>
              <td class="acts">
                <a [routerLink]="['/admin/produits', p.id]" class="btn btn--ghost btn--sm">{{ 'admin.editProduct' | t }}</a>
                <button class="btn btn--ghost btn--sm" (click)="remove(p)" [disabled]="busy()">
                  {{ 'admin.deleteProduct' | t }}
                </button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty-td">{{ 'common.loading' | t }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .pg-title { font-size: 1.5rem; margin-bottom: 1.5rem; }
    .flex-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .tbl-wrap { padding: .5rem; overflow-x: auto; }
    .acts { display: flex; gap: .5rem; flex-wrap: wrap; }
    .mini-img { width: 48px; height: 36px; object-fit: cover; border-radius: 6px; }
    .empty-td { text-align: center; color: var(--c-text-soft); padding: 2rem; }
    .chip { font-size: .72rem; font-weight: 700; padding: .26rem .6rem; border-radius: 999px; }
    .chip--type { background: #eef0f4; color: #4b5563; text-transform: uppercase; letter-spacing: .04em; }
    .chip.st-live { background: #d1fae5; color: #065f46; }
    .chip.st-beta { background: #fef3c7; color: #92400e; }
    .chip.st-coming-soon { background: #ede9fe; color: #5b21b6; }
    .table tbody tr:hover { background: #fafbfd; }
  `],
})
export class AdminProductsComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  products = signal<Product[]>([]);
  busy = signal(false);

  ngOnInit() {
    this.seo.noIndex('Produits — SWIVIQ Admin');
    this.load();
  }
  load() { this.api.adminProducts().subscribe({ next: p => this.products.set(p), error: () => {} }); }

  remove(p: Product) {
    if (!confirm('Supprimer ce produit et ses abonnés ?')) return;
    this.busy.set(true);
    this.api.deleteProduct(p.id!).subscribe({
      next: () => { this.busy.set(false); this.load(); },
      error: () => this.busy.set(false),
    });
  }
}

/* ===================== PRODUCT FORM ===================== */
@Component({
  selector: 'svq-admin-product-form',
  imports: [RouterLink, FormsModule, TPipe, CommonModule],
  template: `
    <h1 class="pg-title">{{ isNew() ? ('admin.newProduct' | t) : ('admin.editProduct' | t) }}</h1>
    @if (!formReady()) {
      <div class="spinner"></div>
    } @else {
      <form (ngSubmit)="save($event)" class="pf">
        <div class="card blk">
          <h2>Informations générales</h2>
          <div class="grid grid-2">
            <div class="field"><label>{{ 'admin.productName' | t }}</label><input [(ngModel)]="form.name" name="name" required (ngModelChange)="onNameChange()" [class.invalid]="invalidFields().has('name')" /></div>
            <div class="field"><label>{{ 'admin.productSlug' | t }}</label><input [(ngModel)]="form.slug" name="slug" required pattern="[a-z0-9-]+" (ngModelChange)="slugTouched = true; clearInvalid('slug')" [class.invalid]="invalidFields().has('slug')" />
              <small class="hint">Minuscules, chiffres et tirets uniquement — généré automatiquement depuis le nom.</small>
            </div>
            <div class="field"><label>{{ 'admin.productType' | t }}</label>
              <select [(ngModel)]="form.type" name="type">
                <option value="app">App</option><option value="website">Website</option><option value="saas">SaaS</option>
              </select>
            </div>
            <div class="field"><label>{{ 'admin.productStatus' | t }}</label>
              <select [(ngModel)]="form.status" name="status">
                <option value="live">Live</option><option value="beta">Beta</option><option value="coming-soon">Coming soon</option>
              </select>
            </div>
          </div>
          <div class="field"><label>{{ 'admin.productTagline' | t }}</label><input [(ngModel)]="form.tagline" name="tagline" required (ngModelChange)="clearInvalid('tagline')" [class.invalid]="invalidFields().has('tagline')" /></div>
          <div class="field"><label>{{ 'admin.productCover' | t }}</label>
            <div class="upload-row">
              <input [(ngModel)]="form.coverUrl" name="cover" required (ngModelChange)="clearInvalid('coverUrl')" [class.invalid]="invalidFields().has('coverUrl')" />
              <button type="button" class="btn btn--primary btn--sm upload-btn" (click)="coverFile.click()" [disabled]="coverUploading()">
                @if (coverUploading()) { <span class="spinner"></span> } @else {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                }
                {{ 'admin.uploadImage' | t }}
              </button>
              <input type="file" hidden #coverFile accept="image/jpeg,image/png,image/webp,image/gif,image/avif" (change)="onCoverFile($event); coverFile.value = ''" />
            </div>
          </div>
          <div class="field"><label>{{ 'admin.productDescription' | t }}</label><textarea [(ngModel)]="form.description" name="desc" rows="4" required (ngModelChange)="clearInvalid('description')" [class.invalid]="invalidFields().has('description')"></textarea></div>
          <div class="field"><label>{{ 'admin.productTech' | t }}</label><input [(ngModel)]="techStr" name="tech" placeholder="Angular, Node.js, TypeScript…" /></div>
          <div class="field"><label>{{ 'admin.productFeatures' | t }}</label><textarea [(ngModel)]="featuresStr" name="feats" rows="3" placeholder="Feature 1&#10;Feature 2"></textarea></div>
          <div class="grid grid-2">
            <div class="field"><label>{{ 'admin.productWebsite' | t }}</label><input [(ngModel)]="form.websiteUrl" name="web" /></div>
            <div class="field"><label>{{ 'admin.productRepo' | t }}</label><input [(ngModel)]="form.repoUrl" name="repo" /></div>
          </div>
          <div class="field"><label>{{ 'admin.productOrder' | t }}</label><input type="number" [(ngModel)]="form.order" name="order" min="0" /></div>
        </div>

        <div class="card blk">
          <h2>{{ 'admin.photosTitle' | t }}</h2>
          <div class="photo-cards">
            @for (ph of form.photos; track $index; let i = $index) {
              <div class="photo-card">
                <div class="photo-card__preview">
                  @if (ph.url && !previewErrors.has(ph.url)) {
                    <img [src]="ph.url" [alt]="ph.title || 'Photo ' + (i + 1)" (error)="onPreviewError(ph.url)" />
                  } @else {
                    <div class="photo-card__empty">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    </div>
                  }
                  @if (photoUploading().has(i)) {
                    <div class="photo-card__loading"><span class="spinner"></span></div>
                  }
                  <span class="photo-card__num">{{ i + 1 }}</span>
                </div>
                <div class="photo-card__fields">
                  <div class="upload-row">
                    <input [(ngModel)]="ph.url" [name]="'pu' + i" [placeholder]="'admin.photoUrl' | t" (ngModelChange)="clearInvalid('photos.' + i + '.url')" [class.invalid]="invalidFields().has('photos.' + i + '.url')" />
                    <button type="button" class="btn btn--primary btn--sm upload-btn" (click)="photoFile.click()" [disabled]="photoUploading().has(i)" [title]="'admin.uploadImage' | t">
                      @if (photoUploading().has(i)) { <span class="spinner"></span> } @else {
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      }
                      {{ 'admin.uploadImage' | t }}
                    </button>
                    <input type="file" hidden #photoFile accept="image/jpeg,image/png,image/webp,image/gif,image/avif" (change)="onPhotoFile($event, i); photoFile.value = ''" />
                  </div>
                  <input [(ngModel)]="ph.title" [name]="'pt' + i" [placeholder]="'admin.photoTitle' | t" />
                  <textarea [(ngModel)]="ph.description" [name]="'pd' + i" rows="2" [placeholder]="'admin.photoDesc' | t"></textarea>
                </div>
                <div class="photo-card__acts">
                  <button type="button" (click)="movePhoto(i, -1)" [disabled]="i === 0" title="Monter" aria-label="Monter">↑</button>
                  <button type="button" (click)="movePhoto(i, 1)" [disabled]="i === form.photos.length - 1" title="Descendre" aria-label="Descendre">↓</button>
                  <button type="button" class="danger" (click)="removePhoto(i)" [title]="'admin.removePhoto' | t" aria-label="Retirer">×</button>
                </div>
              </div>
            }
          </div>
          <button type="button" class="btn btn--ghost btn--sm" (click)="addPhoto()">+ {{ 'admin.addPhoto' | t }}</button>
        </div>

        <!-- Chapitres techniques : texte long, puces et chiffres clés -->
        <div class="card blk">
          <h2>Chapitres techniques</h2>
          <p class="blk-hint">
            Chaque chapitre devient une section de la fiche publique : architecture, workflow,
            référencement… Laissez vide si le produit n’en a pas besoin.
          </p>
          @for (sec of form.sections; track $index; let i = $index) {
            <div class="sec-box">
              <div class="sec-box__head">
                <span class="sec-box__num">{{ i + 1 }}</span>
                <div class="sec-box__acts">
                  <button type="button" (click)="moveSection(i, -1)" [disabled]="i === 0" title="Monter" aria-label="Monter">↑</button>
                  <button type="button" (click)="moveSection(i, 1)" [disabled]="i === form.sections!.length - 1" title="Descendre" aria-label="Descendre">↓</button>
                  <button type="button" class="danger" (click)="removeSection(i)" title="Retirer" aria-label="Retirer">×</button>
                </div>
              </div>
              <div class="grid grid-2">
                <div class="field">
                  <label>Sur-titre</label>
                  <input [(ngModel)]="sec.eyebrow" [name]="'se' + i" placeholder="Architecture, Workflow…" />
                </div>
                <div class="field">
                  <label>Ancre (optionnel)</label>
                  <input [(ngModel)]="sec.id" [name]="'si' + i" placeholder="architecture" />
                </div>
              </div>
              <div class="field">
                <label>Titre</label>
                <input [(ngModel)]="sec.title" [name]="'st' + i" required />
              </div>
              <div class="field">
                <label>Texte — une ligne vide sépare deux paragraphes</label>
                <textarea [(ngModel)]="sec.body" [name]="'sb' + i" rows="6"></textarea>
              </div>

              <div class="field">
                <label>Puces</label>
                @for (b of sec.bullets; track $index; let j = $index) {
                  <div class="upload-row">
                    <input [ngModel]="b" (ngModelChange)="sec.bullets[j] = $event" [name]="'sbu' + i + '_' + j" />
                    <button type="button" class="btn btn--ghost btn--sm" (click)="sec.bullets.splice(j, 1)" aria-label="Retirer la puce">×</button>
                  </div>
                }
                <button type="button" class="btn btn--ghost btn--sm" (click)="sec.bullets.push('')">+ Ajouter une puce</button>
              </div>

              <div class="field">
                <label>Chiffres clés</label>
                @for (m of sec.metrics; track $index; let j = $index) {
                  <div class="upload-row">
                    <input [(ngModel)]="m.value" [name]="'smv' + i + '_' + j" placeholder="165" />
                    <input [(ngModel)]="m.label" [name]="'sml' + i + '_' + j" placeholder="URL au sitemap" />
                    <button type="button" class="btn btn--ghost btn--sm" (click)="sec.metrics.splice(j, 1)" aria-label="Retirer le chiffre">×</button>
                  </div>
                }
                <button type="button" class="btn btn--ghost btn--sm" (click)="sec.metrics.push({ value: '', label: '' })">+ Ajouter un chiffre</button>
              </div>
            </div>
          }
          <button type="button" class="btn btn--ghost btn--sm" (click)="addSection()">+ Ajouter un chapitre</button>
        </div>

        @if (form.type === 'saas') {
          <div class="card blk">
            <h2>{{ 'admin.plansTitle' | t }}</h2>
            @for (pl of form.plans; track $index) {
              <div class="plan-box">
                <div class="grid grid-3">
                  <div class="field"><label>{{ 'admin.planName' | t }}</label><input [(ngModel)]="pl.name" [name]="'pln' + $index" required /></div>
                  <div class="field"><label>{{ 'admin.planPrice' | t }}</label><input type="number" [(ngModel)]="pl.price" [name]="'plp' + $index" min="0" /></div>
                  <div class="field"><label>{{ 'admin.planCurrency' | t }}</label><input [(ngModel)]="pl.currency" [name]="'plc' + $index" /></div>
                </div>
                <div class="grid grid-2">
                  <div class="field"><label>{{ 'admin.planInterval' | t }}</label>
                    <select [(ngModel)]="pl.interval" [name]="'pli' + $index">
                      <option value="month">{{ 'admin.intervalMonth' | t }}</option>
                      <option value="year">{{ 'admin.intervalYear' | t }}</option>
                      <option value="one-time">{{ 'admin.intervalOnce' | t }}</option>
                    </select>
                  </div>
                  <div class="field"><label>{{ 'admin.planCta' | t }}</label><input [(ngModel)]="pl.ctaLabel" [name]="'plcta' + $index" /></div>
                </div>
                <div class="field"><label>{{ 'admin.planTagline' | t }}</label><input [(ngModel)]="pl.tagline" [name]="'plt' + $index" /></div>
                <div class="field"><label>{{ 'admin.planFeatures' | t }}</label><textarea [(ngModel)]="planFeats[$index]" [name]="'plf' + $index" rows="2" placeholder="Feature 1&#10;Feature 2"></textarea></div>
                <label class="chk"><input type="checkbox" [(ngModel)]="pl.highlighted" [name]="'plh' + $index" /> {{ 'admin.planHighlight' | t }}</label>
                <button type="button" class="btn btn--ghost btn--sm" (click)="removePlan($index)">{{ 'admin.removePlan' | t }}</button>
              </div>
            }
            <button type="button" class="btn btn--ghost btn--sm" (click)="addPlan()">{{ 'admin.addPlan' | t }}</button>
          </div>
        }

        <div class="card blk">
          <h2>{{ 'admin.branding' | t }}</h2>
          <div class="grid grid-3">
            <div class="field">
              <label>{{ 'admin.brandColor' | t }}</label>
              <input type="color" [(ngModel)]="form.brandColor" name="brandColor" style="height:42px; padding:4px;" />
            </div>
            <div class="field">
              <label>{{ 'admin.brandPrefix' | t }}</label>
              <input [(ngModel)]="form.brandPrefix" name="brandPrefix" maxlength="10" placeholder="TVV, SWC..." />
            </div>
            <div class="field">
              <label>{{ 'admin.brandTagline' | t }}</label>
              <input [(ngModel)]="form.brandTagline" name="brandTagline" maxlength="240" placeholder="Slogan du projet" />
            </div>
          </div>
        </div>

        @if (saved()) { <p class="ok">{{ 'admin.savedProduct' | t }}</p> }
        <div class="btn-row">
          <button class="btn btn--primary" type="submit" [disabled]="busy()">
            @if (busy()) { <span class="spinner"></span> } @else { {{ 'admin.save' | t }} }
          </button>
          <a routerLink="/admin/produits" class="btn btn--ghost">Annuler</a>
        </div>
      </form>
    }
  `,
  styles: [`
    .pg-title { font-size: 1.5rem; margin-bottom: 1.5rem; }
    .blk { margin-bottom: 1.5rem; }
    .blk h2 { font-size: 1.05rem; margin-bottom: 1rem; }
    .photo-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .photo-card {
      display: grid; grid-template-columns: 110px 1fr auto; gap: .8rem; align-items: start;
      padding: .8rem; border: 1.5px solid var(--c-border); border-radius: var(--radius); background: #fff;
      transition: border-color .2s, box-shadow .2s;
    }
    .photo-card:focus-within { border-color: var(--c-primary); box-shadow: 0 4px 16px rgba(116,83,242,.10); }
    .photo-card__preview { position: relative; width: 110px; height: 96px; border-radius: 8px; overflow: hidden; background: var(--c-surface); border: 1px solid var(--c-border); }
    .photo-card__preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .photo-card__empty { width: 100%; height: 100%; display: grid; place-items: center; color: var(--c-text-soft); }
    .photo-card__num {
      position: absolute; top: 4px; inset-inline-start: 4px; min-width: 20px; height: 20px; padding: 0 5px;
      display: grid; place-items: center; border-radius: 6px; background: rgba(15,15,15,.75); color: #fff;
      font-size: .72rem; font-weight: 700;
    }
    .photo-card__fields { display: grid; gap: .45rem; }
    .photo-card__fields input, .photo-card__fields textarea { padding: .45rem .6rem; border: 1.5px solid var(--c-border); border-radius: 6px; width: 100%; font-size: .85rem; resize: vertical; }
    .photo-card__acts { display: flex; flex-direction: column; gap: .3rem; }
    .photo-card__acts button {
      width: 28px; height: 28px; display: grid; place-items: center; border: 1.5px solid var(--c-border);
      border-radius: 6px; background: #fff; color: var(--c-text-soft); cursor: pointer; font-size: .9rem; transition: .15s;
    }
    .photo-card__acts button:hover:not(:disabled) { border-color: var(--c-primary); color: var(--c-primary); }
    .photo-card__acts button:disabled { opacity: .35; cursor: default; }
    .photo-card__acts button.danger:hover { border-color: var(--c-danger); color: var(--c-danger); }
    .photo-card__loading { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(255,255,255,.8); z-index: 2; }
    .upload-row { display: flex; gap: .5rem; align-items: center; }
    .upload-row input { flex: 1; min-width: 0; }
    .upload-btn { display: inline-flex; align-items: center; gap: .35rem; white-space: nowrap; flex-shrink: 0; }
    .plan-box { padding: 1rem; background: var(--c-surface); border-radius: var(--radius); margin-bottom: .8rem; }

    /* Chapitres techniques */
    .blk-hint { margin: -.4rem 0 1rem; font-size: .84rem; line-height: 1.5; color: var(--c-text-soft); }
    .sec-box {
      padding: 1.1rem; margin-bottom: .9rem;
      background: var(--c-surface); border: 1px solid var(--c-line);
      border-radius: var(--radius);
    }
    .sec-box__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: .8rem; }
    .sec-box__num {
      display: grid; place-items: center; width: 26px; height: 26px; border-radius: 8px;
      background: var(--c-primary); color: #fff; font-size: .78rem; font-weight: 700;
    }
    .sec-box__acts { display: flex; gap: .3rem; }
    .sec-box__acts button {
      width: 28px; height: 28px; border-radius: 7px; cursor: pointer;
      border: 1px solid var(--c-line); background: #fff; color: var(--c-text-soft);
    }
    .sec-box__acts button:disabled { opacity: .4; cursor: not-allowed; }
    .sec-box__acts .danger:hover { background: var(--c-danger); border-color: var(--c-danger); color: #fff; }
    .plan-box .grid { gap: .5rem; }
    .chk { display: flex; align-items: center; gap: .5rem; font-size: .9rem; cursor: pointer; }
    .chk input { width: auto; }
    .ok { color: var(--c-success); font-weight: 600; margin-bottom: 1rem; }
    .err { color: var(--c-danger); margin-bottom: 1rem; }
    .btn-row { display: flex; gap: 1rem; align-items: center; }
    input, select, textarea { padding: .55rem .8rem; border: 1.5px solid var(--c-border); border-radius: 8px; width: 100%; }
    input.invalid, textarea.invalid {
      border-color: var(--c-danger) !important;
      background: rgba(239, 68, 68, .07);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, .15);
    }
    .hint { display: block; margin-top: .3rem; font-size: .76rem; color: var(--c-text-soft); }
  `],
})
export class AdminProductFormComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  busy = signal(false);
  saved = signal(false);
  invalidFields = signal<Set<string>>(new Set());
  formReady = signal(false);
  editId: string | null = null;
  slugTouched = false;

  form: Product = { slug: '', type: 'app', name: '', tagline: '', description: '', coverUrl: '', technologies: [], features: [], photos: [], sections: [], plans: [], status: 'live', order: 0, brandColor: '#7435F2', brandTagline: 'Agence digitale — Développement web, mobile & solutions cloud', brandPrefix: 'SW' };
  techStr = '';
  featuresStr = '';
  planFeats: string[] = [];

  isNew() { return !this.editId; }

  /* Slug auto-généré depuis le nom (tant que l'utilisateur ne l'a pas modifié à la main) */
  onNameChange() {
    this.clearInvalid('name');
    if (this.isNew() && !this.slugTouched) {
      this.form.slug = this.slugify(this.form.name);
      this.clearInvalid('slug');
    }
  }

  slugify(s: string): string {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120);
  }

  clearInvalid(path: string) {
    if (!this.invalidFields().has(path)) return;
    this.invalidFields.update((set) => {
      const next = new Set(set);
      next.delete(path);
      return next;
    });
  }

  ngOnInit() {
    this.seo.noIndex('Formulaire produit — SWIVIQ Admin');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = id;
      this.api.adminProduct(id).subscribe({
        next: p => {
          this.form = p;
          // Fiches créées avant l'ajout des chapitres : sans ce repli, les
          // *ngFor du formulaire itèrent sur undefined.
          this.form.sections ||= [];
          for (const sec of this.form.sections) {
            sec.bullets ||= [];
            sec.metrics ||= [];
          }
          this.techStr = p.technologies.join(', ');
          this.featuresStr = p.features.join('\n');
          this.planFeats = p.plans.map(pl => (pl.features || []).join('\n'));
          this.formReady.set(true);
          this.cdr.markForCheck(); // zoneless : force le rafraîchissement après assignation asynchrone
        },
        error: () => this.router.navigateByUrl('/admin/produits'),
      });
    } else {
      this.formReady.set(true);
    }
  }

  addSection() {
    (this.form.sections ||= []).push({ eyebrow: '', title: '', body: '', bullets: [], metrics: [] });
  }
  removeSection(i: number) { this.form.sections?.splice(i, 1); }
  /** Déplace un chapitre : l'ordre du tableau est celui de la page publique. */
  moveSection(i: number, dir: -1 | 1) {
    const list = this.form.sections;
    if (!list) return;
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const [sec] = list.splice(i, 1);
    list.splice(j, 0, sec);
  }

  addPhoto() { this.form.photos.push({ url: '', title: '', description: '' }); }
  removePhoto(i: number) { this.form.photos.splice(i, 1); }
  movePhoto(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= this.form.photos.length) return;
    const [ph] = this.form.photos.splice(i, 1);
    this.form.photos.splice(j, 0, ph);
  }
  previewErrors = new Set<string>();
  onPreviewError(url: string) { this.previewErrors.add(url); }

  /* ---- Image uploads ---- */
  photoUploading = signal<Set<number>>(new Set());
  coverUploading = signal(false);

  onPhotoFile(e: Event, i: number) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.photoUploading.update(s => new Set(s).add(i));
    this.api.uploadImage(file).subscribe({
      next: res => {
        this.form.photos[i].url = res.url;
        this.previewErrors.delete(res.url);
        this.photoUploading.update(s => { const n = new Set(s); n.delete(i); return n; });
        this.toast.success('Image téléversée.');
      },
      error: err => {
        this.photoUploading.update(s => { const n = new Set(s); n.delete(i); return n; });
        this.toast.error(err?.error?.error || 'Échec du téléversement de l’image.');
      },
    });
  }

  onCoverFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.coverUploading.set(true);
    this.api.uploadImage(file).subscribe({
      next: res => { this.form.coverUrl = res.url; this.coverUploading.set(false); this.toast.success('Image de couverture téléversée.'); },
      error: err => { this.coverUploading.set(false); this.toast.error(err?.error?.error || 'Échec du téléversement de l’image.'); },
    });
  }
  addPlan() {
    this.form.plans.push({ name: '', price: 0, currency: 'MAD', interval: 'month', tagline: '', features: [], highlighted: false, ctaLabel: '' });
    this.planFeats.push('');
  }
  removePlan(i: number) { this.form.plans.splice(i, 1); this.planFeats.splice(i, 1); }

  save(e: Event) {
    e.preventDefault();
    this.busy.set(true); this.saved.set(false); this.invalidFields.set(new Set());
    this.form.technologies = this.techStr.split(',').map(s => s.trim()).filter(Boolean);
    this.form.features = this.featuresStr.split('\n').map(s => s.trim()).filter(Boolean);
    if (this.form.type === 'saas') {
      this.form.plans.forEach((pl, i) => { pl.features = (this.planFeats[i] || '').split('\n').map(s => s.trim()).filter(Boolean); });
    } else {
      this.form.plans = [];
    }
    const req = this.editId
      ? this.api.updateProduct(this.editId, this.form)
      : this.api.createProduct(this.form);
    req.subscribe({
      next: () => {
        this.busy.set(false);
        this.saved.set(true);
        this.toast.success('Produit enregistré avec succès.');
        setTimeout(() => this.router.navigateByUrl('/admin/produits'), 800);
      },
      error: e => {
        this.busy.set(false);
        const issues: string[] | undefined = e?.error?.details?.issues;
        const fields: string[] | undefined = e?.error?.details?.fields;
        this.invalidFields.set(new Set(fields ?? []));
        this.toast.error(e?.error?.error || 'Erreur lors de l’enregistrement.', issues);
      },
    });
  }
}

/* ===================== SUBSCRIBERS ===================== */
@Component({
  selector: 'svq-admin-subscribers',
  imports: [DatePipe, TPipe],
  template: `
    <h1 class="pg-title">{{ 'admin.subscribersTitle' | t }}</h1>
    <div class="card tbl-wrap">
      <table class="table">
        <thead><tr>
          <th>{{ 'admin.subscriberNumber' | t }}</th><th>{{ 'admin.subscriber' | t }}</th><th>{{ 'admin.product' | t }}</th>
          <th>{{ 'admin.plan' | t }}</th><th>{{ 'admin.status' | t }}</th><th>{{ 'admin.date' | t }}</th><th>{{ 'admin.actions' | t }}</th>
        </tr></thead>
        <tbody>
          @for (s of subscribers(); track s.id) {
            <tr>
              <td><strong>{{ s.number }}</strong></td>
              <td>{{ s.name }}<br /><small>{{ s.email }}</small></td>
              <td>{{ s.product?.name || '-' }}</td>
              <td>{{ s.plan?.name || '-' }}<br /><small>{{ s.plan?.price }} {{ s.plan?.currency }} {{ s.plan?.interval }}</small></td>
              <td>
                <select [class]="'chip-select st-' + s.status" [value]="s.status" (change)="setStatus(s, $event)">
                  <option value="pending">{{ 'admin.statuses.pending' | t }}</option>
                  <option value="active">{{ 'admin.statuses.active' | t }}</option>
                  <option value="suspended">{{ 'admin.statuses.suspended' | t }}</option>
                  <option value="cancelled">{{ 'admin.statuses.cancelled' | t }}</option>
                </select>
              </td>
              <td>{{ s.createdAt | date:'dd/MM/yyyy' }}</td>
              <td class="acts">
                <button class="btn btn--ghost btn--sm" (click)="remove(s)">{{ 'admin.deleteSubscriber' | t }}</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="empty-td">{{ 'admin.noSubscribers' | t }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .pg-title { font-size: 1.5rem; margin-bottom: 1.5rem; }
    .tbl-wrap { padding: .5rem; overflow-x: auto; }
    .acts { display: flex; gap: .5rem; flex-wrap: wrap; }
    .chip-select { padding: .35rem .6rem; border-radius: 999px; border: 1.5px solid var(--c-border);
      font-size: .8rem; font-weight: 700; cursor: pointer; }
    .chip-select.st-active { background: #d1fae5; color: #065f46; border-color: #a7ecd1; }
    .chip-select.st-pending { background: #fef3c7; color: #92400e; border-color: #f6e2ac; }
    .chip-select.st-suspended { background: #fee2e2; color: #991b1b; border-color: #fbc9c9; }
    .chip-select.st-cancelled { background: #f1f2f4; color: #6b7280; border-color: #e2e4e8; }
    small { color: var(--c-text-soft); }
    .empty-td { text-align: center; color: var(--c-text-soft); padding: 2rem; }
    .table tbody tr:hover { background: #fafbfd; }
  `],
})
export class AdminSubscribersComponent implements OnInit {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  subscribers = signal<Subscriber[]>([]);

  ngOnInit() {
    this.seo.noIndex('Abonnés — SWIVIQ Admin');
    this.load();
  }
  load() { this.api.adminSubscribers().subscribe({ next: s => this.subscribers.set(s), error: () => {} }); }

  setStatus(s: Subscriber, e: Event) {
    const status = (e.target as HTMLSelectElement).value;
    this.api.updateSubscriberStatus(s.id, status).subscribe({ next: () => this.load(), error: () => {} });
  }

  remove(s: Subscriber) {
    if (!confirm('Supprimer cet abonné ?')) return;
    this.api.deleteSubscriber(s.id).subscribe({ next: () => this.load(), error: () => {} });
  }
}

/* ===================== DOCUMENT GENERATOR ===================== */
@Component({
  selector: 'svq-admin-doc-gen',
  imports: [FormsModule, DecimalPipe, TPipe, CommonModule],
  template: `
    <h1 class="pg-title">{{ 'admin.generateDoc' | t }}</h1>

    <!-- STEP 1: Type selection -->
    @if (!docType()) {
      <div class="card choose-type">
        <h2>{{ 'admin.docType' | t }}</h2>
        <div class="type-cards">
          <button class="type-card" (click)="selectType('quote')">
            <div class="type-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <strong>{{ 'admin.quote' | t }}</strong>
            <small>{{ 'admin.quoteSecurity' | t }}</small>
          </button>
          <button class="type-card" (click)="selectType('invoice')">
            <div class="type-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="15" r="2" stroke="currentColor" stroke-width="1.5"/></svg>
            </div>
            <strong>{{ 'admin.invoice' | t }}</strong>
            <small>{{ 'admin.invoiceSecurity' | t }}</small>
          </button>
        </div>
      </div>
    }

    <!-- STEP 2: Project selection -->
    @if (docType() && !selectedProject()) {
      <div class="toolbar">
        <button class="btn btn--ghost btn--sm" (click)="backToType()">← Retour</button>
        <span class="badge" [class]="docType()">{{ docType() === 'quote' ? ('admin.quote' | t) : ('admin.invoice' | t) }}</span>
      </div>
      <div class="card choose-project">
        <h2>{{ 'admin.selectProject' | t }}</h2>
        <div class="project-cards">
          @for (p of projects(); track p.id) {
            <button class="project-card" [style.border-top-color]="p.brandColor || '#7435F2'" (click)="selectProject(p)">
              <div class="project-card__color" [style.background]="p.brandColor || '#7435F2'"></div>
              <strong>{{ p.name }}</strong>
              <small>{{ p.brandTagline || p.tagline }}</small>
              <span class="project-card__prefix">{{ p.brandPrefix || 'SW' }}</span>
            </button>
          }
          <button class="project-card project-card--default" (click)="selectProject(null)">
            <div class="project-card__color" style="background: #7435F2"></div>
            <strong>SWIVIQ</strong>
            <small>{{ 'admin.noProject' | t }}</small>
            <span class="project-card__prefix">DEF</span>
          </button>
        </div>
      </div>
    }

    <!-- STEP 3: Form -->
    @if (docType() && selectedProject() !== undefined) {
      <div class="toolbar">
        <button class="btn btn--ghost btn--sm" (click)="backToProject()">← {{ 'admin.selectProject' | t }}</button>
        <span class="badge" [class]="docType()">{{ docType() === 'quote' ? ('admin.quote' | t) : ('admin.invoice' | t) }}</span>
        @if (selectedProject()) {
          <span class="badge-project" [style.background]="selectedProject()!.brandColor || '#7435F2'">{{ selectedProject()!.name }}</span>
        }
      </div>

      @if (done()) {
        <div class="card success-box">
          <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="24" stroke="url(#dg)" stroke-width="3"/>
            <path d="M16 27l7 7 13-14" stroke="url(#dg)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs><linearGradient id="dg" x1="0" y1="0" x2="52" y2="52"><stop stop-color="#7435F2"/><stop offset="1" stop-color="#2060F0"/></linearGradient></defs>
          </svg>
          <h2>{{ 'admin.success' | t }}</h2>
          <p class="doc-number">{{ done()!.number }}</p>
          <div class="success-actions">
            <button class="btn btn--primary" (click)="openPdf()">{{ 'admin.download' | t }}</button>
            <button class="btn btn--ghost" (click)="reset()">{{ 'admin.newDocument' | t }}</button>
          </div>
        </div>
      } @else {
        <form (ngSubmit)="submit($event)">
          <div class="card blk">
            <h2>{{ 'admin.customerInfo' | t }}</h2>
            <div class="grid grid-2">
              <div class="field">
                <label>{{ 'admin.customerName' | t }}</label>
                <input [(ngModel)]="customer.name" name="cname" required maxlength="120" />
              </div>
              <div class="field">
                <label>{{ 'admin.customerCompany' | t }}</label>
                <input [(ngModel)]="customer.company" name="ccompany" maxlength="160" />
              </div>
              <div class="field">
                <label>{{ 'admin.customerEmail' | t }}</label>
                <input type="email" [(ngModel)]="customer.email" name="cemail" required maxlength="200" />
              </div>
              <div class="field">
                <label>{{ 'admin.customerPhone' | t }}</label>
                <input [(ngModel)]="customer.phone" name="cphone" maxlength="30" />
              </div>
              <div class="field">
                <label>{{ 'admin.customerIce' | t }}</label>
                <input [(ngModel)]="customer.ice" name="cice" maxlength="20" />
              </div>
              <div class="field">
                <label>{{ 'admin.customerAddress' | t }}</label>
                <input [(ngModel)]="customer.address" name="caddr" maxlength="300" />
              </div>
            </div>
          </div>

          <div class="card blk">
            <h2>{{ 'admin.lineItems' | t }}</h2>
            <table class="table lines-table">
              <thead>
                <tr>
                  <th style="width:50%">{{ 'admin.lineLabel' | t }}</th>
                  <th style="width:12%">{{ 'admin.lineQty' | t }}</th>
                  <th style="width:20%">{{ 'admin.lineUnitPrice' | t }}</th>
                  <th style="width:13%">{{ 'admin.lineTotal' | t }}</th>
                  <th style="width:5%"></th>
                </tr>
              </thead>
              <tbody>
                @for (line of lines; track $index) {
                  <tr>
                    <td><input [(ngModel)]="line.label" [name]="'ll' + $index" required placeholder="Description..." /></td>
                    <td><input type="number" [(ngModel)]="line.qty" [name]="'lq' + $index" min="1" max="10000" (input)="recalc()" /></td>
                    <td><input type="number" [(ngModel)]="line.unitPrice" [name]="'lp' + $index" min="0" step="0.01" (input)="recalc()" /></td>
                    <td class="num">{{ lineTotal(line) | number:'1.2-2' }}</td>
                    <td><button type="button" class="btn-del" (click)="removeLine($index)" [disabled]="lines.length <= 1">×</button></td>
                  </tr>
                }
              </tbody>
            </table>
            <button type="button" class="btn btn--ghost btn--sm" (click)="addLine()">+ {{ 'admin.addLine' | t }}</button>
          </div>

          <div class="card blk totals-card">
            <div class="totals-row"><span>{{ 'admin.subtotal' | t }}</span><strong>{{ subtotal() | number:'1.2-2' }} MAD</strong></div>
            <div class="totals-row"><span>{{ 'admin.vat' | t }}</span><strong>{{ vat() | number:'1.2-2' }} MAD</strong></div>
            <div class="totals-row grand"><span>{{ 'admin.total' | t }}</span><strong>{{ total() | number:'1.2-2' }} MAD</strong></div>
          </div>

          @if (error()) { <p class="err">{{ 'admin.required' | t }}</p> }

          <button class="btn btn--primary" type="submit" [disabled]="busy()">
            @if (busy()) { <span class="spinner"></span> {{ 'admin.generating' | t }} } @else { {{ 'admin.generate' | t }} }
          </button>
        </form>
      }
    }
  `,
  styles: [`
    .pg-title { font-size: 1.5rem; margin-bottom: 1.5rem; }
    .choose-type, .choose-project { padding: 2.5rem; text-align: center; }
    .choose-type h2, .choose-project h2 { font-size: 1.2rem; margin-bottom: 2rem; }
    .type-cards, .project-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; max-width: 700px; margin: 0 auto; }
    @media (max-width: 640px) { .type-cards, .project-cards { grid-template-columns: 1fr; } }
    .type-card, .project-card {
      display: flex; flex-direction: column; align-items: center; gap: .8rem;
      padding: 2rem 1.5rem; border: 2px solid var(--c-border); border-radius: var(--radius);
      background: #fff; cursor: pointer; transition: .25s; position: relative; overflow: hidden;
    }
    .type-card:hover, .project-card:hover { border-color: var(--c-primary); background: var(--grad-brand-soft); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(116,83,242,.12); }
    .type-card__icon { color: var(--c-primary); }
    .type-card strong, .project-card strong { font-size: 1.15rem; }
    .type-card small, .project-card small { font-size: .8rem; color: var(--c-text-soft); line-height: 1.4; text-align: center; }
    .project-card { border-top-width: 4px; }
    .project-card__color { width: 40px; height: 6px; border-radius: 3px; }
    .project-card__prefix { font-size: .7rem; font-weight: 700; color: var(--c-text-soft); background: var(--c-surface); padding: .2rem .5rem; border-radius: 4px; }
    .project-card--default { border-color: #7435F2; }
    .toolbar { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
    .badge { padding: .35rem .9rem; border-radius: 20px; font-size: .82rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
    .badge.quote { background: #FEF3C7; color: #92400E; }
    .badge.invoice { background: #DBEAFE; color: #1E40AF; }
    .badge-project { padding: .35rem .9rem; border-radius: 20px; font-size: .82rem; font-weight: 700; color: #fff; }
    .blk { margin-bottom: 1.5rem; }
    .blk h2 { font-size: 1.05rem; margin-bottom: 1rem; }
    .lines-table input { padding: .45rem .6rem; border: 1.5px solid var(--c-border); border-radius: 6px; width: 100%; font-size: .88rem; }
    .lines-table .num { text-align: end; font-weight: 600; font-size: .9rem; white-space: nowrap; }
    .btn-del { background: none; border: none; color: var(--c-danger); font-size: 1.3rem; cursor: pointer; padding: .2rem .5rem; border-radius: 6px; transition: .2s; }
    .btn-del:hover { background: rgba(239,68,68,.1); }
    .totals-card { max-width: 400px; margin-inline-start: auto; }
    .totals-row { display: flex; justify-content: space-between; padding: .5rem 0; font-size: .95rem; color: var(--c-text-soft); }
    .totals-row span { font-weight: 500; }
    .totals-row.grand { border-top: 2px solid var(--c-primary); margin-top: .5rem; padding-top: .8rem; font-size: 1.15rem; color: var(--c-ink); }
    .totals-row.grand strong { color: var(--c-primary); }
    .success-box { text-align: center; padding: 3rem 2rem; display: flex; flex-direction: column; align-items: center; gap: .8rem; max-width: 500px; margin: 2rem auto; }
    .success-box h2 { font-size: 1.3rem; }
    .doc-number { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; color: var(--c-primary); }
    .success-actions { display: flex; gap: 1rem; margin-top: 1rem; }
    .err { color: var(--c-danger); font-size: .9rem; margin-bottom: 1rem; }
    input, select { padding: .55rem .8rem; border: 1.5px solid var(--c-border); border-radius: 8px; width: 100%; }
  `],
})
export class AdminDocGenComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private seo = inject(SeoService);
  private apiBase = inject(API_BASE);

  docType = signal<'quote' | 'invoice' | null>(null);
  selectedProject = signal<Product | null | undefined>(undefined);
  projects = signal<Product[]>([]);
  customer = { name: '', company: '', email: '', phone: '', ice: '', address: '' };
  lines: { label: string; qty: number; unitPrice: number }[] = [];
  busy = signal(false);
  error = signal(false);
  done = signal<Invoice | Quote | null>(null);

  subtotal = signal(0);
  vat = signal(0);
  total = signal(0);

  ngOnInit() {
    this.seo.noIndex('Générer document — SWIVIQ Admin');
    this.api.adminProducts().subscribe({
      next: p => this.projects.set(p),
      error: () => {}
    });
  }

  selectType(type: 'quote' | 'invoice') {
    this.docType.set(type);
  }

  backToType() {
    this.docType.set(null);
    this.selectedProject.set(undefined);
  }

  selectProject(project: Product | null) {
    this.selectedProject.set(project);
    this.lines = [{ label: '', qty: 1, unitPrice: 0 }];
    this.recalc();
  }

  backToProject() {
    this.selectedProject.set(undefined);
    this.done.set(null);
  }

  addLine() { this.lines.push({ label: '', qty: 1, unitPrice: 0 }); }
  removeLine(i: number) { if (this.lines.length > 1) { this.lines.splice(i, 1); this.recalc(); } }

  lineTotal(line: { qty: number; unitPrice: number }): number {
    return Math.round(line.qty * line.unitPrice * 100) / 100;
  }

  recalc() {
    const sub = this.lines.reduce((s, l) => s + this.lineTotal(l), 0);
    const v = Math.round(sub * 0.2 * 100) / 100;
    this.subtotal.set(Math.round(sub * 100) / 100);
    this.vat.set(v);
    this.total.set(Math.round((sub + v) * 100) / 100);
  }

  submit(e: Event) {
    e.preventDefault();
    if (!this.customer.name.trim() || !this.customer.email.includes('@') || this.lines.some(l => !l.label.trim())) {
      this.error.set(true); return;
    }
    this.error.set(false);
    this.busy.set(true);

    const cust = {
      name: this.customer.name.trim(),
      email: this.customer.email.trim(),
      ...(this.customer.company.trim() && { company: this.customer.company.trim() }),
      ...(this.customer.phone.trim() && { phone: this.customer.phone.trim() }),
      ...(this.customer.ice.trim() && { ice: this.customer.ice.trim() }),
      ...(this.customer.address.trim() && { address: this.customer.address.trim() }),
    };
    const project = this.selectedProject();
    const payload = {
      customer: cust,
      lines: this.lines.map(l => ({ label: l.label.trim(), qty: l.qty, unitPrice: l.unitPrice })),
      ...(project && { projectId: project.id })
    };

    if (this.docType() === 'quote') {
      this.api.createQuoteManual(payload).subscribe({
        next: (doc: Quote) => { this.done.set(doc); this.busy.set(false); },
        error: () => { this.busy.set(false); this.error.set(true); },
      });
    } else {
      this.api.createInvoiceManual(payload).subscribe({
        next: (doc: Invoice) => { this.done.set(doc); this.busy.set(false); },
        error: () => { this.busy.set(false); this.error.set(true); },
      });
    }
  }

  openPdf() {
    const doc = this.done();
    if (!doc) return;
    const isQuote = this.docType() === 'quote';
    const url = isQuote
      ? `${this.apiBase}/api/quotes/${doc.id}/pdf`
      : `${this.apiBase}/api/invoices/${doc.id}/pdf`;
    fetch(url, { headers: { Authorization: `Bearer ${this.auth.token()}` } })
      .then(r => r.blob())
      .then(b => window.open(URL.createObjectURL(b), '_blank'));
  }

  reset() {
    this.docType.set(null);
    this.selectedProject.set(undefined);
    this.customer = { name: '', company: '', email: '', phone: '', ice: '', address: '' };
    this.lines = [];
    this.done.set(null);
    this.error.set(false);
    this.subtotal.set(0);
    this.vat.set(0);
    this.total.set(0);
  }
}
