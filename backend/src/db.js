import { Sequelize, DataTypes } from 'sequelize';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_NAME = process.env.DB_NAME || 'swiviq_dev';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS ?? '';

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
  define: { charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' },
  pool: { max: 10, min: 0, idle: 10000 }
});

/* ---------------- Models ---------------- */

export const Setting = sequelize.define('Setting', {
  key: { type: DataTypes.STRING(64), primaryKey: true },
  value: { type: DataTypes.JSON, allowNull: false }
}, { tableName: 'settings' });

export const Quote = sequelize.define('Quote', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  number: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  status: { type: DataTypes.ENUM('new', 'sent', 'accepted', 'rejected'), allowNull: false, defaultValue: 'new' },
  projectId: { type: DataTypes.UUID, allowNull: true },
  customer: { type: DataTypes.JSON, allowNull: false },
  serviceIds: { type: DataTypes.JSON, allowNull: false },
  optionIds: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  complexity: { type: DataTypes.STRING(20), allowNull: false },
  urgency: { type: DataTypes.STRING(20), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  lines: { type: DataTypes.JSON, allowNull: false },
  subtotalHT: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  vat: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  totalTTC: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  publicToken: { type: DataTypes.STRING(64), allowNull: false }
}, { tableName: 'quotes' });

export const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  number: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  status: { type: DataTypes.ENUM('draft', 'sent', 'paid'), allowNull: false, defaultValue: 'draft' },
  quoteId: { type: DataTypes.UUID, allowNull: true },
  projectId: { type: DataTypes.UUID, allowNull: true },
  customer: { type: DataTypes.JSON, allowNull: false },
  lines: { type: DataTypes.JSON, allowNull: false },
  subtotalHT: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  vat: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  totalTTC: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  dueDate: { type: DataTypes.DATE, allowNull: false }
}, { tableName: 'invoices' });

export const Contact = sequelize.define('Contact', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(200), allowNull: false },
  subject: { type: DataTypes.STRING(200), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'contacts' });

export const Counter = sequelize.define('Counter', {
  key: { type: DataTypes.STRING(64), primaryKey: true },
  value: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, { tableName: 'counters' });

export const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  type: { type: DataTypes.ENUM('app', 'website', 'saas'), allowNull: false, defaultValue: 'app' },
  name: { type: DataTypes.STRING(160), allowNull: false },
  tagline: { type: DataTypes.STRING(240), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  coverUrl: { type: DataTypes.STRING(500), allowNull: false },
  technologies: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  features: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  websiteUrl: { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  repoUrl: { type: DataTypes.STRING(500), allowNull: false, defaultValue: '' },
  status: { type: DataTypes.ENUM('live', 'beta', 'coming-soon'), allowNull: false, defaultValue: 'live' },
  photos: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  brandColor: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '#7435F2' },
  brandTagline: { type: DataTypes.STRING(240), allowNull: false, defaultValue: 'Agence digitale — Développement web, mobile & solutions cloud' },
  brandPrefix: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'SW' }
}, { tableName: 'products' });

export const Plan = sequelize.define('Plan', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING(120), allowNull: false },
  price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'MAD' },
  interval: { type: DataTypes.ENUM('month', 'year', 'one-time'), allowNull: false, defaultValue: 'month' },
  tagline: { type: DataTypes.STRING(200), allowNull: false, defaultValue: '' },
  features: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  highlighted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  ctaLabel: { type: DataTypes.STRING(80), allowNull: false, defaultValue: '' }
}, { tableName: 'plans' });

export const Subscriber = sequelize.define('Subscriber', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  number: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  productId: { type: DataTypes.UUID, allowNull: false },
  planId: { type: DataTypes.UUID, allowNull: true },
  name: { type: DataTypes.STRING(160), allowNull: false },
  email: { type: DataTypes.STRING(200), allowNull: false },
  company: { type: DataTypes.STRING(200), allowNull: false, defaultValue: '' },
  phone: { type: DataTypes.STRING(40), allowNull: false, defaultValue: '' },
  status: { type: DataTypes.ENUM('pending', 'active', 'suspended', 'cancelled'), allowNull: false, defaultValue: 'pending' }
}, { tableName: 'subscribers' });

