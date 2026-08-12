import { Lang } from './i18n.service';

/**
 * Les pages qui existent réellement à une adresse par langue.
 *
 * POURQUOI UNE LISTE ET NON UNE RÈGLE — préfixer aveuglément toute adresse de
 * `/en` produirait des liens vers des pages qui n'existent pas. Le blog, les
 * comparatifs, les fiches services et les pages villes portent leur texte en
 * français dans le code : tant qu'il n'est pas traduit, leur version anglaise
 * n'a pas lieu d'être, et un lien vers elle serait un 404 servi aux visiteurs
 * comme aux moteurs.
 *
 * Cette liste est donc la frontière entre ce qui est traduit et ce qui ne
 * l'est pas encore. On y ajoute une entrée quand — et seulement quand — le
 * contenu de la page suit.
 */

/** Chemins fixes disponibles en français, anglais et arabe. */
export const LOCALIZED_PATHS = [
  '/',
  '/a-propos',
  '/contact',
  '/devis',
  '/produits',
  '/mentions-legales',
  '/confidentialite',
] as const;

/**
 * Familles d'adresses à paramètre également traduites.
 * Les fiches produits portent leurs traductions en base, une par langue.
 */
const LOCALIZED_PATTERNS: RegExp[] = [/^\/produits\/[^/]+$/];

/** Le français reste sans préfixe : les adresses publiées ne bougent pas. */
export const DEFAULT_LANG: Lang = 'fr';

/** Cette adresse (en français, sans préfixe) a-t-elle des versions traduites ? */
export function isLocalized(path: string): boolean {
  const clean = normalize(path);
  return (LOCALIZED_PATHS as readonly string[]).includes(clean)
    || LOCALIZED_PATTERNS.some(re => re.test(clean));
}

/** Retire un éventuel préfixe de langue pour retrouver l'adresse française. */
export function stripLang(path: string): string {
  const m = /^\/(en|ar)(\/.*)?$/.exec(normalize(path));
  if (!m) return normalize(path);
  return m[2] ? m[2] : '/';
}

/** Langue portée par l'adresse, français par défaut. */
export function langOfPath(path: string): Lang {
  const m = /^\/(en|ar)(\/|$)/.exec(normalize(path));
  return m ? (m[1] as Lang) : DEFAULT_LANG;
}

/**
 * Adresse de cette page dans une langue donnée.
 *
 * Retourne l'adresse française quand la page n'est pas traduite : mieux vaut
 * un lien qui fonctionne dans la mauvaise langue qu'un lien mort.
 */
export function localePath(path: string, lang: Lang): string {
  const base = stripLang(path);
  if (lang === DEFAULT_LANG || !isLocalized(base)) return base;
  return base === '/' ? `/${lang}` : `/${lang}${base}`;
}

/** Les trois adresses d'une page, pour les balises hreflang. */
export function alternatesFor(path: string): { lang: Lang; path: string }[] {
  const base = stripLang(path);
  return (['fr', 'en', 'ar'] as Lang[]).map(lang => ({ lang, path: localePath(base, lang) }));
}

/** Enlève la barre finale et garantit une barre initiale. */
function normalize(path: string): string {
  const sansQuery = path.split(/[?#]/)[0];
  const avecBarre = sansQuery.startsWith('/') ? sansQuery : `/${sansQuery}`;
  return avecBarre.length > 1 ? avecBarre.replace(/\/+$/, '') : '/';
}
