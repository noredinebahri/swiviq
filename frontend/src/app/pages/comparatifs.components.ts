import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService, SITE_URL } from '../core/seo.service';
import { RevealDirective } from '../shared/reveal.directive';
import { COMPARISONS, COMPARISONS_BY_SLUG, Comparison } from './comparatifs.data';
import { SERVICE_META } from './services.data';

/**
 * Pages comparatives — index et détail.
 *
 * Le tableau est du HTML sémantique (thead/tbody), pas une grille de div :
 * c'est ce qui permet aux moteurs — Google comme les moteurs IA — d'en
 * extraire les lignes. Il défile horizontalement sur mobile plutôt que de
 * forcer la page entière à déborder.
 */

const CMP_STYLES = `
  .page-head { padding: calc(var(--header-h) + 3.5rem) 0 3.5rem; background: var(--c-ink); position: relative; overflow: hidden; }
  .page-head::before { content: ''; position: absolute; inset: 0; background: var(--grad-hero); }
  .page-head .container { position: relative; }
  .page-head h1 { color: #fff; font-size: clamp(1.6rem, 3.4vw, 2.4rem); margin-bottom: .8rem; }
  .page-head p { color: var(--c-text-inverse-soft); max-width: 760px; }
  .crumbs { display: flex; flex-wrap: wrap; gap: .4rem; font-size: .8rem; margin-bottom: 1rem; color: var(--c-text-inverse-soft); }
  .crumbs a { color: var(--c-text-inverse-soft); text-decoration: underline; text-underline-offset: 3px; }

  .cards { display: grid; gap: 1.2rem; max-width: 820px; margin: 0 auto; }
  .cmp-card { display: block; padding: 1.6rem 1.8rem; }
  .cmp-card h2 { font-size: 1.22rem; margin-bottom: .5rem; }
  .cmp-card p { color: var(--c-text-soft); line-height: 1.7; font-size: .95rem; }

  .wrap { max-width: 860px; margin: 0 auto; }
  .lead { font-size: 1.06rem; line-height: 1.8; margin-bottom: 2.4rem;
          padding-left: 1.1rem; border-left: 3px solid var(--c-primary); }

  /* Le tableau déborde horizontalement dans son propre conteneur : la page
     elle-même ne doit jamais défiler latéralement sur mobile. */
  .table-scroll { overflow-x: auto; margin-bottom: 3rem; -webkit-overflow-scrolling: touch; }
  table { border-collapse: collapse; width: 100%; min-width: 640px; font-size: .92rem; }
  th, td { text-align: left; padding: .85rem 1rem; border-bottom: 1px solid var(--c-border); vertical-align: top; }
  thead th { font-size: .82rem; text-transform: uppercase; letter-spacing: .05em; color: var(--c-text-soft); }
  tbody th { font-weight: 600; width: 26%; }
  td { color: var(--c-text-soft); line-height: 1.55; }
  td.win { color: var(--c-text); font-weight: 600; }
  td.win::before { content: '✓ '; color: var(--c-primary); }

  .content-block { margin-bottom: 2.4rem; }
  .content-block h2 { font-size: 1.3rem; margin-bottom: .8rem; }
  .content-block p { color: var(--c-text-soft); line-height: 1.78; }
  .content-block ul { margin: .9rem 0 0 1.2rem; display: grid; gap: .5rem; }
  .content-block li { color: var(--c-text-soft); line-height: 1.65; }

  .verdict { display: grid; gap: 1.2rem; margin: 3rem 0; }
  @media (min-width: 720px) { .verdict { grid-template-columns: 1fr 1fr; } }
  .verdict > div { padding: 1.5rem 1.7rem; border-radius: 14px; border: 1px solid var(--c-border); }
  .verdict h3 { font-size: 1.02rem; margin-bottom: .6rem; }
  .verdict p { color: var(--c-text-soft); line-height: 1.7; font-size: .93rem; }

  .cta-card { text-align: center; padding: 3rem 2rem; background: var(--grad-brand-soft); border-color: rgba(116,83,242,.25); }
  .cta-card h2 { margin-bottom: .6rem; }
  .cta-card p { color: var(--c-text-soft); margin-bottom: 1.6rem; }

  .faq { max-width: 780px; margin: 3rem auto 0; }
  .faq > h2 { font-size: 1.4rem; margin-bottom: 1.2rem; }
  .faq-item { border: 1px solid var(--c-border, rgba(120,120,140,.18)); border-radius: 12px; padding: 1rem 1.3rem; margin-bottom: .8rem; }
  .faq-item summary { cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; }
  .faq-item summary::after { content: '+'; font-size: 1.3rem; opacity: .55; margin-left: 1rem; }
  .faq-item[open] summary::after { content: '–'; }
  .faq-item summary h3 { font-size: 1rem; font-weight: 600; margin: 0; display: inline; }
  .faq-item p { margin-top: .8rem; color: var(--c-text-soft); line-height: 1.7; }

  .links { max-width: 780px; margin: 3.5rem auto 0; }
  .links h3 { margin-bottom: 1.1rem; font-size: 1.1rem; }
  .links ul { list-style: none; display: grid; gap: .55rem; }
  .links a { color: var(--c-primary); font-weight: 600; font-size: .93rem; }
`;

