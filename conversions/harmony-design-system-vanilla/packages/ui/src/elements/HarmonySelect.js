import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { inputFieldCss } from '../styles/generated/inputFieldCss.js';
import { readLabelVariant, syncLabelVariant } from './fieldLabel.js';

const styles = createSheet(inputFieldCss);

/**
 * Form-associated select (open Shadow DOM).
 * Dual path: product CSS also styles native select.
 * Options are light-DOM <option> / <optgroup> (copied, not moved).
 * The open list is the OS picker.
 */
export class HarmonySelect extends HarmonyElement {
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
      'id',
      'error',
      'error-message',
      'label',
      'label-variant',
      'multiple',
    ];
  }

  /** @type {ElementInternals} */
  #internals;
  /** @type {boolean} */
  #valueDirty = false;
  /** @type {MutationObserver | null} */
  #observer = null;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    this.#render();
    const control = this.#control();
    control?.addEventListener('input', this.#onInput);
    control?.addEventListener('change', this.#onChange);
    const slot = this.shadowRoot.querySelector('slot.options-source');
    slot?.addEventListener('slotchange', this.#onSlotChange);
    this.#observer = new MutationObserver(() => {
      if (!this.isConnected) return;
      this.#syncOptions();
    });
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['value', 'label', 'disabled', 'selected', 'hidden'],
    });
    this.#sync();
    document.addEventListener('demo-product-change', this.#onProductChange);
  }

  disconnectedCallback() {
    const control = this.#control();
    control?.removeEventListener('input', this.#onInput);
    control?.removeEventListener('change', this.#onChange);
    this.#observer?.disconnect();
    this.#observer = null;
    document.removeEventListener('demo-product-change', this.#onProductChange);
  }

  attributeChangedCallback(name) {
    if (name === 'multiple') {
      if (this.hasAttribute('multiple')) this.removeAttribute('multiple');
      const control = this.#control();
      if (control) control.multiple = false;
      return;
    }
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
    if (!control) return this.getAttribute('value') || '';
    return control.value;
  }

  set value(v) {
    this.#valueDirty = false;
    this.reflectString('value', v == null ? '' : String(v));
    if (this.isConnected) this.#applyValue();
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
    this.#applyValue();
  }

  formStateRestoreCallback(state) {
    this.value = state == null ? '' : String(state);
  }

  #control() {
    return /** @type {HTMLSelectElement | null} */ (
      this.shadowRoot?.querySelector('[part="control"]')
    );
  }

  #onInput = () => {
    this.#valueDirty = true;
    this.#commitFormValue();
    this.#syncPlaceholderShown();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  };

  #onChange = () => {
    this.#valueDirty = true;
    this.#commitFormValue();
    this.#syncPlaceholderShown();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  #onSlotChange = () => {
    this.#syncOptions();
  };

  #applyValue() {
    const control = this.#control();
    if (!control) return;
    const attr = this.getAttribute('value');
    if (attr != null && attr !== '') {
      control.value = attr;
    } else if (this.placeholder) {
      const picked = [...control.options].some((o) => o.defaultSelected && o.value);
      if (!picked) control.selectedIndex = 0;
    }
    this.#commitFormValue();
    this.#syncPlaceholderShown();
  }

  #syncOptions() {
    const control = this.#control();
    if (!control) return;

    const live = control.value;
    control.replaceChildren();

    if (this.placeholder) {
      const ph = document.createElement('option');
      ph.value = '';
      ph.disabled = true;
      ph.textContent = this.placeholder;
      control.append(ph);
    }

    const slot = this.shadowRoot.querySelector('slot.options-source');
    const assigned = slot
      ? slot.assignedElements({ flatten: true })
      : [...this.children];
    for (const node of assigned) {
      if (node.tagName === 'OPTION' || node.tagName === 'OPTGROUP') {
        control.append(node.cloneNode(true));
      }
    }

    if (this.#valueDirty) {
      if (live != null) control.value = live;
    } else {
      this.#applyValue();
      return;
    }

    this.#commitFormValue();
    this.#syncPlaceholderShown();
  }

  #syncPlaceholderShown() {
    const control = this.#control();
    const shown = Boolean(control && this.placeholder && control.value === '');
    this.toggleAttribute('data-placeholder-shown', shown);
  }

  #commitFormValue() {
    const control = this.#control();
    if (!control) return;
    this.#internals.setFormValue(control.value);

    const missing = this.required && !control.value;
    if (missing) {
      this.#internals.setValidity({ valueMissing: true }, 'Please select an option.', control);
    } else {
      this.#internals.setValidity({});
    }
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <div class="field">
        <label part="label" class="label" hidden></label>
        <div class="field__body">
          <slot class="options-source"></slot>
          <select part="control"></select>
          <p part="error" class="input-wrapper__error" hidden></p>
        </div>
      </div>
    `;
  }

  #sync() {
    const control = this.#control();
    if (!control) return;
    syncLabelVariant(this);

    if (this.hasAttribute('multiple')) this.removeAttribute('multiple');
    control.multiple = false;
    control.disabled = this.disabled;
    control.required = this.required;

    const id = this.id || this.getAttribute('id') || '';
    if (id) control.id = id;
    else control.removeAttribute('id');
    const errorId = id ? `${id}-error` : 'harmony-select-error';

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
    if (labelText && !this.hasAttribute('data-in-form-layout')) {
      labelEl.hidden = false;
      labelEl.textContent = labelText;
      labelEl.classList.toggle('label--required', this.required);
      if (id) labelEl.setAttribute('for', id);
      else labelEl.removeAttribute('for');
    } else {
      labelEl.hidden = true;
      if (!labelText) labelEl.textContent = '';
      else {
        labelEl.textContent = labelText;
        labelEl.classList.toggle('label--required', this.required);
      }
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

    this.#syncOptions();
    this.#internals.ariaInvalid = this.error ? 'true' : null;
  }
}
