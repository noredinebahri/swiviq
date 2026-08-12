import { Router } from 'express';
import { z } from 'zod';
import { sequelize, Product, Plan, Subscriber, nextSeq } from './db.js';
import { requireAuth } from './auth.js';

/* ---------------- Schemas ---------------- */

const photoSchema = z.object({
  id: z.string().min(1).max(80).optional(),
  url: z.string().min(1).max(500),
  title: z.string().max(200).optional().default(''),
  description: z.string().max(1000).optional().default('')
});

const planSchema = z.object({
  id: z.string().min(1).max(80).optional(),
  name: z.string().min(1).max(120),
  price: z.number().min(0).max(100000000),
  currency: z.string().min(1).max(10).default('MAD'),
  interval: z.enum(['month', 'year', 'one-time']).default('month'),
  tagline: z.string().max(200).optional().default(''),
  features: z.array(z.string().max(300)).max(50).default([]),
  highlighted: z.boolean().default(false),
  ctaLabel: z.string().max(80).optional().default('')
});

const sectionSchema = z.object({
  id: z.string().max(60).optional(),
  eyebrow: z.string().max(80).optional().or(z.literal('')),
  title: z.string().min(1).max(200),
  body: z.string().max(4000).optional().or(z.literal('')),
  bullets: z.array(z.string().max(300)).max(20).default([]),
  metrics: z.array(z.object({
    value: z.string().min(1).max(40),
    label: z.string().min(1).max(120)
  })).max(6).default([]),
  /** Preuves : couple requête → résultat, affiché comme un tableau de départs. */
  evidence: z.array(z.object({
    query: z.string().min(1).max(80),
    result: z.string().min(1).max(120),
    code: z.string().max(12).optional().or(z.literal('')),
    source: z.string().max(40).optional().or(z.literal(''))
  })).max(8).default([])
});

const productSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  type: z.enum(['app', 'website', 'saas']),
  name: z.string().min(1).max(160),
  tagline: z.string().min(1).max(240),
  description: z.string().min(1).max(4000),
  coverUrl: z.string().min(1).max(500),
  technologies: z.array(z.string().max(80)).max(40).default([]),
  features: z.array(z.string().max(300)).max(40).default([]),
  websiteUrl: z.string().max(500).optional().or(z.literal('')),
  repoUrl: z.string().max(500).optional().or(z.literal('')),
  status: z.enum(['live', 'beta', 'coming-soon']).default('live'),
  photos: z.array(photoSchema).max(20).default([]),
  sections: z.array(sectionSchema).max(12).default([]),
  /* Référencement et FAQ : facultatifs, préservés tels quels s'ils sont absents. */
  seo: z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(400).optional(),
    keywords: z.array(z.string().max(120)).max(40).optional()
  }).optional(),
  faq: z.array(z.object({
    q: z.string().min(1).max(300),
    a: z.string().min(1).max(2000)
  })).max(20).optional(),
  /* Traductions : structure libre par langue, validée par l'usage plutôt que
     par un schéma figé — chaque langue peut redéfinir tout ou partie des
     champs éditoriaux. */
  translations: z.record(z.any()).optional(),
  plans: z.array(planSchema).max(10).default([]),
  order: z.number().int().min(0).max(99999).default(0),
  brandColor: z.string().min(1).max(20).default('#6C4CF1'),
  brandTagline: z.string().max(240).default('Agence digitale — Développement web, mobile & solutions cloud'),
  brandPrefix: z.string().min(1).max(10).default('SW')
});

/* ---------------- Error formatting ---------------- */

function formatZodError(error) {
  const issues = error.issues.map((i) => {
    const path = i.path.join('.');
    if (i.code === 'invalid_string' && i.validation === 'regex') return `${path} : minuscules, chiffres et tirets uniquement (ex. transfer-vvip)`;
    if (i.code === 'too_small' && i.type === 'string') return `${path} : champ requis (au moins 1 caractère)`;
    if (i.code === 'invalid_string' && i.validation === 'url') return `${path} : URL invalide`;
    if (i.code === 'invalid_string' && i.validation === 'email') return `${path} : email invalide`;
    if (i.code === 'invalid_type') return `${path} : valeur manquante ou invalide`;
    if (i.code === 'too_big') return `${path} : valeur trop longue ou trop grande`;
    return `${path} : ${i.message}`;
  });
  const fields = [...new Set(error.issues.map((i) => i.path.join('.')))];
  return { issues, fields };
}

function invalidProduct(res, parsed) {
  const { issues, fields } = formatZodError(parsed.error);
  return res.status(400).json({ error: 'Produit invalide.', details: { ...parsed.error.flatten(), issues, fields } });
}

/* ---------------- Public router ---------------- */

