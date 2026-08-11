import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SeoService, SITE_URL } from '../core/seo.service';
import { RevealDirective } from '../shared/reveal.directive';
import { ARTICLES, ARTICLES_BY_SLUG, Article } from './blog.data';
import { SERVICE_META } from './services.data';

/**
 * Blog — index et article.
 *
 * Le contenu est rédigé en français, comme les pages /services : c'est la
 * langue indexée pour le marché visé, et le sélecteur de langue du site ne
 * produit pas d'URL distincte.
 */

const BLOG_STYLES = `
  .page-head { padding: calc(var(--header-h) + 3.5rem) 0 3.5rem; background: var(--c-ink); position: relative; overflow: hidden; }
  .page-head::before { content: ''; position: absolute; inset: 0; background: var(--grad-hero); }
  .page-head .container { position: relative; }
  .page-head h1 { color: #fff; font-size: clamp(1.6rem, 3.4vw, 2.4rem); margin-bottom: .8rem; }
  .page-head p { color: var(--c-text-inverse-soft); max-width: 760px; }
  .crumbs { display: flex; flex-wrap: wrap; gap: .4rem; font-size: .8rem; margin-bottom: 1rem; color: var(--c-text-inverse-soft); }
  .crumbs a { color: var(--c-text-inverse-soft); text-decoration: underline; text-underline-offset: 3px; }
  .meta { display: flex; gap: .8rem; align-items: center; font-size: .82rem; color: var(--c-text-inverse-soft); margin-top: 1rem; }

  .posts { display: grid; gap: 1.2rem; max-width: 820px; margin: 0 auto; }
  .post-card { display: block; padding: 1.6rem 1.8rem; }
  .post-card h2 { font-size: 1.25rem; margin-bottom: .5rem; }
  .post-card p { color: var(--c-text-soft); line-height: 1.7; font-size: .95rem; }
  .post-card .card-meta { font-size: .8rem; color: var(--c-text-soft); margin-top: .9rem; display: flex; gap: .7rem; }

  .article { max-width: 760px; margin: 0 auto; }
  .lead { font-size: 1.08rem; line-height: 1.8; color: var(--c-text); margin-bottom: 2.4rem;
          padding-left: 1.1rem; border-left: 3px solid var(--c-primary); }
  .content-block { margin-bottom: 2.4rem; }
  .content-block h2 { font-size: 1.3rem; margin-bottom: .8rem; }
  .content-block p { color: var(--c-text-soft); line-height: 1.78; }
  .content-block ul { margin: .9rem 0 0 1.2rem; display: grid; gap: .5rem; }
  .content-block li { color: var(--c-text-soft); line-height: 1.65; }

  .cta-card { text-align: center; padding: 3rem 2rem; background: var(--grad-brand-soft); border-color: rgba(116,83,242,.25); margin-top: 3rem; }
  .cta-card h2 { margin-bottom: .6rem; }
  .cta-card p { color: var(--c-text-soft); margin-bottom: 1.6rem; }

  .faq { max-width: 760px; margin: 3rem auto 0; }
  .faq > h2 { font-size: 1.4rem; margin-bottom: 1.2rem; }
  .faq-item { border: 1px solid var(--c-border, rgba(120,120,140,.18)); border-radius: 12px; padding: 1rem 1.3rem; margin-bottom: .8rem; }
  .faq-item summary { cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; }
  .faq-item summary::after { content: '+'; font-size: 1.3rem; opacity: .55; margin-left: 1rem; }
  .faq-item[open] summary::after { content: '–'; }
  .faq-item summary h3 { font-size: 1rem; font-weight: 600; margin: 0; display: inline; }
  .faq-item p { margin-top: .8rem; color: var(--c-text-soft); line-height: 1.7; }

  .links { max-width: 760px; margin: 3.5rem auto 0; }
  .links h3 { margin-bottom: 1.1rem; font-size: 1.1rem; }
  .links ul { list-style: none; display: grid; gap: .55rem; }
  .links a { color: var(--c-primary); font-weight: 600; font-size: .93rem; }
`;