Product.hasMany(Plan, { as: 'plans', foreignKey: 'productId', onDelete: 'CASCADE' });
Plan.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
Product.hasMany(Subscriber, { as: 'subscribers', foreignKey: 'productId', onDelete: 'CASCADE' });
Subscriber.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
Subscriber.belongsTo(Plan, { as: 'plan', foreignKey: 'planId' });

/* ---------------- Defaults ---------------- */

export const DEFAULT_COMPANY = {
  raisonSociale: 'SWIVIQ SARL AU',
  capital: '100 000,00 MAD',
  ice: '003963563000019',
  identifiantFiscal: '73099178',
  rc: '200173',
  rcTribunal: 'Tribunal de Commerce de Rabat',
  taxeProfessionnelle: '25116641',
  siegeSocial: 'Imm 30, Appt 8, Rue Moulay Ahmed Loukili, Hassan, Rabat, Maroc',
  gerant: 'Noredine Bahri',
  email: 'contact@swiviq.com',
  site: 'https://swiviq.com'
};

export const DEFAULT_PRICING = {
  services: [
    { id: 'web-app', label: "Développement d'application web", basePrice: 25000 },
    { id: 'mobile-app', label: 'Application mobile', basePrice: 35000 },
    { id: 'saas', label: 'Solution SaaS & Cloud', basePrice: 45000 },
    { id: 'ecommerce', label: 'Boutique E-commerce', basePrice: 18000 },
    { id: 'intermediation', label: 'Intermédiation numérique', basePrice: 15000 },
    { id: 'conciergerie', label: 'Conciergerie digitale', basePrice: 12000 },
    { id: 'evenementiel', label: 'Événementiel digital & communication', basePrice: 10000 },
    { id: 'conseil', label: 'Conseil & ingénierie informatique', basePrice: 8000 }
  ],
  options: [
    { id: 'design-premium', label: 'Design premium & animations', price: 8000 },
    { id: 'seo', label: 'SEO avancé', price: 5000 },
    { id: 'i18n', label: 'Multilingue', price: 4000 },
    { id: 'maintenance', label: 'Maintenance annuelle', price: 6000 },
    { id: 'hosting', label: 'Hébergement & infogérance (an)', price: 3500 },
    { id: 'ai', label: 'Intégration IA / Chatbot', price: 9000 }
  ],
  complexityMultipliers: { simple: 1, standard: 1.35, advanced: 1.8 },
  urgencyMultipliers: { normal: 1, fast: 1.2, express: 1.45 },
  vatRate: 0.2
};

/* ---------------- Helpers ---------------- */

export async function getSetting(key) {
  const row = await Setting.findByPk(key);
  return row ? row.value : null;
}

export async function setSetting(key, value) {
  await Setting.upsert({ key, value });
  return value;
}

export async function getSettings() {
  const [company, pricing] = await Promise.all([getSetting('company'), getSetting('pricing')]);
  return { company: company ?? DEFAULT_COMPANY, pricing: pricing ?? DEFAULT_PRICING };
}

export async function nextNumber(kind, prefix) {
  const year = String(new Date().getFullYear());
  const key = `${kind}:${prefix}:${year}`;
  const table = kind === 'invoice' ? 'invoices' : 'quotes';
  return sequelize.transaction(async (t) => {
    let counter = await Counter.findByPk(key, { transaction: t, lock: t.LOCK.UPDATE });
    // Self-heal: never issue a number below the highest one already used for this prefix+year
    const [rows] = await sequelize.query(
      `SELECT MAX(CAST(SUBSTRING(number, ?) AS UNSIGNED)) AS maxNum FROM \`${table}\` WHERE number LIKE ?`,
      { replacements: [prefix.length + year.length + 3, `${prefix}-${year}-%`], transaction: t }
    );
    const maxNum = Number(rows[0]?.maxNum || 0);
    if (!counter) counter = await Counter.create({ key, value: maxNum }, { transaction: t });
    else if (counter.value < maxNum) counter.value = maxNum;
    counter.value += 1;
    await counter.save({ transaction: t });
    return `${prefix}-${year}-${String(counter.value).padStart(4, '0')}`;
  });
}

