import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TPipe } from '../core/i18n/i18n.service';
import { SeoService, SITE_URL } from '../core/seo.service';
import { RevealDirective } from '../shared/reveal.directive';
import { ApiService, Product, Plan } from '../core/api.service';

@Component({
  selector: 'svq-products',
  imports: [RouterLink, TPipe, RevealDirective],
  template: `
    <!-- ============ HERO ============ -->
    <section class="phero section--dark">
      <div class="phero__bg" aria-hidden="true"></div>
      <div class="container phero__in">
        <span class="chip phero__badge" svqReveal>
          <span class="dot"></span>{{ 'products.eyebrow' | t }}
        </span>
        <h1 svqReveal class="reveal-d1">
          {{ 'products.title' | t }}
        </h1>
        <p svqReveal class="reveal-d2">{{ 'products.sub' | t }}</p>
        <div class="phero__stats" svqReveal>
          <div><strong>{{ products().length }}</strong><span>{{ 'products.statsProducts' | t }}</span></div>
          <div><strong>{{ saasCount() }}</strong><span>{{ 'products.statsSaaS' | t }}</span></div>
          <div><strong>{{ liveCount() }}</strong><span>{{ 'products.statsLive' | t }}</span></div>
        </div>
      </div>
      <div class="phero__wave" aria-hidden="true"></div>
    </section>

    <!-- ============ LIST ============ -->
    <section class="section">
      <div class="container">
        @if (loading()) {
          <div class="loader"><span class="spinner"></span></div>
        } @else if (!products().length) {
          <p class="empty">{{ 'common.loading' | t }}</p>
        } @else {
          <div class="cards">
            @for (p of products(); track p.slug; let i = $index) {
              <article class="pcard" [routerLink]="['/produits', p.slug]" svqReveal [class]="'reveal-d' + ((i % 3) + 1)">
                <div class="pcard__media" [class]="'media--' + p.type">
                  <img [src]="p.coverUrl" [alt]="p.name" loading="lazy" />
                  <span class="pcard__type" [class]="'t-' + p.type">{{ typeLabel(p.type) | t }}</span>
                  @if (p.status !== 'live') {
                    <span class="pcard__status" [class]="'s-' + p.status">{{ statusLabel(p.status) | t }}</span>
                  }
                  <div class="pcard__glow" aria-hidden="true"></div>
                </div>
                <div class="pcard__body">
                  <h3>{{ p.name }}</h3>
                  <p class="pcard__tag">{{ p.tagline }}</p>
                  <div class="pcard__tech">
                    @for (tech of topTech(p); track tech) {
                      <span class="tech-chip">{{ tech }}</span>
                    }
                    @if (p.technologies.length > 4) {
                      <span class="tech-chip tech-more">+{{ p.technologies.length - 4 }}</span>
                    }
                  </div>
                  <div class="pcard__foot">
                    @if (p.type === 'saas' && p.plans.length) {
                      <span class="pcard__price">{{ minPrice(p) }}<small>{{ priceInterval(minPlan(p)) | t }}</small></span>
                    } @else {
                      <span class="pcard__price pcard__price--na">{{ typeLabel(p.type) | t }}</span>
                    }
                    <span class="pcard__cta">
                      {{ 'products.explore' | t }}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>

    <!-- ============ CTA ============ -->
    <section class="section">
      <div class="container">
        <div class="cta-panel" svqReveal>
          <div class="cta-panel__glow" aria-hidden="true"></div>
          <h2>{{ 'cta.title' | t }}</h2>
          <p>{{ 'cta.sub' | t }}</p>
          <div class="cta-panel__actions">
            <a routerLink="/devis" class="btn btn--primary">{{ 'cta.btn' | t }}</a>
            <span>{{ 'cta.or' | t }}</span>
            <a routerLink="/contact" class="cta-panel__link">{{ 'cta.contact' | t }}</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* HERO */
    .phero { position: relative; padding-top: calc(var(--header-h) + 4rem); padding-bottom: 5rem; overflow: hidden; }
    .phero__bg { position: absolute; inset: 0; background: var(--grad-hero); pointer-events: none; }
    .phero__in { position: relative; max-width: 760px; }
    .phero__badge { background: rgba(255,255,255,.07); color: var(--c-text-inverse); border: 1px solid rgba(255,255,255,.13); }
    .phero__badge .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c-accent); box-shadow: 0 0 14px var(--c-accent); }
    .phero h1 { color: #fff; font-size: clamp(2.2rem, 5vw, 3.6rem); margin-block: 1.2rem; }
    .phero p { color: var(--c-text-inverse-soft); font-size: 1.1rem; max-width: 600px; }
    .phero__stats { display: flex; gap: 2.5rem; margin-top: 2.5rem; flex-wrap: wrap; }
    .phero__stats div { display: flex; flex-direction: column; }
    .phero__stats strong { font-family: var(--font-display); font-size: 1.8rem; color: #fff; }
    .phero__stats span { font-size: .82rem; color: var(--c-text-inverse-soft); }
    .phero__wave {
      position: absolute; left: 0; right: 0; bottom: -1px; height: 90px;
      background: radial-gradient(60% 100% at 20% 100%, rgba(116,83,242,.25), transparent 60%),
                  radial-gradient(60% 100% at 80% 100%, rgba(32,96,240,.2), transparent 60%);
      filter: blur(20px); opacity: .8;
    }

    /* CARDS */
    .loader, .empty { text-align: center; padding: 3rem; color: var(--c-text-soft); }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.8rem; }
    @media (max-width: 960px) { .cards { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 640px) { .cards { grid-template-columns: 1fr; } }

    .pcard {
      position: relative; display: flex; flex-direction: column; border-radius: var(--radius-lg);
      overflow: hidden; background: #fff; border: 1px solid var(--c-border); cursor: pointer;
      transition: transform .4s var(--ease-out), box-shadow .4s var(--ease-out), border-color .4s;
    }
    .pcard:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); border-color: rgba(116,83,242,.4); }

    .pcard__media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; }
    .pcard__media img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s var(--ease-out); }
    .pcard:hover .pcard__media img { transform: scale(1.06); }
    .pcard__media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(15,15,15,.5)); }
    .pcard__glow {
      position: absolute; inset: 0; opacity: 0; transition: opacity .4s;
      background: radial-gradient(420px 200px at 50% 100%, rgba(116,83,242,.45), transparent 60%);
    }
    .pcard:hover .pcard__glow { opacity: 1; }

    .pcard__type {
      position: absolute; top: 12px; inset-inline-start: 12px; z-index: 2;
      padding: .3rem .7rem; border-radius: 999px; font-size: .72rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: .06em; color: #fff; backdrop-filter: blur(6px);
    }
    .t-app { background: rgba(32,96,240,.7); }
    .t-website { background: rgba(16,185,129,.7); }
    .t-saas { background: rgba(116,83,242,.8); }

    .pcard__status {
      position: absolute; top: 12px; inset-inline-end: 12px; z-index: 2;
      padding: .3rem .7rem; border-radius: 999px; font-size: .72rem; font-weight: 700;
      color: #fff; backdrop-filter: blur(6px); background: rgba(245,158,11,.8);
    }
    .s-coming-soon { background: rgba(116,83,242,.7); }

    .pcard__body { padding: 1.4rem; display: flex; flex-direction: column; gap: .7rem; flex: 1; }
    .pcard__body h3 { font-size: 1.2rem; }
    .pcard__tag { font-size: .9rem; color: var(--c-text-soft); flex: 1; }
    .pcard__tech { display: flex; flex-wrap: wrap; gap: .35rem; }
    .tech-chip { font-size: .74rem; font-weight: 600; padding: .2rem .55rem; border-radius: 6px; background: var(--c-surface); color: var(--c-text-soft); }
    .tech-more { background: var(--grad-brand-soft); color: var(--c-primary); }

    .pcard__foot { display: flex; align-items: center; justify-content: space-between; padding-top: .8rem; margin-top: .4rem; border-top: 1px solid var(--c-border); }
    .pcard__price { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--c-primary); display: flex; align-items: baseline; gap: .2rem; }
    .pcard__price small { font-size: .78rem; font-weight: 500; color: var(--c-text-soft); }
    .pcard__price--na { font-size: .82rem; color: var(--c-text-soft); font-family: var(--font-body); }
    .pcard__cta { display: inline-flex; align-items: center; gap: .35rem; font-weight: 700; font-size: .86rem; color: var(--c-primary); transition: transform .3s var(--ease-out); }
    .pcard:hover .pcard__cta { transform: translateX(5px); }
    [dir='rtl'] .pcard__cta svg { transform: scaleX(-1); }
    [dir='rtl'] .pcard:hover .pcard__cta { transform: translateX(-5px); }

    /* CTA */
    .cta-panel { position: relative; text-align: center; padding: clamp(3rem, 6vw, 5rem) 2rem; background: var(--c-ink); border-radius: var(--radius-xl); overflow: hidden; color: #fff; }
    .cta-panel__glow { position: absolute; inset: 0; background: radial-gradient(500px 260px at 50% 120%, rgba(116,83,242,.55), transparent 65%), radial-gradient(400px 200px at 80% -20%, rgba(32,96,240,.3), transparent 60%); }
    .cta-panel h2 { position: relative; color: #fff; font-size: clamp(1.8rem, 4vw, 2.6rem); }
    .cta-panel p { position: relative; color: var(--c-text-inverse-soft); margin-top: .8rem; }
    .cta-panel__actions { position: relative; display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; color: var(--c-text-inverse-soft); }
    .cta-panel__link { color: var(--c-accent); font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
  `],
})
export class ProductsComponent implements OnInit {
  private seo = inject(SeoService);
  private api = inject(ApiService);

