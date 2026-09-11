import { HarmonyElement } from './HarmonyElement.js';

const VARIANTS = new Set(['default', 'outline']);
const SIZES = new Set(['sm', 'md', 'lg']);
const ORIENTATIONS = new Set(['horizontal', 'vertical']);

const MANAGED_CLASSES = new Set([
  'btn-group',
  'btn-group--default',
  'btn-group--outline',
  'btn-group--sm',
  'btn-group--md',
  'btn-group--lg',
  'btn-group--horizontal',
  'btn-group--vertical',
]);

/**
 * Light-DOM hybrid helper: maps attributes to the native `.btn-group` class recipe.
 * Document `styles.css` (product stylesheet includes button-group.css) styles the host.
 */
export class HarmonyButtonGroup extends HarmonyElement {
  static shadowRootInit = null;

  static get observedAttributes() {
    return ['variant', 'size', 'orientation'];
  }

  connectedCallback() {
    this.#sync();
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

  get size() {
    const v = this.getAttribute('size') || 'md';
    return SIZES.has(v) ? v : 'md';
  }

  set size(value) {
    this.reflectString('size', SIZES.has(value) ? value : 'md');
  }

  get orientation() {
    const v = this.getAttribute('orientation') || 'horizontal';
    return ORIENTATIONS.has(v) ? v : 'horizontal';
  }

  set orientation(value) {
    this.reflectString('orientation', ORIENTATIONS.has(value) ? value : 'horizontal');
  }

  #sync() {
    const classes = [
      'btn-group',
      `btn-group--${this.variant}`,
      `btn-group--${this.size}`,
      `btn-group--${this.orientation}`,
    ];

    const extra = [...this.classList].filter((c) => !MANAGED_CLASSES.has(c));
    this.className = [...classes, ...extra].join(' ');

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'group');
    }
  }
}
