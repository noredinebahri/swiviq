import { Directive, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Ajoute `.is-visible` quand l'élément entre dans l'écran (voir `.reveal` dans styles.scss).
 *
 * ── LE BUG QUE CE FICHIER CORRIGE ──────────────────────────────────────────
 * `.reveal { opacity: 0 }` : sans `.is-visible`, le contenu existe dans le DOM
 * mais reste INVISIBLE. Or la classe n'était posée que par
 * l'IntersectionObserver.
 *
 * Côté serveur, la branche « pas de navigateur » l'ajoutait immédiatement :
 * une page ouverte directement — ou rechargée — arrivait donc toujours
 * visible. Côté navigateur, en navigation interne, l'élément dépendait
 * entièrement de l'observateur ; quand celui-ci ne signalait rien, le contenu
 * restait invisible indéfiniment.
 *
 * Mesuré sur swiviq.com (mobile 390×780, réseau lent), page /produits :
 *   · navigation interne : carte présente, 18 % dans l'écran, opacity 0 après 9 s
 *   · après 200 px de défilement : opacity 1
 *   · chargement direct : opacity 1 immédiatement (classe posée par le serveur)
 * D'où le symptôme « je ne vois rien, et après un rechargement forcé je vois
 * les données ». Les données étaient là depuis le début.
 *
 * ── LA RÈGLE APPLIQUÉE ─────────────────────────────────────────────────────
 * Une animation d'apparition ne doit JAMAIS masquer un contenu durablement.
 * Trois filets, du plus rapide au plus sûr :
 *   1. élément déjà à l'écran → révélé sans attendre l'observateur ;
 *   2. observateur pour le cas normal (contenu plus bas dans la page), avec un
 *      seuil d'un pixel au lieu de 12 % ;
 *   3. délai de sécurité qui révèle tout élément resté caché alors qu'il est
 *      visible — un fondu qui n'arrive jamais est pire que pas de fondu.
 */
@Directive({ selector: '[svqReveal]' })
export class RevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private fallbackTimer?: ReturnType<typeof setTimeout>;

  /** Délai au-delà duquel un élément visible à l'écran est révélé d'office. */
  private static readonly FALLBACK_MS = 1200;

  ngOnInit() {
    const node = this.el.nativeElement;
    node.classList.add('reveal');

    // Rendu serveur, ou navigateur sans IntersectionObserver : visible tout de
    // suite. C'est ce qui rendait déjà les chargements directs corrects.
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) {
      node.classList.add('is-visible');
      return;
    }

    // 1. Déjà dans l'écran → on ne délègue rien, on révèle. C'est le cas exact
    //    qui restait bloqué : un élément créé après l'arrivée des données,
    //    dans la partie visible de la page.
    if (this.isInViewport(node)) {
      this.reveal();
      return;
    }

    // 2. Cas normal : l'élément est plus bas, on attend qu'il approche.
    //    Seuil 0 (un pixel suffit) au lieu de 0.12 : une carte plus haute que
    //    l'écran n'atteint jamais 12 % de visibilité sur un téléphone.
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.reveal();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(node);

    // 3. Filet de sécurité : si l'observateur n'a rien dit et que l'élément est
    //    pourtant à l'écran (transition de vue, image chargée après coup,
    //    décalage de mise en page), on révèle.
    this.fallbackTimer = setTimeout(() => {
      if (this.isInViewport(node)) this.reveal();
    }, RevealDirective.FALLBACK_MS);
  }

  ngOnDestroy() {
    this.cleanup();
  }

  /** Au moins un pixel de l'élément est dans la fenêtre. */
  private isInViewport(node: HTMLElement): boolean {
    const r = node.getBoundingClientRect();
    if (r.height === 0 && r.width === 0) return false; // pas encore mis en page
    return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
  }

  private reveal() {
    this.el.nativeElement.classList.add('is-visible');
    this.cleanup();
  }

  private cleanup() {
    this.observer?.disconnect();
    this.observer = undefined;
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = undefined;
    }
  }
}
