import PDFDocument from 'pdfkit';
import { madToFrenchWords } from './frenchWords.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.join(__dirname, '..', 'assets', 'logos');

/* ---------- Brand system (Han Purple / logo blue / Smoky Black / Cadet Blue) ---------- */
const PRIMARY = '#7435F2';
const BLUE = '#2060F0';
const INK = '#141419';
const DARK = '#23242B';
const GREY = '#6E7480';
const SOFT = '#9AA0AC';
const BORDER = '#E7E4F4';
const ZEBRA = '#F8F7FD';
const LIGHT_BG = '#F4F2FC';
const WHITE = '#FFFFFF';

const MARGIN = 44;
const CONTENT_W = 595.28 - MARGIN * 2; // A4 width 595.28pt → 507pt usable

export function formatMAD(n) {
  return (
    Number(n)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      .replace('.', ',') + ' MAD'
  );
}

function frDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function getProject(project) {
  return project || {
    name: 'SWIVIQ',
    brandColor: PRIMARY,
    brandTagline: 'Agence digitale — Développement web, mobile & solutions cloud',
    brandPrefix: 'SW'
  };
}

function brandGradient(doc, x, y, w) {
  return doc.linearGradient(x, y, x + w, y).stop(0, PRIMARY).stop(1, BLUE);
}

function loadLogo(project) {
  const p = getProject(project);
  for (const ext of ['png', 'jpg']) {
    const f = path.join(LOGOS_DIR, `${p.brandPrefix || 'SW'}.${ext}`);
    if (fs.existsSync(f)) return f;
  }
  const fallback = path.join(LOGOS_DIR, 'SW.png');
  return fs.existsSync(fallback) ? fallback : null;
}

/* ============================================================
   Header — brand bar, logo, company identity, doc title + meta
   ============================================================ */
function drawHeader(doc, company, docTitle, project) {
  const p = getProject(project);
  const pageW = doc.page.width;

  // Brand gradient bar
  doc.rect(0, 0, pageW, 7).fill(brandGradient(doc, 0, 0, pageW));

  // Logo (real brand asset) — fallback to text if missing
  const logo = loadLogo(project);
  if (logo) {
    doc.image(logo, MARGIN, 30, { width: 148 });
  } else {
    doc.fillColor(INK).font('Helvetica-Bold').fontSize(24).text(p.name, MARGIN, 34);
    doc.font('Helvetica').fontSize(7.5).fillColor(GREY).text(p.brandTagline || '', MARGIN, 60);
  }

  // Company identity — right aligned
  doc.font('Helvetica-Bold').fontSize(9).fillColor(INK)
    .text(company.raisonSociale, 300, 32, { width: pageW - 300 - MARGIN, align: 'right' });
  doc.font('Helvetica').fontSize(7.5).fillColor(GREY)
    .text(company.siegeSocial, 300, 44, { width: pageW - 300 - MARGIN, align: 'right' })
    .text(`${company.email}${company.phone ? ' — ' + company.phone : ''}`, 300, 63, { width: pageW - 300 - MARGIN, align: 'right' })
    .text(company.site, 300, 73, { width: pageW - 300 - MARGIN, align: 'right' });

  // Document title
  doc.font('Helvetica-Bold').fontSize(24).fillColor(PRIMARY).text(docTitle, MARGIN, 100);

  // Separator
  doc.moveTo(MARGIN, 132).lineTo(pageW - MARGIN, 132).lineWidth(1.2)
    .strokeColor(brandGradient(doc, MARGIN, 0, CONTENT_W)).stroke();
}

/* ---------- Meta box (number, dates, currency) ---------- */
function drawMetaBox(doc, rows, y) {
  const boxW = 218;
  const x = doc.page.width - MARGIN - boxW;
  const h = 18 + rows.length * 15;

  doc.roundedRect(x, y, boxW, h, 5).fill(LIGHT_BG);
  rows.forEach(([label, value], i) => {
    const rowY = y + 10 + i * 15;
    doc.font('Helvetica').fontSize(7.5).fillColor(GREY).text(label.toUpperCase(), x + 12, rowY);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(INK).text(String(value), x + 12, rowY, { width: boxW - 24, align: 'right' });
  });
  return h;
}

/* ---------- Party card (Émetteur / Client) ---------- */
function partyCardHeight(doc, lines, w) {
  const body = lines.filter(Boolean).join('\n');
  return doc.heightOfString(body, { width: w - 24, lineGap: 2.5 }) + 34;
}

