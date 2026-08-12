import { Sequelize, DataTypes } from 'sequelize';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { FATORA_BOT } from './seed/fatora-bot.js';

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
  /**
   * Chapitres techniques de la fiche produit.
   *
   * `features` ne porte que des puces d'une ligne : impossible d'y expliquer
   * une architecture, un workflow ou une stratégie SEO. Chaque section est
   * `{ id, eyebrow, title, body, bullets[], metrics[{ value, label }] }` et se
   * rend comme un chapitre autonome, avec ses chiffres clés.
   */
  sections: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  /**
   * Référencement propre à la fiche : `{ title, description, keywords[] }`.
   *
   * Sans lui, la page se contentait du nom du produit et des 160 premiers
   * caractères de sa description — un titre qui ne contient aucune des
   * expressions réellement tapées dans un moteur. Les trois champs sont
   * facultatifs : une fiche sans bloc `seo` retombe sur l'ancien
   * comportement.
   */
  seo: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  /**
   * Questions/réponses de la fiche : `[{ q, a }]`.
   *
   * Elles alimentent à la fois le bloc visible et le balisage FAQPage. Une
   * réponse doit se suffire à elle-même : c'est ce qu'un moteur génératif
   * reprend, sorti de son contexte.
   */
  faq: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
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
    description: "TransferVVIP est la plateforme de transport premium et de chauffeur privé au Maroc, active dans plus de 15 villes. Le voyageur compose son trajet — aéroport, port ou adresse — obtient un prix fixe garanti, et confirme en quelques secondes en ligne ou par WhatsApp. Derrière cette simplicité : un moteur de recherche multi-référentiels, une grille tarifaire calculée en temps réel sur 7 aéroports et 28 trajets, un rendu serveur qui porte 165 pages indexables en 5 langues, et un back-office qui pilote l'intégralité du site. La plateforme est conçue et maintenue en interne par SWIVIQ, sans dépendance à une agence externe.",
    coverUrl: '/products/transfervvip-cover.jpg',
    technologies: [
      'Angular 17', 'SSR (rendu serveur)', 'Node.js', 'MySQL', 'nginx', 'HTTP/2',
      'WhatsApp Business', 'Moteur de lieux OpenStreetMap', 'Géocodage auto-hébergé', 'Schema.org', 'i18n 5 langues'
    ],
    features: [
      'Moteur de recherche de lieux maison — hôtels, aéroports, gares, ports — sans Google Places',
      'Tolérance aux fautes de frappe et recherche en arabe comme en français',
      'Trois modes : transfert, mise à disposition à l’heure, aller-retour',
      'Recherche par numéro de vol et suivi de l’arrivée',
      'Réservations multiples en une seule commande',
      'Prix fixe garanti, calculé en temps réel',
      'Réservation WhatsApp avec réponse en moins de 2 minutes',
      'Flotte de 6 catégories, de la berline au minibus 16 places',
      'Site multilingue FR / EN / AR / ES / 中文'
    ],
    websiteUrl: 'https://transfervvip.com',
    repoUrl: '',
    status: 'live',
    order: 0,
    brandColor: '#C9A84C',
    brandTagline: 'Chauffeur Privé & Transport VIP au Maroc',
    brandPrefix: 'TVV',
    photos: [
      {
        url: '/products/transfervvip-cover.jpg',
        title: 'Un moteur de réservation en première page',
        description: "Le formulaire n'est pas relégué à une page interne : il occupe la moitié de l'écran d'accueil. Le titre s'adapte à la ville du visiteur, et le bandeau WhatsApp annonce le délai de réponse réel. Le voyageur peut réserver sans jamais changer de page."
      },
      {
        url: '/products/transfervvip-booking.jpg',
        title: 'Le moteur de recherche, au complet',
        description: "Départ et arrivée acceptent indifféremment un aéroport, un port ou une adresse. Trois modes de trajet, compteurs passagers et bagages qui restreignent la flotte éligible, besoins d'accessibilité, et un champ numéro de vol qui rattache la prise en charge à l'arrivée réelle de l'avion."
      },
      {
        url: '/products/transfervvip-tarifs.jpg',
        title: 'Une grille tarifaire publique et filtrable',
        description: "7 aéroports, 28 trajets, 6 catégories de véhicules : les prix sont affichés avant toute inscription. Cinq filtres combinables — recherche libre, type de trajet, ville de départ, destination, véhicule — laissent le visiteur trouver son tarif en quelques secondes."
      },
      {
        url: '/products/transfervvip-ville.jpg',
        title: 'Une page de réservation par ville',
        description: "Chaque ville couverte dispose de sa propre page de réservation, avec ses trajets, ses tarifs et ses points de prise en charge. Onze villes en ligne, du transfert aéroport de Marrakech aux liaisons longue distance."
      },
      {
        url: '/products/transfervvip-chauffeur.jpg',
        title: 'Les services, expliqués un par un',
        description: "Transfert aéroport, chauffeur privé à l'heure, mobilité corporate, excursions : chaque service a sa page, son argumentaire et son propre point d'entrée vers la réservation."
      },
      {
        url: '/products/transfervvip-seo-rabat.jpg',
        title: 'Des pages taillées pour la recherche locale',
        description: "« Chauffeur privé Rabat », « VTC Rabat », « private driver Rabat », et leur équivalent en arabe : chaque intention de recherche a sa page dédiée, rendue côté serveur pour être lisible par les moteurs dès la première requête."
      }
    ],
    sections: [
      {
        id: 'recherche',
        eyebrow: 'Moteur de recherche de lieux',
        title: 'Un moteur de lieux construit sur mesure, sans Google',
        body: "La quasi-totalité des sites de transport se contente de brancher l'autocomplétion de Google Places : une facture qui grimpe avec le trafic, une dépendance totale, et des résultats pensés pour la recherche générale — pas pour quelqu'un qui commande une voiture.\n\nTransferVVIP a construit le sien. Derrière l'unique champ « De », l'API fusionne trois sources dans une seule réponse normalisée : un index local de points d'intérêt marocains issu d'OpenStreetMap, un géocodeur pour tout ce que l'index ne couvre pas, et une couche métier qui remonte l'aéroport pertinent en tête de liste. Hôtels, aéroports, gares, gares routières, terminaux ferry, loueurs, restaurants : tout ce qui sert de point de rendez-vous à un chauffeur est cherchable, pas seulement les adresses postales.\n\nLa couche métier est ce qui distingue ce moteur d'un géocodeur générique. Tapez « casablanka » : l'aéroport Mohammed V (CMN) arrive en premier, avant les hôtels — parce que quelqu'un qui écrit une ville sur un site de transfert cherche neuf fois sur dix son aéroport. Écrivez « مراكش » en arabe : l'aéroport Marrakech-Ménara (RAK) sort en tête. Un géocodeur seul ne saurait pas faire ce choix : il n'a aucune idée du métier.",
        bullets: [
          'Trois sources fusionnées dans une réponse au format unique : index local, géocodeur, couche métier',
          'Aucune dépendance à Google Places — ni facture à l’usage, ni quota',
          'Promotion automatique de l’aéroport pertinent : « casablanka » → CMN, « مراكش » → RAK, « tanger med » → TNG',
          'Tolérance aux fautes de frappe : « marrakec », « aeroprot », « casablanka » trouvent la bonne cible',
          'Recherche translittérée : une requête en arabe ramène les lieux nommés en français',
          'Insensible aux accents : « aeroport » trouve « Aéroport »',
          'Points de rendez-vous réels : hôtels, aéroports, gares, gares routières, ports, loueurs',
          'Chaque résultat livre coordonnées, adresse formatée, rue, code postal, type et score de pertinence'
        ],
        metrics: [
          { value: '3', label: 'sources fusionnées' },
          { value: '15+', label: 'types de lieux indexés' },
          { value: '0', label: 'appel à Google Places' }
        ],
        // Requêtes réellement passées à l'API publique, et ce qu'elle renvoie
        // en première position. La démonstration porte plus loin que l'argument.
        evidence: [
          { query: 'casablanka', result: 'Aéroport Mohammed V', code: 'CMN', source: 'airport_boost' },
          { query: 'مراكش', result: 'Aéroport Marrakech-Ménara', code: 'RAK', source: 'airport_boost' },
          { query: 'tanger med', result: 'Aéroport Tanger Ibn Battouta', code: 'TNG', source: 'airport_boost' },
          { query: 'aeroprot', result: 'Aéroport de Taroudant', code: '', source: 'local' },
          { query: 'menara', result: 'Hotel La Menara, Marrakech', code: '', source: 'local' },
          { query: 'mar', result: 'Marrakech — gare ferroviaire', code: '', source: 'photon' }
        ]
      },
      {
        id: 'reservation',
        eyebrow: 'Parcours de réservation',
        title: 'Un formulaire qui réduit les choix au lieu de les multiplier',
        body: "Une fois le lieu trouvé, le reste du formulaire sert à éliminer, pas à interroger. Le nombre de passagers et de bagages écarte d'emblée les véhicules trop petits ; le mode de trajet — transfert simple, mise à disposition à l'heure, aller-retour — change la façon dont le prix est calculé ; et le numéro de vol rattache la prise en charge à l'heure d'arrivée réelle de l'avion plutôt qu'à celle imprimée sur le billet.\n\nLa grille tarifaire est publique et filtrable avant toute inscription : 7 aéroports, 28 trajets, 6 catégories de véhicules, de la berline au minibus 16 places.",
        bullets: [
          'Trois modes : transfert simple, mise à disposition à l’heure, aller-retour',
          'Passagers et bagages filtrent la flotte éligible en direct',
          'Numéro de vol (AF123, LH456…) rattaché à l’arrivée réelle',
          'Réservations multiples groupées en une seule commande',
          'Besoins spéciaux et accessibilité pris en compte dès la recherche',
          'Grille tarifaire consultable sans créer de compte'
        ],
        metrics: [
          { value: '7', label: 'aéroports desservis' },
          { value: '28', label: 'trajets tarifés' },
          { value: '6', label: 'catégories de véhicules' }
        ]
      },
      {
        id: 'architecture',
        eyebrow: 'Architecture',
        title: 'Rendu serveur, parce que le référencement ne négocie pas',
        body: "Le site est une application Angular 17 rendue côté serveur. Ce choix n'est pas cosmétique : un site de réservation qui livre une page vide au robot de Google ne se référence pas, quelle que soit la qualité de son contenu. Ici, chaque page arrive complète dès la première réponse HTTP — pour le moteur de recherche comme pour le visiteur sur un réseau lent.\n\nnginx sert le tout en HTTP/2, avec un jeu d'en-têtes de sécurité complet : HSTS avec preload sur un an, isolation d'origine, interdiction du reniflage de type MIME. La plateforme est conçue et maintenue en interne, sans dépendance à une agence externe — les évolutions ne passent par aucun intermédiaire.",
        bullets: [
          'Angular 17 avec rendu serveur (SSR) : HTML complet à la première réponse',
          'API Node.js et base MySQL',
          'nginx en frontal, HTTP/2',
          'HSTS preload un an, COOP/CORP, nosniff, referrer-policy',
          'Cartographie sur fond OpenStreetMap, sans dépendance à une API propriétaire',
          'Conception et maintenance internes'
        ],
        metrics: []
      },
      {
        id: 'workflow',
        eyebrow: 'Workflow',
        title: 'WhatsApp au centre, parce que c’est là que sont les clients',
        body: "Au Maroc, un voyageur qui hésite n'écrit pas un e-mail : il ouvre WhatsApp. Le parcours a été construit autour de ce constat plutôt que contre lui. Le bouton WhatsApp reste visible sur toutes les pages, et le message part avec le trajet déjà rempli — trajet, date, passagers — pour que la conversation démarre sur le vif du sujet et non sur « bonjour, où allez-vous ? ».\n\nLe reste suit la même logique de réduction des frictions : chauffeur agréé confirmé instantanément, prix fixe annoncé avant paiement, règlement par carte ou PayPal, et annulation gratuite jusqu'à 24 h avant le départ. Cinq langues couvrent la clientèle réelle : français, anglais, arabe, espagnol et chinois.",
        bullets: [
          'Bouton WhatsApp persistant, réponse annoncée en moins de 2 minutes',
          'Trajet pré-rempli dans le message : pas de re-saisie',
          'Chauffeur agréé confirmé instantanément',
          'Prix fixe connu avant paiement — carte ou PayPal',
          'Annulation gratuite jusqu’à 24 h avant',
          'Assistance 24 h/24 en 5 langues'
        ],
        metrics: [
          { value: '< 2 min', label: 'délai de réponse annoncé' },
          { value: '24/7', label: 'assistance' },
          { value: '5', label: 'langues' }
        ]
      },
      {
        id: 'seo',
        eyebrow: 'Référencement',
        title: 'Une page par intention de recherche',
        body: "La stratégie tient en une phrase : ne jamais demander à une page unique de se classer sur des dizaines de requêtes différentes. « Chauffeur privé Rabat », « VTC Rabat », « private driver Rabat » et son équivalent en arabe désignent le même service mais pas la même intention — chacune a donc sa page, son titre, son contenu et ses liens internes.\n\nCette matrice ville × service × langue produit aujourd'hui 165 URL déclarées au sitemap, dont onze pages de réservation par ville et un jeu complet de pages de destination par mot-clé. Le rendu serveur garantit que chacune est lisible par les moteurs dès la première requête, sans attendre l'exécution du JavaScript.",
        bullets: [
          '165 URL déclarées au sitemap',
          '11 pages de réservation par ville, 15+ villes couvertes',
          'Pages par mot-clé en français, anglais et arabe',
          'Rendu serveur : contenu lisible sans exécution JavaScript',
          'Titres, descriptions et données structurées propres à chaque page',
          'Première position sur Google Maroc sur des requêtes telles que « transfer vip »'
        ],
        metrics: [
          { value: '165', label: 'URL au sitemap' },
          { value: '15+', label: 'villes couvertes' },
          { value: '4.9/5', label: 'note client' }
        ]
      },
      {
        id: 'administration',
        eyebrow: 'Back-office',
        title: 'Une administration qui pilote tout le site',
        body: "Rien de ce qui s'affiche sur le site n'est écrit en dur. Villes, trajets, tarifs, flotte, pages de destination, articles de blog et réservations sont administrés depuis un back-office dédié : ouvrir une ville, ajuster une grille tarifaire ou publier un article ne demande aucune intervention de développement, ni aucune mise en production.\n\nC'est ce qui permet à une équipe réduite d'exploiter 165 pages et une grille de 28 trajets sans que la maintenance éditoriale devienne un métier à plein temps.",
        bullets: [
          'Villes, trajets et grille tarifaire modifiables sans déploiement',
          'Flotte et capacités (passagers, bagages) administrées',
          'Pages de destination et contenus éditoriaux gérés en direct',
          'Blog et FAQ alimentés depuis la même interface',
          'Réservations et demandes centralisées',
          'Accès protégé, distinct du site public'
        ],
        metrics: []
      },
      {
        id: 'suite',
        eyebrow: 'Feuille de route',
        title: 'Ce qui vient ensuite',
        body: "Le tourisme marocain a franchi 19,8 millions de visiteurs en 2025, en hausse de 14 %, avec un objectif national de 26 millions d'ici 2030. Deux échéances structurent la suite : la Coupe d'Afrique des Nations, puis la Coupe du Monde 2030 co-organisée avec l'Espagne et le Portugal.\n\nLes chantiers de la plateforme suivent cette trajectoire : ouverture de Fès et Agadir, renforcement du programme Corporate Mobility — contrats récurrents avec entreprises, ambassades et organisateurs d'événements — et partenariats corporate à grande échelle autour de ces deux rendez-vous.",
        bullets: [
          'Ouverture de Fès et Agadir',
          'Renforcement du programme Corporate Mobility (B2B)',
          'Partenariats corporate autour de la CAN et de la Coupe du Monde 2030',
          'Extension de la grille tarifaire aux nouveaux corridors',
          'Enrichissement des contenus par destination'
        ],
        metrics: [
          { value: '19,8 M', label: 'touristes au Maroc en 2025' },
          { value: '+14 %', label: 'progression sur un an' },
          { value: '26 M', label: 'objectif national 2030' }
        ]
      }
    ],
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

