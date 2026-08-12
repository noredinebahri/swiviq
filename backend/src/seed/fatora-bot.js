/**
 * Fiche produit Fatora-Bot.
 *
 * Sortie de db.js : le dossier TransferVVIP y occupait déjà 270 lignes, et
 * mélanger le contenu éditorial au schéma de la base rend les deux illisibles.
 * db.js importe ce module et le sème comme les autres.
 *
 * RÈGLE — tout chiffre écrit ici est vérifiable sur le produit en ligne
 * (https://fatora.swiviq.com) ou dans son code. Une fiche produit qui gonfle
 * ses résultats se fait démonter au premier client qui vérifie, et les
 * moteurs IA, qui recoupent, cessent de la citer.
 */

import { FATORA_BOT_EN } from './fatora-bot.en.js';
import { FATORA_BOT_AR } from './fatora-bot.ar.js';

export const FATORA_BOT = {
  slug: 'fatora-bot',
  type: 'saas',
  name: 'Fatora Bot',
  tagline: 'La facturation vocale sur WhatsApp, en darija, conforme aux exigences de la DGI',

  description:
    "Fatora Bot est une solution de facturation électronique pour les entreprises marocaines qui fonctionne entièrement dans WhatsApp. "
    + "Un vendeur, un chauffeur ou un gérant dicte une note vocale en darija — « sayab liya fatora l Ahmed, tlata dyal l-bibane b 1500 dh » — "
    + "et l'entreprise émet en une trentaine de secondes une facture PDF conforme, avec ICE, IF, taxe professionnelle, TVA détaillée, montant "
    + "en toutes lettres, numérotation continue et cachet de la société. Aucun logiciel de facturation à installer, aucune formation : "
    + "si une équipe sait envoyer un vocal, elle sait déjà facturer. "
    + "Derrière cette simplicité : l'API WhatsApp Business officielle de Meta, un moteur de compréhension de la darija parlée — riyal, melyoun, "
    + "hésitations et corrections en cours de phrase comprises —, une isolation étanche des données par entreprise, et un site public de "
    + "41 pages en quatre langues. Fatora Bot est conçu, hébergé et maintenu par SWIVIQ.",

  // La couverture montre le produit en usage — une conversation WhatsApp —
  // et non la page d'accueil du site qui le vend.
  coverUrl: '/products/fatora-whatsapp.jpg',

  technologies: [
    'WhatsApp Business Cloud API (Meta)', 'Node.js', 'Express', 'MySQL', 'Sequelize',
    'IA générative (extraction darija/français)', 'Synthèse vocale', 'Reconnaissance de documents',
    'Redis', 'BullMQ', 'pdfkit', 'Angular SSR', 'nginx', 'Schema.org', 'i18n 4 langues'
  ],

  features: [
    'Dictée vocale en darija — lettres arabes ou latines — français et tamazight',
    'Réponse vocale dans la langue de celui qui parle',
    'Facture PDF conforme : ICE, IF, taxe professionnelle, TVA détaillée, montant en toutes lettres',
    'Numérotation continue par exercice, sans trou dans la séquence',
    'Cachet de l\'entreprise photographié une fois, apposé sur chaque facture',
    'Remise au client par QR code, WhatsApp ou email — avec confirmation avant tout envoi',
    'Répertoire clients : le nom exact est lu sur une photo de document et mémorisé',
    'Prix en riyal et en melyoun compris sans conversion manuelle',
    'Correction après émission sous le même numéro, sans avoir à gérer',
    'Archives à la voix : « la facture n°8 », « les factures du mois »',
    'Données cloisonnées par entreprise, hébergement en Union européenne',
    'Essai de 2 factures sans carte bancaire'
  ],

  websiteUrl: 'https://fatora.swiviq.com',
  repoUrl: '',
  status: 'live',
  order: 1,
  brandColor: '#C89B2A',
  brandTagline: 'Facturation électronique par WhatsApp — Maroc',
  brandPrefix: 'FTB',

  /**
   * Référencement de la fiche.
   *
   * Le titre et la description par défaut se contentent du nom du produit et
   * des 160 premiers caractères de sa description : sur un marché où les
   * requêtes portent sur « facturation électronique Maroc » ou « facture
   * conforme DGI », cela laisse la page invisible. On les écrit ici.
   */
  seo: {
    title: 'Fatora Bot — le bot WhatsApp de facturation marocain conçu par SWIVIQ',
    // Environ 155 caractères : au-delà, Google coupe et la phrase perd sa fin.
    description:
      "Le dossier technique de Fatora Bot par SWIVIQ : facturation dictée en darija sur WhatsApp, PDF conforme ICE/IF/TVA en 30 secondes.",
    /**
     * CE QUE CETTE PAGE VISE — et surtout ce qu'elle ne vise PAS.
     *
     * fatora.swiviq.com possède déjà des pages dédiées aux requêtes du marché
     * (« facturation électronique Maroc », « facture WhatsApp », « alternative
     * aux logiciels de facturation »). Reprendre ces mêmes expressions ici
     * ferait s'affronter deux domaines du même propriétaire sur une seule
     * requête : Google n'en retient qu'un, et l'autorité se divise au lieu de
     * s'additionner.
     *
     * Cette fiche vise donc l'intention voisine, que le site produit ne couvre
     * pas : qui a construit cet outil, avec quelle technologie, et peut-il en
     * construire un semblable. C'est la requête d'un prospect d'agence.
     */
    keywords: [
      'bot WhatsApp facturation', 'développement bot WhatsApp Maroc',
      'agence WhatsApp Business API Maroc', 'API WhatsApp Business Maroc',
      'chatbot WhatsApp entreprise Maroc', 'application facturation sur mesure Maroc',
      'IA darija reconnaissance vocale', 'développement SaaS Maroc',
      'Fatora Bot', 'Fatora Bot tarif', 'Fatora Bot SWIVIQ',
      'automatisation WhatsApp TPE', 'intégration WhatsApp Cloud API'
    ]
  },

  /**
   * Questions réellement tapées dans un moteur, avec des réponses complètes et
   * autonomes. Elles alimentent le bloc visible ET le balisage FAQPage : une
   * réponse citable hors contexte est ce qu'un moteur IA reprend.
   */
  faq: [
    {
      q: "La facturation électronique est-elle obligatoire au Maroc ?",
      a: "L'article 145-IX du Code général des impôts pose le principe de la facturation électronique, sur un modèle dit de « clearance » : "
        + "la facture transite par une plateforme de l'administration avant d'être remise au client. Le déploiement est progressif et le "
        + "décret d'application fixant le calendrier des très petites entreprises n'était pas publié à la mi-2026. Une entreprise qui "
        + "s'équipe aujourd'hui prend de l'avance sur une échéance qui viendra ; elle ne rattrape pas un retard déjà constitué."
    },
    {
      q: "Quelles mentions une facture marocaine doit-elle obligatoirement porter ?",
      a: "L'identifiant commun de l'entreprise (ICE), l'identifiant fiscal (IF), le numéro de taxe professionnelle, la raison sociale et "
        + "l'adresse, un numéro de facture continu, la date, le détail des articles avec quantités et prix unitaires, le taux et le montant "
        + "de TVA, le total hors taxes et toutes taxes comprises, et le montant total en toutes lettres. Fatora Bot compose ces mentions "
        + "automatiquement : elles sont saisies une fois à l'inscription de l'entreprise, jamais redemandées."
    },
    {
      q: "Faut-il installer une application pour utiliser Fatora Bot ?",
      a: "Non. Tout se passe dans WhatsApp, déjà installé sur le téléphone de vos équipes. Il n'y a ni compte à créer, ni logiciel à "
        + "déployer, ni poste à équiper, ni formation à organiser. L'entreprise s'enregistre en six questions dans la conversation — "
        + "raison sociale, ICE, IF, taxe professionnelle, adresse, régime de TVA — puis facture."
    },
    {
      q: "Le bot comprend-il vraiment la darija parlée ?",
      a: "Oui, à la voix comme à l'écrit, en lettres arabes comme en lettres latines. Il comprend les prix exprimés en riyal et en melyoun, "
        + "les hésitations, et les corrections en cours de phrase — « la, joj b 200 » corrige le récapitulatif immédiatement. Il répond dans "
        + "la langue de celui qui parle, et en audio quand on lui parle en audio. Le français et le tamazight sont également pris en charge."
    },
    {
      q: "Combien coûte Fatora Bot ?",
      a: "Deux factures sont offertes pour évaluer l'outil en conditions réelles, sans carte bancaire ni engagement. Ensuite : 30 DH par "
        + "mois pour 15 factures, 50 DH pour 30 factures, 90 DH pour 100 factures. Le coût suit le volume de facturation réel de "
        + "l'entreprise, sans licence par poste ni frais d'installation."
    },
    {
      q: "Que devient une facture erronée déjà envoyée ?",
      a: "Elle est corrigée sous le même numéro. La séquence de numérotation reste continue, sans trou — ce qu'exige l'administration — et "
        + "sans obliger à émettre une facture d'avoir pour une simple faute de frappe."
    },
    {
      q: "Où sont hébergées les données de mon entreprise ?",
      a: "En Union européenne. Chaque entreprise dispose d'un espace étanche : ses clients, sa propre séquence de numérotation, son cachet. "
        + "Aucune donnée n'est partagée entre entreprises, et le numéro WhatsApp de l'entreprise sert de frontière technique."
    },
    {
      q: "Un cabinet comptable peut-il équiper ses clients ?",
      a: "Oui. C'est le mode de déploiement le plus efficace : cabinets comptables, fiduciaires, fédérations professionnelles et coopératives "
        + "équipent l'ensemble de leurs adhérents, et SWIVIQ prend en charge l'intégration. Le comptable reçoit des PDF au format qu'il "
        + "attend, plutôt que des photos de carnets à ressaisir."
    }
  ],

  photos: [
    {
      url: '/products/fatora-whatsapp.jpg',
      title: 'Toute l’interface tient dans une conversation',
      description: "Une note vocale de sept secondes part du vendeur. Le bot répond en darija — à l'écrit et en audio — avec ce qu'il a "
        + "compris : le client, les trois articles, le total TTC de 5 400 dirhams, et une question de contrôle. Un mot suffit à valider, "
        + "et la facture arrive dans le fil, cachet compris. Il n'y a pas d'écran de saisie ailleurs : ceci est le produit entier."
    },
    {
      url: '/products/fatora-facture.jpg',
      title: 'Le document réellement émis',
      description: "Cette facture est produite par le moteur du produit, pas dessinée pour la démonstration. Elle porte l'ICE, l'identifiant "
        + "fiscal et la taxe professionnelle de l'entreprise, le détail des lignes, la TVA par taux, les totaux hors taxes et TTC, et le "
        + "montant arrêté en toutes lettres — « Six mille trois cent soixante dirhams TTC ». L'emplacement du cachet est réservé en bas à droite."
    },
    {
      url: '/products/fatora-demos.jpg',
      title: 'Six capacités, démontrées plutôt qu’énumérées',
      description: "Dictée vocale, facture conforme, cachet de l'entreprise, remise par QR code, trois langues et mémoire des clients : "
        + "chaque capacité rejoue son propre scénario, ici la composition de la facture ligne par ligne jusqu'au total en toutes lettres."
    },
    {
      url: '/products/fatora-gestes.jpg',
      title: 'Trois gestes, zéro formation',
      description: "Dicter, valider d'un mot, transmettre. Le bot résume à la voix avant d'émettre — articles, prix, total TTC — et un simple "
        + "« wakha » déclenche l'émission. C'est le parcours complet d'une facture, et il n'y a rien d'autre à apprendre."
    },
    {
      url: '/products/fatora-langues.jpg',
      title: 'La langue de celui qui facture',
      description: "Darija en lettres arabes ou latines, français, tamazight : le bot répond toujours dans la langue reçue, et en audio quand "
        + "on lui parle en audio. Les prix dictés en riyal ou en melyoun sont convertis sans que personne y pense."
    },
    {
      url: '/products/fatora-tarifs.jpg',
      title: 'Un coût indexé sur le volume, pas sur les postes',
      description: "Deux factures offertes pour évaluer, puis 30, 50 ou 90 DH par mois selon le nombre de factures émises. Aucun coût par "
        + "utilisateur : une entreprise qui équipe cinq vendeurs paie le même prix qu'une qui en équipe un."
    }
  ],

  sections: [
    {
      id: 'contexte',
      eyebrow: 'Le problème',
      title: 'Facturer au Maroc coûte plus cher que la facture elle-même',
      body: "La très petite entreprise marocaine facture au carnet à souches, ou pas du tout. Quand elle s'équipe, elle achète un logiciel de "
        + "facturation pensé pour un comptable : une licence par poste, un écran de saisie, une formation, et un vendeur qui ne l'ouvrira "
        + "jamais depuis un chantier ou un comptoir.\n\n"
        + "L'article 145-IX du Code général des impôts a posé le principe de la facturation électronique, sur un modèle de « clearance » où la "
        + "facture transite par une plateforme de l'administration avant d'arriver chez le client. Le calendrier des TPE reste suspendu à un "
        + "décret d'application non publié à la mi-2026 : l'échéance viendra, mais elle n'est pas là. C'est précisément la fenêtre où un outil "
        + "doit se rendre utile pour autre chose que la contrainte — sinon personne ne s'équipe avant la veille de l'obligation.\n\n"
        + "Fatora Bot prend le problème par l'usage plutôt que par la loi : il n'y a rien à installer, rien à apprendre, et la conformité vient "
        + "en supplément d'un geste que l'équipe fait déjà cinquante fois par jour — envoyer un vocal WhatsApp.",
      bullets: [
        'Aucun logiciel à déployer : WhatsApp est déjà sur le téléphone de chaque vendeur',
        'Aucune licence par poste — le prix suit le nombre de factures, pas le nombre d\'utilisateurs',
        'Aucune formation : l\'interface est une conversation',
        'Conformité ICE, IF, taxe professionnelle et TVA obtenue sans la comprendre',
        'Une avance prise sur l\'obligation d\'e-facturation, plutôt qu\'un rattrapage dans l\'urgence'
      ],
      metrics: [
        { value: '145-IX', label: 'article du CGI qui fonde l’e-facturation' },
        { value: '30 s', label: 'du vocal au PDF émis' },
        { value: '0', label: 'application à installer' }
      ]
    },
    {
      id: 'voix',
      eyebrow: 'Compréhension de la darija',
      title: 'Il comprend la langue dans laquelle vos équipes travaillent',
      body: "La darija n'est pas une langue écrite standardisée : elle se dit, elle s'écrit tantôt en lettres arabes tantôt en lettres latines, "
        + "et elle compte les prix en riyal ou en melyoun plutôt qu'en dirhams. Un moteur de dictée générique bute sur tout cela.\n\n"
        + "Fatora Bot traite la note vocale de bout en bout : transcription, extraction structurée du client, des articles, des quantités et "
        + "des prix, puis réponse audio dans la même langue. « Sayab liya fatora l Ahmed Transport, tlata dyal l-bibane b 1500 dh » devient un "
        + "client, un article, une quantité, un prix unitaire et un total TTC — en un peu plus d'une seconde. Les hésitations et les corrections "
        + "en cours de phrase sont absorbées : « la, joj b 200 » réécrit le récapitulatif sans repartir de zéro.\n\n"
        + "Deux mécanismes moins visibles font la différence à l'usage. Un lexique de darija, construit à partir d'un corpus ouvert, ancre le "
        + "vocabulaire métier. Et un banc de régression rejoue des cas réels à chaque modification du moteur : toute erreur rencontrée par un "
        + "vrai utilisateur y est ajoutée AVANT d'être corrigée, pour qu'elle ne puisse pas revenir.",
      bullets: [
        'Note vocale ou message écrit, au choix de celui qui facture',
        'Darija en lettres arabes ou latines, français, tamazight',
        'Réponse toujours dans la langue reçue — et en audio quand la demande est audio',
        'Riyal et melyoun compris sans conversion manuelle',
        'Corrections en cours de phrase absorbées sans recommencer',
        'Mémoire de la conversation : le bot sait de quelle facture on parle',
        'Tampon anti-rafale : cinq vocaux d’affilée forment une seule demande, pas cinq factures',
        'Banc de régression alimenté par les erreurs réelles avant toute correction du moteur'
      ],
      metrics: [
        { value: '1,4 s', label: 'pour comprendre une note vocale' },
        { value: '4', label: 'langues comprises' },
        { value: '2', label: 'alphabets pour la darija' }
      ]
    },
    {
      id: 'conformite',
      eyebrow: 'Document émis',
      title: 'Une facture opposable, pas un reçu',
      body: "Ce qui sort de la conversation est un PDF que le comptable accepte et que l'administration peut contrôler. Les mentions "
        + "obligatoires y figurent toutes : identifiant commun de l'entreprise, identifiant fiscal, numéro de taxe professionnelle, raison "
        + "sociale et adresse, détail des articles, taux et montant de TVA, total hors taxes et toutes taxes comprises, et montant total en "
        + "toutes lettres.\n\n"
        + "Elles sont renseignées une seule fois, à l'inscription de l'entreprise, en six questions posées dans la conversation. Ensuite, plus "
        + "personne ne les ressaisit. Le cachet de la société est photographié une fois et incrusté automatiquement sur chaque facture émise "
        + "par n'importe quel membre de l'équipe.\n\n"
        + "La numérotation est continue par exercice, sans trou dans la séquence — condition que beaucoup d'outils improvisés ne tiennent pas. "
        + "Une erreur repérée après l'envoi se corrige sous le même numéro, plutôt que d'imposer une facture d'avoir pour une faute de frappe.",
      bullets: [
        'ICE, IF, taxe professionnelle et régime de TVA saisis une fois, jamais redemandés',
        'TVA détaillée par taux, total HT et TTC, montant en toutes lettres',
        'Numérotation continue par exercice, propre à chaque entreprise',
        'Cachet de la société photographié une fois, apposé automatiquement',
        'Correction après émission sous le même numéro, sans avoir à gérer',
        'PDF conservé et retrouvable à la voix : « la facture n°8 », « les factures du mois »'
      ],
      metrics: [
        { value: '6', label: 'questions à l’inscription, puis plus rien' },
        { value: '100 %', label: 'des mentions obligatoires portées' }
      ]
    },
    {
      id: 'remise',
      eyebrow: 'Remise au client',
      title: 'La facture arrive chez le client sans saisir son email',
      body: "Une facture émise mais restée dans le téléphone du vendeur ne sert à rien. Trois chemins la mènent au client, choisis d'un mot "
        + "dans la conversation.\n\n"
        + "Le QR code est le plus rapide au comptoir : le client scanne l'écran du vendeur, ou une étiquette collée sur la caisse, et le PDF se "
        + "télécharge. Rien à saisir, rien à installer de son côté. La facture peut aussi partir directement sur le WhatsApp du client, ou par "
        + "email pour ceux qui archivent.\n\n"
        + "Chaque envoi vers l'extérieur demande une confirmation explicite. C'est une contrainte assumée : un bot qui envoie une facture au "
        + "mauvais destinataire sur une phrase mal comprise fait plus de dégâts qu'il n'en évite.",
      bullets: [
        'QR code : le client scanne l’écran du vendeur, le PDF se télécharge',
        'Envoi direct sur le WhatsApp du client',
        'Envoi par email pour les clients qui archivent',
        'Confirmation obligatoire avant tout envoi vers l’extérieur',
        'Répertoire clients : l’orthographe exacte est mémorisée d’une facture à l’autre',
        'Nom complexe ? Une photo d’un document suffit, le nom exact en est lu'
      ],
      metrics: []
    },
    {
      id: 'architecture',
      eyebrow: 'Architecture',
      title: 'Chaque entreprise dans son espace étanche',
      body: "Le numéro WhatsApp de l'entreprise sert de frontière technique. Chaque société possède ses clients, sa séquence de numérotation et "
        + "son cachet ; rien ne traverse d'une entreprise à l'autre. Deux commerces voisins qui utilisent le même bot ne se voient pas.\n\n"
        + "La conversation passe par l'API WhatsApp Business officielle de Meta, pas par un client détourné : c'est ce qui distingue un service "
        + "exploitable d'un montage qui tombe à la première mise à jour de WhatsApp. Les données sont hébergées en Union européenne.\n\n"
        + "La plateforme bascule automatiquement d'un fonctionnement simple à une file de traitement dès qu'elle tourne en production, sans "
        + "configuration : la charge d'un pic de fin de mois ne se traduit pas par des messages perdus.",
      bullets: [
        'API WhatsApp Business officielle de Meta — pas de client détourné',
        'Un numéro = une entreprise = un espace de données étanche',
        'Séquence de numérotation propre à chaque société',
        'Hébergement en Union européenne',
        'File de traitement activée automatiquement en production',
        'Génération des PDF côté serveur, sans dépendance à un service tiers'
      ],
      metrics: []
    },
    {
      id: 'administration',
      eyebrow: 'Back-office',
      title: 'Une administration qui pilote les abonnements et la supervision',
      body: "Les abonnements, les activations et la supervision se pilotent depuis un back-office dédié, distinct du bot. Activer une entreprise, "
        + "changer son palier ou vérifier ce qui s'est passé sur une conversation ne demande aucune intervention technique.\n\n"
        + "L'architecture sépare volontairement les responsabilités : les jetons d'accès à WhatsApp ne quittent jamais le service de facturation. "
        + "L'administration lui parle par une interface protégée, et n'a donc jamais à détenir les secrets qui permettraient d'écrire au nom "
        + "d'une entreprise.",
      bullets: [
        'Activation et changement de palier sans intervention technique',
        'Supervision des conversations et des factures émises',
        'Les jetons WhatsApp ne sortent jamais du service de facturation',
        'Accès protégé, séparé du site public'
      ],
      metrics: []
    },
    {
      id: 'acquisition',
      eyebrow: 'Référencement & moteurs IA',
      title: 'Un site conçu pour être trouvé, et pour être cité',
      body: "Un produit que personne ne cherche par son nom se trouve par ses questions. Le site de Fatora Bot porte donc un pôle éditorial : "
        + "dix-sept guides en français et douze en arabe qui répondent aux questions réellement posées — l'obligation d'e-facturation, les "
        + "mentions obligatoires d'une facture marocaine, les taux de TVA, la numérotation, l'archivage, les délais de paiement, la différence "
        + "entre ICE, IF et taxe professionnelle.\n\n"
        + "Ces pages sont prérendues côté serveur : leur contenu est lisible dès la première requête, sans exécution de JavaScript — condition "
        + "pour être exploitées par les robots des moteurs génératifs, qui n'exécutent pas de page. Le site publie aussi les fichiers destinés à "
        + "ces moteurs, régénérés automatiquement à chaque publication, et notifie les moteurs de chaque nouvelle URL.\n\n"
        + "Deux garde-fous tiennent l'ensemble : le build échoue si un lien interne ne résout pas, et une URL inconnue renvoie un vrai 404 — "
        + "auparavant, toute adresse fantaisiste retournait la page d'accueil avec un code 200, ce que les moteurs interprètent comme des "
        + "milliers de pages en double.",
      bullets: [
        '41 pages prérendues, contre 4 avant la refonte',
        '17 guides en français, 12 rédigés directement en arabe',
        'Pages sectorielles : BTP et menuiserie, commerce de détail, transport et logistique',
        'Comparatifs sur les requêtes de décision, y compris « avec ou sans logiciel »',
        'Sitemap et fichiers pour moteurs IA régénérés à chaque publication',
        'Notification automatique des moteurs à chaque nouvelle URL',
        'Le build échoue si un lien interne est mort',
        'Vrai 404 sur les adresses inconnues, et non l’accueil en 200',
        'Polices auto-hébergées : aucun appel à un domaine tiers'
      ],
      metrics: [
        { value: '41', label: 'pages indexables' },
        { value: '29', label: 'guides publiés' },
        { value: '4', label: 'langues du site' }
      ]
    },
    {
      id: 'suite',
      eyebrow: 'Feuille de route',
      title: 'Ce qui vient ensuite',
      body: "Le décret d'application qui fixera le calendrier des très petites entreprises n'est pas publié. Quand il le sera, le raccordement à "
        + "la plateforme de l'administration deviendra le sujet : l'architecture est déjà organisée pour que la facture émise puisse être "
        + "transmise pour validation sans que l'utilisateur change quoi que ce soit à son geste.\n\n"
        + "Le canal de diffusion prioritaire n'est pas la TPE en direct mais le comptable : cabinets, fiduciaires, fédérations professionnelles "
        + "et coopératives équipent leurs adhérents d'un coup, avec une intégration prise en charge. C'est aussi le canal par lequel les "
        + "dispositifs publics d'accompagnement à la digitalisation des TPE peuvent financer l'équipement.",
      bullets: [
        'Raccordement à la plateforme de l’administration dès la publication du décret',
        'Déploiement par les cabinets comptables et les fiduciaires',
        'Offres pour fédérations professionnelles et coopératives',
        'Enrichissement continu du lexique darija à partir des usages réels',
        'Extension du pôle éditorial arabe'
      ],
      metrics: []
    }
  ],

  plans: [
    {
      name: 'Évaluation', price: 0, currency: 'MAD', interval: 'month',
      tagline: 'Pour se faire une idée en conditions réelles',
      features: [
        '2 factures offertes',
        'Toutes les fonctions, sans restriction',
        'Sans carte bancaire',
        'Sans engagement'
      ],
      highlighted: false, ctaLabel: 'Essayer sur WhatsApp'
    },
    {
      name: 'TPE', price: 30, currency: 'MAD', interval: 'month',
      tagline: 'Artisan, auto-entrepreneur, petit commerce',
      features: [
        '15 factures par mois',
        'Dictée vocale en darija, français et tamazight',
        'PDF conforme avec cachet de l’entreprise',
        'Remise par QR code, WhatsApp ou email',
        'Utilisateurs illimités'
      ],
      highlighted: false, ctaLabel: 'Choisir TPE'
    },
    {
      name: 'Commerce', price: 50, currency: 'MAD', interval: 'month',
      tagline: 'Le plus choisi',
      features: [
        '30 factures par mois',
        'Tout le palier TPE',
        'Répertoire clients partagé entre vendeurs',
        'Archives consultables à la voix',
        'Utilisateurs illimités'
      ],
      highlighted: true, ctaLabel: 'Choisir Commerce'
    },
    {
      name: 'Entreprise', price: 90, currency: 'MAD', interval: 'month',
      tagline: 'Sociétés de services, transporteurs, coopératives',
      features: [
        '100 factures par mois',
        'Tout le palier Commerce',
        'Accompagnement à la mise en route',
        'Déploiement par cabinet comptable possible',
        'Utilisateurs illimités'
      ],
      highlighted: false, ctaLabel: 'Choisir Entreprise'
    }
  ],

  /**
   * Versions traduites, servies sur /en/produits/… et /ar/produits/…
   *
   * Le français reste le contenu de base : tout champ absent d'une traduction
   * y retombe. Une traduction partielle donne donc une page en langue mixte,
   * jamais une page trouée.
   */
  translations: {
    en: FATORA_BOT_EN,
    ar: FATORA_BOT_AR
  }
};
