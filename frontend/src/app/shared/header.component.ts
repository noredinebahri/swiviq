import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { I18nService, LANGS, TPipe, LocaleUrlPipe, Lang } from '../core/i18n/i18n.service';
import { isLocalized, localePath, stripLang } from '../core/i18n/localized-routes';
import { LogoComponent } from './svg';

@Component({
  selector: 'svq-header',
  imports: [RouterLink, RouterLinkActive, TPipe, LogoComponent, LocaleUrlPipe],
  template: `
    <header class="hdr" [class.scrolled]="scrolled()" [class.open]="menuOpen()">
      <div class="container hdr__in">
        <a [routerLink]="'/' | localeUrl" class="hdr__logo" aria-label="SWIVIQ — Accueil" (click)="menuOpen.set(false)">
          <svq-logo [size]="34" />
        </a>

<nav class="hdr__nav" [class.show]="menuOpen()" aria-label="Navigation principale">
          <a [routerLink]="'/' | localeUrl" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="menuOpen.set(false)">{{ 'nav.home' | t }}</a>
          <a [routerLink]="'/services' | localeUrl" routerLinkActive="active" (click)="menuOpen.set(false)">{{ 'nav.services' | t }}</a>
          <a [routerLink]="'/produits' | localeUrl" routerLinkActive="active" (click)="menuOpen.set(false)">{{ 'nav.products' | t }}</a>
          <a [routerLink]="'/a-propos' | localeUrl" routerLinkActive="active" (click)="menuOpen.set(false)">{{ 'nav.about' | t }}</a>
          <a [routerLink]="'/contact' | localeUrl" routerLinkActive="active" (click)="menuOpen.set(false)">{{ 'nav.contact' | t }}</a>
        </nav>

        <div class="hdr__actions">
          <div class="lang">
            <button class="lang__btn" (click)="langOpen.set(!langOpen())" aria-haspopup="listbox" [attr.aria-expanded]="langOpen()">
              {{ i18n.lang().toUpperCase() }}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            </button>
            @if (langOpen()) {
              <ul class="lang__menu" role="listbox">
                @for (l of langs; track l.code) {
                  <li><button (click)="setLang(l.code)" [class.on]="i18n.lang() === l.code">{{ l.label }}</button></li>
                }
              </ul>
            }
          </div>
          <a [routerLink]="'/devis' | localeUrl" class="btn btn--primary btn--sm hdr__cta">{{ 'nav.getQuote' | t }}</a>
          <button class="burger" (click)="menuOpen.set(!menuOpen())" aria-label="Menu" [attr.aria-expanded]="menuOpen()">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .hdr {
      position: fixed; top: 0; inset-inline: 0; z-index: 100;
      transition: background .3s, box-shadow .3s, backdrop-filter .3s;
      background: rgba(255,255,255,.75); backdrop-filter: blur(14px);
      border-bottom: 1px solid transparent;
    }
    .hdr.scrolled { background: rgba(255,255,255,.92); box-shadow: var(--shadow-sm); border-bottom-color: var(--c-border); }
    .hdr__in { display: flex; align-items: center; justify-content: space-between; height: var(--header-h); gap: 1rem; }
    .hdr__nav { display: flex; gap: 1.8rem; }
    .hdr__nav a { font-weight: 600; font-size: .95rem; color: var(--c-text); position: relative; padding-block: .3rem; }
    .hdr__nav a::after {
      content: ''; position: absolute; bottom: 0; inset-inline-start: 0; width: 0; height: 2px;
      border-radius: 2px; background: var(--grad-brand); transition: width .3s var(--ease-out);
    }
    .hdr__nav a:hover::after, .hdr__nav a.active::after { width: 100%; }
    .hdr__actions { display: flex; align-items: center; gap: .9rem; }
    .lang { position: relative; }
    .lang__btn {
      display: inline-flex; align-items: center; gap: .35rem; font-weight: 700; font-size: .82rem;
      padding: .45rem .75rem; border-radius: 8px; border: 1.5px solid var(--c-border); color: var(--c-text);
    }
    .lang__menu {
      position: absolute; top: calc(100% + 8px); inset-inline-end: 0; list-style: none;
      background: #fff; border: 1px solid var(--c-border); border-radius: 12px; box-shadow: var(--shadow);
      overflow: hidden; min-width: 140px;
    }
    .lang__menu button { display: block; width: 100%; text-align: start; padding: .6rem 1rem; font-size: .9rem; }
    .lang__menu button:hover { background: var(--c-surface); }
    .lang__menu button.on { color: var(--c-primary); font-weight: 700; }
    .burger { display: none; flex-direction: column; gap: 5px; padding: .5rem; }
    .burger span { width: 22px; height: 2.5px; border-radius: 2px; background: var(--c-ink); transition: .3s; }
    .open .burger span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
    .open .burger span:nth-child(2) { opacity: 0; }
    .open .burger span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

    @media (max-width: 880px) {
      .burger { display: flex; }
      .hdr__cta { display: none; }
      .hdr__nav {
        position: fixed; top: var(--header-h); inset-inline: 0; flex-direction: column; gap: 0;
        background: #fff; border-bottom: 1px solid var(--c-border); box-shadow: var(--shadow);
        transform: translateY(-8px); opacity: 0; pointer-events: none; transition: .25s var(--ease-out);
      }
      .hdr__nav.show { transform: none; opacity: 1; pointer-events: auto; }
      .hdr__nav a { padding: 1rem 1.5rem; border-bottom: 1px solid var(--c-border); }
      .hdr__nav a::after { display: none; }
    }
  `],
})
export class HeaderComponent {
  i18n = inject(I18nService);
  private router = inject(Router);
  langs = LANGS;
  scrolled = signal(false);
  menuOpen = signal(false);
  langOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 12); }

  /**
   * Change de langue.
   *
   * Sur une page qui existe dans l'autre langue, on NAVIGUE vers son adresse :
   * la langue appartient à l'URL, et deux visiteurs à la même adresse doivent
   * voir la même chose. Ailleurs — blog, comparatifs, fiches services, pages
   * villes, dont le texte n'est encore qu'en français — la bascule reste
   * l'ancienne : elle traduit l'habillage sans changer d'adresse, et ces pages
   * ne déclarent aucun hreflang.
   */
  setLang(code: Lang) {
    this.langOpen.set(false);
    const courant = stripLang(this.router.url);
    if (isLocalized(courant)) {
      this.router.navigateByUrl(localePath(courant, code));
      return;
    }
    this.i18n.setLang(code);
  }
}
