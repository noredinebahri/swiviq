import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TPipe } from '../core/i18n/i18n.service';
import { SeoService, SITE_URL } from '../core/seo.service';
import { RevealDirective } from '../shared/reveal.directive';
import { ServiceIconComponent } from '../shared/svg';
import { ApiService, Pricing, Quote } from '../core/api.service';

type Complexity = 'simple' | 'standard' | 'advanced';
type Urgency = 'normal' | 'fast' | 'express';

@Component({
  selector: 'svq-devis',
  imports: [FormsModule, DecimalPipe, TPipe, RevealDirective, ServiceIconComponent],
  template: `
    <section class="page-head section--dark">
      <div class="container">
        <h1 svqReveal>{{ 'devis.title' | t }}</h1>
        <p svqReveal class="reveal-d1">{{ 'devis.sub' | t }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        @if (done(); as quote) {
          <!-- ======== SUCCESS ======== -->
          <div class="card success" svqReveal>
            <svg width="64" height="64" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="24" stroke="url(#sg)" stroke-width="3"/>
              <path d="M16 27l7 7 13-14" stroke="url(#sg)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="52" y2="52"><stop stop-color="#7435F2"/><stop offset="1" stop-color="#2060F0"/></linearGradient></defs>
            </svg>
            <h2>{{ 'devis.success' | t }}</h2>
            <p>{{ 'devis.successSub' | t }} <strong>{{ quote.number }}</strong></p>
            <p class="total">{{ quote.totalTTC | number:'1.2-2' }} MAD TTC</p>
            <div class="success__actions">
              <a [href]="pdfUrl(quote)" target="_blank" rel="noopener" class="btn btn--primary">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ 'devis.download' | t }}
              </a>
              <button class="btn btn--ghost" (click)="reset()">{{ 'devis.newQuote' | t }}</button>
            </div>
          </div>
        } @else {
          <!-- ======== STEPPER ======== -->
          <ol class="steps" svqReveal>
            @for (s of [1,2,3,4]; track s) {
              <li [class.on]="step() >= s" [class.now]="step() === s">
                <span class="steps__dot">{{ s }}</span>
                <span class="steps__label">{{ 'devis.step' + s | t }}</span>
              </li>
            }
          </ol>

          <div class="layout">
            <div class="main card">
              <!-- STEP 1: services -->
              @if (step() === 1) {
                <h2>{{ 'devis.chooseServices' | t }}</h2>
                @if (stepError()) { <p class="err">{{ 'devis.required' | t }}</p> }
                <div class="grid grid-2 picks">
                  @for (s of pricing()?.services ?? []; track s.id) {
                    <button type="button" class="pick" [class.on]="selected().includes(s.id)" (click)="toggleService(s.id)">
                      <svq-icon [name]="s.id" [size]="36" />
                      <span class="pick__label">{{ 'services.items.' + s.id + '.title' | t }}</span>
                      <span class="pick__price">{{ s.basePrice | number }} MAD</span>
                      <span class="pick__check" aria-hidden="true">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="m5 13 5 5L20 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </span>
                    </button>
                  }
                </div>
              }

              <!-- STEP 2: options + complexity + urgency -->
              @if (step() === 2) {
                <h2>{{ 'devis.chooseOptions' | t }}</h2>
                <div class="grid grid-2 picks">
                  @for (o of pricing()?.options ?? []; track o.id) {
                    <button type="button" class="pick pick--sm" [class.on]="options().includes(o.id)" (click)="toggleOption(o.id)">
                      <span class="pick__label">{{ o.label }}</span>
                      <span class="pick__price">+{{ o.price | number }} MAD</span>
                      <span class="pick__check" aria-hidden="true">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="m5 13 5 5L20 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </span>
                    </button>
                  }
                </div>

                <h3>{{ 'devis.complexity' | t }}</h3>
                <div class="seg">
                  @for (c of complexities; track c) {
                    <button type="button" [class.on]="complexity() === c" (click)="complexity.set(c)">
                      <strong>
                        {{ 'devis.c' + cap(c) | t }}
                        @if (complexityPct(c); as p) { <em class="seg__pct">{{ p }}</em> }
                      </strong>
                      <small>{{ 'devis.c' + cap(c) + 'D' | t }}</small>
                    </button>
                  }
                </div>

                <h3>{{ 'devis.urgency' | t }}</h3>
                <div class="seg">
                  @for (u of urgencies; track u) {
                    <button type="button" [class.on]="urgency() === u" (click)="urgency.set(u)">
                      <strong>
                        {{ 'devis.u' + cap(u) | t }}
                        @if (urgencyPct(u); as p) { <em class="seg__pct">{{ p }}</em> }
                      </strong>
                      <small>{{ 'devis.u' + cap(u) + 'D' | t }}</small>
                    </button>
                  }
                </div>
              }

              <!-- STEP 3: customer info -->
              @if (step() === 3) {
                <h2>{{ 'devis.yourInfo' | t }}</h2>
                @if (stepError()) { <p class="err">{{ 'devis.invalid' | t }}</p> }
                <div class="grid grid-2 fields">
                  <div class="field">
                    <label for="q-name">{{ 'devis.name' | t }}</label>
                    <input id="q-name" [(ngModel)]="customer.name" maxlength="120" />
                  </div>
                  <div class="field">
                    <label for="q-company">{{ 'devis.company' | t }}</label>
                    <input id="q-company" [(ngModel)]="customer.company" maxlength="160" />
                  </div>
                  <div class="field">
                    <label for="q-email">{{ 'devis.email' | t }}</label>
                    <input id="q-email" type="email" [(ngModel)]="customer.email" maxlength="180" />
                  </div>
                  <div class="field">
                    <label for="q-phone">{{ 'devis.phone' | t }}</label>
                    <input id="q-phone" [(ngModel)]="customer.phone" maxlength="30" />
                  </div>
                  <div class="field">
                    <label for="q-ice">{{ 'devis.ice' | t }}</label>
                    <input id="q-ice" [(ngModel)]="customer.ice" maxlength="20" />
                  </div>
                  <div class="field">
                    <label for="q-addr">{{ 'devis.address' | t }}</label>
                    <input id="q-addr" [(ngModel)]="customer.address" maxlength="240" />
                  </div>
                </div>
                <div class="field">
                  <label for="q-desc">{{ 'devis.description' | t }}</label>
                  <textarea id="q-desc" [(ngModel)]="description" rows="4" maxlength="2000"></textarea>
                </div>
              }

              <!-- STEP 4: summary -->
              @if (step() === 4) {
                <h2>{{ 'devis.summary' | t }}</h2>
                <ul class="sum">
                  <!-- Prix catalogue brut : c'est le montant lu sur la carte à
                       l'étape 1. Les coefficients apparaissent ensuite comme
                       des lignes distinctes — auparavant ils étaient fondus
                       dans cette ligne, qui affichait donc un prix sans rapport
                       avec celui annoncé. -->
                  @for (s of selectedServices(); track s.id) {
                    <li><span>{{ 'services.items.' + s.id + '.title' | t }}</span><span>{{ s.basePrice | number:'1.0-0' }} MAD</span></li>
                  }
                  @if (complexityDelta() !== 0) {
                    <li class="sum__adj">
                      <span>{{ 'devis.complexity' | t }} — {{ 'devis.c' + cap(complexity()) | t }} ({{ complexityPct(complexity()) }})</span>
                      <span>{{ complexityDelta() > 0 ? '+' : '' }}{{ complexityDelta() | number:'1.0-0' }} MAD</span>
                    </li>
                  }
                  @if (urgencyDelta() !== 0) {
                    <li class="sum__adj">
                      <span>{{ 'devis.urgency' | t }} — {{ 'devis.u' + cap(urgency()) | t }} ({{ urgencyPct(urgency()) }})</span>
                      <span>{{ urgencyDelta() > 0 ? '+' : '' }}{{ urgencyDelta() | number:'1.0-0' }} MAD</span>
                    </li>
                  }
                  @for (o of selectedOptions(); track o.id) {
                    <li><span>{{ o.label }}</span><span>{{ o.price | number }} MAD</span></li>
                  }
                </ul>
                <div class="totals">
                  <div><span>{{ 'devis.subtotal' | t }}</span><strong>{{ subtotal() | number:'1.2-2' }} MAD</strong></div>
                  <div><span>{{ 'devis.vat' | t }}</span><strong>{{ vat() | number:'1.2-2' }} MAD</strong></div>
                  <div class="grand"><span>{{ 'devis.total' | t }}</span><strong>{{ total() | number:'1.2-2' }} MAD</strong></div>
                </div>
                <p class="validity">{{ 'devis.validity' | t }}</p>
                @if (submitError()) { <p class="err">{{ 'devis.error' | t }}</p> }
              }

              <!-- NAV -->
              <div class="nav">
                @if (step() > 1) {
                  <button class="btn btn--ghost" (click)="back()">{{ 'devis.back' | t }}</button>
                }
                @if (step() < 4) {
                  <button class="btn btn--primary" (click)="next()">{{ 'devis.next' | t }}</button>
                } @else {
                  <button class="btn btn--primary" (click)="submit()" [disabled]="loading()">
                    @if (loading()) { <span class="spinner"></span> } @else { {{ 'devis.submit' | t }} }
                  </button>
                }
              </div>
            </div>

            <!-- LIVE ESTIMATE -->
            <aside class="est card">
              <h3>{{ 'devis.estimated' | t }}</h3>
              <div class="est__total">{{ total() | number:'1.0-0' }} <small>MAD TTC</small></div>
              <div class="est__rows">
                <div><span>{{ 'devis.subtotal' | t }}</span><span>{{ subtotal() | number:'1.0-0' }}</span></div>
                <div><span>{{ 'devis.vat' | t }}</span><span>{{ vat() | number:'1.0-0' }}</span></div>
              </div>
            </aside>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .page-head { padding: calc(var(--header-h) + 3.5rem) 0 3.5rem; background: var(--c-ink); position: relative; overflow: hidden; }
    .page-head::before { content: ''; position: absolute; inset: 0; background: var(--grad-hero); }
    .page-head .container { position: relative; }
    .page-head h1 { color: #fff; font-size: clamp(2rem, 4.5vw, 3rem); margin-bottom: .8rem; }
    .page-head p { color: var(--c-text-inverse-soft); }

    .steps { display: flex; list-style: none; gap: .5rem; margin-bottom: 2rem; }
    .steps li { flex: 1; display: flex; align-items: center; gap: .6rem; opacity: .45; transition: opacity .3s; }
    .steps li.on { opacity: 1; }
    .steps__dot {
      display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%;
      border: 2px solid var(--c-border); font-weight: 700; font-size: .85rem; flex-shrink: 0;
      transition: .3s;
    }
    .steps li.on .steps__dot { background: var(--grad-brand); border-color: transparent; color: #fff; }
    .steps li.now .steps__dot { box-shadow: 0 0 0 5px rgba(116,83,242,.18); }
    .steps__label { font-weight: 600; font-size: .88rem; }
    @media (max-width: 640px) { .steps__label { display: none; } }

    .layout { display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; align-items: start; }
    @media (max-width: 880px) { .layout { grid-template-columns: 1fr; } .est { order: -1; } }
    .main { padding: 2rem; }
    .main h2 { font-size: 1.3rem; margin-bottom: 1.4rem; }
    .main h3 { font-size: 1.05rem; margin: 1.8rem 0 .9rem; }

    .picks { margin-bottom: .5rem; }
    .pick {
      position: relative; display: flex; align-items: center; gap: .9rem; text-align: start;
      padding: 1.1rem 1.2rem; border: 2px solid var(--c-border); border-radius: var(--radius);
      transition: border-color .25s, background .25s, transform .2s;
      background: #fff; width: 100%;
    }
    .pick:hover { border-color: var(--c-primary-300); transform: translateY(-2px); }
    .pick.on { border-color: var(--c-primary); background: var(--grad-brand-soft); }
    .pick__label { font-weight: 600; font-size: .92rem; flex: 1; }
    .pick__price { font-size: .82rem; font-weight: 700; color: var(--c-primary); white-space: nowrap; }
    .pick__check {
      position: absolute; top: -9px; inset-inline-end: -9px; width: 24px; height: 24px; border-radius: 50%;
      background: var(--grad-brand); display: grid; place-items: center;
      opacity: 0; transform: scale(.5); transition: .25s var(--ease-spring);
    }
    .pick.on .pick__check { opacity: 1; transform: scale(1); }

    .seg { display: grid; grid-template-columns: repeat(3, 1fr); gap: .8rem; }
    @media (max-width: 640px) { .seg { grid-template-columns: 1fr; } }
    .seg button {
      display: flex; flex-direction: column; gap: .2rem; text-align: start;
      padding: .95rem 1.1rem; border: 2px solid var(--c-border); border-radius: var(--radius);
      transition: .25s; background: #fff;
    }
    .seg button.on { border-color: var(--c-primary); background: var(--grad-brand-soft); }
    .seg strong { font-size: .95rem; display: flex; align-items: baseline; gap: .4rem; flex-wrap: wrap; }
    .seg small { font-size: .78rem; color: var(--c-text-soft); }
    .seg__pct { font-style: normal; font-size: .74rem; font-weight: 600; color: var(--c-primary);
                background: var(--grad-brand-soft); border-radius: 999px; padding: .1rem .45rem; white-space: nowrap; }

    .fields { gap: 0 1.2rem; }
    .err { color: var(--c-danger); font-size: .9rem; margin-bottom: 1rem; }

    .sum { list-style: none; margin-bottom: 1.4rem; }
    .sum li { display: flex; justify-content: space-between; gap: 1rem; padding: .55rem 0; border-bottom: 1px dashed var(--c-border); font-size: .93rem; }
    .sum__adj { color: var(--c-text-soft); font-size: .87rem; }
    .totals div { display: flex; justify-content: space-between; padding: .4rem 0; color: var(--c-text-soft); }
    .totals .grand { font-size: 1.15rem; color: var(--c-ink); border-top: 2px solid var(--c-border); margin-top: .4rem; padding-top: .8rem; }
    .totals .grand strong { color: var(--c-primary); }
    .validity { font-size: .82rem; color: var(--c-text-soft); margin-top: 1rem; }

    .nav { display: flex; justify-content: space-between; gap: 1rem; margin-top: 2rem; }
    .nav .btn--primary { margin-inline-start: auto; }

    .est { position: sticky; top: calc(var(--header-h) + 1rem); padding: 1.6rem; }
    .est h3 { font-size: .85rem; text-transform: uppercase; letter-spacing: .08em; color: var(--c-text-soft); margin-bottom: .8rem; }
    .est__total { font-family: var(--font-display); font-size: 2.1rem; font-weight: 700; color: var(--c-primary); }
    .est__total small { font-size: .9rem; color: var(--c-text-soft); font-family: var(--font-body); }
    .est__rows { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--c-border); }
    .est__rows div { display: flex; justify-content: space-between; font-size: .88rem; color: var(--c-text-soft); padding: .25rem 0; }

    .success { text-align: center; padding: 3.5rem 2rem; display: flex; flex-direction: column; align-items: center; gap: .8rem; max-width: 620px; margin-inline: auto; }
    .success h2 { font-size: 1.5rem; }
    .success .total { font-family: var(--font-display); font-size: 1.9rem; font-weight: 700; color: var(--c-primary); }
    .success__actions { display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; justify-content: center; }
  `],
})
export class DevisComponent implements OnInit {
  private seo = inject(SeoService);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  pricing = signal<Pricing | null>(null);
  step = signal(1);
  selected = signal<string[]>([]);
  options = signal<string[]>([]);
  complexity = signal<Complexity>('standard');
  urgency = signal<Urgency>('normal');
  customer = { name: '', company: '', email: '', phone: '', ice: '', address: '' };
  description = '';
  loading = signal(false);
  stepError = signal(false);
  submitError = signal(false);
  done = signal<Quote | null>(null);

