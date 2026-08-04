import { RenderMode, ServerRoute } from '@angular/ssr';
import { SERVICE_IDS } from './pages/services.data';

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

  // Interactive pages → SSR at request time
  { path: 'contact', renderMode: RenderMode.Server },
  { path: 'devis', renderMode: RenderMode.Server },
  { path: '404', renderMode: RenderMode.Server },

  // Admin → client-side only (behind auth, not indexable)
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },

  { path: '**', renderMode: RenderMode.Server },
];
