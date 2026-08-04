import { Injectable, Pipe, PipeTransform, computed, inject, signal, DOCUMENT, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FR } from './fr';
import { EN } from './en';
import { AR } from './ar';

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