export const publicProductsRouter = Router();

// Debug: log every request to this router
publicProductsRouter.use((req, res, next) => {
  console.log('[PUBLIC PRODUCTS ROUTER]', req.method, req.path);
  next();
});

publicProductsRouter.get('/', async (req, res, next) => {
  try {
    const rows = await Product.findAll({
      include: [{ model: Plan, as: 'plans' }],
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });
    res.json(rows.map(toPublicDTO));
  } catch (e) { next(e); }
});

publicProductsRouter.get('/:slug', async (req, res, next) => {
  try {
    const row = await Product.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Plan, as: 'plans' }]
    });
    if (!row) return res.status(404).json({ error: 'Produit introuvable.' });
    res.json(toPublicDTO(row));
  } catch (e) { next(e); }
});

// Public subscription registration
const subscribeSchema = z.object({
  planId: z.string().min(1).max(80),
  name: z.string().min(1).max(160),
  email: z.string().email().max(200),
  company: z.string().max(200).optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal(''))
});

publicProductsRouter.post('/:slug/subscribe', async (req, res, next) => {
  try {
    const parsed = subscribeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten() });
    const product = await Product.findOne({ where: { slug: req.params.slug } });
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
    const plan = await Plan.findOne({ where: { id: parsed.data.planId, productId: product.id } });
    if (!plan) return res.status(400).json({ error: 'Abonnement introuvable.' });
    const sub = await Subscriber.create({
      number: await nextSeq('sub', 'SUB'),
      productId: product.id,
      planId: plan.id,
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || '',
      phone: parsed.data.phone || '',
      status: 'pending'
    });
    res.status(201).json({ id: sub.id, number: sub.number, status: sub.status });
  } catch (e) { next(e); }
});

/* ---------------- Admin router ---------------- */

export const adminProductsRouter = Router();
adminProductsRouter.use(requireAuth);

adminProductsRouter.get('/', async (req, res, next) => {
  try {
    const rows = await Product.findAll({
      include: [{ model: Plan, as: 'plans' }, { model: Subscriber, as: 'subscribers' }],
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });
    res.json(rows.map(toAdminDTO));
  } catch (e) { next(e); }
});

adminProductsRouter.get('/:id', async (req, res, next) => {
  try {
    const row = await Product.findByPk(req.params.id, {
      include: [{ model: Plan, as: 'plans' }, { model: Subscriber, as: 'subscribers' }]
    });
    if (!row) return res.status(404).json({ error: 'Produit introuvable.' });
    res.json(toAdminDTO(row));
  } catch (e) { next(e); }
});

adminProductsRouter.post('/', async (req, res, next) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) return invalidProduct(res, parsed);
    const data = parsed.data;
    if (data.type !== 'saas' && data.plans.length > 0) {
      // plans only apply to saas — silently drop
      data.plans = [];
    }
    const dup = await Product.findOne({ where: { slug: data.slug } });
    if (dup) return res.status(400).json({ error: 'Ce slug est déjà utilisé.', details: { issues: ['slug : ce slug est déjà utilisé'], fields: ['slug'] } });
    const product = await sequelize.transaction(async (t) => {
      const p = await Product.create({
        slug: data.slug, type: data.type, name: data.name, tagline: data.tagline,
        description: data.description, coverUrl: data.coverUrl,
        technologies: data.technologies, features: data.features,
        websiteUrl: data.websiteUrl || '', repoUrl: data.repoUrl || '',
        status: data.status, photos: data.photos, sections: data.sections, order: data.order,
        seo: data.seo ?? {}, faq: data.faq ?? [], translations: data.translations ?? {},
        brandColor: data.brandColor || '#6C4CF1',
        brandTagline: data.brandTagline || 'Agence digitale — Développement web, mobile & solutions cloud',
        brandPrefix: data.brandPrefix || 'SW'
      }, { transaction: t });
      if (data.type === 'saas' && data.plans.length) {
        await Plan.bulkCreate(data.plans.map(pl => {
          const { id, ...rest } = pl;
          return { ...rest, productId: p.id };
        }), { transaction: t });
      }
      return p;
    });
    const full = await Product.findByPk(product.id, { include: [{ model: Plan, as: 'plans' }] });
    res.status(201).json(toAdminDTO(full));
  } catch (e) { next(e); }
});

