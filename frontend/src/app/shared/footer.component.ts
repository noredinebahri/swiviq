import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TPipe } from '../core/i18n/i18n.service';
import { LogoComponent } from './svg';

@Component({
  selector: 'svq-footer',
  imports: [RouterLink, TPipe, LogoComponent],
  template: `
    <footer class="ftr on-dark">
      <div class="container">
        <div class="ftr__grid">
          <div class="ftr__brand">
            <svq-logo [size]="36" variant="white" />
            <p>{{ 'footer.tagline' | t }}</p>
            <div class="ftr__legal-ids">
              <span>ICE 003963563000019</span>
              <span>IF 73099178</span>
              <span>RC 200173 — Rabat</span>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h4>{{ 'footer.nav' | t }}</h4>
            <a routerLink="/">{{ 'nav.home' | t }}</a>
            <a routerLink="/services">{{ 'nav.services' | t }}</a>
            <a routerLink="/produits">{{ 'nav.products' | t }}</a>
            <a routerLink="/a-propos">{{ 'nav.about' | t }}</a>
            <a routerLink="/devis">{{ 'nav.devis' | t }}</a>
          </nav>

          <nav aria-label="Services">
            <h4>{{ 'footer.services' | t }}</h4>
            <a routerLink="/services/web-app">{{ 'services.items.web-app.title' | t }}</a>
            <a routerLink="/services/saas">{{ 'services.items.saas.title' | t }}</a>
            <a routerLink="/services/ecommerce">{{ 'services.items.ecommerce.title' | t }}</a>
            <a routerLink="/services/conseil">{{ 'services.items.conseil.title' | t }}</a>
          </nav>

          <div>
            <h4>{{ 'footer.contact' | t }}</h4>
            <a href="mailto:contact@swiviq.com">contact&#64;swiviq.com</a>
            <p class="ftr__addr">{{ 'contact.addr' | t }}</p>
            <a routerLink="/mentions-legales">{{ 'footer.mentions' | t }}</a>
            <a routerLink="/confidentialite">{{ 'footer.privacy' | t }}</a>
          </div>
        </div>

        <div class="ftr__bottom">
          <span>© {{ year }} SWIVIQ SARL AU. {{ 'footer.rights' | t }}</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .ftr { background: var(--c-ink); color: var(--c-text-inverse-soft); padding: 4rem 0 1.5rem; }
    .ftr__grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.2fr; gap: 2.5rem; padding-bottom: 3rem; }
    .ftr__brand p { margin-top: 1rem; max-width: 300px; font-size: .95rem; }
    .ftr__legal-ids { display: flex; flex-wrap: wrap; gap: .5rem 1rem; margin-top: 1.2rem; font-size: .78rem; opacity: .7; }
    h4 { color: #fff; font-size: .95rem; margin-bottom: 1rem; }
    nav a, div > a { display: block; padding-block: .3rem; font-size: .92rem; transition: color .2s; }
    nav a:hover, div > a:hover { color: var(--c-accent); }
    .ftr__addr { font-size: .88rem; margin-block: .5rem; }
    .ftr__bottom {
      border-top: 1px solid rgba(255,255,255,.1); padding-top: 1.5rem;
      display: flex; justify-content: space-between; font-size: .85rem;
    }
    @media (max-width: 880px) { .ftr__grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 560px) { .ftr__grid { grid-template-columns: 1fr; } }
  `],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
