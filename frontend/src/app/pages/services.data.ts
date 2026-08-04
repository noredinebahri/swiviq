/**
 * Contenu SEO des pages services (français — langue indexée par Google).
 *
 * Chaque service porte : H1 géolocalisé, title/meta réécrits, intro,
 * sections de contenu (~700-900 mots par page au total) et une FAQ dont la
 * première réponse donne le prix dans les 40 premiers mots (citabilité IA :
 * Google AI Overviews, ChatGPT, Perplexity extraient ces passages).
 */

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceSection {
  title: string;
  body: string;
  bullets?: string[];
}

export interface ServiceContent {
  h1: string;
  seoTitleFr: string;
  seoDescFr: string;
  serviceType: string;
  startingPrice: number;
  intro: string;
  sections: ServiceSection[];
  faq: ServiceFaq[];
}

export const SERVICE_IDS = [
  'web-app', 'mobile-app', 'saas', 'ecommerce',
  'intermediation', 'conciergerie', 'evenementiel', 'conseil',
] as const;

export const SERVICE_META: Record<string, ServiceContent> = {
  'web-app': {
    h1: 'Développement d\'application web sur mesure au Maroc',
    seoTitleFr: 'Développement d\'Application Web au Maroc — Sur Mesure | SWIVIQ',
    seoDescFr: 'Création d\'applications web sur mesure au Maroc : Angular, Node.js, SSR, sécurité et SEO. À partir de 25 000 MAD HT. Obtenez votre devis PDF détaillé en 2 minutes.',
    serviceType: 'Développement d\'applications web',
    startingPrice: 25000,
    intro: 'SWIVIQ est une agence digitale marocaine spécialisée dans la création d\'applications web sur mesure. Basés à Rabat, nous accompagnons des entreprises à Casablanca, Marrakech, Tanger et dans tout le Maroc : de l\'atelier de cadrage au déploiement en production, une seule équipe d\'ingénieurs conçoit, développe et héberge votre application.',
    sections: [
      {
        title: 'Pourquoi une application web sur mesure pour votre entreprise ?',
        body: 'Un logiciel standard vous impose ses limites ; une application sur mesure épouse vos processus. Gestion interne, portail client, plateforme métier ou back-office : nous développons exactement ce dont votre activité a besoin, sans licence au poste ni fonctionnalités inutiles. Nos applications sont pensées pour évoluer : ajout de modules, montée en charge, intégrations (paiement, facturation, WhatsApp Business, API tierces).',
      },
      {
        title: 'Notre stack technique',
        body: 'Nous travaillons avec des technologies modernes et éprouvées, les mêmes que celles de nos propres produits SaaS :',
        bullets: [
          'Angular avec rendu côté serveur (SSR) : rapidité et référencement Google optimal',
          'Node.js et API REST sécurisées (authentification JWT, bonnes pratiques OWASP)',
          'Bases de données MySQL / PostgreSQL, hébergement cloud avec sauvegardes',
          'Intégrations marocaines : paiement CMI, facturation conforme, WhatsApp Business',
        ],
      },
      {
        title: 'Déroulement d\'un projet web chez SWIVIQ',
        body: 'Chaque projet suit quatre étapes : atelier de découverte (objectifs, utilisateurs, périmètre), maquettes et prototype validés ensemble, développement par sprints avec démonstrations régulières, puis mise en production, formation et maintenance. Vous avez un interlocuteur unique du premier jour à la mise en ligne, et le code vous appartient intégralement.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte le développement d\'une application web au Maroc ?',
        a: 'Chez SWIVIQ, une application web sur mesure démarre à 25 000 MAD HT. Le budget final dépend de trois facteurs : le nombre d\'écrans et de rôles utilisateurs, les intégrations nécessaires (paiement, API, facturation) et le niveau de design souhaité. Un projet type se situe entre 25 000 et 120 000 MAD. Notre devis en ligne vous donne une estimation précise et un PDF détaillé en 2 minutes.',
      },
      {
        q: 'Quel est le délai de réalisation d\'une application web ?',
        a: 'Comptez 4 à 8 semaines pour un MVP (version fonctionnelle minimale) et 2 à 4 mois pour une application complète avec intégrations. Nous livrons par sprints : vous voyez le produit avancer chaque semaine.',
      },
      {
        q: 'L\'application sera-t-elle bien référencée sur Google ?',
        a: 'Oui. Toutes nos applications web publiques utilisent le rendu côté serveur (SSR), des balises méta optimisées et des données structurées Schema.org — la même approche que ce site. C\'est un avantage décisif face aux applications purement JavaScript, invisibles pour une partie des moteurs.',
      },
      {
        q: 'Qui est propriétaire du code source ?',
        a: 'Vous. À la livraison, le code source complet, la base de données et la documentation vous sont remis. Aucune dépendance forcée : vous pouvez confier la maintenance à SWIVIQ ou à toute autre équipe.',
      },
    ],
  },

  'mobile-app': {
    h1: 'Création d\'application mobile au Maroc (iOS & Android)',
    seoTitleFr: 'Création d\'Application Mobile au Maroc (iOS & Android) | SWIVIQ',
    seoDescFr: 'Développement d\'applications mobiles iOS et Android au Maroc : UX sur mesure, publication App Store et Google Play, maintenance. À partir de 35 000 MAD HT — devis instantané.',
    serviceType: 'Développement d\'applications mobiles',
    startingPrice: 35000,
    intro: 'Vous cherchez une agence pour créer votre application mobile au Maroc ? SWIVIQ développe des applications iOS et Android performantes pour les startups et entreprises marocaines : livraison, réservation, fintech, e-commerce, services à domicile. De la maquette à la publication sur l\'App Store et Google Play, nous gérons tout le cycle.',
    sections: [
      {
        title: 'Une application mobile, pour quoi faire ?',
        body: 'Au Maroc, plus de 90 % du trafic internet passe par le mobile. Une application native ou hybride vous apporte ce qu\'un site ne peut pas offrir : notifications push pour fidéliser, paiement en un geste, géolocalisation, mode hors-ligne et présence permanente sur l\'écran de vos clients. Nos réalisations couvrent la mise en relation, la réservation avec paiement, le suivi de commandes en temps réel et les applications internes métier.',
      },
      {
        title: 'Technologies : natif ou multiplateforme ?',
        body: 'Nous choisissons la technologie selon votre budget et vos besoins réels :',
        bullets: [
          'Multiplateforme (Flutter / React Native) : une seule base de code pour iOS et Android — idéal pour maîtriser le budget',
          'Natif (Swift / Kotlin) : pour les besoins de performance extrême ou d\'accès matériel avancé',
          'Backend Node.js + API sécurisée, tableau de bord d\'administration web inclus',
          'Notifications push, deep links, analytics et crash reporting configurés dès le lancement',
        ],
      },
      {
        title: 'Publication sur les stores et maintenance',
        body: 'Nous préparons les fiches App Store et Google Play (visuels, descriptions optimisées), gérons le processus de validation Apple et Google, puis assurons la maintenance : mises à jour des OS, correctifs, évolutions. Votre application reste compatible et sécurisée dans la durée.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte la création d\'une application mobile au Maroc ?',
        a: 'Chez SWIVIQ, une application mobile iOS et Android démarre à 35 000 MAD HT. Le prix dépend du nombre de fonctionnalités, du backend nécessaire (comptes, paiement, notifications) et du design. Une application de mise en relation ou de réservation complète se situe généralement entre 45 000 et 150 000 MAD. Utilisez notre devis en ligne pour une estimation précise en 2 minutes.',
      },
      {
        q: 'Combien de temps faut-il pour développer une application mobile ?',
        a: 'Un MVP mobile se livre en 6 à 10 semaines. Une application complète avec backend, paiement et publication sur les deux stores prend 3 à 5 mois. La validation Apple ajoute généralement 3 à 7 jours en fin de projet.',
      },
      {
        q: 'Développez-vous pour iOS et Android en même temps ?',
        a: 'Oui. Avec Flutter ou React Native, une seule base de code couvre les deux plateformes, ce qui réduit le coût de 30 à 40 % par rapport à deux développements natifs séparés, sans sacrifier l\'expérience utilisateur.',
      },
      {
        q: 'Vous occupez-vous de la publication sur l\'App Store et Google Play ?',
        a: 'Oui, intégralement : création des comptes développeur, fiches stores optimisées, soumission, réponses aux remarques d\'Apple et Google jusqu\'à l\'approbation. Votre application est publiée sous vos propres comptes — vous en gardez le contrôle total.',
      },
    ],
  },

  'saas': {
    h1: 'Création de solution SaaS au Maroc — de l\'idée au lancement',
    seoTitleFr: 'Création de SaaS au Maroc — De l\'Idée au Lancement | SWIVIQ',
    seoDescFr: 'Création de solutions SaaS au Maroc : conception produit, développement cloud, abonnements et hébergement. À partir de 45 000 MAD HT. Devis SaaS instantané et gratuit.',
    serviceType: 'Développement de solutions SaaS',
    startingPrice: 45000,
    intro: 'SWIVIQ n\'est pas seulement une agence : nous éditons nos propres solutions SaaS (gestion de centres de soutien scolaire, conciergerie digitale, transfert VIP). Cette expérience d\'éditeur fait toute la différence quand nous construisons le vôtre : nous connaissons les abonnements, la facturation récurrente, le multi-tenant et la croissance d\'un produit en production.',
    sections: [
      {
        title: 'Qu\'est-ce qu\'un SaaS et pourquoi en lancer un au Maroc ?',
        body: 'Un SaaS (Software as a Service) est un logiciel accessible en ligne par abonnement : vos clients paient chaque mois pour l\'utiliser, sans installation. C\'est le modèle qui génère des revenus récurrents et valorise le mieux une entreprise tech. Le marché marocain et africain francophone est encore peu équipé dans de nombreux secteurs (éducation, santé, immobilier, logistique) : les opportunités de niche sont réelles pour qui lance vite et bien.',
      },
      {
        title: 'Ce que nous construisons avec vous',
        body: 'Un SaaS complet ne se limite pas au code. Notre accompagnement couvre :',
        bullets: [
          'Cadrage produit : périmètre du MVP, personas, parcours d\'inscription et d\'activation',
          'Architecture multi-tenant sécurisée : chaque client voit ses données, jamais celles des autres',
          'Abonnements et paiements récurrents (CMI, virements, essais gratuits, relances automatiques)',
          'Tableau de bord d\'administration, statistiques d\'usage, supervision et sauvegardes',
          'Hébergement cloud, nom de domaine, emails transactionnels et page vitrine optimisée SEO',
        ],
      },
      {
        title: 'Notre méthode : lancer petit, apprendre vite',
        body: 'Nous découpons votre vision en un MVP lançable en 8 à 12 semaines, puis nous itérons avec les retours de vos premiers clients payants. Cette approche évite l\'écueil classique du SaaS marocain : dix-huit mois de développement pour un produit que personne n\'attend. Vous validez le marché tôt, avec un budget maîtrisé.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte la création d\'un SaaS au Maroc ?',
        a: 'Chez SWIVIQ, le développement d\'une solution SaaS démarre à 45 000 MAD HT pour un MVP. Un SaaS complet avec abonnements, multi-tenant et tableau de bord se situe entre 60 000 et 250 000 MAD selon la complexité métier. Le devis en ligne vous donne une fourchette précise immédiatement.',
      },
      {
        q: 'Combien de temps pour lancer un SaaS ?',
        a: 'Un MVP SaaS se lance en 8 à 12 semaines : de quoi commencer à vendre et récolter les retours de vrais clients. Les versions suivantes s\'enrichissent par itérations mensuelles en fonction de l\'usage réel.',
      },
      {
        q: 'Comment gérez-vous les paiements par abonnement au Maroc ?',
        a: 'Nous intégrons le paiement par carte via le CMI, les virements et les cycles de facturation automatiques (mensuel, annuel, essai gratuit, relances en cas d\'impayé). Le système génère les factures et suit les encaissements sans intervention manuelle.',
      },
      {
        q: 'Pouvez-vous héberger et maintenir le SaaS après le lancement ?',
        a: 'Oui. Nous proposons l\'hébergement cloud managé (serveurs, sauvegardes quotidiennes, supervision, certificats SSL) et un contrat de maintenance évolutive. Vous vous concentrez sur vos clients, nous gardons la plateforme rapide et disponible.',
      },
    ],
  },

  'ecommerce': {
    h1: 'Création de site e-commerce au Maroc',
    seoTitleFr: 'Création de Site E-commerce au Maroc — Boutique en Ligne | SWIVIQ',
    seoDescFr: 'Création de boutiques en ligne au Maroc : catalogue, paiement sécurisé CMI, livraison et conversion. À partir de 18 000 MAD HT. Devis e-commerce gratuit en 2 minutes.',
    serviceType: 'Création de sites e-commerce',
    startingPrice: 18000,
    intro: 'SWIVIQ crée des boutiques en ligne pensées pour vendre au Maroc : paiement CMI et à la livraison, intégration des transporteurs locaux, catalogue rapide et pages produits optimisées pour Google. Une boutique n\'est pas une vitrine — chaque écran est conçu pour convertir le visiteur en acheteur.',
    sections: [
      {
        title: 'Une boutique adaptée au marché marocain',
        body: 'Vendre en ligne au Maroc a ses spécificités : le paiement à la livraison reste majoritaire, la confiance se gagne par WhatsApp et la livraison fait ou défait la réputation. Nos boutiques intègrent ces réalités : confirmation de commande par WhatsApp, gestion du contre-remboursement, suivi des colis avec les transporteurs marocains (Amana, CTM, Sendit…), et paiement carte via CMI pour ceux qui le préfèrent.',
      },
      {
        title: 'Ce qui est inclus dans votre boutique',
        body: 'Chaque projet e-commerce SWIVIQ comprend :',
        bullets: [
          'Catalogue produits avec variantes, stocks et promotions',
          'Tunnel de commande optimisé mobile (là où achètent vos clients)',
          'Paiement CMI, à la livraison et par virement',
          'Tableau de bord : commandes, clients, statistiques de vente',
          'SEO technique complet : pages produits indexables, données structurées, vitesse',
        ],
      },
      {
        title: 'Après le lancement : faire croître les ventes',
        body: 'Nous ne disparaissons pas à la mise en ligne. Analyse des parcours d\'achat, tests de conversion, campagnes saisonnières (Ramadan, rentrée, Black Friday), emailing et retargeting : votre boutique s\'améliore en continu avec des décisions fondées sur les chiffres réels de vente.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte la création d\'un site e-commerce au Maroc ?',
        a: 'Chez SWIVIQ, une boutique en ligne complète démarre à 18 000 MAD HT : catalogue, paiement, livraison et tableau de bord inclus. Une boutique avec fonctionnalités avancées (multi-vendeurs, fidélité, synchronisation stock physique) se situe entre 30 000 et 90 000 MAD. Estimation précise en 2 minutes avec notre devis en ligne.',
      },
      {
        q: 'Intégrez-vous le paiement CMI et le paiement à la livraison ?',
        a: 'Oui, les deux. Le paiement par carte bancaire passe par le CMI (Centre Monétique Interbancaire), et le paiement à la livraison — encore majoritaire au Maroc — est géré nativement avec confirmation WhatsApp et suivi du contre-remboursement.',
      },
      {
        q: 'En combien de temps ma boutique peut-elle être en ligne ?',
        a: 'Une boutique standard se lance en 3 à 6 semaines : design, intégration du catalogue, configuration des paiements et de la livraison, formation à l\'administration. Les projets sur mesure prennent 2 à 3 mois.',
      },
      {
        q: 'Ma boutique sera-t-elle visible sur Google ?',
        a: 'Oui. Chaque page produit est rendue côté serveur avec balises méta, données structurées Product et temps de chargement optimisés — les trois piliers du référencement e-commerce. Nous configurons aussi Google Merchant Center pour apparaître dans Google Shopping.',
      },
    ],
  },

  'intermediation': {
    h1: 'Création de marketplace et plateforme de mise en relation au Maroc',
    seoTitleFr: 'Création de Marketplace au Maroc — Plateforme de Mise en Relation | SWIVIQ',
    seoDescFr: 'Développement de marketplaces et plateformes d\'intermédiation au Maroc : réservation, matching, paiements multi-vendeurs. À partir de 15 000 MAD HT. Devis en ligne.',
    serviceType: 'Développement de marketplaces',
    startingPrice: 15000,
    intro: 'Mettre en relation une offre et une demande — artisans et particuliers, professeurs et élèves, transporteurs et clients — demande une plateforme robuste : profils vérifiés, réservation, paiement sécurisé et commissions automatiques. SWIVIQ construit des marketplaces qui inspirent confiance aux deux côtés du marché.',
    sections: [
      {
        title: 'Les mécanismes d\'une marketplace qui fonctionne',
        body: 'Une plateforme d\'intermédiation réussie résout trois problèmes : la confiance (profils vérifiés, avis, garanties), la liquidité (assez d\'offre pour la demande, et inversement) et le paiement (encaisser, séquestrer, reverser, commissionner). Nous concevons ces mécanismes avec vous dès le cadrage, car ils déterminent l\'architecture technique — les rattraper après coup coûte dix fois plus cher.',
      },
      {
        title: 'Fonctionnalités types que nous développons',
        body: 'Selon votre modèle (services, produits, réservation, location) :',
        bullets: [
          'Inscription et vérification des prestataires, portfolios et avis clients',
          'Recherche géolocalisée, filtres et matching automatique offre/demande',
          'Réservation avec agenda, messagerie interne et notifications WhatsApp',
          'Paiement séquestré, reversements aux vendeurs et commissions automatiques',
          'Back-office de modération et statistiques par vendeur',
        ],
      },
      {
        title: 'Lancer sans se ruiner : la stratégie du MVP',
        body: 'Les grandes marketplaces ont commencé petit. Nous lançons d\'abord la boucle essentielle — un côté publie, l\'autre réserve, la plateforme encaisse — sur une seule ville ou une seule catégorie. Les fonctionnalités avancées arrivent quand la traction est prouvée. Ce pragmatisme vous évite de financer un géant avant d\'avoir vos cent premiers utilisateurs.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte la création d\'une marketplace au Maroc ?',
        a: 'Chez SWIVIQ, une plateforme de mise en relation démarre à 15 000 MAD HT pour la première version. Une marketplace complète avec paiements multi-vendeurs, séquestre et commissions se situe entre 40 000 et 180 000 MAD selon les mécanismes choisis. Le devis en ligne détaille le budget en 2 minutes.',
      },
      {
        q: 'Comment gérer les paiements entre clients et prestataires ?',
        a: 'La plateforme encaisse le client, garde les fonds en séquestre le temps de la prestation, puis reverse au prestataire en prélevant votre commission automatiquement. Nous intégrons le CMI et les virements bancaires marocains pour l\'ensemble du flux.',
      },
      {
        q: 'Faut-il une application mobile pour ma marketplace ?',
        a: 'Pas forcément au lancement. Une web-app responsive bien conçue suffit souvent à valider le marché ; l\'application mobile (avec notifications push) arrive en phase 2, quand la récurrence d\'usage la justifie. Cette approche réduit le budget initial de 40 % environ.',
      },
    ],
  },

  'conciergerie': {
    h1: 'Solution de conciergerie digitale au Maroc',
    seoTitleFr: 'Conciergerie Digitale au Maroc — Solution Sur Mesure | SWIVIQ',
    seoDescFr: 'Digitalisez votre conciergerie au Maroc : gestion des demandes, application client premium, automatisation WhatsApp. À partir de 12 000 MAD HT. Devis instantané.',
    serviceType: 'Solutions de conciergerie digitale',
    startingPrice: 12000,
    intro: 'Conciergeries privées, gestionnaires Airbnb, services aux résidences et hôtels : SWIVIQ digitalise la relation avec vos clients exigeants. Nous éditons notre propre solution de conciergerie (SWIVIQ Conciergerie) — votre projet bénéficie d\'une base éprouvée en production, pas d\'un développement à l\'aveugle.',
    sections: [
      {
        title: 'Ce que change une conciergerie digitalisée',
        body: 'Le métier de conciergerie repose sur la réactivité et la discrétion. Une plateforme dédiée remplace les demandes éparpillées entre appels, SMS et WhatsApp par un canal unique : le client formule sa demande dans l\'application, votre équipe la traite avec un suivi d\'état, et rien ne se perd. L\'historique par client permet un service personnalisé — la clé de la fidélisation haut de gamme.',
      },
      {
        title: 'Fonctionnalités de votre plateforme de conciergerie',
        body: 'Adaptées à votre positionnement (résidentiel, touristique, entreprise) :',
        bullets: [
          'Application ou espace client avec catalogue de services et demandes en un clic',
          'File de traitement pour vos équipes : assignation, statuts, délais',
          'Notifications WhatsApp automatiques à chaque étape de la demande',
          'Facturation des prestations, abonnements et rapports mensuels',
          'Multi-sites pour les gestionnaires de plusieurs résidences ou établissements',
        ],
      },
      {
        title: 'Pour les gestionnaires de locations courte durée',
        body: 'Check-in autonome, livret d\'accueil digital, demandes de ménage et maintenance, upsells (transferts aéroport, expériences) : nous connectons votre conciergerie aux calendriers Airbnb et Booking pour automatiser l\'accueil des voyageurs et générer des revenus additionnels par séjour.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte une solution de conciergerie digitale au Maroc ?',
        a: 'Chez SWIVIQ, la digitalisation d\'une conciergerie démarre à 12 000 MAD HT. Une plateforme complète avec application client, notifications WhatsApp et facturation se situe entre 20 000 et 80 000 MAD selon le périmètre. Devis précis en 2 minutes en ligne.',
      },
      {
        q: 'La solution fonctionne-t-elle avec WhatsApp ?',
        a: 'Oui, nativement. Vos clients reçoivent les confirmations et suivis de leurs demandes directement sur WhatsApp — le canal préféré au Maroc — pendant que votre équipe garde une file de traitement structurée côté back-office.',
      },
      {
        q: 'Est-ce adapté à la gestion de locations Airbnb ?',
        a: 'Tout à fait. Synchronisation des calendriers Airbnb/Booking, messages d\'accueil automatiques, check-in autonome et vente de services additionnels par séjour : la solution couvre le parcours complet du voyageur.',
      },
    ],
  },

  'evenementiel': {
    h1: 'Événementiel digital et communication au Maroc',
    seoTitleFr: 'Événementiel Digital au Maroc — Billetterie & Live | SWIVIQ',
    seoDescFr: 'Solutions digitales pour vos événements au Maroc : billetterie en ligne, inscriptions, live streaming, campagnes de communication. À partir de 10 000 MAD HT.',
    serviceType: 'Solutions événementielles digitales',
    startingPrice: 10000,
    intro: 'Conférences, salons, séminaires d\'entreprise, événements culturels : SWIVIQ équipe vos événements au Maroc d\'outils digitaux professionnels — site dédié, billetterie en ligne, badges QR, application participant et diffusion live. Votre événement gagne en image et votre équipe en sérénité.',
    sections: [
      {
        title: 'De l\'invitation au bilan : tout le parcours digitalisé',
        body: 'Un événement réussi commence bien avant le jour J. Nous construisons la chaîne complète : landing page qui donne envie, inscriptions ou billetterie avec paiement en ligne, emails et rappels WhatsApp automatiques, check-in par QR code à l\'entrée, et statistiques finales (présence, satisfaction, leads). Fini les listes Excel et les files d\'attente à l\'accueil.',
      },
      {
        title: 'Nos prestations événementielles',
        body: 'À la carte ou en pack selon l\'ampleur de l\'événement :',
        bullets: [
          'Site événementiel avec programme, intervenants et inscription',
          'Billetterie en ligne : paiement CMI, tarifs multiples, codes promo',
          'Badges et check-in QR code, statistiques de présence en temps réel',
          'Live streaming et événements hybrides (présentiel + distanciel)',
          'Campagnes de communication : réseaux sociaux, emailing, WhatsApp',
        ],
      },
      {
        title: 'Événements d\'entreprise récurrents',
        body: 'Pour les organisateurs réguliers (formations, meetups, cérémonies annuelles), nous mettons en place une plateforme réutilisable : chaque nouvel événement se crée en quelques minutes avec sa billetterie et ses inscriptions, et votre base de participants se consolide d\'édition en édition.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte une solution digitale pour un événement au Maroc ?',
        a: 'Chez SWIVIQ, l\'équipement digital d\'un événement démarre à 10 000 MAD HT (site + inscriptions + check-in QR). Une billetterie payante complète avec paiement CMI et application participant se situe entre 15 000 et 60 000 MAD selon l\'ampleur. Devis en 2 minutes en ligne.',
      },
      {
        q: 'Peut-on vendre des billets en ligne avec paiement par carte marocaine ?',
        a: 'Oui. La billetterie intègre le paiement CMI (cartes marocaines et internationales), avec tarifs multiples, quotas par catégorie, codes promo et envoi automatique des billets QR par email et WhatsApp.',
      },
      {
        q: 'Gérez-vous les événements hybrides ou 100 % en ligne ?',
        a: 'Oui : diffusion live sécurisée réservée aux inscrits, replay, questions-réponses en direct et statistiques d\'audience. Le format hybride permet d\'élargir votre événement au-delà de la salle sans multiplier les coûts.',
      },
    ],
  },

  'conseil': {
    h1: 'Conseil informatique et ingénierie logicielle au Maroc',
    seoTitleFr: 'Conseil Informatique au Maroc — Audit & Architecture | SWIVIQ Rabat',
    seoDescFr: 'Conseil IT au Maroc : audit technique, architecture logicielle, reprise de projets et accompagnement d\'équipes. Expertise senior dès 8 000 MAD HT. Basés à Rabat.',
    serviceType: 'Conseil en systèmes informatiques',
    startingPrice: 8000,
    intro: 'Projet qui s\'enlise, application lente, prestataire disparu, choix technique à trancher : SWIVIQ apporte un regard d\'ingénieur senior aux entreprises marocaines. Nous auditons, recommandons et, si besoin, reprenons en main — avec des livrables concrets, pas des slides.',
    sections: [
      {
        title: 'Quand faire appel à un conseil IT ?',
        body: 'Les situations que nous rencontrons le plus souvent : un logiciel métier devenu ingérable dont plus personne ne connaît le code ; un projet confié à un prestataire qui n\'avance plus ; une application qui s\'effondre dès que les utilisateurs affluent ; ou une décision structurante (refonte ou réparation ? cloud ou serveur local ? sur mesure ou solution du marché ?) qui engage des années. Dans chaque cas, un audit court évite des mois d\'errance.',
      },
      {
        title: 'Nos interventions',
        body: 'Des formats courts et actionnables :',
        bullets: [
          'Audit technique : code, sécurité, performance, dette — rapport avec plan d\'action priorisé',
          'Architecture : conception ou refonte d\'architectures web, mobile et cloud',
          'Reprise de projet : diagnostic, stabilisation puis évolution d\'applications héritées',
          'Accompagnement d\'équipe : choix de stack, revues de code, bonnes pratiques, recrutement technique',
        ],
      },
      {
        title: 'Notre différence : nous sommes des bâtisseurs',
        body: 'Nos recommandations viennent d\'ingénieurs qui développent et exploitent leurs propres produits SaaS en production. Quand nous préconisons une architecture, c\'est parce que nous l\'avons éprouvée — pas parce qu\'elle est à la mode. Et si le plan d\'action nécessite des bras, nos équipes peuvent l\'exécuter.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte un audit technique au Maroc ?',
        a: 'Chez SWIVIQ, une mission de conseil démarre à 8 000 MAD HT pour un audit ciblé (code, sécurité ou performance) avec rapport et plan d\'action priorisé. Un audit complet d\'application avec restitution se situe entre 12 000 et 40 000 MAD selon la taille du système.',
      },
      {
        q: 'Pouvez-vous reprendre un projet commencé par un autre prestataire ?',
        a: 'Oui, c\'est une de nos spécialités. Nous commençons par un diagnostic (état du code, de la base, des accès), stabilisons ce qui doit l\'être, puis proposons un plan : poursuivre, refondre partiellement ou repartir sainement. Vous décidez avec des faits.',
      },
      {
        q: 'Intervenez-vous partout au Maroc ?',
        a: 'Oui. Basés à Rabat, nous intervenons à Casablanca et dans tout le Maroc — sur site pour les ateliers et restitutions, à distance pour le reste. La visioconférence et les livrables écrits rythment chaque mission.',
      },
    ],
  },
};
