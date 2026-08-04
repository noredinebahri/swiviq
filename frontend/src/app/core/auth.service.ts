import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  readonly token = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.token.set(sessionStorage.getItem('swiviq_admin_token'));
    }
  }

  setToken(token: string) {
    this.token.set(token);
    if (isPlatformBrowser(this.platformId)) sessionStorage.setItem('swiviq_admin_token', token);
  }

  logout() {
    this.token.set(null);
    if (isPlatformBrowser(this.platformId)) sessionStorage.removeItem('swiviq_admin_token');
  }

  get isLoggedIn(): boolean {
    const t = this.token();
    if (!t) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  if (token && req.url.includes('/api/')) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn ? true : router.createUrlTree(['/admin/login']);
};
