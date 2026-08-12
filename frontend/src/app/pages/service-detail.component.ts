import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TPipe } from '../core/i18n/i18n.service';
import { SeoService, SITE_URL } from '../core/seo.service';
import { ServiceIconComponent } from '../shared/svg';
import { RevealDirective } from '../shared/reveal.directive';
import { SERVICE_IDS, SERVICE_META, ServiceContent } from './services.data';
import { localizeService } from './services.i18n';
import { I18nService } from '../core/i18n/i18n.service';
import { ApiService, Pricing } from '../core/api.service';

@Component({
  selector: 'svq-service-detail',
  imports: [RouterLink, TPipe, ServiceIconComponent, RevealDirective, DecimalPipe],
  template: `
    <section class="page-head section--dark">
      <div class="container head">
        <svq-icon [name]="id()" [size]="64" svqReveal />
        <div>
          <h1 svqReveal class="reveal-d1">{{ content().h1 }}</h1>
          <p svqReveal class="reveal-d2">{{ content().intro }}</p>
          @if (basePrice(); as p) {
            <span class="chip" svqReveal>{{ 'services.from' | t }} {{ p | number }} MAD HT</span>
          }
        </div>
      </div>
    </section>

    <!-- Contenu SEO : sections détaillées -->
    <section class="section">
      <div class="container detail">
        <div class="content-sections">
          @for (sec of content().sections; track sec.title; let i = $index) {
            <div class="content-block" svqReveal [class]="'reveal-d' + ((i % 3) + 1)">
              <h2>{{ sec.title }}</h2>
              <p>{{ sec.body }}</p>
              @if (sec.bullets?.length) {
                <ul>
                  @for (b of sec.bullets; track b) {
                    <li>{{ b }}</li>
                  }
                </ul>
              }
            </div>
          }
        </div>

        <div class="card cta-card" svqReveal>
          <h2>{{ 'cta.title' | t }}</h2>
          <p>{{ 'cta.sub' | t }}</p>
          <a [routerLink]="['/devis']" [queryParams]="{ service: id() }" class="btn btn--primary">
            {{ 'services.detailCta' | t }}
          </a>
        </div>

        <!-- FAQ : questions/réponses citables (Google + moteurs IA) -->
        <div class="faq" svqReveal>
          <h2>Questions fréquentes</h2>
          @for (item of content().faq; track item.q) {
            <details class="faq-item">
              <summary><h3>{{ item.q }}</h3></summary>
              <p>{{ item.a }}</p>
            </details>
          }
        </div>

        <div class="others">
          <h3 svqReveal>{{ 'services.all' | t }}</h3>
          <div class="grid grid-4">
            @for (other of otherIds(); track other; let i = $index) {
              <a class="card mini" [routerLink]="['/services', other]" svqReveal [class]="'reveal-d' + ((i % 4) + 1)">
                <svq-icon [name]="other" [size]="34" />
                <span>{{ 'services.items.' + other + '.title' | t }}</span>
              </a>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-head { padding: calc(var(--header-h) + 3.5rem) 0 3.5rem; background: var(--c-ink); position: relative; overflow: hidden; }
    .page-head::before { content: ''; position: absolute; inset: 0; background: var(--grad-hero); }
    .head { position: relative; display: flex; gap: 2rem; align-items: flex-start; }
    .head h1 { color: #fff; font-size: clamp(1.6rem, 3.4vw, 2.4rem); margin-bottom: .8rem; }
    .head p { color: var(--c-text-inverse-soft); max-width: 700px; margin-bottom: 1rem; }

    .content-sections { max-width: 780px; margin: 0 auto 3rem; }
    .content-block { margin-bottom: 2.4rem; }
    .content-block h2 { font-size: 1.35rem; margin-bottom: .8rem; }
    .content-block p { color: var(--c-text-soft); line-height: 1.75; }
    .content-block ul { margin: .9rem 0 0 1.2rem; display: grid; gap: .45rem; }
    .content-block li { color: var(--c-text-soft); line-height: 1.6; }

    .cta-card { text-align: center; padding: 3rem 2rem; background: var(--grad-brand-soft); border-color: rgba(116,83,242,.25); }
    .cta-card h2 { margin-bottom: .6rem; }
    .cta-card p { color: var(--c-text-soft); margin-bottom: 1.6rem; }

    .faq { max-width: 780px; margin: 3.5rem auto 0; }
    .faq > h2 { font-size: 1.45rem; margin-bottom: 1.2rem; }
    .faq-item { border: 1px solid var(--c-border, rgba(120,120,140,.18)); border-radius: 12px; padding: 1rem 1.3rem; margin-bottom: .8rem; background: var(--c-surface, transparent); }
    .faq-item summary { cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; }
    .faq-item summary::after { content: '+'; font-size: 1.3rem; opacity: .55; margin-left: 1rem; }
    .faq-item[open] summary::after { content: '–'; }
    .faq-item summary h3 { font-size: 1rem; font-weight: 600; margin: 0; display: inline; }
    .faq-item p { margin-top: .8rem; color: var(--c-text-soft); line-height: 1.7; }

    .others { margin-top: 4rem; }
    .others h3 { margin-bottom: 1.5rem; }
    .mini { display: flex; align-items: center; gap: .9rem; padding: 1.1rem 1.3rem; font-weight: 600; font-size: .9rem; }
  `],
})
export class ServiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);
  private i18n = inject(I18nService);
  private api = inject(ApiService);

  id = signal<string>('web-app');
  pricing = signal<Pricing | null>(null);

  content = signal<ServiceContent>(SERVICE_META['web-app']);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') ?? '';
      if (!SERVICE_IDS.includes(slug as any)) {
        this.router.navigateByUrl('/404');
        return;
      }
      this.id.set(slug);
      // La fiche française sert de base ; la traduction de la langue courante
      // la recouvre champ par champ. Un service non traduit reste en français.
      const meta = localizeService(slug, SERVICE_META[slug], this.i18n.lang());
      this.content.set(meta);

      const serviceJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE_URL}/services/${slug}#service`,
        name: meta.h1,
        serviceType: meta.serviceType,
        description: meta.seoDescFr,
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: { '@type': 'Country', name: 'Maroc', identifier: 'MA' },
        url: `${SITE_URL}/services/${slug}`,
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}/devis`,
          price: meta.startingPrice,
          priceCurrency: 'MAD',
          availability: 'https://schema.org/InStock',
          description: `À partir de ${meta.startingPrice.toLocaleString('fr-FR')} MAD HT`,
        },
      };

      // FAQPage : pas de rich result Google pour un site commercial (restriction
      // août 2023), mais les réponses chiffrées sont citées par les moteurs IA.
      const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: meta.faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      };

      this.seo.apply({
        title: meta.seoTitleFr,
        description: meta.seoDescFr,
        path: `/services/${slug}`,
        breadcrumb: [
          { name: this.i18n.t('nav.home'), path: '/' },
          { name: this.i18n.t('nav.services'), path: '/services' },
          { name: meta.h1 },
        ],
        jsonLd: [serviceJsonLd, faqJsonLd],
      });
    });
    this.api.getPublicSettings().subscribe({ next: s => this.pricing.set(s.pricing), error: () => {} });
  }

  basePrice(): number | null {
    return this.pricing()?.services.find(s => s.id === this.id())?.basePrice ?? this.content().startingPrice;
  }

  otherIds(): string[] {
    return SERVICE_IDS.filter(s => s !== this.id());
  }
}
