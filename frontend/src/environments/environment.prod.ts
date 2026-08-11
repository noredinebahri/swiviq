export const environment = {
  production: true,
  // Rendu serveur (SSR à la requête + prérendu au build) : pas de document
  // courant pour résoudre un chemin relatif, l'URL absolue est obligatoire.
  apiUrl: 'https://swiviq.com',
  // Navigateur : base vide → URLs relatives `/api/...`, donc toujours la même
  // origine que la page. Supprime le CORS entre www.swiviq.com et swiviq.com.
  apiUrlBrowser: '',
};
