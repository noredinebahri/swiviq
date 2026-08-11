/**
 * Contenu des pages « service × ville » (/agence/[ville]/[service]).
 *
 * ANTI-DUPLICATION — ces pages ne réexpliquent PAS le service. Le détail
 * technique générique (stack, méthode, garanties) vit une seule fois sur
 * /services/[slug] ; chaque page locale apporte uniquement l'angle propre au
 * couple ville + métier, puis renvoie vers la page nationale. Recopier le
 * contenu service en changeant le nom de la ville produirait 24 quasi-doublons
 * que Google regrouperait pour n'en indexer qu'un — au mieux.
 *
 * Longueur visée : 250 à 350 mots de contenu réellement spécifique. En
 * dessous, la page n'a pas de raison d'exister et il vaut mieux la retirer
 * du sitemap que de la publier creuse.
 */

export interface LocalServiceDef {
  /** Segment d'URL, en français et lisible. */
  slug: string;
  /** Identifiant du service national (clé de SERVICE_META et du simulateur). */
  serviceId: string;
  label: string;
  /** Prix plancher HT, repris tel quel dans les réponses FAQ (citabilité IA). */
  startingPrice: number;
}

export const LOCAL_SERVICES: LocalServiceDef[] = [
  { slug: 'application-web', serviceId: 'web-app', label: 'Application web sur mesure', startingPrice: 25000 },
  { slug: 'application-mobile', serviceId: 'mobile-app', label: 'Application mobile', startingPrice: 35000 },
  { slug: 'site-e-commerce', serviceId: 'ecommerce', label: 'Site e-commerce', startingPrice: 18000 },
];

export const LOCAL_SERVICE_SLUGS = LOCAL_SERVICES.map(s => s.slug);

export interface CityServiceContent {
  h1: string;
  seoTitle: string;
  seoDesc: string;
  intro: string;
  sections: { title: string; body: string; bullets?: string[] }[];
  faq: { q: string; a: string }[];
}

