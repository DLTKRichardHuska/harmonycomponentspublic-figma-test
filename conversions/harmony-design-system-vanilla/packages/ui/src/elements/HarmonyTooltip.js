import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { tooltipCss } from '../styles/generated/tooltipCss.js';

const POSITIONS = new Set(['top', 'bottom', 'left', 'right']);
const CORNERS = new Set(['top', 'bottom', 'left', 'right']);

const styles = createSheet(tooltipCss);

let descSeq = 0;

/**
 * Tooltip Custom Element (open Shadow DOM).
 * Hover + focus-within show; Escape dismisses until next hover/focus.
 * `content` slot wins over `text` attribute.
 */
export class HarmonyTooltip extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['text', 'position', 'corner-variant'];
  }

  /** @type {string} */
  #descId = `harmony-tooltip-desc-${++descSeq}`;
  /** @type {HTMLElement | null} */
  #descEl = null;

  connectedCallback() {
    if (!this.hasAttribute('position')) this.setAttribute('position', 'top');
    this.#ensureDescriptionNode();
    this.#render();
    this.#sync();
    this.addEventListener('keydown', this.#onKeyDown);
    this.addEventListener('mouseenter', this.#clearDismissed);
    this.addEventListener('focusin', this.#clearDismissed);
    const contentSlot = this.shadowRoot.querySelector('slot[name="content"]');
    contentSlot?.addEventListener('slotchange', this.#onContentSlotChange);
    const triggerSlot = this.shadowRoot.querySelector('slot:not([name])');
    triggerSlot?.addEventListener('slotchange', this.#onTriggerSlotChange);
    this.#onTriggerSlotChange();
    this.#onContentSlotChange();
    // Initial slot assignment can race paint; re-sync description after microtask.
    queueMicrotask(() => {
      this.#onContentSlotChange();
      this.#onTriggerSlotChange();
    });
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.#onKeyDown);
    this.removeEventListener('mouseenter', this.#clearDismissed);
    this.removeEventListener('focusin', this.#clearDismissed);
    this.#teardownDescriptionNode();
    this.#clearTriggerDescribedBy();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get text() {
    return this.getAttribute('text') || '';
  }

  set text(v) {
    this.reflectString('text', v);
  }

  get position() {
    const v = this.getAttribute('position') || 'top';
    return POSITIONS.has(v) ? v : 'top';
  }

  set position(v) {
    this.reflectString('position', POSITIONS.has(v) ? v : 'top');
  }

  get cornerVariant() {
    const v = this.getAttribute('corner-variant');
    return v && CORNERS.has(v) ? v : '';
  }

  set cornerVariant(v) {
    this.reflectString('corner-variant', v && CORNERS.has(v) ? v : null);
  }

  #ensureDescriptionNode() {
    if (this.#descEl?.isConnected) return;
    const el = document.createElement('span');
    el.id = this.#descId;
    el.hidden = true;
    el.setAttribute('data-harmony-tooltip-desc', '');
    // Place after host so it is not assigned to the default trigger slot.
    this.insertAdjacentElement('afterend', el);
    this.#descEl = el;
  }

  #teardownDescriptionNode() {
    this.#descEl?.remove();
    this.#descEl = null;
  }

  #descriptionText() {
    const contentSlot = this.shadowRoot?.querySelector('slot[name="content"]');
    const assigned = contentSlot?.assignedNodes({ flatten: true }) ?? [];
    const fromSlot = assigned
      .map((n) => (n.textContent || '').trim())
      .filter(Boolean)
      .join(' ')
      .trim();
    if (fromSlot) return fromSlot;
    return this.text;
  }

  #onKeyDown = (e) => {
    if (e.key !== 'Escape') return;
    this.setAttribute('data-dismissed', '');
  };

  #clearDismissed = () => {
    this.removeAttribute('data-dismissed');
  };

  #onContentSlotChange = () => {
    this.#syncContentVisibility();
    this.#syncDescription();
    this.#associateTrigger();
  };

  #onTriggerSlotChange = () => {
    this.#associateTrigger();
  };

  #clearTriggerDescribedBy() {
    const triggerSlot = this.shadowRoot?.querySelector('slot:not([name])');
    const nodes = triggerSlot?.assignedElements({ flatten: true }) ?? [];
    for (const el of nodes) {
      if ('ariaDescribedByElements' in el) {
        try {
          /** @type {any} */ (el).ariaDescribedByElements = null;
        } catch {
          /* ignore */
        }
      }
      const described = el.getAttribute('aria-describedby');
      if (described) {
        const ids = described.split(/\s+/).filter((id) => id && id !== this.#descId);
        if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
        else el.removeAttribute('aria-describedby');
      }
    }
  }

  #associateTrigger() {
    this.#clearTriggerDescribedBy();
    const triggerSlot = this.shadowRoot?.querySelector('slot:not([name])');
    const nodes = triggerSlot?.assignedElements({ flatten: true }) ?? [];
    const desc = this.#descEl;
    if (!desc || !nodes.length) return;

    for (const el of nodes) {
      if ('ariaDescribedByElements' in el) {
        try {
          /** @type {any} */ (el).ariaDescribedByElements = [desc];
        } catch {
          /* fall through to IDREF */
        }
      }
      const existing = (el.getAttribute('aria-describedby') || '')
        .split(/\s+/)
        .filter(Boolean);
      if (!existing.includes(this.#descId)) {
        existing.push(this.#descId);
        el.setAttribute('aria-describedby', existing.join(' '));
      }
    }
  }

  #syncContentVisibility() {
    const contentSlot = this.shadowRoot.querySelector('slot[name="content"]');
    const textEl = this.shadowRoot.querySelector('.tooltip__text');
    if (!contentSlot || !textEl) return;
    const assigned = contentSlot.assignedNodes({ flatten: true }).filter((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      return n.nodeType === Node.TEXT_NODE && n.textContent?.trim();
    });
    if (assigned.length) textEl.setAttribute('data-empty', '');
    else textEl.removeAttribute('data-empty');
  }

  #syncDescription() {
    if (this.#descEl) this.#descEl.textContent = this.#descriptionText();
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <slot></slot>
      <span part="content" role="tooltip" aria-hidden="true">
        <slot name="content"></slot>
        <span class="tooltip__text"></span>
      </span>
    `;
  }

  #sync() {
    if (!POSITIONS.has(this.getAttribute('position') || '')) {
      this.setAttribute('position', 'top');
    }
    const textEl = this.shadowRoot.querySelector('.tooltip__text');
    if (textEl) textEl.textContent = this.text;
    this.#syncContentVisibility();
    this.#syncDescription();
    this.#associateTrigger();
  }
}
