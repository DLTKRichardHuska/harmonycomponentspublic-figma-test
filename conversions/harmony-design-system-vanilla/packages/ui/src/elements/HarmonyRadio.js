import { HarmonyElement } from './HarmonyElement.js';
import { radioSheet } from './radio.js';
import { readLabelVariant, syncLabelVariant } from './fieldLabel.js';

const SIZES = new Set(['small', 'medium', 'large']);

/**
 * Form-associated radio (open Shadow DOM).
 * Dual path: product CSS also styles native radios (excluding BEM/CE).
 */
export class HarmonyRadio extends HarmonyElement {
  static formAssociated = true;
  static shadowRootInit = { mode: 'open', delegatesFocus: true };
  static styles = [radioSheet];

  static get observedAttributes() {
    return [
      'name',
      'value',
      'checked',
      'disabled',
      'required',
      'id',
      'label',
      'label-variant',
      'size',
      'error',
      'error-message',
      'warning',
      'warning-message',
    ];
  }

  /** @type {ElementInternals} */
  #internals;
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
    if (name === 'checked' && this.hasAttribute('checked')) {
      this.#uncheckOthers();
    }
    this.#sync();
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(v) {
    this.reflectString('name', v);
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(v) {
    this.reflectString('value', v == null ? '' : String(v));
  }

  get checked() {
    const control = this.#input();
    if (control) return control.checked;
    return this.hasAttribute('checked');
  }

  set checked(v) {
    const on = Boolean(v);
    this.reflectBoolean('checked', on);
    const control = this.#input();
    if (control) control.checked = on;
    if (on) this.#uncheckOthers();
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

  get size() {
    const s = this.getAttribute('size') || 'medium';
    return SIZES.has(s) ? s : 'medium';
  }

  set size(v) {
    const next = SIZES.has(v) ? v : 'medium';
    this.reflectString('size', next === 'medium' ? '' : next);
  }

  get error() {
    return this.hasAttribute('error');
  }

  set error(v) {
    this.reflectBoolean('error', Boolean(v));
  }

  get errorMessage() {
    return this.getAttribute('error-message') || '';
  }

  set errorMessage(v) {
    this.reflectString('error-message', v);
  }

  get warning() {
    return this.hasAttribute('warning');
  }

  set warning(v) {
    this.reflectBoolean('warning', Boolean(v));
  }

  get warningMessage() {
    return this.getAttribute('warning-message') || '';
  }

  set warningMessage(v) {
    this.reflectString('warning-message', v);
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
    if (!control || !control.checked) {
      this.#internals.setFormValue(null);
      return;
    }
    this.#internals.setFormValue(this.value);
  }

  /** Uncheck sibling harmony-radio with the same name (form group, or same root when not in a form). */
  #uncheckOthers() {
    const name = this.name;
    if (!name) return;

    /** @type {Iterable<Element>} */
    let candidates;
    const form = this.#internals.form;
    if (form) {
      candidates = form.elements;
    } else {
      const root = this.getRootNode();
      if (!root || typeof root.querySelectorAll !== 'function') return;
      candidates = root.querySelectorAll(
        `harmony-radio[name="${CSS.escape(name)}"]`,
      );
    }

    for (const el of candidates) {
      if (el === this) continue;
      if (!(el instanceof HTMLElement) || el.tagName !== 'HARMONY-RADIO') continue;
      if (el.getAttribute('name') !== name) continue;
      const radio = /** @type {HarmonyRadio} */ (el);
      if (radio.checked) radio.checked = false;
    }
  }

  #onInput = (e) => {
    const checked = /** @type {HTMLInputElement} */ (e.target).checked;
    this.reflectBoolean('checked', checked);
    if (checked) this.#uncheckOthers();
    this.#setFormValue();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  };

  #onChange = (e) => {
    const checked = /** @type {HTMLInputElement} */ (e.target).checked;
    this.reflectBoolean('checked', checked);
    if (checked) this.#uncheckOthers();
    this.#setFormValue();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  /**
   * External `<label for>` (e.g. form-layout) activates the host; shadow clicks
   * already update the inner input — only forward when the host itself is the target.
   * @param {MouseEvent} e
   */
  #onHostClick = (e) => {
    if (e.composedPath()[0] !== this) return;
    if (this.disabled) return;
    this.#input()?.click();
  };

  #render() {
    this.shadowRoot.innerHTML = `
      <div class="radio-wrapper">
        <label class="radio" part="control">
          <input type="radio" class="radio__input" part="input" />
          <span class="radio__circle" part="circle">
            <span class="radio__dot" part="dot"></span>
          </span>
          <span class="radio__label" part="label"></span>
        </label>
        <p part="message" hidden></p>
      </div>
    `;
  }

  #sizeClass() {
    const size = this.size;
    if (size === 'small') return 'radio--sm';
    if (size === 'large') return 'radio--lg';
    return '';
  }

  #sync() {
    const control = this.#input();
    if (!control) return;
    syncLabelVariant(this);

    if (this.name) control.name = this.name;
    else control.removeAttribute('name');

    control.value = this.value;
    control.checked = this.hasAttribute('checked');
    control.disabled = this.disabled;
    control.required = this.required;

    const id = this.id || this.getAttribute('id') || '';
    const messageId =
      this.error && this.errorMessage
        ? `${id || 'harmony-radio'}-error`
        : this.warning && this.warningMessage
          ? `${id || 'harmony-radio'}-warning`
          : '';

    if (this.error) {
      control.setAttribute('aria-invalid', 'true');
      if (messageId) control.setAttribute('aria-describedby', messageId);
      else control.removeAttribute('aria-describedby');
    } else if (this.warning && this.warningMessage) {
      control.removeAttribute('aria-invalid');
      if (messageId) control.setAttribute('aria-describedby', messageId);
      else control.removeAttribute('aria-describedby');
    } else {
      control.removeAttribute('aria-invalid');
      control.removeAttribute('aria-describedby');
    }

    const labelRoot = this.shadowRoot.querySelector('[part="control"]');
    const sizeClass = this.#sizeClass();
    labelRoot.className = [
      'radio',
      sizeClass,
      this.disabled && 'radio--disabled',
      this.error && 'radio--error',
      !this.error && this.warning && 'radio--warning',
    ]
      .filter(Boolean)
      .join(' ');

    const labelEl = this.shadowRoot.querySelector('[part="label"]');
    const labelText = this.label;
    if (labelText) {
      labelEl.hidden = false;
      labelEl.textContent = labelText;
    } else {
      labelEl.hidden = true;
      labelEl.textContent = '';
    }

    const messageEl = this.shadowRoot.querySelector('[part="message"]');
    if (this.error && this.errorMessage) {
      messageEl.hidden = false;
      messageEl.id = messageId;
      messageEl.className = 'radio-wrapper__error';
      messageEl.innerHTML = `<harmony-icon name="exclamation-circle" size="sm" class="radio-wrapper__error-icon"></harmony-icon>`;
      messageEl.append(document.createTextNode(this.errorMessage));
    } else if (this.warning && this.warningMessage) {
      messageEl.hidden = false;
      messageEl.id = messageId;
      messageEl.className = 'radio-wrapper__warning';
      messageEl.innerHTML = `<harmony-icon name="exclamation-triangle" size="sm" class="radio-wrapper__warning-icon"></harmony-icon>`;
      messageEl.append(document.createTextNode(this.warningMessage));
    } else {
      messageEl.hidden = true;
      messageEl.removeAttribute('id');
      messageEl.className = '';
      messageEl.textContent = '';
    }

    this.#setFormValue();
    this.#internals.ariaInvalid = this.error ? 'true' : null;
  }
}
