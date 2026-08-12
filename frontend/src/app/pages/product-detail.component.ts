import { Component, ElementRef, inject, OnInit, signal, ViewChild, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TPipe, I18nService, Lang } from '../core/i18n/i18n.service';
import { SeoService, SITE_URL } from '../core/seo.service';
import { RevealDirective } from '../shared/reveal.directive';
import { SceneSpyDirective } from '../shared/scene-spy.directive';
import { ApiService, Product, Plan, ProductSection } from '../core/api.service';
import { ImgFallbackDirective } from '../shared/img-fallback.directive';

@Component({
  selector: 'svq-product-detail',
  imports: [RouterLink, TPipe, RevealDirective, SceneSpyDirective, CommonModule, FormsModule, ImgFallbackDirective],
  template: `
    @if (loading()) {
      <div class="loader section"><span class="spinner"></span></div>
    } @else if (notFound()) {
      <section class="section">
        <div class="container center">
          <h1 class="pg-title">{{ 'products.notFound' | t }}</h1>
          <a routerLink="/produits" class="btn btn--primary mt-2">{{ 'products.backToProducts' | t }}</a>
        </div>
      </section>
    } @else {
      <!-- ============ HERO ============ -->
      <section class="pdet-hero section--dark">
        <div class="pdet-hero__bg" aria-hidden="true"></div>
        <div class="container pdet-hero__in">
          <div class="pdet-hero__copy" svqReveal>
            <div class="pdet-hero__badges">
              <span class="chip pdet-badge" [class]="typeClass()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  @if (product().type === 'app') {<rect x="2" y="3" width="20" height="18" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>}
                  @if (product().type === 'website') {<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>}
                  @if (product().type === 'saas') {<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>}
                </svg>
                {{ typeLabel() | t }}
              </span>
              @if (product().status !== 'live') {
                <span class="chip pdet-status" [class]="'status-' + product().status">{{ statusLabel() | t }}</span>
              }
            </div>
            <!-- Versions traduites : de vrais liens, pas une bascule.
                 Un moteur suit un lien ; il n'actionne pas un bouton. -->
            <nav class="pdet-langs" aria-label="Langue de la fiche">
              @for (a of altLinks(product().slug); track a.lang) {
                <a [href]="a.path" [attr.hreflang]="a.lang" [attr.lang]="a.lang"
                   [class.on]="a.lang === pageLang"
                   [attr.aria-current]="a.lang === pageLang ? 'true' : null">{{ a.label }}</a>
              }
            </nav>
            <h1 svqReveal class="reveal-d1">{{ product().name }}</h1>
            <p svqReveal class="reveal-d2 pdet-hero__tag">{{ product().tagline }}</p>
            <div svqReveal class="reveal-d3 pdet-hero__meta">
              @if (product().websiteUrl) {
                <a [href]="product().websiteUrl" target="_blank" rel="noopener" class="btn btn--ghost btn--sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  {{ 'products.visitWebsite' | t }}
                </a>
              }
              @if (product().repoUrl) {
                <a [href]="product().repoUrl" target="_blank" rel="noopener" class="btn btn--ghost btn--sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  Dépôt
                </a>
              }
            </div>
          </div>
          <div class="pdet-hero__art" svqReveal>
            <img [src]="product().coverUrl" [alt]="product().name" class="pdet-cover" loading="eager" [svqImgFallback]="product().name" [fallbackColor]="brand()" />
            <div class="pdet-cover__glow" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <!-- ============ DESCRIPTION + TECH ============ -->
      <section class="section">
        <div class="container">
          <div class="grid grid-2" style="align-items: start;">
            <div svqReveal class="reveal-d1">
              <div class="pdet-desc"><p>{{ product().description }}</p></div>
              <div class="pdet-features" svqReveal>
                <h3>{{ 'products.features' | t }}</h3>
                <ul>
                  @for (f of product().features; track f) {
                    <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>{{ f }}</li>
                  }
                </ul>
              </div>
            </div>
            <aside svqReveal class="reveal-d2">
              <div class="tech-panel card">
                <h3>{{ 'products.technologies' | t }}</h3>
                <div class="tech-cloud">
                  @for (tech of product().technologies; track tech) {
                    <span class="tech-pill">{{ tech }}</span>
                  }
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <!-- ============ DOSSIER TECHNIQUE ============ -->
      @if (sections().length) {
        <section class="dossier" [style.--foil]="brand()">
          <div class="container">

            <header class="dossier__head" svqReveal>
              <span class="dossier__kicker">{{ 'products.deepDive' | t }}</span>
              <h2>{{ 'products.deepDiveTitle' | t }}</h2>
            </header>

            <!-- Index : collé sous l'en-tête pendant toute la lecture du
                 dossier — sans ça, changer de chapitre oblige à remonter. -->
            <nav class="dossier__index" aria-label="Sommaire" #dossierIndex>
              @for (s of sections(); track s.title) {
                <a [href]="'#sec-' + sectionAnchor(s)"
                   [attr.data-anchor]="sectionAnchor(s)"
                   [class.on]="activeSection() === sectionAnchor(s)"
                   (click)="scrollToSection($event, s)">{{ s.eyebrow || s.title }}</a>
              }
            </nav>

            @for (s of sections(); track s.title; let i = $index) {
              <article class="chap" [id]="'sec-' + sectionAnchor(s)"
                       [svqSceneSpy]="i" (active)="onChapterActive($event)">

                <!-- Colonne de gauche : plaque de repère + chiffres -->
                <aside class="chap__rail">
                  <div class="chap__plate">
                    @if (s.eyebrow) { <span>{{ s.eyebrow }}</span> }
                  </div>
                  @if (s.metrics?.length) {
                    <dl class="chap__stats">
                      @for (m of s.metrics; track m.label) {
                        <div>
                          <dt>{{ m.value }}</dt>
                          <dd>{{ m.label }}</dd>
                        </div>
                      }
                    </dl>
                  }
                </aside>

                <!-- Colonne de droite : le propos -->
                <div class="chap__main" svqReveal>
                  <h3>{{ s.title }}</h3>

                  @if (s.body) {
                    @for (para of paragraphs(s.body); track $index) { <p>{{ para }}</p> }
                  }

                  <!-- Signature : ce que l'API répond vraiment -->
                  @if (s.evidence?.length) {
                    <div class="board" role="table" aria-label="Requêtes et résultats réels">
                      <div class="board__head" role="row">
                        <span role="columnheader">Requête</span>
                        <span role="columnheader">Premier résultat</span>
                        <span role="columnheader">Source</span>
                      </div>
                      @for (e of s.evidence; track e.query) {
                        <div class="board__row" role="row">
                          <span class="board__q" role="cell">{{ e.query }}</span>
                          <span class="board__r" role="cell">
                            {{ e.result }}
                            @if (e.code) { <em class="board__code">{{ e.code }}</em> }
                          </span>
                          <span class="board__s" role="cell">{{ e.source }}</span>
                        </div>
                      }
                    </div>
                  }

                  @if (s.bullets?.length) {
                    <ul class="chap__list">
                      @for (b of s.bullets; track b) { <li>{{ b }}</li> }
                    </ul>
                  }
                </div>
              </article>
            }
          </div>
        </section>
      }

      <!-- ============ STORY (cinematic gallery) ============ -->
      @if (product().photos.length) {
        <section class="section section--dark story-section">
          <div class="container">
            <div class="section-head center" svqReveal>
              <span class="eyebrow">{{ 'products.gallery' | t }}</span>
              <h2 class="section-title story-headline">{{ 'products.storyTitle' | t }}</h2>
              <p class="story-sub">{{ 'products.storySub' | t }}</p>
            </div>
            <div class="story">
              <!-- Interactive timeline rail -->
              <div class="story__rail" aria-hidden="true">
                <span class="story__rail-line"></span>
                @for (photo of product().photos; track $index; let i = $index) {
                  <button
                    type="button"
                    class="story__node"
                    [class.active]="activeScene() === i"
                    [class.passed]="i < activeScene()"
                    [style.--brand]="brand()"
                    (click)="scrollToScene(i)"
                    [attr.aria-label]="'Photo ' + (i + 1)"
                    tabindex="-1"
                  >{{ pad(i + 1) }}</button>
                }
              </div>
              <!-- Scenes -->
              <div class="story__scenes">
                @for (photo of product().photos; track $index; let i = $index) {
                  <article
                    class="story__scene"
                    [class.flip]="i % 2 === 1"
                    [id]="'scene-' + i"
                    svqReveal
                    [svqSceneSpy]="i"
                    (active)="activeScene.set($event)"
                  >
                    <figure class="story__media" (click)="openLightbox(i)" [style.--brand]="brand()">
                      <img [src]="photo.url" [alt]="photo.title || product().name" loading="lazy" [svqImgFallback]="product().name" [fallbackColor]="brand()" />
                      <span class="story__zoom">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                      </span>
                    </figure>
                    <div class="story__card" [style.--brand]="brand()">
                      <span class="story__chapter">{{ 'products.scene' | t }} {{ pad(i + 1) }} <em>/ {{ pad(product().photos.length) }}</em></span>
                      @if (photo.title) { <h3>{{ photo.title }}</h3> }
                      @if (photo.description) { <p>{{ photo.description }}</p> }
                    </div>
                  </article>
                }
              </div>
            </div>
          </div>
        </section>
      }

      <!-- ============ LIGHTBOX ============ -->
      @if (lightboxOpen()) {
        <div class="lb" (click)="closeLightbox()">
          <button class="lb__close" (click)="closeLightbox()">&times;</button>
          <div class="lb__in" (click)="$event.stopPropagation()">
            <img [src]="product().photos[lightboxIdx()].url" [alt]="product().photos[lightboxIdx()].title" />
            <div class="lb__cap">
              <h4>{{ product().photos[lightboxIdx()].title }}</h4>
              <p>{{ product().photos[lightboxIdx()].description }}</p>
            </div>
            <div class="lb__nav">
              <button (click)="prevPhoto()" [disabled]="lightboxIdx() === 0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span>{{ lightboxIdx() + 1 }} / {{ product().photos.length }}</span>
              <button (click)="nextPhoto()" [disabled]="lightboxIdx() === product().photos.length - 1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ============ PRICING SAAS ============ -->
      @if (product().type === 'saas' && product().plans.length) {
        <section class="section">
          <div class="container">
            <div class="section-head center" svqReveal>
              <span class="eyebrow">{{ 'products.gallery' | t }}</span>
            </div>
            <div class="pricing-grid" svqReveal>
              @for (plan of sortedPlans(); track plan.id; let i = $index) {
                <article class="pplan" [class.popular]="plan.highlighted">
                  @if (plan.highlighted) { <div class="pplan__badge">{{ 'products.mostPopular' | t }}</div> }
                  <header>
                    <h3>{{ plan.name }}</h3>
                    <div class="pplan__price">
                      <span class="amount">{{ plan.price | number:'1.0-0' }}</span>
                      <span class="currency">{{ plan.currency }}</span>
                      <span class="interval">{{ intervalLabel(plan.interval) | t }}</span>
                    </div>
                    @if (plan.tagline) { <p class="pplan__tag">{{ plan.tagline }}</p> }
                  </header>
                  <ul class="pplan__features">
                    @for (feat of plan.features; track feat) {
                      <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-success)" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg>{{ feat }}</li>
                    }
                  </ul>
                  <footer>
                    <button class="btn btn--primary" [class.btn--ghost]="!plan.highlighted" (click)="openSubscribe(plan)" [disabled]="submitting()">
                      @if (submitting() && currentPlanId() === plan.id) { <span class="spinner"></span> } @else { {{ plan.ctaLabel || ('products.choosePlan' | t) }} }
                    </button>
                  </footer>
                </article>
              }
            </div>
          </div>
        </section>
      }

      <!-- ============ FAQ ============
           Le balisage FAQPage n'est autorisé que si les questions sont
           réellement lisibles sur la page. Ce bloc n'est donc pas décoratif :
           sans lui, le balisage serait une infraction qui coûterait au site
           entier son éligibilité aux résultats enrichis. -->
      @if (product().faq?.length) {
        <section class="section pdet-faq" id="faq">
          <div class="container container--narrow">
            <div class="section-head" svqReveal>
              <span class="eyebrow">Questions fréquentes</span>
              <h2>Ce qu'on nous demande avant de choisir {{ product().name }}</h2>
            </div>
            <div class="faq-list" svqReveal>
              @for (item of product().faq; track item.q; let i = $index) {
                <details class="faq-item" [open]="i === 0">
                  <summary>
                    <span>{{ item.q }}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
                  </summary>
                  <p>{{ item.a }}</p>
                </details>
              }
            </div>
          </div>
        </section>
      }

      <!-- ============ SUBSCRIBE MODAL ============ -->
      @if (showSubscribe()) {
        <div class="modal-backdrop" (click)="closeSubscribe()">
          <div class="modal" (click)="$event.stopPropagation()">
            <button class="modal__close" (click)="closeSubscribe()" aria-label="Fermer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2>{{ 'products.subscribeTitle' | t }}</h2>
            <p class="modal__sub">{{ 'products.subscribeSub' | t }}</p>
            <div class="modal__plan">
              <strong>{{ selectedPlan()?.name }}</strong>
              <span>{{ selectedPlan()?.price | number:'1.0-0' }} {{ selectedPlan()?.currency }} {{ intervalLabel(selectedPlan()?.interval) | t }}</span>
            </div>
            <form (ngSubmit)="submitSubscribe()" class="modal__form">
              <div class="field"><label>{{ 'products.yourName' | t }}</label><input type="text" [(ngModel)]="subForm.name" name="sname" required /></div>
              <div class="field"><label>{{ 'products.yourEmail' | t }}</label><input type="email" [(ngModel)]="subForm.email" name="semail" required /></div>
              <div class="field"><label>{{ 'products.yourCompany' | t }}</label><input type="text" [(ngModel)]="subForm.company" name="scompany" /></div>
              <div class="field"><label>{{ 'products.yourPhone' | t }}</label><input type="tel" [(ngModel)]="subForm.phone" name="sphone" /></div>
              @if (subError()) { <p class="err">{{ subError() }}</p> }
              <button class="btn btn--primary" type="submit" [disabled]="submitting()">
                @if (submitting()) { <span class="spinner"></span> } @else { {{ 'products.submit' | t }} }
              </button>
            </form>
          </div>
        </div>
      }

      <!-- ============ SUCCESS ============ -->
      @if (subSuccess()) {
        <div class="modal-backdrop">
          <div class="modal">
            <div class="success-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--c-success)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="16 10 10 16 6 12"/></svg></div>
            <h2>{{ 'products.success' | t }}</h2>
            <p class="modal__sub">{{ 'products.successSub' | t }} {{ subRef() }}</p>
            <p class="modal__msg">{{ 'products.successMsg' | t }}</p>
            <a routerLink="/produits" class="btn btn--primary mt-2">{{ 'products.backToProducts' | t }}</a>
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .loader { display: grid; place-items: center; min-height: 40vh; }
    .mt-2 { margin-top: 1rem; }

    /* FAQ — repliée par défaut sauf la première : la page est déjà longue, et
       une liste de huit réponses dépliées noierait le bouton d'action. Le
       texte reste dans le DOM, donc lisible par les moteurs. */
    /* Même décalage que les chapitres : sans lui, un lien vers #faq place le
       surtitre sous l'en-tête fixe, qui le recouvre. */
    .pdet-faq { background: var(--c-surface-2, #f7f8fb); scroll-margin-top: calc(var(--header-h) + 4rem); }
    .container--narrow { max-width: 820px; }
    .faq-list { display: grid; gap: .7rem; margin-top: 1.6rem; }
    .faq-item {
      background: var(--c-surface, #fff);
      border: 1px solid var(--c-border, rgba(15,23,42,.09));
      border-radius: var(--radius-lg, 14px);
      overflow: hidden;
    }
    .faq-item summary {
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
      padding: 1.05rem 1.25rem; cursor: pointer; list-style: none;
      font-weight: 650; line-height: 1.4;
    }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-item summary:hover { color: var(--c-primary); }
    .faq-item summary svg { flex-shrink: 0; transition: transform .18s ease; color: var(--c-text-soft, #64748b); }
    .faq-item[open] summary svg { transform: rotate(180deg); }
    .faq-item p {
      padding: 0 1.25rem 1.25rem;
      color: var(--c-text-soft, #51607d);
      line-height: 1.65;
      margin: 0;
    }
    @media (prefers-reduced-motion: reduce) { .faq-item summary svg { transition: none; } }

    /* HERO */
    .pdet-hero { position: relative; padding-top: calc(var(--header-h) + 3rem); padding-bottom: 4rem; overflow: hidden; }
    .pdet-hero__bg { position: absolute; inset: 0; background: var(--grad-hero); pointer-events: none; }
    .pdet-hero__in { position: relative; display: grid; grid-template-columns: 1.1fr .9fr; gap: 3rem; align-items: start; }
    .pdet-hero__badges { display: flex; gap: .6rem; flex-wrap: wrap; margin-bottom: 1rem; }
    /* Sélecteur de langue de la fiche : discret, mais des liens véritables. */
    .pdet-langs { display: flex; gap: .35rem; margin-bottom: .9rem; flex-wrap: wrap; }
    .pdet-langs a {
      padding: .18rem .6rem; border-radius: 999px; font-size: .78rem; font-weight: 600;
      color: var(--c-text-inverse-soft, rgba(255,255,255,.7));
      border: 1px solid rgba(255,255,255,.18); text-decoration: none;
    }
    .pdet-langs a:hover, .pdet-langs a.on { background: rgba(255,255,255,.14); color: #fff; }
    .pdet-badge { background: var(--grad-brand-soft); color: var(--c-primary); border: 1px solid rgba(116,83,242,.2); }
    .pdet-status { background: rgba(245,158,11,.15); color: #b45309; border-color: rgba(245,158,11,.3); }
    .pdet-status.status-coming-soon { background: rgba(116,83,242,.15); color: var(--c-primary); border-color: rgba(116,83,242,.3); }
    .pdet-hero h1 { color: #fff; font-size: clamp(2rem, 4vw, 3.2rem); margin-bottom: .8rem; }
    .pdet-hero__tag { color: var(--c-text-inverse-soft); font-size: 1.1rem; max-width: 520px; margin-bottom: 1.2rem; }
    .pdet-hero__meta { display: flex; gap: .8rem; flex-wrap: wrap; }
    .pdet-hero__art { position: relative; }
    .pdet-cover { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); border: 1px solid rgba(255,255,255,.1); }
    .pdet-cover__glow { position: absolute; inset: -30px; border-radius: var(--radius-xl); opacity: .6; filter: blur(40px); background: radial-gradient(400px 200px at 50% 100%, rgba(116,83,242,.6), transparent 60%); pointer-events: none; }
    @media (max-width:960px) { .pdet-hero__in { grid-template-columns:1fr; } .pdet-hero__art { max-width:480px; margin-inline:auto; } }

    /* DESC */
    .pdet-desc p { font-size: 1.02rem; color: var(--c-text-soft); line-height: 1.8; margin-bottom: 2rem; }
    .pdet-features h3 { margin-bottom: 1rem; }
    .pdet-features ul { list-style: none; display: grid; gap: .7rem; }
    .pdet-features li { display: flex; align-items: flex-start; gap: .7rem; font-size: .96rem; }
    .pdet-features svg { flex-shrink: 0; margin-top: .1rem; }

    /* TECH */
    .tech-panel { position: sticky; top: calc(var(--header-h) + 2rem); }
    .tech-panel h3 { margin-bottom: 1rem; }
    .tech-cloud { display: flex; flex-wrap: wrap; gap: .5rem; }
    .tech-pill { padding: .45rem .8rem; border-radius: 999px; font-size: .84rem; font-weight: 600; background: var(--c-surface); color: var(--c-text-soft); border: 1px solid var(--c-border); transition: .2s; }
    .tech-pill:hover { background: var(--grad-brand-soft); color: var(--c-primary); border-color: transparent; }

    /* STORY — cinematic scroll gallery */
    .story-section { position: relative; overflow: hidden; }
    .story-headline { color: #fff; }
    .story-sub { color: var(--c-text-inverse-soft); max-width: 560px; margin: .8rem auto 0; }
    .story { display: grid; grid-template-columns: 72px 1fr; gap: 2.5rem; margin-top: 3.5rem; }

    /* Timeline rail */
    .story__rail { position: sticky; top: 30vh; align-self: start; display: flex; flex-direction: column; align-items: center; gap: 1.1rem; padding: .5rem 0; }
    .story__rail-line { position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,.1); border-radius: 2px; }
    .story__node {
      position: relative; z-index: 1; width: 40px; height: 40px; border-radius: 50%;
      display: grid; place-items: center; cursor: pointer;
      background: var(--c-ink-3); color: var(--c-text-inverse-soft);
      border: 1.5px solid rgba(255,255,255,.15);
      font-size: .78rem; font-weight: 700; font-family: var(--font-display);
      transition: transform .35s var(--ease-out), background .35s, color .35s, border-color .35s, box-shadow .35s;
    }
    .story__node:hover { border-color: var(--brand, var(--c-primary)); color: #fff; transform: scale(1.08); }
    .story__node.passed { background: var(--c-ink-2); color: #fff; border-color: rgba(255,255,255,.3); }
    .story__node.active {
      background: var(--brand, var(--c-primary)); border-color: transparent; color: #fff;
      transform: scale(1.25); box-shadow: 0 0 0 6px color-mix(in srgb, var(--brand, var(--c-primary)) 25%, transparent), 0 8px 24px color-mix(in srgb, var(--brand, var(--c-primary)) 45%, transparent);
    }

    /* Scenes */
    .story__scenes { display: flex; flex-direction: column; gap: clamp(4rem, 8vw, 7rem); }
    .story__scene { display: grid; grid-template-columns: 1.15fr .85fr; align-items: center; }
    .story__scene.flip { grid-template-columns: .85fr 1.15fr; }
    .story__scene.flip .story__media { order: 2; }
    .story__scene.flip .story__card { order: 1; justify-self: end; margin-inline-end: -3.5rem; margin-inline-start: 0; }

    .story__media {
      position: relative; margin: 0; border-radius: var(--radius-xl); overflow: hidden; cursor: zoom-in;
      border: 1px solid rgba(255,255,255,.12);
      box-shadow: 0 30px 80px rgba(0,0,0,.5);
      transition: transform .6s var(--ease-out), box-shadow .6s var(--ease-out);
    }
    .story__media img { width: 100%; aspect-ratio: 16/10; object-fit: cover; display: block; transition: transform .8s var(--ease-out); }
    .story__media:hover { transform: translateY(-6px) rotate(-.4deg); box-shadow: 0 40px 100px rgba(0,0,0,.6), 0 0 70px color-mix(in srgb, var(--brand, var(--c-primary)) 30%, transparent); }
    .story__media:hover img { transform: scale(1.045); }
    .story__media:hover .story__zoom { opacity: 1; transform: translate(0, 0); }
    .story__zoom {
      position: absolute; bottom: 1rem; inset-inline-end: 1rem; width: 42px; height: 42px; border-radius: 50%;
      display: grid; place-items: center; color: #fff;
      background: color-mix(in srgb, var(--brand, var(--c-primary)) 85%, black);
      opacity: 0; transform: translate(6px, 6px); transition: .35s var(--ease-out);
      box-shadow: 0 8px 20px rgba(0,0,0,.4);
    }

    .story__card {
      position: relative; z-index: 2; margin-inline-start: -3.5rem; max-width: 420px;
      padding: 1.8rem 1.9rem; border-radius: var(--radius-xl);
      background: rgba(23, 23, 28, .72); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,.12); border-top: 3px solid var(--brand, var(--c-primary));
      box-shadow: 0 24px 60px rgba(0,0,0,.45); color: #fff;
    }
    .story__chapter {
      display: inline-block; font-family: var(--font-display); font-size: .72rem; font-weight: 700;
      letter-spacing: .14em; text-transform: uppercase; color: var(--brand, var(--c-primary)); margin-bottom: .6rem;
    }
    .story__chapter em { font-style: normal; opacity: .5; }
    .story__card h3 { font-size: 1.35rem; margin-bottom: .5rem; }
    .story__card p { color: var(--c-text-inverse-soft); font-size: .95rem; line-height: 1.7; }

    /* Scene entrance (plays when svqReveal adds .is-visible) */
    .story__scene .story__media { opacity: 0; transform: translateY(40px) scale(.96); transition: opacity .8s var(--ease-out), transform .8s var(--ease-out), box-shadow .6s var(--ease-out); }
    .story__scene .story__card { opacity: 0; transform: translateY(30px); transition: opacity .8s var(--ease-out) .18s, transform .8s var(--ease-out) .18s; }
    .story__scene.is-visible .story__media { opacity: 1; transform: none; }
    .story__scene.is-visible .story__card { opacity: 1; transform: none; }
    .story__scene.is-visible .story__media:hover { transform: translateY(-6px) rotate(-.4deg); }
    @media (prefers-reduced-motion: reduce) {
      .story__scene .story__media, .story__scene .story__card { opacity: 1; transform: none; transition: none; }
    }

    @media (max-width: 860px) {
      .story { grid-template-columns: 1fr; gap: 2rem; margin-top: 2.5rem; }
      .story__rail { position: static; flex-direction: row; justify-content: center; padding: 0; }
      .story__rail-line { display: none; }
      .story__scene, .story__scene.flip { grid-template-columns: 1fr; gap: 0; }
      .story__scene.flip .story__media { order: 0; }
      .story__scene.flip .story__card { order: 1; }
      .story__card, .story__scene.flip .story__card {
        margin: -2.2rem 1rem 0; justify-self: stretch; max-width: none;
      }
    }

    /* LIGHTBOX */
    .lb { position: fixed; inset: 0; z-index: 300; background: rgba(15,15,15,.92); backdrop-filter: blur(8px); display: grid; place-items: center; padding: 1.5rem; }
    .lb__close { position: absolute; top: 1.5rem; inset-inline-end: 1.5rem; color: #fff; font-size: 2.5rem; width: 48px; height: 48px; display: grid; place-items: center; transition: .2s; }
    .lb__close:hover { opacity: .7; }
    .lb__in { max-width: 800px; width: 100%; }
    .lb__in img { width: 100%; max-height: 70vh; object-fit: contain; border-radius: var(--radius); }
    .lb__cap { color: #fff; text-align: center; margin-top: 1rem; }
    .lb__cap h4 { font-size: 1.2rem; }
    .lb__cap p { font-size: .9rem; color: var(--c-text-inverse-soft); }
    .lb__nav { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: 1rem; }
    .lb__nav button { color: #fff; opacity: .7; transition: .2s; }
    .lb__nav button:hover:not(:disabled) { opacity: 1; }
    .lb__nav button:disabled { opacity: .3; cursor: default; }
    .lb__nav span { color: var(--c-text-inverse-soft); font-size: .9rem; }

    /* PRICING */
    .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.8rem; }
    @media (max-width:960px) { .pricing-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width:640px) { .pricing-grid { grid-template-columns: 1fr; } }
    .pplan { position: relative; background: #fff; border: 1px solid var(--c-border); border-radius: var(--radius-xl); padding: 2.5rem 2rem; display: flex; flex-direction: column; transition: .4s var(--ease-out); }
    .pplan:hover { box-shadow: var(--shadow-lg); border-color: rgba(116,83,242,.3); transform: translateY(-6px); }
    .pplan.popular { border-color: var(--c-primary); box-shadow: var(--shadow-brand); }
    .pplan__badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--grad-brand); color: #fff; font-size: .7rem; font-weight: 700; padding: .35rem 1rem; border-radius: 999px; text-transform: uppercase; letter-spacing: .08em; box-shadow: var(--shadow-brand); white-space: nowrap; }
    .pplan header { margin-bottom: 1.5rem; }
    .pplan h3 { font-size: 1.2rem; margin-bottom: .8rem; }
    .pplan__price { display: flex; align-items: baseline; gap: .2rem; margin-bottom: .4rem; }
    .pplan__price .amount { font-family: var(--font-display); font-size: 2.8rem; font-weight: 700; color: var(--c-ink); }
    .pplan__price .currency { font-size: 1.1rem; font-weight: 600; color: var(--c-text-soft); }
    .pplan__price .interval { font-size: .85rem; color: var(--c-text-soft); }
    .pplan__tag { font-size: .88rem; color: var(--c-text-soft); }
    .pplan__features { list-style: none; flex: 1; margin-bottom: 1.5rem; display: grid; gap: .7rem; }
    .pplan__features li { display: flex; align-items: flex-start; gap: .6rem; font-size: .9rem; color: var(--c-text); }
    .pplan__features svg { flex-shrink: 0; margin-top: .1rem; }
    .pplan footer { display: flex; flex-direction: column; gap: .5rem; }
    .pplan .btn { width: 100%; }

    /* MODAL */
    .modal-backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(15,15,15,.7); backdrop-filter: blur(4px); display: grid; place-items: center; padding: 1.5rem; }
    .modal { width: min(480px, 100%); background: #fff; border-radius: var(--radius-xl); padding: 2.5rem 2rem; position: relative; box-shadow: var(--shadow-lg); }
    .modal__close { position: absolute; top: 1rem; inset-inline-end: 1rem; width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; color: var(--c-text-soft); transition: .2s; }
    .modal__close:hover { background: var(--c-surface); color: var(--c-ink); }
    .modal h2 { margin-bottom: .4rem; }
    .modal__sub { color: var(--c-text-soft); margin-bottom: 1.2rem; }
    .modal__plan { display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--c-surface); border-radius: var(--radius); margin-bottom: 1.5rem; }
    .modal__plan strong { color: var(--c-ink); }
    .modal__plan span { color: var(--c-primary); font-weight: 700; }
    .modal__form { display: grid; gap: 1rem; }
    .err { color: var(--c-danger); font-size: .82rem; }
    .success-icon { display: grid; place-items: center; margin-bottom: 1rem; }
    .modal__msg { color: var(--c-text-soft); font-size: .95rem; margin-bottom: 1.5rem; }

    /* ==========================================================
       DOSSIER TECHNIQUE
       Registre : signalétique d'aéroport — plaques de repère,
       codes en chasse fixe, tableau d'affichage. Le produit
       décrit est le transfert : son vocabulaire fait la forme.
       ========================================================== */
    .dossier {
      --rule: rgba(255,255,255,.10);
      --dim: #8b94a3;
      --paper: #e8eaef;
      --mono: ui-monospace, 'SFMono-Regular', 'JetBrains Mono', Menlo, Consolas, monospace;

      background: var(--c-ink);
      color: var(--paper);
      padding: clamp(4rem, 9vw, 7.5rem) 0;
    }

    /* ---- En-tête ---- */
    .dossier__head { max-width: 760px; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
    .dossier__kicker {
      display: block; font-family: var(--mono);
      font-size: .72rem; letter-spacing: .22em; text-transform: uppercase;
      color: var(--foil); margin-bottom: 1rem;
    }
    .dossier__head h2 {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4.4vw, 3.1rem); line-height: 1.05;
      letter-spacing: -.03em; margin: 0; color: #fff;
    }

    /* ---- Index : collé sous l'en-tête pendant toute la section ---- */
    .dossier__index {
      position: sticky; top: var(--header-h); z-index: 20;
      display: flex; gap: 0 1.6rem;
      padding: .9rem 0; margin-bottom: clamp(2.5rem, 5vw, 4rem);
      border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
      /* Fond opaque : le contenu doit passer DESSOUS, pas au travers. */
      background: var(--c-ink);
      /* Une seule ligne qui défile : sur mobile, sept libellés empilés
         mangeraient la moitié de l'écran une fois la barre collée. */
      flex-wrap: nowrap; overflow-x: auto; overscroll-behavior-x: contain;
      scrollbar-width: none; -ms-overflow-style: none;
    }
    .dossier__index::-webkit-scrollbar { display: none; }
    .dossier__index a {
      flex: 0 0 auto; white-space: nowrap;
      font-family: var(--mono); font-size: .74rem; letter-spacing: .1em;
      text-transform: uppercase; color: var(--dim); text-decoration: none;
      padding: .35rem 0; transition: color .18s;
      border-bottom: 1px solid transparent;
    }
    .dossier__index a:hover { color: var(--paper); }
    .dossier__index a.on { color: var(--foil); border-bottom-color: var(--foil); }
    .dossier__index a:focus-visible { outline: 2px solid var(--foil); outline-offset: 3px; }

    /* ---- Chapitre : rail de repère + propos ---- */
    .chap {
      display: grid; grid-template-columns: 260px 1fr; gap: clamp(2rem, 5vw, 4.5rem);
      padding: clamp(2.5rem, 5vw, 4rem) 0;
      border-top: 1px solid var(--rule);
      /* En-tête du site + barre d'index collée : sans cette marge, le titre du
         chapitre atterrit caché derrière les deux. */
      scroll-margin-top: calc(var(--header-h) + 4rem);
    }
    .chap:first-of-type { border-top: 0; }

    /* Le rail suit la lecture : le repère reste visible pendant tout le
       chapitre. Décalé sous la barre d'index, elle-même collée. */
    .chap__rail { position: sticky; top: calc(var(--header-h) + 5rem); align-self: start; }

    .chap__plate {
      display: inline-block; padding: .5rem .8rem;
      border: 1px solid var(--foil); border-radius: 3px;
      font-family: var(--mono); font-size: .7rem; font-weight: 600;
      letter-spacing: .14em; text-transform: uppercase; color: var(--foil);
    }

    .chap__stats { margin: 1.8rem 0 0; padding: 0; }
    .chap__stats > div { padding: .85rem 0; border-top: 1px solid var(--rule); }
    .chap__stats > div:first-child { border-top: 0; padding-top: 0; }
    .chap__stats dt {
      font-family: var(--font-display); font-size: 1.9rem; line-height: 1;
      font-weight: 700; color: #fff; font-variant-numeric: tabular-nums;
    }
    .chap__stats dd {
      margin: .3rem 0 0; font-size: .78rem; line-height: 1.4; color: var(--dim);
    }

    /* ---- Propos ---- */
    /* min-width: 0 est indispensable : un élément de grille ne descend pas
       sous la largeur de son contenu par défaut, et le tableau d'affichage
       (min-width 34rem) élargissait alors toute la page sur mobile au lieu de
       défiler dans son propre cadre. */
    .chap__main { min-width: 0; }
    .chap__main h3 {
      font-family: var(--font-display);
      font-size: clamp(1.5rem, 2.6vw, 2.05rem); line-height: 1.2;
      letter-spacing: -.02em; color: #fff; margin: 0 0 1.4rem;
      max-width: 22ch;
    }
    .chap__main p {
      margin: 0 0 1.15rem; max-width: 68ch;
      font-size: 1.02rem; line-height: 1.75; color: #b8bfcb;
    }

    /* ---- Liste : filets et tirets, pas de coches ---- */
    .chap__list { list-style: none; margin: 2rem 0 0; padding: 0; }
    .chap__list li {
      position: relative; padding: .8rem 0 .8rem 1.9rem;
      border-top: 1px solid var(--rule);
      font-size: .93rem; line-height: 1.6; color: #c9cfd9;
    }
    .chap__list li::before {
      content: ''; position: absolute; left: 0; top: 1.35rem;
      width: 12px; height: 1px; background: var(--foil);
    }

    /* ---- Signature : le tableau d'affichage ---- */
    .board {
      margin: 2.2rem 0 0;
      border: 1px solid var(--rule); border-radius: 4px;
      background: rgba(255,255,255,.025);
      overflow-x: auto;
    }
    .board__head, .board__row {
      display: grid; grid-template-columns: 9.5rem 1fr 8.5rem;
      gap: 1rem; padding: .8rem 1.1rem; align-items: baseline;
      min-width: 34rem;
    }
    .board__head {
      font-family: var(--mono); font-size: .66rem; letter-spacing: .16em;
      text-transform: uppercase; color: var(--dim);
      border-bottom: 1px solid var(--rule);
    }
    .board__row { border-top: 1px solid rgba(255,255,255,.055); }
    .board__row:first-of-type { border-top: 0; }
    .board__q { font-family: var(--mono); font-size: .88rem; color: var(--foil); }
    /* La flèche appartient à la ligne, pas au contenu : elle reste hors du texte. */
    .board__q::after { content: ' \\2192'; color: var(--dim); }
    .board__r { font-size: .92rem; color: #fff; }
    .board__code {
      display: inline-block; margin-left: .5rem; padding: .1rem .4rem;
      border: 1px solid var(--foil); border-radius: 2px;
      font-family: var(--mono); font-style: normal; font-size: .7rem;
      letter-spacing: .08em; color: var(--foil);
    }
    .board__s { font-family: var(--mono); font-size: .74rem; color: var(--dim); }

    @media (max-width: 900px) {
      .chap { grid-template-columns: 1fr; gap: 1.6rem; }
      .chap__rail { position: static; }
      .chap__stats { display: flex; flex-wrap: wrap; gap: 0 2.2rem; margin-top: 1.2rem; }
      .chap__stats > div { border-top: 0; padding: .4rem 0; }
      .chap__stats dt { font-size: 1.5rem; }
      .chap__main h3 { max-width: none; }
      .dossier__index { gap: 0 1.1rem; }
    }

  `],
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);
  private api = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  private i18n = inject(I18nService);

  product = signal<Product>({ slug: '', type: 'app', name: '', tagline: '', description: '', coverUrl: '', technologies: [], features: [], photos: [], plans: [], status: 'live', order: 0 });
  loading = signal(true);
  notFound = signal(false);

  lightboxOpen = signal(false);
  lightboxIdx = signal(0);
  activeScene = signal(0);

  showSubscribe = signal(false);
  selectedPlan = signal<Plan | null>(null);
  currentPlanId = signal<string | null>(null);
  subForm = { name: '', email: '', company: '', phone: '' };
  subError = signal<string | null>(null);
  submitting = signal(false);
  subSuccess = signal(false);
  subRef = signal('');

  /**
   * Langue de la page, lue dans l'URL et non dans le navigateur.
   *
   * C'est ce qui permet au rendu serveur de produire directement la bonne
   * langue : la préférence stockée côté navigateur n'existe pas encore quand
   * le serveur répond, et un moteur n'en a de toute façon aucune.
   */
  readonly pageLang: Lang = (this.route.snapshot.data['lang'] as Lang) ?? 'fr';

  /** Préfixe d'URL de la version courante — vide en français. */
  private langPrefix(lang: Lang): string {
    return lang === 'fr' ? '' : `/${lang}`;
  }

  ngOnInit() {
    // On force la langue de l'interface sans la mémoriser : quelqu'un qui
    // ouvre un lien arabe ne demande pas que tout le site passe en arabe pour
    // ses prochaines visites.
    this.i18n.setLang(this.pageLang, false);

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') ?? '';
      this.load(slug);
    });
  }

  /**
   * Applique la traduction de la langue courante par-dessus le contenu
   * français.
   *
   * La fusion est volontairement superficielle et champ par champ : un
   * chapitre traduit remplace le chapitre français en entier plutôt que de se
   * mélanger avec lui. Un champ absent de la traduction retombe sur le
   * français, ce qui donne une page en langue mixte — lisible — au lieu d'une
   * page trouée.
   */
  private localize(p: Product): Product {
    if (this.pageLang === 'fr') return p;
    const tr = p.translations?.[this.pageLang];
    if (!tr) return p;

    const merged: Product = { ...p };
    for (const champ of ['name', 'tagline', 'description', 'technologies', 'features', 'sections', 'faq', 'seo'] as const) {
      const valeur = (tr as any)[champ];
      if (valeur != null) (merged as any)[champ] = valeur;
    }

    // Les visuels ne changent pas, seules leurs légendes : on garde donc les
    // URLs françaises et on ne remplace que le texte, position par position.
    if (Array.isArray(tr.photos)) {
      merged.photos = p.photos.map((photo, i) => ({ ...photo, ...(tr.photos![i] ?? {}) }));
    }

    // Les paliers gardent leur prix et leur identifiant — seuls les libellés
    // se traduisent, sinon l'abonnement pointerait vers un palier inexistant.
    if (tr.plans) {
      merged.plans = p.plans.map(plan => {
        const t = tr.plans![plan.name];
        return t ? { ...plan, ...t } : plan;
      });
    }
    return merged;
  }

  load(slug: string) {
    this.loading.set(true); this.notFound.set(false);
    this.api.getProduct(slug).subscribe({
      next: raw => {
        const p = this.localize(raw);
        this.product.set(p); this.loading.set(false); this.applySeo(p);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
        // Sans cela, un slug supprimé renvoyait un 200 affichant « Produit
        // introuvable » : un soft 404, que Google traite comme une page
        // pauvre plutôt que comme une page absente. Le noindex retire ces
        // URLs de l'index au lieu de les y laisser vides.
        this.seo.noIndex('Produit introuvable — SWIVIQ');
      }
    });
  }

  /** Les trois adresses de cette fiche, dans l'ordre de déclaration hreflang. */
  altLinks(slug: string): { lang: Lang; label: string; path: string }[] {
    return [
      { lang: 'fr', label: 'Français', path: `/produits/${slug}` },
      { lang: 'en', label: 'English', path: `/en/produits/${slug}` },
      { lang: 'ar', label: 'العربية', path: `/ar/produits/${slug}` }
    ];
  }

  applySeo(p: Product) {
    const chemin = `${this.langPrefix(this.pageLang)}/produits/${p.slug}`;
    const url = SITE_URL + chemin;
    const image = p.coverUrl?.startsWith('/') ? SITE_URL + p.coverUrl : p.coverUrl;

    const app: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': p.type === 'saas' ? 'SoftwareApplication' : p.type === 'app' ? 'MobileApplication' : 'WebApplication',
      name: p.name,
      description: p.seo?.description || p.description,
      url,
      image,
      provider: { '@id': `${SITE_URL}/#organization` },
      // `featureList` et `applicationCategory` sont ce qui permet à un moteur
      // de répondre « quel outil fait X » sans avoir à lire toute la page.
      applicationCategory: p.type === 'saas' ? 'BusinessApplication' : undefined,
      // Dit explicitement dans quelle langue est CE document : trois versions
      // au même contenu sans cette mention se ressemblent trop pour un moteur.
      inLanguage: this.pageLang,
      featureList: p.features?.length ? p.features : undefined,
      softwareHelp: p.websiteUrl || undefined
    };

    // Les paliers deviennent une offre agrégée : c'est ce qui fait apparaître
    // « à partir de 30 MAD » dans un résultat, plutôt qu'un lien nu.
    const paid = (p.plans || []).filter(pl => Number(pl.price) > 0);
    if (p.plans?.length) {
      const prices = p.plans.map(pl => Number(pl.price)).filter(n => Number.isFinite(n));
      app['offers'] = {
        '@type': 'AggregateOffer',
        priceCurrency: p.plans[0].currency || 'MAD',
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: p.plans.length,
        offers: p.plans.map(pl => ({
          '@type': 'Offer',
          name: pl.name,
          price: Number(pl.price),
          priceCurrency: pl.currency || 'MAD',
          description: pl.tagline || undefined,
          availability: 'https://schema.org/InStock'
        }))
      };
      // Un essai gratuit à côté de paliers payants : on le dit explicitement,
      // c'est un critère de sélection courant dans les réponses générées.
      if (paid.length < p.plans.length) app['isAccessibleForFree'] = false;
    }

    const blocks: object[] = [app];

    // FAQPage : uniquement si les questions sont AUSSI affichées sur la page.
    // Un balisage sans contenu visible est une infraction aux règles Google et
    // fait perdre l'éligibilité aux résultats enrichis du site entier.
    if (p.faq?.length) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: p.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a }
        }))
      });
    }

    this.seo.apply({
      title: p.seo?.title || `${p.name} — ${p.tagline} | SWIVIQ`,
      description: p.seo?.description || p.description.slice(0, 160),
      path: chemin,
      image,
      keywords: p.seo?.keywords,
      locale: this.pageLang === 'ar' ? 'ar_MA' : this.pageLang === 'en' ? 'en_US' : 'fr_MA',
      // Les trois versions se déclarent réciproquement : sans réciprocité,
      // Google ignore l'ensemble des hreflang de la page.
      alternates: this.altLinks(p.slug).map(a => ({ lang: a.lang, path: a.path })),
      breadcrumb: [
        { name: this.i18n.t('nav.home'), path: `${this.langPrefix(this.pageLang)}/` },
        { name: this.i18n.t('nav.products'), path: '/produits' },
        { name: p.name }
      ],
      jsonLd: blocks
    });
  }

  typeClass() { return ''; }
  typeLabel() { const t = this.product().type; return t === 'saas' ? 'products.typeSaaS' : t === 'app' ? 'products.typeApp' : 'products.typeWebsite'; }
  statusLabel() { const s = this.product().status; return s === 'beta' ? 'products.beta' : 'products.comingSoon'; }
  sortedPlans() { return [...this.product().plans].sort((a, b) => a.price - b.price); }
  intervalLabel(i?: string) { return i === 'year' ? 'products.perYear' : i === 'one-time' ? 'products.oneTime' : 'products.perMonth'; }

  openLightbox(i: number) { this.lightboxIdx.set(i); this.lightboxOpen.set(true); }
  closeLightbox() { this.lightboxOpen.set(false); }
  prevPhoto() { if (this.lightboxIdx() > 0) this.lightboxIdx.update(i => i - 1); }
  nextPhoto() { if (this.lightboxIdx() < this.product().photos.length - 1) this.lightboxIdx.update(i => i + 1); }

  /* Dossier technique */
  sections(): ProductSection[] { return this.product().sections || []; }

  /** Ancre du chapitre en cours de lecture, surlignée dans l'index. */
  activeSection = signal('');

  @ViewChild('dossierIndex') dossierIndex?: ElementRef<HTMLElement>;

  onChapterActive(i: number): void {
    const s = this.sections()[i];
    if (!s) return;
    const anchor = this.sectionAnchor(s);
    this.activeSection.set(anchor);
    this.revealInIndex(anchor);
  }

  /**
   * Ramène la puce active dans la partie visible de l'index.
   *
   * La barre défile horizontalement : au septième chapitre, le libellé
   * surligné serait hors champ et le repère ne servirait plus à rien. On règle
   * `scrollLeft` à la main plutôt que d'appeler `scrollIntoView`, qui peut
   * aussi déplacer la page verticalement.
   */
  private revealInIndex(anchor: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const nav = this.dossierIndex?.nativeElement;
    if (!nav) return;
    const link = nav.querySelector<HTMLElement>(`[data-anchor="${anchor}"]`);
    if (!link) return;

    const target = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2;
    const max = nav.scrollWidth - nav.clientWidth;
    if (max <= 0) return; // rien à faire : tout tient déjà à l'écran
    nav.scrollTo({ left: Math.max(0, Math.min(target, max)), behavior: 'smooth' });
  }

  /**
   * Ancre stable d'un chapitre : l'`id` fourni par l'administration s'il
   * existe, sinon un dérivé du titre. Sans repli, un chapitre saisi sans id
   * casserait le sommaire.
   */
  sectionAnchor(s: ProductSection): string {
    if (s.id) return s.id;
    return s.title
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      .slice(0, 40);
  }

  /**
   * Défilement vers un chapitre, piloté à la main.
   *
   * Le `href="#sec-…"` seul ne suffit pas ici : le routeur est configuré avec
   * `withViewTransitions()` et `scrollPositionRestoration: 'top'`, si bien
   * qu'une navigation par fragment repasse par lui et se solde par un retour
   * en haut de page. On intercepte donc le clic.
   *
   * Le `href` est conservé : il garde le lien réel — clic milieu, copie de
   * l'adresse, navigation sans JavaScript — et le décalage sous l'en-tête fixe
   * est assuré par `scroll-margin-top` sur les chapitres.
   */
  scrollToSection(event: Event, s: ProductSection): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = document.getElementById('sec-' + this.sectionAnchor(s));
    if (!target) return; // ancre absente : on laisse le navigateur faire au mieux
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Le corps d'un chapitre est saisi en texte libre : les sauts de ligne font les paragraphes. */
  paragraphs(body: string): string[] {
    return body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  }

  /* Story gallery */
  brand() { return this.product().brandColor || '#7435F2'; }
  pad(n: number) { return String(n).padStart(2, '0'); }
  scrollToScene(i: number) {
    if (!isPlatformBrowser(this.platformId)) return;
    document.getElementById('scene-' + i)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  openSubscribe(plan: Plan) {
    this.selectedPlan.set(plan); this.currentPlanId.set(plan.id ?? null);
    this.showSubscribe.set(true); this.subError.set(null);
    this.subForm = { name: '', email: '', company: '', phone: '' };
  }
  closeSubscribe() { this.showSubscribe.set(false); this.selectedPlan.set(null); this.currentPlanId.set(null); }

  submitSubscribe() {
    if (!this.subForm.name || !this.subForm.email || !this.selectedPlan()) return;
    this.submitting.set(true); this.subError.set(null);
    this.api.subscribe(this.product().slug, {
      planId: this.selectedPlan()!.id!, name: this.subForm.name,
      email: this.subForm.email, company: this.subForm.company, phone: this.subForm.phone
    }).subscribe({
      next: res => { this.submitting.set(false); this.showSubscribe.set(false); this.subRef.set(res.number); this.subSuccess.set(true); },
      error: e => { this.submitting.set(false); this.subError.set(e.error?.error || 'Erreur'); }
    });
  }
}
