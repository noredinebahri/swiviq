export const environment = {
  production: false,
  // Rendu serveur (SSR) — URL absolue obligatoire.
  apiUrl: 'http://localhost:4000',
  // Navigateur — en dev `ng serve` (4200) et l'API (4000) sont sur des ports
  // distincts : la base doit rester absolue, sinon l'appel tape le dev-server.
  // En production elle est vide (même origine) : voir environment.prod.ts.
  apiUrlBrowser: 'http://localhost:4000',
};