function drawPartyCard(doc, title, lines, x, y, w, h, accentOnly = false) {
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(PRIMARY).text(title.toUpperCase(), x + 2, y);
  const boxY = y + 12;

  doc.roundedRect(x, boxY, w, h, 6).lineWidth(1).strokeColor(BORDER).stroke();
  if (!accentOnly) {
    doc.save();
    doc.roundedRect(x, boxY, w, h, 6).clip();
    doc.rect(x, boxY, 3.5, h).fill(brandGradient(doc, x, boxY, h));
    doc.restore();
  }
  doc.font('Helvetica').fontSize(8.5).fillColor(DARK)
    .text(lines.filter(Boolean).join('\n'), x + 14, boxY + 13, { width: w - 24, lineGap: 2.5 });
  return h;
}

/* ---------- Lines table ---------- */
function tableCols(pageW) {
  return {
    label: MARGIN,
    qty: MARGIN + 265,
    pu: MARGIN + 318,
    totalX: pageW - MARGIN - 95
  };
}

function drawTableHead(doc, y) {
  const cols = tableCols(doc.page.width);
  doc.save();
  doc.roundedRect(MARGIN, y, CONTENT_W, 22, 5).clip();
  doc.rect(MARGIN, y, CONTENT_W, 22).fill(brandGradient(doc, MARGIN, y, CONTENT_W));
  doc.restore();
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(WHITE);
  doc.text('DÉSIGNATION', cols.label + 10, y + 7);
  doc.text('QTÉ', cols.qty, y + 7, { width: 46, align: 'center' });
  doc.text('PU HT', cols.pu, y + 7, { width: 92, align: 'right' });
  doc.text('TOTAL HT', cols.totalX, y + 7, { width: 95, align: 'right' });
  return y + 22;
}

function drawLinesTable(doc, lines, startY) {
  const pageW = doc.page.width;
  const cols = tableCols(pageW);
  const bottomLimit = doc.page.height - 150;
  let y = drawTableHead(doc, startY);

  doc.font('Helvetica').fontSize(8.5);
  lines.forEach((line, i) => {
    const labelH = doc.heightOfString(String(line.label), { width: 250 });
    const h = Math.max(22, labelH + 12);
    if (y + h > bottomLimit) {
      doc.addPage();
      y = drawTableHead(doc, 60);
    }
    if (i % 2 === 1) doc.rect(MARGIN, y, CONTENT_W, h).fill(ZEBRA);
    doc.fillColor(DARK).text(String(line.label), cols.label + 10, y + 7, { width: 250, lineGap: 1.5 });
    doc.fillColor(DARK).text(String(line.qty ?? 1), cols.qty, y + 7, { width: 46, align: 'center' });
    doc.text(formatMAD(line.unitPrice), cols.pu, y + 7, { width: 92, align: 'right' });
    doc.font('Helvetica-Bold').text(formatMAD(line.total), cols.totalX, y + 7, { width: 95, align: 'right' });
    doc.font('Helvetica');
    y += h;
  });

  doc.moveTo(MARGIN, y + 4).lineTo(pageW - MARGIN, y + 4).lineWidth(1).strokeColor(BORDER).stroke();
  return y + 12;
}

/* ---------- Pagination guard — never draw into the footer zone ---------- */
const PAGE_TOP = 56;
function ensureSpace(doc, y, needed) {
  const limit = doc.page.height - 108; // footer starts at height - 84 → keep a safety gap
  if (y + needed > limit) {
    doc.addPage();
    return PAGE_TOP;
  }
  return y;
}

/* ---------- Totals ---------- */
function drawTotals(doc, totals, vatRate, y) {
  const boxW = 222;
  const x = doc.page.width - MARGIN - boxW;

  const rows = [
    ['Total HT', formatMAD(totals.subtotal)],
    [`TVA (${Math.round(vatRate * 100)} %)`, formatMAD(totals.vat)]
  ];
  rows.forEach(([label, value], i) => {
    const rowY = y + i * 17;
    doc.font('Helvetica').fontSize(8.5).fillColor(GREY).text(label, x + 10, rowY);
    doc.font('Helvetica-Bold').fontSize(9).fillColor(DARK).text(value, x, rowY, { width: boxW - 10, align: 'right' });
  });

  const ttcY = y + rows.length * 17 + 6;
  doc.roundedRect(x, ttcY, boxW, 30, 6).fill(brandGradient(doc, x, ttcY, boxW));
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(WHITE).text('TOTAL TTC', x + 12, ttcY + 10);
  doc.fontSize(11).text(formatMAD(totals.total), x, ttcY + 9.5, { width: boxW - 12, align: 'right' });
  return ttcY + 38;
}

/* ---------- Amount in words (legal) ---------- */
function drawAmountInWords(doc, intro, total, y) {
  const text = `${madToFrenchWords(total)} toutes taxes comprises.`;
  const h = doc.heightOfString(text, { width: CONTENT_W - 24 }) + 30;
  doc.roundedRect(MARGIN, y, CONTENT_W, h, 6).fill(LIGHT_BG);
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(INK).text(intro, MARGIN + 12, y + 9);
  doc.font('Helvetica-Oblique').fontSize(8.5).fillColor(DARK)
    .text(text, MARGIN + 12, y + 21, { width: CONTENT_W - 24, lineGap: 1.5 });
  return y + h + 12;
}

