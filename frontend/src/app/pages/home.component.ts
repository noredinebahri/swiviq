import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TPipe } from '../core/i18n/i18n.service';
import { SeoService, SITE_URL } from '../core/seo.service';
import { ServiceIconComponent } from '../shared/svg';
import { HeroLogo3dComponent } from '../shared/hero-logo-3d.component';
import { RevealDirective } from '../shared/reveal.directive';
import { SERVICE_IDS } from './services.data';

@Component({
  selector: 'svq-home',
  imports: [RouterLink, TPipe, HeroLogo3dComponent, ServiceIconComponent, RevealDirective],
  template: `
    <!-- ============ HERO ============ -->
    <section class="hero section--dark">
      <div class="hero__bg" aria-hidden="true"></div>
      <div class="container hero__in">
        <div class="hero__copy">
          <span class="chip hero__badge" svqReveal>
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#2060f0"/></svg>
            {{ 'hero.badge' | t }}
          </span>
          <h1 svqReveal class="reveal-d1">
            {{ 'hero.title1' | t }}
            <span class="text-gradient">{{ 'hero.titleGrad' | t }}</span>
            {{ 'hero.title2' | t }}
          </h1>
          <p svqReveal class="reveal-d2">{{ 'hero.sub' | t }}</p>
          <div class="hero__cta" svqReveal>
            <a routerLink="/devis" class="btn btn--primary">{{ 'hero.cta1' | t }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <a routerLink="/services" class="btn btn--ghost">{{ 'hero.cta2' | t }}</a>
          </div>
          <div class="hero__stats" svqReveal>
            <div><strong>8</strong><span>{{ 'hero.stat1' | t }}</span></div>
            <div><strong>15+</strong><span>{{ 'hero.stat2' | t }}</span></div>
            <div><strong>{{ 'hero.stat3v' | t }}</strong><span>{{ 'hero.stat3' | t }}</span></div>
          </div>
        </div>
        <div class="hero__art" svqReveal>
          <svq-hero-logo-3d />
        </div>
      </div>
    </section>

    <!-- ============ SERVICES ============ -->
    <section class="section" id="services">
      <div class="container">
        <div class="section-head center" svqReveal>
          <span class="eyebrow">{{ 'services.eyebrow' | t }}</span>
          <h2 class="section-title">{{ 'services.title' | t }}</h2>
          <p class="section-sub">{{ 'services.sub' | t }}</p>
        </div>
        <div class="grid grid-4">
          @for (id of serviceIds; track id; let i = $index) {
            <a class="card svc" [routerLink]="['/services', id]" svqReveal [class]="'reveal-d' + ((i % 4) + 1)">
              <svq-icon [name]="id" [size]="46" />
              <h3>{{ 'services.items.' + id + '.title' | t }}</h3>
              <p>{{ 'services.items.' + id + '.desc' | t }}</p>
              <span class="svc__more">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ============ WHY ============ -->
    <section class="section section--soft">
      <div class="container">
        <div class="section-head" svqReveal>
          <span class="eyebrow">{{ 'why.eyebrow' | t }}</span>
          <h2 class="section-title">{{ 'why.title' | t }}</h2>
        </div>
        <div class="grid grid-2 why">
          @for (n of [1,2,3,4]; track n) {
            <div class="card why__item" svqReveal [class]="'reveal-d' + n">
              <div class="why__num">0{{ n }}</div>
              <div>
                <h3>{{ 'why.i' + n + 't' | t }}</h3>
                <p>{{ 'why.i' + n + 'd' | t }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ============ PROCESS ============ -->
    <section class="section section--dark process">
      <div class="container">
        <div class="section-head center" svqReveal>
          <span class="eyebrow">{{ 'process.eyebrow' | t }}</span>
          <h2 class="section-title">{{ 'process.title' | t }}</h2>
        </div>
        <div class="grid grid-4">
          @for (n of [1,2,3,4]; track n) {
            <div class="glass process__step" svqReveal [class]="'reveal-d' + n">
              <span class="process__n">{{ n }}</span>
              <h3>{{ 'process.s' + n + 't' | t }}</h3>
              <p>{{ 'process.s' + n + 'd' | t }}</p>
            </div>
          }
        </div>
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
    .hero { position: relative; padding-top: calc(var(--header-h) + 3.5rem); padding-bottom: 4.5rem; overflow: hidden; }
    .hero__bg { position: absolute; inset: 0; background: var(--grad-hero); pointer-events: none; }
    .hero__in { position: relative; display: grid; grid-template-columns: 1.05fr .95fr; gap: 3rem; align-items: center; }
    .hero__badge { background: rgba(255,255,255,.07); color: var(--c-text-inverse); border: 1px solid rgba(255,255,255,.13); }
    .hero h1 { font-size: clamp(2.2rem, 5vw, 3.6rem); margin-block: 1.2rem; }
    .hero p { font-size: 1.1rem; max-width: 540px; }
    .hero__cta { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
    .hero__stats { display: flex; gap: 2.5rem; margin-top: 3rem; }
    .hero__stats div { display: flex; flex-direction: column; }
    .hero__stats strong { font-family: var(--font-display); font-size: 1.7rem; color: #fff; }
    .hero__stats span { font-size: .85rem; color: var(--c-text-inverse-soft); }
    @media (max-width: 960px) {
      .hero__in { grid-template-columns: 1fr; }
      .hero__art { max-width: 480px; margin-inline: auto; }
    }

    /* SERVICES */
    .svc { position: relative; display: flex; flex-direction: column; gap: .8rem; padding-bottom: 3.2rem; }
    .svc h3 { font-size: 1.08rem; }
    .svc p { font-size: .9rem; color: var(--c-text-soft); }
    .svc__more {
      position: absolute; bottom: 1.3rem; inset-inline-start: 1.8rem; color: var(--c-primary);
      transition: transform .3s var(--ease-out); 
    }
    .svc:hover .svc__more { transform: translateX(6px); }
    [dir='rtl'] .svc__more svg { transform: scaleX(-1); }
    [dir='rtl'] .svc:hover .svc__more { transform: translateX(-6px); }

    /* WHY */
    .why__item { display: flex; gap: 1.3rem; }
    .why__num {
      font-family: var(--font-display); font-weight: 700; font-size: 1.6rem;
      background: var(--grad-brand); -webkit-background-clip: text; background-clip: text; color: transparent;
      line-height: 1;
    }
    .why__item h3 { font-size: 1.1rem; margin-bottom: .4rem; }
    .why__item p { font-size: .93rem; color: var(--c-text-soft); }

    /* PROCESS */
    .process__step { padding: 1.8rem; position: relative; }
    .process__n {
      display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 12px;
      background: var(--grad-brand); color: #fff; font-weight: 700; font-family: var(--font-display);
      margin-bottom: 1rem;
    }
    .process__step h3 { font-size: 1.05rem; margin-bottom: .4rem; }
    .process__step p { font-size: .9rem; }

    /* CTA */
    .cta-panel {
      position: relative; text-align: center; padding: clamp(3rem, 6vw, 5rem) 2rem;
      background: var(--c-ink); border-radius: var(--radius-xl); overflow: hidden; color: #fff;
    }
    .cta-panel__glow {
      position: absolute; inset: 0;
      background: radial-gradient(500px 260px at 50% 120%, rgba(116,83,242,.55), transparent 65%),
                  radial-gradient(400px 200px at 80% -20%, rgba(32,96,240,.3), transparent 60%);
    }
    .cta-panel h2 { position: relative; color: #fff; font-size: clamp(1.8rem, 4vw, 2.6rem); }
    .cta-panel p { position: relative; color: var(--c-text-inverse-soft); margin-top: .8rem; }
    .cta-panel__actions {
      position: relative; display: flex; align-items: center; justify-content: center; gap: 1rem;
      margin-top: 2rem; flex-wrap: wrap; color: var(--c-text-inverse-soft);
    }
    .cta-panel__link { color: var(--c-accent); font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
  `],
})
export class HomeComponent implements OnInit {
  private seo = inject(SeoService);
  serviceIds = SERVICE_IDS;

  ngOnInit() {
    this.seo.apply({
      // Mots-clés en tête (marque encore inconnue = zéro CTR sur le nom seul)
      title: 'Agence Digitale au Maroc — Création d\'Applications & SaaS | SWIVIQ',
      description: 'SWIVIQ, agence digitale à Rabat : création d\'applications web et mobiles, solutions SaaS et sites e-commerce partout au Maroc. Devis PDF instantané en 2 minutes, à partir de 8 000 MAD.',
      path: '/',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: 'SWIVIQ',
          inLanguage: 'fr',
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
        // Le bloc ProfessionalService autonome a été fusionné dans
        // l'entité #organization (seo.service.ts) : deux nœuds décrivant la
        // même entreprise créaient un doublon d'entité pour Google.
      ],
    });
  }
}
