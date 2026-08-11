/**
 * Articles du blog (français).
 *
 * OBJECTIF — capter les recherches informationnelles qui précèdent l'achat
 * (« combien coûte une application mobile au Maroc », « quel paiement en
 * ligne au Maroc ») et alimenter les moteurs IA, qui citent volontiers un
 * passage donnant une réponse chiffrée dès les premières lignes.
 *
 * RÈGLE — chaque article répond à sa question dans son premier paragraphe.
 * Un article qui fait attendre sa réponse est résumé par le moteur sans
 * jamais être cité, et abandonné par le lecteur avant le CTA.
 *
 * PRIX — les montants cités doivent rester alignés sur la grille réelle
 * (voir /api/settings/public). Un article qui annonce un prix périmé est
 * pire que pas d'article : il crée une attente que le devis contredit.
 */

export interface ArticleSection {
  title: string;
  body: string;
  bullets?: string[];
}

export interface Article {
  slug: string;
  title: string;
  seoTitle: string;
  seoDesc: string;
  /** ISO — alimente datePublished du schema Article. */
  date: string;
  readingMinutes: number;
  /** Résumé affiché en liste ET en chapô : il porte la réponse principale. */
  excerpt: string;
  intro: string;
  sections: ArticleSection[];
  faq: { q: string; a: string }[];
  /** Slugs de services vers lesquels mailler en fin d'article. */
  relatedServices: string[];
}

