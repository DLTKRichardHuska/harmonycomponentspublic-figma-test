import { HarmonyElement } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { pickersSheet } from './pickers.js';

let seq = 0;

const ANCHOR_OK = typeof CSS !== 'undefined' && CSS.supports('top', 'anchor(bottom)');

/**
 * Anchored picker popover (open Shadow DOM).
 * Popover API for open/close, Escape, and light dismiss. Not a form control.
 */
export class HarmonyPickerPopup extends HarmonyElement {
  static styles = [typographySheet, pickersSheet];

  static get observedAttributes() {
    return ['for', 'open', 'title'];
  }

  /** @type {HTMLElement | null} */
  #trigger = null;
  /** @type {boolean} */
  #ownsTarget = false;
  /** @type {string} */
  #anchorName = '';
  /** @type {boolean} */
  #syncingOpen = false;
  /** @type {(() => void) | null} */
  #onViewport = null;

  constructor() {
    super();
    if (!this.hasAttribute('popover')) this.setAttribute('popover', 'auto');
  }

  connectedCallback() {
    this.#ensureId();
    this.#render();
    this.#sync();
    this.addEventListener('toggle', this.#onToggle);
    this.shadowRoot.querySelector('[data-close]')?.addEventListener('click', this.#onClose);
    if (this.hasAttribute('open')) this.show();
  }

  disconnectedCallback() {
    this.removeEventListener('toggle', this.#onToggle);
    this.#unbindTrigger();
    this.#stopViewport();
  }

  attributeChangedCallback(name) {
    if (!this.isConnected || this.#syncingOpen) return;
    if (name === 'for') this.#bindTrigger();
    if (name === 'title') this.#syncTitle();
    if (name === 'open') this.#syncOpen();
  }

  get triggerId() {
    return this.getAttribute('for') || '';
  }

  set triggerId(v) {
    this.reflectString('for', v);
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(v) {
    this.reflectBoolean('open', Boolean(v));
  }

  get titleText() {
    return this.getAttribute('title') || '';
  }

  set titleText(v) {
    this.reflectString('title', v);
  }

  show() {
    this.#ensureId();
    this.#bindTrigger();
    if (!this.matches(':popover-open')) this.showPopover();
    this.#position();
    queueMicrotask(() => this.#focusPicker());
  }

  hide() {
    if (this.matches(':popover-open')) this.hidePopover();
  }

  #ensureId() {
    if (!this.id) this.id = `harmony-picker-popup-${++seq}`;
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <div part="panel" role="dialog" aria-modal="false">
        <div class="picker-popup__header" hidden>
          <h2 class="picker-popup__title" id="${this.id}-title"></h2>
          <button type="button" class="picker-popup__close" data-close aria-label="Close picker">
            <harmony-icon name="x-mark" size="sm"></harmony-icon>
          </button>
        </div>
        <div class="picker-popup__body">
          <slot></slot>
        </div>
      </div>
    `;
  }

  #sync() {
    this.#syncTitle();
    this.#bindTrigger();
  }

  #syncTitle() {
    const title = this.getAttribute('title') || '';
    const header = this.shadowRoot.querySelector('.picker-popup__header');
    const heading = this.shadowRoot.querySelector('.picker-popup__title');
    const panel = this.shadowRoot.querySelector('[part="panel"]');
    if (heading) heading.textContent = title;
    header?.toggleAttribute('hidden', !title);
    if (title) panel?.setAttribute('aria-labelledby', `${this.id}-title`);
    else panel?.removeAttribute('aria-labelledby');
  }

  #triggerEl() {
    const id = this.getAttribute('for');
    if (!id) return null;
    const root = this.getRootNode();
    if (root && typeof root.getElementById === 'function') {
      const local = root.getElementById(id);
      if (local) return local;
    }
    return document.getElementById(id);
  }

  #bindTrigger() {
    const next = this.#triggerEl();
    if (next === this.#trigger) return;
    this.#unbindTrigger();
    if (!next) return;
    this.#trigger = next;
    this.#anchorName = `--harmony-picker-${this.id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    next.setAttribute('aria-haspopup', 'dialog');
    next.setAttribute('aria-controls', this.id);
    next.setAttribute('aria-expanded', this.matches(':popover-open') ? 'true' : 'false');
    if (!next.hasAttribute('popovertarget') && !next.popoverTargetElement) {
      next.popoverTargetElement = this;
      this.#ownsTarget = true;
    }
  }

  #unbindTrigger() {
    const trigger = this.#trigger;
    if (!trigger) return;
    if (this.#ownsTarget && trigger.popoverTargetElement === this) {
      trigger.popoverTargetElement = null;
      trigger.removeAttribute('popovertarget');
    }
    if (this.#anchorName) trigger.style.anchorName = '';
    trigger.removeAttribute('aria-expanded');
    this.#trigger = null;
    this.#ownsTarget = false;
  }

  #syncOpen() {
    const want = this.hasAttribute('open');
    const isOpen = this.matches(':popover-open');
    if (want && !isOpen) this.show();
    else if (!want && isOpen) this.hide();
  }

  #onToggle = (event) => {
    if (!(event instanceof ToggleEvent)) return;
    const open = event.newState === 'open';
    this.#syncingOpen = true;
    this.reflectBoolean('open', open);
    this.#syncingOpen = false;
    this.#trigger?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      this.#position();
      this.#startViewport();
      this.#focusPicker();
    } else {
      this.#stopViewport();
    }
    this.emit('toggle', { open });
  };

  #onClose = (event) => {
    event.stopPropagation();
    this.hide();
  };

  #focusPicker() {
    const slot = this.shadowRoot?.querySelector('slot');
    for (const el of slot?.assignedElements({ flatten: true }) ?? []) {
      if (typeof el.focusSelected === 'function') {
        el.focusSelected();
        return;
      }
    }
  }

  #position() {
    const trigger = this.#triggerEl();
    const narrow = window.matchMedia('(max-width: 768px)').matches;
    if (!trigger || narrow) {
      this.removeAttribute('data-anchor');
      this.style.top = '';
      this.style.left = '';
      this.style.positionAnchor = '';
      return;
    }
    // Prefer measured fixed placement. CSS anchor() is applied first when supported,
    // then corrected if the popover did not land under the trigger (partial support).
    if (ANCHOR_OK && this.#anchorName) {
      trigger.style.anchorName = this.#anchorName;
      this.style.positionAnchor = this.#anchorName;
    }
    this.#positionFallback(trigger);
    if (ANCHOR_OK) {
      requestAnimationFrame(() => {
        if (!this.matches(':popover-open')) return;
        const box = this.getBoundingClientRect();
        const trig = trigger.getBoundingClientRect();
        const near =
          Math.abs(box.left - trig.left) < 48 &&
          box.top >= trig.bottom - 4 &&
          box.top < trig.bottom + 96;
        if (!near) this.#positionFallback(trigger);
      });
    }
  }

  /**
   * @param {HTMLElement} trigger
   */
  #positionFallback(trigger) {
    this.setAttribute('data-anchor', 'fallback');
    const rect = trigger.getBoundingClientRect();
    const gap = 8;
    const box = this.getBoundingClientRect();
    const width = box.width || 320;
    const height = box.height || 360;
    let left = rect.left;
    let top = rect.bottom + gap;
    if (left + width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - width - 8);
    if (top + height > window.innerHeight - 8) top = Math.max(8, rect.top - height - gap);
    this.style.top = `${Math.round(top)}px`;
    this.style.left = `${Math.round(left)}px`;
  }

  #startViewport() {
    if (this.#onViewport) return;
    this.#onViewport = () => this.#position();
    window.addEventListener('resize', this.#onViewport);
    window.addEventListener('scroll', this.#onViewport, true);
  }

  #stopViewport() {
    if (!this.#onViewport) return;
    window.removeEventListener('resize', this.#onViewport);
    window.removeEventListener('scroll', this.#onViewport, true);
    this.#onViewport = null;
  }
}
