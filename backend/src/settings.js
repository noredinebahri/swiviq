import { Router } from 'express';
import { z } from 'zod';
import { getSettings, setSetting } from './db.js';
import { requireAuth } from './auth.js';

const serviceSchema = z.object({
  id: z.string().min(1).max(50),
  label: z.string().min(1).max(200),
  basePrice: z.number().min(0).max(100000000)
});

const optionSchema = z.object({
  id: z.string().min(1).max(50),
  label: z.string().min(1).max(200),
  price: z.number().min(0).max(100000000)
});

const pricingSchema = z.object({
  services: z.array(serviceSchema).min(1).max(50),
  options: z.array(optionSchema).max(50),
  complexityMultipliers: z.object({
    simple: z.number().positive().max(10),
    standard: z.number().positive().max(10),
    advanced: z.number().positive().max(10)
  }),
  urgencyMultipliers: z.object({
    normal: z.number().positive().max(10),
    fast: z.number().positive().max(10),
    express: z.number().positive().max(10)
  }),
  vatRate: z.number().min(0).max(1)
});

const companySchema = z.object({
  raisonSociale: z.string().min(1).max(200),
  capital: z.string().min(1).max(100),
  ice: z.string().min(1).max(30),
  identifiantFiscal: z.string().min(1).max(30),
  rc: z.string().min(1).max(30),
  rcTribunal: z.string().min(1).max(120),
  taxeProfessionnelle: z.string().min(1).max(30),
  siegeSocial: z.string().min(1).max(300),
  gerant: z.string().min(1).max(120),
  email: z.string().email().max(200),
  site: z.string().url().max(200),
  phone: z.string().max(30).optional()
});

const settingsSchema = z.object({
  company: companySchema,
  pricing: pricingSchema
});

// Public settings (for the frontend devis calculator)
export const publicSettingsRouter = Router();

publicSettingsRouter.get('/public', async (req, res, next) => {
  try {
    const { company, pricing } = await getSettings();
    res.json({
      company: {
        name: company.raisonSociale,
        email: company.email,
        phone: company.phone,
        address: company.siegeSocial,
        site: company.site
      },
      pricing
    });
  } catch (err) {
    next(err);
  }
});

// Admin settings
export const adminSettingsRouter = Router();
adminSettingsRouter.use(requireAuth);

adminSettingsRouter.get('/settings', async (req, res, next) => {
  try {
    res.json(await getSettings()); // never includes the admin password hash
  } catch (err) {
    next(err);
  }
});

adminSettingsRouter.put('/settings', async (req, res, next) => {
  try {
    const parsed = settingsSchema.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => {
        const path = i.path.join('.');
        if (i.code === 'too_small' && i.type === 'string') return `${path} : champ requis (au moins 1 caractère)`;
        if (i.code === 'invalid_string' && i.validation === 'email') return `${path} : email invalide`;
        if (i.code === 'invalid_string' && i.validation === 'url') return `${path} : URL invalide`;
        return `${path} : ${i.message}`;
      });
      const fields = [...new Set(parsed.error.issues.map((i) => i.path.join('.')))];
      return res.status(400).json({ error: 'Paramètres invalides.', details: { ...parsed.error.flatten(), issues, fields } });
    }
    await setSetting('company', parsed.data.company);
    await setSetting('pricing', parsed.data.pricing);
    res.json(parsed.data);
  } catch (err) {
    next(err);
  }
});
