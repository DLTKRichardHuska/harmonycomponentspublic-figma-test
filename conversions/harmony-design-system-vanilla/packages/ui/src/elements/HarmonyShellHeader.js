import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { shellHeaderCss } from '../styles/generated/shellHeaderCss.js';
import { resolveProductLogoUrl } from './productLogo.js';

const styles = createSheet(shellHeaderCss);

/**
 * Shell header Custom Element (open Shadow DOM).
 * Brand mark uses product-kit assets/logo.svg (no logo-src attribute). Actions are slotted.
 */
export class HarmonyShellHeader extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['product-name', 'gradient-color', 'href'];
  }

  /** @type {MutationObserver | null} */
  #styleObserver = null;

  connectedCallback() {
    if (!this.hasAttribute('product-name')) this.setAttribute('product-name', 'Harmony');
    this.#render();
    this.#sync();
    this.#observeProductStyles();
  }

  disconnectedCallback() {
    this.#styleObserver?.disconnect();
    this.#styleObserver = null;
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get productName() {
    return this.getAttribute('product-name') || 'Harmony';
  }

  set productName(v) {
    this.reflectString('product-name', v);
  }

  get gradientColor() {
    return this.getAttribute('gradient-color') || '';
  }

  set gradientColor(v) {
    this.reflectString('gradient-color', v);
  }

  get brandHref() {
    return this.getAttribute('href') || '/';
  }

  set brandHref(v) {
    this.reflectString('href', v);
  }

  #observeProductStyles() {
    const link = document.getElementById('harmony-product-styles');
    if (!link) return;
    this.#styleObserver = new MutationObserver(() => this.#syncLogo());
    this.#styleObserver.observe(link, { attributes: true, attributeFilter: ['href'] });
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <div class="header" part="header">
        <div class="header__brand" part="brand">
          <a class="header__brand-link" part="brand-link" href="/">
            <span class="header__logo" part="logo" aria-hidden="true"></span>
            <span class="header__title" part="title"></span>
          </a>
        </div>
        <div class="header__actions" part="actions">
          <slot name="actions"></slot>
        </div>
        <div class="header__gradient" part="gradient" data-header-gradient></div>
      </div>
    `;
  }

  #sync() {
    const title = this.shadowRoot.querySelector('.header__title');
    const link = this.shadowRoot.querySelector('.header__brand-link');
    if (title) title.textContent = this.productName;
    if (link) {
      link.setAttribute('href', this.brandHref);
      link.setAttribute('aria-label', this.productName);
    }
    this.#syncLogo();
    this.#syncGradient();
  }

  #syncLogo() {
    const host = this.shadowRoot.querySelector('.header__logo');
    if (!host) return;
    const url = resolveProductLogoUrl();
    let img = host.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = '';
      host.replaceChildren(img);
    }
    if (img.getAttribute('src') !== url) img.setAttribute('src', url);
  }

  #syncGradient() {
    const color = this.gradientColor;
    if (color) this.style.setProperty('--header-gradient-color', color);
    else this.style.removeProperty('--header-gradient-color');
  }
}
