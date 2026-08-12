import { Injectable, Pipe, PipeTransform, computed, inject, signal, DOCUMENT, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FR } from './fr';
import { EN } from './en';
import { AR } from './ar';
import { langOfPath, localePath } from './localized-routes';

export type Lang = 'fr' | 'en' | 'ar';

const DICTS: Record<Lang, any> = { fr: FR, en: EN, ar: AR };
export const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

@Injectable({ providedIn: 'root' })
export class I18nService {
  private doc = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  readonly lang = signal<Lang>('fr');
  readonly dict = computed(() => DICTS[this.lang()]);
  readonly isRtl = computed(() => this.lang() === 'ar');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('swiviq_lang') as Lang | null;
      if (saved && DICTS[saved]) this.setLang(saved, false);
      else this.applyDom(this.lang());
    }
  }

  /**
   * Aligne la langue sur l'adresse courante.
   *
   * L'URL prime sur la préférence enregistrée : une adresse sans préfixe est
   * française, et doit le rester même pour un visiteur qui avait choisi
   * l'arabe. Sans cette règle, deux personnes verraient deux langues à la même
   * adresse — exactement ce qu'un moteur ne peut pas indexer.
   *
   * Rien n'est mémorisé : ouvrir un lien arabe ne signifie pas demander que
   * tout le site passe en arabe pour les visites suivantes.
   */
  setFromUrl(url: string) {
    this.setLang(langOfPath(url), false);
  }

  setLang(lang: Lang, persist = true) {
    if (!DICTS[lang]) return;
    this.lang.set(lang);
    if (persist && isPlatformBrowser(this.platformId)) {
      localStorage.setItem('swiviq_lang', lang);
    }
    this.applyDom(lang);
  }

  private applyDom(lang: Lang) {
    const html = this.doc.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  /** Resolve a dotted key path against the active dictionary. */
  t(key: string): string {
    let node: any = this.dict();
    for (const part of key.split('.')) {
      node = node?.[part];
      if (node == null) return key;
    }
    return typeof node === 'string' ? node : key;
  }
}

@Pipe({ name: 't', pure: false })
export class TPipe implements PipeTransform {
  private i18n = inject(I18nService);
  transform(key: string): string {
    return this.i18n.t(key);
  }
}

/**
 * Adresse d'un lien interne dans la langue courante.
 *
 *   <a [routerLink]="'/contact' | localeUrl">
 *
 * Retombe sur l'adresse française quand la page n'est pas encore traduite :
 * un lien qui fonctionne dans la mauvaise langue vaut mieux qu'un 404.
 */
@Pipe({ name: 'localeUrl', pure: false })
export class LocaleUrlPipe implements PipeTransform {
  private i18n = inject(I18nService);
  transform(path: string): string {
    return localePath(path, this.i18n.lang());
  }
}
