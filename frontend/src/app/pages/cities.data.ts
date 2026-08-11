/**
 * Contenu des pages locales « agence par ville » (français).
 *
 * OBJECTIF SEO — capter les requêtes géolocalisées (« agence digitale
 * Casablanca », « développeur application mobile Marrakech ») que les pages
 * /services, rédigées à l'échelle nationale, ne peuvent pas viser.
 *
 * RÈGLE DE RÉDACTION — chaque ville porte un contenu qui lui est propre :
 * tissu économique réel, secteurs dominants, contraintes de terrain. Un
 * gabarit unique où seul le nom de la ville change produit du contenu
 * dupliqué : Google le détecte, désindexe les doublons et peut dévaluer
 * l'ensemble du domaine. Si une ville n'a rien de spécifique à dire, il vaut
 * mieux ne pas créer sa page.
 *
 * RÈGLE D'HONNÊTETÉ — SWIVIQ n'a d'établissement qu'à Rabat. Aucune page ne
 * revendique de bureau, d'adresse ou de références clients ailleurs : le
 * balisage utilise Service + areaServed (zone desservie), jamais
 * LocalBusiness avec une adresse locale, qui serait un faux signal — et un
 * motif d'action manuelle Google en cas de contrôle.
 */

export interface CitySection {
  title: string;
  body: string;
  bullets?: string[];
}

export interface CityFaq {
  q: string;
  a: string;
}

export interface City {
  slug: string;
  /** Nom affiché. */
  name: string;
  /** Forme avec préposition : « à Casablanca », « à Fès ». */
  in: string;
  region: string;
  seoTitle: string;
  seoDesc: string;
  h1: string;
  intro: string;
  /** Secteurs dominants — sert aussi de maillage sémantique. */
  sectors: string[];
  sections: CitySection[];
  faq: CityFaq[];
}

export const CITY_SLUGS = [
  'casablanca', 'rabat', 'marrakech', 'tanger',
  'fes', 'agadir', 'kenitra', 'oujda',
] as const;

export type CitySlug = (typeof CITY_SLUGS)[number];

