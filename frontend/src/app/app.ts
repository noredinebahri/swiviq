import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/header.component';
import { FooterComponent } from './shared/footer.component';
import { ChatbotComponent } from './shared/chatbot.component';
import { ToastComponent } from './shared/toast.component';
import { I18nService } from './core/i18n/i18n.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ChatbotComponent, ToastComponent],
  template: `
    <a class="skip-link" href="#main">Aller au contenu</a>
    @if (!isAdmin) {
      <svq-header />
    }
    <main id="main">
      <router-outlet />
    </main>
    @if (!isAdmin) {
      <svq-footer />
      <svq-chatbot />
    }
    <svq-toasts />
  `,
})
export class App {
  private router = inject(Router);
  private i18n = inject(I18nService);
  isAdmin = false;

  constructor() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.isAdmin = e.urlAfterRedirects.startsWith('/admin');
        // La langue suit l'adresse, à chaque navigation : c'est le seul point
        // qui la fixe, aussi bien au rendu serveur qu'au clic dans le menu.
        this.i18n.setFromUrl(e.urlAfterRedirects);
      }
    });
  }
}