/* ---------- Signature zones ---------- */
function drawSignatureBoxes(doc, company, y, isQuote) {
  const boxW = (CONTENT_W - 14) / 2;
  const h = 92;
  const boxes = isQuote
    ? [
        { x: MARGIN, title: 'POUR ' + company.raisonSociale, lines: [`Nom : ${company.gerant || ''}`, 'Date : ____ / ____ / ________', '', 'Signature :'] },
        { x: MARGIN + boxW + 14, title: 'BON POUR ACCORD — LE CLIENT', lines: ['Nom et qualité : ______________________', 'Fait à : ____________, le ____ / ____ / ________', '', 'Signature et cachet :'] }
      ]
    : [
        { x: doc.page.width - MARGIN - boxW, title: 'POUR ' + company.raisonSociale, lines: [`Nom : ${company.gerant || ''}`, 'Date : ____ / ____ / ________', '', 'Signature et cachet :'] }
      ];

  for (const b of boxes) {
    doc.roundedRect(b.x, y, boxW, h, 6).dash(3, { space: 3 }).lineWidth(0.8).strokeColor(SOFT).stroke();
    doc.undash();
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(PRIMARY).text(b.title, b.x + 12, y + 10, { width: boxW - 24 });
    doc.font('Helvetica').fontSize(8.5).fillColor(DARK)
      .text(b.lines.join('\n'), b.x + 12, y + 26, { width: boxW - 24, lineGap: 5 });
  }
  return y + h + 10;
}

/* ---------- Footer on every page (full legal identity — Moroccan law) ---------- */
function drawFooters(doc, company) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    const pageW = doc.page.width;
    const y = doc.page.height - 84; // keep above bottom margin (no auto page-break)

    doc.moveTo(MARGIN, y).lineTo(pageW - MARGIN, y).lineWidth(0.8)
      .strokeColor(brandGradient(doc, MARGIN, 0, CONTENT_W)).stroke();
    doc.font('Helvetica').fontSize(6.8).fillColor(GREY);
    doc.text(
      `${company.raisonSociale} au capital de ${company.capital} — Siège social : ${company.siegeSocial}`,
      MARGIN, y + 5, { width: CONTENT_W, align: 'center', lineBreak: false }
    );
    doc.text(
      `ICE : ${company.ice} — IF : ${company.identifiantFiscal} — RC : ${company.rc} (${company.rcTribunal}) — Taxe professionnelle : ${company.taxeProfessionnelle}`,
      MARGIN, y + 14, { width: CONTENT_W, align: 'center', lineBreak: false }
    );
    doc.text(`${company.email} — ${company.site}`, MARGIN, y + 23, { width: CONTENT_W, align: 'center', lineBreak: false });
    doc.fontSize(7).fillColor(SOFT).text(`Page ${i + 1} / ${range.count}`, pageW - MARGIN - 60, y + 23, { width: 60, align: 'right', lineBreak: false });
  }
}

function drawLegalNote(doc, text, y) {
  doc.font('Helvetica-Oblique').fontSize(7.2).fillColor(GREY)
    .text(text, MARGIN, y, { width: CONTENT_W, align: 'justify', lineGap: 1.5 });
}

/* ============================================================
   Public API
   ============================================================ */

