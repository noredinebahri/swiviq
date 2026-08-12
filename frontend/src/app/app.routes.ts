import { Routes, Route } from '@angular/router';
import { adminGuard } from './core/auth.service';

/**
 * Pages disponibles en trois langues, à trois adresses.
 *
 * Leur contenu vient entièrement des dictionnaires fr/en/ar : les traduire
 * revient à les servir sous `/en` et `/ar`. Les pages dont le texte est écrit
 * en français dans le code — services, blog, comparatifs, villes — n'y sont
 * PAS : les préfixer produirait des pages à l'habillage traduit et au corps
 * français, ce qu'un moteur classe comme contenu de mauvaise qualité.
 */
const PAGES_TRADUITES: { path: string; load: Route['loadComponent'] }[] = [
  { path: '', load: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'a-propos', load: () => import('./pages/about.component').then(m => m.AboutComponent) },
  { path: 'contact', load: () => import('./pages/contact.component').then(m => m.ContactComponent) },
  { path: 'devis', load: () => import('./pages/devis.component').then(m => m.DevisComponent) },
  { path: 'produits', load: () => import('./pages/products.component').then(m => m.ProductsComponent) },
  { path: 'mentions-legales', load: () => import('./pages/legal.components').then(m => m.MentionsComponent) },
  { path: 'confidentialite', load: () => import('./pages/legal.components').then(m => m.PrivacyComponent) },
];

/** Décline les pages ci-dessus sous `/en/...` et `/ar/...`. */
const routesTraduites: Routes = (['en', 'ar'] as const).flatMap(lang =>
  PAGES_TRADUITES.map(p => ({
    path: p.path ? `${lang}/${p.path}` : lang,
    data: { lang },
    loadComponent: p.load,
  }))
);

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'services', loadComponent: () => import('./pages/services.component').then(m => m.ServicesComponent) },
  { path: 'services/:slug', loadComponent: () => import('./pages/service-detail.component').then(m => m.ServiceDetailComponent) },
  { path: 'produits', loadComponent: () => import('./pages/products.component').then(m => m.ProductsComponent) },
  { path: 'produits/:slug', loadComponent: () => import('./pages/product-detail.component').then(m => m.ProductDetailComponent) },
  /**
   * Fiches produits traduites, à leur propre adresse.
   *
   * La langue vient de l'URL et non du navigateur : c'est la seule forme que
   * les moteurs savent indexer. Le reste du site garde sa bascule côté client,
   * qui ne crée pas d'URL — d'où l'absence de préfixe ailleurs.
   *
   * Le français reste sans préfixe pour ne pas casser les adresses déjà
   * publiées ni les liens entrants.
   */
  {
    path: 'en/produits/:slug',
    data: { lang: 'en' },
    loadComponent: () => import('./pages/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'ar/produits/:slug',
    data: { lang: 'ar' },
    loadComponent: () => import('./pages/product-detail.component').then(m => m.ProductDetailComponent)
  },
  // Pages locales : /agence, /agence/[ville], /agence/[ville]/[service]
  { path: 'agence', loadComponent: () => import('./pages/cities.components').then(m => m.AgenciesComponent) },
  { path: 'agence/:city', loadComponent: () => import('./pages/cities.components').then(m => m.CityComponent) },
  { path: 'agence/:city/:service', loadComponent: () => import('./pages/cities.components').then(m => m.CityServiceComponent) },

  { path: 'blog', loadComponent: () => import('./pages/blog.components').then(m => m.BlogComponent) },
  { path: 'blog/:slug', loadComponent: () => import('./pages/blog.components').then(m => m.BlogPostComponent) },

  { path: 'comparatifs', loadComponent: () => import('./pages/comparatifs.components').then(m => m.ComparisonsComponent) },
  { path: 'comparatifs/:slug', loadComponent: () => import('./pages/comparatifs.components').then(m => m.ComparisonComponent) },

  { path: 'a-propos', loadComponent: () => import('./pages/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact.component').then(m => m.ContactComponent) },
  { path: 'devis', loadComponent: () => import('./pages/devis.component').then(m => m.DevisComponent) },
  { path: 'mentions-legales', loadComponent: () => import('./pages/legal.components').then(m => m.MentionsComponent) },
  { path: 'confidentialite', loadComponent: () => import('./pages/legal.components').then(m => m.PrivacyComponent) },

  { path: 'admin/login', loadComponent: () => import('./pages/admin.components').then(m => m.AdminLoginComponent) },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin.components').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/admin.components').then(m => m.AdminDashboardComponent) },
      { path: 'devis', loadComponent: () => import('./pages/admin.components').then(m => m.AdminQuotesComponent) },
      { path: 'factures', loadComponent: () => import('./pages/admin.components').then(m => m.AdminInvoicesComponent) },
      { path: 'produits', loadComponent: () => import('./pages/admin.components').then(m => m.AdminProductsComponent) },
      { path: 'produits/nouveau', loadComponent: () => import('./pages/admin.components').then(m => m.AdminProductFormComponent) },
      { path: 'produits/:id', loadComponent: () => import('./pages/admin.components').then(m => m.AdminProductFormComponent) },
      { path: 'abonnés', loadComponent: () => import('./pages/admin.components').then(m => m.AdminSubscribersComponent) },
      { path: 'fatora', loadComponent: () => import('./pages/admin-fatora.component').then(m => m.AdminFatoraComponent) },
      { path: 'fatora/supervision', loadComponent: () => import('./pages/admin-fatora-monitor.component').then(m => m.AdminFatoraMonitorComponent) },
      { path: 'generer', loadComponent: () => import('./pages/admin.components').then(m => m.AdminDocGenComponent) },
      { path: 'parametres', loadComponent: () => import('./pages/admin.components').then(m => m.AdminSettingsComponent) },
    ],
  },

  // Déclarées après les routes nommées, avant le fourre-tout : `/en` ne doit
  // pas être avalé par `**`, mais ne doit pas non plus masquer `/en/produits/:slug`
  // qui est déclarée plus haut avec sa propre logique de traduction.
  ...routesTraduites,

  { path: '404', loadComponent: () => import('./pages/legal.components').then(m => m.NotFoundComponent) },
  { path: '**', loadComponent: () => import('./pages/legal.components').then(m => m.NotFoundComponent) },
];
