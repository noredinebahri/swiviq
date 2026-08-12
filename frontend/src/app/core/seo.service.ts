import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface BreadcrumbItem {
  name: string;
  path?: string; // absent pour le dernier élément (page courante)
}

export interface SeoConfig {
  title: string;
  description: string;
  path: string; // e.g. '/services'
  image?: string;
  type?: string;
  jsonLd?: object | object[];
  breadcrumb?: BreadcrumbItem[];
  /**
   * Expressions ciblées par la page.
   *
   * Google n'en tient plus compte depuis 2009 ; Bing et les moteurs qui
   * l'alimentent la lisent encore, et la balise coûte un attribut. Elle ne
   * remplace jamais le fait d'écrire ces expressions dans le texte : c'est là
   * que le classement se joue.
   */
  keywords?: string[];
  /**
   * Versions traduites de LA MÊME page, chacune à son adresse.
   *
   * Deux règles que Google vérifie et sanctionne : chaque version doit se
   * déclarer elle-même dans la liste, et les déclarations doivent être
   * réciproques. Une page qui pointe vers l'arabe sans que l'arabe lui
   * réponde voit ses hreflang ignorés en bloc.
   */
  alternates?: { lang: string; path: string }[];
  /** Langue de CETTE version : `og:locale` et l'attribut lang du document. */
  locale?: string;
}

export const SITE_URL = 'https://swiviq.com';

/**
 * Entité unique du site : agence (ProfessionalService) ET organisation.
 * Un seul nœud @id #organization référencé par toutes les pages — deux
 * blocs séparés créeraient deux entités concurrentes pour Google.
 * (sameAs/telephone/geo : à ajouter dès que les profils et le numéro
 * officiels existent — jamais de placeholder publié.)
 */
export const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'Organization'],
  '@id': `${SITE_URL}/#organization`,
  name: 'SWIVIQ',
  legalName: 'SWIVIQ SARL AU',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-icon.png` },
  image: `${SITE_URL}/og-image.png`,
  description:
    'Agence digitale à Rabat : création d\'applications web et mobiles, solutions SaaS, e-commerce et conseil informatique pour les entreprises au Maroc.',
  email: 'contact@swiviq.com',
  foundingDate: '2026',
  founder: { '@type': 'Person', name: 'Noredine Bahri' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Imm 30, Appt 8, Rue Moulay Ahmed Loukili, Hassan',
    addressLocality: 'Rabat',
    addressRegion: 'Rabat-Salé-Kénitra',
    addressCountry: 'MA',
  },
  areaServed: { '@type': 'Country', name: 'Maroc', identifier: 'MA' },
  knowsAbout: [
    'Développement d\'applications web', 'Applications mobiles', 'SaaS', 'Cloud',
    'E-commerce', 'Intermédiation numérique', 'Conciergerie digitale',
    'Événementiel digital', 'Conseil en systèmes informatiques',
  ],
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  apply(cfg: SeoConfig) {
    const url = SITE_URL + cfg.path;
    const image = cfg.image ?? `${SITE_URL}/og-image.png`;

    this.title.setTitle(cfg.title);
    this.meta.updateTag({ name: 'description', content: cfg.description });
    this.meta.updateTag({ property: 'og:title', content: cfg.title });
    this.meta.updateTag({ property: 'og:description', content: cfg.description });
    this.meta.updateTag({ property: 'og:type', content: cfg.type ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:site_name', content: 'SWIVIQ' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: cfg.title });
    this.meta.updateTag({ name: 'twitter:description', content: cfg.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });
    if (cfg.keywords?.length) {
      this.meta.updateTag({ name: 'keywords', content: cfg.keywords.join(', ') });
    } else {
      this.meta.removeTag('name="keywords"');
    }

    if (cfg.locale) {
      this.meta.updateTag({ property: 'og:locale', content: cfg.locale.replace('-', '_') });
    } else {
      this.meta.removeTag('property="og:locale"');
    }

    this.setCanonical(url, cfg.alternates);

    const blocks: object[] = [ORG_JSONLD];
    if (cfg.breadcrumb?.length) blocks.push(this.buildBreadcrumb(cfg.breadcrumb));
    if (cfg.jsonLd) blocks.push(...(Array.isArray(cfg.jsonLd) ? cfg.jsonLd : [cfg.jsonLd]));
    this.setJsonLd(blocks);
  }

  private buildBreadcrumb(items: BreadcrumbItem[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        ...(item.path ? { item: SITE_URL + (item.path === '/' ? '/' : item.path) } : {}),
      })),
    };
  }

  /** For admin pages: keep them out of search engines. */
  noIndex(title: string) {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  private setCanonical(url: string, alternates?: { lang: string; path: string }[]) {
    const head = this.doc.head;
    head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(el => el.remove());

    const canonical = this.doc.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', url);
    head.appendChild(canonical);

    // Les hreflang n'existent QUE pour les pages qui ont de vraies adresses par
    // langue, rendues côté serveur — aujourd'hui les fiches produits. Ailleurs,
    // la bascule fr/en/ar reste purement navigateur sur une seule URL : y poser
    // des hreflang serait déclarer trois versions là où le serveur n'en rend
    // qu'une, signal que Google ignore en bloc quand il le détecte.
    if (!alternates?.length) return;

    for (const alt of alternates) {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alt.lang);
      link.setAttribute('href', SITE_URL + alt.path);
      head.appendChild(link);
    }

    // x-default désigne la version servie à qui ne correspond à aucune langue
    // déclarée. Sans elle, Google choisit seul, et se trompe souvent.
    const fallback = alternates.find(a => a.lang === 'fr') ?? alternates[0];
    const xDefault = this.doc.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', SITE_URL + fallback.path);
    head.appendChild(xDefault);
  }

  private setJsonLd(blocks: object[]) {
    this.doc.head.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
    for (const block of blocks) {
      const script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(block);
      this.doc.head.appendChild(script);
    }
  }
}
