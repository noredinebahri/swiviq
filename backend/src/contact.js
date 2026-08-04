import { Router } from 'express';
import { z } from 'zod';
import { Contact } from './db.js';
import { requireAuth } from './auth.js';

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  subject: z.string().min(2).max(200),
  message: z.string().min(5).max(5000)
});

export const contactRouter = Router();

// Public: submit a contact message
contactRouter.post('/contact', async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Données invalides.', details: parsed.error.flatten().fieldErrors });
    }
    const contact = await Contact.create(parsed.data);
    res.status(201).json({ ok: true, id: contact.id });
  } catch (err) {
    next(err);
  }
});

// Admin: list contact messages (newest first)
contactRouter.get('/contacts', requireAuth, async (req, res, next) => {
  try {
    const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});
