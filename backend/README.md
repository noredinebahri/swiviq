# SWIVIQ Backend

API Node.js (ESM) / Express 5 pour le site SWIVIQ : devis, factures PDF, contact, chatbot SWIVI et paramètres admin. Persistance **MySQL** via **Sequelize** (driver `mysql2`).

## Démarrage

```bash
cp .env.example .env   # renseigner DB_PASS, JWT_SECRET (hex 64 aléatoire) et ADMIN_PASSWORD
npm install
npm run dev            # ou: npm start
```

Serveur sur `http://localhost:4000` (configurable via `PORT`).

Au démarrage :
1. La base `swiviq_dev` est créée si absente (`CREATE DATABASE IF NOT EXISTS`).
2. `sequelize.sync({ alter: false })` crée les tables manquantes (`settings`, `quotes`, `invoices`, `contacts`, `counters`).
3. Les paramètres par défaut (société + catalogue tarifs) et le compte admin (mot de passe hashé bcrypt) sont seedés au premier boot.

## Variables d'environnement (.env)

| Variable | Description |
|---|---|
| `PORT` | Port HTTP (défaut 4000) |
| `DB_HOST` / `DB_PORT` | MySQL (défaut `127.0.0.1:3306`) |
| `DB_NAME` | Base de données (défaut `swiviq_dev`) |
| `DB_USER` / `DB_PASS` | Identifiants MySQL |
| `JWT_SECRET` | Secret JWT HS256 — obligatoire, ≥ 32 caractères |
| `ADMIN_EMAIL` | Email admin (défaut `admin@swiviq.ma`) |
| `ADMIN_PASSWORD` | Mot de passe admin initial (hashé bcrypt au 1er démarrage) |
| `AI_API_KEY` | Clé API IA (optionnel — sinon fallback à règles) |
| `AI_API_URL` | URL API compatible OpenAI (défaut chat/completions OpenAI) |
| `AI_MODEL` | Modèle (défaut `gpt-4o-mini`) |
| `CORS_ORIGIN` | Origine(s) autorisée(s), séparées par virgule (défaut `http://localhost:4200`) |

## Endpoints

### Public

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Sonde de santé |
| `GET` | `/api/settings/public` | Catalogue tarifs + infos société (sans secrets) |
| `POST` | `/api/quotes` | Créer un devis. Body : `{ customer:{name,email,company?,phone?,ice?,address?}, serviceIds[], optionIds[], complexity: simple\|standard\|advanced, urgency: normal\|fast\|express, description? }`. Totaux calculés côté serveur (HT × multiplicateurs + options, TVA 20 %). Numérotation `DEV-YYYY-####`. Retourne le devis + `publicToken`. |
| `GET` | `/api/quotes/:id/pdf?token=<publicToken>` | PDF du devis (token public **ou** JWT admin) |
| `POST` | `/api/contact` | Message de contact `{name,email,subject,message}` |
| `POST` | `/api/chat` | Chatbot SWIVI `{messages:[{role:'user'\|'assistant',content}]}` (max 20 messages de 1000 caractères). Proxy IA si `AI_API_KEY`, sinon réponses à règles. Filtre anti-injection de prompt côté serveur. |
| `POST` | `/api/auth/login` | `{email,password}` → `{token}` JWT 8 h |

### Admin (header `Authorization: Bearer <token>`)

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/quotes` | Liste des devis (plus récents d'abord) |
| `PATCH` | `/api/quotes/:id` | `{status: new\|sent\|accepted\|rejected}` |
| `POST` | `/api/invoices` | `{quoteId}` (copie client/lignes/totaux) **ou** `{customer, lines:[{label,qty,unitPrice}]}`. Numérotation `FAC-YYYY-####`, échéance +30 jours. |
| `GET` | `/api/invoices` | Liste des factures |
| `GET` | `/api/invoices/:id/pdf` | PDF facture conforme (ICE/IF/RC/TP/Capital, montant en lettres, pénalités de retard) |
| `PATCH` | `/api/invoices/:id` | `{status: draft\|sent\|paid}` |
| `GET` | `/api/contacts` | Messages de contact |
| `GET` | `/api/admin/settings` | Paramètres (société + tarifs) |
| `PUT` | `/api/admin/settings` | Mise à jour paramètres (validés Zod) |

## Sécurité

- Helmet, CORS restreint à `CORS_ORIGIN`, `express.json` limité à 100 kb.
- Rate limiting : global 300 req/15 min, `/api/chat` 20/5 min, `/api/auth` 10/15 min.
- JWT HS256 8 h ; mot de passe admin hashé bcrypt (12 rounds).
- Gestion d'erreur centrale sans stack trace côté client ; jamais de fuite de clé API.
- Numérotation devis/factures transaction-safe (verrou `SELECT ... FOR UPDATE`).

## Infos légales (seedées, modifiables via admin settings)

SWIVIQ SARL AU — Capital 100 000,00 MAD — ICE 003963563000019 — IF 73099178 —
RC 200173 (Tribunal de Commerce de Rabat) — TP 25116641 —
Imm 30, Appt 8, Rue Moulay Ahmed Loukili, Hassan, Rabat, Maroc —
Gérant : Noredine Bahri — contact@swiviq.ma — https://swiviq.ma — TVA 20 %.
