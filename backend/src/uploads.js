import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { requireAuth } from './auth.js';

// uploads/ at backend root (src/.. = backend root)
export const UPLOADS_DIR = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_MIME = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/avif', '.avif']
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = ALLOWED_MIME.get(file.mimetype) || '.bin';
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5 Mo max
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('Format non supporté. Utilisez JPG, PNG, WebP, GIF ou AVIF.'));
    }
    cb(null, true);
  }
});

export const uploadsRouter = Router();
uploadsRouter.use(requireAuth);

uploadsRouter.post('/', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image trop lourde (5 Mo maximum).' : err.message;
      return res.status(status).json({ error: message });
    }
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu.' });
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});