/**
 * Sème ou complète la fiche Fatora Bot.
 *
 * Elle est créée si elle manque. Si elle existe déjà mais sans chapitres — cas
 * d'une fiche saisie à la main depuis l'administration — on complète le
 * contenu éditorial sans écraser ce que quelqu'un aurait rédigé : la condition
 * porte sur l'absence de contenu, jamais sur un numéro de version.
 *
 * Les paliers ne sont créés que s'il n'y en a aucun : les recréer à chaque
 * démarrage effacerait un tarif ajusté depuis l'administration.
 */
async function seedFatoraBot() {
  const { plans, ...productData } = FATORA_BOT;
  let product = await Product.findOne({ where: { slug: FATORA_BOT.slug } });

  if (!product) {
    product = await Product.create(productData);
    console.log('[db] Seeded Fatora Bot product');
  } else if (!product.sections?.length && !product.photos?.length) {
    const { slug, ...content } = productData;
    await product.update(content);
    console.log('[db] Backfilled Fatora Bot content');
  }

  const existingPlans = await Plan.count({ where: { productId: product.id } });
  if (existingPlans === 0 && plans?.length) {
    await Plan.bulkCreate(plans.map(p => ({ ...p, productId: product.id })));
    console.log(`[db] Seeded ${plans.length} Fatora Bot plans`);
  }
}

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
    } else if (!tvv.sections?.length && !tvv.photos?.length) {
      // Rattrapage unique : la fiche avait été semée sans visuels ni chapitres,
      // et annonçait des technologies erronées (Next.js pour un site Angular).
      // La condition porte sur l'absence de contenu, pas sur une version : une
      // fois la fiche remplie — ici ou depuis l'administration — ce bloc ne
      // repasse plus, et n'écrase donc jamais une modification manuelle.
      const { plans, slug, ...content } = EXAMPLE_PRODUCTS[0];
      await tvv.update(content);
      console.log('[db] Backfilled TransferVVIP content (photos, sections, technologies)');
    }
    await seedFatoraBot();
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
  await seedFatoraBot();
  console.log('[db] Example products + subscribers seeded');
}

export async function initDb() {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await seedDefaults();
  console.log(`[db] Connected to MySQL ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
}
