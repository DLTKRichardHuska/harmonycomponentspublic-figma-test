import { HarmonyElement } from './HarmonyElement.js';
import { toggleSheet } from './toggle.js';
import { readLabelVariant, syncLabelVariant } from './fieldLabel.js';

const VARIANTS = new Set(['default', 'segmented']);
const SIZES = new Set(['sm', 'md']);

/**
 * Form-associated toggle / switch (open Shadow DOM). CE-only surface.
 */
export class HarmonyToggle extends HarmonyElement {
  static formAssociated = true;
  static shadowRootInit = { mode: 'open', delegatesFocus: true };
  static styles = [toggleSheet];

  static get observedAttributes() {
    return [
      'name',
      'checked',
      'disabled',
      'required',
      'id',
      'label',
      'label-variant',
      'variant',
      'option-label-left',
      'option-label-right',
      'size',
    ];
  }

  /** @type {ElementInternals} */
  #internals;
  /** @type {string} */
  #lastVariant = '';
  /** @type {boolean} */
  #defaultChecked = false;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    this.#defaultChecked = this.hasAttribute('checked');
    this.#render();
    this.#sync();
    const control = this.#input();
    control?.addEventListener('input', this.#onInput);
    control?.addEventListener('change', this.#onChange);
    this.addEventListener('click', this.#onHostClick);
    document.addEventListener('demo-product-change', this.#onProductChange);
  }

  disconnectedCallback() {
    const control = this.#input();
    control?.removeEventListener('input', this.#onInput);
    control?.removeEventListener('change', this.#onChange);
    this.removeEventListener('click', this.#onHostClick);
    document.removeEventListener('demo-product-change', this.#onProductChange);
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === 'variant' && this.variant !== this.#lastVariant) {
      this.#render();
      const control = this.#input();
      control?.addEventListener('input', this.#onInput);
      control?.addEventListener('change', this.#onChange);
    }
    this.#sync();
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(v) {
    this.reflectString('name', v);
  }

  get checked() {
    const control = this.#input();
    if (control) return control.checked;
    return this.hasAttribute('checked');
  }

  set checked(v) {
    this.reflectBoolean('checked', Boolean(v));
    const control = this.#input();
    if (control) {
      control.checked = Boolean(v);
      control.setAttribute('aria-checked', control.checked ? 'true' : 'false');
    }
    this.#setFormValue();
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(v) {
    this.reflectBoolean('disabled', Boolean(v));
  }

  get required() {
    return this.hasAttribute('required');
  }

  set required(v) {
    this.reflectBoolean('required', Boolean(v));
  }

  get variant() {
    const v = this.getAttribute('variant') || 'default';
    return VARIANTS.has(v) ? v : 'default';
  }

  set variant(v) {
    const next = VARIANTS.has(v) ? v : 'default';
    this.reflectString('variant', next === 'default' ? '' : next);
  }

  get optionLabelLeft() {
    return this.getAttribute('option-label-left') || 'Item 1';
  }

  set optionLabelLeft(v) {
    this.reflectString('option-label-left', v);
  }

  get optionLabelRight() {
    return this.getAttribute('option-label-right') || 'Item 2';
  }

  set optionLabelRight(v) {
    this.reflectString('option-label-right', v);
  }

  get size() {
    const s = this.getAttribute('size') || 'md';
    return SIZES.has(s) ? s : 'md';
  }

  set size(v) {
    const next = SIZES.has(v) ? v : 'md';
    this.reflectString('size', next === 'md' ? '' : next);
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  set label(v) {
    this.reflectString('label', v);
  }

  get labelVariant() {
    return readLabelVariant(this);
  }

  set labelVariant(v) {
    const next = v === 'inline' || v === 'stacked' ? v : '';
    this.reflectString('label-variant', next);
  }

  #onProductChange = () => {
    if (this.isConnected) this.#sync();
  };

  formDisabledCallback(disabled) {
    const control = this.#input();
    if (control) control.disabled = disabled || this.disabled;
  }

  formResetCallback() {
    this.checked = this.#defaultChecked;
  }

  formStateRestoreCallback(state) {
    this.checked = state != null;
  }

  #input() {
    return /** @type {HTMLInputElement | null} */ (
      this.shadowRoot?.querySelector('[part="input"]')
    );
  }

  #setFormValue() {
    const control = this.#input();
    if (!control) {
      this.#internals.setFormValue(null);
      return;
    }
    this.#internals.setFormValue(control.checked ? 'on' : null);
  }

  #onInput = (e) => {
    const checked = /** @type {HTMLInputElement} */ (e.target).checked;
    this.reflectBoolean('checked', checked);
    e.target.setAttribute('aria-checked', checked ? 'true' : 'false');
    this.#setFormValue();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  };

  #onChange = (e) => {
    const checked = /** @type {HTMLInputElement} */ (e.target).checked;
    this.reflectBoolean('checked', checked);
    e.target.setAttribute('aria-checked', checked ? 'true' : 'false');
    this.#setFormValue();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  /**
   * External `<label for>` (e.g. form-layout) activates the host; shadow clicks
   * already toggle the inner input — only forward when the host itself is the target.
   * @param {MouseEvent} e
   */
  #onHostClick = (e) => {
    if (e.composedPath()[0] !== this) return;
    if (this.disabled) return;
    this.#input()?.click();
  };

  #render() {
    this.#lastVariant = this.variant;
    const segmented = this.variant === 'segmented';
    if (segmented) {
      this.shadowRoot.innerHTML = `
        <label class="toggle" part="control">
          <input type="checkbox" role="switch" class="toggle__input" part="input" />
          <span class="toggle__track toggle__track--segmented" part="track">
            <span class="toggle__thumb toggle__thumb--segmented" part="thumb" aria-hidden="true"></span>
            <span class="toggle__segment toggle__segment--left" part="segment-left"></span>
            <span class="toggle__segment toggle__segment--right" part="segment-right"></span>
          </span>
        </label>
      `;
    } else {
      this.shadowRoot.innerHTML = `
        <label class="toggle" part="control">
          <input type="checkbox" role="switch" class="toggle__input" part="input" />
          <span class="toggle__track" part="track">
            <span class="toggle__thumb" part="thumb"></span>
          </span>
          <span class="toggle__label" part="label"></span>
        </label>
      `;
    }
  }

  #sync() {
    const control = this.#input();
    if (!control) return;
    syncLabelVariant(this);

    if (this.name) control.name = this.name;
    else control.removeAttribute('name');

    control.checked = this.hasAttribute('checked');
    control.disabled = this.disabled;
    control.required = this.required;
    control.setAttribute('aria-checked', control.checked ? 'true' : 'false');

    const segmented = this.variant === 'segmented';
    const labelRoot = this.shadowRoot.querySelector('[part="control"]');
    labelRoot.className = [
      'toggle',
      segmented && 'toggle--segmented',
      this.size === 'sm' && 'toggle--sm',
      this.disabled && 'toggle--disabled',
    ]
      .filter(Boolean)
      .join(' ');

    if (segmented) {
      const left = this.shadowRoot.querySelector('[part="segment-left"]');
      const right = this.shadowRoot.querySelector('[part="segment-right"]');
      if (left) left.textContent = this.optionLabelLeft;
      if (right) right.textContent = this.optionLabelRight;
      const aria =
        this.getAttribute('aria-label') ||
        `${this.optionLabelLeft}, ${this.optionLabelRight}`;
      control.setAttribute('aria-label', aria);
    } else {
      control.removeAttribute('aria-label');
      const labelEl = this.shadowRoot.querySelector('[part="label"]');
      const labelText = this.label;
      if (labelEl) {
        if (labelText && !this.hasAttribute('data-in-form-layout')) {
          labelEl.hidden = false;
          labelEl.textContent = labelText;
        } else {
          labelEl.hidden = true;
          labelEl.textContent = labelText || '';
        }
      }
    }

    this.#setFormValue();
  }
}
