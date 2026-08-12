/**
 * English version of the Fatora Bot dossier.
 *
 * Not a literal translation. The French page argues to a Moroccan reader who
 * knows what an ICE number is; this one argues to someone abroad who does
 * not, so the fiscal terms are explained inline and the emphasis moves from
 * "conforme à la DGI" to "built by an agency that can build you one too".
 *
 * Every field is optional. Anything absent falls back to the French record,
 * so a partial translation degrades to mixed language rather than to holes.
 */

export const FATORA_BOT_EN = {
  name: 'Fatora Bot',
  tagline: 'Voice invoicing inside WhatsApp, in Moroccan Arabic, compliant with Moroccan tax rules',

  description:
    "Fatora Bot is an electronic invoicing service for Moroccan businesses that runs entirely inside WhatsApp. "
    + "A shop assistant, a driver or an owner records a voice note in Darija — the spoken Moroccan Arabic — and roughly thirty seconds "
    + "later the company has issued a compliant PDF invoice carrying its tax identifiers, itemised VAT, the amount written out in words, "
    + "an unbroken invoice number and the company stamp. There is no accounting software to install and nothing to learn: a team that can "
    + "send a voice note can already invoice. "
    + "Behind that simplicity: Meta's official WhatsApp Business API, a speech engine tuned for spoken Darija — including prices quoted in "
    + "riyal and melyoun, hesitations and mid-sentence corrections — strict data isolation per company, and a public site of 41 pages in "
    + "four languages. Fatora Bot is designed, hosted and maintained by SWIVIQ.",

  technologies: [
    'WhatsApp Business Cloud API (Meta)', 'Node.js', 'Express', 'MySQL', 'Sequelize',
    'Generative AI (Darija/French extraction)', 'Speech synthesis', 'Document recognition',
    'Redis', 'BullMQ', 'pdfkit', 'Angular SSR', 'nginx', 'Schema.org', '4-language i18n'
  ],

  features: [
    'Voice dictation in Darija — Arabic or Latin script — plus French and Tamazight',
    'Spoken replies in whichever language the sender used',
    'Compliant PDF invoice: tax identifiers, itemised VAT, amount written out in words',
    'Unbroken numbering per financial year, with no gaps in the sequence',
    'Company stamp photographed once, applied to every invoice after that',
    'Delivery by QR code, WhatsApp or email — with confirmation before anything leaves',
    'Customer directory: exact spelling read from a photo of a document and remembered',
    'Prices quoted in riyal and melyoun understood without manual conversion',
    'Post-issue corrections under the same invoice number, no credit note needed',
    'Archives by voice: "invoice number 8", "this month\'s invoices"',
    'Data partitioned per company, hosted in the European Union',
    'Two free invoices to evaluate, no card required'
  ],

  seo: {
    title: 'Fatora Bot — the Moroccan WhatsApp invoicing bot built by SWIVIQ',
    description:
      "How SWIVIQ built Fatora Bot: invoices dictated in Moroccan Arabic over WhatsApp, compliant PDF issued in 30 seconds.",
    /**
     * Same discipline as the French page: fatora.swiviq.com owns the market
     * queries, so this version targets the agency intent — who built it and
     * can they build one for me.
     */
    keywords: [
      'WhatsApp invoicing bot', 'WhatsApp Business API agency Morocco',
      'WhatsApp bot development Morocco', 'custom SaaS development Morocco',
      'Darija speech recognition', 'Arabic voice AI invoicing',
      'WhatsApp automation for small business', 'WhatsApp Cloud API integration',
      'Fatora Bot', 'Moroccan software agency', 'multi-tenant SaaS development'
    ]
  },

  faq: [
    {
      q: 'Is electronic invoicing mandatory in Morocco?',
      a: "Article 145-IX of the Moroccan General Tax Code establishes electronic invoicing on a clearance model, where the invoice passes "
        + "through a government platform before reaching the customer. The rollout is phased, and as of mid-2026 the decree setting the "
        + "timetable for very small businesses had not been published. A company adopting the tool now is getting ahead of a deadline that "
        + "is coming — it is not catching up on one already missed."
    },
    {
      q: 'What must a Moroccan invoice legally show?',
      a: "The company's ICE (common business identifier), its IF (tax identifier), its professional tax number, its registered name and "
        + "address, a sequential invoice number, the date, line items with quantities and unit prices, the VAT rate and amount, the totals "
        + "before and after tax, and the grand total written out in words. Fatora Bot assembles all of it automatically: these details are "
        + "entered once when the company registers and never asked for again."
    },
    {
      q: 'Does anyone need to install an app?',
      a: "No. Everything happens inside WhatsApp, which is already on your team's phones. There is no account to create, no software to "
        + "deploy, no workstation to equip and no training to schedule. The company registers by answering six questions in the "
        + "conversation — legal name, ICE, IF, professional tax number, address, VAT regime — and then starts invoicing."
    },
    {
      q: 'Does it really understand spoken Darija?',
      a: "Yes, by voice and in writing, in Arabic script as well as Latin. It understands prices quoted in riyal and melyoun, hesitations, "
        + "and mid-sentence corrections — saying \"no, two at 200\" rewrites the summary immediately. It answers in the language it was "
        + "addressed in, and by voice when spoken to. French and Tamazight are supported as well."
    },
    {
      q: 'What does Fatora Bot cost?',
      a: "Two invoices are free so a business can evaluate it under real conditions, with no card and no commitment. After that: 30 dirhams "
        + "a month for 15 invoices, 50 for 30 invoices, 90 for 100. The cost follows actual invoicing volume — there is no per-seat licence "
        + "and no setup fee."
    },
    {
      q: 'What happens to an invoice sent with a mistake?',
      a: "It is corrected under the same number. The numbering sequence stays unbroken, which is what the tax authority requires, without "
        + "forcing the business to issue a credit note over a typo."
    },
    {
      q: 'Where is company data hosted?',
      a: "In the European Union. Each company gets a sealed space: its own customers, its own numbering sequence, its own stamp. Nothing is "
        + "shared between companies, and the company's WhatsApp number is the technical boundary."
    },
    {
      q: 'Can an accounting firm equip its clients?',
      a: "Yes, and it is the most effective way to deploy. Accounting firms, professional federations and cooperatives equip their members "
        + "in one move, with SWIVIQ handling the integration. The accountant then receives PDFs in the format they expect instead of photos "
        + "of paper books to re-key."
    }
  ],

  photos: [
    {
      title: 'The whole interface is one conversation',
      description: "A seven-second voice note leaves the shop assistant. The bot answers in Darija — in writing and in audio — with what it "
        + "understood: the customer, the three items, the 5,400 dirham total including tax, and a confirmation question. One word approves it, "
        + "and the invoice lands in the thread with the company stamp on it. There is no data-entry screen elsewhere: this is the entire product."
    },
    {
      title: 'The document it actually issues',
      description: "This invoice comes from the product's own engine, not from a mockup made for the page. It carries the company's tax "
        + "identifiers, the line items, VAT by rate, totals before and after tax, and the amount written out in words. The stamp area is "
        + "reserved at the bottom right."
    },
    {
      title: 'Six capabilities, demonstrated rather than listed',
      description: "Voice dictation, compliant invoice, company stamp, QR delivery, three languages and customer memory: each capability plays "
        + "its own scenario — here, the invoice being assembled line by line up to the written-out total."
    },
    {
      title: 'Three gestures, no training',
      description: "Dictate, approve with a word, deliver. The bot reads the summary back aloud before issuing — items, prices, total including "
        + "tax — and a simple \"wakha\" releases it. That is the complete path of an invoice, and there is nothing else to learn."
    },
    {
      title: 'The language of whoever is invoicing',
      description: "Darija in Arabic or Latin script, French, Tamazight: the bot always answers in the language it received, and in audio when "
        + "spoken to. Prices quoted in riyal or melyoun are converted without anyone thinking about it."
    },
    {
      title: 'Priced on volume, not on seats',
      description: "Two free invoices to evaluate, then 30, 50 or 90 dirhams a month depending on how many invoices are issued. No per-user "
        + "cost: a company equipping five sales staff pays the same as one equipping a single person."
    }
  ],

  sections: [
    {
      id: 'contexte',
      eyebrow: 'The problem',
      title: 'Invoicing in Morocco costs more than the invoice is worth',
      body: "Moroccan micro-businesses invoice from carbon-copy books, or not at all. When they do buy software, they buy something designed "
        + "for an accountant: a per-seat licence, a data-entry screen, a training session, and a salesperson who will never open it from a "
        + "building site or a shop counter.\n\n"
        + "Article 145-IX of the General Tax Code established electronic invoicing on a clearance model, where the invoice passes through a "
        + "government platform before it reaches the customer. The timetable for the smallest businesses still depends on a decree unpublished "
        + "as of mid-2026: the deadline is coming, but it is not here. That is precisely the window in which a tool has to be useful for "
        + "something other than compliance — otherwise nobody adopts it until the night before the law bites.\n\n"
        + "Fatora Bot attacks the problem through habit rather than through law: nothing to install, nothing to learn, and compliance arriving "
        + "as a by-product of a gesture the team already performs fifty times a day — sending a WhatsApp voice note.",
      bullets: [
        'Nothing to deploy: WhatsApp is already on every salesperson\'s phone',
        'No per-seat licence — price follows invoice count, not headcount',
        'No training: the interface is a conversation',
        'Tax compliance obtained without having to understand it',
        'A head start on the mandate rather than a scramble at the deadline'
      ],
      metrics: [
        { value: '145-IX', label: 'tax code article behind the mandate' },
        { value: '30 s', label: 'from voice note to issued PDF' },
        { value: '0', label: 'apps to install' }
      ]
    },
    {
      id: 'voix',
      eyebrow: 'Understanding Darija',
      title: 'It speaks the language your teams actually work in',
      body: "Darija is not a standardised written language. It is spoken, written sometimes in Arabic script and sometimes in Latin, and it "
        + "counts money in riyal or melyoun rather than dirhams. A generic dictation engine fails on all of that.\n\n"
        + "Fatora Bot handles the voice note end to end: transcription, structured extraction of the customer, items, quantities and prices, "
        + "then a spoken reply in the same language. \"Sayab liya fatora l Ahmed Transport, tlata dyal l-bibane b 1500 dh\" becomes a customer, "
        + "an item, a quantity, a unit price and a total including tax — in a little over a second. Hesitations and mid-sentence corrections are "
        + "absorbed: \"no, two at 200\" rewrites the summary without starting over.\n\n"
        + "Two less visible mechanisms make the difference in practice. A Darija lexicon built from an open corpus anchors the trade vocabulary. "
        + "And a regression bench replays real cases on every change to the engine: any error a real user hits is added to it BEFORE being fixed, "
        + "so it cannot come back.",
      bullets: [
        'Voice note or written message, whichever suits the person invoicing',
        'Darija in Arabic or Latin script, French, Tamazight',
        'Always answers in the language received — and in audio when the request was audio',
        'Riyal and melyoun understood without manual conversion',
        'Mid-sentence corrections absorbed without starting again',
        'Conversation memory: the bot knows which invoice is being discussed',
        'Burst buffer: five voice notes in a row form one request, not five invoices',
        'Regression bench fed by real errors before any prompt is changed'
      ],
      metrics: [
        { value: '1.4 s', label: 'to understand a voice note' },
        { value: '4', label: 'languages understood' },
        { value: '2', label: 'scripts for Darija' }
      ]
    },
    {
      id: 'conformite',
      eyebrow: 'The document',
      title: 'An enforceable invoice, not a receipt',
      body: "What comes out of the conversation is a PDF an accountant accepts and an auditor can check. Every mandatory field is there: the "
        + "company's common business identifier, its tax identifier, its professional tax number, its registered name and address, the line "
        + "items, VAT by rate, totals before and after tax, and the grand total written out in words.\n\n"
        + "They are entered once, when the company registers, through six questions asked in the conversation. After that nobody re-keys them. "
        + "The company stamp is photographed once and applied automatically to every invoice issued by anyone on the team.\n\n"
        + "Numbering runs unbroken through the financial year, with no gaps — a condition improvised tools routinely fail. An error spotted "
        + "after sending is corrected under the same number, instead of forcing a credit note over a typo.",
      bullets: [
        'Tax identifiers and VAT regime entered once, never asked again',
        'VAT itemised by rate, totals before and after tax, amount in words',
        'Unbroken numbering per financial year, specific to each company',
        'Company stamp photographed once, applied automatically',
        'Post-issue correction under the same number, no credit note',
        'PDFs kept and retrievable by voice: "invoice number 8", "this month\'s invoices"'
      ],
      metrics: [
        { value: '6', label: 'questions at signup, then none' },
        { value: '100%', label: 'of mandatory fields carried' }
      ]
    },
    {
      id: 'remise',
      eyebrow: 'Delivery',
      title: 'The invoice reaches the customer without typing their email',
      body: "An invoice issued but stranded in the salesperson's phone is worth nothing. Three routes carry it to the customer, each chosen "
        + "with a single word in the conversation.\n\n"
        + "The QR code is fastest at a counter: the customer scans the salesperson's screen, or a sticker on the till, and the PDF downloads. "
        + "Nothing to type, nothing to install on their side. The invoice can also go straight to the customer's WhatsApp, or by email for those "
        + "who archive.\n\n"
        + "Every outbound delivery requires explicit confirmation. That friction is deliberate: a bot that sends an invoice to the wrong "
        + "recipient because it misheard one phrase does more damage than it saves.",
      bullets: [
        'QR code: the customer scans the salesperson\'s screen, the PDF downloads',
        'Direct delivery to the customer\'s WhatsApp',
        'Email delivery for customers who archive',
        'Explicit confirmation before anything leaves the company',
        'Customer directory: exact spelling remembered from one invoice to the next',
        'Difficult name? A photo of a document is enough — the exact spelling is read from it'
      ],
      metrics: []
    },
    {
      id: 'architecture',
      eyebrow: 'Architecture',
      title: 'Every company in a sealed space',
      body: "The company's WhatsApp number is the technical boundary. Each business owns its customers, its numbering sequence and its stamp; "
        + "nothing crosses from one to another. Two neighbouring shops using the same bot cannot see each other.\n\n"
        + "Conversations run through Meta's official WhatsApp Business API rather than a hijacked client — that is what separates an operable "
        + "service from a rig that breaks on the next WhatsApp update. Data is hosted in the European Union.\n\n"
        + "The platform switches from simple processing to a job queue on its own once it runs in production, with no configuration: an "
        + "end-of-month spike does not turn into lost messages.",
      bullets: [
        'Meta\'s official WhatsApp Business API — no hijacked client',
        'One number = one company = one sealed data space',
        'Numbering sequence specific to each business',
        'Hosted in the European Union',
        'Job queue enabled automatically in production',
        'PDFs generated server-side, with no third-party service in the path'
      ],
      metrics: []
    },
    {
      id: 'administration',
      eyebrow: 'Back office',
      title: 'An admin that drives subscriptions and supervision',
      body: "Subscriptions, activations and supervision run from a dedicated back office, separate from the bot. Activating a company, moving "
        + "it between tiers or checking what happened in a conversation takes no engineering.\n\n"
        + "The architecture deliberately splits responsibilities: WhatsApp access tokens never leave the invoicing service. The admin talks to "
        + "it through a protected interface, so it never has to hold the secrets that would allow writing in a company's name.",
      bullets: [
        'Activation and tier changes without engineering involvement',
        'Supervision of conversations and issued invoices',
        'WhatsApp tokens never leave the invoicing service',
        'Protected access, separate from the public site'
      ],
      metrics: []
    },
    {
      id: 'acquisition',
      eyebrow: 'Search & AI engines',
      title: 'A site built to be found, and to be quoted',
      body: "A product nobody searches for by name gets found through its questions. So the Fatora Bot site carries an editorial core: "
        + "seventeen guides in French and twelve in Arabic answering what people actually ask — the invoicing mandate, what a Moroccan invoice "
        + "must show, VAT rates, numbering, archiving, payment terms, the difference between the various tax identifiers.\n\n"
        + "Those pages are prerendered server-side: their content is readable on the first request, without executing JavaScript — the condition "
        + "for being usable by generative search crawlers, which do not run pages. The site also publishes the files those engines look for, "
        + "regenerated on every publication, and notifies search engines of each new URL.\n\n"
        + "Two guardrails hold it together: the build fails if an internal link does not resolve, and an unknown URL returns a real 404 — "
        + "previously any invented address returned the home page with a 200 status, which engines read as thousands of duplicate pages.",
      bullets: [
        '41 prerendered pages, up from 4 before the rebuild',
        '17 guides in French, 12 written directly in Arabic',
        'Sector pages: construction and joinery, retail, transport and logistics',
        'Comparison pages on decision-stage queries',
        'Sitemap and AI-engine files regenerated on every publication',
        'Search engines notified automatically of each new URL',
        'The build fails on a dead internal link',
        'Real 404 on unknown addresses, not the home page with a 200',
        'Self-hosted fonts: no third-party domain called'
      ],
      metrics: [
        { value: '41', label: 'indexable pages' },
        { value: '29', label: 'published guides' },
        { value: '4', label: 'site languages' }
      ]
    },
    {
      id: 'suite',
      eyebrow: 'Roadmap',
      title: 'What comes next',
      body: "The decree that will set the timetable for the smallest businesses has not been published. When it is, connecting to the government "
        + "platform becomes the subject: the architecture is already organised so that an issued invoice can be submitted for clearance without "
        + "the user changing anything about the gesture.\n\n"
        + "The priority channel is not the micro-business directly but the accountant: firms, professional federations and cooperatives equip "
        + "their members in one move, with integration handled for them. It is also the channel through which public digitalisation support "
        + "schemes can fund the rollout.",
      bullets: [
        'Connection to the government clearance platform once the decree is published',
        'Rollout through accounting firms',
        'Offers for professional federations and cooperatives',
        'Continuous enrichment of the Darija lexicon from real usage',
        'Expansion of the Arabic editorial core'
      ],
      metrics: []
    }
  ],

  plans: {
    // Les paliers gardent leurs prix : seuls les libellés se traduisent.
    'Évaluation': {
      name: 'Free trial',
      tagline: 'To judge it under real conditions',
      features: ['2 invoices included', 'Every feature, nothing held back', 'No card required', 'No commitment'],
      ctaLabel: 'Try it on WhatsApp'
    },
    'TPE': {
      name: 'Micro',
      tagline: 'Craftspeople, sole traders, small shops',
      features: [
        '15 invoices a month',
        'Voice dictation in Darija, French and Tamazight',
        'Compliant PDF with company stamp',
        'Delivery by QR code, WhatsApp or email',
        'Unlimited users'
      ],
      ctaLabel: 'Choose Micro'
    },
    'Commerce': {
      name: 'Retail',
      tagline: 'Most chosen',
      features: [
        '30 invoices a month',
        'Everything in Micro',
        'Customer directory shared across staff',
        'Archives searchable by voice',
        'Unlimited users'
      ],
      ctaLabel: 'Choose Retail'
    },
    'Entreprise': {
      name: 'Business',
      tagline: 'Service companies, hauliers, cooperatives',
      features: [
        '100 invoices a month',
        'Everything in Retail',
        'Onboarding support',
        'Rollout through an accounting firm available',
        'Unlimited users'
      ],
      ctaLabel: 'Choose Business'
    }
  }
};
