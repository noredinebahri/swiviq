import { Component, computed, input } from '@angular/core';

/* ============================================================
   SWIVIQ — Custom professional SVG artwork
   Official logo (real brand asset), service icons and hero
   illustration — palette: Han Purple / Smoky Black / Cadet Blue.
   ============================================================ */

@Component({
  selector: 'svq-logo',
  template: `
    <img [src]="src()" [style.height.px]="size()" alt="SWIVIQ" class="logo-img" />
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; }
    .logo-img { display: block; width: auto; }
  `],
})
export class LogoComponent {
  size = input(34);
  /** 'color' for light backgrounds, 'white' for dark backgrounds */
  variant = input<'color' | 'white'>('color');
  protected src = computed(() => this.variant() === 'white' ? '/logo-white.png' : '/logo.png');
}

@Component({
  selector: 'svq-icon',
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient [attr.id]="'g-' + name()" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7435F2"/><stop offset="1" stop-color="#2060F0"/>
        </linearGradient>
      </defs>
      @switch (name()) {
        @case ('web-app') {
          <rect x="5" y="8" width="38" height="28" rx="4" [attr.stroke]="grad()" stroke-width="2.6"/>
          <path d="M5 16h38" [attr.stroke]="grad()" stroke-width="2.6"/>
          <circle cx="10.5" cy="12" r="1.6" [attr.fill]="grad()"/>
          <circle cx="15.5" cy="12" r="1.6" [attr.fill]="grad()"/>
          <path d="M13 24l-4 4 4 4M22 24l4 4-4 4M19.5 33l3-10" [attr.stroke]="grad()" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M30 26h8M30 31h5" [attr.stroke]="grad()" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
          <path d="M18 40h12M24 36v4" [attr.stroke]="grad()" stroke-width="2.6" stroke-linecap="round"/>
        }
        @case ('mobile-app') {
          <rect x="14" y="4" width="20" height="40" rx="5" [attr.stroke]="grad()" stroke-width="2.6"/>
          <path d="M21 8.5h6" [attr.stroke]="grad()" stroke-width="2.4" stroke-linecap="round"/>
          <circle cx="24" cy="38.5" r="1.8" [attr.fill]="grad()"/>
          <rect x="18.5" y="14" width="11" height="8" rx="2" [attr.stroke]="grad()" stroke-width="2.2" opacity=".8"/>
          <path d="M18.5 27h11M18.5 31.5h7" [attr.stroke]="grad()" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
          <path d="M38 14c3 2.5 3 7.5 0 10M42 11c5 4.5 5 11.5 0 16" [attr.stroke]="grad()" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
        }
        @case ('saas') {
          <path d="M15 34a8 8 0 0 1-1.2-15.9 11 11 0 0 1 21.4-2.4A9 9 0 0 1 34 34H15Z" [attr.stroke]="grad()" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M18 40h3M23 40h3M28 40h3" [attr.stroke]="grad()" stroke-width="2.6" stroke-linecap="round" opacity=".6"/>
          <path d="M20 26l3 3 6-6" [attr.stroke]="grad()" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        }
        @case ('ecommerce') {
          <path d="M6 8h5l5 24h20l4-16H14" [attr.stroke]="grad()" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="19" cy="40" r="3" [attr.stroke]="grad()" stroke-width="2.6"/>
          <circle cx="33" cy="40" r="3" [attr.stroke]="grad()" stroke-width="2.6"/>
          <path d="M24 21l3 3 6-6" [attr.stroke]="grad()" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
        }
        @case ('intermediation') {
          <circle cx="11" cy="24" r="6" [attr.stroke]="grad()" stroke-width="2.6"/>
          <circle cx="37" cy="10" r="5" [attr.stroke]="grad()" stroke-width="2.6"/>
          <circle cx="37" cy="38" r="5" [attr.stroke]="grad()" stroke-width="2.6"/>
          <path d="M16.4 21.2 32 12.5M16.4 26.8 32 35.5" [attr.stroke]="grad()" stroke-width="2.4" stroke-linecap="round"/>
          <circle cx="24" cy="17" r="1.8" [attr.fill]="grad()"/>
          <circle cx="24" cy="31" r="1.8" [attr.fill]="grad()"/>
        }
        @case ('conciergerie') {
          <path d="M24 12a14 14 0 0 1 14 14H10a14 14 0 0 1 14-14Z" [attr.stroke]="grad()" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M24 12V8M21 8h6" [attr.stroke]="grad()" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M6 32h36" [attr.stroke]="grad()" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M31 38l4 4 6-7" [attr.stroke]="grad()" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
        }
        @case ('evenementiel') {
          <path d="M8 26 30 12l4 22-22-4-4-4Z" [attr.stroke]="grad()" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M14 32l-3 8" [attr.stroke]="grad()" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M36 10c2-1.5 4-2 6-2M38 18c2 0 4 .5 5.5 1.5M33 6c.5-2 1.5-3.5 3-4.5" [attr.stroke]="grad()" stroke-width="2.3" stroke-linecap="round" opacity=".7"/>
          <circle cx="43" cy="26" r="1.8" [attr.fill]="grad()"/>
          <circle cx="40" cy="4" r="1.6" [attr.fill]="grad()"/>
        }
        @case ('conseil') {
          <circle cx="24" cy="24" r="8" [attr.stroke]="grad()" stroke-width="2.6"/>
          <circle cx="24" cy="24" r="2.4" [attr.fill]="grad()"/>
          <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M36.7 11.3l-4.2 4.2M15.5 32.5l-4.2 4.2" [attr.stroke]="grad()" stroke-width="2.5" stroke-linecap="round"/>
        }
        @default {
          <circle cx="24" cy="24" r="18" [attr.stroke]="grad()" stroke-width="2.6"/>
        }
      }
    </svg>
  `,
})
export class ServiceIconComponent {
  name = input.required<string>();
  size = input(48);
  grad() { return `url(#g-${this.name()})`; }
}

@Component({
  selector: 'svq-hero-art',
  template: `
    <svg viewBox="0 0 560 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="hero-art">
      <defs>
        <linearGradient id="ha-1" x1="0" y1="0" x2="560" y2="520" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7435F2"/><stop offset="1" stop-color="#2060F0"/>
        </linearGradient>
        <linearGradient id="ha-2" x1="100" y1="80" x2="480" y2="440" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7435F2" stop-opacity=".25"/><stop offset="1" stop-color="#2060F0" stop-opacity=".08"/>
        </linearGradient>
        <filter id="ha-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- orbit rings -->
      <g opacity=".5">
        <ellipse cx="280" cy="260" rx="240" ry="120" stroke="url(#ha-1)" stroke-opacity=".35" stroke-dasharray="3 8" transform="rotate(-18 280 260)">
          <animateTransform attributeName="transform" type="rotate" from="-18 280 260" to="342 280 260" dur="60s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="280" cy="260" rx="190" ry="90" stroke="url(#ha-1)" stroke-opacity=".25" transform="rotate(24 280 260)"/>
      </g>

      <!-- main app window -->
      <g class="float-a">
        <rect x="130" y="120" width="300" height="220" rx="18" fill="#17171C" stroke="url(#ha-1)" stroke-opacity=".5"/>
        <rect x="130" y="120" width="300" height="40" rx="18" fill="url(#ha-2)"/>
        <circle cx="152" cy="140" r="4" fill="#EF4444"/><circle cx="166" cy="140" r="4" fill="#F59E0B"/><circle cx="180" cy="140" r="4" fill="#10B981"/>
        <rect x="152" y="178" width="120" height="10" rx="5" fill="#7435F2" opacity=".85"/>
        <rect x="152" y="200" width="180" height="8" rx="4" fill="#B1B8C4" opacity=".4"/>
        <rect x="152" y="216" width="150" height="8" rx="4" fill="#B1B8C4" opacity=".3"/>
        <!-- chart -->
        <path d="M152 300 L192 272 L232 284 L272 248 L312 260 L352 226 L392 238" stroke="url(#ha-1)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="352" cy="226" r="5" fill="#2060F0" filter="url(#ha-glow)"/>
      </g>

      <!-- floating mobile -->
      <g class="float-b">
        <rect x="392" y="200" width="96" height="180" rx="16" fill="#0F0F0F" stroke="url(#ha-1)" stroke-opacity=".7"/>
        <rect x="410" y="228" width="60" height="8" rx="4" fill="#7435F2"/>
        <rect x="410" y="246" width="42" height="6" rx="3" fill="#B1B8C4" opacity=".4"/>
        <rect x="408" y="266" width="64" height="44" rx="8" fill="url(#ha-2)" stroke="url(#ha-1)" stroke-opacity=".4"/>
        <path d="M420 292l8 8 16-16" stroke="#2060F0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <rect x="410" y="322" width="60" height="6" rx="3" fill="#B1B8C4" opacity=".35"/>
        <rect x="410" y="336" width="46" height="6" rx="3" fill="#B1B8C4" opacity=".25"/>
      </g>

      <!-- floating badge: cloud -->
      <g class="float-c">
        <rect x="80" y="330" width="150" height="56" rx="14" fill="#17171C" stroke="url(#ha-1)" stroke-opacity=".5"/>
        <path d="M107 366a9 9 0 0 1-1.3-17.9 12 12 0 0 1 23.4-2.6A10 10 0 0 1 128 366h-21Z" stroke="url(#ha-1)" stroke-width="2.4" fill="none"/>
        <rect x="142" y="346" width="70" height="8" rx="4" fill="#7435F2" opacity=".8"/>
        <rect x="142" y="362" width="50" height="7" rx="3.5" fill="#B1B8C4" opacity=".4"/>
      </g>

      <!-- spark nodes -->
      <circle cx="120" cy="96" r="6" fill="#2060F0" filter="url(#ha-glow)" class="pulse"/>
      <circle cx="470" cy="120" r="5" fill="#7435F2" filter="url(#ha-glow)" class="pulse"/>
      <circle cx="500" cy="400" r="7" fill="#2060F0" opacity=".8" filter="url(#ha-glow)" class="pulse"/>
    </svg>
  `,
  styles: [`
    :host { display: block; }
    .hero-art { width: 100%; height: auto; }
    .float-a { animation: float 7s ease-in-out infinite; }
    .float-b { animation: float 6s ease-in-out 0.8s infinite; }
    .float-c { animation: float 8s ease-in-out 1.6s infinite; }
    .pulse { animation: pulse-soft 3.5s ease-in-out infinite; }
  `],
})
export class HeroArtComponent {}