export const ARTICLES: Article[] = [

  {
    slug: 'combien-coute-application-mobile-maroc',
    title: 'Combien coûte une application mobile au Maroc ?',
    seoTitle: 'Combien Coûte une Application Mobile au Maroc ? Prix 2026 | SWIVIQ',
    seoDesc: 'Le prix d\'une application mobile au Maroc va de 35 000 à plus de 200 000 MAD HT selon la complexité. Détail des postes de coût, des pièges et des alternatives moins chères.',
    date: '2026-06-12',
    readingMinutes: 7,
    excerpt:
      'Une application mobile au Maroc coûte entre 35 000 et 200 000 MAD HT selon sa complexité. Voici ce qui fait réellement varier ce prix, et pourquoi le développement n\'est jamais le poste le plus coûteux.',
    intro:
      'Au Maroc, le développement d\'une application mobile démarre autour de 35 000 MAD HT pour un périmètre simple et dépasse 200 000 MAD HT pour une application complexe avec back-office, paiement et forte volumétrie. Cette fourchette large n\'est pas de la prudence commerciale : deux applications qui se ressemblent à l\'écran peuvent demander un travail dix fois différent selon ce qu\'il y a derrière.',
    sections: [
      {
        title: 'Ce qui fait vraiment varier le prix',
        body: 'Le nombre d\'écrans est le critère auquel tout le monde pense, et c\'est rarement le bon. Ce qui pèse, c\'est la logique derrière les écrans : une application qui affiche du contenu se développe vite, une application qui gère des transactions, des rôles multiples et des états qui évoluent dans le temps demande un travail sans commune mesure.',
        bullets: [
          'Un back-office d\'administration double fréquemment le périmètre — et il est presque toujours oublié dans les premières estimations',
          'Le paiement en ligne ajoute une intégration, des tests, et une phase de validation bancaire qui échappe à votre calendrier',
          'Le fonctionnement hors ligne est un choix d\'architecture, pas une case à cocher : décidé après coup, il impose une reconstruction',
          'Le multilingue avec arabe en écriture droite-à-gauche se prévoit dès la conception, sous peine de reprendre tous les écrans',
        ],
      },
      {
        title: 'Le développement n\'est pas le poste principal',
        body: 'C\'est le point que les porteurs de projet découvrent trop tard. Pour une application destinée au grand public, le coût d\'acquisition des premiers utilisateurs dépasse fréquemment celui du développement. Une application publiée sans budget de lancement reste invisible, quelle que soit sa qualité technique. À cela s\'ajoutent des coûts récurrents que le devis initial ne couvre pas toujours : comptes développeur Apple et Google, hébergement, maintenance corrective, et mises à jour imposées par les évolutions annuelles d\'iOS et d\'Android.',
      },
      {
        title: 'L\'alternative que nous proposons souvent',
        body: 'Avant de financer une application native, il existe une étape intermédiaire nettement moins coûteuse : la web app installable. Elle s\'ouvre depuis un lien ou un QR code, s\'ajoute à l\'écran d\'accueil du téléphone, fonctionne hors ligne, et se met à jour sans passer par les stores. Elle ne remplace pas le natif quand vous avez besoin des capacités profondes de l\'appareil, mais elle permet de valider un marché avec une fraction du budget — et de financer le natif avec les revenus obtenus plutôt qu\'avec un pari.',
      },
      {
        title: 'Comment lire un devis d\'application mobile',
        body: 'Un devis sérieux se distingue à quelques signes concrets, indépendamment du prestataire :',
        bullets: [
          'Le back-office est chiffré explicitement, ou son absence est écrite noir sur blanc',
          'La propriété du code source et des comptes stores est mentionnée — ils doivent être à votre nom',
          'La maintenance après livraison est chiffrée séparément, pas laissée dans le flou',
          'Les hypothèses sont écrites : nombre d\'écrans, rôles, langues, volumétrie attendue',
        ],
      },
    ],
    faq: [
      {
        q: 'Quel est le prix minimum d\'une application mobile au Maroc ?',
        a: 'Comptez 35 000 MAD HT pour une application mobile professionnelle déployée sur iOS et Android, avec tests sur appareils réels et accompagnement à la publication. En dessous de ce montant, il s\'agit généralement d\'un gabarit peu personnalisable, sans back-office, dont le coût réapparaît dès la première évolution demandée.',
      },
      {
        q: 'Combien de temps faut-il pour développer une application mobile ?',
        a: 'Six à douze semaines pour une première version en production sur un périmètre standard, cadrage et tests compris. Les délais annoncés en deux ou trois semaines correspondent presque toujours à un gabarit existant habillé à vos couleurs, ce qui peut convenir — à condition de le savoir avant de signer.',
      },
      {
        q: 'Faut-il développer sur iOS et Android en même temps ?',
        a: 'Oui dans la plupart des cas, car les technologies actuelles permettent de partager l\'essentiel du code entre les deux plateformes : ne cibler qu\'un seul système fait économiser beaucoup moins qu\'on ne l\'imagine, tout en divisant votre audience.',
      },
    ],
    relatedServices: ['mobile-app', 'web-app'],
  },

  {
    slug: 'paiement-en-ligne-maroc',
    title: 'Paiement en ligne au Maroc : quelle solution choisir ?',
    seoTitle: 'Paiement en Ligne au Maroc : CMI, Cash à la Livraison, International | SWIVIQ',
    seoDesc: 'Le CMI reste la passerelle de référence pour encaisser par carte au Maroc, complété par le paiement à la livraison. Comparatif des options, délais d\'activation et pièges.',
    date: '2026-06-28',
    readingMinutes: 6,
    excerpt:
      'Pour encaisser par carte au Maroc, le CMI reste la voie principale, et le paiement à la livraison demeure incontournable. Voici comment les combiner, et ce qu\'il faut anticiper avant de lancer une boutique.',
    intro:
      'Une boutique en ligne marocaine s\'appuie en pratique sur deux moyens d\'encaissement complémentaires : le paiement par carte via le CMI, la passerelle adossée au système bancaire national, et le paiement à la livraison, qui reste dominant dans les habitudes d\'achat. Choisir l\'un contre l\'autre est une erreur : ce sont deux publics différents, et se priver du second revient à écarter une part importante du marché.',
    sections: [
      {
        title: 'Le CMI : la voie principale pour la carte bancaire',
        body: 'Le Centre Monétique Interbancaire est la passerelle par laquelle transitent les paiements par carte des banques marocaines. L\'activation se fait via votre banque, pas via votre développeur : c\'est un contrat commercial que vous signez, avec un dossier à constituer et un délai bancaire qui échappe totalement au calendrier du projet. C\'est la première chose à lancer quand vous démarrez une boutique — et la plus souvent oubliée jusqu\'à la veille du lancement.',
      },
      {
        title: 'Le paiement à la livraison : incontournable, mais à encadrer',
        body: 'Il rassure un acheteur qui ne vous connaît pas encore et reste, de loin, le mode d\'encaissement le plus courant. Il a toutefois un coût réel que beaucoup de boutiques découvrent après coup : un colis refusé fait payer deux transports sans générer la moindre vente. Il se gère donc avec des garde-fous, pas en le cochant simplement dans les réglages.',
        bullets: [
          'Confirmer la commande avant expédition, par appel ou message, pour faire chuter les refus',
          'Suivre les sommes encaissées par le transporteur et les rapprocher automatiquement des commandes',
          'Repérer les clients à refus répétés et exiger un prépaiement au-delà d\'un seuil',
          'Intégrer le coût réel des retours dans la marge, dès le calcul du prix de vente',
        ],
      },
      {
        title: 'Encaisser depuis l\'étranger : vérifier avant de promettre',
        body: 'Si vous visez une clientèle internationale, la question de l\'encaissement en devises se pose. La disponibilité des solutions internationales pour recevoir des fonds au Maroc évolue et dépend de votre statut, de votre banque et de la réglementation des changes. C\'est un point à valider directement avec votre banque avant de vous engager : afficher un prix en euros est simple techniquement, encaisser réellement en euros ne l\'est pas toujours. Nous intégrons ensuite la solution que vous aurez retenue, quelle qu\'elle soit.',
      },
      {
        title: 'Ce qu\'il faut retenir pour votre projet',
        body: 'Dans l\'ordre, sur un lancement de boutique marocaine :',
        bullets: [
          'Lancer le dossier CMI dès le début du projet — le délai bancaire conditionne votre date de mise en ligne',
          'Prévoir le paiement à la livraison, avec confirmation préalable des commandes',
          'Traiter la question des devises avec votre banque avant d\'annoncer quoi que ce soit à vos clients',
          'Vérifier que votre boutique facture conformément : ICE, IF, RC, TVA et numérotation continue',
        ],
      },
    ],
    faq: [
      {
        q: 'Comment activer le paiement CMI sur ma boutique ?',
        a: 'Le contrat se signe entre votre banque et vous : un prestataire technique ne peut pas le souscrire à votre place. Votre développeur prépare le dossier technique, réalise l\'intégration et les tests, puis accompagne la mise en production. Comptez plusieurs semaines de délai bancaire et lancez cette démarche dès le début du projet.',
      },
      {
        q: 'Le paiement à la livraison est-il rentable ?',
        a: 'Il l\'est si les refus sont maîtrisés, car un colis refusé fait supporter deux transports pour zéro vente. Une confirmation de commande avant expédition et un suivi des refus par client suffisent généralement à le rendre rentable. Sans ces garde-fous, la logistique absorbe la marge.',
      },
      {
        q: 'Peut-on vendre à l\'international depuis une boutique marocaine ?',
        a: 'Techniquement oui : affichage multidevise, frais de port par destination et boutique multilingue se mettent en place sans difficulté. L\'encaissement effectif en devises relève en revanche de votre banque et de la réglementation des changes — c\'est le point à valider en premier, avant tout développement.',
      },
    ],
    relatedServices: ['ecommerce', 'web-app'],
  },

  {
    slug: 'site-invisible-google-javascript-ssr',
    title: 'Pourquoi votre site n\'apparaît pas sur Google',
    seoTitle: 'Site Invisible sur Google : le Problème du JavaScript et du SSR | SWIVIQ',
    seoDesc: 'Un site Angular ou React sans rendu côté serveur peut rester invisible sur Google. Explication du problème d\'indexation, méthode de diagnostic et solutions concrètes.',
    date: '2026-07-15',
    readingMinutes: 8,
    excerpt:
      'Si votre site moderne n\'apparaît pas sur Google, la cause la plus fréquente est un contenu généré uniquement par JavaScript dans le navigateur. Voici comment le vérifier en une minute et ce qu\'il faut changer.',
    intro:
      'Un site construit avec Angular, React ou Vue sans rendu côté serveur envoie au robot de Google une page pratiquement vide : tout le contenu est fabriqué ensuite par le JavaScript, dans le navigateur. Google sait exécuter ce JavaScript, mais il le fait plus tard, avec des ressources limitées et sans garantie. Le résultat se voit dans les positions : des pages indexées partiellement, tardivement, ou pas du tout.',
    sections: [
      {
        title: 'Le test en une minute',
        body: 'Nul besoin d\'outil spécialisé pour établir le diagnostic. Ouvrez votre page, affichez le code source de la page — pas l\'inspecteur d\'éléments, qui montre le résultat après exécution du JavaScript, mais bien la source envoyée par le serveur. Cherchez-y une phrase de votre contenu. Si elle ne s\'y trouve pas, Google ne la reçoit pas non plus lors de sa première visite. C\'est ce décalage entre ce que voit l\'utilisateur et ce que reçoit le robot qui explique la majorité des problèmes d\'indexation sur les sites modernes.',
      },
      {
        title: 'Ce que change le rendu côté serveur',
        body: 'Avec le rendu côté serveur, la page HTML complète est fabriquée sur le serveur puis envoyée telle quelle. Le robot reçoit immédiatement le contenu, les titres et les liens, sans dépendre de l\'exécution du JavaScript. Le bénéfice ne se limite pas au référencement :',
        bullets: [
          'Contenu lisible dès la première réponse, par Google comme par les moteurs IA',
          'Premier affichage visible nettement plus rapide, particulièrement sur mobile',
          'Aperçus corrects lors des partages sur les réseaux sociaux et messageries',
          'Les métadonnées — titre, description, données structurées — sont présentes dans la réponse initiale',
        ],
      },
      {
        title: 'Le prérendu, pour les pages qui ne changent pas',
        body: 'Certaines pages n\'ont aucune raison d\'être recalculées à chaque visite : accueil, présentation, pages de services. Elles peuvent être générées une fois au moment de la construction du site et servies comme de simples fichiers. Le gain de vitesse est considérable et la charge serveur quasi nulle. Ce site même fonctionne ainsi : les pages éditoriales sont prérendues, les pages qui dépendent de données vivantes sont rendues à la demande.',
      },
      {
        title: 'Les autres causes fréquentes',
        body: 'Quand le rendu n\'est pas en cause, le problème vient presque toujours de l\'une de ces situations :',
        bullets: [
          'Une balise robots en noindex oubliée après une mise en ligne — vérifiable en quelques secondes',
          'Un robots.txt qui bloque des ressources nécessaires à l\'affichage de la page',
          'Des URL en double sans balise canonique : le site existe à la fois avec et sans www',
          'Un site simplement trop récent — l\'indexation initiale prend souvent plusieurs semaines',
        ],
      },
    ],
    faq: [
      {
        q: 'Google exécute-t-il le JavaScript ?',
        a: 'Oui, mais dans un second temps et avec des ressources limitées. Concrètement, une page dont le contenu dépend entièrement du JavaScript est indexée plus tard, parfois partiellement, et parfois pas du tout. Le rendu côté serveur supprime ce risque en fournissant le contenu dès la première réponse.',
      },
      {
        q: 'Comment savoir si mon site utilise le rendu côté serveur ?',
        a: 'Affichez le code source de la page — pas l\'inspecteur d\'éléments — et cherchez une phrase de votre contenu. Si elle apparaît, le rendu serveur est actif. Si vous ne trouvez qu\'un conteneur vide et des balises de script, votre contenu n\'existe qu\'après exécution du JavaScript.',
      },
      {
        q: 'Faut-il refaire tout le site pour ajouter le rendu côté serveur ?',
        a: 'Pas nécessairement. Sur Angular et Next.js notamment, le rendu serveur s\'ajoute à une application existante, même si des adaptations sont nécessaires partout où le code suppose la présence d\'un navigateur. Un audit préalable établit l\'ampleur réelle du chantier avant tout engagement.',
      },
    ],
    relatedServices: ['web-app', 'ecommerce'],
  },

  {
    slug: 'reussir-refonte-site-web-entreprise',
    title: 'Réussir la refonte du site web de son entreprise',
    seoTitle: 'Réussir la Refonte de son Site Web au Maroc — Guide Complet | SWIVIQ',
    seoDesc: 'Une refonte mal préparée fait perdre le référencement acquis. Méthode en 6 étapes : audit, redirections, contenu, recette et suivi post-lancement.',
    date: '2026-07-30',
    readingMinutes: 7,
    excerpt:
      'La refonte d\'un site fait perdre du trafic dans un cas sur deux — presque toujours pour la même raison : les anciennes adresses n\'ont pas été redirigées. Voici la méthode pour l\'éviter.',
    intro:
      'Une refonte réussie se juge trois mois après la mise en ligne, sur une seule question : le trafic est-il au moins revenu à son niveau précédent ? Dans une proportion importante des cas, la réponse est non, et la cause est presque toujours la même — les anciennes adresses n\'ont pas été redirigées vers les nouvelles. Le référencement acquis pendant des années disparaît en une nuit.',
    sections: [
      {
        title: 'Avant tout : inventorier l\'existant',
        body: 'On ne remplace pas ce qu\'on n\'a pas mesuré. Avant d\'ouvrir la moindre maquette, il faut établir la liste complète des adresses actuelles, savoir lesquelles reçoivent du trafic, et lesquelles sont pointées par des liens externes. Ce sont ces pages-là qui portent votre référencement, et elles ne correspondent presque jamais à celles que la direction croit importantes. C\'est aussi à ce moment qu\'on découvre les pages oubliées qui reçoivent pourtant des visites tous les jours.',
      },
      {
        title: 'Le plan de redirection : la pièce maîtresse',
        body: 'Chaque ancienne adresse doit pointer vers son équivalent nouveau, avec une redirection permanente. C\'est fastidieux et c\'est précisément pour cette raison que c\'est si souvent bâclé :',
        bullets: [
          'Une redirection par ancienne page, vers la page la plus proche en contenu — pas vers l\'accueil par défaut',
          'Rediriger vers l\'accueil est traité par Google comme une page supprimée : le bénéfice est nul',
          'Les pages sans équivalent doivent renvoyer une erreur 404 franche, plutôt qu\'une redirection trompeuse',
          'Le plan se teste avant la mise en ligne, pas après les premiers signalements de visiteurs',
        ],
      },
      {
        title: 'Ne pas jeter le contenu qui fonctionne',
        body: 'Le réflexe habituel consiste à tout réécrire au nom de la modernité. C\'est souvent une erreur : les pages qui vous apportent du trafic le doivent à leur contenu, pas à leur mise en page. Conservez les textes qui performent, améliorez-les si nécessaire, et concentrez l\'effort de réécriture sur les pages qui ne rapportent rien aujourd\'hui. Une refonte est d\'abord un exercice de conservation, pas de table rase.',
      },
      {
        title: 'La recette avant mise en ligne',
        body: 'La liste minimale à vérifier avant d\'ouvrir le nouveau site au public :',
        bullets: [
          'Aucune balise noindex résiduelle héritée de l\'environnement de test — la cause d\'accident la plus fréquente',
          'Balises canoniques correctes, et une seule version du domaine accessible (avec ou sans www, pas les deux)',
          'Plan du site à jour et robots.txt cohérent avec ce que vous voulez faire indexer',
          'Redirections testées une par une, sur la liste établie à l\'étape d\'inventaire',
          'Contenu visible dans le code source de la page, et non seulement après exécution du JavaScript',
        ],
      },
      {
        title: 'Les trois mois qui suivent',
        body: 'Une baisse de trafic dans les deux à quatre semaines suivant la mise en ligne est normale : Google doit reparcourir l\'ensemble du site. Ce qui n\'est pas normal, c\'est qu\'elle persiste au-delà. Surveillez la couverture d\'indexation et les erreurs signalées dans la Search Console, et corrigez les redirections manquantes au fil de leur apparition. C\'est un travail de quelques heures par semaine pendant trois mois — sans lui, personne ne sait que la refonte a échoué avant que le chiffre d\'affaires ne le dise.',
      },
    ],
    faq: [
      {
        q: 'Combien de temps faut-il pour retrouver son référencement après une refonte ?',
        a: 'Deux à quatre semaines pour que Google reparcoure un site de taille moyenne, à condition que les redirections soient correctes. Une baisse temporaire pendant cette période est normale. Si elle dépasse deux mois, il y a un problème technique à diagnostiquer — le plus souvent des redirections manquantes ou une balise noindex oubliée.',
      },
      {
        q: 'Faut-il garder les mêmes adresses lors d\'une refonte ?',
        a: 'C\'est la solution la plus sûre : conserver les adresses existantes supprime purement et simplement le risque. Si la nouvelle structure impose de les changer, un plan de redirection complet, page par page, devient indispensable — et il se prépare avant la mise en ligne, pas après.',
      },
      {
        q: 'Combien coûte la refonte d\'un site d\'entreprise au Maroc ?',
        a: 'Une refonte avec développement sur mesure démarre à 25 000 MAD HT, et une boutique en ligne à 18 000 MAD HT. L\'audit préalable et le plan de redirection représentent une part modeste du budget au regard du trafic qu\'ils protègent — c\'est le poste sur lequel il ne faut pas économiser.',
      },
    ],
    relatedServices: ['web-app', 'ecommerce', 'conseil'],
  },
];

export const ARTICLE_SLUGS = ARTICLES.map(a => a.slug);
export const ARTICLES_BY_SLUG: Record<string, Article> =
  Object.fromEntries(ARTICLES.map(a => [a.slug, a]));
