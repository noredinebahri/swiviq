import { Router } from 'express';
import { z } from 'zod';
import { Invoice, Quote, Product, getSettings, nextNumber } from './db.js';
import { requireAuth } from './auth.js';
import { generateInvoicePdf } from './pdf.js';

const round2 = (n) => Math.round(n * 100) / 100;

const customerSchema = z.object({
  name: z.string().min(2).max(120),
  company: z.string().max(120).optional(),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  ice: z.string().max(20).optional(),
  address: z.string().max(300).optional()
});

const lineSchema = z.object({
  label: z.string().min(1).max(300),
  qty: z.number().positive().max(10000),
  unitPrice: z.number().min(0).max(100000000)
});

const createSchema = z.union([
  z.object({ quoteId: z.string().min(1).max(60) }),
  z.object({
    customer: customerSchema,
    lines: z.array(lineSchema).min(1).max(50),
    projectId: z.string().uuid().optional()
  })
]);

const statusSchema = z.object({ status: z.enum(['draft', 'sent', 'paid']) });

function toJson(invoice) {
  const i = invoice.toJSON();
  i.subtotalHT = Number(i.subtotalHT);
  i.vat = Number(i.vat);
  i.totalTTC = Number(i.totalTTC);
  return i;
}

export const invoicesRouter = Router();
invoicesRouter.use(requireAuth);

invoicesRouter.post('/', async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten() });
    }
    const { pricing } = await getSettings();
    let customer, lines, quoteId = null, projectId = null;

    if ('quoteId' in parsed.data) {
      const quote = await Quote.findByPk(parsed.data.quoteId);
      if (!quote) return res.status(404).json({ error: 'Devis introuvable.' });
      quoteId = quote.id;
      projectId = quote.projectId;
      customer = quote.customer;
      lines = quote.lines.map((l) => ({ ...l }));
    } else {
      customer = parsed.data.customer;
      lines = parsed.data.lines.map((l) => ({ ...l, total: round2(l.qty * l.unitPrice) }));
      projectId = parsed.data.projectId || null;
    }

    let prefix = 'FAC';
    if (projectId) {
      const project = await Product.findByPk(projectId);
      if (project && project.brandPrefix) {
        // Use project prefix + 'F' for facture
        prefix = project.brandPrefix + 'F';
      }
    }

    const subtotalHT = round2(lines.reduce((s, l) => s + l.total, 0));
    const vat = round2(subtotalHT * pricing.vatRate);
    const totalTTC = round2(subtotalHT + vat);
    const dueDate = new Date(Date.now() + 30 * 24 * 3600 * 1000);

    const invoice = await Invoice.create({
      number: await nextNumber('invoice', prefix),
      status: 'draft',
      quoteId,
      projectId,
      customer,
      lines,
      subtotalHT,
      vat,
      totalTTC,
      dueDate
    });
    res.status(201).json(toJson(invoice));
  } catch (err) {
    next(err);
  }
});

invoicesRouter.get('/', async (req, res, next) => {
  try {
    const invoices = await Invoice.findAll({ order: [['createdAt', 'DESC']] });
    res.json(invoices.map(toJson));
  } catch (err) {
    next(err);
  }
});

invoicesRouter.get('/:id/pdf', async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable.' });
    const { company, pricing } = await getSettings();
    let project = null;
    if (invoice.projectId) {
      project = await Product.findByPk(invoice.projectId);
    }
    generateInvoicePdf(toJson(invoice), company, pricing.vatRate, res, project);
  } catch (err) {
    next(err);
  }
});

invoicesRouter.patch('/:id', async (req, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Statut invalide.' });
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable.' });
    invoice.status = parsed.data.status;
    await invoice.save();
    res.json(toJson(invoice));
  } catch (err) {
    next(err);
  }
});
