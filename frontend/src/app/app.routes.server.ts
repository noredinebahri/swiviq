import { RenderMode, ServerRoute } from '@angular/ssr';
import { SERVICE_IDS } from './pages/services.data';
import { CITY_SLUGS } from './pages/cities.data';
import { LOCAL_SERVICE_SLUGS } from './pages/cities.services.data';
import { ARTICLE_SLUGS } from './pages/blog.data';
import { COMPARISON_SLUGS } from './pages/comparatifs.data';

export const serverRoutes: ServerRoute[] = [
  // Static marketing pages → prerendered at build time (fastest + best SEO)
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'services', renderMode: RenderMode.Prerender },
  {
    path: 'services/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SERVICE_IDS.map(slug => ({ slug })),
  },
  { path: 'a-propos', renderMode: RenderMode.Prerender },
  { path: 'mentions-legales', renderMode: RenderMode.Prerender },
  { path: 'confidentialite', renderMode: RenderMode.Prerender },

  // Pages locales — contenu figé au build, donc prérendues : 8 villes et
  // 24 combinaisons ville × service servies en HTML statique.
  { path: 'agence', renderMode: RenderMode.Prerender },
  {
    path: 'agence/:city',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => CITY_SLUGS.map(city => ({ city })),
  },
  {
    path: 'agence/:city/:service',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      CITY_SLUGS.flatMap(city => LOCAL_SERVICE_SLUGS.map(service => ({ city, service }))),
  },

  // Éditorial — également figé au build.
  { path: 'blog', renderMode: RenderMode.Prerender },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ARTICLE_SLUGS.map(slug => ({ slug })),
  },
  { path: 'comparatifs', renderMode: RenderMode.Prerender },
  {
    path: 'comparatifs/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => COMPARISON_SLUGS.map(slug => ({ slug })),
  },

  // Interactive pages → SSR at request time
  { path: 'contact', renderMode: RenderMode.Server },
  { path: 'devis', renderMode: RenderMode.Server },
  { path: '404', renderMode: RenderMode.Server },

  // Admin → client-side only (behind auth, not indexable)
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },

  { path: '**', renderMode: RenderMode.Server },
];
