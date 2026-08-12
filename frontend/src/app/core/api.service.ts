import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_BASE } from './api-base';

export interface PricingService { id: string; label: string; basePrice: number; }
export interface PricingOption { id: string; label: string; price: number; }
export interface Pricing {
  services: PricingService[];
  options: PricingOption[];
  complexityMultipliers: Record<string, number>;
  urgencyMultipliers: Record<string, number>;
  vatRate: number;
}
export interface PublicSettings {
  pricing: Pricing;
  company: { name: string; email: string; phone?: string; address: string; site: string };
}
export interface QuotePayload {
  customer: { name: string; company?: string; email: string; phone?: string; ice?: string; address?: string };
  serviceIds: string[];
  optionIds: string[];
  complexity: 'simple' | 'standard' | 'advanced';
  urgency: 'normal' | 'fast' | 'express';
  description?: string;
  projectId?: string;
}
export interface Quote {
  id: string; number: string; status: string;
  customer: QuotePayload['customer'];
  serviceIds: string[]; optionIds: string[];
  complexity: string; urgency: string; description?: string;
  lines: { label: string; qty: number; unitPrice: number; total: number }[];
  subtotalHT: number; vat: number; totalTTC: number;
  publicToken?: string; createdAt: string;
}
export interface Invoice {
  id: string; number: string; status: string; quoteId?: string;
  customer: QuotePayload['customer'];
  lines: { label: string; qty: number; unitPrice: number; total: number }[];
  subtotalHT: number; vat: number; totalTTC: number;
  dueDate: string; createdAt: string;
}

/* ---------------- Products ---------------- */
export type ProductType = 'app' | 'website' | 'saas';
export type ProductStatus = 'live' | 'beta' | 'coming-soon';
export interface ProductPhoto { id?: string; url: string; title?: string; description?: string; }
export type PlanInterval = 'month' | 'year' | 'one-time';
export interface Plan {
  id?: string; name: string; price: number; currency: string;
  interval: PlanInterval; tagline?: string; features: string[];
  highlighted?: boolean; ctaLabel?: string;
}
/** Chiffre clé mis en avant dans un chapitre. */
export interface SectionMetric { value: string; label: string; }
/**
 * Chapitre technique d'une fiche produit.
 * `features` ne porte que des puces d'une ligne : les sections servent à
 * expliquer une architecture, un workflow ou une stratégie, avec du texte
 * suivi et des chiffres.
 */
/** Preuve : ce que renvoie réellement le produit pour une requête donnée. */
export interface SectionEvidence { query: string; result: string; code?: string; source?: string; }
export interface ProductSection {
  id?: string; eyebrow?: string; title: string; body?: string;
  bullets: string[]; metrics: SectionMetric[]; evidence?: SectionEvidence[];
}
export interface Product {
  id?: string; slug: string; type: ProductType; name: string; tagline: string;
  description: string; coverUrl: string; technologies: string[]; features: string[];
  websiteUrl?: string; repoUrl?: string; status: ProductStatus;
  photos: ProductPhoto[]; sections?: ProductSection[]; order?: number; plans: Plan[];
  subscribers?: Subscriber[];
  brandColor?: string; brandTagline?: string; brandPrefix?: string;
  /** Titre, description et expressions ciblées, propres à la fiche. */
  seo?: ProductSeo;
  /** Questions/réponses : bloc visible ET balisage FAQPage. */
  faq?: ProductFaq[];
  /** Versions traduites, appliquées par-dessus le français sur /en et /ar. */
  translations?: Record<string, ProductTranslation>;
}

/** Ce qu'une langue peut redéfinir. Tout est optionnel : le reste retombe sur le français. */
export interface ProductTranslation {
  name?: string;
  tagline?: string;
  description?: string;
  technologies?: string[];
  features?: string[];
  photos?: Partial<ProductPhoto>[];
  sections?: ProductSection[];
  faq?: ProductFaq[];
  seo?: ProductSeo;
  /** Libellés des paliers, indexés par leur nom français — les prix ne bougent pas. */
  plans?: Record<string, Partial<Plan>>;
}
export interface ProductSeo { title?: string; description?: string; keywords?: string[]; }
export interface ProductFaq { q: string; a: string; }
export interface Subscriber {
  id: string; number: string; name: string; email: string;
  company?: string; phone?: string; status: 'pending' | 'active' | 'suspended' | 'cancelled';
  createdAt: string; planId?: string;
  plan?: { id: string; name: string; price: number; currency: string; interval: PlanInterval };
  product?: { id: string; name: string; slug: string };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  /** Vide côté navigateur (URLs relatives → même origine), absolue côté SSR. */
  readonly base = inject(API_BASE);