  complexities: Complexity[] = ['simple', 'standard', 'advanced'];
  urgencies: Urgency[] = ['normal', 'fast', 'express'];

  selectedServices = computed(() =>
    (this.pricing()?.services ?? []).filter(s => this.selected().includes(s.id)));
  selectedOptions = computed(() =>
    (this.pricing()?.options ?? []).filter(o => this.options().includes(o.id)));

  /** Somme des prix catalogue, avant tout coefficient — le montant affiché sur les cartes. */
  servicesBase = computed(() =>
    this.selectedServices().reduce((sum, s) => sum + s.basePrice, 0));

  cMult = computed(() => this.pricing()?.complexityMultipliers[this.complexity()] ?? 1);
  uMult = computed(() => this.pricing()?.urgencyMultipliers[this.urgency()] ?? 1);

  // Le sous-total vaut base × cMult × uMult + options. On l'expose ici en
  // écarts successifs pour que le récapitulatif puisse montrer d'où vient
  // chaque dirham : base + (base × (c−1)) + (base × c × (u−1)) donne
  // exactement base × c × u. L'urgence porte sur le montant déjà ajusté par
  // la complexité, d'où le × cMult dans son écart.
  complexityDelta = computed(() => this.servicesBase() * (this.cMult() - 1));
  urgencyDelta = computed(() => this.servicesBase() * this.cMult() * (this.uMult() - 1));

