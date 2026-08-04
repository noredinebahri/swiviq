import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { I18nService, TPipe } from '../core/i18n/i18n.service';

interface ChatMsg { role: 'user' | 'assistant'; content: string; }

@Component({
  selector: 'svq-chatbot',
  imports: [FormsModule, TPipe],
  template: `
    @if (open()) {
      <section class="chat" role="dialog" [attr.aria-label]="'chat.title' | t">
        <header class="chat__head">
          <div class="chat__avatar" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="#fff" stroke-width="2.5"/>
              <circle cx="17" cy="21" r="3" fill="#fff"/><circle cx="31" cy="21" r="3" fill="#fff"/>
              <path d="M16 30c2.5 3 13.5 3 16 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <strong>{{ 'chat.title' | t }}</strong>
          <button class="chat__close" (click)="open.set(false)" aria-label="Fermer">✕</button>
        </header>

        <div class="chat__body" #body>
          @for (m of messages(); track $index) {
            <div class="msg" [class.me]="m.role === 'user'">{{ m.content }}</div>
          }
          @if (loading()) {
            <div class="msg typing"><span></span><span></span><span></span></div>
          }
        </div>

        <form class="chat__input" (submit)="send($event)">
          <input [(ngModel)]="draft" name="msg" [placeholder]="'chat.placeholder' | t" maxlength="1000" autocomplete="off" />
          <button type="submit" class="chat__send" [disabled]="loading()" [attr.aria-label]="'chat.send' | t">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12L21 3l-4 18-5.5-6.5L3 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
          </button>
        </form>
      </section>
    }

    <button class="chat__fab" (click)="toggle()" [class.on]="open()" aria-label="Chat">
      @if (!open()) {
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12Z" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="9" cy="12" r="1.2" fill="#fff"/><circle cx="13" cy="12" r="1.2" fill="#fff"/><circle cx="17" cy="12" r="1.2" fill="#fff"/>
        </svg>
      } @else { <span class="x">✕</span> }
    </button>
  `,
  styles: [`
    :host { position: fixed; bottom: 22px; inset-inline-end: 22px; z-index: 150; }
    .chat__fab {
      width: 58px; height: 58px; border-radius: 50%; background: var(--grad-brand);
      display: grid; place-items: center; box-shadow: var(--shadow-brand);
      transition: transform .25s var(--ease-spring); position: relative; z-index: 2;
    }
    .chat__fab:hover { transform: scale(1.08); }
    .chat__fab .x { color: #fff; font-size: 1.3rem; font-weight: 700; }
    .chat {
      position: absolute; bottom: 72px; inset-inline-end: 0;
      width: min(380px, calc(100vw - 44px)); height: 500px; max-height: calc(100vh - 140px);
      background: #fff; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
      display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--c-border);
      animation: chat-in .3s var(--ease-out);
    }
    @keyframes chat-in { from { opacity: 0; transform: translateY(16px) scale(.97); } }
    .chat__head {
      display: flex; align-items: center; gap: .7rem; padding: .9rem 1.1rem;
      background: var(--grad-brand); color: #fff;
    }
    .chat__avatar { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,.18); display: grid; place-items: center; }
    .chat__close { margin-inline-start: auto; color: #fff; opacity: .8; font-size: 1rem; }
    .chat__body { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: .6rem; background: var(--c-surface); }
    .msg {
      max-width: 85%; padding: .65rem .95rem; border-radius: 16px; font-size: .92rem; line-height: 1.5;
      background: #fff; border: 1px solid var(--c-border); align-self: flex-start; white-space: pre-wrap;
      border-start-start-radius: 4px;
    }
    .msg.me {
      align-self: flex-end; background: var(--c-primary); color: #fff; border: 0;
      border-start-start-radius: 16px; border-start-end-radius: 4px;
    }
    .typing { display: inline-flex; gap: 4px; padding: .8rem 1rem; }
    .typing span { width: 7px; height: 7px; border-radius: 50%; background: var(--c-primary); opacity: .4; animation: pulse-soft 1s ease-in-out infinite; }
    .typing span:nth-child(2) { animation-delay: .2s; }
    .typing span:nth-child(3) { animation-delay: .4s; }
    .chat__input { display: flex; gap: .5rem; padding: .8rem; border-top: 1px solid var(--c-border); background: #fff; }
    .chat__input input {
      flex: 1; padding: .65rem .9rem; border: 1.5px solid var(--c-border); border-radius: 999px; font-size: .92rem;
    }
    .chat__input input:focus { outline: none; border-color: var(--c-primary); }
    .chat__send {
      width: 42px; height: 42px; border-radius: 50%; background: var(--grad-brand); color: #fff;
      display: grid; place-items: center; flex-shrink: 0;
    }
    .chat__send:disabled { opacity: .5; }
  `],
})
export class ChatbotComponent {
  private api = inject(ApiService);
  private i18n = inject(I18nService);
  @ViewChild('body') body?: ElementRef<HTMLElement>;

  open = signal(false);
  loading = signal(false);
  messages = signal<ChatMsg[]>([]);
  draft = '';

  toggle() {
    this.open.update(v => !v);
    if (this.open() && this.messages().length === 0) {
      this.messages.set([{ role: 'assistant', content: this.i18n.t('chat.hello') }]);
    }
  }

  send(e: Event) {
    e.preventDefault();
    const text = this.draft.trim();
    if (!text || this.loading()) return;
    this.draft = '';
    this.messages.update(m => [...m, { role: 'user', content: text }]);
    this.loading.set(true);
    this.scroll();

    // keep last 20 messages, skip the greeting
    const history = this.messages().slice(-20);
    this.api.chat(history).subscribe({
      next: res => {
        this.messages.update(m => [...m, { role: 'assistant', content: res.reply }]);
        this.loading.set(false);
        this.scroll();
      },
      error: () => {
        this.messages.update(m => [...m, { role: 'assistant', content: this.i18n.t('chat.error') }]);
        this.loading.set(false);
        this.scroll();
      },
    });
  }

  private scroll() {
    setTimeout(() => {
      const el = this.body?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 60);
  }
}
