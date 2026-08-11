/**
 * Pages comparatives (français).
 *
 * OBJECTIF — capter les requêtes de comparaison (« sur mesure ou Shopify »,
 * « agence ou freelance »), émises par des visiteurs déjà en phase de
 * décision, donc bien plus proches de l'achat qu'un lecteur d'article.
 *
 * RÈGLE D'HONNÊTETÉ — le tableau doit donner de vrais points à l'option que
 * nous ne vendons pas. Un comparatif où le sur-mesure gagne sur chaque
 * critère ne convainc personne, se fait démonter par le premier concurrent
 * et n'est jamais cité par les moteurs IA, qui privilégient les sources
 * équilibrées. Chaque page se termine donc par une recommandation qui
 * désigne explicitement les cas où il ne faut PAS nous choisir.
 */

export interface ComparisonRow {
  criterion: string;
  a: string;
  b: string;
  /** Qui l'emporte sur ce critère précis. */
  winner: 'a' | 'b' | 'tie';
}

export interface Comparison {
  slug: string;
  title: string;
  seoTitle: string;
  seoDesc: string;
  optionA: string;
  optionB: string;
  excerpt: string;
  intro: string;
  rows: ComparisonRow[];
  sections: { title: string; body: string; bullets?: string[] }[];
  /** Recommandation franche, y compris contre notre propre offre. */
  verdict: { chooseA: string; chooseB: string };
  faq: { q: string; a: string }[];
  relatedServices: string[];
}