export async function nextSeq(kind, prefix) {
  const key = `seq:${kind}`;
  return sequelize.transaction(async (t) => {
    let counter = await Counter.findByPk(key, { transaction: t, lock: t.LOCK.UPDATE });
    if (!counter) {
      const [results] = await sequelize.query(
        `SELECT MAX(CAST(SUBSTRING(number, LENGTH(?) + 2) AS UNSIGNED)) as maxNum FROM subscribers WHERE number LIKE CONCAT(?, '-%')`,
        { replacements: [prefix, prefix], transaction: t }
      );
      const maxNum = results[0]?.maxNum || 0;
      counter = await Counter.create({ key, value: maxNum }, { transaction: t });
    }
    counter.value += 1;
    await counter.save({ transaction: t });
    return `${prefix}-${String(counter.value).padStart(4, '0')}`;
  });
}

/* ---------------- Bootstrap ---------------- */

async function ensureDatabaseExists() {
  const conn = await mysql.createConnection({
    host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASS
  });
  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } finally {
    await conn.end();
  }
}

async function seedDefaults() {
  if (!(await Setting.findByPk('company'))) {
    await Setting.create({ key: 'company', value: DEFAULT_COMPANY });
    console.log('[db] Seeded default company settings');
  }
  if (!(await Setting.findByPk('pricing'))) {
    await Setting.create({ key: 'pricing', value: DEFAULT_PRICING });
    console.log('[db] Seeded default pricing catalogue');
  }
  if (!(await Setting.findByPk('admin'))) {
    const email = process.env.ADMIN_EMAIL || 'admin@swiviq.com';
    const password = process.env.ADMIN_PASSWORD;
    if (!password) throw new Error('ADMIN_PASSWORD must be set in .env for first boot.');
    await Setting.create({
      key: 'admin',
      value: { email, passwordHash: await bcrypt.hash(password, 12) }
    });
    console.log(`[db] Admin account bootstrapped for ${email}`);
  }
  await seedExampleProducts();
}

/* ---------------- Example products ---------------- */

