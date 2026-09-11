import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { alertCss } from '../styles/generated/alertCss.js';

const VARIANTS = new Set(['info', 'success', 'warning', 'error']);
const DEFAULT_ICONS = {
  info: 'information-circle',
  success: 'check-circle',
  warning: 'exclamation-triangle',
  error: 'exclamation-circle',
};

const styles = createSheet(alertCss);

/**
 * Alert Custom Element (open Shadow DOM).
 * Dismiss emits `dismiss` — consumer removes the host.
 * Enhanced actions via named `actions` slot (compose DS buttons/links).
 */
export class HarmonyAlert extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['variant', 'enhanced', 'title', 'dismissible', 'icon', 'progress-value'];
  }

  /** @type {ElementInternals | null} */
  #internals = null;
  /** @type {MutationObserver | null} */
  #slotObserver = null;

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      this.#internals = this.attachInternals();
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'info');
    this.#render();
    this.#sync();
    this.shadowRoot.addEventListener('click', this.#onClick);
    const actionsSlot = this.shadowRoot.querySelector('slot[name="actions"]');
    actionsSlot?.addEventListener('slotchange', this.#onActionsSlotChange);
    this.#onActionsSlotChange();
  }

  disconnectedCallback() {
    this.shadowRoot?.removeEventListener('click', this.#onClick);
    this.#slotObserver?.disconnect();
    this.#slotObserver = null;
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get variant() {
    const v = this.getAttribute('variant') || 'info';
    return VARIANTS.has(v) ? v : 'info';
  }

  set variant(v) {
    this.reflectString('variant', VARIANTS.has(v) ? v : 'info');
  }

  get enhanced() {
    return this.hasAttribute('enhanced');
  }

  set enhanced(v) {
    this.reflectBoolean('enhanced', Boolean(v));
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  set title(v) {
    this.reflectString('title', v);
  }

  get dismissible() {
    return this.hasAttribute('dismissible');
  }

  set dismissible(v) {
    this.reflectBoolean('dismissible', Boolean(v));
  }

  get icon() {
    return this.getAttribute('icon') || '';
  }

  set icon(v) {
    this.reflectString('icon', v);
  }

  get progressValue() {
    if (!this.hasAttribute('progress-value')) return null;
    const n = Number(this.getAttribute('progress-value'));
    return Number.isFinite(n) ? n : null;
  }

  set progressValue(v) {
    if (v == null || v === '') this.removeAttribute('progress-value');
    else this.setAttribute('progress-value', String(v));
  }

  #iconName() {
    return this.icon || DEFAULT_ICONS[this.variant] || DEFAULT_ICONS.info;
  }

  #progressVariant() {
    return this.variant === 'info' ? 'default' : this.variant;
  }

  #onClick = (e) => {
    const close = e.target.closest?.('[part="close"]');
    if (!close) return;
    e.stopPropagation();
    this.emit('dismiss');
  };

  #onActionsSlotChange = () => {
    const slot = this.shadowRoot.querySelector('slot[name="actions"]');
    const host = this.shadowRoot.querySelector('[part="actions"]');
    if (!slot || !host) return;
    const assigned = slot.assignedNodes({ flatten: true }).filter((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      return n.nodeType === Node.TEXT_NODE && n.textContent?.trim();
    });
    if (assigned.length) host.removeAttribute('data-empty');
    else host.setAttribute('data-empty', '');
  };

  #render() {
    this.shadowRoot.innerHTML = `
      <div part="border" aria-hidden="true"></div>
      <div class="alert__body">
        <div class="alert__main">
          <harmony-icon part="icon" name="${escapeAttr(this.#iconName())}" size="md"></harmony-icon>
          <div class="alert__text">
            <div part="title" hidden></div>
            <div part="message"><slot>Alert message.</slot></div>
          </div>
          <button type="button" part="close" aria-label="Dismiss" hidden>
            <harmony-icon name="x-mark" size="sm"></harmony-icon>
          </button>
        </div>
        <div part="actions" data-empty>
          <slot name="actions"></slot>
        </div>
        <div part="progress" hidden></div>
      </div>
    `;
  }

  #sync() {
    if (this.#internals) this.#internals.role = 'alert';
    else this.setAttribute('role', 'alert');

    const iconEl = this.shadowRoot.querySelector('[part="icon"]');
    if (iconEl) iconEl.setAttribute('name', this.#iconName());

    const titleEl = this.shadowRoot.querySelector('[part="title"]');
    if (titleEl) {
      if (this.title) {
        titleEl.hidden = false;
        titleEl.textContent = this.title;
      } else {
        titleEl.hidden = true;
        titleEl.textContent = '';
      }
    }

    const close = this.shadowRoot.querySelector('[part="close"]');
    if (close) close.hidden = !this.dismissible;

    const progressHost = this.shadowRoot.querySelector('[part="progress"]');
    if (progressHost) {
      const value = this.enhanced ? this.progressValue : null;
      if (value == null) {
        progressHost.hidden = true;
        progressHost.innerHTML = '';
      } else {
        progressHost.hidden = false;
        let bar = progressHost.querySelector('harmony-progress');
        if (!bar) {
          progressHost.innerHTML = `<harmony-progress size="sm"></harmony-progress>`;
          bar = progressHost.querySelector('harmony-progress');
        }
        bar.setAttribute('value', String(value));
        bar.setAttribute('variant', this.#progressVariant());
        bar.setAttribute('size', 'sm');
      }
    }

    this.#onActionsSlotChange();
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
