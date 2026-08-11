import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.service';

// Angular n'embarque que « en-US ». Les dates du blog sont formatées avec un
// locale « fr » explicite (DatePipe), qui échouait en NG02100 faute de ces
// données. On enregistre le locale sans toucher au LOCALE_ID par défaut :
// le formatage des nombres reste identique partout ailleurs sur le site.
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      withViewTransitions(),
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideClientHydration(
      withEventReplay(),
      // Les appels /api sont EXCLUS du cache de transfert d'hydratation.
      //
      // Par défaut, Angular embarque dans le HTML les réponses GET obtenues
      // pendant le rendu serveur, et le client les réutilise sans rappeler
      // l'API. Sur les pages PRÉRENDUES au build (accueil, services…), ces
      // données dataient donc du dernier déploiement : un produit ajouté
      // restait invisible tant que le visiteur ne forçait pas un Ctrl+F5.
      //
      // En excluant /api, le navigateur refait l'appel dès l'hydratation :
      // les données sont fraîches au premier chargement. Le HTML prérendu
      // garde son rôle (SEO, premier affichage instantané) — seul le contenu
      // vivant est resynchronisé.
      withHttpTransferCacheOptions({
        filter: (req) => !req.url.includes('/api/'),
      }),
    ),
  ],
};