/* ===================== /comparatifs — index ===================== */
@Component({
  selector: 'svq-comparisons',
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="page-head">
      <div class="container">
        <nav class="crumbs" aria-label="Fil d'Ariane"><a routerLink="/">Accueil</a> <span>›</span> <span>Comparatifs</span></nav>
        <h1 svqReveal>Comparatifs</h1>
        <p svqReveal class="reveal-d1">
          Les arbitrages que tout porteur de projet doit trancher avant de se lancer.
          Chaque comparatif indique explicitement les cas où notre offre n'est pas
          le bon choix — c'est la seule façon de rendre le reste crédible.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cards">
          @for (c of comparisons; track c.slug; let i = $index) {
            <a class="card cmp-card" [routerLink]="['/comparatifs', c.slug]" svqReveal [class]="'reveal-d' + ((i % 3) + 1)">
              <h2>{{ c.title }}</h2>
              <p>{{ c.excerpt }}</p>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: [CMP_STYLES],
})
export class ComparisonsComponent implements OnInit {
  private seo = inject(SeoService);
  comparisons = COMPARISONS;

  ngOnInit() {
    this.seo.apply({
      title: 'Comparatifs — Sur Mesure, Shopify, Agence, Freelance, Natif | SWIVIQ',
      description:
        'Comparatifs honnêtes pour choisir : boutique sur mesure ou Shopify, agence ou freelance, application native ou web app. Coûts réels et recommandations selon votre cas.',
      path: '/comparatifs',
      breadcrumb: [{ name: 'Accueil', path: '/' }, { name: 'Comparatifs' }],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Comparatifs SWIVIQ',
        url: `${SITE_URL}/comparatifs`,
        publisher: { '@id': `${SITE_URL}/#organization` },
        hasPart: COMPARISONS.map(c => ({
          '@type': 'WebPage',
          name: c.title,
          url: `${SITE_URL}/comparatifs/${c.slug}`,
        })),
      },
    });
  }
}

/* ================= /comparatifs/:slug — détail ================= */
@Component({
  selector: 'svq-comparison',
  imports: [RouterLink, RevealDirective],
  template: `
    @if (cmp(); as c) {
      <section class="page-head">
        <div class="container">
          <nav class="crumbs" aria-label="Fil d'Ariane">
            <a routerLink="/">Accueil</a> <span>›</span>
            <a routerLink="/comparatifs">Comparatifs</a> <span>›</span>
            <span>{{ c.title }}</span>
          </nav>
          <h1 svqReveal>{{ c.title }}</h1>
          <p svqReveal class="reveal-d1">{{ c.excerpt }}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="wrap">
            <p class="lead">{{ c.intro }}</p>

            <div class="table-scroll">
              <table>
                <caption class="sr-only">Comparaison entre {{ c.optionA }} et {{ c.optionB }}</caption>
                <thead>
                  <tr>
                    <th scope="col">Critère</th>
                    <th scope="col">{{ c.optionA }}</th>
                    <th scope="col">{{ c.optionB }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of c.rows; track r.criterion) {
                    <tr>
                      <th scope="row">{{ r.criterion }}</th>
                      <td [class.win]="r.winner === 'a'">{{ r.a }}</td>
                      <td [class.win]="r.winner === 'b'">{{ r.b }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @for (sec of c.sections; track sec.title) {
              <div class="content-block">
                <h2>{{ sec.title }}</h2>
                <p>{{ sec.body }}</p>
                @if (sec.bullets?.length) {
                  <ul>@for (b of sec.bullets; track b) { <li>{{ b }}</li> }</ul>
                }
              </div>
            }

            <h2>Notre recommandation</h2>
            <div class="verdict">
              <div>
                <h3>Choisissez {{ c.optionA }} si…</h3>
                <p>{{ c.verdict.chooseA }}</p>
              </div>
              <div>
                <h3>Choisissez {{ c.optionB }} si…</h3>
                <p>{{ c.verdict.chooseB }}</p>
              </div>
            </div>

            <div class="card cta-card">
              <h2>Un doute sur votre cas ?</h2>
              <p>Configurez votre besoin et recevez un devis PDF détaillé en deux minutes.</p>
              <a routerLink="/devis" class="btn btn--primary">Obtenir mon devis</a>
            </div>
          </div>

          <div class="faq">
            <h2>Questions fréquentes</h2>
            @for (item of c.faq; track item.q) {
              <details class="faq-item">
                <summary><h3>{{ item.q }}</h3></summary>
                <p>{{ item.a }}</p>
              </details>
            }
          </div>

          <div class="links">
            <h3>Nos services liés</h3>
            <ul>
              @for (s of c.relatedServices; track s) {
                <li><a [routerLink]="['/services', s]">{{ serviceLabel(s) }}</a></li>
              }
            </ul>
          </div>

          <div class="links">
            <h3>Autres comparatifs</h3>
            <ul>
              @for (o of others(); track o.slug) {
                <li><a [routerLink]="['/comparatifs', o.slug]">{{ o.title }}</a></li>
              }
            </ul>
          </div>
        </div>
      </section>
    }
  `,
  styles: [CMP_STYLES + `
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
               overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  `],
})
export class ComparisonComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);

  cmp = signal<Comparison | null>(null);
  others = () => COMPARISONS.filter(c => c.slug !== this.cmp()?.slug);

  serviceLabel(id: string): string {
    return SERVICE_META[id]?.serviceType ?? id;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') ?? '';
      const c = COMPARISONS_BY_SLUG[slug];
      if (!c) {
        this.router.navigateByUrl('/404');
        return;
      }
      this.cmp.set(c);
      const url = `${SITE_URL}/comparatifs/${c.slug}`;

      this.seo.apply({
        title: c.seoTitle,
        description: c.seoDesc,
        path: `/comparatifs/${c.slug}`,
        type: 'article',
        breadcrumb: [
          { name: 'Accueil', path: '/' },
          { name: 'Comparatifs', path: '/comparatifs' },
          { name: c.title },
        ],
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': `${url}#article`,
            headline: c.title,
            description: c.seoDesc,
            url,
            mainEntityOfPage: url,
            author: { '@type': 'Person', name: 'Noredine Bahri' },
            publisher: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'fr-MA',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: c.faq.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ],
      });
    });
  }
}
