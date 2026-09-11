import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { companyPickerCss } from '../styles/generated/companyPickerCss.js';

const styles = createSheet(companyPickerCss);

let seq = 0;

/**
 * Company picker Custom Element (open Shadow DOM).
 * Slotted options: elements with data-company-id, data-company-color, and a label
 * (textContent or .company-picker__option-name). Fires company-change on select.
 */
export class HarmonyCompanyPicker extends HarmonyElement {
  static styles = [styles];
  static shadowRootInit = { mode: 'open', delegatesFocus: true };

  static get observedAttributes() {
    return ['company-name', 'company-id', 'company-color'];
  }

  /** @type {(() => void) | null} */
  #onDocClick = null;
  /** @type {((e: KeyboardEvent) => void) | null} */
  #onDocKey = null;

  connectedCallback() {
    if (!this.id) this.id = `harmony-company-picker-${++seq}`;
    this.#render();
    this.#sync();
    this.#bind();
  }

  disconnectedCallback() {
    this.#teardownDocListeners();
    this.shadowRoot
      ?.querySelector('[data-company-picker-btn]')
      ?.removeEventListener('click', this.#onTriggerClick);
    this.shadowRoot?.querySelector('slot')?.removeEventListener('slotchange', this.#onSlotChange);
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get companyName() {
    return this.getAttribute('company-name') || '';
  }

  set companyName(v) {
    this.reflectString('company-name', v);
  }

  get companyId() {
    return this.getAttribute('company-id') || '';
  }

  set companyId(v) {
    this.reflectString('company-id', v);
  }

  get companyColor() {
    return this.getAttribute('company-color') || '';
  }

  set companyColor(v) {
    this.reflectString('company-color', v);
  }

  get open() {
    return this.shadowRoot
      ?.querySelector('[data-company-picker-menu]')
      ?.classList.contains('company-picker__menu--open');
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <button
        type="button"
        class="company-picker__btn"
        part="button"
        data-company-picker-btn
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <span class="company-picker__indicator" part="indicator" data-company-indicator></span>
        <span class="company-picker__name" part="name" data-company-name></span>
        <harmony-icon class="company-picker__chevron" name="chevron-down" size="sm" aria-hidden="true"></harmony-icon>
      </button>
      <div
        class="company-picker__menu"
        part="menu"
        data-company-picker-menu
        role="listbox"
        hidden
      >
        <slot></slot>
      </div>
    `;
  }

  #bind() {
    this.shadowRoot
      .querySelector('[data-company-picker-btn]')
      ?.addEventListener('click', this.#onTriggerClick);
    this.shadowRoot.querySelector('slot')?.addEventListener('slotchange', this.#onSlotChange);
    this.#onSlotChange();
  }

  #sync() {
    const nameEl = this.shadowRoot.querySelector('[data-company-name]');
    const indicator = this.shadowRoot.querySelector('[data-company-indicator]');
    if (nameEl) nameEl.textContent = this.companyName || 'Company';
    if (indicator) {
      if (this.companyColor) indicator.style.backgroundColor = this.companyColor;
      else indicator.style.removeProperty('background-color');
    }
    this.#syncSelected();
  }

  #syncSelected() {
    const id = this.companyId;
    for (const el of this.#options()) {
      const match = id && el.getAttribute('data-company-id') === id;
      el.classList.toggle('company-picker__option--selected', Boolean(match));
      el.setAttribute('aria-selected', match ? 'true' : 'false');
      el.setAttribute('role', 'option');
      if (!el.hasAttribute('type') && el.tagName === 'BUTTON') el.setAttribute('type', 'button');
      if (match) {
        el.style.backgroundColor = 'var(--theme-primary-light)';
        el.style.color = 'var(--theme-primary)';
      } else {
        el.style.backgroundColor = 'transparent';
        el.style.color = 'var(--text-secondary)';
      }
    }
  }

  /** @returns {HTMLElement[]} */
  #options() {
    const slot = this.shadowRoot?.querySelector('slot');
    return /** @type {HTMLElement[]} */ (
      (slot?.assignedElements({ flatten: true }) ?? []).filter((n) => n instanceof HTMLElement)
    );
  }

  #setOpen(open) {
    const menu = this.shadowRoot.querySelector('[data-company-picker-menu]');
    const btn = this.shadowRoot.querySelector('[data-company-picker-btn]');
    if (!menu || !btn) return;
    menu.classList.toggle('company-picker__menu--open', open);
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) this.#ensureDocListeners();
    else this.#teardownDocListeners();
  }

  #ensureDocListeners() {
    if (this.#onDocClick) return;
    this.#onDocClick = () => this.#setOpen(false);
    this.#onDocKey = (e) => {
      if (e.key === 'Escape') this.#setOpen(false);
    };
    // Defer so the opening click does not immediately close.
    queueMicrotask(() => {
      document.addEventListener('click', this.#onDocClick);
      document.addEventListener('keydown', this.#onDocKey);
    });
  }

  #teardownDocListeners() {
    if (this.#onDocClick) document.removeEventListener('click', this.#onDocClick);
    if (this.#onDocKey) document.removeEventListener('keydown', this.#onDocKey);
    this.#onDocClick = null;
    this.#onDocKey = null;
  }

  #onTriggerClick = (e) => {
    e.stopPropagation();
    this.#setOpen(!this.open);
  };

  /** @param {HTMLElement} el */
  #styleOption(el) {
    el.classList.add('company-picker__option');
    // Inline styles beat document/demo button defaults that ::slotted cannot override.
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'flex-start';
    el.style.gap = 'var(--space-3)';
    el.style.width = '100%';
    el.style.height = 'auto';
    el.style.minHeight = '0';
    el.style.margin = '0';
    el.style.padding = 'var(--space-2) var(--space-3)';
    el.style.backgroundColor = 'transparent';
    el.style.border = 'none';
    el.style.borderRadius = 'var(--radius-md)';
    el.style.color = 'var(--text-secondary)';
    el.style.fontFamily = 'var(--font-sans)';
    el.style.fontSize = 'var(--text-sm)';
    el.style.fontWeight = 'var(--font-medium)';
    el.style.lineHeight = 'var(--leading-normal)';
    el.style.textAlign = 'left';
    el.style.cursor = 'pointer';
    el.style.boxSizing = 'border-box';
  }

  #onSlotChange = () => {
    for (const el of this.#options()) {
      this.#styleOption(el);
      const color = el.getAttribute('data-company-color') || '';
      if (color) el.style.setProperty('--option-color', color);
      if (!el.querySelector('[data-option-indicator]')) {
        const dot = document.createElement('span');
        dot.setAttribute('data-option-indicator', '');
        dot.setAttribute('aria-hidden', 'true');
        dot.className = 'company-picker__option-indicator';
        dot.style.cssText =
          'display:inline-block;width:var(--space-3,12px);height:var(--space-3,12px);border-radius:50%;flex-shrink:0;' +
          `background-color:${color || 'var(--theme-primary)'};`;
        el.prepend(dot);
      }
      el.addEventListener('click', this.#onOptionClick);
    }
    this.#syncSelected();
  };

  #onOptionClick = (e) => {
    e.stopPropagation();
    const el = /** @type {HTMLElement} */ (e.currentTarget);
    const id = el.getAttribute('data-company-id') || '';
    const color = el.getAttribute('data-company-color') || '';
    const name =
      el.querySelector('.company-picker__option-name')?.textContent?.trim() ||
      el.textContent?.trim() ||
      '';

    this.companyId = id;
    this.companyName = name;
    if (color) this.companyColor = color;

    this.emit('company-change', { id, name, color });
    this.#setOpen(false);
  };
}