export const EXAMPLE_PRODUCTS = [
  {
    slug: 'transfervvip',
    type: 'website',
    name: 'TransferVVIP',
    tagline: 'Transport personnalisé conçu pour le voyage moderne',
    description: 'Transfer VVIP est le service de transport premium et chauffeur privé au Maroc, opérant dans plus de 15 villes depuis 2014. Avec une flotte de véhicules de luxe incluant Mercedes Classe E et S, BMW Série 5 et 7, et Range Rover, Transfer VVIP met à disposition 500 chauffeurs professionnels agréés pour des transferts aéroport à prix fixe, du transport urbain et interurbain, et des services VIP corporate.',
    coverUrl: '/products/transfervvip-cover.jpg',
    technologies: ['Next.js', 'Node.js', 'MySQL', 'Tailwind', 'Stripe', 'WhatsApp API'],
    features: [
      'Transfert aéroport 24/7 à prix fixe',
      'Chauffeur privé & VTC dans 15+ villes',
      'Flotte de véhicules premium (Mercedes, BMW, Range Rover)',
      'Réservation en ligne instantanée',
      'Suivi de vol en temps réel',
      'Multilingue (FR, EN, AR, ES, 中文)'
    ],
    websiteUrl: 'https://transfervvip.com',
    repoUrl: '',
    status: 'live',
    order: 0,
    brandColor: '#C9A84C',
    brandTagline: 'Chauffeur Privé & Transport VIP au Maroc',
    brandPrefix: 'TVV',
    photos: [],
    plans: []
  },
  {
    slug: 'swiviq-cloud',
    type: 'saas',
    name: 'SWIVIQ Cloud',
    tagline: 'Plateforme d\'automatisation & orchestration cloud pour entreprises',
    description: 'SWIVIQ Cloud est une plateforme SaaS qui permet aux équipes IT de piloter leurs infrastructures multi-cloud, automatiser leurs déploiements et superviser leurs applications en temps réel.',
    coverUrl: '/products/swiviq-cloud-dashboard.jpg',
    technologies: ['Angular', 'Node.js', 'NestJS', 'PostgreSQL', 'Kubernetes', 'Terraform', 'Redis', 'WebSocket'],
    features: [
      'Tableau de bord multi-cloud unifié',
      'Déploiements automatisés zero-config',
      'Alertes intelligentes & auto-remédiation',
      'Gestion fine des droits (RBAC)',
      'Logs & métriques en temps réel',
      'API publique & webhooks'
    ],
    websiteUrl: 'https://swiviq.cloud',
    repoUrl: '',
    status: 'live',
    order: 1,
    brandColor: '#7435F2',
    brandTagline: 'Plateforme Cloud & Automatisation',
    brandPrefix: 'SWC',
    photos: [
      { url: '/products/swiviq-cloud-dashboard.jpg', title: 'Tableau de bord unifié', description: 'Vue temps réel de toutes vos infrastructures cloud en un seul écran.' },
      { url: '/products/swiviq-cloud-pricing.jpg', title: 'Facturation transparente', description: 'Suivi précis de la consommation par équipe et par projet.' }
    ],
    plans: [
      { name: 'Starter', price: 290, currency: 'MAD', interval: 'month', tagline: 'Pour démarrer', features: ['1 projet', '2 environnements', 'Logs 7 jours', 'Support email'], highlighted: false, ctaLabel: 'Commencer' },
      { name: 'Growth', price: 890, currency: 'MAD', interval: 'month', tagline: 'Le plus populaire', features: ['10 projets', 'Environnements illimités', 'Logs 90 jours', 'Alertes intelligentes', 'Support prioritaire'], highlighted: true, ctaLabel: 'Choisir Growth' },
      { name: 'Enterprise', price: 2400, currency: 'MAD', interval: 'month', tagline: 'Pour la scale', features: ['Projets illimités', 'SSO / SAML', 'SLA 99,9%', 'On-premise possible', 'Account manager dédié'], highlighted: false, ctaLabel: 'Nous contacter' }
    ]
  },
  {
    slug: 'swiviq-flow',
    type: 'app',
    name: 'SWIVIQ Flow',
    tagline: 'Application mobile de gestion de projets & collaboration d\'équipe',
    description: 'SWIVIQ Flow est une application mobile (iOS & Android) qui réunit tâches, planning, messagerie et documents dans une expérience fluide et élégante.',
    coverUrl: '/products/swiviq-flow-app.jpg',
    technologies: ['React Native', 'Expo', 'NestJS', 'GraphQL', 'PostgreSQL', 'WebSocket', 'Stripe'],
    features: [
      'Tâches, kanban & Gantt',
      'Messagerie d\'équipe en temps réel',
      'Mode hors-ligne intelligent',
      'Notifications push personnalisables',
      'Partage de documents',
      'Intégrations (Slack, Google, GitHub)'
    ],
    websiteUrl: '',
    repoUrl: '',
    status: 'beta',
    order: 2,
    brandColor: '#22D3EE',
    brandTagline: 'Gestion de projets & collaboration mobile',
    brandPrefix: 'SWF',
    photos: [
      { url: '/products/swiviq-flow-app.jpg', title: 'Vue d\'ensemble', description: 'Tableau de bord projet avec tâches du jour et indicateurs.' },
      { url: '/products/swiviq-flow-gallery1.jpg', title: 'Kanban interactif', description: 'Glissez-déposez vos cartes, colonnes personnalisables.' },
      { url: '/products/swiviq-flow-gallery2.jpg', title: 'Collaboration', description: 'Discutez et partagez sans quitter le contexte d\'une tâche.' }
    ],
    plans: []
  },
  {
    slug: 'swiviq-conciergerie',
    type: 'website',
    name: 'SWIVIQ Conciergerie',
    tagline: 'Site web & portail de conciergerie digitale d\'entreprise',
    description: 'Un site web vitrine + portail client pour services de conciergerie : réservation de services, suivi des demandes, facturation et espace client premium.',
    coverUrl: '/products/swiviq-cloud-pricing.jpg',
    technologies: ['Angular', 'SSR', 'Node.js', 'MySQL', 'Tailwind', 'Stripe'],
    features: [
      'Réservation de services en ligne',
      'Espace client personnalisé',
      'Suivi des demandes en temps réel',
      'Paiement sécurisé intégré',
      'SEO & performance optimisés',
      'Multilingue (FR / EN / AR)'
    ],
    websiteUrl: 'https://conciergerie.swiviq.com',
    repoUrl: '',
    status: 'live',
    order: 3,
    brandColor: '#10B981',
    brandTagline: 'Conciergerie digitale d\'entreprise',
    brandPrefix: 'SWG',
    photos: [
      { url: '/products/swiviq-cloud-pricing.jpg', title: 'Page d\'accueil', description: 'Une vitrine élégante pour vos services de conciergerie.' },
      { url: '/products/swiviq-flow-gallery2.jpg', title: 'Espace client', description: 'Un portail où le client suit ses demandes et paie en ligne.' }
    ],
    plans: []
  }
];

