import { HarmonyElement } from './HarmonyElement.js';

const VARIANTS = new Set(['default', 'no-borders']);

const MANAGED_CLASSES = new Set(['list-menu', 'list-menu--no-borders']);

/**
 * Light-DOM hybrid helper: maps attributes to the native `.list-menu` class recipe
 * and ensures direct `a` / `button` children carry item classes.
 * Document `styles.css` (product stylesheet includes list-menu.css) styles the host.
 */
export class HarmonyListMenu extends HarmonyElement {
  static shadowRootInit = null;

  static get observedAttributes() {
    return ['variant'];
  }

  /** @type {MutationObserver | null} */
  #childObserver = null;
  /** @type {boolean} */
  #syncing = false;

  connectedCallback() {
    this.#sync();
    this.#childObserver = new MutationObserver(() => {
      if (this.#syncing) return;
      this.#syncItems();
    });
    this.#childObserver.observe(this, { childList: true, subtree: true });
  }

  disconnectedCallback() {
    this.#childObserver?.disconnect();
    this.#childObserver = null;
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get variant() {
    const v = this.getAttribute('variant') || 'default';
    return VARIANTS.has(v) ? v : 'default';
  }

  set variant(value) {
    this.reflectString('variant', VARIANTS.has(value) ? value : 'default');
  }

  #syncHostClasses() {
    const classes = [
      'list-menu',
      this.variant === 'no-borders' ? 'list-menu--no-borders' : '',
    ].filter(Boolean);

    const extra = [...this.classList].filter((c) => !MANAGED_CLASSES.has(c));
    this.className = [...classes, ...extra].join(' ');
  }

  #syncItems() {
    this.#syncing = true;
    try {
      for (const child of this.children) {
        if (!(child instanceof HTMLElement)) continue;
        const tag = child.tagName;
        if (tag !== 'A' && tag !== 'BUTTON') continue;
        if (!child.classList.contains('list-menu__item')) {
          child.classList.add('list-menu__item');
        }
        for (const icon of child.querySelectorAll('harmony-icon')) {
          if (!icon.classList.contains('list-menu__item-icon')) {
            icon.classList.add('list-menu__item-icon');
          }
        }
      }
    } finally {
      this.#syncing = false;
    }
  }

  #sync() {
    this.#syncHostClasses();
    this.#syncItems();
  }
}