export const COMPARISONS: Comparison[] = [

  {
    slug: 'site-sur-mesure-ou-shopify',
    title: 'Site e-commerce sur mesure ou Shopify ?',
    seoTitle: 'E-commerce sur Mesure ou Shopify au Maroc ? Comparatif 2026 | SWIVIQ',
    seoDesc: 'Shopify ou boutique sur mesure au Maroc ? Comparatif honnête : coûts réels, paiement CMI, personnalisation, dépendance. Notre recommandation selon votre situation.',
    optionA: 'Boutique sur mesure',
    optionB: 'Shopify',
    excerpt:
      'Shopify est plus rapide à lancer et moins cher au départ. Le sur-mesure devient plus intéressant dès que vos processus sortent de l\'ordinaire ou que votre volume rend l\'abonnement coûteux.',
    intro:
      'Les deux réponses sont légitimes, et le choix dépend surtout d\'un facteur : votre activité entre-t-elle dans un moule standard ? Si oui, une plateforme du marché comme Shopify vous fera gagner du temps et de l\'argent, et nous vous le dirons. Si votre logistique, votre tarification ou votre facturation sortent de l\'ordinaire, chaque contournement finira par coûter plus cher que le développement que vous cherchiez à éviter.',
    rows: [
      { criterion: 'Coût de départ', a: 'À partir de 18 000 MAD HT', b: 'Très faible — abonnement mensuel et thème', winner: 'b' },
      { criterion: 'Coût sur 3 ans à fort volume', a: 'Hébergement et maintenance uniquement', b: 'Abonnement + commissions sur ventes, croissant avec le chiffre d\'affaires', winner: 'a' },
      { criterion: 'Délai de mise en ligne', a: '4 à 8 semaines', b: 'Quelques jours', winner: 'b' },
      { criterion: 'Paiement CMI', a: 'Intégré nativement', b: 'Dépend des connecteurs disponibles, à vérifier au cas par cas', winner: 'a' },
      { criterion: 'Facturation conforme au Maroc (ICE, IF, TVA)', a: 'Conçue pour', b: 'Nécessite une extension ou un traitement externe', winner: 'a' },
      { criterion: 'Processus métier hors normes', a: 'Sans limite — c\'est l\'objet même du sur-mesure', b: 'Bloqué par ce que la plateforme autorise', winner: 'a' },
      { criterion: 'Maintenance technique', a: 'À votre charge, via un prestataire', b: 'Assurée par la plateforme', winner: 'b' },
      { criterion: 'Écosystème d\'extensions', a: 'À développer', b: 'Très riche, immédiatement disponible', winner: 'b' },
      { criterion: 'Propriété et portabilité', a: 'Code et données vous appartiennent', b: 'Dépendance à la plateforme et à ses évolutions tarifaires', winner: 'a' },
      { criterion: 'Référencement', a: 'Contrôle total, rendu serveur', b: 'Correct, mais contraint par le cadre de la plateforme', winner: 'a' },
    ],
    sections: [
      {
        title: 'Le calcul qui change tout : le coût sur trois ans',
        body: 'Comparer un abonnement mensuel à un investissement initial n\'a de sens que sur la durée. Une plateforme coûte peu au démarrage puis prélève chaque mois, avec des commissions qui augmentent mécaniquement avec votre chiffre d\'affaires. Le sur-mesure coûte davantage au départ puis se limite à l\'hébergement et à la maintenance. Le point de bascule dépend de votre volume : en dessous, la plateforme reste plus économique ; au-dessus, l\'écart s\'inverse et se creuse.',
      },
      {
        title: 'Les contraintes marocaines pèsent dans la balance',
        body: 'Une plateforme internationale est pensée pour les usages dominants de ses principaux marchés, qui ne sont pas les nôtres :',
        bullets: [
          'Le paiement à la livraison, majoritaire au Maroc, est traité comme un cas marginal',
          'La facturation aux normes marocaines — ICE, IF, RC, numérotation continue — demande une adaptation',
          'Le CMI n\'est pas un moyen de paiement natif pour ces plateformes',
          'Les zones et délais de livraison propres au Maroc se paramètrent parfois mal',
        ],
      },
      {
        title: 'Ce que le sur-mesure ne résout pas',
        body: 'Autant le dire clairement : le sur-mesure ne vous apportera pas de clients. Si votre difficulté est de vendre, pas de gérer, alors investir dans du développement ne résoudra rien — et une plateforme standard vous laissera davantage de budget pour l\'acquisition. Le sur-mesure répond à un problème d\'inadéquation entre l\'outil et vos processus, pas à un problème commercial.',
      },
    ],
    verdict: {
      chooseB:
        'Choisissez Shopify si vous démarrez, si votre catalogue est classique, si vos processus entrent dans un cadre standard, ou si votre priorité est de tester un marché rapidement avec un budget serré. C\'est la décision rationnelle dans ce cas, et nous vous le dirons plutôt que de vous vendre un développement.',
      chooseA:
        'Choisissez le sur-mesure si votre volume rend les commissions douloureuses, si votre tarification ou votre logistique sortent du cadre standard, si vous avez besoin d\'une facturation marocaine irréprochable, ou si la boutique doit se connecter à vos outils internes existants.',
    },
    faq: [
      {
        q: 'Shopify fonctionne-t-il bien au Maroc ?',
        a: 'La plateforme fonctionne, mais deux points demandent une vérification préalable : la disponibilité d\'un connecteur pour le paiement CMI, et la conformité de la facturation aux mentions légales marocaines. Ce sont les deux sujets sur lesquels les commerçants marocains rencontrent le plus de contournements.',
      },
      {
        q: 'Peut-on migrer de Shopify vers une boutique sur mesure ?',
        a: 'Oui. Le catalogue, les clients et l\'historique des commandes sont exportables, et la migration est une opération courante. Le point de vigilance est le référencement : si les adresses des fiches produits changent, un plan de redirection complet est indispensable pour ne pas perdre le trafic acquis.',
      },
      {
        q: 'Combien coûte une boutique sur mesure au Maroc ?',
        a: 'À partir de 18 000 MAD HT : catalogue, panier, paiement, gestion des commandes et back-office. Le paiement CMI, le multilingue et la maintenance annuelle sont des options chiffrées séparément. Notre simulateur produit un devis PDF détaillé en deux minutes.',
      },
    ],
    relatedServices: ['ecommerce'],
  },

  {
    slug: 'agence-ou-freelance',
    title: 'Agence ou freelance : que choisir pour son projet ?',
    seoTitle: 'Agence ou Freelance au Maroc ? Comparatif Honnête 2026 | SWIVIQ',
    seoDesc: 'Agence ou développeur freelance pour votre projet au Maroc ? Comparatif des coûts, risques, délais et garanties. Notre recommandation selon la taille du projet.',
    optionA: 'Agence',
    optionB: 'Freelance',
    excerpt:
      'Un freelance coûte moins cher et convient parfaitement aux projets courts. L\'agence se justifie dès que le projet doit survivre au départ de la personne qui l\'a écrit.',
    intro:
      'La vraie question n\'est pas le prix journalier, c\'est le risque de continuité. Un bon freelance produit un travail d\'excellente qualité pour un coût inférieur. Mais il tombe malade, change de mission, ou devient indisponible au moment précis où votre outil de production s\'arrête. Sur un site vitrine, ce risque est acceptable. Sur une application dont dépend votre activité quotidienne, il ne l\'est pas.',
    rows: [
      { criterion: 'Coût', a: 'Plus élevé — structure, gestion, garanties', b: 'Nettement inférieur à prestation équivalente', winner: 'b' },
      { criterion: 'Souplesse et réactivité', a: 'Cadre plus formel', b: 'Très souple, décisions immédiates', winner: 'b' },
      { criterion: 'Continuité en cas d\'indisponibilité', a: 'Équipe : le projet continue', b: 'Point de rupture unique', winner: 'a' },
      { criterion: 'Pluralité des compétences', a: 'Développement, design, référencement, hébergement', b: 'Une spécialité, parfois deux', winner: 'a' },
      { criterion: 'Garanties contractuelles', a: 'Société, contrat, facturation avec TVA, recours', b: 'Variable selon le statut du prestataire', winner: 'a' },
      { criterion: 'Adapté aux petits projets', a: 'Coût de structure difficile à amortir', b: 'Excellent rapport qualité-prix', winner: 'b' },
      { criterion: 'Maintenance sur plusieurs années', a: 'Engagement de continuité', b: 'Dépend de la disponibilité future d\'une personne', winner: 'a' },
      { criterion: 'Marchés publics et grands comptes', a: 'Pièces administratives complètes', b: 'Souvent bloquant selon le statut', winner: 'a' },
    ],
    sections: [
      {
        title: 'Le vrai critère : que se passe-t-il dans deux ans ?',
        body: 'Un projet ne s\'arrête pas à la livraison. Deux ans plus tard, il faudra corriger un défaut, ajouter une fonctionnalité, ou simplement mettre à jour des composants devenus obsolètes. La question à poser avant de signer est simple : si la personne qui a écrit ce code n\'est plus joignable, qui peut reprendre ? La réponse dépend moins du statut du prestataire que de deux choses concrètes — le code est-il documenté, et vous a-t-il été livré ?',
      },
      {
        title: 'Ce qu\'il faut exiger dans les deux cas',
        body: 'Ces exigences ne relèvent pas du statut du prestataire, mais du sérieux du contrat :',
        bullets: [
          'La propriété du code source, écrite noir sur blanc, et son dépôt sur un compte qui vous appartient',
          'Les accès à l\'hébergement, au nom de domaine et aux comptes stores, à votre nom et non à celui du prestataire',
          'Une documentation technique minimale permettant à un tiers de reprendre le travail',
          'Des conditions de maintenance explicites : délai d\'intervention, périmètre, tarif',
        ],
      },
      {
        title: 'La solution intermédiaire qu\'on oublie',
        body: 'Il existe une troisième voie rarement envisagée : confier le développement initial à un freelance compétent, puis la maintenance à une structure. Elle fonctionne bien à une condition stricte — que le code ait été livré propre et documenté dès le départ. C\'est précisément pour cela que les exigences ci-dessus se négocient avant de signer, quand vous avez encore un moyen de pression, et non au moment de la livraison.',
      },
    ],
    verdict: {
      chooseB:
        'Choisissez un freelance pour un site vitrine, une landing page, une mission ponctuelle ou un budget serré — à condition d\'exiger le code source et les accès à votre nom. Sur ces projets, l\'écart de prix est réel et le risque de discontinuité reste supportable.',
      chooseA:
        'Choisissez une agence si l\'outil est critique pour votre activité, s\'il doit vivre plusieurs années, s\'il mêle plusieurs métiers, ou si vous répondez à des marchés exigeant des pièces administratives complètes.',
    },
    faq: [
      {
        q: 'Un freelance est-il moins cher qu\'une agence au Maroc ?',
        a: 'Oui, à prestation équivalente, généralement de façon sensible : il n\'a ni frais de structure ni charges de gestion à répercuter. L\'écart se justifie par ce que l\'agence apporte en contrepartie — continuité en cas d\'indisponibilité, pluralité de compétences, garanties contractuelles.',
      },
      {
        q: 'Comment se protéger du départ d\'un prestataire ?',
        a: 'Trois exigences, à poser avant de signer : la propriété du code source écrite au contrat, le dépôt du code sur un compte qui vous appartient, et tous les accès — hébergement, domaine, comptes stores — à votre nom. Un prestataire sérieux les accepte sans discuter ; un refus est en soi une réponse.',
      },
      {
        q: 'Peut-on commencer avec un freelance puis passer à une agence ?',
        a: 'Oui, et c\'est même une trajectoire fréquente. Elle suppose que le code ait été livré propre et documenté. Sinon, la reprise coûte parfois plus cher que la reconstruction — nous commençons donc toujours par un audit technique avant de nous engager sur un projet existant.',
      },
    ],
    relatedServices: ['web-app', 'conseil'],
  },

  {
    slug: 'application-native-ou-web-app',
    title: 'Application native ou web app : que choisir ?',
    seoTitle: 'Application Native ou Web App ? Comparatif et Coûts 2026 | SWIVIQ',
    seoDesc: 'Application native iOS/Android ou web app installable ? Comparatif des coûts, performances, mises à jour et distribution. Notre recommandation selon votre usage.',
    optionA: 'Application native',
    optionB: 'Web app installable',
    excerpt:
      'Une web app installable suffit dans la majorité des cas et coûte sensiblement moins cher. Le natif se justifie pour les capacités profondes du téléphone et la visibilité sur les stores.',
    intro:
      'Beaucoup de projets financent une application native pour un usage qu\'une web app installable aurait couvert à une fraction du prix. La web app s\'ouvre depuis un lien ou un QR code, s\'ajoute à l\'écran d\'accueil, fonctionne hors ligne et se met à jour sans passer par les stores. La question à trancher n\'est donc pas « native ou pas », mais : avez-vous réellement besoin de ce que seul le natif apporte ?',
    rows: [
      { criterion: 'Coût de développement', a: 'À partir de 35 000 MAD HT', b: 'Sensiblement inférieur', winner: 'b' },
      { criterion: 'Distribution', a: 'App Store et Google Play — visibilité et crédibilité', b: 'Lien ou QR code, sans présence sur les stores', winner: 'a' },
      { criterion: 'Mises à jour', a: 'Soumises à validation, adoption progressive', b: 'Immédiates pour tous les utilisateurs', winner: 'b' },
      { criterion: 'Notifications poussées', a: 'Complètes sur iOS et Android', b: 'Fonctionnelles, avec des limites sur iOS', winner: 'a' },
      { criterion: 'Accès aux capteurs et au matériel', a: 'Total — Bluetooth, NFC, capteurs avancés', b: 'Partiel', winner: 'a' },
      { criterion: 'Fonctionnement hors ligne', a: 'Complet', b: 'Complet pour la plupart des usages', winner: 'tie' },
      { criterion: 'Performances graphiques', a: 'Supérieures — indispensable pour le jeu ou la 3D', b: 'Suffisantes pour une application de gestion', winner: 'a' },
      { criterion: 'Frais récurrents', a: 'Comptes développeur Apple et Google à renouveler', b: 'Hébergement seul', winner: 'b' },
      { criterion: 'Délai de mise à disposition', a: 'Validation des stores à prévoir', b: 'Disponible dès la mise en ligne', winner: 'b' },
      { criterion: 'Référencement Google', a: 'Contenu invisible pour le moteur', b: 'Indexable comme un site', winner: 'b' },
    ],
    sections: [
      {
        title: 'Le test en trois questions',
        body: 'Avez-vous besoin d\'être trouvé sur les stores, parce que c\'est là que vos utilisateurs chercheront ? Avez-vous besoin de notifications poussées critiques sur iPhone ? Avez-vous besoin d\'accéder au Bluetooth, au NFC ou à des capteurs avancés ? Si vous répondez non aux trois, la web app suffit — et l\'écart de budget peut être investi dans ce qui fera réellement la différence : le contenu, le service, ou l\'acquisition d\'utilisateurs.',
      },
      {
        title: 'Les cas où le natif s\'impose vraiment',
        body: 'Il ne s\'agit pas de préférence mais de faisabilité technique :',
        bullets: [
          'Application grand public dont la découverte passe par les stores',
          'Notifications critiques sur iPhone, où les limites de la web app deviennent gênantes',
          'Usage intensif du matériel : Bluetooth, NFC, capteurs, traitement d\'image poussé',
          'Jeux et applications à forte exigence graphique',
        ],
      },
      {
        title: 'Les cas où la web app est le meilleur choix',
        body: 'Ce sont, en pratique, la majorité des projets d\'entreprise que nous rencontrons :',
        bullets: [
          'Outil interne destiné à des équipes connues — aucun besoin de présence sur les stores',
          'Application client d\'un hôtel ou d\'un service, distribuée par QR code sur place',
          'Application métier de saisie et de consultation, même avec fonctionnement hors ligne',
          'Validation d\'un marché avant d\'engager le budget d\'un développement natif',
        ],
      },
    ],
    verdict: {
      chooseA:
        'Choisissez le natif si votre application s\'adresse au grand public et doit être trouvée sur les stores, si elle dépend de notifications critiques sur iPhone, ou si elle exploite le matériel du téléphone en profondeur.',
      chooseB:
        'Choisissez la web app installable pour un outil interne, une application distribuée à un public déjà identifié, ou pour valider un marché avant d\'investir davantage. C\'est ce que nous recommandons dans la majorité des projets d\'entreprise.',
    },
    faq: [
      {
        q: 'Une web app peut-elle fonctionner sans connexion internet ?',
        a: 'Oui. Une web app installable met en cache ses ressources et peut enregistrer des données localement, puis les synchroniser au retour du réseau. C\'est un usage courant en contexte industriel et agricole, à condition de le prévoir dès la conception.',
      },
      {
        q: 'Une web app peut-elle envoyer des notifications ?',
        a: 'Oui sur Android, où le fonctionnement est proche du natif. Sur iPhone, les notifications web fonctionnent également mais avec davantage de limites et une installation préalable de l\'application sur l\'écran d\'accueil. Si les notifications sont au cœur de votre service et que votre public est majoritairement sur iPhone, le natif reste plus sûr.',
      },
      {
        q: 'Combien coûte une web app par rapport à une application native ?',
        a: 'Une application native démarre à 35 000 MAD HT sur iOS et Android. Une web app installable couvrant le même périmètre fonctionnel revient sensiblement moins cher, puisqu\'il n\'y a qu\'une base de code, pas de validation des stores et pas de comptes développeur à maintenir. Nous chiffrons les deux options au cadrage pour que la comparaison soit factuelle.',
      },
    ],
    relatedServices: ['mobile-app', 'web-app'],
  },
];

export const COMPARISON_SLUGS = COMPARISONS.map(c => c.slug);
export const COMPARISONS_BY_SLUG: Record<string, Comparison> =
  Object.fromEntries(COMPARISONS.map(c => [c.slug, c]));
