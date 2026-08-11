import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SeoService, SITE_URL } from '../core/seo.service';
import { RevealDirective } from '../shared/reveal.directive';
import { ServiceIconComponent } from '../shared/svg';
import { CITIES, CITY_SLUGS, City } from './cities.data';
import { CITY_SERVICES, LOCAL_SERVICES, LOCAL_SERVICE_SLUGS, CityServiceContent } from './cities.services.data';

/**
 * Pages locales « agence par ville ».
 *
 * Contenu rédigé en français uniquement, comme les pages /services : c'est la
 * langue indexée par Google pour le marché marocain. Le sélecteur de langue du
 * site reste purement client-side et ne produit pas d'URL distincte — traduire
 * ces pages sans URL propre ne servirait pas le référencement.
 *
 * BALISAGE — Service + areaServed:City, jamais LocalBusiness : SWIVIQ n'a
 * d'établissement qu'à Rabat et déclarer une adresse locale par ville serait
 * un faux signal. Voir l'en-tête de cities.data.ts.
 */

/** Fabrique le bloc Service commun aux deux niveaux de page. */
function serviceJsonLd(opts: {
  url: string; name: string; description: string; cityName: string;
  serviceType?: string; price?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${opts.url}#service`,
    name: opts.name,
    ...(opts.serviceType ? { serviceType: opts.serviceType } : {}),
    description: opts.description,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'City', name: opts.cityName, addressCountry: 'MA' },
    url: opts.url,
    ...(opts.price
      ? {
          offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/devis`,
            price: opts.price,
            priceCurrency: 'MAD',
            availability: 'https://schema.org/InStock',
            description: `À partir de ${opts.price.toLocaleString('fr-FR')} MAD HT`,
          },
        }
      : {}),
  };
}

function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

const SHARED_STYLES = `
  .page-head { padding: calc(var(--header-h) + 3.5rem) 0 3.5rem; background: var(--c-ink); position: relative; overflow: hidden; }
  .page-head::before { content: ''; position: absolute; inset: 0; background: var(--grad-hero); }
  .page-head .container { position: relative; }
  .page-head h1 { color: #fff; font-size: clamp(1.6rem, 3.4vw, 2.4rem); margin-bottom: .8rem; }
  .page-head p { color: var(--c-text-inverse-soft); max-width: 760px; }
  .crumbs { position: relative; display: flex; flex-wrap: wrap; gap: .4rem; font-size: .8rem; margin-bottom: 1rem; color: var(--c-text-inverse-soft); }
  .crumbs a { color: var(--c-text-inverse-soft); text-decoration: underline; text-underline-offset: 3px; }
  .chip { display: inline-block; margin-top: 1rem; padding: .35rem .8rem; border-radius: 999px; font-size: .82rem; font-weight: 600;
          color: #fff; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.22); }

  .content-sections { max-width: 780px; margin: 0 auto 3rem; }
  .content-block { margin-bottom: 2.4rem; }
  .content-block h2 { font-size: 1.35rem; margin-bottom: .8rem; }
  .content-block p { color: var(--c-text-soft); line-height: 1.75; }
  .content-block ul { margin: .9rem 0 0 1.2rem; display: grid; gap: .45rem; }
  .content-block li { color: var(--c-text-soft); line-height: 1.6; }

  .sectors { max-width: 780px; margin: 0 auto 3rem; }
  .sectors h2 { font-size: 1.35rem; margin-bottom: 1rem; }
  .sectors ul { list-style: none; display: flex; flex-wrap: wrap; gap: .55rem; }
  .sectors li { padding: .4rem .85rem; border-radius: 999px; font-size: .85rem; color: var(--c-text-soft);
                border: 1px solid var(--c-border); }

  .cta-card { text-align: center; padding: 3rem 2rem; background: var(--grad-brand-soft); border-color: rgba(116,83,242,.25); }
  .cta-card h2 { margin-bottom: .6rem; }
  .cta-card p { color: var(--c-text-soft); margin-bottom: 1.6rem; }

  .faq { max-width: 780px; margin: 3.5rem auto 0; }
  .faq > h2 { font-size: 1.45rem; margin-bottom: 1.2rem; }
  .faq-item { border: 1px solid var(--c-border, rgba(120,120,140,.18)); border-radius: 12px; padding: 1rem 1.3rem; margin-bottom: .8rem; }
  .faq-item summary { cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; }
  .faq-item summary::after { content: '+'; font-size: 1.3rem; opacity: .55; margin-left: 1rem; }
  .faq-item[open] summary::after { content: '–'; }
  .faq-item summary h3 { font-size: 1rem; font-weight: 600; margin: 0; display: inline; }
  .faq-item p { margin-top: .8rem; color: var(--c-text-soft); line-height: 1.7; }

  .links { margin-top: 4rem; }
  .links h2, .links h3 { margin-bottom: 1.3rem; font-size: 1.2rem; }
  .mini { display: flex; align-items: center; gap: .9rem; padding: 1.1rem 1.3rem; font-weight: 600; font-size: .9rem; }
  .mini small { display: block; font-weight: 500; color: var(--c-text-soft); font-size: .78rem; margin-top: .15rem; }
`;

/* ===================== /agence — index des villes ===================== */
@Component({
  selector: 'svq-agencies',
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="page-head">
      <div class="container">
        <nav class="crumbs" aria-label="Fil d'Ariane"><a routerLink="/">Accueil</a> <span>›</span> <span>Agence par ville</span></nav>
        <h1 svqReveal>Agence de développement web et mobile au Maroc</h1>
        <p svqReveal class="reveal-d1">
          SWIVIQ est établie à Rabat et intervient dans tout le Maroc. Chaque page ci-dessous
          détaille notre approche pour une ville : secteurs dominants, contraintes de terrain,
          modalités d'intervention et tarifs. La grille est nationale — elle ne varie pas
          selon la ville.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid-4">
          @for (c of cities; track c.slug; let i = $index) {
            <a class="card mini" [routerLink]="['/agence', c.slug]" svqReveal [class]="'reveal-d' + ((i % 4) + 1)">
              <span>{{ c.name }}<small>{{ c.region }}</small></span>
            </a>
          }
        </div>

        <div class="links">
          <h2>Nos services dans tout le Maroc</h2>
          <div class="grid grid-4">
            @for (s of services; track s.slug) {
              <a class="card mini" [routerLink]="['/services', s.serviceId]">
                <span>{{ s.label }}<small>dès {{ s.startingPrice.toLocaleString('fr-FR') }} MAD HT</small></span>
              </a>
            }
          </div>
        </div>

        <div class="card cta-card" svqReveal style="margin-top:3rem">
          <h2>Un projet, où que vous soyez au Maroc</h2>
          <p>Configurez votre besoin et recevez un devis PDF détaillé en deux minutes.</p>
          <a routerLink="/devis" class="btn btn--primary">Obtenir mon devis</a>
        </div>
      </div>
    </section>
  `,
  styles: [SHARED_STYLES],
})
export class AgenciesComponent implements OnInit {
  private seo = inject(SeoService);
  cities = CITY_SLUGS.map(s => CITIES[s]);
  services = LOCAL_SERVICES;

  ngOnInit() {
    this.seo.apply({
      title: 'Agence de Développement Web & Mobile au Maroc — Par Ville | SWIVIQ',
      description:
        'Agence digitale basée à Rabat, intervenant à Casablanca, Marrakech, Tanger, Fès, Agadir, Kénitra et Oujda. Applications web, mobiles et e-commerce à partir de 18 000 MAD HT.',
      path: '/agence',
      breadcrumb: [{ name: 'Accueil', path: '/' }, { name: 'Agence par ville' }],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Agence de développement web et mobile au Maroc',
        url: `${SITE_URL}/agence`,
        about: { '@id': `${SITE_URL}/#organization` },
        hasPart: this.cities.map(c => ({
          '@type': 'WebPage',
          name: c.h1,
          url: `${SITE_URL}/agence/${c.slug}`,
        })),
      },
    });
  }
}

/* ==================== /agence/:city — hub par ville ==================== */
@Component({
  selector: 'svq-city',
  imports: [RouterLink, RevealDirective, ServiceIconComponent],
  template: `
    @if (city(); as c) {
      <section class="page-head">
        <div class="container">
          <nav class="crumbs" aria-label="Fil d'Ariane">
            <a routerLink="/">Accueil</a> <span>›</span>
            <a routerLink="/agence">Agence par ville</a> <span>›</span>
            <span>{{ c.name }}</span>
          </nav>
          <h1 svqReveal>{{ c.h1 }}</h1>
          <p svqReveal class="reveal-d1">{{ c.intro }}</p>
          <span class="chip" svqReveal>Interventions {{ c.in }} — {{ c.region }}</span>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="content-sections">
            @for (sec of c.sections; track sec.title; let i = $index) {
              <div class="content-block" svqReveal [class]="'reveal-d' + ((i % 3) + 1)">
                <h2>{{ sec.title }}</h2>
                <p>{{ sec.body }}</p>
                @if (sec.bullets?.length) {
                  <ul>@for (b of sec.bullets; track b) { <li>{{ b }}</li> }</ul>
                }
              </div>
            }
          </div>

          <div class="sectors" svqReveal>
            <h2>Secteurs que nous accompagnons {{ c.in }}</h2>
            <ul>@for (s of c.sectors; track s) { <li>{{ s }}</li> }</ul>
          </div>

          <div class="links">
            <h2>Nos prestations {{ c.in }}</h2>
            <div class="grid grid-3">
              @for (s of services; track s.slug) {
                <a class="card mini" [routerLink]="['/agence', c.slug, s.slug]">
                  <svq-icon [name]="s.serviceId" [size]="30" />
                  <span>{{ s.label }}<small>dès {{ s.startingPrice.toLocaleString('fr-FR') }} MAD HT</small></span>
                </a>
              }
            </div>
          </div>

          <div class="card cta-card" svqReveal style="margin-top:3rem">
            <h2>Un projet {{ c.in }} ?</h2>
            <p>Configurez votre besoin et recevez un devis PDF détaillé en deux minutes.</p>
            <a routerLink="/devis" class="btn btn--primary">Obtenir mon devis</a>
          </div>

          <div class="faq" svqReveal>
            <h2>Questions fréquentes — {{ c.name }}</h2>
            @for (item of c.faq; track item.q) {
              <details class="faq-item">
                <summary><h3>{{ item.q }}</h3></summary>
                <p>{{ item.a }}</p>
              </details>
            }
          </div>

          <div class="links">
            <h3>Nos autres villes</h3>
            <div class="grid grid-4">
              @for (o of others(); track o.slug) {
                <a class="card mini" [routerLink]="['/agence', o.slug]">
                  <span>{{ o.name }}<small>{{ o.region }}</small></span>
                </a>
              }
            </div>
          </div>
        </div>
      </section>
    }
  `,
  styles: [SHARED_STYLES],
})
export class CityComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);

  city = signal<City | null>(null);
  services = LOCAL_SERVICES;
  others = computed(() => CITY_SLUGS.filter(s => s !== this.city()?.slug).map(s => CITIES[s]));

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('city') ?? '';
      const c = CITIES[slug];
      if (!c) {
        this.router.navigateByUrl('/404');
        return;
      }
      this.city.set(c);
      const url = `${SITE_URL}/agence/${c.slug}`;

      this.seo.apply({
        title: c.seoTitle,
        description: c.seoDesc,
        path: `/agence/${c.slug}`,
        breadcrumb: [
          { name: 'Accueil', path: '/' },
          { name: 'Agence par ville', path: '/agence' },
          { name: c.name },
        ],
        jsonLd: [
          serviceJsonLd({
            url,
            name: c.h1,
            description: c.seoDesc,
            cityName: c.name,
            serviceType: 'Développement web et mobile',
          }),
          faqJsonLd(c.faq),
        ],
      });
    });
  }
}

