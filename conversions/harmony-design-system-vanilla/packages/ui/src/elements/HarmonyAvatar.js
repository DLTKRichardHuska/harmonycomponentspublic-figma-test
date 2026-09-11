import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { avatarCss } from '../styles/generated/avatarCss.js';

const SIZES = new Set(['sm', 'md', 'lg']);
const VARIANTS = new Set(['icon', 'initials', 'image']);
const ICON_SIZES = { sm: 'sm', md: 'md', lg: 'lg' };

const styles = createSheet(avatarCss);

/**
 * User avatar Custom Element (open Shadow DOM).
 * When `interactive`, host is a button-like control; Enter/Space synthesize click.
 */
export class HarmonyAvatar extends HarmonyElement {
  static styles = [styles];
  static shadowRootInit = { mode: 'open', delegatesFocus: true };

  static get observedAttributes() {
    return ['size', 'variant', 'initials', 'src', 'alt', 'interactive', 'disabled'];
  }

  /** @type {ElementInternals | null} */
  #internals = null;

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      this.#internals = this.attachInternals();
    }
    this.addEventListener('keydown', this.#onKeyDown);
    this.addEventListener('click', this.#onClickCapture, true);
  }

  connectedCallback() {
    if (!this.hasAttribute('size')) this.setAttribute('size', 'md');
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'icon');
    this.#render();
    this.#syncA11y();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#render();
    this.#syncA11y();
  }

  get size() {
    const s = this.getAttribute('size') || 'md';
    return SIZES.has(s) ? s : 'md';
  }

  set size(v) {
    this.reflectString('size', SIZES.has(v) ? v : 'md');
  }

  get variant() {
    const v = this.getAttribute('variant') || 'icon';
    return VARIANTS.has(v) ? v : 'icon';
  }

  set variant(v) {
    this.reflectString('variant', VARIANTS.has(v) ? v : 'icon');
  }

  get initials() {
    return this.getAttribute('initials') || '';
  }

  set initials(v) {
    this.reflectString('initials', v);
  }

  get src() {
    return this.getAttribute('src') || '';
  }

  set src(v) {
    this.reflectString('src', v);
  }

  get alt() {
    return this.getAttribute('alt') || '';
  }

  set alt(v) {
    this.reflectString('alt', v);
  }

  get interactive() {
    return this.hasAttribute('interactive');
  }

  set interactive(v) {
    this.reflectBoolean('interactive', Boolean(v));
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(v) {
    this.reflectBoolean('disabled', Boolean(v));
  }

  #normalizeInitials(s) {
    if (!s?.trim()) return '';
    const parts = s.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    const t = parts[0] ?? '';
    if (t.length <= 2) return t.toUpperCase();
    return t.slice(0, 2).toUpperCase();
  }

  #contentVariant() {
    let content = this.variant;
    const initials = this.#normalizeInitials(this.initials);
    if (content === 'initials' && !initials) content = 'icon';
    if (content === 'image' && !this.src) content = 'icon';
    return { content, initials };
  }

  #ariaLabel(content, initials) {
    if (content === 'initials') return `Avatar, initials ${initials}`;
    if (content === 'image') return this.alt || 'User avatar photo';
    return 'User avatar';
  }

  #onKeyDown = (e) => {
    if (!this.interactive || this.disabled) return;
    if (e.target !== this) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  };

  #onClickCapture = (e) => {
    if (this.disabled || !this.interactive) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };

  #render() {
    const { content, initials } = this.#contentVariant();
    this.setAttribute('data-content', content);
    const iconSize = ICON_SIZES[this.size] || 'md';

    let body = '';
    if (content === 'initials') {
      body = `<span part="initials" aria-hidden="true">${escapeHtml(initials)}</span>`;
    } else if (content === 'image') {
      body = `<img part="image" src="${escapeAttr(this.src)}" alt="" aria-hidden="true" />`;
    } else {
      body = `<harmony-icon part="icon" name="user" size="${iconSize}" class="avatar__icon"></harmony-icon>`;
    }

    this.shadowRoot.innerHTML = body;
  }

  #syncA11y() {
    const { content, initials } = this.#contentVariant();
    const label = this.#ariaLabel(content, initials);

    if (this.interactive) {
      if (this.#internals) {
        this.#internals.role = 'button';
        this.#internals.ariaLabel = label;
        this.#internals.ariaDisabled = this.disabled ? 'true' : 'false';
      } else {
        this.setAttribute('role', 'button');
        this.setAttribute('aria-label', label);
        if (this.disabled) this.setAttribute('aria-disabled', 'true');
        else this.removeAttribute('aria-disabled');
      }
      if (!this.hasAttribute('tabindex')) this.tabIndex = this.disabled ? -1 : 0;
      else if (this.disabled) this.tabIndex = -1;
    } else {
      if (this.#internals) {
        this.#internals.role = 'img';
        this.#internals.ariaLabel = label;
        this.#internals.ariaDisabled = null;
      } else {
        this.setAttribute('role', 'img');
        this.setAttribute('aria-label', label);
        this.removeAttribute('aria-disabled');
      }
      if (this.getAttribute('tabindex') === '0') this.removeAttribute('tabindex');
    }
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
