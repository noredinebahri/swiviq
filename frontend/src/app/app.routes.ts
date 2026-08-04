import { Routes } from '@angular/router';
import { adminGuard } from './core/auth.service';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'services', loadComponent: () => import('./pages/services.component').then(m => m.ServicesComponent) },
  { path: 'services/:slug', loadComponent: () => import('./pages/service-detail.component').then(m => m.ServiceDetailComponent) },
  { path: 'produits', loadComponent: () => import('./pages/products.component').then(m => m.ProductsComponent) },
  { path: 'produits/:slug', loadComponent: () => import('./pages/product-detail.component').then(m => m.ProductDetailComponent) },
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
      { path: 'generer', loadComponent: () => import('./pages/admin.components').then(m => m.AdminDocGenComponent) },
      { path: 'parametres', loadComponent: () => import('./pages/admin.components').then(m => m.AdminSettingsComponent) },
    ],
  },

  { path: '404', loadComponent: () => import('./pages/legal.components').then(m => m.NotFoundComponent) },
  { path: '**', loadComponent: () => import('./pages/legal.components').then(m => m.NotFoundComponent) },
];