adminProductsRouter.put('/:id', async (req, res, next) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) return invalidProduct(res, parsed);
    const data = parsed.data;
    if (data.type !== 'saas') data.plans = [];
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
    if (data.slug !== product.slug) {
      const dup = await Product.findOne({ where: { slug: data.slug } });
      if (dup && dup.id !== product.id) return res.status(400).json({ error: 'Ce slug est déjà utilisé.', details: { issues: ['slug : ce slug est déjà utilisé'], fields: ['slug'] } });
    }
    await sequelize.transaction(async (t) => {
      await product.update({
        slug: data.slug, type: data.type, name: data.name, tagline: data.tagline,
        description: data.description, coverUrl: data.coverUrl,
        technologies: data.technologies, features: data.features,
        websiteUrl: data.websiteUrl || '', repoUrl: data.repoUrl || '',
        status: data.status, photos: data.photos, sections: data.sections, order: data.order,
        // Le formulaire d'administration n'expose pas encore ces deux champs.
        // On conserve donc l'existant quand ils sont absents, au lieu d'effacer
        // le référencement de la fiche à chaque enregistrement.
        seo: data.seo ?? product.seo, faq: data.faq ?? product.faq,
        translations: data.translations ?? product.translations,
        brandColor: data.brandColor || '#6C4CF1',
        brandTagline: data.brandTagline || 'Agence digitale — Développement web, mobile & solutions cloud',
        brandPrefix: data.brandPrefix || 'SW'
      }, { transaction: t });
      // Replace plans
      await Plan.destroy({ where: { productId: product.id }, transaction: t });
      if (data.type === 'saas' && data.plans.length) {
        await Plan.bulkCreate(data.plans.map(pl => {
          const { id, ...rest } = pl;
          return { ...rest, productId: product.id };
        }), { transaction: t });
      }
    });
    const full = await Product.findByPk(product.id, { include: [{ model: Plan, as: 'plans' }, { model: Subscriber, as: 'subscribers' }] });
    res.json(toAdminDTO(full));
  } catch (e) { next(e); }
});

adminProductsRouter.delete('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit introuvable.' });
    await product.destroy();
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* Subscribers */
adminProductsRouter.get('/subscribers/all', async (req, res, next) => {
  try {
    const rows = await Subscriber.findAll({
      include: [{ model: Product, as: 'product' }, { model: Plan, as: 'plan' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(rows.map(s => ({
      id: s.id, number: s.number, name: s.name, email: s.email,
      company: s.company, phone: s.phone, status: s.status,
      createdAt: s.createdAt,
      product: s.product ? { id: s.product.id, name: s.product.name, slug: s.product.slug } : null,
      plan: s.plan ? { id: s.plan.id, name: s.plan.name, price: s.plan.price, currency: s.plan.currency, interval: s.plan.interval } : null
    })));
  } catch (e) { next(e); }
});

adminProductsRouter.patch('/subscribers/:id', async (req, res, next) => {
  try {
    const schema = z.object({ status: z.enum(['pending', 'active', 'suspended', 'cancelled']) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Statut invalide.' });
    const sub = await Subscriber.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Abonné introuvable.' });
    await sub.update({ status: parsed.data.status });
    res.json({ id: sub.id, status: sub.status });
  } catch (e) { next(e); }
});

adminProductsRouter.delete('/subscribers/:id', async (req, res, next) => {
  try {
    const sub = await Subscriber.findByPk(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Abonné introuvable.' });
    await sub.destroy();
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ---------------- DTOs ---------------- */

function toPublicDTO(p) {
  return {
    id: p.id, slug: p.slug, type: p.type, name: p.name, tagline: p.tagline,
    description: p.description, coverUrl: p.coverUrl,
    technologies: p.technologies || [], features: p.features || [],
    websiteUrl: p.websiteUrl, repoUrl: p.repoUrl, status: p.status,
    photos: p.photos || [], sections: p.sections || [], order: p.order,
    // Le référencement et la FAQ se rendent côté client : ils doivent sortir
    // du DTO public, sinon la page retombe sur le titre générique et le bloc
    // FAQ reste vide — donc pas de balisage FAQPage non plus.
    seo: p.seo || {}, faq: p.faq || [], translations: p.translations || {},
    brandColor: p.brandColor || '#6C4CF1',
    brandTagline: p.brandTagline || 'Agence digitale — Développement web, mobile & solutions cloud',
    brandPrefix: p.brandPrefix || 'SW',
    plans: (p.plans || []).map(pl => ({
      id: pl.id, name: pl.name, price: Number(pl.price), currency: pl.currency,
      interval: pl.interval, tagline: pl.tagline, features: pl.features,
      highlighted: pl.highlighted, ctaLabel: pl.ctaLabel
    })).sort((a, b) => a.price - b.price)
  };
}

function toAdminDTO(p) {
  const dto = toPublicDTO(p);
  dto.subscribers = (p.subscribers || []).map(s => ({
    id: s.id, number: s.number, name: s.name, email: s.email,
    company: s.company, phone: s.phone, status: s.status, createdAt: s.createdAt,
    planId: s.planId
  }));
  return dto;
}
