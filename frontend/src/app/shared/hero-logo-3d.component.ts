import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

/* ============================================================
   SWIVIQ — Hero 3D logo scene
   Interactive 3D stage for the home hero: the official logo
   floats on a glowing card with mouse-follow tilt, orbiting
   rings, floating SaaS chips, particles and a grid floor.
   ============================================================ */

@Component({
  selector: 'svq-hero-logo-3d',
  template: `
    <div class="scene" aria-hidden="true">
      <div class="scene__glow"></div>
      <div class="floor"></div>

      <div class="tilt">
        <!-- orbit rings -->
        <div class="orbit orbit--a">
          <div class="orbit__spin"><span class="sat sat--a"></span></div>
        </div>
        <div class="orbit orbit--b">
          <div class="orbit__spin orbit__spin--rev"><span class="sat sat--b"></span></div>
        </div>

        <!-- logo card -->
        <div class="lcard">
          <div class="lcard__in">
            <img src="/logo.png" alt="" />
            <span class="lcard__shine"></span>
          </div>
        </div>

        <!-- floating chips -->
        <div class="chip3d chip3d--1">
          <div class="chip3d__in">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 18a5 5 0 0 1-.9-9.9 7 7 0 0 1 13.6-1.5A5.5 5.5 0 0 1 18.5 18H7Z" stroke="#a885f7" stroke-width="2" stroke-linejoin="round"/><path d="M9 21h2m3 0h2" stroke="#a885f7" stroke-width="2" stroke-linecap="round" opacity=".6"/></svg>
            <span>SaaS &amp; Cloud</span>
          </div>
        </div>
        <div class="chip3d chip3d--2">
          <div class="chip3d__in">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="7" y="2.5" width="10" height="19" rx="2.5" stroke="#a885f7" stroke-width="2"/><path d="M10.5 5.5h3" stroke="#a885f7" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Web &amp; Mobile</span>
          </div>
        </div>
        <div class="chip3d chip3d--3">
          <div class="chip3d__in">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" stroke="#a885f7" stroke-width="2" stroke-linejoin="round"/></svg>
            <span>API &amp; Intégrations</span>
          </div>
        </div>
        <div class="chip3d chip3d--4">
          <div class="chip3d__in">
            <span class="live-dot"></span>
            <span>Support 24/7</span>
          </div>
        </div>

        <!-- particles -->
        <span class="dot dot--1"><i></i></span>
        <span class="dot dot--2"><i></i></span>
        <span class="dot dot--3"><i></i></span>
        <span class="dot dot--4"><i></i></span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .scene {
      position: relative; width: 100%; max-width: 560px; aspect-ratio: 1 / .92;
      margin-inline: auto; perspective: 1200px;
    }
    .scene__glow {
      position: absolute; inset: 6%;
      background:
        radial-gradient(45% 45% at 50% 45%, rgba(116, 83, 242, .42), transparent 70%),
        radial-gradient(30% 30% at 70% 65%, rgba(32, 96, 240, .3), transparent 70%);
      filter: blur(26px);
      animation: h3d-glow 5s ease-in-out infinite;
    }

    /* perspective grid floor */
    .floor {
      position: absolute; left: 50%; bottom: 0; width: 135%; height: 46%;
      transform: translateX(-50%) rotateX(74deg); transform-origin: bottom;
      background-image:
        linear-gradient(rgba(116, 83, 242, .2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(116, 83, 242, .2) 1px, transparent 1px);
      background-size: 44px 44px;
      -webkit-mask-image: radial-gradient(62% 62% at 50% 100%, #000 25%, transparent 78%);
      mask-image: radial-gradient(62% 62% at 50% 100%, #000 25%, transparent 78%);
      opacity: .55;
    }

    /* mouse-tilt container (transform set from JS) */
    .tilt {
      position: absolute; inset: 0;
      transform-style: preserve-3d;
      will-change: transform;
      --mx: 0; --my: 0;
    }

    /* ---------- logo card ---------- */
    .lcard {
      position: absolute; top: 50%; left: 50%; width: 62%;
      transform: translate(-50%, -50%) translate3d(calc(var(--mx) * 18px), calc(var(--my) * 12px), 90px);
      transform-style: preserve-3d;
    }
    .lcard__in {
      position: relative; overflow: hidden;
      background: #fff; border-radius: 26px; padding: 9% 8%;
      box-shadow:
        0 34px 80px rgba(15, 15, 15, .55),
        0 18px 60px rgba(116, 83, 242, .38),
        0 0 0 1px rgba(255, 255, 255, .08);
      animation: h3d-float 6s ease-in-out infinite;
    }
    .lcard__in img { display: block; width: 100%; height: auto; }
    .lcard__shine {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, .75) 50%, transparent 65%);
      transform: translateX(-170%) skewX(-14deg);
      animation: h3d-shine 4.8s ease-in-out 1.4s infinite;
    }

    /* ---------- orbit rings ---------- */
    .orbit { position: absolute; top: 50%; left: 50%; border-radius: 50%; transform-style: preserve-3d; pointer-events: none; }
    .orbit--a {
      width: 97%; aspect-ratio: 1;
      transform: translate(-50%, -50%) translate3d(calc(var(--mx) * -10px), calc(var(--my) * -7px), -30px) rotateX(70deg);
    }
    .orbit--b {
      width: 78%; aspect-ratio: 1;
      transform: translate(-50%, -50%) translate3d(calc(var(--mx) * -16px), calc(var(--my) * -11px), 0) rotateX(70deg) rotateY(-14deg);
    }
    .orbit__spin {
      position: relative; width: 100%; height: 100%; border-radius: 50%;
      border: 1.5px solid rgba(116, 83, 242, .32); border-top-color: rgba(32, 96, 240, .9); border-bottom-color: transparent;
      animation: h3d-spin 9s linear infinite;
    }
    .orbit__spin--rev {
      border-style: dashed; border-color: rgba(177, 184, 196, .28); border-top-color: rgba(116, 83, 242, .75);
      animation: h3d-spin 14s linear infinite reverse;
    }
    .sat {
      position: absolute; top: -5px; left: 50%; width: 10px; height: 10px; border-radius: 50%;
      background: #2060f0; box-shadow: 0 0 14px 3px rgba(32, 96, 240, .8);
    }
    .sat--b { background: #7435f2; box-shadow: 0 0 14px 3px rgba(116, 83, 242, .8); }

    /* ---------- floating chips ---------- */
    .chip3d { position: absolute; transform-style: preserve-3d; }
    .chip3d__in {
      display: inline-flex; align-items: center; gap: .45rem;
      padding: .55rem .95rem; border-radius: 14px; white-space: nowrap;
      background: rgba(23, 23, 28, .74); border: 1px solid rgba(116, 83, 242, .4);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      color: #f2f3f7; font-size: .8rem; font-weight: 600;
      box-shadow: 0 16px 40px rgba(15, 15, 15, .5);
      animation: h3d-float 5s ease-in-out infinite;
    }
    .chip3d--1 { top: 8%; right: 1%; transform: translate3d(calc(var(--mx) * 34px), calc(var(--my) * 24px), 130px); }
    .chip3d--1 .chip3d__in { animation-delay: .6s; }
    .chip3d--2 { top: 27%; left: -2%; transform: translate3d(calc(var(--mx) * 26px), calc(var(--my) * 18px), 110px); }
    .chip3d--2 .chip3d__in { animation-delay: 1.3s; }
    .chip3d--3 { bottom: 19%; right: 3%; transform: translate3d(calc(var(--mx) * 30px), calc(var(--my) * 20px), 120px); }
    .chip3d--3 .chip3d__in { animation-delay: .9s; }
    .chip3d--4 { bottom: 6%; left: 7%; transform: translate3d(calc(var(--mx) * 38px), calc(var(--my) * 26px), 140px); }
    .chip3d--4 .chip3d__in { animation-delay: 1.8s; }

    .live-dot {
      width: 8px; height: 8px; border-radius: 50%; background: #10b981;
      box-shadow: 0 0 10px 2px rgba(16, 185, 129, .7);
      animation: h3d-live 2s ease-in-out infinite;
    }

    /* ---------- particles ---------- */
    .dot { position: absolute; transform-style: preserve-3d; }
    .dot i {
      display: block; width: 7px; height: 7px; border-radius: 50%;
      background: #7435f2; box-shadow: 0 0 12px 2px rgba(116, 83, 242, .75);
      animation: h3d-pulse 3s ease-in-out infinite;
    }
    .dot--1 { top: 13%; left: 17%; transform: translateZ(60px); }
    .dot--2 { top: 66%; right: 13%; transform: translateZ(80px); }
    .dot--2 i { background: #2060f0; box-shadow: 0 0 12px 2px rgba(32, 96, 240, .75); animation-delay: 1s; }
    .dot--3 { top: 38%; right: 5%; transform: translateZ(40px); }
    .dot--3 i { animation-delay: 1.6s; }
    .dot--4 { bottom: 27%; left: 5%; transform: translateZ(70px); }
    .dot--4 i { background: #2060f0; box-shadow: 0 0 12px 2px rgba(32, 96, 240, .75); animation-delay: .4s; }

    /* ---------- keyframes ---------- */
    @keyframes h3d-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    @keyframes h3d-spin { to { transform: rotate(360deg); } }
    @keyframes h3d-shine {
      0% { transform: translateX(-170%) skewX(-14deg); }
      55%, 100% { transform: translateX(170%) skewX(-14deg); }
    }
    @keyframes h3d-pulse { 0%, 100% { opacity: .45; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
    @keyframes h3d-live { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
    @keyframes h3d-glow { 0%, 100% { opacity: .8; } 50% { opacity: 1; } }

    @media (max-width: 560px) {
      .chip3d__in { font-size: .68rem; padding: .4rem .7rem; }
      .orbit--a { width: 108%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .lcard__in, .chip3d__in, .orbit__spin, .dot i, .scene__glow, .lcard__shine, .live-dot { animation: none !important; }
    }
  `],
})
export class HeroLogo3dComponent {
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const host: HTMLElement = this.el.nativeElement;
      const tilt = host.querySelector<HTMLElement>('.tilt');
      if (!tilt) return;