  subtotal = computed(() => {
    if (!this.pricing()) return 0;
    const opts = this.selectedOptions().reduce((sum, o) => sum + o.price, 0);
    return this.servicesBase() + this.complexityDelta() + this.urgencyDelta() + opts;
  });
  vat = computed(() => this.subtotal() * (this.pricing()?.vatRate ?? 0.2));
  total = computed(() => this.subtotal() + this.vat());

  ngOnInit() {
    this.seo.apply({
      title: 'Devis en ligne instantané — Application, SaaS, E-commerce | SWIVIQ',
      description: 'Configurez votre projet digital et obtenez immédiatement un devis PDF détaillé : développement web, mobile, SaaS, e-commerce. Gratuit et sans engagement.',
      path: '/devis',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Devis en ligne SWIVIQ',
        url: `${SITE_URL}/devis`,
      },
    });
    this.api.getPublicSettings().subscribe({
      next: s => {
        this.pricing.set(s.pricing);
        const pre = this.route.snapshot.queryParamMap.get('service');
        if (pre && s.pricing.services.some(x => x.id === pre)) this.selected.set([pre]);
      },
      error: () => {},
    });
  }

  cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /**
   * Écart d'un coefficient par rapport au tarif catalogue, en pourcentage
   * signé (« +35 % », « −25 % »), ou chaîne vide quand il vaut 1.
   *
   * Affiché sur chaque bouton pour que la majoration soit visible AVANT le
   * clic : c'est son absence sur la complexité qui rendait le total
   * incompréhensible, alors que l'urgence, elle, annonçait déjà son taux.
   * La valeur est dérivée du barème renvoyé par l'API — jamais écrite en dur
   * dans les traductions, sinon le libellé ment dès qu'un tarif change.
   */
  pct(mult: number | undefined): string {
    if (mult == null || mult === 1) return '';
    const delta = Math.round((mult - 1) * 100);
    return `${delta > 0 ? '+' : '−'}${Math.abs(delta)} %`;
  }

  complexityPct(c: Complexity) { return this.pct(this.pricing()?.complexityMultipliers[c]); }
  urgencyPct(u: Urgency) { return this.pct(this.pricing()?.urgencyMultipliers[u]); }

  toggleService(id: string) {
    this.selected.update(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
    this.stepError.set(false);
  }
  toggleOption(id: string) {
    this.options.update(list => list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  next() {
    if (this.step() === 1 && this.selected().length === 0) { this.stepError.set(true); return; }
    if (this.step() === 3 && (!this.customer.name.trim() || !this.customer.email.includes('@'))) {
      this.stepError.set(true); return;
    }
    this.stepError.set(false);
    this.step.update(s => Math.min(4, s + 1));
  }
  back() { this.stepError.set(false); this.step.update(s => Math.max(1, s - 1)); }

  submit() {
    this.loading.set(true);
    this.submitError.set(false);
    const c = this.customer;
    this.api.createQuote({
      customer: {
        name: c.name.trim(), email: c.email.trim(),
        ...(c.company.trim() && { company: c.company.trim() }),
        ...(c.phone.trim() && { phone: c.phone.trim() }),
        ...(c.ice.trim() && { ice: c.ice.trim() }),
        ...(c.address.trim() && { address: c.address.trim() }),
      },
      serviceIds: this.selected(),
      optionIds: this.options(),
      complexity: this.complexity(),
      urgency: this.urgency(),
      ...(this.description.trim() && { description: this.description.trim() }),
    }).subscribe({
      next: quote => { this.done.set(quote); this.loading.set(false); window.scrollTo({ top: 0 }); },
      error: () => { this.submitError.set(true); this.loading.set(false); },
    });
  }

  pdfUrl(quote: Quote) { return this.api.quotePdfUrl(quote); }

  reset() {
    this.done.set(null);
    this.step.set(1);
    this.selected.set([]);
    this.options.set([]);
    this.customer = { name: '', company: '', email: '', phone: '', ice: '', address: '' };
    this.description = '';
  }
}
