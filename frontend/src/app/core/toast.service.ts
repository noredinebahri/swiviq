import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  details?: string[];
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  success(message: string, durationMs = 4000): void {
    this.push('success', message, undefined, durationMs);
  }

  info(message: string, durationMs = 5000): void {
    this.push('info', message, undefined, durationMs);
  }

  error(message: string, details?: string[], durationMs = 9000): void {
    this.push('error', message, details, durationMs);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(type: ToastType, message: string, details?: string[], durationMs = 5000): void {
    const id = ++this.nextId;
    this.toasts.update((list) => [...list, { id, type, message, details }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }
}
