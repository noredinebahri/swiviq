import { Component, inject, OnInit } from '@angular/core';
import { TPipe } from '../core/i18n/i18n.service';
import { SeoService } from '../core/seo.service';

@Component({
  selector: 'svq-mentions',
  imports: [TPipe],
  template: `
    <section class="page-head section--dark">
      <div class="container"><h1>{{ 'legal.mentionsTitle' | t }}</h1></div>
    </section>
    <section class="section">
      <div class="container legal-body">
        <h2>Éditeur du site</h2>
        <p>
          Le site <strong>swiviq.com</strong> est édité par <strong>SWIVIQ SARL AU</strong>,
          société à responsabilité limitée à associé unique au capital de <strong>100 000,00 MAD</strong>.
        </p>
        <ul>
          <li><strong>Siège social :</strong> Imm 30, Appt 8, Rue Moulay Ahmed Loukili, Hassan, Rabat, Maroc</li>
          <li><strong>ICE :</strong> 003963563000019</li>
          <li><strong>Identifiant Fiscal (IF) :</strong> 73099178</li>
          <li><strong>Registre de Commerce (RC) :</strong> 200173 — Tribunal de Commerce de Rabat</li>
          <li><strong>Taxe Professionnelle :</strong> 25116641</li>
          <li><strong>Gérant / Directeur de la publication :</strong> Noredine Bahri</li>
          <li><strong>Email :</strong> contact&#64;swiviq.com</li>
        </ul>
        <h2>Activité</h2>
        <p>
          Conseil en systèmes informatiques ; édition de logiciels ; ingénierie informatique et services numériques ;
          édition de solutions SaaS et Cloud ; intermédiation numérique et conciergerie digitale ;
          commerce électronique (e-commerce) ; événementiel digital et communication.
        </p>
        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus du site (textes, graphismes, logos, illustrations SVG, code) est la propriété
          exclusive de SWIVIQ SARL AU, sauf mention contraire. Toute reproduction sans autorisation est interdite.
        </p>
        <h2>Hébergement</h2>
        <p>Les informations d'hébergement sont disponibles sur demande à contact&#64;swiviq.com.</p>
      </div>
    </section>
  `,
  styles: [`
    .page-head { padding: calc(var(--header-h) + 3rem) 0 2.5rem; background: var(--c-ink); }
    .page-head h1 { color: #fff; }
    .legal-body { max-width: 780px; }
    .legal-body h2 { font-size: 1.2rem; margin: 1.8rem 0 .7rem; }
    .legal-body p, .legal-body li { color: var(--c-text-soft); font-size: .96rem; }
    .legal-body ul { padding-inline-start: 1.3rem; margin-block: .6rem; }
    .legal-body li { padding-block: .15rem; }
  `],
})
export class MentionsComponent implements OnInit {
  private seo = inject(SeoService);
  ngOnInit() {
    this.seo.apply({
      title: 'Mentions légales | SWIVIQ',
      description: 'Mentions légales de SWIVIQ SARL AU — ICE 003963563000019, RC 200173 Rabat, IF 73099178.',
      path: '/mentions-legales',
    });
  }
}

@Component({
  selector: 'svq-privacy',
  imports: [TPipe],
  template: `
    <section class="page-head section--dark">
      <div class="container"><h1>{{ 'legal.privacyTitle' | t }}</h1></div>
    </section>
    <section class="section">
      <div class="container legal-body">
        <h2>Données collectées</h2>
        <p>
          Via les formulaires de devis et de contact, SWIVIQ collecte uniquement les données nécessaires au
          traitement de votre demande : nom, société, email, téléphone, ICE et description du projet.
        </p>
        <h2>Finalités</h2>
        <p>
          Ces données servent exclusivement à établir des devis, factures, répondre à vos demandes et assurer
          le suivi commercial. Elles ne sont jamais vendues ni transmises à des tiers.
        </p>
        <h2>Conservation & sécurité</h2>
        <p>
          Les données sont conservées le temps de la relation commerciale et protégées par des mesures
          techniques appropriées (chiffrement des échanges, contrôle d'accès, journalisation).
        </p>
        <h2>Vos droits</h2>
        <p>
          Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l'égard du traitement
          des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et d'opposition.
          Contactez-nous à contact&#64;swiviq.com.
        </p>
        <h2>Chatbot</h2>
        <p>
          Les conversations avec notre assistant SWIVI peuvent être traitées par un service d'IA tiers afin de
          générer les réponses. N'y partagez pas d'informations sensibles.
        </p>
      </div>
    </section>
  `,
  styles: [`
    .page-head { padding: calc(var(--header-h) + 3rem) 0 2.5rem; background: var(--c-ink); }
    .page-head h1 { color: #fff; }
    .legal-body { max-width: 780px; }
    .legal-body h2 { font-size: 1.2rem; margin: 1.8rem 0 .7rem; }
    .legal-body p { color: var(--c-text-soft); font-size: .96rem; }
  `],
})
export class PrivacyComponent implements OnInit {
  private seo = inject(SeoService);
  ngOnInit() {
    this.seo.apply({
      title: 'Politique de confidentialité | SWIVIQ',
      description: 'Politique de confidentialité de SWIVIQ : collecte, finalités et protection de vos données personnelles (loi 09-08).',
      path: '/confidentialite',
    });
  }
}

@Component({
  selector: 'svq-not-found',
  imports: [TPipe],
  template: `
    <section class="nf">
      <div class="container nf__in">
        <div class="nf__code text-gradient">404</div>
        <h1>{{ 'notFound.title' | t }}</h1>
        <p>{{ 'notFound.sub' | t }}</p>
        <a href="/" class="btn btn--primary">{{ 'notFound.back' | t }}</a>
      </div>
    </section>
  `,
  styles: [`
    .nf { min-height: 70vh; display: grid; place-items: center; padding-top: var(--header-h); }
    .nf__in { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .nf__code { font-family: var(--font-display); font-size: clamp(5rem, 14vw, 9rem); font-weight: 700; line-height: 1; }
    .nf p { color: var(--c-text-soft); }
  `],
})
export class NotFoundComponent implements OnInit {
  private seo = inject(SeoService);
  ngOnInit() { this.seo.noIndex('404 — SWIVIQ'); }
}
