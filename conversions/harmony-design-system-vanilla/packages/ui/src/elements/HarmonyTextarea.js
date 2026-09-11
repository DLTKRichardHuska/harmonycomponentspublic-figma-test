import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { inputFieldCss } from '../styles/generated/inputFieldCss.js';
import { readLabelVariant, syncLabelVariant } from './fieldLabel.js';

const styles = createSheet(inputFieldCss);

/**
 * Form-associated textarea (open Shadow DOM).
 * Dual path: product CSS also styles native textarea.
 */
export class HarmonyTextarea extends HarmonyElement {
  static formAssociated = true;
  static shadowRootInit = { mode: 'open', delegatesFocus: true };
  static styles = [styles];

  static get observedAttributes() {
    return [
      'name',
      'value',
      'placeholder',
      'disabled',
      'required',
      'readonly',
      'id',
      'rows',
      'error',
      'error-message',
      'label',
      'label-variant',
    ];
  }

  /** @type {ElementInternals} */
  #internals;
  /** @type {boolean} */
  #valueDirty = false;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    this.#render();
    this.#sync();
    const control = this.#control();
    control?.addEventListener('input', this.#onInput);
    control?.addEventListener('change', this.#onChange);
    document.addEventListener('demo-product-change', this.#onProductChange);
  }

  disconnectedCallback() {
    const control = this.#control();
    control?.removeEventListener('input', this.#onInput);
    control?.removeEventListener('change', this.#onChange);
    document.removeEventListener('demo-product-change', this.#onProductChange);
  }

  attributeChangedCallback(name) {
    if (name === 'value') this.#valueDirty = false;
    if (!this.isConnected) return;
    this.#sync();
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(v) {
    this.reflectString('name', v);
  }

  get value() {
    const control = this.#control();
    if (control) return control.value;
    return this.getAttribute('value') || '';
  }

  set value(v) {
    this.#valueDirty = false;
    this.reflectString('value', v == null ? '' : String(v));
    const control = this.#control();
    if (control) control.value = v == null ? '' : String(v);
    this.#internals.setFormValue(this.value);
  }

  get placeholder() {
    return this.getAttribute('placeholder') || '';
  }

  set placeholder(v) {
    this.reflectString('placeholder', v);
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

  get readOnly() {
    return this.hasAttribute('readonly');
  }

  set readOnly(v) {
    this.reflectBoolean('readonly', Boolean(v));
  }

  get rows() {
    const n = Number(this.getAttribute('rows') || '4');
    return Number.isFinite(n) && n > 0 ? n : 4;
  }

  set rows(v) {
    this.setAttribute('rows', String(v));
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
    const control = this.#control();
    if (control) control.disabled = disabled || this.disabled;
  }

  formResetCallback() {
    this.#valueDirty = false;
    const initial = this.getAttribute('value') || '';
    const control = this.#control();
    if (control) control.value = initial;
    this.#internals.setFormValue(initial);
  }

  formStateRestoreCallback(state) {
    this.value = state == null ? '' : String(state);
  }

  #control() {
    return /** @type {HTMLTextAreaElement | null} */ (
      this.shadowRoot?.querySelector('[part="control"]')
    );
  }

  #onInput = (e) => {
    this.#valueDirty = true;
    this.#internals.setFormValue(e.target.value);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  };

  #onChange = (e) => {
    this.#valueDirty = true;
    this.#internals.setFormValue(e.target.value);
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  #render() {
    this.shadowRoot.innerHTML = `
      <div class="field">
        <label part="label" class="label" hidden></label>
        <div class="field__body">
          <div class="input-wrapper">
            <textarea part="control"></textarea>
          </div>
          <p part="error" class="input-wrapper__error" hidden></p>
        </div>
      </div>
    `;
  }

  #sync() {
    const control = this.#control();
    if (!control) return;
    syncLabelVariant(this);

    if (this.name) control.name = this.name;
    else control.removeAttribute('name');

    if (!this.#valueDirty) {
      control.value = this.getAttribute('value') || '';
    }

    control.placeholder = this.placeholder;
    control.disabled = this.disabled;
    control.required = this.required;
    control.readOnly = this.readOnly;
    control.rows = this.rows;

    const id = this.id || this.getAttribute('id') || '';
    const errorId = id ? `${id}-error` : 'harmony-textarea-error';

    if (this.error) {
      control.setAttribute('aria-invalid', 'true');
      if (this.errorMessage) control.setAttribute('aria-describedby', errorId);
      else control.removeAttribute('aria-describedby');
    } else {
      control.removeAttribute('aria-invalid');
      control.removeAttribute('aria-describedby');
    }

    const labelEl = this.shadowRoot.querySelector('[part="label"]');
    const labelText = this.label;
    if (labelText) {
      labelEl.hidden = false;
      labelEl.textContent = labelText;
      labelEl.classList.toggle('label--required', this.required);
      if (id) labelEl.setAttribute('for', id);
      else labelEl.removeAttribute('for');
    } else {
      labelEl.hidden = true;
      labelEl.textContent = '';
    }

    const errorEl = this.shadowRoot.querySelector('[part="error"]');
    if (this.error && this.errorMessage) {
      errorEl.hidden = false;
      errorEl.id = errorId;
      errorEl.textContent = this.errorMessage;
    } else {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }

    this.#internals.setFormValue(control.value);
    this.#internals.ariaInvalid = this.error ? 'true' : null;
  }
}
