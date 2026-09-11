import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { inputFieldCss } from '../styles/generated/inputFieldCss.js';
import { readLabelVariant, syncLabelVariant } from './fieldLabel.js';

const INPUT_TYPES = new Set(['text', 'email', 'password', 'number', 'url', 'search', 'tel']);

const styles = createSheet(inputFieldCss);

/**
 * Form-associated text input (open Shadow DOM).
 * Dual path: product CSS also styles native text-like inputs.
 */
export class HarmonyInput extends HarmonyElement {
  static formAssociated = true;
  static shadowRootInit = { mode: 'open', delegatesFocus: true };
  static styles = [styles];

  static get observedAttributes() {
    return [
      'type',
      'name',
      'value',
      'placeholder',
      'disabled',
      'required',
      'readonly',
      'id',
      'error',
      'error-message',
      'icon',
      'trailing-icon',
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
    const trailing = this.shadowRoot.querySelector('slot[name="trailing"]');
    trailing?.addEventListener('slotchange', this.#onTrailingSlotChange);
    this.#onTrailingSlotChange();
    document.addEventListener('demo-product-change', this.#onProductChange);
  }

  disconnectedCallback() {
    const control = this.#control();
    control?.removeEventListener('input', this.#onInput);
    control?.removeEventListener('change', this.#onChange);
    document.removeEventListener('demo-product-change', this.#onProductChange);
  }

  attributeChangedCallback(name, _old, value) {
    if (name === 'value' && this.#valueDirty && this.isConnected) {
      // Prefer live control value after user edits unless attribute set programmatically
    }
    if (name === 'value') this.#valueDirty = false;
    if (!this.isConnected) return;
    this.#sync();
  }

  get type() {
    const t = this.getAttribute('type') || 'text';
    return INPUT_TYPES.has(t) ? t : 'text';
  }

  set type(v) {
    this.reflectString('type', INPUT_TYPES.has(v) ? v : 'text');
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

  get icon() {
    return this.getAttribute('icon') || '';
  }

  set icon(v) {
    this.reflectString('icon', v);
  }

  get trailingIcon() {
    return this.getAttribute('trailing-icon') || '';
  }

  set trailingIcon(v) {
    this.reflectString('trailing-icon', v);
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
    return /** @type {HTMLInputElement | null} */ (
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

  #onTrailingSlotChange = () => {
    const slot = this.shadowRoot.querySelector('slot[name="trailing"]');
    const host = this.shadowRoot.querySelector('[part="trailing"]');
    if (!slot || !host) return;
    const assigned = slot.assignedNodes({ flatten: true }).filter((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      return n.nodeType === Node.TEXT_NODE && n.textContent?.trim();
    });
    const hasTrailing = assigned.length > 0;
    host.hidden = !hasTrailing;
    if (hasTrailing) this.setAttribute('data-has-trailing', '');
    else this.removeAttribute('data-has-trailing');
    this.#syncTrailingIcon();
  };

  #syncTrailingIcon() {
    const trailingIconEl = this.shadowRoot.querySelector('[part="trailing-icon"]');
    if (!trailingIconEl) return;
    const hasSlot = this.hasAttribute('data-has-trailing');
    const name = this.trailingIcon;
    if (!hasSlot && name) {
      trailingIconEl.hidden = false;
      trailingIconEl.setAttribute('name', name);
    } else {
      trailingIconEl.hidden = true;
    }
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <div class="field">
        <label part="label" class="label" hidden></label>
        <div class="field__body">
          <div class="input-wrapper">
            <harmony-icon part="icon" class="input-wrapper__icon" size="sm" hidden></harmony-icon>
            <input part="control" />
            <div part="trailing" class="input-wrapper__trailing" hidden>
              <slot name="trailing"></slot>
            </div>
            <harmony-icon part="trailing-icon" class="input-wrapper__icon input-wrapper__icon--trailing" size="sm" hidden></harmony-icon>
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

    control.type = this.type;
    if (this.name) control.name = this.name;
    else control.removeAttribute('name');

    if (!this.#valueDirty) {
      control.value = this.getAttribute('value') || '';
    }

    control.placeholder = this.placeholder;
    control.disabled = this.disabled;
    control.required = this.required;
    control.readOnly = this.readOnly;

    const id = this.id || this.getAttribute('id') || '';
    const errorId = id ? `${id}-error` : 'harmony-input-error';

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

    const iconEl = this.shadowRoot.querySelector('[part="icon"]');
    if (this.icon) {
      iconEl.hidden = false;
      iconEl.setAttribute('name', this.icon);
    } else {
      iconEl.hidden = true;
    }

    this.#syncTrailingIcon();

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
