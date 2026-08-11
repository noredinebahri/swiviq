// Crée ou réinitialise le compte administrateur du back-office.
// Usage : node scripts/set-admin.mjs <email> <motdepasse>
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { initDb, getSetting, setSetting } from '../src/db.js';

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error('Usage : node scripts/set-admin.mjs <email> <motdepasse>');
  process.exit(1);
}

await initDb();
const current = await getSetting('admin');
const passwordHash = await bcrypt.hash(password, 12);
await setSetting('admin', { ...(current || {}), email, passwordHash });

console.log(current ? 'Administrateur mis à jour' : 'Administrateur créé');
console.log('  login    :', email);
console.log('  ancien   :', current?.email || '(aucun)');
process.exit(0);
