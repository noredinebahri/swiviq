import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'svq-toasts',
  template: `
    <div class="toasts" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast toast--{{ t.type }}" role="alert">
          <span class="toast__icon">
            @if (t.type === 'success') {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            } @else if (t.type === 'info') {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8h.01M12 11v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 7v6M12 16.5h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            }
          </span>
          <div class="toast__body">
            <strong>{{ t.message }}</strong>
            @if (t.details?.length) {
              <ul>
                @for (d of t.details; track d) {
                  <li>{{ d }}</li>
                }
              </ul>
            }
          </div>
          <button type="button" class="toast__close" (click)="toast.dismiss(t.id)" aria-label="Fermer">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toasts {
      position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 9999;
      display: flex; flex-direction: column; gap: .6rem; max-width: min(420px, calc(100vw - 2.5rem));
    }
    .toast {
      display: flex; align-items: flex-start; gap: .7rem;
      padding: .85rem 1rem; border-radius: var(--radius); background: #fff;
      box-shadow: 0 10px 30px rgba(15, 12, 40, .18);
      border-left: 4px solid var(--c-primary);
      animation: toast-in .25s ease-out;
    }
    @keyframes toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .toast--success { border-left-color: var(--c-success); }
    .toast--success .toast__icon { color: var(--c-success); }
    .toast--error { border-left-color: var(--c-danger); }
    .toast--error .toast__icon { color: var(--c-danger); }
    .toast--info { border-left-color: #3b82f6; }
    .toast--info .toast__icon { color: #3b82f6; }
    .toast__icon { flex-shrink: 0; margin-top: .1rem; }
    .toast__body { flex: 1; font-size: .88rem; line-height: 1.45; }
    .toast__body strong { display: block; }
    .toast__body ul { margin: .35rem 0 0; padding-left: 1.1rem; color: var(--c-text-soft); font-size: .82rem; }
    .toast__close {
      flex-shrink: 0; background: none; border: none; cursor: pointer;
      font-size: 1.1rem; line-height: 1; color: var(--c-text-soft); padding: .1rem .3rem; border-radius: 6px;
    }
    .toast__close:hover { color: var(--c-ink); background: var(--c-surface); }
  `],
})
export class ToastComponent {
  protected readonly toast = inject(ToastService);
}
