import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { badgeCss } from '../styles/generated/badgeCss.js';

const VARIANTS = new Set([
  'default',
  'primary',
  'success',
  'warning',
  'error',
  'info',
  'orange',
  'pink',
  'disabled',
]);
const SIZES = new Set(['small', 'medium', 'large']);
const ICON_SIZE = { small: 'xs', medium: 'xs', large: 'sm' };

const styles = createSheet(badgeCss);

/**
 * Status badge Custom Element (open Shadow DOM).
 */
export class HarmonyBadge extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['variant', 'size', 'icon'];
  }

  connectedCallback() {
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'default');
    if (!this.hasAttribute('size')) this.setAttribute('size', 'large');
    this.#render();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#render();
  }

  get variant() {
    const v = this.getAttribute('variant') || 'default';
    return VARIANTS.has(v) ? v : 'default';
  }

  set variant(v) {
    this.reflectString('variant', VARIANTS.has(v) ? v : 'default');
  }

  get size() {
    const s = this.getAttribute('size') || 'large';
    return SIZES.has(s) ? s : 'large';
  }

  set size(v) {
    this.reflectString('size', SIZES.has(v) ? v : 'large');
  }

  get icon() {
    return this.getAttribute('icon') || '';
  }

  set icon(v) {
    this.reflectString('icon', v);
  }

  #render() {
    const iconName = this.icon;
    const iconSize = ICON_SIZE[this.size] || 'sm';
    const iconHtml = iconName
      ? `<harmony-icon part="icon" name="${escapeAttr(iconName)}" size="${iconSize}"></harmony-icon>`
      : '';
    this.shadowRoot.innerHTML = `${iconHtml}<slot></slot>`;
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
