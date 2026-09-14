import { HarmonyElement } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { pickersSheet } from './pickers.js';
import { syncLabelVariant } from './fieldLabel.js';
import { HarmonyIcon } from './HarmonyIcon.js';
import { HarmonyPickerPopup } from './HarmonyPickerPopup.js';
import { HarmonyDatePicker } from './HarmonyDatePicker.js';
import { HarmonyTimePicker } from './HarmonyTimePicker.js';
import { HarmonyDateTimePicker } from './HarmonyDateTimePicker.js';
import { HarmonyMonthPicker } from './HarmonyMonthPicker.js';
import { HarmonyWeekPicker } from './HarmonyWeekPicker.js';
import {
  formatDisplay,
  getDateTimeAdapter,
  resolveLocale,
  resolveTimeFormat,
  subscribeDateTimeDefaults,
} from '../datetime/index.js';

const TYPES = new Set(['date', 'time', 'datetime-local', 'month', 'week']);

const WIDGET = {
  date: 'harmony-date-picker',
  time: 'harmony-time-picker',
  'datetime-local': 'harmony-datetime-picker',
  month: 'harmony-month-picker',
  week: 'harmony-week-picker',
};

const PLACEHOLDER = {
  date: 'Select date',
  time: 'Select time',
  'datetime-local': 'Select date & time',
  month: 'Select month',
  week: 'Select week',
};

const CLOSE_EVENTS = {
  date: 'date-select',
  month: 'month-select',
  week: 'week-select',
};

let seq = 0;

/**
 * Form-associated date/time field (open Shadow DOM).
 * Composes the synced picker popup and widgets. Not a native date input.
 */
export class HarmonyDateInput extends HarmonyElement {
  static formAssociated = true;
  static shadowRootInit = { mode: 'open', delegatesFocus: true };
  static styles = [typographySheet, pickersSheet];

  static get observedAttributes() {
    return [
      'type',
      'value',
      'name',
      'id',
      'min',
      'max',
      'disabled',
      'required',
      'label',
      'label-variant',
      'time-format',
      'locale',
    ];
  }