      let targetRx = 0, targetRy = 0, tMx = 0, tMy = 0;
      let curRx = 0, curRy = 0, curMx = 0, curMy = 0;
      let lastMove = 0, t = 0, raf = 0;

      const onMove = (e: MouseEvent) => {
        const r = host.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 2 - 1;
        const y = ((e.clientY - r.top) / r.height) * 2 - 1;
        targetRy = x * 14;
        targetRx = -y * 10;
        tMx = x; tMy = y;
        lastMove = performance.now();
      };
      const onLeave = () => { targetRx = 0; targetRy = 0; tMx = 0; tMy = 0; };

      const loop = (now: number) => {
        t += 0.016;
        // idle sway when the mouse is quiet (also drives touch devices)
        if (now - lastMove > 2200) {
          targetRy = Math.sin(t * 0.7) * 10;
          targetRx = Math.cos(t * 0.5) * 6 - 2;
          tMx = Math.sin(t * 0.7) * 0.5;
          tMy = Math.cos(t * 0.5) * 0.4;
        }
        curRx += (targetRx - curRx) * 0.055;
        curRy += (targetRy - curRy) * 0.055;
        curMx += (tMx - curMx) * 0.055;
        curMy += (tMy - curMy) * 0.055;
        tilt.style.transform = `rotateX(${curRx.toFixed(2)}deg) rotateY(${curRy.toFixed(2)}deg)`;
        tilt.style.setProperty('--mx', curMx.toFixed(3));
        tilt.style.setProperty('--my', curMy.toFixed(3));
        raf = requestAnimationFrame(loop);
      };

      host.addEventListener('mousemove', onMove);
      host.addEventListener('mouseleave', onLeave);
      raf = requestAnimationFrame(loop);

      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(raf);
        host.removeEventListener('mousemove', onMove);
        host.removeEventListener('mouseleave', onLeave);
      });
    });
  }
}
