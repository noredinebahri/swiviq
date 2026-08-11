import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

/**
 * Racine de toutes les URLs d'API.
 *
 * NAVIGATEUR → `apiUrlBrowser`, vide en production : les URLs deviennent
 * relatives (`/api/settings/public`) et partent toujours vers l'origine de la
 * page en cours. C'est ce qui supprime définitivement l'erreur CORS : avec une
 * base absolue codée en dur sur `https://swiviq.com`, un visiteur arrivé par
 * `https://www.swiviq.com` déclenchait une requête inter-origines que le
 * navigateur bloquait faute d'en-tête `Access-Control-Allow-Origin`. nginx
 * expose `/api/` sur les deux hôtes : la forme relative fonctionne quel que
 * soit le domaine d'entrée (apex, www, futur alias) sans rien reconfigurer.
 *
 * SERVEUR (rendu SSR à la requête + prérendu au build) → `apiUrl`, absolue et
 * obligatoire : il n'y a pas de document courant pour résoudre un chemin
 * relatif, `fetch('/api/...')` échouerait.
 */
export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () =>
    isPlatformBrowser(inject(PLATFORM_ID)) ? environment.apiUrlBrowser : environment.apiUrl,
});