/* ============= /agence/:city/:service — page ville × service ============= */
@Component({
  selector: 'svq-city-service',
  imports: [RouterLink, RevealDirective, ServiceIconComponent, DecimalPipe],
  template: `
    @if (city(); as c) {
      @if (content(); as ct) {
        <section class="page-head">
          <div class="container">
            <nav class="crumbs" aria-label="Fil d'Ariane">
              <a routerLink="/">Accueil</a> <span>›</span>
              <a routerLink="/agence">Agence par ville</a> <span>›</span>
              <a [routerLink]="['/agence', c.slug]">{{ c.name }}</a> <span>›</span>
              <span>{{ serviceDef().label }}</span>
            </nav>
            <h1 svqReveal>{{ ct.h1 }}</h1>
            <p svqReveal class="reveal-d1">{{ ct.intro }}</p>
            <span class="chip" svqReveal>À partir de {{ serviceDef().startingPrice | number }} MAD HT</span>
          </div>
        </section>

        <section class="section">
          <div class="container">
            <div class="content-sections">
              @for (sec of ct.sections; track sec.title; let i = $index) {
                <div class="content-block" svqReveal [class]="'reveal-d' + ((i % 3) + 1)">
                  <h2>{{ sec.title }}</h2>
                  <p>{{ sec.body }}</p>
                  @if (sec.bullets?.length) {
                    <ul>@for (b of sec.bullets; track b) { <li>{{ b }}</li> }</ul>
                  }
                </div>
              }

              <!-- Le détail technique générique vit sur la page service
                   nationale : on y renvoie plutôt que de le recopier ici. -->
              <div class="content-block" svqReveal>
                <h2>Méthode, technologies et garanties</h2>
                <p>
                  Notre approche, notre stack technique et nos engagements sont identiques
                  partout au Maroc. Ils sont détaillés sur la page dédiée à ce service.
                </p>
                <ul>
                  <li>
                    <a [routerLink]="['/services', serviceDef().serviceId]">
                      Tout savoir sur {{ serviceDef().label.toLowerCase() }} chez SWIVIQ
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="card cta-card" svqReveal>
              <h2>Votre projet {{ c.in }}</h2>
              <p>Configurez votre besoin et recevez un devis PDF détaillé en deux minutes.</p>
              <a [routerLink]="['/devis']" [queryParams]="{ service: serviceDef().serviceId }" class="btn btn--primary">
                Obtenir mon devis
              </a>
            </div>

            <div class="faq" svqReveal>
              <h2>Questions fréquentes</h2>
              @for (item of ct.faq; track item.q) {
                <details class="faq-item">
                  <summary><h3>{{ item.q }}</h3></summary>
                  <p>{{ item.a }}</p>
                </details>
              }
            </div>

            <div class="links">
              <h3>Nos autres prestations {{ c.in }}</h3>
              <div class="grid grid-3">
                @for (s of otherServices(); track s.slug) {
                  <a class="card mini" [routerLink]="['/agence', c.slug, s.slug]">
                    <svq-icon [name]="s.serviceId" [size]="30" />
                    <span>{{ s.label }}<small>dès {{ s.startingPrice.toLocaleString('fr-FR') }} MAD HT</small></span>
                  </a>
                }
              </div>
            </div>
          </div>
        </section>
      }
    }
  `,
  styles: [SHARED_STYLES],
})
export class CityServiceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);

  city = signal<City | null>(null);
  content = signal<CityServiceContent | null>(null);
  serviceSlug = signal<string>(LOCAL_SERVICES[0].slug);

  serviceDef = computed(() => LOCAL_SERVICES.find(s => s.slug === this.serviceSlug()) ?? LOCAL_SERVICES[0]);
  otherServices = computed(() => LOCAL_SERVICES.filter(s => s.slug !== this.serviceSlug()));

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const citySlug = params.get('city') ?? '';
      const svcSlug = params.get('service') ?? '';
      const c = CITIES[citySlug];
      const ct = CITY_SERVICES[`${citySlug}/${svcSlug}`];
      if (!c || !ct || !LOCAL_SERVICE_SLUGS.includes(svcSlug)) {
        this.router.navigateByUrl('/404');
        return;
      }
      this.city.set(c);
      this.serviceSlug.set(svcSlug);
      this.content.set(ct);

      const def = this.serviceDef();
      const url = `${SITE_URL}/agence/${citySlug}/${svcSlug}`;

      this.seo.apply({
        title: ct.seoTitle,
        description: ct.seoDesc,
        path: `/agence/${citySlug}/${svcSlug}`,
        breadcrumb: [
          { name: 'Accueil', path: '/' },
          { name: 'Agence par ville', path: '/agence' },
          { name: c.name, path: `/agence/${c.slug}` },
          { name: def.label },
        ],
        jsonLd: [
          serviceJsonLd({
            url,
            name: ct.h1,
            description: ct.seoDesc,
            cityName: c.name,
            serviceType: def.label,
            price: def.startingPrice,
          }),
          faqJsonLd(ct.faq),
        ],
      });
    });
  }
}
