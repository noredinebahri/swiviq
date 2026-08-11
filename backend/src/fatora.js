import { Router } from 'express';
import { requireAuth } from './auth.js';

// Relais vers l'API d'administration de Fatora-Bot.
// L'admin s'authentifie ici avec son JWT Swiviq ; la clé partagée reste côté serveur
// et le service Fatora conserve ses propres données et son jeton WhatsApp.
const FATORA_URL = process.env.FATORA_API_URL || 'https://bot.swiviq.com';
const FATORA_KEY = process.env.FATORA_ADMIN_KEY || '';

export const fatoraRouter = Router();
fatoraRouter.use(requireAuth);

async function forward(req, res, path, init = {}) {
  if (!FATORA_KEY) {
    return res.status(503).json({ error: 'FATORA_ADMIN_KEY absent de la configuration.' });
  }
  try {
    const response = await fetch(`${FATORA_URL}/admin${path}`, {
      ...init,
      headers: { 'X-Admin-Key': FATORA_KEY, 'Content-Type': 'application/json', ...(init.headers || {}) },
      signal: AbortSignal.timeout(15000)
    });
    const body = await response.json().catch(() => ({}));
    res.status(response.status).json(body);
  } catch (err) {
    res.status(502).json({ error: 'Service Fatora-Bot injoignable.', detail: err.message });
  }
}

fatoraRouter.get('/stats', (req, res) => forward(req, res, '/stats'));

fatoraRouter.get('/tenants', (req, res) => {
  const params = new URLSearchParams();
  if (req.query.q) params.set('q', String(req.query.q).slice(0, 120));
  if (req.query.plan) params.set('plan', String(req.query.plan).slice(0, 10));
  const qs = params.toString();
  return forward(req, res, `/tenants${qs ? '?' + qs : ''}`);
});

fatoraRouter.get('/tenants/:id', (req, res) =>
  forward(req, res, `/tenants/${encodeURIComponent(req.params.id)}`));

fatoraRouter.patch('/tenants/:id/plan', (req, res) =>
  forward(req, res, `/tenants/${encodeURIComponent(req.params.id)}/plan`, {
    method: 'PATCH',
    body: JSON.stringify({ plan: req.body?.plan, notify: req.body?.notify !== false })
  }));

fatoraRouter.post('/tenants/:id/message', (req, res) =>
  forward(req, res, `/tenants/${encodeURIComponent(req.params.id)}/message`, {
    method: 'POST',
    body: JSON.stringify({ text: req.body?.text })
  }));

fatoraRouter.patch('/invoices/:id/status', (req, res) =>
  forward(req, res, `/invoices/${encodeURIComponent(req.params.id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: req.body?.status })
  }));

fatoraRouter.patch('/tenants/:id', (req, res) =>
  forward(req, res, `/tenants/${encodeURIComponent(req.params.id)}`, {
    method: 'PATCH', body: JSON.stringify(req.body || {})
  }));

fatoraRouter.post('/tenants/:id/suspend', (req, res) =>
  forward(req, res, `/tenants/${encodeURIComponent(req.params.id)}/suspend`, {
    method: 'POST', body: JSON.stringify(req.body || {})
  }));

fatoraRouter.post('/tenants/:id/credit', (req, res) =>
  forward(req, res, `/tenants/${encodeURIComponent(req.params.id)}/credit`, {
    method: 'POST', body: JSON.stringify(req.body || {})
  }));

fatoraRouter.get('/tenants/:id/logs', (req, res) =>
  forward(req, res, `/tenants/${encodeURIComponent(req.params.id)}/logs`));

fatoraRouter.get('/invoices', (req, res) => {
  const params = new URLSearchParams();
  for (const key of ['q', 'sort', 'limit', 'status']) {
    if (req.query[key]) params.set(key, String(req.query[key]).slice(0, 120));
  }
  const qs = params.toString();
  return forward(req, res, `/invoices${qs ? '?' + qs : ''}`);
});

// Export CSV : réponse texte, pas JSON — on relaie le flux tel quel
fatoraRouter.get('/export.csv', async (req, res) => {
  if (!FATORA_KEY) return res.status(503).json({ error: 'FATORA_ADMIN_KEY absent.' });
  try {
    const r = await fetch(`${FATORA_URL}/admin/export.csv`, {
      headers: { 'X-Admin-Key': FATORA_KEY },
      signal: AbortSignal.timeout(20000)
    });
    const body = await r.text();
    res.status(r.status)
      .set('Content-Type', 'text/csv; charset=utf-8')
      .set('Content-Disposition', r.headers.get('content-disposition') || 'attachment; filename="fatora-comptes.csv"')
      .send(body);
  } catch (err) {
    res.status(502).json({ error: 'Service Fatora-Bot injoignable.', detail: err.message });
  }
});

fatoraRouter.get('/health', (req, res) => forward(req, res, '/health'));

fatoraRouter.get('/logs', (req, res) => {
  const params = new URLSearchParams();
  for (const key of ['limit', 'type', 'q']) {
    if (req.query[key]) params.set(key, String(req.query[key]).slice(0, 120));
  }
  const qs = params.toString();
  return forward(req, res, `/logs${qs ? '?' + qs : ''}`);
});