async function seedExampleProducts() {
  const count = await Product.count();
  if (count > 0) {
    // Update existing products with branding if they don't have it
    const products = await Product.findAll();
    for (const p of products) {
      if (!p.brandColor || p.brandColor === '#6C4CF1') {
        const example = EXAMPLE_PRODUCTS.find(e => e.slug === p.slug);
        if (example) {
          await p.update({
            brandColor: example.brandColor,
            brandTagline: example.brandTagline,
            brandPrefix: example.brandPrefix
          });
          console.log(`[db] Updated branding for ${p.name}`);
        }
      }
    }
    // Seed TransferVVIP if it doesn't exist
    const tvv = await Product.findOne({ where: { slug: 'transfervvip' } });
    if (!tvv) {
      const data = EXAMPLE_PRODUCTS[0];
      const { plans, ...productData } = data;
      await Product.create(productData);
      console.log('[db] Seeded TransferVVIP project');
    }
    return;
  }
  console.log('[db] Seeding example products…');
  for (const data of EXAMPLE_PRODUCTS) {
    const { plans, ...productData } = data;
    const product = await Product.create(productData);
    if (data.type === 'saas' && plans.length) {
      await Plan.bulkCreate(plans.map(pl => ({ ...pl, productId: product.id })));
    }
  }
  const cloud = await Product.findOne({ where: { slug: 'swiviq-cloud' } });
  if (cloud) {
    const plans = await Plan.findAll({ where: { productId: cloud.id } });
    const growth = plans.find(p => p.name === 'Growth');
    const starter = plans[0];
    if (growth) await Subscriber.create({ number: 'SUB-0001', productId: cloud.id, planId: growth.id, name: 'Amine El Idrissi', email: 'amine@techcorp.ma', company: 'TechCorp SARL', phone: '+212661234567', status: 'active' });
    if (starter) await Subscriber.create({ number: 'SUB-0002', productId: cloud.id, planId: starter.id, name: 'Sara Bennani', email: 'sara@startup.io', company: 'Startup.io', phone: '', status: 'pending' });
  }
  console.log('[db] Example products + subscribers seeded');
}

export async function initDb() {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await seedDefaults();
  console.log(`[db] Connected to MySQL ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
}
