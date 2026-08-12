#!/usr/bin/env node
/**
 * Génère dist/frontend/browser/sitemap.xml APRÈS le build Angular.
 *
 * POURQUOI GÉNÉRER PLUTÔT QU'ÉCRIRE À LA MAIN — le site compte désormais une
 * soixantaine d'URLs (8 villes × 3 services, articles, comparatifs). Un
 * sitemap maintenu manuellement diverge dès la première page ajoutée, et un
 * sitemap qui liste des URLs mortes ou en oublie de vivantes est pire
 * qu'absent : il fait perdre du budget d'exploration.
 *
 * SOURCE DE VÉRITÉ — le dossier de sortie du build. Chaque route prérendue y
 * produit un `index.html` ; on les parcourt et on reconstruit l'URL. Ce qui
 * est réellement déployé est donc exactement ce qui est déclaré, sans liste
 * à tenir à jour en parallèle.
 *
 * Les routes rendues à la demande (SSR) ne laissent pas de fichier : elles
 * sont listées explicitement ci-dessous. Les pages produits, dont les slugs
 * vivent en base, sont lues depuis l'API publique — si elle est injoignable,
 * on continue sans elles plutôt que de faire échouer le build.
 *
 * Lancé automatiquement par `npm run build` (script postbuild).
 */

import { readdir, writeFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const SITE_URL = 'https://swiviq.com';
const API_URL = process.env.SITEMAP_API_URL ?? `${SITE_URL}/api/products`;
const BROWSER_DIR = join(process.cwd(), 'dist', 'frontend', 'browser');
const OUT = join(BROWSER_DIR, 'sitemap.xml');

/** Routes rendues à la demande : aucun fichier produit au build. */
const SSR_ROUTES = ['/contact', '/devis', '/produits'];

/** Jamais indexé : espace authentifié et page d'erreur. */
const EXCLUDED = [/^\/admin(\/|$)/, /^\/404$/];

/** priorité + fréquence, du motif le plus spécifique au plus général. */
const RULES = [
  { test: p => p === '/', priority: '1.0', changefreq: 'weekly' },
  { test: p => p === '/services' || p === '/produits', priority: '0.9', changefreq: 'weekly' },
  { test: p => p === '/devis', priority: '0.9', changefreq: 'monthly' },
  { test: p => p === '/agence' || p === '/blog' || p === '/comparatifs', priority: '0.8', changefreq: 'weekly' },
  { test: p => /^\/services\/[^/]+$/.test(p), priority: '0.8', changefreq: 'monthly' },
  { test: p => /^\/agence\/[^/]+\/[^/]+$/.test(p), priority: '0.7', changefreq: 'monthly' },
  { test: p => /^\/agence\/[^/]+$/.test(p), priority: '0.7', changefreq: 'monthly' },
  { test: p => /^\/(blog|comparatifs)\/[^/]+$/.test(p), priority: '0.7', changefreq: 'monthly' },
  { test: p => /^\/(?:[a-z]{2}\/)?produits\/[^/]+$/.test(p), priority: '0.7', changefreq: 'monthly' },
  { test: p => p === '/mentions-legales' || p === '/confidentialite', priority: '0.2', changefreq: 'yearly' },
];

function classify(path) {
  const rule = RULES.find(r => r.test(path));
  return rule ?? { priority: '0.6', changefreq: 'monthly' };
}

/** Parcourt le dossier de build et retourne le chemin de chaque route prérendue. */
async function collectPrerendered(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectPrerendered(full, out);
    } else if (entry.name === 'index.html') {
      const rel = relative(BROWSER_DIR, dir).split(sep).filter(Boolean).join('/');
      out.push(rel ? `/${rel}` : '/');
    }
  }
  return out;
}

async function fetchProductPaths() {
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const products = await res.json();
    return (Array.isArray(products) ? products : [])
      .filter(p => p?.slug)
      .flatMap(p => {
        const paths = [`/produits/${p.slug}`];
        // Une fiche traduite a sa propre adresse : sans elle au sitemap, la
        // version anglaise ou arabe n'est découverte que par les liens de la
        // page française, et bien plus tard.
        for (const lang of Object.keys(p.translations ?? {})) {
          paths.push(`/${lang}/produits/${p.slug}`);
        }
        return paths;
      });
  } catch (err) {
    console.warn(`[sitemap] produits ignorés (API injoignable : ${err.message})`);
    return [];
  }
}

async function main() {
  try {
    await stat(BROWSER_DIR);
  } catch {
    console.error(`[sitemap] dossier de build introuvable : ${BROWSER_DIR}`);
    process.exit(1);
  }

  const prerendered = await collectPrerendered(BROWSER_DIR);
  const products = await fetchProductPaths();

  const paths = [...new Set([...prerendered, ...SSR_ROUTES, ...products])]
    .filter(p => !EXCLUDED.some(re => re.test(p)))
    .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b, 'fr')));

  const lastmod = new Date().toISOString().slice(0, 10);
  const body = paths
    .map(p => {
      const { priority, changefreq } = classify(p);
      const loc = p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}`;
      return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod>` +
        `<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  await writeFile(OUT, xml, 'utf8');
  console.log(`[sitemap] ${paths.length} URLs écrites dans ${relative(process.cwd(), OUT)}`);
  console.log(`[sitemap]   ${prerendered.length} prérendues, ${SSR_ROUTES.length} SSR, ${products.length} produits`);
}

main().catch(err => {
  console.error('[sitemap] échec :', err);
  process.exit(1);
});
