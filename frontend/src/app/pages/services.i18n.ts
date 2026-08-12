import { ServiceContent } from './services.data';

/**
 * Fiches services traduites.
 *
 * Les traductions arrivent SERVICE PAR SERVICE, et une fiche n'obtient son
 * adresse `/en/services/...` que lorsque son texte est réellement traduit —
 * voir `translatedServices()` plus bas et la liste dans localized-routes.ts.
 * Publier l'adresse avant le texte donnerait une page à l'habillage anglais
 * et au corps français, que Google classe comme contenu de faible qualité.
 *
 * `seoTitleFr` et `seoDescFr` gardent leur nom d'origine — le suffixe est un
 * héritage, pas une indication de langue : chaque version y met son titre.
 */
export type ServiceTranslation = Partial<ServiceContent>;

/** Traductions anglaises, par identifiant de service. */
export const SERVICE_META_EN: Record<string, ServiceTranslation> = {
  'web-app': {
    h1: 'Custom web application development in Morocco',
    seoTitleFr: 'Custom Web Application Development in Morocco | SWIVIQ',
    seoDescFr: 'Custom web applications built in Morocco: Angular, Node.js, server-side rendering, security and SEO. From 25,000 MAD. Get a detailed PDF quote in two minutes.',
    serviceType: 'Web application development',
    intro: 'SWIVIQ is a Moroccan software agency specialised in custom web applications. Based in Rabat, we work with companies in Casablanca, Marrakech, Tangier and across Morocco: from the scoping workshop to production deployment, a single engineering team designs, builds and hosts your application.',
    sections: [
      {
        title: 'Why build a custom web application?',
        body: 'Off-the-shelf software imposes its limits on you; a custom application follows your processes. Internal management, client portal, industry platform or back office: we build exactly what your business needs, with no per-seat licence and no features you will never open. Our applications are designed to grow — new modules, higher load, integrations with payment, invoicing, WhatsApp Business and third-party APIs.',
      },
      {
        title: 'Our technical stack',
        body: 'We work with modern, proven technologies — the same ones behind our own SaaS products:',
        bullets: [
          'Angular with server-side rendering: fast pages that Google can read on the first request',
          'Node.js and secured REST APIs (JWT authentication, OWASP practices)',
          'MySQL / PostgreSQL databases, cloud hosting with backups',
          'Moroccan integrations: CMI card payment, compliant invoicing, WhatsApp Business',
        ],
      },
      {
        title: 'How a web project runs at SWIVIQ',
        body: 'Every project follows four stages: a discovery workshop (goals, users, scope), mockups and a prototype approved together, development in sprints with regular demos, then production release, training and maintenance. You have one point of contact from day one to launch, and the code belongs to you entirely.',
      },
    ],
    faq: [
      {
        q: 'How much does a web application cost in Morocco?',
        a: 'At SWIVIQ a custom web application starts at 25,000 MAD. The final budget depends on three things: the number of screens and user roles, the integrations required (payment, APIs, invoicing) and the level of design. A typical project lands between 25,000 and 120,000 MAD. Our online quote gives you a precise estimate and a detailed PDF in two minutes.',
      },
      {
        q: 'How long does it take to build a web application?',
        a: 'Allow four to eight weeks for an MVP — a first working version — and two to four months for a complete application with integrations. We deliver in sprints, so you watch the product progress every week.',
      },
      {
        q: 'Will the application rank on Google?',
        a: 'Yes. Every public application we build uses server-side rendering, proper meta tags and Schema.org structured data — the same approach as this site. That is a decisive advantage over purely JavaScript applications, which part of the search ecosystem simply cannot read.',
      },
      {
        q: 'Who owns the source code?',
        a: 'You do. On delivery you receive the complete source code, the database and the documentation. No forced dependency: you can keep maintenance with SWIVIQ or hand it to any other team.',
      },
    ],
  },
};