/* ========================= /blog — index ========================= */
@Component({
  selector: 'svq-blog',
  imports: [RouterLink, RevealDirective, DatePipe],
  template: `
    <section class="page-head">
      <div class="container">
        <nav class="crumbs" aria-label="Fil d'Ariane"><a routerLink="/">Accueil</a> <span>›</span> <span>Blog</span></nav>
        <h1 svqReveal>Guides et analyses</h1>
        <p svqReveal class="reveal-d1">
          Ce que nous expliquons le plus souvent à nos clients : combien coûte réellement un projet,
          pourquoi un site reste invisible sur Google, comment encaisser en ligne au Maroc.
          Sans détour commercial.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="posts">
          @for (a of articles; track a.slug; let i = $index) {
            <a class="card post-card" [routerLink]="['/blog', a.slug]" svqReveal [class]="'reveal-d' + ((i % 3) + 1)">
              <h2>{{ a.title }}</h2>
              <p>{{ a.excerpt }}</p>
              <div class="card-meta">
                <span>{{ a.date | date: 'longDate' : undefined : 'fr' }}</span>
                <span>·</span>
                <span>{{ a.readingMinutes }} min de lecture</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: [BLOG_STYLES],
})
export class BlogComponent implements OnInit {
  private seo = inject(SeoService);
  articles = ARTICLES;

  ngOnInit() {
    this.seo.apply({
      title: 'Blog — Guides Développement Web, Mobile et E-commerce au Maroc | SWIVIQ',
      description:
        'Guides pratiques sur le développement web et mobile au Maroc : prix réels, paiement en ligne, référencement, refonte de site. Rédigés par une agence, sans détour commercial.',
      path: '/blog',
      breadcrumb: [{ name: 'Accueil', path: '/' }, { name: 'Blog' }],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog SWIVIQ',
        url: `${SITE_URL}/blog`,
        publisher: { '@id': `${SITE_URL}/#organization` },
        blogPost: ARTICLES.map(a => ({
          '@type': 'BlogPosting',
          headline: a.title,
          datePublished: a.date,
          url: `${SITE_URL}/blog/${a.slug}`,
        })),
      },
    });
  }
}

/* ====================== /blog/:slug — article ====================== */
@Component({
  selector: 'svq-blog-post',
  imports: [RouterLink, RevealDirective, DatePipe],
  template: `
    @if (article(); as a) {
      <section class="page-head">
        <div class="container">
          <nav class="crumbs" aria-label="Fil d'Ariane">
            <a routerLink="/">Accueil</a> <span>›</span>
            <a routerLink="/blog">Blog</a> <span>›</span>
            <span>{{ a.title }}</span>
          </nav>
          <h1 svqReveal>{{ a.title }}</h1>
          <div class="meta">
            <span>{{ a.date | date: 'longDate' : undefined : 'fr' }}</span>
            <span>·</span>
            <span>{{ a.readingMinutes }} min de lecture</span>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <article class="article">
            <p class="lead">{{ a.intro }}</p>

            @for (sec of a.sections; track sec.title) {
              <div class="content-block">
                <h2>{{ sec.title }}</h2>
                <p>{{ sec.body }}</p>
                @if (sec.bullets?.length) {
                  <ul>@for (b of sec.bullets; track b) { <li>{{ b }}</li> }</ul>
                }
              </div>
            }
          </article>

          <div class="faq">
            <h2>Questions fréquentes</h2>
            @for (item of a.faq; track item.q) {
              <details class="faq-item">
                <summary><h3>{{ item.q }}</h3></summary>
                <p>{{ item.a }}</p>
              </details>
            }
          </div>

          <div class="links">
            <h3>Nos services liés</h3>
            <ul>
              @for (s of a.relatedServices; track s) {
                <li><a [routerLink]="['/services', s]">{{ serviceLabel(s) }}</a></li>
              }
            </ul>
          </div>

          <div class="card cta-card article">
            <h2>Un projet en tête ?</h2>
            <p>Configurez votre besoin et recevez un devis PDF détaillé en deux minutes.</p>
            <a routerLink="/devis" class="btn btn--primary">Obtenir mon devis</a>
          </div>

          <div class="links">
            <h3>À lire aussi</h3>
            <ul>
              @for (o of others(); track o.slug) {
                <li><a [routerLink]="['/blog', o.slug]">{{ o.title }}</a></li>
              }
            </ul>
          </div>
        </div>
      </section>
    }
  `,
  styles: [BLOG_STYLES],
})
export class BlogPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);

  article = signal<Article | null>(null);

  others = () => ARTICLES.filter(a => a.slug !== this.article()?.slug).slice(0, 3);

  serviceLabel(id: string): string {
    return SERVICE_META[id]?.serviceType ?? id;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') ?? '';
      const a = ARTICLES_BY_SLUG[slug];
      if (!a) {
        this.router.navigateByUrl('/404');
        return;
      }
      this.article.set(a);
      const url = `${SITE_URL}/blog/${a.slug}`;

      this.seo.apply({
        title: a.seoTitle,
        description: a.seoDesc,
        path: `/blog/${a.slug}`,
        type: 'article',
        breadcrumb: [
          { name: 'Accueil', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: a.title },
        ],
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${url}#article`,
            headline: a.title,
            description: a.seoDesc,
            datePublished: a.date,
            dateModified: a.date,
            url,
            mainEntityOfPage: url,
            author: { '@type': 'Person', name: 'Noredine Bahri' },
            publisher: { '@id': `${SITE_URL}/#organization` },
            image: `${SITE_URL}/og-image.png`,
            inLanguage: 'fr-MA',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: a.faq.map(f => ({
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
