import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TPipe, I18nService } from '../core/i18n/i18n.service';
import { SeoService } from '../core/seo.service';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'svq-about',
  imports: [RouterLink, TPipe, RevealDirective],
  template: `
    <section class="page-head section--dark">
      <div class="container">
        <h1 svqReveal>{{ 'about.title' | t }}</h1>
        <p svqReveal class="reveal-d1">{{ 'about.sub' | t }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container about">
        <div class="about__text" svqReveal>
          <p>{{ 'about.p1' | t }}</p>
          <p>{{ 'about.p2' | t }}</p>
        </div>

        <div class="grid grid-2">
          <div class="card" svqReveal>
            <h2>{{ 'about.missionT' | t }}</h2>
            <p>{{ 'about.missionD' | t }}</p>
          </div>
          <div class="card reveal-d1" svqReveal>
            <h2>{{ 'about.valuesT' | t }}</h2>
            <ul class="values">
              <li>{{ 'about.v1' | t }}</li>
              <li>{{ 'about.v2' | t }}</li>
              <li>{{ 'about.v3' | t }}</li>
              <li>{{ 'about.v4' | t }}</li>
            </ul>
          </div>
        </div>

        <div class="card legal" svqReveal>
          <h2>{{ 'about.legalT' | t }}</h2>
          <dl>
            <div><dt>Raison sociale</dt><dd>SWIVIQ SARL AU</dd></div>
            <div><dt>Capital social</dt><dd>100 000,00 MAD</dd></div>
            <div><dt>ICE</dt><dd>003963563000019</dd></div>
            <div><dt>IF</dt><dd>73099178</dd></div>
            <div><dt>RC</dt><dd>200173 — Tribunal de Commerce de Rabat</dd></div>
            <div><dt>Taxe professionnelle</dt><dd>25116641</dd></div>
            <div><dt>Siège social</dt><dd>Imm 30, Appt 8, Rue Moulay Ahmed Loukili, Hassan, Rabat</dd></div>
            <div><dt>Gérant</dt><dd>Noredine Bahri</dd></div>
          </dl>
        </div>

        <div class="cta" svqReveal>
          <a routerLink="/devis" class="btn btn--primary">{{ 'cta.btn' | t }}</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-head { padding: calc(var(--header-h) + 3.5rem) 0 3.5rem; background: var(--c-ink); position: relative; overflow: hidden; }
    .page-head::before { content: ''; position: absolute; inset: 0; background: var(--grad-hero); }
    .page-head .container { position: relative; }
    .page-head h1 { color: #fff; font-size: clamp(2rem, 4.5vw, 3rem); margin-bottom: .8rem; }
    .page-head p { color: var(--c-text-inverse-soft); }
    .about__text { max-width: 760px; margin-bottom: 2.5rem; }
    .about__text p { margin-bottom: 1rem; color: var(--c-text-soft); font-size: 1.05rem; }
    .card h2 { font-size: 1.2rem; margin-bottom: .8rem; }
    .card p { color: var(--c-text-soft); font-size: .95rem; }
    .values { list-style: none; }
    .values li { padding: .35rem 0; padding-inline-start: 1.6rem; position: relative; color: var(--c-text-soft); }
    .values li::before {
      content: ''; position: absolute; inset-inline-start: 0; top: .75rem; width: 10px; height: 10px;
      border-radius: 3px; background: var(--grad-brand);
    }
    .legal { margin-top: 1.5rem; }
    .legal dl { display: grid; grid-template-columns: repeat(2, 1fr); gap: .8rem 2rem; }
    .legal dt { font-size: .78rem; text-transform: uppercase; letter-spacing: .06em; color: var(--c-text-soft); font-weight: 700; }
    .legal dd { font-weight: 600; }
    @media (max-width: 640px) { .legal dl { grid-template-columns: 1fr; } }
    .cta { text-align: center; margin-top: 3rem; }
  `],
})
export class AboutComponent implements OnInit {
  private seo = inject(SeoService);
  private i18n = inject(I18nService);

  ngOnInit() {
    this.seo.apply({
      title: this.i18n.t('seo.about.title'),
      description: this.i18n.t('seo.about.desc'),
      path: '/a-propos',
      breadcrumb: [
        { name: 'Accueil', path: '/' },
        { name: 'À propos' },
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'À propos de SWIVIQ',
        url: 'https://swiviq.com/a-propos',
        isPartOf: { '@id': 'https://swiviq.com/#website' },
        about: { '@id': 'https://swiviq.com/#organization' },
        description: 'SWIVIQ SARL AU, agence digitale basée à Rabat : histoire, méthode et informations légales.',
      },
    });
  }
}
