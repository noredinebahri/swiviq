import { Router } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { Quote, Product, getSettings, nextNumber } from './db.js';
import { requireAuth, isAdmin } from './auth.js';
import { generateQuotePdf } from './pdf.js';

const customerSchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().max(120).optional(),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  ice: z.string().max(20).optional(),
  address: z.string().max(300).optional()
});

const quoteSchema = z.object({
  customer: customerSchema,
  serviceIds: z.array(z.string().max(50)).min(1).max(20),
  optionIds: z.array(z.string().max(50)).max(20).default([]),
  complexity: z.enum(['simple', 'standard', 'advanced']),
  urgency: z.enum(['normal', 'fast', 'express']),
  description: z.string().max(2000).optional()
});

const statusSchema = z.object({
  status: z.enum(['new', 'sent', 'accepted', 'rejected'])
});

const round2 = (n) => Math.round(n * 100) / 100;

export function computeQuote(input, pricing) {
  const services = input.serviceIds.map((id) => {
    const s = pricing.services.find((x) => x.id === id);
    if (!s) throw Object.assign(new Error(`Service inconnu : ${id}`), { status: 400, expose: true });
    return s;
  });
  const options = (input.optionIds ?? []).map((id) => {
    const o = pricing.options.find((x) => x.id === id);
    if (!o) throw Object.assign(new Error(`Option inconnue : ${id}`), { status: 400, expose: true });
    return o;
  });
  const cMult = pricing.complexityMultipliers[input.complexity];
  const uMult = pricing.urgencyMultipliers[input.urgency];

  const servicesBase = services.reduce((sum, s) => sum + s.basePrice, 0);
  const optionsSum = options.reduce((sum, o) => sum + o.price, 0);
  const subtotal = round2(servicesBase * cMult * uMult + optionsSum);
  const vat = round2(subtotal * pricing.vatRate);
  const total = round2(subtotal + vat);

  const lines = services.map((s) => {
    const adjusted = round2(s.basePrice * cMult * uMult);
    return { label: s.label, qty: 1, unitPrice: adjusted, total: adjusted };
  });
  lines.push(...options.map((o) => ({ label: `Option — ${o.label}`, qty: 1, unitPrice: o.price, total: o.price })));

  return { lines, subtotalHT: subtotal, vat, totalTTC: total };
}

function toJson(quote) {
  const q = quote.toJSON();
  q.subtotalHT = Number(q.subtotalHT);
  q.vat = Number(q.vat);
  q.totalTTC = Number(q.totalTTC);
  return q;
}

export const quotesRouter = Router();

// Public: create a quote (devis)
quotesRouter.post('/', async (req, res, next) => {
  try {
    const parsed = quoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    }
    const input = parsed.data;
    const { pricing } = await getSettings();
    const computed = computeQuote(input, pricing);

    const quote = await Quote.create({
      number: await nextNumber('quote', 'DEV'),
      publicToken: crypto.randomBytes(24).toString('hex'),
      status: 'new',
      customer: input.customer,
      serviceIds: input.serviceIds,
      optionIds: input.optionIds,
      complexity: input.complexity,
      urgency: input.urgency,
      description: input.description ?? '',
      ...computed
    });
    res.status(201).json(toJson(quote));
  } catch (err) {
    next(err);
  }
});

const manualLineSchema = z.object({
  label: z.string().min(1).max(300),
  qty: z.number().positive().max(10000),
  unitPrice: z.number().min(0).max(100000000)
});

const manualQuoteSchema = z.object({
  customer: customerSchema,
  lines: z.array(manualLineSchema).min(1).max(50),
  projectId: z.string().uuid().optional(),
  description: z.string().max(2000).optional()
});

// Admin: create a manual quote (devis libre)
quotesRouter.post('/manual', requireAuth, async (req, res, next) => {
  try {
    const parsed = manualQuoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten() });
    }
    const { pricing } = await getSettings();
    const { customer, lines, projectId, description } = parsed.data;
    const enrichedLines = lines.map(l => ({ ...l, total: round2(l.qty * l.unitPrice) }));
    const subtotalHT = round2(enrichedLines.reduce((s, l) => s + l.total, 0));
    const vat = round2(subtotalHT * pricing.vatRate);
    const totalTTC = round2(subtotalHT + vat);

    let prefix = 'DEV';
    if (projectId) {
      const project = await Product.findByPk(projectId);
      if (project && project.brandPrefix) {
        prefix = project.brandPrefix;
      }
    }

    const quote = await Quote.create({
      number: await nextNumber('quote', prefix),
      publicToken: crypto.randomBytes(24).toString('hex'),
      status: 'new',
      projectId: projectId || null,
      customer,
      serviceIds: [],
      optionIds: [],
      complexity: 'standard',
      urgency: 'normal',
      description: description ?? '',
      lines: enrichedLines,
      subtotalHT,
      vat,
      totalTTC
    });
    res.status(201).json(toJson(quote));
  } catch (err) {
    next(err);
  }
});

// Public with token OR admin JWT: download PDF
quotesRouter.get('/:id/pdf', async (req, res, next) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Devis introuvable.' });
    const token = String(req.query.token ?? '');
    const tokenOk =
      token.length > 0 &&
      token.length === quote.publicToken.length &&
      crypto.timingSafeEqual(Buffer.from(token), Buffer.from(quote.publicToken));
    if (!tokenOk && !isAdmin(req)) {
      return res.status(401).json({ error: 'Accès non autorisé.' });
    }
    const { company, pricing } = await getSettings();
    let project = null;
    if (quote.projectId) {
      project = await Product.findByPk(quote.projectId);
    }
    generateQuotePdf(toJson(quote), company, pricing.vatRate, res, project);
  } catch (err) {
    next(err);
  }
});

// Admin: list quotes (newest first)
quotesRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const quotes = await Quote.findAll({ order: [['createdAt', 'DESC']] });
    res.json(quotes.map(toJson));
  } catch (err) {
    next(err);
  }
});

// Admin: update status
quotesRouter.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Statut invalide.' });
    const quote = await Quote.findByPk(req.params.id);
    if (!quote) return res.status(404).json({ error: 'Devis introuvable.' });
    quote.status = parsed.data.status;
    await quote.save();
    res.json(toJson(quote));
  } catch (err) {
    next(err);
  }
});