/** Traductions arabes, par identifiant de service. */
export const SERVICE_META_AR: Record<string, ServiceTranslation> = {
  'web-app': {
    h1: 'تطوير تطبيقات ويب حسب الطلب بالمغرب',
    seoTitleFr: 'تطوير تطبيقات الويب حسب الطلب بالمغرب | SWIVIQ',
    seoDescFr: 'تطوير تطبيقات ويب حسب الطلب بالمغرب: Angular وNode.js، وتوليد الصفحات على الخادم، وأمان وتحسين لمحركات البحث. ابتداءً من 25000 درهم. عرض أثمنة مفصّل في دقيقتين.',
    serviceType: 'تطوير تطبيقات الويب',
    intro: 'SWIVIQ وكالة رقمية مغربية متخصّصة في تطوير تطبيقات الويب حسب الطلب. مقرّنا بالرباط، ونواكب مقاولات بالدار البيضاء ومراكش وطنجة وكل أنحاء المغرب: من ورشة التأطير إلى الإطلاق في الإنتاج، فريق هندسي واحد يصمّم تطبيقكم ويطوّره ويستضيفه.',
    sections: [
      {
        title: 'لماذا تطبيق ويب حسب الطلب لمقاولتكم؟',
        body: 'البرنامج الجاهز يفرض عليكم حدوده، أمّا التطبيق المصمّم على المقاس فيتبع مساركم. تدبير داخلي، أو بوّابة للزبناء، أو منصّة مهنية، أو لوحة تحكّم: نطوّر بالضبط ما يحتاجه نشاطكم، دون رخصة لكل مستعمل ودون وظائف لن تُفتح أبدًا. وتطبيقاتنا مصمّمة لتتطوّر: إضافة وحدات، واستيعاب حِمل أكبر، وربط بالأداء والفوترة وواتساب للأعمال وواجهات خارجية.',
      },
      {
        title: 'التقنيات التي نشتغل بها',
        body: 'نعتمد تقنيات حديثة ومجرَّبة، هي نفسها التي تقوم عليها منتجاتنا الخاصة:',
        bullets: [
          'Angular مع توليد الصفحات على الخادم: سرعة، ومحتوى تقرؤه محرّكات البحث من أول طلب',
          'Node.js وواجهات REST مؤمَّنة (مصادقة JWT، ومعايير OWASP)',
          'قواعد بيانات MySQL وPostgreSQL، واستضافة سحابية مع نسخ احتياطي',
          'ربط بالخصوصيات المغربية: الأداء بالبطاقة عبر CMI، وفوترة مطابقة، وواتساب للأعمال',
        ],
      },
      {
        title: 'كيف يجري مشروع ويب مع SWIVIQ',
        body: 'يمرّ كل مشروع بأربع مراحل: ورشة استكشاف (الأهداف، المستعملون، النطاق)، ثم تصاميم ونموذج أوّلي نصادق عليه معًا، ثم تطوير على دفعات مع عروض منتظمة، ثم الإطلاق والتكوين والصيانة. لكم مخاطب واحد من اليوم الأول إلى الإطلاق، والشيفرة المصدرية ملك لكم بالكامل.',
      },
    ],
    faq: [
      {
        q: 'كم يكلّف تطوير تطبيق ويب بالمغرب؟',
        a: 'في SWIVIQ، ينطلق تطبيق ويب حسب الطلب من 25000 درهم. وتتوقّف الميزانية النهائية على ثلاثة عوامل: عدد الشاشات وأدوار المستعملين، والربط المطلوب (الأداء، الواجهات الخارجية، الفوترة)، ومستوى التصميم. المشروع النموذجي يتراوح بين 25000 و120000 درهم. ويمنحكم عرض الأثمنة على الإنترنت تقديرًا دقيقًا وملف PDF مفصّلًا في دقيقتين.',
      },
      {
        q: 'ما هي مدة إنجاز تطبيق ويب؟',
        a: 'احسبوا من أربعة إلى ثمانية أسابيع لنسخة أولى صالحة للاستعمال، ومن شهرين إلى أربعة أشهر لتطبيق كامل مع عمليات الربط. نسلّم على دفعات: ترون المنتج يتقدّم كل أسبوع.',
      },
      {
        q: 'هل سيظهر التطبيق في نتائج البحث؟',
        a: 'نعم. كل تطبيقاتنا العمومية تعتمد توليد الصفحات على الخادم، ووسوم وصفية مضبوطة، وبيانات منظّمة وفق Schema.org — وهو نفس ما يعتمده هذا الموقع. وهذه أفضلية حاسمة أمام التطبيقات المبنية على JavaScript وحده، التي لا يستطيع جزء من المحرّكات قراءتها.',
      },
      {
        q: 'لمن تعود ملكية الشيفرة المصدرية؟',
        a: 'لكم. عند التسليم تتوصّلون بالشيفرة المصدرية الكاملة وقاعدة البيانات والتوثيق. لا تبعية مفروضة: يمكنكم إبقاء الصيانة لدى SWIVIQ أو إسنادها لأي فريق آخر.',
      },
    ],
  },
};

/**
 * Services dont la traduction est complète dans une langue donnée.
 *
 * Sert à décider quelles adresses `/en/services/...` et `/ar/services/...`
 * existent réellement. Un service absent de la liste garde son adresse
 * française, sans hreflang.
 */
export function translatedServices(lang: string): string[] {
  const table: Record<string, Record<string, ServiceTranslation>> = {
    en: SERVICE_META_EN,
    ar: SERVICE_META_AR,
  };
  return Object.keys(table[lang] ?? {});
}

/** Services traduits dans TOUTES les langues — les seuls à recevoir une adresse par langue. */
export function fullyTranslatedServices(): string[] {
  const en = new Set(translatedServices('en'));
  return translatedServices('ar').filter(id => en.has(id));
}

/**
 * Applique la traduction d'une langue par-dessus la fiche française.
 *
 * L'identifiant est passé explicitement, jamais déduit d'un état de module :
 * le rendu serveur traite plusieurs requêtes dans le même processus, et une
 * variable partagée y servirait la fiche d'un visiteur à un autre.
 */
export function localizeService(id: string, base: ServiceContent, lang: string): ServiceContent {
  const table = lang === 'en' ? SERVICE_META_EN : lang === 'ar' ? SERVICE_META_AR : null;
  const tr = table?.[id];
  return tr ? { ...base, ...tr } : base;
}
