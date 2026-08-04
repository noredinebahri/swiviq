import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TPipe } from '../core/i18n/i18n.service';
import { SeoService, SITE_URL } from '../core/seo.service';
import { ServiceIconComponent } from '../shared/svg';
import { RevealDirective } from '../shared/reveal.directive';
import { SERVICE_IDS, SERVICE_META } from './services.data';
import { ApiService, Pricing } from '../core/api.service';

@Component({
  selector: 'svq-services',
  imports: [RouterLink, TPipe, ServiceIconComponent, RevealDirective, DecimalPipe],
  template: `
    <section class="page-head section--dark">
      <div class="container">
        <span class="eyebrow" svqReveal>{{ 'services.eyebrow' | t }}</span>
        <h1 svqReveal class="reveal-d1">{{ 'services.title' | t }}</h1>
        <p svqReveal class="reveal-d2">{{ 'services.sub' | t }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid-2">
          @for (id of serviceIds; track id; let i = $index) {
            <a class="card row" [routerLink]="['/services', id]" svqReveal [class]="'reveal-d' + ((i % 2) + 1)">
              <svq-icon [name]="id" [size]="52" />
              <div class="row__body">
                <h2>{{ 'services.items.' + id + '.title' | t }}</h2>
                <p>{{ 'services.items.' + id + '.desc' | t }}</p>
                @if (priceOf(id); as p) {
                  <span class="chip">{{ 'services.from' | t }} {{ p | number }} MAD HT</span>
                }
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-head { padding: calc(var(--header-h) + 3.5rem) 0 3.5rem; background: var(--c-ink); position: relative; overflow: hidden; }
    .page-head::before { content: ''; position: absolute; inset: 0; background: var(--grad-hero); }
    .page-head .container { position: relative; }
    .page-head h1 { color: #fff; font-size: clamp(2rem, 4.5vw, 3rem); margin-bottom: .8rem; }
    .page-head p { color: var(--c-text-inverse-soft); max-width: 560px; }
    .row { display: flex; gap: 1.5rem; align-items: flex-start; }
    .row h2 { font-size: 1.2rem; margin-bottom: .5rem; }
    .row p { font-size: .93rem; color: var(--c-text-soft); margin-bottom: .8rem; }
  `],
})
export class ServicesComponent implements OnInit {
  private seo = inject(SeoService);
  private api = inject(ApiService);
  serviceIds = SERVICE_IDS;
  pricing = signal<Pricing | null>(null);

  ngOnInit() {
    this.seo.apply({
      title: 'Services d\'Agence Digitale au Maroc : Web, Mobile, SaaS, E-commerce | SWIVIQ',
      description: 'Développement web et mobile, création SaaS, e-commerce et conseil IT au Maroc. 8 expertises, tarifs transparents dès 8 000 MAD HT et devis en ligne immédiat.',
      path: '/services',
      breadcrumb: [
        { name: 'Accueil', path: '/' },
        { name: 'Services' },
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: SERVICE_IDS.map((id, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: SERVICE_META[id].h1,
          item: `${SITE_URL}/services/${id}#service`,
        })),
      },
    });
    this.api.getPublicSettings().subscribe({
      next: s => this.pricing.set(s.pricing),
      error: () => {},
    });
  }

  priceOf(id: string): number | null {
    return this.pricing()?.services.find(s => s.id === id)?.basePrice ?? null;
  }
}