export function generateQuotePdf(quote, company, vatRate, res, project) {
  const totals = {
    subtotal: Number(quote.subtotalHT),
    vat: Number(quote.vat),
    total: Number(quote.totalTTC)
  };
  const doc = new PDFDocument({ size: 'A4', margin: MARGIN, bufferPages: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${quote.number}.pdf"`);
  doc.pipe(res);

  drawHeader(doc, company, 'DEVIS', project);
  drawMetaBox(doc, [
    ['N° de devis', quote.number],
    ['Date d’émission', frDate(quote.createdAt)],
    ['Validité', '30 jours'],
    ['Devise', 'MAD (Dirham marocain)']
  ], 88);

  const cardY = 158;
  const cardW = (CONTENT_W - 14) / 2;
  const sellerLines = [
    company.raisonSociale,
    company.siegeSocial,
    `ICE : ${company.ice}`,
    `IF : ${company.identifiantFiscal} — RC : ${company.rc} (${company.rcTribunal})`,
    `Taxe professionnelle : ${company.taxeProfessionnelle}`,
    company.email
  ];
  const c = quote.customer;
  const clientLines = [
    c.name,
    c.company,
    c.address,
    c.email,
    c.phone,
    c.ice ? `ICE : ${c.ice}` : null
  ];
  const cardH = Math.max(
    partyCardHeight(doc, sellerLines, cardW),
    partyCardHeight(doc, clientLines, cardW)
  );
  drawPartyCard(doc, 'Émetteur', sellerLines, MARGIN, cardY, cardW, cardH, true);
  drawPartyCard(doc, 'Client', clientLines, MARGIN + cardW + 14, cardY, cardW, cardH);

  let y = drawLinesTable(doc, quote.lines, cardY + cardH + 30);
  y = ensureSpace(doc, y, 82);
  y = drawTotals(doc, totals, vatRate, y);
  y = ensureSpace(doc, y, 72);
  y = drawAmountInWords(doc, 'Arrêté le présent devis à la somme de :', totals.total, y);

  if (quote.description) {
    const descH = doc.heightOfString(quote.description, { width: CONTENT_W, lineGap: 1.5 });
    y = ensureSpace(doc, y, 13 + descH + 12);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(INK).text('Description du projet :', MARGIN, y);
    doc.font('Helvetica').fontSize(8.5).fillColor(GREY)
      .text(quote.description, MARGIN, y + 13, { width: CONTENT_W, lineGap: 1.5 });
    y = doc.y + 12; // real cursor (safe even if the text spans pages)
  }

  y = ensureSpace(doc, y + 6, 102);
  y = drawSignatureBoxes(doc, company, y + 6, true);
  const legalText =
    'Devis valable 30 jours à compter de sa date d’émission. Prix exprimés en dirhams marocains (MAD). ' +
    'Tout devis retourné signé avec la mention manuscrite « Bon pour accord » vaut commande ferme et engage les deux parties ' +
    'conformément au Code des obligations et des contrats (Dahir du 12 août 1913).';
  const legalH = doc.heightOfString(legalText, { width: CONTENT_W, lineGap: 1.5 });
  drawLegalNote(doc, legalText, ensureSpace(doc, y + 8, legalH + 4));

  drawFooters(doc, company);
  doc.end();
}

export function generateInvoicePdf(invoice, company, vatRate, res, project) {
  const totals = {
    subtotal: Number(invoice.subtotalHT),
    vat: Number(invoice.vat),
    total: Number(invoice.totalTTC)
  };
  const doc = new PDFDocument({ size: 'A4', margin: MARGIN, bufferPages: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${invoice.number}.pdf"`);
  doc.pipe(res);

  drawHeader(doc, company, 'FACTURE', project);
  drawMetaBox(doc, [
    ['N° de facture', invoice.number],
    ['Date d’émission', frDate(invoice.createdAt)],
    ['Date d’échéance', frDate(invoice.dueDate)],
    ['Devise', 'MAD (Dirham marocain)']
  ], 88);

  const cardY = 158;
  const cardW = (CONTENT_W - 14) / 2;
  const sellerLines = [
    company.raisonSociale,
    company.siegeSocial,
    `ICE : ${company.ice}`,
    `IF : ${company.identifiantFiscal} — RC : ${company.rc} (${company.rcTribunal})`,
    `Taxe professionnelle : ${company.taxeProfessionnelle}`,
    company.email
  ];
  const c = invoice.customer;
  const clientLines = [
    c.name,
    c.company,
    c.address,
    c.email,
    c.phone,
    c.ice ? `ICE : ${c.ice}` : null
  ];
  const cardH = Math.max(
    partyCardHeight(doc, sellerLines, cardW),
    partyCardHeight(doc, clientLines, cardW)
  );
  drawPartyCard(doc, 'Émetteur', sellerLines, MARGIN, cardY, cardW, cardH, true);
  drawPartyCard(doc, 'Facturé à', clientLines, MARGIN + cardW + 14, cardY, cardW, cardH);

  let y = drawLinesTable(doc, invoice.lines, cardY + cardH + 30);
  y = ensureSpace(doc, y, 82);
  y = drawTotals(doc, totals, vatRate, y);
  y = ensureSpace(doc, y, 72);
  y = drawAmountInWords(doc, 'Arrêtée la présente facture à la somme de :', totals.total, y);

  y = ensureSpace(doc, y + 6, 102);
  y = drawSignatureBoxes(doc, company, y + 6, false);
  const legalText =
    'Conditions de règlement : paiement à 30 jours à compter de la date de facturation. Tout retard de paiement entraîne, ' +
    'de plein droit et sans mise en demeure préalable, l’application de pénalités de retard au taux légal en vigueur, ' +
    'conformément à la loi n° 69-21 modifiant la loi n° 15-95 formant Code de commerce. Pas d’escompte pour paiement anticipé.';
  const legalH = doc.heightOfString(legalText, { width: CONTENT_W, lineGap: 1.5 });
  drawLegalNote(doc, legalText, ensureSpace(doc, y + 8, legalH + 4));

  drawFooters(doc, company);
  doc.end();
}
