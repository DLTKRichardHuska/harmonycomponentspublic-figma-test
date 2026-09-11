import { HarmonyElement } from './HarmonyElement.js';
import { checkboxSheet } from './checkbox.js';
import { readLabelVariant, syncLabelVariant } from './fieldLabel.js';

/**
 * Form-associated checkbox (open Shadow DOM).
 * Dual path: product CSS also styles native checkboxes (excluding BEM/CE).
 */
export class HarmonyCheckbox extends HarmonyElement {
  static formAssociated = true;
  static shadowRootInit = { mode: 'open', delegatesFocus: true };
  static styles = [checkboxSheet];

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
      'error',
      'error-message',
      'warning',
      'warning-message',
    ];
  }

  /** @type {ElementInternals} */
  #internals;
  /** @type {boolean} */
  #indeterminate = false;
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

  attributeChangedCallback() {
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
    return this.getAttribute('value') || 'on';
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
    this.reflectBoolean('checked', Boolean(v));
    const control = this.#input();
    if (control) control.checked = Boolean(v);
    this.#setFormValue();
  }

  get indeterminate() {
    const control = this.#input();
    if (control) return control.indeterminate;
    return this.#indeterminate;
  }

  set indeterminate(v) {
    this.#indeterminate = Boolean(v);
    const control = this.#input();
    if (control) control.indeterminate = this.#indeterminate;
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
    this.indeterminate = false;
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
    this.#internals.setFormValue(control.checked ? this.value : null);
  }

  #onInput = (e) => {
    const checked = /** @type {HTMLInputElement} */ (e.target).checked;
    this.reflectBoolean('checked', checked);
    this.#indeterminate = false;
    this.#setFormValue();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  };

  #onChange = (e) => {
    const checked = /** @type {HTMLInputElement} */ (e.target).checked;
    this.reflectBoolean('checked', checked);
    this.#indeterminate = false;
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
    this.shadowRoot.innerHTML = `
      <div class="checkbox-wrapper">
        <label class="checkbox" part="control">
          <input type="checkbox" class="checkbox__input" part="input" />
          <span class="checkbox__box" part="box">
            <harmony-icon name="check" class="checkbox__icon"></harmony-icon>
          </span>
          <span class="checkbox__label" part="label"></span>
        </label>
        <p part="message" hidden></p>
      </div>
    `;
  }

  #sync() {
    const control = this.#input();
    if (!control) return;
    syncLabelVariant(this);

    if (this.name) control.name = this.name;
    else control.removeAttribute('name');

    control.value = this.value;
    control.checked = this.hasAttribute('checked');
    control.indeterminate = this.#indeterminate;
    control.disabled = this.disabled;
    control.required = this.required;

    const id = this.id || this.getAttribute('id') || '';
    const messageId =
      this.error && this.errorMessage
        ? `${id || 'harmony-checkbox'}-error`
        : this.warning && this.warningMessage
          ? `${id || 'harmony-checkbox'}-warning`
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
    labelRoot.classList.toggle('checkbox--disabled', this.disabled);
    labelRoot.classList.toggle('checkbox--error', this.error);
    labelRoot.classList.toggle('checkbox--warning', !this.error && this.warning);

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
      messageEl.className = 'checkbox-wrapper__error';
      messageEl.innerHTML = `<harmony-icon name="exclamation-circle" size="sm" class="checkbox-wrapper__error-icon"></harmony-icon>`;
      messageEl.append(document.createTextNode(this.errorMessage));
    } else if (this.warning && this.warningMessage) {
      messageEl.hidden = false;
      messageEl.id = messageId;
      messageEl.className = 'checkbox-wrapper__warning';
      messageEl.innerHTML = `<harmony-icon name="exclamation-triangle" size="sm" class="checkbox-wrapper__warning-icon"></harmony-icon>`;
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