  /** @type {ElementInternals} */
  #internals;
  /** @type {string} */
  #autoId = `harmony-date-input-${++seq}`;
  /** @type {boolean} */
  #syncing = false;
  /** @type {boolean} */
  #ready = false;
  /** @type {boolean} */
  #iconClosing = false;
  /** @type {boolean} */
  #iconFromPointer = false;
  /** @type {(() => void) | null} */
  #unsubDefaults = null;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    ensurePickerElements();
  }

  connectedCallback() {
    if (!this.#ready) {
      this.#render();
      this.#bind();
      this.#ready = true;
    }
    this.#sync();
    this.#unsubDefaults = subscribeDateTimeDefaults(() => this.#sync());
  }

  disconnectedCallback() {
    const field = this.#field();
    const icon = this.#icon();
    field?.removeEventListener('click', this.#onFieldClick);
    field?.removeEventListener('keydown', this.#onFieldKeydown);
    icon?.removeEventListener('pointerdown', this.#onIconPointerDown);
    icon?.removeEventListener('click', this.#onIconClick);
    this.shadowRoot?.removeEventListener('date-select', this.#onSelect);
    this.shadowRoot?.removeEventListener('time-select', this.#onSelect);
    this.shadowRoot?.removeEventListener('datetime-select', this.#onSelect);
    this.shadowRoot?.removeEventListener('month-select', this.#onSelect);
    this.shadowRoot?.removeEventListener('week-select', this.#onSelect);
    this.#unsubDefaults?.();
    this.#unsubDefaults = null;
    this.#ready = false;
  }

  attributeChangedCallback() {
    if (!this.isConnected || this.#syncing || !this.#ready) return;
    this.#sync();
  }

  get type() {
    const t = this.getAttribute('type') || 'date';
    return TYPES.has(t) ? t : 'date';
  }

  set type(v) {
    this.reflectString('type', TYPES.has(v) ? v : 'date');
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(v) {
    this.reflectString('value', v == null ? '' : String(v));
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(v) {
    this.reflectString('name', v);
  }

  get min() {
    return this.getAttribute('min') || '';
  }

  set min(v) {
    this.reflectString('min', v);
  }

  get max() {
    return this.getAttribute('max') || '';
  }

  set max(v) {
    this.reflectString('max', v);
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

  get label() {
    return this.getAttribute('label') || '';
  }

  set label(v) {
    this.reflectString('label', v);
  }

  get labelVariant() {
    return this.getAttribute('label-variant') || '';
  }

  set labelVariant(v) {
    const next = v === 'inline' || v === 'stacked' ? v : '';
    this.reflectString('label-variant', next);
  }

  get timeFormat() {
    return resolveTimeFormat(this.getAttribute('time-format'), this.hasAttribute('time-format'));
  }

  set timeFormat(v) {
    this.reflectString('time-format', v === '12' ? '12' : '24');
  }

  get locale() {
    return resolveLocale(this.getAttribute('locale'));
  }

  set locale(v) {
    this.reflectString('locale', v || '');
  }

  /** @returns {Date | null} */
  get valueAsDate() {
    return getDateTimeAdapter().toDate(this.value, this.type);
  }

  /** @param {Date | null} date */
  set valueAsDate(date) {
    if (date == null || !(date instanceof Date) || Number.isNaN(date.getTime())) {
      this.#commit('', false);
      return;
    }
    const iso = getDateTimeAdapter().fromDate(date, this.type);
    this.#commit(iso, false);
  }

  formDisabledCallback(disabled) {
    this.#applyDisabled(disabled || this.disabled);
  }

  formResetCallback() {
    const initial = this.getAttribute('value') || '';
    this.#syncing = true;
    if (this.value !== initial) this.value = initial;
    this.#syncing = false;
    this.#sync();
  }

  formStateRestoreCallback(state) {
    this.value = state == null ? '' : String(state);
  }

  #fieldId() {
    const hostId = this.id || this.getAttribute('id') || '';
    return hostId ? `${hostId}-field` : this.#autoId;
  }

  #placeholder() {
    return PLACEHOLDER[this.type] || PLACEHOLDER.date;
  }

  #field() {
    return /** @type {HTMLInputElement | null} */ (this.shadowRoot?.querySelector('[part="field"]'));
  }

  #icon() {
    return /** @type {HTMLButtonElement | null} */ (this.shadowRoot?.querySelector('[part="icon"]'));
  }

  #popup() {
    return /** @type {HarmonyPickerPopup | null} */ (
      this.shadowRoot?.querySelector('harmony-picker-popup')
    );
  }

  #render() {
    const fieldId = this.#fieldId();
    this.shadowRoot.innerHTML = `
      <div class="field">
        <label part="label" class="label" hidden></label>
        <div class="field__body">
          <div class="date-input-wrapper">
            <input part="field" class="date-input" type="text" id="${fieldId}" readonly autocomplete="off" />
            <button type="button" part="icon" class="date-input-wrapper__icon">
              <harmony-icon size="sm"></harmony-icon>
            </button>
            <harmony-picker-popup part="popup" for="${fieldId}"></harmony-picker-popup>
          </div>
        </div>
      </div>
    `;
  }

  #bind() {
    const field = this.#field();
    const icon = this.#icon();
    field?.addEventListener('click', this.#onFieldClick);
    field?.addEventListener('keydown', this.#onFieldKeydown);
    icon?.addEventListener('pointerdown', this.#onIconPointerDown);
    icon?.addEventListener('click', this.#onIconClick);
    this.shadowRoot.addEventListener('date-select', this.#onSelect);
    this.shadowRoot.addEventListener('time-select', this.#onSelect);
    this.shadowRoot.addEventListener('datetime-select', this.#onSelect);
    this.shadowRoot.addEventListener('month-select', this.#onSelect);
    this.shadowRoot.addEventListener('week-select', this.#onSelect);
  }

  #sync() {
    syncLabelVariant(this);
    this.#syncFieldId();
    this.#syncLabel();
    this.#syncField();
    this.#syncWidget();
    this.#syncValidity();
  }

  #syncFieldId() {
    const fieldId = this.#fieldId();
    const field = this.#field();
    const popup = this.#popup();
    if (field && field.id !== fieldId) field.id = fieldId;
    if (popup && popup.getAttribute('for') !== fieldId) popup.setAttribute('for', fieldId);
  }

  #syncLabel() {
    const labelEl = this.shadowRoot.querySelector('[part="label"]');
    if (!labelEl) return;
    const text = this.label;
    const fieldId = this.#fieldId();
    if (text && !this.hasAttribute('data-in-form-layout')) {
      labelEl.hidden = false;
      labelEl.textContent = text;
      labelEl.classList.toggle('label--required', this.required);
      labelEl.setAttribute('for', fieldId);
    } else {
      labelEl.hidden = true;
      if (text) {
        labelEl.textContent = text;
        labelEl.classList.toggle('label--required', this.required);
      } else {
        labelEl.textContent = '';
        labelEl.classList.remove('label--required');
      }
      labelEl.removeAttribute('for');
    }
  }

  #syncField() {
    const field = this.#field();
    const icon = this.#icon();
    const iconEl = icon?.querySelector('harmony-icon');
    if (!field || !icon) return;
    const placeholder = this.#placeholder();
    const disabled = this.disabled;
    field.placeholder = placeholder;
    field.value = formatDisplay(this.value, this.type, this.locale);
    field.setAttribute('aria-label', this.label || placeholder);
    field.toggleAttribute('required', this.required);
    field.readOnly = true;
    this.#applyDisabled(disabled);
    icon.setAttribute('aria-label', `Open ${placeholder}`);
    icon.tabIndex = disabled ? -1 : 0;
    if (iconEl) iconEl.setAttribute('name', this.type === 'time' ? 'clock' : 'calendar');
  }

  #applyDisabled(disabled) {
    const field = this.#field();
    const icon = this.#icon();
    if (field) field.disabled = disabled;
    if (icon) icon.disabled = disabled;
    if (disabled) this.#popup()?.hide();
  }

  #syncWidget() {
    const popup = this.#popup();
    if (!popup) return;
    const tag = WIDGET[this.type];
    let widget = popup.querySelector(tag);
    if (!widget) {
      popup.replaceChildren();
      widget = document.createElement(tag);
      popup.append(widget);
    }
    setOrClear(widget, 'value', this.value);
    setOrClear(widget, 'min', this.min);
    setOrClear(widget, 'max', this.max);
    if (tag !== 'harmony-time-picker') setOrClear(widget, 'locale', this.locale);
    if (tag === 'harmony-time-picker') widget.setAttribute('format', this.timeFormat);
    if (tag === 'harmony-datetime-picker') widget.setAttribute('time-format', this.timeFormat);
    if (this.disabled) widget.setAttribute('disabled', '');
    else widget.removeAttribute('disabled');
    this.#internals.setFormValue(this.value);
  }

  #syncValidity() {
    const missing = this.required && !this.value;
    const field = this.#field();
    const flags = missing ? { valueMissing: true } : {};
    const message = missing ? 'Please fill out this field.' : '';
    if (field) this.#internals.setValidity(flags, message, field);
    else this.#internals.setValidity(flags, message);
  }

  #onFieldClick = (event) => {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    // Text inputs are not popover invokers. Toggle here, and cancel the
    // default so a bound popoverTargetElement cannot also toggle.
    event.preventDefault();
    event.stopPropagation();
    this.#togglePopup();
  };

  #onFieldKeydown = (event) => {
    if (this.disabled) return;
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const popup = this.#popup();
    if (!popup) return;
    if (event.key === 'ArrowDown') {
      if (!popup.matches(':popover-open')) popup.show();
      return;
    }
    this.#togglePopup();
  };

  #onIconPointerDown = () => {
    this.#iconFromPointer = true;
    this.#iconClosing = Boolean(this.#popup()?.matches(':popover-open'));
  };

  #onIconClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) return;
    const popup = this.#popup();
    if (!popup) return;
    const fromPointer = this.#iconFromPointer;
    const wasOpen = this.#iconClosing;
    this.#iconFromPointer = false;
    this.#iconClosing = false;
    if (fromPointer && wasOpen) {
      if (popup.matches(':popover-open')) popup.hide();
      return;
    }
    if (popup.matches(':popover-open')) popup.hide();
    else popup.show();
  };

  #togglePopup() {
    const popup = this.#popup();
    if (!popup || this.disabled) return;
    if (popup.matches(':popover-open')) popup.hide();
    else popup.show();
  }

  #onSelect = (event) => {
    if (this.#syncing || this.disabled) return;
    const type = this.type;
    if (event.type === 'date-select' && type !== 'date') return;
    if (event.type === 'time-select' && type !== 'time') return;
    if (event.type === 'datetime-select' && type !== 'datetime-local') return;
    if (event.type === 'month-select' && type !== 'month') return;
    if (event.type === 'week-select' && type !== 'week') return;

    const machine = machineFromEvent(type, event);
    if (!machine) return;
    this.#commit(machine, CLOSE_EVENTS[type] === event.type);
  };

  #commit(machine, close) {
    this.#syncing = true;
    this.value = machine;
    this.#syncing = false;
    this.#syncField();
    this.#syncWidget();
    this.#syncValidity();
    this.dispatchEvent(
      new CustomEvent('input', { bubbles: true, composed: true, detail: machine }),
    );
    this.dispatchEvent(
      new CustomEvent('change', { bubbles: true, composed: true, detail: machine }),
    );
    if (close) this.#popup()?.hide();
  }
}

function ensurePickerElements() {
  if (!customElements.get('harmony-icon')) customElements.define('harmony-icon', HarmonyIcon);
  if (!customElements.get('harmony-picker-popup')) {
    customElements.define('harmony-picker-popup', HarmonyPickerPopup);
  }
  if (!customElements.get('harmony-date-picker')) {
    customElements.define('harmony-date-picker', HarmonyDatePicker);
  }
  if (!customElements.get('harmony-time-picker')) {
    customElements.define('harmony-time-picker', HarmonyTimePicker);
  }
  if (!customElements.get('harmony-datetime-picker')) {
    customElements.define('harmony-datetime-picker', HarmonyDateTimePicker);
  }
  if (!customElements.get('harmony-month-picker')) {
    customElements.define('harmony-month-picker', HarmonyMonthPicker);
  }
  if (!customElements.get('harmony-week-picker')) {
    customElements.define('harmony-week-picker', HarmonyWeekPicker);
  }
}

/**
 * @param {string} type
 * @param {Event} event
 * @returns {string}
 */
function machineFromEvent(type, event) {
  const detail = /** @type {CustomEvent} */ (event).detail || {};
  if (type === 'date') return detail.date || '';
  if (type === 'time') return normalizeTime(detail.time || '');
  if (type === 'datetime-local') return detail.datetime || '';
  if (type === 'month' || type === 'week') return detail.value || '';
  return '';
}

/**
 * @param {string} raw
 * @returns {string}
 */
function normalizeTime(raw) {
  if (!raw) return '';
  const clock = String(raw).split('.')[0];
  const match = clock.match(/^(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : '';
}

/**
 * @param {Element} el
 * @param {string} name
 * @param {string} value
 */
function setOrClear(el, name, value) {
  if (value) el.setAttribute(name, value);
  else el.removeAttribute(name);
}
