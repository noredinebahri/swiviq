import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getSetting } from './db.js';

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set in .env and be at least 32 characters long.');
  }
  return secret;
}

const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200)
});

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Identifiants invalides.' });
    }
    const { email, password } = parsed.data;
    const admin = await getSetting('admin');
    const ok =
      admin &&
      email.toLowerCase() === admin.email.toLowerCase() &&
      (await bcrypt.compare(password, admin.passwordHash));
    if (!ok) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    const token = jwt.sign({ sub: admin.email, role: 'admin' }, jwtSecret(), {
      algorithm: 'HS256',
      expiresIn: '8h'
    });
    res.json({ token, expiresIn: 8 * 3600 });
  } catch (err) {
    next(err);
  }
});

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentification requise.' });
  try {
    const payload = jwt.verify(token, jwtSecret(), { algorithms: ['HS256'] });
    if (payload.role !== 'admin') throw new Error('not admin');
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Jeton invalide ou expiré.' });
  }
}

/** Returns true if the request carries a valid admin JWT (no error response). */
export function isAdmin(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return false;
  try {
    const payload = jwt.verify(token, jwtSecret(), { algorithms: ['HS256'] });
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
