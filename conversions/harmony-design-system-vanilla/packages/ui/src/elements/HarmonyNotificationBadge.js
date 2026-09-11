import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { notificationBadgeCss } from '../styles/generated/notificationBadgeCss.js';

const TYPES = new Set(['dot', 'number', 'overflow']);
const SIZES = new Set(['sm', 'md', 'lg']);
const VARIANTS = new Set(['error', 'primary']);
const POSITIONS = new Set(['top-end']);

const styles = createSheet(notificationBadgeCss);

/**
 * Notification badge Custom Element (open Shadow DOM).
 * Wraps optional slotted content; badge sits absolute when wrapping a target.
 */
export class HarmonyNotificationBadge extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['type', 'size', 'variant', 'value', 'border', 'position'];
  }

  connectedCallback() {
    if (!this.hasAttribute('type')) this.setAttribute('type', 'number');
    if (!this.hasAttribute('size')) this.setAttribute('size', 'md');
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'primary');
    if (!this.hasAttribute('value')) this.setAttribute('value', '1');
    if (!this.hasAttribute('position')) this.setAttribute('position', 'top-end');
    this.#render();
    this.#sync();
    const slot = this.shadowRoot.querySelector('slot:not([name])');
    slot?.addEventListener('slotchange', this.#onSlotChange);
    this.#onSlotChange();
  }

  disconnectedCallback() {
    const slot = this.shadowRoot?.querySelector('slot:not([name])');
    slot?.removeEventListener('slotchange', this.#onSlotChange);
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get type() {
    const v = this.getAttribute('type') || 'number';
    return TYPES.has(v) ? v : 'number';
  }

  set type(value) {
    this.reflectString('type', TYPES.has(value) ? value : 'number');
  }

  get size() {
    const v = this.getAttribute('size') || 'md';
    return SIZES.has(v) ? v : 'md';
  }

  set size(value) {
    this.reflectString('size', SIZES.has(value) ? value : 'md');
  }

  get variant() {
    const v = this.getAttribute('variant') || 'primary';
    return VARIANTS.has(v) ? v : 'primary';
  }

  set variant(value) {
    this.reflectString('variant', VARIANTS.has(value) ? value : 'primary');
  }

  get value() {
    return this.getAttribute('value') ?? '1';
  }

  set value(v) {
    this.reflectString('value', v == null ? '1' : String(v));
  }

  get border() {
    return this.hasAttribute('border');
  }

  set border(value) {
    this.reflectBoolean('border', Boolean(value));
  }

  get position() {
    const v = this.getAttribute('position') || 'top-end';
    return POSITIONS.has(v) ? v : 'top-end';
  }

  set position(value) {
    this.reflectString('position', POSITIONS.has(value) ? value : 'top-end');
  }

  #onSlotChange = () => {
    const slot = this.shadowRoot?.querySelector('slot:not([name])');
    const assigned = slot?.assignedNodes({ flatten: true }) ?? [];
    const hasContent = assigned.some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      return n.nodeType === Node.TEXT_NODE && Boolean(n.textContent?.trim());
    });
    if (hasContent) this.removeAttribute('data-empty');
    else this.setAttribute('data-empty', '');
  };

  #render() {
    this.shadowRoot.innerHTML = `
      <slot></slot>
      <span part="badge" class="notification-badge"></span>
    `;
  }

  #sync() {
    if (!TYPES.has(this.getAttribute('type') || '')) {
      this.setAttribute('type', 'number');
    }
    if (!SIZES.has(this.getAttribute('size') || '')) {
      this.setAttribute('size', 'md');
    }
    if (!VARIANTS.has(this.getAttribute('variant') || '')) {
      this.setAttribute('variant', 'primary');
    }
    if (!POSITIONS.has(this.getAttribute('position') || '')) {
      this.setAttribute('position', 'top-end');
    }

    const badge = this.shadowRoot?.querySelector('[part="badge"]');
    if (!badge) return;

    const type = this.type;
    const classes = [
      'notification-badge',
      `notification-badge--${type}`,
      `notification-badge--${this.size}`,
      `notification-badge--${this.variant}`,
      this.border ? 'notification-badge--border' : '',
    ].filter(Boolean);
    badge.className = classes.join(' ');

    if (type === 'dot') {
      badge.textContent = '';
      badge.setAttribute('aria-label', 'Notification indicator');
    } else {
      const display = String(this.value);
      badge.textContent = display;
      badge.setAttribute('aria-label', `${display} notifications`);
    }
  }
}