  products = signal<Product[]>([]);
  loading = signal(true);

  saasCount = computed(() => this.products().filter(p => p.type === 'saas').length);
  liveCount = computed(() => this.products().filter(p => p.status === 'live').length);

  ngOnInit() {
    this.seo.apply({
      title: 'Nos produits — Applications, sites web & solutions SaaS | SWIVIQ',
      description: 'Découvrez les produits digitaux édités par SWIVIQ : applications web & mobiles, sites web et plateformes SaaS prêtes à l\'emploi ou personnalisables.',
      path: '/produits',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: this.products().map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/produits/${p.slug}` })),
      },
    });
    this.api.getProducts().subscribe({
      next: list => { this.products.set(list); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  typeLabel(type: string) { return type === 'saas' ? 'products.typeSaaS' : type === 'app' ? 'products.typeApp' : 'products.typeWebsite'; }
  statusLabel(status: string) { return status === 'beta' ? 'products.beta' : 'products.comingSoon'; }
  topTech(p: Product) { return p.technologies.slice(0, 4); }
  minPlan(p: Product) { return p.plans.length ? p.plans.reduce((a, b) => a.price < b.price ? a : b) : undefined; }
  minPrice(p: Product) { const m = this.minPlan(p); return m?.price ?? 0; }
  priceInterval(plan: Plan | undefined) { return plan?.interval === 'year' ? 'products.perYear' : plan?.interval === 'one-time' ? 'products.oneTime' : 'products.perMonth'; }
}