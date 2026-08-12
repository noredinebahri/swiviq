import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TPipe, I18nService } from '../core/i18n/i18n.service';
import { SeoService, SITE_URL } from '../core/seo.service';
import { RevealDirective } from '../shared/reveal.directive';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'svq-contact',
  imports: [FormsModule, TPipe, RevealDirective],
  template: `
    <section class="page-head section--dark">
      <div class="container">
        <h1 svqReveal>{{ 'contact.title' | t }}</h1>
        <p svqReveal class="reveal-d1">{{ 'contact.sub' | t }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container wrap">
        <form class="card form" (submit)="submit($event)" svqReveal>
          @if (sent()) {
            <div class="ok">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="24" stroke="#10b981" stroke-width="3"/>
                <path d="M16 27l7 7 13-14" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>{{ 'contact.success' | t }}</p>
            </div>
          } @else {
            <div class="field">
              <label for="c-name">{{ 'contact.name' | t }}</label>
              <input id="c-name" [(ngModel)]="model.name" name="name" required maxlength="120" />
            </div>
            <div class="field">
              <label for="c-email">{{ 'contact.email' | t }}</label>
              <input id="c-email" type="email" [(ngModel)]="model.email" name="email" required maxlength="180" />
            </div>
            <div class="field">
              <label for="c-subject">{{ 'contact.subject' | t }}</label>
              <input id="c-subject" [(ngModel)]="model.subject" name="subject" required maxlength="180" />
            </div>
            <div class="field">
              <label for="c-message">{{ 'contact.message' | t }}</label>
              <textarea id="c-message" [(ngModel)]="model.message" name="message" rows="6" required maxlength="4000"></textarea>
            </div>
            @if (error()) { <p class="err">{{ 'contact.error' | t }}</p> }
            <button type="submit" class="btn btn--primary" [disabled]="loading()">
              @if (loading()) { <span class="spinner"></span> } @else { {{ 'contact.send' | t }} }
            </button>
          }
        </form>

        <aside class="card info reveal-d2" svqReveal>
          <h2>{{ 'contact.infoTitle' | t }}</h2>
          <div class="info__item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke="#7435f2" stroke-width="2"/><path d="m3 8 9 6 9-6" stroke="#7435f2" stroke-width="2" stroke-linecap="round"/></svg>
            <a href="mailto:contact@swiviq.com">contact&#64;swiviq.com</a>
          </div>
          <div class="info__item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11Z" stroke="#7435f2" stroke-width="2"/><circle cx="12" cy="10" r="2.6" stroke="#7435f2" stroke-width="2"/></svg>
            <span>{{ 'contact.addr' | t }}</span>
          </div>
          <div class="info__item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#7435f2" stroke-width="2"/><path d="M12 7v5l3.5 2" stroke="#7435f2" stroke-width="2" stroke-linecap="round"/></svg>
            <span>{{ 'contact.hours' | t }}</span>
          </div>
          <div class="ids">
            <span>ICE 003963563000019</span><span>RC 200173 Rabat</span><span>IF 73099178</span>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .page-head { padding: calc(var(--header-h) + 3.5rem) 0 3.5rem; background: var(--c-ink); position: relative; overflow: hidden; }
    .page-head::before { content: ''; position: absolute; inset: 0; background: var(--grad-hero); }
    .page-head .container { position: relative; }
    .page-head h1 { color: #fff; font-size: clamp(2rem, 4.5vw, 3rem); margin-bottom: .8rem; }
    .page-head p { color: var(--c-text-inverse-soft); }
    .wrap { display: grid; grid-template-columns: 1.4fr 1fr; gap: 2rem; align-items: start; }
    @media (max-width: 880px) { .wrap { grid-template-columns: 1fr; } }
    .form { padding: 2.2rem; }
    .ok { text-align: center; padding: 3rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .ok p { font-weight: 600; font-size: 1.05rem; }
    .err { color: var(--c-danger); margin-bottom: 1rem; font-size: .9rem; }
    .info h2 { font-size: 1.15rem; margin-bottom: 1.4rem; }
    .info__item { display: flex; gap: .9rem; align-items: flex-start; margin-bottom: 1.1rem; font-size: .95rem; }
    .info__item a { color: var(--c-primary); font-weight: 600; }
    .info__item svg { flex-shrink: 0; margin-top: .15rem; }
    .ids { display: flex; flex-wrap: wrap; gap: .4rem .9rem; margin-top: 1.5rem; padding-top: 1.2rem; border-top: 1px solid var(--c-border); font-size: .78rem; color: var(--c-text-soft); }
  `],
})
export class ContactComponent implements OnInit {
  private seo = inject(SeoService);
  private i18n = inject(I18nService);
  private api = inject(ApiService);

  model = { name: '', email: '', subject: '', message: '' };
  loading = signal(false);
  sent = signal(false);
  error = signal(false);

  ngOnInit() {
    this.seo.apply({
      title: this.i18n.t('seo.contact.title'),
      description: this.i18n.t('seo.contact.desc'),
      path: '/contact',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact SWIVIQ',
        url: `${SITE_URL}/contact`,
      },
    });
  }

  submit(e: Event) {
    e.preventDefault();
    const { name, email, subject, message } = this.model;
    if (!name.trim() || !email.includes('@') || !subject.trim() || !message.trim()) {
      this.error.set(true);
      return;
    }
    this.error.set(false);
    this.loading.set(true);
    this.api.sendContact(this.model).subscribe({
      next: () => { this.sent.set(true); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