/** Distance de trajet depuis Rabat — utilisée dans les réponses FAQ. */
export const CITIES: Record<string, City> = {

  /* ============================ CASABLANCA ============================ */
  casablanca: {
    slug: 'casablanca',
    name: 'Casablanca',
    in: 'à Casablanca',
    region: 'Casablanca-Settat',
    seoTitle: 'Agence de Développement Web & Mobile à Casablanca | SWIVIQ',
    seoDesc: 'Agence digitale intervenant à Casablanca : applications web sur mesure, applications mobiles, e-commerce et SaaS. À partir de 18 000 MAD HT. Devis PDF détaillé en 2 minutes.',
    h1: 'Agence de développement web et mobile à Casablanca',
    intro: 'Casablanca concentre l\'essentiel de l\'activité économique marocaine : sièges de groupes, banques, assurances, industrie, import-export et distribution. SWIVIQ y accompagne des entreprises qui ont dépassé les limites du tableur et des logiciels génériques, et qui ont besoin d\'un outil taillé sur leurs processus. Nous sommes basés à Rabat, à une heure de route, et intervenons sur toute la métropole casablancaise.',
    sectors: [
      'Banque, assurance et services financiers',
      'Industrie et sous-traitance',
      'Import-export et négoce',
      'Distribution et retail',
      'Transport et logistique portuaire',
    ],
    sections: [
      {
        title: 'Pourquoi les entreprises casablancaises passent au sur-mesure',
        body: 'Le marché casablancais est le plus concurrentiel du pays : les délais de traitement, la qualité du suivi client et la fiabilité de la facturation y font la différence commerciale. Les organisations qui nous sollicitent partagent le même point de bascule — un volume d\'activité que les outils bureautiques ne tiennent plus, des ressaisies multiples entre services, et aucune vision consolidée en temps réel. Une application métier sur mesure supprime ces frictions sans imposer de licence par poste, dont le coût devient dissuasif dès qu\'une équipe dépasse la dizaine de collaborateurs.',
      },
      {
        title: 'Des intégrations pensées pour le contexte marocain',
        body: 'Un outil conçu pour le marché européen ignore les réalités locales de facturation et d\'encaissement. Nos développements intègrent nativement ce dont une entreprise casablancaise a réellement besoin :',
        bullets: [
          'Paiement en ligne via le CMI, la passerelle bancaire de référence au Maroc',
          'Facturation conforme aux mentions légales marocaines (ICE, IF, RC, TVA)',
          'Notifications et relances par WhatsApp Business, canal dominant côté client',
          'Interfaces bilingues français / arabe, avec support de l\'écriture droite-à-gauche',
        ],
      },
      {
        title: 'Travailler avec une équipe à Rabat plutôt qu\'à distance',
        body: 'Une heure sépare Rabat de Casablanca : nous tenons les ateliers de cadrage et les points d\'étape importants sur site, chez vous, et le reste du suivi se fait à distance. C\'est le meilleur compromis entre la présence physique aux moments qui comptent et un coût de projet qui ne supporte pas les frais d\'une structure implantée en centre-ville casablancais. Concrètement, cela se traduit par un tarif à prestation égale sensiblement inférieur à celui des agences installées sur place.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte le développement d\'une application web à Casablanca ?',
        a: 'Une application web sur mesure démarre à 25 000 MAD HT chez SWIVIQ, une application mobile à 35 000 MAD HT et une boutique e-commerce à 18 000 MAD HT. Le prix final dépend de la complexité fonctionnelle et du délai souhaité. Notre simulateur en ligne calcule votre estimation et génère un devis PDF détaillé en deux minutes, sans engagement.',
      },
      {
        q: 'Intervenez-vous physiquement à Casablanca ?',
        a: 'Oui. Nos bureaux sont à Rabat, à une heure de Casablanca, et nous nous déplaçons pour les ateliers de cadrage, les recettes et les points d\'étape importants. Le suivi courant se fait en visioconférence, ce qui accélère les allers-retours sans alourdir le budget du projet.',
      },
      {
        q: 'Pouvez-vous reprendre une application existante développée par un autre prestataire ?',
        a: 'Oui, à condition de disposer du code source et des accès. Nous commençons systématiquement par un audit technique facturé séparément, qui établit l\'état réel du code, de la sécurité et de la dette technique. Cet audit conditionne la suite : reprise, refonte partielle ou reconstruction, chaque option étant chiffrée avant toute décision.',
      },
    ],
  },

  /* ============================== RABAT =============================== */
  rabat: {
    slug: 'rabat',
    name: 'Rabat',
    in: 'à Rabat',
    region: 'Rabat-Salé-Kénitra',
    seoTitle: 'Agence Digitale à Rabat — Développement Web & Mobile | SWIVIQ',
    seoDesc: 'SWIVIQ est une agence digitale basée à Rabat : applications web, applications mobiles, e-commerce et solutions SaaS sur mesure. À partir de 18 000 MAD HT. Devis immédiat en ligne.',
    h1: 'Agence digitale à Rabat',
    intro: 'Rabat est notre ville. SWIVIQ y a son siège, rue Moulay Ahmed Loukili dans le quartier Hassan, et c\'est depuis la capitale que nous concevons, développons et hébergeons les applications de nos clients. Administration, institutions, cabinets de conseil, établissements d\'enseignement et jeunes entreprises technologiques : le tissu rbati mêle exigence de conformité et besoin d\'outils modernes.',
    sectors: [
      'Administration et secteur public',
      'Cabinets de conseil et professions libérales',
      'Enseignement et formation',
      'Associations et coopération internationale',
      'Startups et éditeurs de logiciels',
    ],
    sections: [
      {
        title: 'Une agence installée dans la capitale, pas un intermédiaire',
        body: 'Nous ne sous-traitons pas le développement. L\'équipe qui cadre votre projet est celle qui écrit le code, le déploie et en assure la maintenance. Pour une organisation rbatie, cela signifie un interlocuteur unique, joignable, à quelques minutes de vos locaux — et la possibilité de tenir un atelier de travail le matin même quand une décision bloque le projet.',
      },
      {
        title: 'Conformité et souveraineté des données',
        body: 'Les acteurs publics et parapublics de Rabat travaillent sous des contraintes que le secteur privé ignore souvent : traçabilité des accès, archivage, protection des données personnelles au sens de la loi 09-08 et de la CNDP. Nous concevons en tenant compte de ces exigences dès la phase de cadrage :',
        bullets: [
          'Journalisation des accès et des modifications, exportable pour audit',
          'Gestion fine des rôles et des habilitations par profil d\'utilisateur',
          'Hébergement configurable selon vos obligations de localisation des données',
          'Sauvegardes chiffrées et procédure de restauration testée',
        ],
      },
      {
        title: 'De l\'idée au produit en production',
        body: 'Beaucoup de projets rbatis démarrent par une intuition — un service à numériser, un processus à fluidifier — sans cahier des charges. Nous commençons alors par un atelier de cadrage qui transforme cette intuition en périmètre chiffrable : parcours utilisateurs, données à manipuler, règles métier, priorités de la première version. Cet atelier est facturé, mais il est déduit du projet si vous nous le confiez.',
      },
    ],
    faq: [
      {
        q: 'Où se trouvent les bureaux de SWIVIQ à Rabat ?',
        a: 'SWIVIQ SARL AU est établie Imm 30, Appt 8, rue Moulay Ahmed Loukili, quartier Hassan, à Rabat. C\'est notre unique établissement : nous intervenons dans tout le Maroc depuis la capitale. Vous pouvez nous écrire à contact@swiviq.com pour convenir d\'un rendez-vous sur place.',
      },
      {
        q: 'Quel est le délai pour développer une application à Rabat ?',
        a: 'Comptez six à dix semaines pour une première version en production sur un projet de complexité standard, atelier de cadrage inclus. Une boutique e-commerce simple peut être livrée en quatre à six semaines. Le délai express, qui mobilise l\'équipe en priorité, réduit ces durées d\'environ un tiers et majore le devis de 45 %.',
      },
      {
        q: 'Travaillez-vous avec les administrations et les établissements publics ?',
        a: 'Oui. SWIVIQ SARL AU est une société de droit marocain immatriculée au registre du commerce de Rabat, disposant d\'un ICE et d\'un identifiant fiscal, et facture avec TVA. Nous fournissons l\'ensemble des pièces administratives nécessaires aux procédures de commande publique.',
      },
    ],
  },

  /* ============================ MARRAKECH ============================= */
  marrakech: {
    slug: 'marrakech',
    name: 'Marrakech',
    in: 'à Marrakech',
    region: 'Marrakech-Safi',
    seoTitle: 'Agence Web & Application Mobile à Marrakech | SWIVIQ',
    seoDesc: 'Développement web et mobile à Marrakech : réservation en ligne, conciergerie, hôtellerie et e-commerce. Applications multilingues à partir de 18 000 MAD HT. Devis en ligne.',
    h1: 'Agence de développement web et mobile à Marrakech',
    intro: 'À Marrakech, le numérique sert d\'abord à remplir des chambres, des tables et des agendas. Riads, hôtels, agences de voyage, sociétés de transport touristique, restaurants et prestataires événementiels partagent la même dépendance : une clientèle internationale qui réserve en ligne, en plusieurs langues, souvent depuis un téléphone et à toute heure.',
    sectors: [
      'Hôtellerie, riads et maisons d\'hôtes',
      'Agences de voyage et réceptifs',
      'Restauration et loisirs',
      'Conciergerie et services haut de gamme',
      'Événementiel et mariages',
    ],
    sections: [
      {
        title: 'Reprendre la main sur la réservation directe',
        body: 'Les plateformes de réservation internationales prélèvent des commissions qui pèsent lourdement sur la marge d\'un établissement marrakchi, et elles s\'interposent entre vous et votre client : vous ne possédez ni le contact, ni l\'historique, ni la relation. Un moteur de réservation en propre inverse ce rapport. Il ne remplace pas les plateformes du jour au lendemain, mais chaque réservation captée en direct est une commission économisée et un client qui vous appartient.',
      },
      {
        title: 'Le multilingue n\'est pas une option ici',
        body: 'Une clientèle française, anglophone, hispanophone et arabophone impose des choix techniques dès la conception, pas en rattrapage :',
        bullets: [
          'Interfaces en français, anglais et arabe, avec écriture droite-à-gauche gérée nativement',
          'Affichage des prix en dirhams, euros ou dollars selon le visiteur',
          'Confirmations et rappels automatiques par e-mail et WhatsApp dans la langue du client',
          'Contenus indexables par Google dans chaque langue, grâce au rendu côté serveur',
        ],
      },
      {
        title: 'Une saisonnalité qui change les priorités techniques',
        body: 'L\'activité marrakchie connaît des pointes très marquées — vacances scolaires européennes, festivals, congrès. Une application qui tient en février doit tenir en avril. Nous dimensionnons l\'hébergement pour absorber ces pics sans que vous payiez toute l\'année la capacité de la haute saison, et nous testons la montée en charge avant l\'ouverture plutôt qu\'après la première panne.',
      },
    ],
    faq: [
      {
        q: 'Développez-vous des sites de réservation pour riads et hôtels à Marrakech ?',
        a: 'Oui. Un site avec moteur de réservation en direct, calendrier de disponibilités, paiement en ligne et confirmations automatiques démarre à 18 000 MAD HT. Nous intégrons le paiement par carte via le CMI et pouvons connecter votre channel manager existant pour éviter la double saisie avec les plateformes de réservation.',
      },
      {
        q: 'Vos applications gèrent-elles plusieurs langues et devises ?',
        a: 'Oui, le multilingue est intégré dès la conception, pas ajouté après coup. Français, anglais et arabe sont gérés en standard, avec l\'écriture droite-à-gauche pour l\'arabe, et l\'affichage des prix peut s\'adapter à la devise du visiteur. D\'autres langues peuvent être ajoutées sur demande.',
      },
      {
        q: 'Vous déplacez-vous à Marrakech ?',
        a: 'Nous sommes basés à Rabat et nous déplaçons à Marrakech pour les projets qui le justifient, principalement lors du cadrage initial et de la recette finale. Le suivi courant se fait en visioconférence. Les frais de déplacement sont annoncés dans le devis, jamais ajoutés en cours de projet.',
      },
    ],
  },

  /* ============================== TANGER ============================== */
  tanger: {
    slug: 'tanger',
    name: 'Tanger',
    in: 'à Tanger',
    region: 'Tanger-Tétouan-Al Hoceïma',
    seoTitle: 'Agence de Développement Web & Mobile à Tanger | SWIVIQ',
    seoDesc: 'Développement d\'applications web et mobiles à Tanger : industrie, logistique, zones franches et export. Outils métier sur mesure à partir de 25 000 MAD HT. Devis en ligne.',
    h1: 'Agence de développement web et mobile à Tanger',
    intro: 'Tanger vit au rythme du port Tanger Med, de l\'industrie automobile et aéronautique, du textile et des zones franches. Les besoins numériques y sont moins vitrine que production : suivre des flux, tracer des lots, coordonner des équipes en trois-huit, échanger des données avec des donneurs d\'ordre européens qui imposent leurs formats.',
    sectors: [
      'Industrie automobile et équipementiers',
      'Logistique portuaire et transit',
      'Textile et confection',
      'Zones franches et export',
      'Négoce international',
    ],
    sections: [
      {
        title: 'Des outils qui suivent la production, pas des brochures',
        body: 'Une entreprise industrielle tangéroise a rarement besoin d\'un site vitrine ; elle a besoin de savoir où en est une commande, quel opérateur a validé quel contrôle, et pourquoi un lot a été rebuté. Nous développons des applications métier qui se branchent sur la réalité de l\'atelier : saisie sur tablette au poste, lecture de codes-barres, tableaux de bord consolidés pour la direction, exports vers les systèmes du donneur d\'ordre.',
      },
      {
        title: 'Contraintes propres à l\'export et aux zones franches',
        body: 'Travailler pour des clients européens depuis une zone franche impose des exigences que nous intégrons dès la conception :',
        bullets: [
          'Traçabilité complète : qui a fait quoi, quand, sur quel lot, avec historique inaltérable',
          'Échanges de fichiers aux formats imposés par les donneurs d\'ordre (EDI, CSV structurés, API)',
          'Interfaces en français et en espagnol, langues de travail courantes dans le détroit',
          'Fonctionnement en mode dégradé lorsque la connexion de l\'atelier faiblit',
        ],
      },
      {
        title: 'Fiabilité avant fonctionnalités',
        body: 'Dans un atelier, une application indisponible arrête une chaîne — le coût n\'est pas celui du logiciel, c\'est celui de la production perdue. Nos développements industriels privilégient donc la robustesse : sauvegardes automatiques, procédure de restauration testée et documentée, supervision de la disponibilité, et un fonctionnement local qui se resynchronise dès que le réseau revient plutôt qu\'une application qui se bloque.',
      },
    ],
    faq: [
      {
        q: 'Développez-vous des applications de gestion industrielle à Tanger ?',
        a: 'Oui : suivi de production, traçabilité des lots, gestion de stock, contrôle qualité et tableaux de bord de direction. Une application métier sur mesure démarre à 25 000 MAD HT. Le périmètre exact est établi lors d\'un atelier de cadrage en atelier, au contact des opérateurs, car c\'est là que se trouvent les vraies contraintes.',
      },
      {
        q: 'Vos applications fonctionnent-elles sans connexion internet permanente ?',
        a: 'Oui, lorsque le projet l\'exige. Nous concevons des applications qui continuent d\'enregistrer les saisies en local pendant une coupure et se resynchronisent automatiquement au retour du réseau. C\'est une exigence fréquente en environnement industriel, et elle doit être décidée dès la conception : l\'ajouter après coup revient à reconstruire.',
      },
      {
        q: 'Pouvez-vous interfacer notre application avec l\'ERP de notre maison mère ?',
        a: 'Oui, dès lors que l\'ERP expose une API ou permet des échanges de fichiers structurés. Nous avons l\'habitude des formats imposés par les donneurs d\'ordre européens. L\'interfaçage fait l\'objet d\'un chiffrage distinct, car son coût dépend entièrement de la qualité de la documentation fournie par l\'éditeur.',
      },
    ],
  },

  /* =============================== FÈS ================================ */
  fes: {
    slug: 'fes',
    name: 'Fès',
    in: 'à Fès',
    region: 'Fès-Meknès',
    seoTitle: 'Agence Web & Développement d\'Applications à Fès | SWIVIQ',
    seoDesc: 'Création de sites et d\'applications à Fès : artisanat, agroalimentaire, tourisme culturel et formation. E-commerce à partir de 18 000 MAD HT. Devis PDF immédiat.',
    h1: 'Agence web et développement d\'applications à Fès',
    intro: 'Fès associe un patrimoine artisanal unique, une industrie agroalimentaire solide et un pôle universitaire important. Les entreprises fassies qui nous consultent cherchent le plus souvent à sortir d\'un marché local saturé : vendre au-delà de la ville, exporter, ou structurer une activité qui a grandi plus vite que ses outils.',
    sectors: [
      'Artisanat et métiers d\'art',
      'Agroalimentaire et conditionnement',
      'Tourisme culturel et hébergement',
      'Enseignement supérieur et formation',
      'Commerce de gros et distribution régionale',
    ],
    sections: [
      {
        title: 'Vendre l\'artisanat fassi au-delà de la médina',
        body: 'Zellige, cuir, dinanderie, tissage : le savoir-faire fassi a une valeur immédiatement lisible à l\'international, mais il reste largement dépendant du passage physique en médina et des intermédiaires. Une boutique en ligne bien construite change l\'équation — à condition de traiter sérieusement ce qui fait vendre un produit artisanal à distance : photographie fidèle, description du geste et de la matière, et surtout une logistique d\'expédition annoncée clairement plutôt que promise vaguement.',
      },
      {
        title: 'Ce qui fait la différence sur un e-commerce artisanal',
        body: 'Un produit unique ne se vend pas comme un article de série. Nous adaptons la boutique à cette réalité :',
        bullets: [
          'Gestion des pièces uniques et des séries limitées, sans surventes',
          'Frais de port calculés par destination, avec délais réalistes affichés avant paiement',
          'Paiement CMI pour le marché marocain, complété par un moyen international à l\'export',
          'Fiches produits rédigées pour Google, sur des recherches réelles plutôt que des noms internes',
        ],
      },
      {
        title: 'Structurer une activité qui a grandi trop vite',
        body: 'Beaucoup d\'entreprises fassies fonctionnent avec un empilement de fichiers Excel, de carnets et de conversations WhatsApp. Cela tient tant que le dirigeant garde tout en tête — et cède dès qu\'il faut déléguer ou passer à l\'échelle. Nous intervenons souvent à ce moment précis, avec un premier périmètre volontairement réduit : le processus qui fait le plus mal, traité correctement, plutôt qu\'un grand projet qui n\'aboutira pas.',
      },
    ],
    faq: [
      {
        q: 'Combien coûte une boutique en ligne à Fès ?',
        a: 'Une boutique e-commerce sur mesure démarre à 18 000 MAD HT, catalogue, paiement en ligne et gestion des commandes inclus. Les options fréquentes sont le multilingue pour l\'export, le référencement avancé et la maintenance annuelle. Le simulateur en ligne génère votre devis PDF détaillé en deux minutes.',
      },
      {
        q: 'Pouvez-vous nous aider à vendre à l\'international depuis Fès ?',
        a: 'Oui. Cela suppose trois choses que nous traitons ensemble : une boutique multilingue avec affichage des prix en devises, un moyen de paiement accepté hors du Maroc en complément du CMI, et des frais de port calculés par destination avec des délais annoncés honnêtement. Le volet transitaire et douane relève de votre logisticien, mais nous préparons les documents que la boutique doit produire.',
      },
      {
        q: 'Intervenez-vous à Fès depuis Rabat ?',
        a: 'Oui, Fès est à environ deux heures et demie de route de Rabat. Nous nous déplaçons pour le cadrage initial et la recette, et assurons le reste du suivi à distance. Pour un premier projet, un seul déplacement bien préparé vaut mieux que plusieurs visites improvisées.',
      },
    ],
  },

  /* ============================== AGADIR ============================== */
  agadir: {
    slug: 'agadir',
    name: 'Agadir',
    in: 'à Agadir',
    region: 'Souss-Massa',
    seoTitle: 'Agence de Développement Web & Mobile à Agadir | SWIVIQ',
    seoDesc: 'Développement web et mobile à Agadir : agroalimentaire, pêche, export et tourisme balnéaire. Applications métier à partir de 25 000 MAD HT. Devis en ligne immédiat.',
    h1: 'Agence de développement web et mobile à Agadir',
    intro: 'Agadir et la région du Souss-Massa vivent de l\'agrumiculture, du maraîchage sous serre, de la pêche et du tourisme balnéaire. Ce sont des activités où la donnée compte : traçabilité des lots, calibrage, chaîne du froid, respect des cahiers des charges imposés par les acheteurs européens. Les outils numériques y sont un enjeu d\'accès au marché avant d\'être un enjeu de confort.',
    sectors: [
      'Agrumes, maraîchage et cultures sous serre',
      'Pêche et transformation des produits de la mer',
      'Conditionnement et export',
      'Tourisme balnéaire et hôtellerie',
      'Logistique du froid',
    ],
    sections: [
      {
        title: 'Traçabilité : une exigence commerciale, pas administrative',
        body: 'Un acheteur européen ne demande pas la traçabilité par formalisme : il l\'exige comme condition d\'achat, et un dossier incomplet coûte un marché. Une application de traçabilité bien conçue enregistre l\'information au moment où elle se produit — à la parcelle, à la station, au quai — plutôt que de la reconstituer a posteriori dans un tableur. C\'est la seule façon d\'être prêt le jour où un audit tombe sans préavis.',
      },
      {
        title: 'Concevoir pour le terrain, pas pour le bureau',
        body: 'Une station de conditionnement n\'est pas un open space. Les contraintes réelles dictent la conception :',
        bullets: [
          'Saisie sur mobile ou tablette, utilisable avec des gants et à la lumière du jour',
          'Fonctionnement hors ligne en parcelle, avec resynchronisation au retour du réseau',
          'Lecture de codes-barres et de QR codes pour supprimer la saisie manuelle',
          'Exports au format attendu par vos acheteurs et vos organismes certificateurs',
        ],
      },
      {
        title: 'Une saison courte, une préparation longue',
        body: 'Dans le Souss, la campagne ne laisse aucune place à l\'improvisation : un outil livré en pleine saison ne sera pas adopté, quelles que soient ses qualités. Nous calons donc les projets agricoles sur le calendrier de campagne — cadrage et développement en intersaison, mise en production et formation des équipes avant le démarrage, ajustements pendant la première campagne.',
      },
    ],
    faq: [
      {
        q: 'Développez-vous des applications de traçabilité agricole à Agadir ?',
        a: 'Oui : suivi des parcelles, traçabilité des lots de la récolte à l\'expédition, contrôle qualité en station, gestion de la chaîne du froid et exports pour les organismes certificateurs. Une application métier de ce type démarre à 25 000 MAD HT, le périmètre étant établi lors d\'un atelier sur site.',
      },
      {
        q: 'L\'application fonctionne-t-elle en parcelle, sans réseau ?',
        a: 'Oui, lorsque c\'est nécessaire. Les saisies sont enregistrées localement sur le mobile ou la tablette, puis synchronisées automatiquement dès que la connexion revient. Ce mode de fonctionnement doit être prévu dès la conception : le greffer sur une application existante revient en général à la reconstruire.',
      },
      {
        q: 'Quel est le délai pour être opérationnel avant la campagne ?',
        a: 'Comptez six à dix semaines pour une première version en production sur un périmètre standard, formation des équipes comprise. Si votre campagne démarre plus tôt, l\'option express réduit ce délai d\'environ un tiers avec une majoration de 45 %. Nous préférons toutefois réduire le périmètre de la première version plutôt que de comprimer les tests.',
      },
    ],
  },

  /* ============================= KÉNITRA ============================== */
  kenitra: {
    slug: 'kenitra',
    name: 'Kénitra',
    in: 'à Kénitra',
    region: 'Rabat-Salé-Kénitra',
    seoTitle: 'Agence Web & Applications sur Mesure à Kénitra | SWIVIQ',
    seoDesc: 'Développement d\'applications web et mobiles à Kénitra : automobile, agro-industrie et PME. Agence basée à Rabat, à 40 minutes. À partir de 18 000 MAD HT.',
    h1: 'Agence web et applications sur mesure à Kénitra',
    intro: 'Kénitra a changé de dimension avec l\'Atlantic Free Zone et l\'implantation de l\'industrie automobile, sans perdre sa base agro-industrielle. La ville est à quarante minutes de nos bureaux rbatis, ce qui en fait l\'une des zones où nous intervenons le plus facilement sur site — un avantage réel pour les projets industriels, qui se cadrent mal par écran interposé.',
    sectors: [
      'Automobile et équipementiers de rang 2',
      'Agro-industrie et conserverie',
      'Logistique et zones d\'activité',
      'PME industrielles et sous-traitance',
      'Commerce et services de proximité',
    ],
    sections: [
      {
        title: 'La proximité change la nature du projet',
        body: 'Quarante minutes de route, cela veut dire qu\'un atelier de cadrage peut se tenir le matin et une correction être livrée le soir. Sur un projet industriel, cette proximité vaut mieux qu\'une longue spécification écrite : nous voyons les postes de travail, nous parlons aux opérateurs qui saisiront réellement les données, et nous découvrons les contraintes que personne n\'aurait pensé à écrire dans un cahier des charges.',
      },
      {
        title: 'Des besoins de sous-traitant, pas de donneur d\'ordre',
        body: 'Un équipementier de rang 2 subit les exigences de son client sans avoir les moyens informatiques d\'un grand groupe. Nous concevons pour cette réalité :',
        bullets: [
          'Réponse aux exigences de traçabilité du donneur d\'ordre, sans déployer un ERP complet',
          'Budget calibré pour une PME, avec une première version volontairement resserrée',
          'Formation des équipes sur site, en français et en arabe dialectal si nécessaire',
          'Évolution par étapes, chaque phase étant financée par le gain de la précédente',
        ],
      },
      {
        title: 'Commencer petit, mais commencer juste',
        body: 'Nous déconseillons systématiquement les grands projets de refonte totale à une PME qui n\'a jamais eu d\'outil métier. La démarche qui fonctionne consiste à isoler le processus le plus coûteux — souvent la ressaisie entre deux services, ou le suivi des non-conformités — et à le traiter complètement. Un premier périmètre réussi finance et légitime le suivant ; un grand projet raté ferme le sujet pour des années.',
      },
    ],
    faq: [
      {
        q: 'Intervenez-vous sur site à Kénitra ?',
        a: 'Oui, très facilement : Kénitra est à environ quarante minutes de nos bureaux de Rabat. C\'est l\'une des villes où nous nous déplaçons le plus volontiers, notamment pour les projets industriels où le cadrage doit se faire au contact des postes de travail.',
      },
      {
        q: 'Quel budget prévoir pour une première application métier ?',
        a: 'Une application web métier démarre à 25 000 MAD HT et une boutique e-commerce à 18 000 MAD HT. Pour une PME qui s\'équipe pour la première fois, nous recommandons de resserrer le périmètre initial sur un seul processus : le budget reste maîtrisé et l\'outil est réellement adopté avant d\'être étendu.',
      },
      {
        q: 'Pouvez-vous répondre aux exigences de traçabilité de notre donneur d\'ordre ?',
        a: 'Oui. Nous développons des outils qui produisent les enregistrements et les exports exigés par les donneurs d\'ordre automobiles, sans imposer le déploiement d\'un ERP complet. Le chiffrage dépend de la précision du cahier des charges fourni par votre client : plus il est explicite, plus le devis est ferme.',
      },
    ],
  },

  /* ============================== OUJDA =============================== */
  oujda: {
    slug: 'oujda',
    name: 'Oujda',
    in: 'à Oujda',
    region: 'L\'Oriental',
    seoTitle: 'Agence de Développement Web & Mobile à Oujda | SWIVIQ',
    seoDesc: 'Développement web et mobile à Oujda et dans l\'Oriental : commerce, services, formation et PME. Projets menés à distance depuis Rabat. À partir de 18 000 MAD HT.',
    h1: 'Agence de développement web et mobile à Oujda',
    intro: 'Oujda et la région de l\'Oriental disposent d\'un tissu de PME, de commerces et d\'établissements de formation qui accèdent difficilement à des prestataires techniques de niveau national — l\'offre locale est limitée, et les agences de l\'axe Rabat-Casablanca facturent souvent le déplacement plus cher que le développement. Nous travaillons cette région principalement à distance, avec une méthode assumée pour que cela fonctionne.',
    sectors: [
      'Commerce et distribution régionale',
      'Services aux entreprises et professions libérales',
      'Enseignement et centres de formation',
      'Santé et cliniques privées',
      'Énergies renouvelables et environnement',
    ],
    sections: [
      {
        title: 'Un projet à distance, mené sérieusement',
        body: 'Travailler à distance n\'est pas travailler à l\'aveugle. Nous compensons l\'éloignement par une cadence stricte : un point vidéo hebdomadaire à horaire fixe, une version consultable en ligne dès les premières semaines, et une trace écrite systématique des décisions. Vous voyez le produit avancer semaine après semaine plutôt que de découvrir le résultat à la livraison — c\'est ce mode de fonctionnement, pas la proximité géographique, qui détermine la réussite d\'un projet.',
      },
      {
        title: 'Ce que la distance ne change pas',
        body: 'Le périmètre technique et contractuel est strictement identique à celui d\'un projet rbati :',
        bullets: [
          'Même équipe, même stack technique, même niveau d\'exigence sur la sécurité',
          'Même engagement de délai et même grille tarifaire, sans majoration régionale',
          'Formation des équipes en visioconférence, avec support écrit et captures d\'écran',
          'Maintenance et support à distance, avec accès à distance sécurisé si nécessaire',
        ],
      },
      {
        title: 'Un accès direct à un niveau technique national',
        body: 'L\'argument principal en faveur d\'un prestataire éloigné mais compétent est simple : un outil mal conçu coûte plus cher qu\'un déplacement. Rendu côté serveur pour être visible sur Google, authentification correctement implémentée, sauvegardes testées, code documenté et livré — ce sont des exigences qui ne dépendent pas de la distance, mais de la maîtrise technique du prestataire.',
      },
    ],
    faq: [
      {
        q: 'Travaillez-vous avec des entreprises d\'Oujda malgré la distance ?',
        a: 'Oui. La majorité de nos échanges se font en visioconférence, avec un point hebdomadaire à horaire fixe et une version consultable en ligne dès les premières semaines. Nous nous déplaçons lorsque le projet le justifie vraiment, les frais étant alors annoncés dans le devis initial et jamais ajoutés en cours de route.',
      },
      {
        q: 'Le tarif est-il plus élevé pour un projet dans l\'Oriental ?',
        a: 'Non. Notre grille est nationale : une application web démarre à 25 000 MAD HT et une boutique e-commerce à 18 000 MAD HT, où que vous soyez au Maroc. Seuls d\'éventuels déplacements sur site apparaissent séparément dans le devis, à votre demande.',
      },
      {
        q: 'Comment se passe la formation de nos équipes à distance ?',
        a: 'Par sessions de visioconférence enregistrées, accompagnées d\'un support écrit illustré de captures d\'écran de votre propre application. Les enregistrements vous restent, ce qui permet de former un nouvel arrivant plus tard sans nous solliciter à nouveau. Une session de rattrapage est prévue quelques semaines après la mise en production, quand les vraies questions apparaissent.',
      },
    ],
  },
};
