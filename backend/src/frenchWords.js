/**
 * Number → French words conversion for MAD amounts (invoices/quotes legal wording).
 */
const UNITS = [
  '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf'
];
const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', '', 'quatre-vingt', ''];

function below100(n) {
  if (n < 20) return UNITS[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (t === 7 || t === 9) {
    const base = t === 7 ? 'soixante' : 'quatre-vingt';
    const rest = UNITS[10 + u];
    return u === 1 && t === 7 ? `${base} et onze` : `${base}-${rest}`;
  }
  if (u === 0) return t === 8 ? 'quatre-vingts' : TENS[t];
  if (u === 1 && t !== 8) return `${TENS[t]} et un`;
  return `${TENS[t]}-${UNITS[u]}`;
}

function below1000(n) {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  let s = '';
  if (h > 0) {
    s = h === 1 ? 'cent' : `${UNITS[h]} cent`;
    if (rest === 0 && h > 1) s += 's';
  }
  if (rest > 0) s += (s ? ' ' : '') + below100(rest);
  return s;
}

export function numberToFrenchWords(n) {
  n = Math.floor(Math.abs(n));
  if (n === 0) return 'zéro';
  const parts = [];
  const billions = Math.floor(n / 1e9);
  const millions = Math.floor((n % 1e9) / 1e6);
  const thousands = Math.floor((n % 1e6) / 1e3);
  const rest = n % 1e3;
  if (billions) parts.push(billions === 1 ? 'un milliard' : `${below1000(billions)} milliards`);
  if (millions) parts.push(millions === 1 ? 'un million' : `${below1000(millions)} millions`);
  if (thousands) parts.push(thousands === 1 ? 'mille' : `${below1000(thousands)} mille`);
  if (rest) parts.push(below1000(rest));
  return parts.join(' ');
}

/** e.g. 51840 → "Cinquante et un mille huit cent quarante dirhams" */
export function madToFrenchWords(amount) {
  const dh = Math.floor(amount);
  const cts = Math.round((amount - dh) * 100);
  let s = `${numberToFrenchWords(dh)} dirham${dh > 1 ? 's' : ''}`;
  if (cts > 0) s += ` et ${numberToFrenchWords(cts)} centime${cts > 1 ? 's' : ''}`;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