  getPublicSettings() {
    return this.http.get<PublicSettings>(`${this.base}/api/settings/public`);
  }

  createQuote(payload: QuotePayload) {
    return this.http.post<Quote>(`${this.base}/api/quotes`, payload);
  }

  quotePdfUrl(quote: Quote): string {
    return `${this.base}/api/quotes/${quote.id}/pdf?token=${quote.publicToken}`;
  }

  sendContact(payload: { name: string; email: string; subject: string; message: string }) {
    return this.http.post(`${this.base}/api/contact`, payload);
  }

  chat(messages: { role: 'user' | 'assistant'; content: string }[]) {
    return this.http.post<{ reply: string }>(`${this.base}/api/chat`, { messages });
  }

  // ---- Admin ----
  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.base}/api/auth/login`, { email, password });
  }
  adminQuotes() { return this.http.get<Quote[]>(`${this.base}/api/quotes`); }
  updateQuoteStatus(id: string, status: string) {
    return this.http.patch<Quote>(`${this.base}/api/quotes/${id}`, { status });
  }
  adminInvoices() { return this.http.get<Invoice[]>(`${this.base}/api/invoices`); }
  createInvoiceFromQuote(quoteId: string) {
    return this.http.post<Invoice>(`${this.base}/api/invoices`, { quoteId });
  }
  createInvoiceManual(payload: { customer: QuotePayload['customer']; lines: { label: string; qty: number; unitPrice: number }[]; projectId?: string }) {
    return this.http.post<Invoice>(`${this.base}/api/invoices`, payload);
  }
  createQuoteManual(payload: { customer: QuotePayload['customer']; lines: { label: string; qty: number; unitPrice: number }[]; projectId?: string; description?: string }) {
    return this.http.post<Quote>(`${this.base}/api/quotes/manual`, payload);
  }
  updateInvoiceStatus(id: string, status: string) {
    return this.http.patch<Invoice>(`${this.base}/api/invoices/${id}`, { status });
  }
  adminSettings() { return this.http.get<any>(`${this.base}/api/admin/settings`); }
  saveAdminSettings(settings: any) { return this.http.put<any>(`${this.base}/api/admin/settings`, settings); }
  adminContacts() { return this.http.get<any[]>(`${this.base}/api/contacts`); }

  // ---- Uploads (admin) ----
  uploadImage(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ url: string }>(`${this.base}/api/admin/uploads`, fd)
      .pipe(map(res => ({ url: `${this.base}${res.url}` })));
  }

  // ---- Products (public) ----
  getProducts() { return this.http.get<Product[]>(`${this.base}/api/products`); }
  getProduct(slug: string) { return this.http.get<Product>(`${this.base}/api/products/${slug}`); }
  subscribe(slug: string, payload: { planId: string; name: string; email: string; company?: string; phone?: string }) {
    return this.http.post<{ id: string; number: string; status: string }>(`${this.base}/api/products/${slug}/subscribe`, payload);
  }

  // ---- Products (admin) ----
  adminProducts() { return this.http.get<Product[]>(`${this.base}/api/admin/products`); }
  adminProduct(id: string) { return this.http.get<Product>(`${this.base}/api/admin/products/${id}`); }
  createProduct(product: Product) { return this.http.post<Product>(`${this.base}/api/admin/products`, product); }
  updateProduct(id: string, product: Product) { return this.http.put<Product>(`${this.base}/api/admin/products/${id}`, product); }
  deleteProduct(id: string) { return this.http.delete<{ ok: boolean }>(`${this.base}/api/admin/products/${id}`); }
  adminSubscribers() { return this.http.get<Subscriber[]>(`${this.base}/api/admin/products/subscribers/all`); }
  updateSubscriberStatus(id: string, status: string) {
    return this.http.patch<Subscriber>(`${this.base}/api/admin/products/subscribers/${id}`, { status });
  }
  deleteSubscriber(id: string) { return this.http.delete<{ ok: boolean }>(`${this.base}/api/admin/products/subscribers/${id}`); }
}
