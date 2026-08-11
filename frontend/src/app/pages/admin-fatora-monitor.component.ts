import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../core/api-base';
import { SeoService } from '../core/seo.service';

interface Health {
  uptime: number; memoryMb: number; node: string; startedAt: number;
  db: string; redis: string; storage: { pdf: number; mb: number } | null;
  last24h: { invoices: number; errors: number; gemini: number; conversations: number };
  lastError: { time: number; msg: string; detail: string } | null;
}
interface LogEntry { time: number; level: string; type: string; msg: string; detail: string; }

const REFRESH_MS = 180000; // 3 minutes

@Component({
  selector: 'svq-admin-fatora-monitor',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="head">
      <h1 class="pg-title">Fatora-Bot — supervision</h1>
      <div class="live">
        <span class="dot" [class.ko]="health()?.db !== 'ok'"></span>
        <span>Actualisation dans {{ countdown() }} s</span>
        <button class="btn btn--ghost btn--sm" (click)="refresh()">Actualiser</button>
      </div>
    </div>

    @if (error()) { <div class="alert">{{ error() }}</div> }

    <!-- État des services -->
    @if (health(); as h) {
      <div class="kpis">
        <div class="kpi"><b [class.ok]="h.db === 'ok'" [class.ko]="h.db !== 'ok'">{{ h.db === 'ok' ? 'OK' : 'KO' }}</b><span>Base de données</span></div>
        <div class="kpi"><b [class.ok]="h.redis === 'ok'" [class.ko]="h.redis === 'ko'">{{ h.redis === 'ok' ? 'OK' : h.redis === 'off' ? '—' : 'KO' }}</b><span>Redis / files</span></div>
        <div class="kpi"><b>{{ uptime(h.uptime) }}</b><span>En service depuis</span></div>
        <div class="kpi"><b>{{ h.memoryMb }} Mo</b><span>Mémoire</span></div>
        <div class="kpi"><b>{{ h.storage?.pdf || 0 }}</b><span>PDF stockés ({{ h.storage?.mb || 0 }} Mo)</span></div>
      </div>

      <div class="kpis">
        <div class="kpi acc"><b>{{ h.last24h.invoices }}</b><span>Factures · 24 h</span></div>
        <div class="kpi acc"><b>{{ h.last24h.conversations }}</b><span>Conversations · 24 h</span></div>
        <div class="kpi acc"><b>{{ h.last24h.gemini }}</b><span>Appels IA · 24 h</span></div>
        <div class="kpi" [class.warn]="h.last24h.errors > 0"><b>{{ h.last24h.errors }}</b><span>Erreurs · 24 h</span></div>
      </div>

      @if (h.lastError) {
        <div class="lasterr">
          <strong>Dernière erreur</strong> · {{ h.lastError.time | date:'dd/MM HH:mm:ss' }}
          <div>{{ h.lastError.msg }}</div>
          @if (h.lastError.detail && h.lastError.detail !== '{}') { <code>{{ h.lastError.detail }}</code> }
        </div>
      }
    }

    <!-- Journaux -->
    <div class="bar">
      <div class="chips">
        <button class="chip" [class.on]="type === ''" (click)="setType('')">Tout ({{ total() }})</button>
        @for (t of types; track t) {
          <button class="chip" [class.on]="type === t" (click)="setType(t)">
            {{ t }} @if (counts()[t]) { <i>{{ counts()[t] }}</i> }
          </button>
        }
      </div>
      <input [(ngModel)]="q" (keyup.enter)="refresh()" placeholder="Filtrer (numéro, client, message…)" />
    </div>

    <div class="card logs">
      @for (l of logs(); track $index) {
        <div class="line" [class.err]="l.level === 'error'" [class.warn]="l.level === 'warn'">
          <span class="t">{{ l.time | date:'dd/MM HH:mm:ss' }}</span>
          <span class="ty" [attr.data-t]="l.type">{{ l.type }}</span>
          <span class="m">{{ l.msg }}<i>{{ l.detail }}</i></span>
        </div>
      } @empty {
        <div class="empty-td">Aucune entrée</div>
      }
    </div>
  `,
  styles: [`
    .head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .pg-title { font-size: 1.5rem; }
    .live { display: flex; align-items: center; gap: .6rem; color: var(--c-text-soft, #6b7280); font-size: .82rem; }
    .dot { width: 9px; height: 9px; border-radius: 50%; background: #2f9e6d; box-shadow: 0 0 0 0 rgba(47,158,109,.6); animation: pulse 2s infinite; }
    .dot.ko { background: #b3261e; }
    @keyframes pulse { 70% { box-shadow: 0 0 0 8px rgba(47,158,109,0); } 100% { box-shadow: 0 0 0 0 rgba(47,158,109,0); } }
    .alert { background: #fdecea; color: #b3261e; padding: .8rem 1rem; border-radius: 10px; margin-bottom: 1rem; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: .7rem; margin-bottom: .8rem; }
    .kpi { background: #fff; border: 1px solid var(--c-border, #e3e6ee); border-radius: 12px; padding: .8rem 1rem;
      b { display: block; font-size: 1.3rem; } span { color: var(--c-text-soft, #6b7280); font-size: .74rem; } }
    .kpi b.ok { color: #2f9e6d; } .kpi b.ko { color: #b3261e; }
    .kpi.acc b { color: #a8761c; } .kpi.warn b { color: #b3261e; }
    .lasterr { background: #fff6f5; border: 1px solid #f3d2ce; border-radius: 12px; padding: .8rem 1rem; margin-bottom: 1rem; font-size: .85rem;
      code { display: block; margin-top: .4rem; font-size: .74rem; color: #8a5a55; word-break: break-all; } }
    .bar { display: flex; justify-content: space-between; gap: .8rem; flex-wrap: wrap; margin-bottom: .7rem;
      input { flex: 1; min-width: 200px; padding: .5rem .7rem; border-radius: 9px; border: 1.5px solid var(--c-border, #e3e6ee); } }
    .chips { display: flex; gap: .4rem; flex-wrap: wrap; }
    .chip { border: 1px solid var(--c-border, #e3e6ee); background: #fff; border-radius: 999px; padding: .35rem .8rem;
      font-size: .78rem; cursor: pointer; font-family: inherit;
      i { font-style: normal; opacity: .55; margin-inline-start: 4px; }
      &.on { background: #10131c; color: #fff; border-color: #10131c; } }
    .logs { padding: .3rem; max-height: 620px; overflow: auto; font-size: .78rem; }
    .line { display: grid; grid-template-columns: 118px 96px 1fr; gap: .6rem; padding: .42rem .6rem;
      border-bottom: 1px solid #f1f3f8; align-items: baseline;
      &.err { background: #fff6f5; } &.warn { background: #fffaf0; } }
    .t { color: #98a0b0; font-variant-numeric: tabular-nums; }
    .ty { font-size: .68rem; text-transform: uppercase; letter-spacing: .4px; color: #5b6272;
      background: #eef1f7; border-radius: 6px; padding: 1px 6px; text-align: center; }
    .ty[data-t="erreur"] { background: #fde7e5; color: #b3261e; }
    .ty[data-t="facture"] { background: #e8f6ee; color: #1c7a54; }
    .ty[data-t="ia"] { background: #fdf3e2; color: #a8761c; }
    .ty[data-t="envoi"] { background: #e9f0fd; color: #2b5bb5; }
    .m { color: #10131c; word-break: break-word;
      i { display: block; font-style: normal; color: #8a91a1; font-size: .72rem; margin-top: 2px; word-break: break-all; } }
    .empty-td { text-align: center; color: var(--c-text-soft, #6b7280); padding: 2rem; }
  `]
})
export class AdminFatoraMonitorComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private base = inject(API_BASE);
  private seo = inject(SeoService);

  readonly types = ['facture', 'conversation', 'ia', 'envoi', 'erreur', 'alerte', 'système'];
  health = signal<Health | null>(null);
  logs = signal<LogEntry[]>([]);
  counts = signal<Record<string, number>>({});
  total = signal(0);
  error = signal('');
  countdown = signal(REFRESH_MS / 1000);
  q = '';
  type = '';

  private timer?: ReturnType<typeof setInterval>;
  private tick?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.seo.noIndex('Supervision Fatora-Bot — SWIVIQ Admin');
    this.refresh();
    // Rafraîchissement automatique toutes les 3 minutes
    this.timer = setInterval(() => this.refresh(), REFRESH_MS);
    this.tick = setInterval(() => this.countdown.set(Math.max(0, this.countdown() - 1)), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    clearInterval(this.tick);
  }

  setType(t: string) { this.type = t; this.refresh(); }

  uptime(sec: number) {
    const d = Math.floor(sec / 86400), h = Math.floor((sec % 86400) / 3600), m = Math.floor((sec % 3600) / 60);
    return d ? `${d} j ${h} h` : h ? `${h} h ${m} min` : `${m} min`;
  }

  refresh() {
    this.countdown.set(REFRESH_MS / 1000);
    this.error.set('');
    const api = `${this.base}/api/admin/fatora`;
    this.http.get<Health>(`${api}/health`).subscribe({
      next: (h) => this.health.set(h),
      error: (e) => this.error.set(e?.error?.error || 'Service Fatora-Bot injoignable.')
    });
    const params: string[] = ['limit=200'];
    if (this.type) params.push('type=' + encodeURIComponent(this.type));
    if (this.q.trim()) params.push('q=' + encodeURIComponent(this.q.trim()));
    this.http.get<{ entries: LogEntry[]; counts: Record<string, number>; scanned: number }>(
      `${api}/logs?${params.join('&')}`
    ).subscribe({
      next: (r) => { this.logs.set(r.entries); this.counts.set(r.counts || {}); this.total.set(r.scanned); },
      error: () => {}
    });
  }
}