/** Clé : `${citySlug}/${serviceSlug}`. */
export const CITY_SERVICES: Record<string, CityServiceContent> = {

  /* ========================== CASABLANCA ========================== */
  'casablanca/application-web': {
    h1: 'Développement d\'application web sur mesure à Casablanca',
    seoTitle: 'Développement d\'Application Web à Casablanca — Sur Mesure | SWIVIQ',
    seoDesc: 'Développement d\'applications web sur mesure pour les entreprises de Casablanca : portails clients, back-office, outils métier. À partir de 25 000 MAD HT. Devis en 2 minutes.',
    intro: 'Les entreprises casablancaises qui nous consultent pour une application web ont presque toutes le même profil : une activité qui fonctionne, des équipes qui se coordonnent par e-mail et tableurs, et un plafond atteint. Le sujet n\'est plus de s\'informatiser, il est de reprendre le contrôle d\'une information éparpillée entre des services qui ne se parlent plus.',
    sections: [
      {
        title: 'Portail client : le premier chantier rentable',
        body: 'Sur le marché casablancais, la réactivité perçue par le client fait la différence commerciale. Un portail où votre client consulte ses commandes, télécharge ses factures et suit ses dossiers sans passer par votre service commercial libère un temps considérable — et supprime la moitié des appels entrants. C\'est le chantier que nous recommandons le plus souvent en premier : périmètre limité, gain immédiat et mesurable, et une base technique sur laquelle greffer la suite.',
      },
      {
        title: 'Ce que suppose un volume casablancais',
        body: 'Ce qui fonctionne pour vingt utilisateurs ne tient pas pour deux cents. Les projets de la métropole imposent des choix d\'architecture dès le départ :',
        bullets: [
          'Bases de données dimensionnées et indexées pour des volumes qui croissent vite',
          'Habilitations par profil : un commercial ne voit pas ce que voit la direction financière',
          'Journalisation des accès et des modifications, indispensable dès qu\'il y a des enjeux financiers',
          'Montée en charge testée avant la mise en production, pas découverte après',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application web sur mesure à Casablanca ?',
        a: 'À partir de 25 000 MAD HT. Ce plancher couvre une application métier de complexité standard : authentification, gestion des rôles, écrans de saisie et de consultation, tableaux de bord. Les intégrations (CMI, ERP, API tierces) et le volume d\'écrans font varier le devis, que notre simulateur génère en PDF détaillé en deux minutes.',
      },
      {
        q: 'Combien de temps faut-il pour livrer une première version ?',
        a: 'Six à dix semaines pour une première version en production sur un périmètre standard, atelier de cadrage compris. Nous privilégions systématiquement une première version resserrée mise en service rapidement, puis enrichie, plutôt qu\'une livraison complète à six mois — un outil utilisé se corrige, un outil attendu se conteste.',
      },
    ],
  },

  'casablanca/application-mobile': {
    h1: 'Développement d\'application mobile à Casablanca',
    seoTitle: 'Développement d\'Application Mobile à Casablanca — iOS & Android | SWIVIQ',
    seoDesc: 'Création d\'applications mobiles iOS et Android à Casablanca : applications terrain, forces de vente, applications client. À partir de 35 000 MAD HT. Devis PDF immédiat.',
    intro: 'À Casablanca, la demande d\'applications mobiles se partage entre deux mondes qui n\'ont presque rien en commun : l\'outil interne destiné à des équipes en déplacement, et l\'application grand public destinée à un marché. Les budgets, les délais et les risques diffèrent radicalement — et confondre les deux est la première cause d\'échec que nous observons.',
    sections: [
      {
        title: 'Application terrain : commerciaux, livreurs, techniciens',
        body: 'C\'est le cas le plus fréquent et le plus rentable. Une force de vente qui saisit ses commandes sur mobile chez le client, un livreur qui fait signer une réception, un technicien qui remonte un rapport d\'intervention avec photo : l\'information arrive au siège en temps réel au lieu d\'attendre le retour au bureau. Le périmètre est cadré, les utilisateurs sont identifiés et formés, et le retour sur investissement se mesure en semaines.',
      },
      {
        title: 'Application grand public : ce qu\'il faut savoir avant',
        body: 'Une application destinée au marché casablancais est un produit, pas un projet. Nous en parlons franchement avant de chiffrer :',
        bullets: [
          'Le développement n\'est qu\'une partie du coût — l\'acquisition d\'utilisateurs pèse souvent davantage',
          'Publication sur l\'App Store et Google Play : comptes développeur, validation, mises à jour',
          'Sans budget de lancement, une application publiée reste invisible, quelle que soit sa qualité',
          'Une web app installable coûte nettement moins cher et suffit pour valider un marché',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application mobile à Casablanca ?',
        a: 'À partir de 35 000 MAD HT pour une application mobile déployée sur iOS et Android. Ce montant couvre le développement, les tests sur appareils réels et l\'accompagnement à la publication sur les stores. Les comptes développeur Apple et Google restent à votre charge et à votre nom, car ils doivent vous appartenir.',
      },
      {
        q: 'Faut-il développer une application native ou une web app ?',
        a: 'Une web app installable suffit dans la majorité des cas et coûte sensiblement moins cher : elle se met à jour sans passer par les stores et fonctionne sur tous les appareils. Le natif se justifie quand vous avez besoin des capacités profondes du téléphone — notifications poussées avancées, usage hors ligne intensif, accès aux capteurs. Nous tranchons ensemble au cadrage, sur vos usages réels.',
      },
    ],
  },

  'casablanca/site-e-commerce': {
    h1: 'Création de site e-commerce à Casablanca',
    seoTitle: 'Création de Site E-commerce à Casablanca — Sur Mesure | SWIVIQ',
    seoDesc: 'Création de boutiques en ligne à Casablanca : paiement CMI, livraison sur la métropole, click & collect. Site e-commerce sur mesure à partir de 18 000 MAD HT.',
    intro: 'Le commerce casablancais est celui qui a le plus à gagner du canal en ligne et celui où la concurrence est la plus rude. Une boutique qui se contente d\'exister ne vend pas : ce qui fait la différence, c\'est la logistique de livraison sur la métropole, la clarté du paiement et la capacité à se faire trouver sur Google au moment de la recherche.',
    sections: [
      {
        title: 'La livraison décide de la conversion',
        body: 'À Casablanca, le client abandonne son panier moins pour le prix du produit que pour un doute sur la livraison. Nous traitons ce point comme un sujet de conception, pas comme une ligne de paramètres : zones de livraison réellement desservies avec leurs délais propres, créneaux annoncés, click & collect en boutique quand vous en avez une, et paiement à la livraison géré proprement — il reste largement majoritaire au Maroc et le refuser revient à écarter une part importante du marché.',
      },
      {
        title: 'Être trouvé avant d\'être choisi',
        body: 'Une boutique invisible sur Google ne dépend que de la publicité payante, ce qui grève la marge durablement. Nous construisons l\'indexation dès la conception :',
        bullets: [
          'Rendu côté serveur : Google lit les fiches produits sans dépendre de l\'exécution du JavaScript',
          'Fiches rédigées sur les termes réellement recherchés, pas sur vos références internes',
          'Données structurées Produit et Avis, qui enrichissent l\'affichage dans les résultats',
          'Temps de chargement surveillé — sur mobile, chaque seconde perdue coûte des ventes',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte un site e-commerce à Casablanca ?',
        a: 'À partir de 18 000 MAD HT pour une boutique sur mesure : catalogue, panier, paiement en ligne, gestion des commandes et back-office. Le paiement CMI, le multilingue, le référencement avancé et la maintenance annuelle sont des options chiffrées séparément dans le devis PDF généré par notre simulateur.',
      },
      {
        q: 'Gérez-vous le paiement à la livraison ?',
        a: 'Oui, et nous le recommandons sur le marché marocain où il reste le mode d\'encaissement dominant. La boutique gère alors le cycle complet : confirmation de commande, préparation, remise au livreur, encaissement et rapprochement comptable. Il peut coexister avec le paiement par carte via le CMI, le client choisissant au moment de la commande.',
      },
    ],
  },

  /* ============================= RABAT ============================= */
  'rabat/application-web': {
    h1: 'Développement d\'application web sur mesure à Rabat',
    seoTitle: 'Développement d\'Application Web à Rabat — Agence Locale | SWIVIQ',
    seoDesc: 'Agence basée à Rabat : développement d\'applications web sur mesure, portails métier, gestion documentaire, conformité CNDP. À partir de 25 000 MAD HT.',
    intro: 'Nous développons depuis Rabat, pour Rabat. Cabinets de conseil, établissements de formation, associations, structures publiques et parapubliques : les projets rbatis se caractérisent moins par leur volume que par leurs exigences de rigueur — traçabilité, habilitations, archivage, protection des données personnelles.',
    sections: [
      {
        title: 'Concevoir avec la conformité, pas contre elle',
        body: 'Traiter la conformité en fin de projet coûte cher et produit des rustines. Nous l\'intégrons au cadrage : quelles données personnelles sont réellement nécessaires, combien de temps les conserver, qui peut y accéder, comment prouver un accès a posteriori. La loi 09-08 et les exigences de la CNDP deviennent alors des contraintes de conception ordinaires plutôt qu\'un obstacle découvert à la recette.',
      },
      {
        title: 'L\'avantage concret de la proximité',
        body: 'Être dans la même ville change la conduite du projet, pas seulement son confort :',
        bullets: [
          'Atelier de cadrage sur site, avec les personnes qui utiliseront réellement l\'outil',
          'Déblocage en présentiel quand une décision traîne — une heure sur place vaut dix e-mails',
          'Formation des équipes dans vos locaux, sur vos postes et vos données',
          'Interlocuteur unique et joignable, sans intermédiaire commercial entre vous et les développeurs',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application web à Rabat ?',
        a: 'À partir de 25 000 MAD HT pour une application métier de complexité standard. Notre grille est nationale et publique : elle ne varie pas selon la ville. Le simulateur en ligne établit votre estimation et produit un devis PDF détaillé en deux minutes, sans engagement.',
      },
      {
        q: 'Peut-on vous rencontrer avant de s\'engager ?',
        a: 'Oui, et nous le recommandons pour tout projet dépassant le simple site vitrine. Nos bureaux sont rue Moulay Ahmed Loukili, quartier Hassan. Un premier échange d\'une heure suffit généralement à déterminer si votre besoin relève d\'un développement sur mesure ou si un outil du marché ferait l\'affaire — et nous le disons quand c\'est le cas.',
      },
    ],
  },

  'rabat/application-mobile': {
    h1: 'Développement d\'application mobile à Rabat',
    seoTitle: 'Développement d\'Application Mobile à Rabat — iOS & Android | SWIVIQ',
    seoDesc: 'Création d\'applications mobiles iOS et Android à Rabat : applications de service, accessibilité, notifications. Agence locale. À partir de 35 000 MAD HT.',
    intro: 'Une application mobile portée par une structure rbatie s\'adresse souvent à un public large et hétérogène : usagers d\'un service, étudiants, adhérents, bénéficiaires. Cela déplace le centre de gravité du projet vers deux exigences que les projets purement commerciaux traitent moins sérieusement — l\'accessibilité et la compatibilité avec des téléphones anciens.',
    sections: [
      {
        title: 'Une application utilisable par tout le monde',
        body: 'Si votre application s\'adresse au public, elle doit fonctionner sur un téléphone d\'entrée de gamme vieux de quatre ans, avec une connexion médiocre, pour un utilisateur qui n\'a pas l\'habitude des interfaces modernes. Nous testons sur du matériel réel et modeste, pas seulement sur les derniers modèles : contrastes suffisants, tailles de texte ajustables, libellés explicites, compatibilité avec les lecteurs d\'écran, et arabe géré en écriture droite-à-gauche.',
      },
      {
        title: 'Notifications : utiles ou désinstallées',
        body: 'La notification est le principal levier de réengagement et la première cause de désinstallation. Nous l\'encadrons dès la conception :',
        bullets: [
          'Notifications déclenchées par un événement qui concerne l\'utilisateur, jamais par un calendrier d\'envoi',
          'Réglages par catégorie, pour que l\'utilisateur coupe une notification sans couper toutes les autres',
          'Repli par e-mail ou WhatsApp lorsque les notifications sont refusées',
          'Mesure du taux d\'ouverture pour arrêter ce qui ne sert à rien',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application mobile à Rabat ?',
        a: 'À partir de 35 000 MAD HT pour un déploiement iOS et Android, tests sur appareils réels et accompagnement à la publication compris. Les comptes développeur Apple et Google sont ouverts à votre nom et restent votre propriété — c\'est une règle que nous ne contournons jamais, sous peine de vous rendre dépendant de votre prestataire.',
      },
      {
        q: 'Gérez-vous l\'arabe dans les applications mobiles ?',
        a: 'Oui, avec l\'écriture droite-à-gauche prise en charge nativement : ce n\'est pas une traduction posée sur une interface pensée pour le français, c\'est une mise en miroir complète de la navigation et des écrans. Le trilinguisme français, arabe et anglais est notre configuration la plus courante.',
      },
    ],
  },

  'rabat/site-e-commerce': {
    h1: 'Création de site e-commerce à Rabat',
    seoTitle: 'Création de Site E-commerce à Rabat — Boutique en Ligne | SWIVIQ',
    seoDesc: 'Création de boutiques en ligne à Rabat : paiement CMI, facturation conforme, livraison. Site e-commerce sur mesure à partir de 18 000 MAD HT. Agence locale.',
    intro: 'Les boutiques en ligne rbaties que nous accompagnons sont rarement des pure players : ce sont des commerces, des artisans, des éditeurs ou des associations qui ajoutent un canal de vente à une activité existante. L\'enjeu n\'est donc pas de bâtir une place de marché, mais de ne pas créer une deuxième organisation à gérer en parallèle de la première.',
    sections: [
      {
        title: 'Un seul stock, une seule comptabilité',
        body: 'Le piège classique consiste à faire vivre la boutique à côté de l\'activité existante : deux stocks, deux systèmes de facturation, deux vérités qui divergent en quelques semaines. Nous partons systématiquement de l\'organisation en place. Si vous tenez votre stock dans un outil précis, la boutique s\'y raccorde ou s\'y substitue proprement — elle ne s\'y ajoute pas.',
      },
      {
        title: 'Facturer correctement dès la première vente',
        body: 'Une boutique qui vend sans facturer conformément crée une dette administrative qui se paie plus tard :',
        bullets: [
          'Mentions légales marocaines complètes sur chaque facture : ICE, IF, RC, TVA',
          'Numérotation continue et sans trou, exigée en cas de contrôle',
          'Archivage des factures émises, consultables et exportables pour votre comptable',
          'TVA correctement appliquée selon la nature du produit ou du service vendu',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une boutique en ligne à Rabat ?',
        a: 'À partir de 18 000 MAD HT : catalogue, panier, paiement, gestion des commandes et back-office. Le paiement par carte via le CMI, le multilingue et la maintenance annuelle sont des options. Le simulateur génère votre devis PDF détaillé en deux minutes, avec le détail ligne par ligne.',
      },
      {
        q: 'Comment se passe l\'activation du paiement CMI ?',
        a: 'Le contrat CMI se signe entre votre banque et vous : nous ne pouvons pas le souscrire à votre place. Nous préparons le dossier technique, réalisons l\'intégration et les tests, puis accompagnons la mise en production. Comptez quelques semaines de délai bancaire, à anticiper dès le début du projet plutôt qu\'à la veille du lancement.',
      },
    ],
  },

  /* =========================== MARRAKECH =========================== */
  'marrakech/application-web': {
    h1: 'Développement d\'application web sur mesure à Marrakech',
    seoTitle: 'Développement d\'Application Web à Marrakech — Réservation | SWIVIQ',
    seoDesc: 'Applications web sur mesure à Marrakech : moteurs de réservation, extranets, gestion hôtelière. Multilingue et paiement en ligne. À partir de 25 000 MAD HT.',
    intro: 'À Marrakech, une application web sert le plus souvent à orchestrer une disponibilité : chambres, tables, véhicules, créneaux d\'excursion. C\'est un problème technique précis, où l\'erreur ne se rattrape pas — une double réservation coûte un client, un avis négatif, et parfois davantage.',
    sections: [
      {
        title: 'Gérer la disponibilité sans jamais survendre',
        body: 'Un moteur de réservation sérieux traite des cas que les outils improvisés ignorent : deux clients qui réservent la même chambre à la même seconde, un paiement qui échoue après blocage du créneau, une annulation qui doit libérer la disponibilité immédiatement. Nous traitons ces situations par conception, avec verrouillage transactionnel et expiration automatique des réservations non payées, plutôt que de les découvrir en haute saison.',
      },
      {
        title: 'Coexister avec les plateformes plutôt que les ignorer',
        body: 'Votre site ne remplacera pas les plateformes internationales du jour au lendemain, mais il doit vivre avec elles sans créer de double saisie :',
        bullets: [
          'Connexion au channel manager pour synchroniser disponibilités et tarifs',
          'Vue unifiée des réservations, quelle que soit leur origine',
          'Tarification directe plus attractive, seul argument réel pour capter la réservation en propre',
          'Fichier client constitué en direct : c\'est lui qui a de la valeur sur la durée',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte un moteur de réservation à Marrakech ?',
        a: 'Un site avec moteur de réservation, calendrier de disponibilités, paiement en ligne et confirmations automatiques démarre à 18 000 MAD HT. Une application de gestion plus complète — multi-établissements, tarification dynamique, extranet propriétaires — relève du développement sur mesure, à partir de 25 000 MAD HT.',
      },
      {
        q: 'Pouvez-vous vous connecter à notre channel manager ?',
        a: 'Oui, dès lors qu\'il expose une API documentée, ce qui est le cas des principales solutions du marché. La connexion est chiffrée séparément car son coût dépend entièrement de la qualité de la documentation de l\'éditeur. Nous vérifions ce point avant de nous engager sur un délai.',
      },
    ],
  },

  'marrakech/application-mobile': {
    h1: 'Développement d\'application mobile à Marrakech',
    seoTitle: 'Développement d\'Application Mobile à Marrakech — Tourisme | SWIVIQ',
    seoDesc: 'Applications mobiles à Marrakech : conciergerie, application client hôtel, services touristiques. Multilingue iOS et Android. À partir de 35 000 MAD HT.',
    intro: 'Une application mobile touristique à Marrakech s\'adresse à un utilisateur particulier : il est étranger, il reste quelques jours, il utilise une connexion coûteuse ou limitée, et il n\'installera jamais une application qu\'il devra chercher lui-même. Ces quatre contraintes conditionnent tout le projet.',
    sections: [
      {
        title: 'Le vrai problème est l\'installation, pas les fonctionnalités',
        body: 'Un touriste ne cherche pas votre application sur les stores. Elle doit s\'imposer à lui au bon moment — QR code en chambre, lien dans le message de confirmation, code affiché à la réception. C\'est pourquoi nous recommandons très souvent une web app installable plutôt qu\'une application native : elle s\'ouvre d\'un scan, sans passer par un store, sans compte à créer, et sans consommer les données d\'un forfait en itinérance pour un téléchargement.',
      },
      {
        title: 'Concevoir pour un séjour de quatre jours',
        body: 'La durée de vie utile de l\'application est celle du séjour, ce qui impose des choix nets :',
        bullets: [
          'Aucune inscription obligatoire — le numéro de réservation suffit à identifier le client',
          'Contenus essentiels consultables hors ligne, pour un usage sans données mobiles',
          'Langue détectée automatiquement, sans écran de choix préalable',
          'Accès direct aux actions utiles : demande de service, réservation de table, transfert aéroport',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application mobile pour un hôtel à Marrakech ?',
        a: 'Une application mobile native démarre à 35 000 MAD HT sur iOS et Android. Pour un usage touristique, nous recommandons souvent une web app installable, sensiblement moins chère et accessible par simple QR code, sans passage par les stores. Nous chiffrons les deux options au cadrage pour que la comparaison soit factuelle.',
      },
      {
        q: 'L\'application gère-t-elle plusieurs langues automatiquement ?',
        a: 'Oui. La langue est détectée depuis les réglages du téléphone, sans écran de sélection préalable, avec le français, l\'anglais et l\'arabe en standard — l\'arabe en écriture droite-à-gauche. D\'autres langues, l\'espagnol notamment, s\'ajoutent facilement si votre clientèle le justifie.',
      },
    ],
  },

  'marrakech/site-e-commerce': {
    h1: 'Création de site e-commerce à Marrakech',
    seoTitle: 'Création de Site E-commerce à Marrakech — Vente en Ligne | SWIVIQ',
    seoDesc: 'Boutiques en ligne à Marrakech : artisanat, produits du terroir, vente aux touristes et export. Multilingue et multidevise. À partir de 18 000 MAD HT.',
    intro: 'Vendre en ligne depuis Marrakech, c\'est presque toujours vendre à quelqu\'un qui est passé par la ville ou qui rêve d\'y venir. Cette clientèle achète une histoire autant qu\'un objet, paie en euros ou en dollars, et se trouve à l\'autre bout d\'une chaîne logistique qu\'il faut annoncer honnêtement.',
    sections: [
      {
        title: 'Vendre à distance ce qui se vend d\'ordinaire en main',
        body: 'Un tapis, une lampe ou un produit du terroir se vendent en boutique par le toucher et la conversation. En ligne, tout repose sur ce que la fiche produit parvient à transmettre : des photographies fidèles aux couleurs réelles, les dimensions et le poids exacts, l\'origine et la matière, et le geste artisanal derrière l\'objet. C\'est le poste où l\'effort paie le plus — nous le disons aux clients qui voudraient le traiter en dernier.',
      },
      {
        title: 'L\'expédition internationale, annoncée avant le paiement',
        body: 'Un litige d\'expédition coûte plus qu\'une vente : il produit un avis négatif durable. Nous rendons la logistique explicite :',
        bullets: [
          'Frais de port calculés par destination et par poids, jamais forfaitaires au hasard',
          'Délais réels par zone, affichés avant le paiement et non après',
          'Suivi d\'expédition communiqué automatiquement au client',
          'Mentions douanières et droits d\'importation éventuels, indiqués sans ambiguïté',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une boutique en ligne à Marrakech ?',
        a: 'À partir de 18 000 MAD HT pour une boutique sur mesure. Pour une clientèle internationale, prévoyez le multilingue et l\'affichage multidevise, ainsi qu\'un moyen de paiement accepté hors du Maroc en complément du CMI. Le simulateur chiffre ces options ligne par ligne dans un devis PDF.',
      },
      {
        q: 'Peut-on encaisser en euros depuis le Maroc ?',
        a: 'L\'affichage des prix en euros ou en dollars est simple à mettre en place. L\'encaissement effectif en devises relève en revanche de votre banque et de la réglementation des changes : c\'est un sujet à traiter avec elle en amont. Nous intégrons ensuite la solution retenue, quelle qu\'elle soit.',
      },
    ],
  },

  /* ============================= TANGER ============================= */
  'tanger/application-web': {
    h1: 'Développement d\'application web sur mesure à Tanger',
    seoTitle: 'Développement d\'Application Web à Tanger — Industrie & Logistique | SWIVIQ',
    seoDesc: 'Applications web métier à Tanger : suivi de production, traçabilité, logistique portuaire, zones franches. À partir de 25 000 MAD HT. Devis PDF détaillé.',
    intro: 'Les applications web que nous développons pour Tanger sont des outils de production. Elles remplacent des tableurs partagés qui ont atteint leur limite, des classeurs de contrôle qualité, et des échanges de fichiers par e-mail entre l\'atelier, la qualité et l\'expédition.',
    sections: [
      {
        title: 'Suivre un flux, pas seulement enregistrer des données',
        body: 'La valeur d\'une application industrielle ne tient pas au stockage mais à la restitution : savoir instantanément où en est une commande, quel lot a été bloqué, quel poste ralentit la ligne. Nous construisons donc à partir des questions auxquelles la direction doit répondre chaque matin, puis nous remontons vers les saisies strictement nécessaires pour y répondre. C\'est l\'ordre inverse de celui qui produit des outils que personne ne remplit.',
      },
      {
        title: 'Échanger avec le donneur d\'ordre sans ressaisie',
        body: 'Un site tangérois travaille rarement seul : il rend des comptes à un client européen ou à une maison mère :',
        bullets: [
          'Exports aux formats imposés, générés automatiquement plutôt que remontés à la main',
          'Connexion aux systèmes du groupe lorsqu\'une API est disponible',
          'Historique inaltérable des enregistrements, exigé lors des audits clients',
          'Interfaces en français et en espagnol, langues de travail courantes dans la région',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application de suivi de production à Tanger ?',
        a: 'À partir de 25 000 MAD HT pour une application métier de complexité standard. Le périmètre se définit lors d\'un atelier sur site, en atelier : c\'est là que se trouvent les contraintes réelles, rarement dans le cahier des charges. Nous chiffrons ensuite fermement, avec un devis PDF détaillé.',
      },
      {
        q: 'Pouvez-vous connecter l\'application à l\'ERP de notre groupe ?',
        a: 'Oui, si l\'ERP expose une API ou permet des échanges de fichiers structurés. L\'interfaçage est chiffré à part, car son coût dépend de la documentation fournie par l\'éditeur — nous demandons à la consulter avant de nous engager sur un montant et un délai.',
      },
    ],
  },

  'tanger/application-mobile': {
    h1: 'Développement d\'application mobile à Tanger',
    seoTitle: 'Développement d\'Application Mobile à Tanger — Terrain & Atelier | SWIVIQ',
    seoDesc: 'Applications mobiles industrielles à Tanger : saisie en atelier, contrôle qualité, inventaire, mode hors ligne. À partir de 35 000 MAD HT. Devis immédiat.',
    intro: 'À Tanger, l\'application mobile est un instrument de travail porté par des opérateurs, pas un produit destiné à un marché. Elle est utilisée debout, parfois avec des gants, sur un appareil partagé entre plusieurs équipes, dans un bâtiment où le réseau tombe à intervalles réguliers.',
    sections: [
      {
        title: 'Une interface conçue pour l\'atelier',
        body: 'Les principes d\'ergonomie du grand public ne s\'appliquent pas ici. Ce qui compte, c\'est le nombre de gestes pour enregistrer une opération, la lisibilité sous un éclairage industriel, et la tolérance à l\'erreur de saisie. Nous concevons des écrans à quelques boutons larges, avec lecture de codes-barres partout où elle peut remplacer une frappe, et une confirmation visible qui évite les doubles saisies par doute.',
      },
      {
        title: 'Le hors ligne est une exigence, pas une option',
        body: 'Une application qui se bloque quand le réseau tombe est abandonnée en une semaine :',
        bullets: [
          'Saisies enregistrées localement, sans interruption du travail pendant la coupure',
          'Synchronisation automatique au retour du réseau, avec résolution des conflits',
          'Indicateur clair de l\'état de synchronisation, pour que l\'opérateur sache où il en est',
          'Aucune perte de données en cas de batterie vide ou d\'appareil éteint brutalement',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application mobile industrielle à Tanger ?',
        a: 'À partir de 35 000 MAD HT. Pour un usage strictement interne, une web app installable sur les appareils de l\'entreprise revient sensiblement moins cher et évite le passage par les stores, tout en conservant le fonctionnement hors ligne. C\'est la solution que nous recommandons le plus souvent en environnement industriel.',
      },
      {
        q: 'L\'application fonctionne-t-elle sans réseau dans l\'atelier ?',
        a: 'Oui, lorsque c\'est prévu dès la conception. Les saisies sont stockées sur l\'appareil et remontées automatiquement au retour de la connexion, avec un indicateur d\'état visible par l\'opérateur. Ajouter ce comportement après coup à une application existante revient généralement à la reconstruire — d\'où l\'importance de le décider au cadrage.',
      },
    ],
  },

  'tanger/site-e-commerce': {
    h1: 'Création de site e-commerce à Tanger',
    seoTitle: 'Création de Site E-commerce B2B à Tanger — Export | SWIVIQ',
    seoDesc: 'Boutiques en ligne et catalogues B2B à Tanger : commandes revendeurs, tarifs par client, export. Site e-commerce sur mesure à partir de 18 000 MAD HT.',
    intro: 'À Tanger, la vente en ligne est plus souvent B2B que B2C : un fabricant qui ouvre un canal de commande à ses revendeurs, un grossiste qui veut cesser de prendre les commandes par téléphone, un exportateur qui présente son catalogue à des acheteurs étrangers. Les règles y sont différentes de celles du commerce grand public.',
    sections: [
      {
        title: 'Une boutique B2B n\'est pas une boutique grand public',
        body: 'En B2B, le prix n\'est pas public : il dépend du client, du volume et de l\'accord commercial négocié. Le catalogue n\'est visible qu\'après authentification, les remises sont propres à chaque compte, et la commande suit un circuit de validation avant d\'être ferme. Une plateforme grand public détournée pour cet usage produit invariablement des écarts de facturation et des litiges commerciaux.',
      },
      {
        title: 'Ce que le B2B impose techniquement',
        body: 'Les fonctions qui font la différence sur un catalogue professionnel :',
        bullets: [
          'Tarifs et remises par compte client, avec grilles multiples selon les accords',
          'Commande sur référence et quantité, sans parcours de découverte inutile',
          'Historique des commandes et recommande en un geste',
          'Documents commerciaux générés automatiquement : proforma, bon de commande, facture',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte un catalogue de commande B2B à Tanger ?',
        a: 'Une boutique sur mesure démarre à 18 000 MAD HT. Les fonctions spécifiquement B2B — tarifs par client, circuit de validation, documents commerciaux — relèvent d\'un développement plus poussé et sont chiffrées séparément par le simulateur, qui produit un devis PDF détaillé.',
      },
      {
        q: 'Peut-on réserver le catalogue à nos revendeurs ?',
        a: 'Oui. Le catalogue et les prix ne sont accessibles qu\'après connexion, avec des comptes que vous créez et administrez vous-même. Il est possible de laisser une vitrine publique sans prix, utile au référencement, tout en gardant la partie commerciale strictement fermée.',
      },
    ],
  },

  /* ============================== FÈS ============================== */
  'fes/application-web': {
    h1: 'Développement d\'application web sur mesure à Fès',
    seoTitle: 'Développement d\'Application Web à Fès — Sur Mesure | SWIVIQ',
    seoDesc: 'Applications web métier à Fès : gestion d\'atelier, coopératives, agroalimentaire, formation. À partir de 25 000 MAD HT. Devis PDF détaillé en 2 minutes.',
    intro: 'Les projets fassis démarrent rarement d\'une page blanche : il existe presque toujours un système en place, fait de tableurs, de carnets et de savoir-faire non écrit. Le travail consiste autant à comprendre cette organisation existante qu\'à développer l\'outil qui va la remplacer.',
    sections: [
      {
        title: 'Formaliser sans casser ce qui fonctionne',
        body: 'Une organisation artisanale ou familiale porte une intelligence réelle dans ses habitudes de travail, même non écrites. L\'erreur classique consiste à plaquer un logiciel standard qui impose ses propres règles et que personne n\'utilisera. Nous commençons par observer le fonctionnement réel, puis nous ne numérisons que ce qui gagne à l\'être — en laissant délibérément hors périmètre ce qui marche très bien à la main.',
      },
      {
        title: 'Adoption : le vrai risque du projet',
        body: 'Sur ce type de structure, l\'échec vient de l\'usage, jamais de la technique :',
        bullets: [
          'Interfaces en français et en arabe, selon qui saisit réellement les données',
          'Saisie réduite au minimum indispensable — chaque champ superflu est un champ non rempli',
          'Formation sur site, avec les données réelles de l\'entreprise et non un jeu d\'essai',
          'Période d\'accompagnement après la mise en service, quand les vraies questions surgissent',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application de gestion à Fès ?',
        a: 'À partir de 25 000 MAD HT pour une application web métier de complexité standard. Pour une première informatisation, nous recommandons de resserrer le périmètre initial sur le processus le plus coûteux : le budget reste maîtrisé et l\'outil est réellement adopté avant d\'être étendu.',
      },
      {
        q: 'Nos équipes ne sont pas à l\'aise avec l\'informatique, est-ce un obstacle ?',
        a: 'C\'est un paramètre de conception, pas un obstacle. Nous réduisons le nombre d\'écrans et de champs, privilégions les listes de choix à la saisie libre, et formons sur site avec vos données réelles. Une application simple utilisée tous les jours vaut infiniment mieux qu\'un outil complet que personne n\'ouvre.',
      },
    ],
  },

  'fes/application-mobile': {
    h1: 'Développement d\'application mobile à Fès',
    seoTitle: 'Développement d\'Application Mobile à Fès — iOS & Android | SWIVIQ',
    seoDesc: 'Applications mobiles à Fès : catalogue vendeur, prise de commande, suivi d\'activité. iOS et Android, français et arabe. À partir de 35 000 MAD HT.',
    intro: 'À Fès, la demande mobile vient surtout de structures commerciales qui veulent équiper des vendeurs ou des livreurs, et d\'établissements de formation qui cherchent à joindre leurs étudiants. Dans les deux cas, l\'application vient s\'ajouter à un usage massif de WhatsApp — et doit se justifier face à lui.',
    sections: [
      {
        title: 'Justifier l\'application face à WhatsApp',
        body: 'Nous posons systématiquement la question, parce qu\'elle évite des projets inutiles : qu\'est-ce que cette application fera que WhatsApp ne fait pas ? Les réponses valables existent — historique structuré et consultable, données consolidées automatiquement, travail hors ligne, contrôle des accès. Quand aucune ne tient, nous le disons et proposons de commencer par une intégration WhatsApp Business, bien moins coûteuse.',
      },
      {
        title: 'Équiper des vendeurs en déplacement',
        body: 'C\'est l\'usage le plus rentable que nous rencontrons ici :',
        bullets: [
          'Catalogue consultable hors ligne, avec photographies et prix à jour',
          'Prise de commande directement chez le client, sans ressaisie au retour',
          'Stock indicatif en temps réel, pour ne pas promettre l\'indisponible',
          'Suivi des visites et des encaissements, consolidé automatiquement pour la direction',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application mobile à Fès ?',
        a: 'À partir de 35 000 MAD HT sur iOS et Android. Pour un usage strictement interne — équiper vos vendeurs, par exemple — une web app installable coûte sensiblement moins cher et évite la publication sur les stores, tout en fonctionnant hors ligne.',
      },
      {
        q: 'Une application est-elle vraiment utile si nous utilisons déjà WhatsApp ?',
        a: 'Pas toujours, et nous le disons franchement. WhatsApp reste imbattable pour l\'échange. L\'application devient utile quand vous avez besoin de données structurées, consolidées et exploitables : suivi de commandes, historique par client, stock à jour. Si votre besoin est seulement de communiquer, une intégration WhatsApp Business suffit et coûte bien moins cher.',
      },
    ],
  },

  'fes/site-e-commerce': {
    h1: 'Création de site e-commerce à Fès',
    seoTitle: 'Création de Site E-commerce à Fès — Artisanat & Export | SWIVIQ',
    seoDesc: 'Boutiques en ligne à Fès : artisanat, zellige, cuir, agroalimentaire, export international. Multilingue et multidevise. À partir de 18 000 MAD HT.',
    intro: 'Le e-commerce fassi porte souvent des produits uniques ou en très petite série : une pièce de dinanderie n\'est pas un article de catalogue reproductible à l\'infini. Cette singularité, qui fait toute la valeur commerciale, complique la gestion technique de la boutique.',
    sections: [
      {
        title: 'Gérer la pièce unique sans survendre',
        body: 'Une boutique standard suppose des articles reproductibles avec un stock chiffrable. Pour de la pièce unique, il faut que chaque objet soit un article à part entière, retiré de la vente dès qu\'il est vendu, avec ses propres photographies et ses dimensions exactes. Nous concevons la boutique et le back-office pour que la mise en ligne d\'une nouvelle pièce reste rapide — sans quoi le catalogue cesse d\'être alimenté au bout de trois semaines.',
      },
      {
        title: 'Convaincre un acheteur qui ne verra pas l\'objet',
        body: 'La fiche produit fait tout le travail que la médina faisait pour vous :',
        bullets: [
          'Photographies multiples, avec un objet de référence pour donner l\'échelle',
          'Dimensions, poids et matières exacts — un tapis ne se commande pas à l\'approximation',
          'Récit du savoir-faire : c\'est ce qui justifie le prix face à un objet industriel',
          'Traduction professionnelle en anglais, et non automatique, sur le marché export',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une boutique en ligne d\'artisanat à Fès ?',
        a: 'À partir de 18 000 MAD HT. La gestion des pièces uniques, le multilingue pour l\'export et le calcul des frais de port par destination sont chiffrés comme options dans le devis PDF que génère notre simulateur en deux minutes.',
      },
      {
        q: 'Pouvez-vous gérer les expéditions internationales ?',
        a: 'La boutique calcule les frais par destination et par poids, affiche des délais réalistes avant paiement et transmet automatiquement le suivi au client. Le choix du transporteur et les formalités douanières restent de votre côté — nous préparons en revanche les documents que la boutique doit produire pour votre transitaire.',
      },
    ],
  },

  /* ============================= AGADIR ============================= */
  'agadir/application-web': {
    h1: 'Développement d\'application web sur mesure à Agadir',
    seoTitle: 'Développement d\'Application Web à Agadir — Agro & Traçabilité | SWIVIQ',
    seoDesc: 'Applications web métier à Agadir : traçabilité agricole, gestion de station, contrôle qualité, export. À partir de 25 000 MAD HT. Devis PDF immédiat.',
    intro: 'Dans le Souss-Massa, l\'application web sert d\'abord à produire une preuve : prouver l\'origine d\'un lot, la conformité d\'un traitement, le respect de la chaîne du froid. Ce n\'est pas une contrainte administrative mais une condition d\'accès aux marchés européens.',
    sections: [
      {
        title: 'Construire le dossier au fil de l\'eau',
        body: 'La traçabilité reconstituée après coup dans un tableur ne résiste pas à un audit sérieux, et tout le monde le sait. Une application utile enregistre l\'information au moment où elle est produite — à la parcelle, à la réception, au calibrage, au chargement — de sorte que le dossier soit complet en permanence. Le jour où un acheteur ou un certificateur demande l\'historique d\'un lot, la réponse existe déjà.',
      },
      {
        title: 'Consolider ce qui est aujourd\'hui éparpillé',
        body: 'La donnée existe déjà chez la plupart des stations ; elle est simplement dispersée :',
        bullets: [
          'Registres parcellaires, souvent tenus sur papier ou dans des tableurs isolés',
          'Contrôles qualité en réception et en sortie, consignés sur des fiches distinctes',
          'Relevés de température, parfois sur des systèmes qui ne communiquent avec rien',
          'Bons d\'expédition et documents d\'export, produits en fin de chaîne sans lien avec l\'amont',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application de traçabilité à Agadir ?',
        a: 'À partir de 25 000 MAD HT pour une application métier de complexité standard. Le périmètre exact — parcelles, station, qualité, expédition — se définit lors d\'un atelier sur site, car chaque organisation a ses propres points de contrôle. Le devis PDF est ensuite ferme et détaillé.',
      },
      {
        q: 'L\'application produit-elle les exports attendus par nos certificateurs ?',
        a: 'Oui, à condition que le format attendu soit documenté. Nous demandons à voir les modèles réellement exigés par vos acheteurs et vos organismes certificateurs avant le chiffrage : c\'est ce qui détermine la faisabilité et le coût de cette partie du projet.',
      },
    ],
  },

  'agadir/application-mobile': {
    h1: 'Développement d\'application mobile à Agadir',
    seoTitle: 'Développement d\'Application Mobile à Agadir — Terrain & Parcelles | SWIVIQ',
    seoDesc: 'Applications mobiles à Agadir : saisie en parcelle, contrôle qualité en station, mode hors ligne, lecture de codes-barres. À partir de 35 000 MAD HT.',
    intro: 'Ici, l\'application mobile va sur le terrain au sens propre : en parcelle, sous serre, sur le quai de réception. L\'appareil est exposé à la poussière et au soleil, le réseau est incertain, et l\'utilisateur a rarement une main libre.',
    sections: [
      {
        title: 'Saisir en parcelle, sans réseau et sans clavier',
        body: 'Une interface conçue au bureau échoue systématiquement sur le terrain. Nous privilégions les grands boutons, les listes de choix plutôt que la frappe libre, la lecture de QR codes posés sur les rangs ou les caisses, et un contraste lisible en plein soleil. Les saisies sont conservées sur l\'appareil et remontent d\'elles-mêmes dès qu\'une connexion réapparaît, sans que l\'utilisateur ait à y penser.',
      },
      {
        title: 'Ce que le mobile fait gagner concrètement',
        body: 'Le bénéfice se mesure en ressaisies supprimées et en erreurs évitées :',
        bullets: [
          'Enregistrement des interventions à la parcelle, daté et géolocalisé automatiquement',
          'Contrôle qualité en réception, avec photographies jointes à la fiche du lot',
          'Suivi des caisses et des palettes par code-barres, du champ jusqu\'à l\'expédition',
          'Information disponible au siège immédiatement, sans attendre la remontée des fiches papier',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application mobile de terrain à Agadir ?',
        a: 'À partir de 35 000 MAD HT. Pour un usage strictement interne, une web app installable sur vos propres appareils revient moins cher, évite la publication sur les stores et conserve le fonctionnement hors ligne — c\'est ce que nous recommandons dans la plupart des cas agricoles.',
      },
      {
        q: 'Que se passe-t-il si le téléphone n\'a pas de réseau en parcelle ?',
        a: 'Rien ne s\'arrête. Les saisies sont enregistrées localement et synchronisées automatiquement au retour du réseau, avec un indicateur d\'état visible par l\'utilisateur. Ce fonctionnement doit être prévu dès la conception : le greffer ensuite revient à reconstruire l\'application.',
      },
    ],
  },

  'agadir/site-e-commerce': {
    h1: 'Création de site e-commerce à Agadir',
    seoTitle: 'Création de Site E-commerce à Agadir — Terroir & Export | SWIVIQ',
    seoDesc: 'Boutiques en ligne à Agadir : produits du terroir, argan, coopératives, vente directe et export. Multilingue et multidevise. À partir de 18 000 MAD HT.',
    intro: 'Le Souss produit des biens que le monde entier achète — argan, agrumes, produits de la mer — mais qui partent le plus souvent en vrac, sans marque et sans marge. La vente en ligne directe est l\'un des rares leviers pour capter une part de la valeur créée en aval.',
    sections: [
      {
        title: 'Vendre sous sa propre marque, pas en vrac',
        body: 'Passer de la vente au négociant à la vente au consommateur final change tout : il faut une marque, un conditionnement, une histoire vérifiable et une logistique adaptée aux petits colis. La boutique n\'est que la partie visible de cette transformation. Nous cadrons ce que le site doit porter — origine, certifications, coopérative, traçabilité — car c\'est précisément ce que l\'acheteur final paie plus cher.',
      },
      {
        title: 'Contraintes propres aux produits alimentaires',
        body: 'Vendre de l\'alimentaire en ligne impose des règles que les autres catalogues ignorent :',
        bullets: [
          'Dates de péremption et numéros de lot suivis jusqu\'à la commande client',
          'Mentions réglementaires obligatoires : composition, allergènes, conditions de conservation',
          'Emballage et expédition adaptés, avec délais compatibles avec la nature du produit',
          'Certifications affichées et vérifiables — biologique, appellation, label coopérative',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une boutique en ligne à Agadir ?',
        a: 'À partir de 18 000 MAD HT pour une boutique sur mesure. Pour l\'export, ajoutez le multilingue, l\'affichage multidevise et le calcul des frais de port par destination : ces options apparaissent ligne par ligne dans le devis PDF généré par notre simulateur.',
      },
      {
        q: 'Gérez-vous les numéros de lot et les dates de péremption ?',
        a: 'Oui, lorsque le projet le nécessite. Chaque commande peut être rattachée aux lots expédiés, ce qui permet de retrouver les clients concernés en cas de rappel produit. C\'est une exigence courante à l\'export et elle doit être prévue au cadrage, car elle structure la conception du catalogue.',
      },
    ],
  },

  /* ============================ KÉNITRA ============================ */
  'kenitra/application-web': {
    h1: 'Développement d\'application web sur mesure à Kénitra',
    seoTitle: 'Développement d\'Application Web à Kénitra — Industrie & PME | SWIVIQ',
    seoDesc: 'Applications web métier à Kénitra : suivi de production, non-conformités, gestion PME. Agence à 40 minutes, basée à Rabat. À partir de 25 000 MAD HT.',
    intro: 'Kénitra est à quarante minutes de nos bureaux, ce qui rend possible un mode de travail que la distance interdit ailleurs : venir voir, plusieurs fois, avant et pendant le développement. Sur les projets industriels, cette possibilité vaut mieux que n\'importe quelle spécification écrite.',
    sections: [
      {
        title: 'Cadrer au poste de travail',
        body: 'Un cahier des charges rédigé en salle de réunion décrit le processus tel qu\'il devrait être. Le poste de travail montre le processus tel qu\'il est — avec ses contournements, ses fiches annotées à la main et ses règles que personne n\'a écrites. Nous cadrons donc sur place, auprès des personnes qui saisiront réellement les données. C\'est ce qui évite de découvrir en recette qu\'un cas quotidien n\'a pas été prévu.',
      },
      {
        title: 'Répondre au donneur d\'ordre sans ERP complet',
        body: 'Un sous-traitant de rang 2 subit des exigences dimensionnées pour de grands groupes :',
        bullets: [
          'Enregistrements et exports conformes aux attentes du client, sans déployer un ERP entier',
          'Suivi des non-conformités et des actions correctives, avec historique opposable',
          'Budget calibré pour une PME, avec une première version délibérément resserrée',
          'Extension par étapes, chaque phase étant financée par le gain de la précédente',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application métier à Kénitra ?',
        a: 'À partir de 25 000 MAD HT. Notre grille est nationale et ne varie pas selon la ville. Pour une première informatisation, nous conseillons de limiter le périmètre initial au processus le plus coûteux, quitte à étendre ensuite — c\'est ce qui fait la différence entre un outil adopté et un projet abandonné.',
      },
      {
        q: 'Vous déplacez-vous facilement à Kénitra ?',
        a: 'Oui, très facilement : quarante minutes depuis Rabat. C\'est l\'une des villes où nous intervenons le plus volontiers sur site, en particulier pour les projets industriels dont le cadrage exige de voir les postes de travail réels.',
      },
    ],
  },

  'kenitra/application-mobile': {
    h1: 'Développement d\'application mobile à Kénitra',
    seoTitle: 'Développement d\'Application Mobile à Kénitra — Atelier & Stock | SWIVIQ',
    seoDesc: 'Applications mobiles à Kénitra : saisie au poste, inventaire, contrôle qualité, codes-barres. Agence basée à Rabat, à 40 minutes. À partir de 35 000 MAD HT.',
    intro: 'Les applications mobiles que nous développons pour Kénitra équipent des opérateurs et des magasiniers. Elles remplacent des fiches papier recopiées le soir dans un tableur — une double saisie qui coûte du temps et introduit des erreurs que personne ne détecte avant l\'inventaire.',
    sections: [
      {
        title: 'Supprimer la double saisie, pas l\'ajouter',
        body: 'Le test d\'une application industrielle est simple : l\'opérateur travaille-t-il plus vite qu\'avant ? Si la saisie mobile s\'ajoute au papier au lieu de le remplacer, l\'outil sera contourné en quinze jours. Nous concevons donc pour que l\'enregistrement mobile soit strictement plus rapide que la fiche qu\'il remplace — codes-barres partout où c\'est possible, valeurs par défaut intelligentes, et aucun champ dont personne ne se sert.',
      },
      {
        title: 'Inventaire et mouvements de stock',
        body: 'C\'est l\'usage qui rentabilise le plus vite un projet mobile en PME industrielle :',
        bullets: [
          'Inventaire au code-barres, réalisé en une fraction du temps d\'un comptage manuel',
          'Entrées et sorties enregistrées au moment du mouvement, pas en fin de journée',
          'Écarts détectés immédiatement, quand ils sont encore explicables',
          'Fonctionnement hors ligne dans les zones de stockage mal couvertes par le réseau',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application mobile à Kénitra ?',
        a: 'À partir de 35 000 MAD HT sur iOS et Android. Pour un usage interne sur des appareils de l\'entreprise, une web app installable revient moins cher, évite les stores et conserve le mode hors ligne — c\'est la solution la plus fréquente en contexte industriel.',
      },
      {
        q: 'Faut-il acheter des terminaux spécifiques ?',
        a: 'Pas nécessairement. Un smartphone Android d\'entrée de gamme avec une coque renforcée suffit dans la majorité des cas, la caméra servant de lecteur de codes-barres. Les terminaux durcis ne se justifient qu\'en environnement très exigeant — poussière, chocs, températures extrêmes. Nous en discutons au cadrage, chiffres à l\'appui.',
      },
    ],
  },

  'kenitra/site-e-commerce': {
    h1: 'Création de site e-commerce à Kénitra',
    seoTitle: 'Création de Site E-commerce à Kénitra — Boutique en Ligne | SWIVIQ',
    seoDesc: 'Boutiques en ligne à Kénitra : catalogue, paiement CMI, livraison régionale, click & collect. Site e-commerce sur mesure à partir de 18 000 MAD HT.',
    intro: 'Le e-commerce kénitri s\'adresse d\'abord à un marché de proximité : la ville, sa région, l\'axe vers Rabat. C\'est un avantage réel — la livraison est courte, le retour client est rapide — à condition de ne pas construire une boutique dimensionnée pour un marché national qu\'on n\'a pas.',
    sections: [
      {
        title: 'Jouer la proximité plutôt que l\'ambition nationale',
        body: 'Une boutique qui livre en quelques heures dans sa propre ville dispose d\'un argument que les grandes plateformes ne peuvent pas égaler. Encore faut-il l\'assumer dans la conception : zones de livraison affichées clairement, créneaux réels, retrait en magasin mis en avant. Nous préférons une boutique qui excelle sur son bassin plutôt qu\'une vitrine nationale qui promet partout et déçoit à chaque commande lointaine.',
      },
      {
        title: 'Se faire trouver localement',
        body: 'Le référencement local pèse davantage que le référencement national pour ce type de boutique :',
        bullets: [
          'Pages construites sur les recherches réellement locales, mentionnant la ville et la zone desservie',
          'Fiche Google Business Profile cohérente avec le site : mêmes nom, adresse et téléphone',
          'Données structurées indiquant la zone de livraison et les horaires effectifs',
          'Avis clients affichés sur le site autant que sur les plateformes tierces',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une boutique en ligne à Kénitra ?',
        a: 'À partir de 18 000 MAD HT : catalogue, panier, paiement, gestion des commandes et back-office. Le paiement CMI, le click & collect et la maintenance annuelle sont chiffrés en options dans le devis PDF produit par notre simulateur en deux minutes.',
      },
      {
        q: 'Peut-on limiter la livraison à notre zone ?',
        a: 'Oui, et c\'est souvent la bonne décision au démarrage. Vous définissez les zones réellement desservies, avec leurs frais et leurs délais propres ; les commandes hors zone sont soit refusées, soit dirigées vers un transporteur avec un délai annoncé honnêtement. Mieux vaut restreindre que décevoir.',
      },
    ],
  },

  /* ============================= OUJDA ============================= */
  'oujda/application-web': {
    h1: 'Développement d\'application web sur mesure à Oujda',
    seoTitle: 'Développement d\'Application Web à Oujda — Sur Mesure | SWIVIQ',
    seoDesc: 'Applications web métier à Oujda et dans l\'Oriental : cabinets, cliniques, centres de formation, PME. Projet mené à distance. À partir de 25 000 MAD HT.',
    intro: 'Dans l\'Oriental, les structures qui nous consultent — cabinets, cliniques privées, centres de formation, PME de services — cherchent un niveau technique qu\'elles peinent à trouver localement, sans payer le déplacement d\'une agence de l\'axe Rabat-Casablanca. Nous répondons par un mode de travail à distance assumé et cadré.',
    sections: [
      {
        title: 'Gérer des rendez-vous, des dossiers et des accès',
        body: 'Le besoin le plus fréquent que nous rencontrons ici combine trois éléments : un agenda partagé qui ne se contredit jamais, un dossier par client, patient ou apprenant, et un contrôle strict de qui accède à quoi. Ces applications manipulent souvent des données sensibles, ce qui impose des habilitations réelles et une journalisation des consultations — pas seulement un mot de passe à l\'entrée.',
      },
      {
        title: 'Comment nous travaillons à distance',
        body: 'La distance se compense par la cadence et la transparence, pas par la bonne volonté :',
        bullets: [
          'Un point vidéo hebdomadaire à horaire fixe, tenu du début à la fin du projet',
          'Une version consultable en ligne dès les premières semaines, mise à jour en continu',
          'Chaque décision tracée par écrit, pour qu\'aucun arbitrage ne se perde',
          'Formation en visioconférence enregistrée, que vous conservez pour vos futurs arrivants',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application web à Oujda ?',
        a: 'À partir de 25 000 MAD HT, exactement comme partout ailleurs au Maroc : notre grille est nationale et ne comporte aucune majoration régionale. Seuls d\'éventuels déplacements sur site, si vous en souhaitez, apparaissent séparément dans le devis.',
      },
      {
        q: 'Un projet mené entièrement à distance peut-il aboutir ?',
        a: 'Oui, à condition d\'imposer une cadence. Point vidéo hebdomadaire à horaire fixe, version consultable en ligne dès les premières semaines, décisions tracées par écrit : c\'est cette discipline qui fait aboutir un projet, davantage que la proximité géographique. Nous nous déplaçons néanmoins lorsque le projet le justifie vraiment.',
      },
    ],
  },

  'oujda/application-mobile': {
    h1: 'Développement d\'application mobile à Oujda',
    seoTitle: 'Développement d\'Application Mobile à Oujda — iOS & Android | SWIVIQ',
    seoDesc: 'Applications mobiles à Oujda : prise de rendez-vous, suivi des apprenants, notifications. iOS et Android, français et arabe. À partir de 35 000 MAD HT.',
    intro: 'À Oujda, les projets mobiles que nous accompagnons visent le plus souvent à joindre un public déjà acquis — patients d\'une clinique, apprenants d\'un centre, adhérents d\'une structure — plutôt qu\'à conquérir un marché. Cela simplifie beaucoup le projet : les utilisateurs sont connus et identifiables.',
    sections: [
      {
        title: 'Un public captif change l\'économie du projet',
        body: 'Quand vous connaissez vos utilisateurs, vous n\'avez pas à acheter leur attention : vous leur communiquez directement l\'application. Le poste d\'acquisition, souvent le plus lourd d\'un projet mobile grand public, disparaît presque entièrement. Le budget se concentre alors sur ce qui sert réellement — la fiabilité, la clarté et l\'utilité quotidienne de l\'outil.',
      },
      {
        title: 'Rendez-vous et rappels : le cas le plus fréquent',
        body: 'La prise de rendez-vous mobile résout un problème très concret et mesurable :',
        bullets: [
          'Réservation de créneau en autonomie, sans appel téléphonique',
          'Rappels automatiques qui font baisser nettement le taux d\'absence',
          'Annulation et report par l\'utilisateur, libérant le créneau immédiatement',
          'Historique consultable côté praticien ou formateur, sans ressaisie',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une application mobile à Oujda ?',
        a: 'À partir de 35 000 MAD HT sur iOS et Android, sans majoration liée à la distance. Si votre public est déjà connu et joignable, une web app installable diffusée par lien ou QR code suffit souvent, pour un coût sensiblement inférieur.',
      },
      {
        q: 'Gérez-vous le français et l\'arabe ?',
        a: 'Oui, en standard, avec l\'écriture droite-à-gauche pour l\'arabe : la navigation et les écrans sont mis en miroir, ce n\'est pas une simple traduction posée sur une interface française. L\'anglais peut être ajouté si votre public le justifie.',
      },
    ],
  },

  'oujda/site-e-commerce': {
    h1: 'Création de site e-commerce à Oujda',
    seoTitle: 'Création de Site E-commerce à Oujda — Boutique en Ligne | SWIVIQ',
    seoDesc: 'Boutiques en ligne à Oujda et dans l\'Oriental : catalogue, paiement CMI, paiement à la livraison, livraison régionale. À partir de 18 000 MAD HT.',
    intro: 'Ouvrir une boutique en ligne depuis Oujda pose une question que les commerçants de l\'axe Rabat-Casablanca ne se posent pas : jusqu\'où livrer, et à quel coût ? La réponse structure le projet bien plus que le choix des couleurs ou du catalogue.',
    sections: [
      {
        title: 'Décider sa zone avant de construire sa boutique',
        body: 'Vendre à tout le Maroc depuis l\'Oriental suppose des frais et des délais d\'expédition supérieurs à ceux d\'un concurrent casablancais. Deux stratégies fonctionnent, et il faut en choisir une : dominer le marché régional avec une livraison rapide et peu coûteuse, ou vendre national sur des produits à forte valeur qui absorbent le transport. La pire décision consiste à ne pas trancher et à afficher des frais qui font fuir sur un produit banal.',
      },
      {
        title: 'Le paiement à la livraison, sérieusement traité',
        body: 'Dominant sur ce marché, il exige une gestion rigoureuse pour ne pas coûter plus qu\'il ne rapporte :',
        bullets: [
          'Confirmation de la commande avant expédition, pour réduire les refus à la livraison',
          'Suivi des sommes encaissées par le transporteur et rapprochement automatique',
          'Détection des clients à refus répétés, pour exiger un prépaiement au-delà d\'un seuil',
          'Coexistence avec le paiement par carte CMI, le client choisissant au moment de commander',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une boutique en ligne à Oujda ?',
        a: 'À partir de 18 000 MAD HT, sans majoration régionale : catalogue, panier, paiement, gestion des commandes et back-office. Le paiement CMI, le multilingue et la maintenance annuelle sont chiffrés en options dans le devis PDF détaillé.',
      },
      {
        q: 'Le paiement à la livraison est-il rentable depuis l\'Oriental ?',
        a: 'Il l\'est si les refus sont maîtrisés, car un colis refusé fait payer deux transports sans aucune vente. Nous intégrons donc une confirmation de commande avant expédition et un suivi des refus par client, ce qui permet d\'exiger un prépaiement au-delà d\'un certain seuil. Sans ces garde-fous, la marge est absorbée par la logistique.',
      },
    ],
  },
};
