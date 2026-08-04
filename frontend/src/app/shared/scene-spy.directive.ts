import { Directive, ElementRef, inject, input, OnDestroy, OnInit, output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Emits the scene index when the element crosses the middle band of the viewport. */
@Directive({ selector: '[svqSceneSpy]' })
export class SceneSpyDirective implements OnInit, OnDestroy {
  readonly index = input.required<number>({ alias: 'svqSceneSpy' });
  readonly active = output<number>();

  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.active.emit(this.index());
        }
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
