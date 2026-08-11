import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

/**
 * Remplace une image introuvable par un aplat portant l'initiale du produit.
 *
 * Une fiche dont le visuel manque affichait jusqu'ici l'icône « image cassée »
 * du navigateur, accompagnée du texte alternatif en travers de la carte — le
 * genre de détail qui fait douter du reste du site. Un placeholder assumé vaut
 * mieux qu'un fichier manquant exhibé.
 *
 * Le repli est dessiné en SVG encodé en data-URI : aucune requête réseau
 * supplémentaire, donc aucun risque d'échouer à son tour.
 */
@Directive({
  selector: 'img[svqImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  /** Texte dont la première lettre est dessinée (le nom du produit). */
  @Input('svqImgFallback') label = '';
  /** Couleur de marque du produit, pour que le repli reste dans le ton. */
  @Input() fallbackColor = '#7435F2';

  private el = inject(ElementRef<HTMLImageElement>);
  /** Un seul remplacement : sinon un data-URI refusé bouclerait à l'infini. */
  private replaced = false;

  @HostListener('error')
  onError(): void {
    if (this.replaced) return;
    this.replaced = true;
    const img = this.el.nativeElement as HTMLImageElement;
    img.src = this.placeholder();
    img.style.objectFit = 'cover';
  }

  private placeholder(): string {
    const initial = (this.label.trim()[0] || '?').toUpperCase();
    const color = /^#[0-9a-f]{3,8}$/i.test(this.fallbackColor) ? this.fallbackColor : '#7435F2';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${color}" stop-opacity="0.20"/>
<stop offset="1" stop-color="${color}" stop-opacity="0.05"/>
</linearGradient></defs>
<rect width="640" height="400" fill="url(#g)"/>
<text x="320" y="200" text-anchor="middle" dominant-baseline="central"
 font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="150"
 font-weight="700" fill="${color}" fill-opacity="0.45">${initial}</text>
</svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
}
