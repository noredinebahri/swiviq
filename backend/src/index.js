import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { initDb } from './db.js';
import { authRouter } from './auth.js';
import { quotesRouter } from './quotes.js';
import { invoicesRouter } from './invoices.js';
import { contactRouter } from './contact.js';
import { chatRouter } from './chat.js';
import { publicSettingsRouter, adminSettingsRouter } from './settings.js';
import { publicProductsRouter, adminProductsRouter } from './products.js';
import { uploadsRouter, UPLOADS_DIR } from './uploads.js';

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false, // pure JSON/PDF API — CSP not applicable
    crossOriginResourcePolicy: { policy: 'cross-origin' } // allow PDF fetch from frontend
  })
);
app.use(
  cors({
    origin: CORS_ORIGIN.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '100kb' }));

// Debug: log ALL requests early (BEFORE rate limiter)
app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.path);
  next();
});

// TEST: Direct route to see if it works
app.get('/api/test-direct', (req, res) => res.json({ ok: 'direct' }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de requêtes. Veuillez réessayer plus tard.' }
});
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de messages. Veuillez patienter quelques minutes.' }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.' }
});

app.use(globalLimiter);

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'swiviq-backend' }));

// Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api', contactRouter); // POST /api/contact, GET /api/contacts
app.use('/api/chat', chatLimiter, chatRouter);
app.use('/api/settings', publicSettingsRouter); // GET /api/settings/public
app.use('/api/admin', adminSettingsRouter); // GET/PUT /api/admin/settings
app.use('/api/products', publicProductsRouter); // public products + subscribe
app.use('/api/admin/products', adminProductsRouter); // admin CRUD + subscribers
app.use('/api/admin/uploads', uploadsRouter); // POST image upload (auth)

// Public static serving of uploaded images
app.use(
  '/uploads',
  express.static(UPLOADS_DIR, {
    index: false,
    dotfiles: 'deny',
    fallthrough: false,
    maxAge: '7d',
    immutable: true
  })
);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ressource introuvable.' });
});

// Central error handler — never leaks stack traces
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
  if (status >= 500) console.error('[error]', err.message, err.stack);
  const message =
    status === 400 && err.message ? err.message :
    err.type === 'entity.too.large' ? 'Charge utile trop volumineuse.' :
    err.type === 'entity.parse.failed' ? 'JSON invalide.' :
    status < 500 && err.expose ? err.message :
    status < 500 && err.message && err.status ? err.message :
    'Une erreur interne est survenue.';
  res.status(status).json({ error: message });
});

// Await DB init (create DB if missing, sync models, seed defaults) before listening.
try {
  await initDb();
} catch (err) {
  console.error('[fatal] Database initialisation failed:', err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`SWIVIQ backend running on http://localhost:${PORT} (CORS: ${CORS_ORIGIN})`);
});
