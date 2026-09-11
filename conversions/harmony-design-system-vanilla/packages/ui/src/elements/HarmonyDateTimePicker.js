import { HarmonyElement } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { pickersSheet } from './pickers.js';
import { HarmonyDatePicker } from './HarmonyDatePicker.js';
import { HarmonyTimePicker } from './HarmonyTimePicker.js';
import {
  getDateTimeAdapter,
  resolveLocale,
  resolveTimeFormat,
  subscribeDateTimeDefaults,
} from '../datetime/index.js';

/**
 * Combined date and time picker (open Shadow DOM). Not form-associated.
 * Composes harmony-date-picker and harmony-time-picker.
 * Emits `datetime-select` with `{ datetime }` (`YYYY-MM-DDTHH:MM`) when either
 * half changes and the other half is already known.
 */
export class HarmonyDateTimePicker extends HarmonyElement {
  static styles = [typographySheet, pickersSheet];

  static get observedAttributes() {
    return ['value', 'min', 'max', 'disabled', 'time-format', 'locale'];
  }

  /** @type {boolean} */
  #syncing = false;
  /** @type {boolean} */
  #ready = false;
  /** @type {(() => void) | null} */
  #unsubDefaults = null;

  connectedCallback() {
    this.style.display = 'block';
    ensureChildPickers();
    if (!this.#ready) {
      this.#render();
      this.shadowRoot.addEventListener('date-select', this.#onDateSelect);
      this.shadowRoot.addEventListener('time-select', this.#onTimeSelect);
      this.#ready = true;
    }
    this.#syncChildren();
    this.#unsubDefaults = subscribeDateTimeDefaults(() => this.#syncChildren());
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('date-select', this.#onDateSelect);
    this.shadowRoot.removeEventListener('time-select', this.#onTimeSelect);
    this.#unsubDefaults?.();
    this.#unsubDefaults = null;
    this.#ready = false;
  }

  attributeChangedCallback() {
    if (!this.isConnected || this.#syncing || !this.#ready) return;
    this.#syncChildren();
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(v) {
    this.reflectString('value', v);
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
    return getDateTimeAdapter().toDate(this.value, 'datetime-local');
  }

  /** @param {Date | null} date */
  set valueAsDate(date) {
    if (date == null || !(date instanceof Date) || Number.isNaN(date.getTime())) {
      if (this.value) {
        this.#syncing = true;
        this.value = '';
        this.#syncing = false;
        this.#syncChildren();
      }
      return;
    }
    const iso = getDateTimeAdapter().fromDate(date, 'datetime-local');
    if (this.value === iso) return;
    this.#syncing = true;
    this.value = iso;
    this.#syncing = false;
    this.#syncChildren();
    this.emit('datetime-select', { datetime: iso });
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <div class="datetime-picker">
        <div class="datetime-picker__date-section" part="date">
          <harmony-date-picker></harmony-date-picker>
        </div>
        <div class="datetime-picker__time-section" part="time">
          <harmony-time-picker></harmony-time-picker>
        </div>
      </div>
    `;
  }

  #syncChildren() {
    const datePicker = this.shadowRoot.querySelector('harmony-date-picker');
    const timePicker = this.shadowRoot.querySelector('harmony-time-picker');
    if (!datePicker || !timePicker) return;

    const current = splitDateTime(this.value);
    const minParts = splitDateTime(this.min);
    const maxParts = splitDateTime(this.max);

    setOrClear(datePicker, 'value', current.date);
    setOrClear(datePicker, 'min', minParts.date);
    setOrClear(datePicker, 'max', maxParts.date);
    setOrClear(datePicker, 'locale', this.locale);
    setOrClear(timePicker, 'value', current.time);
    setOrClear(timePicker, 'min', minParts.time);
    setOrClear(timePicker, 'max', maxParts.time);
    timePicker.setAttribute('format', this.timeFormat);

    if (this.disabled) {
      datePicker.setAttribute('disabled', '');
      timePicker.setAttribute('disabled', '');
    } else {
      datePicker.removeAttribute('disabled');
      timePicker.removeAttribute('disabled');
    }
  }

  #onDateSelect = (event) => {
    if (this.#syncing || this.disabled) return;
    const date = event.detail?.date || '';
    const time = this.shadowRoot.querySelector('harmony-time-picker')?.value || '';
    this.#commit(date, time);
  };

  #onTimeSelect = (event) => {
    if (this.#syncing || this.disabled) return;
    const time = normalizeTime(event.detail?.time || '');
    const date = this.shadowRoot.querySelector('harmony-date-picker')?.value || '';
    this.#commit(date, time);
  };

  #commit(date, time) {
    if (!date || !time) return;
    const datetime = `${date}T${time}`;
    if (this.value !== datetime) {
      this.#syncing = true;
      this.value = datetime;
      this.#syncing = false;
    }
    this.emit('datetime-select', { datetime });
  }
}

function ensureChildPickers() {
  if (!customElements.get('harmony-date-picker')) {
    customElements.define('harmony-date-picker', HarmonyDatePicker);
  }
  if (!customElements.get('harmony-time-picker')) {
    customElements.define('harmony-time-picker', HarmonyTimePicker);
  }
}

/**
 * @param {string} raw
 * @returns {{ date: string, time: string }}
 */
function splitDateTime(raw) {
  if (!raw) return { date: '', time: '' };
  const [date, rest] = String(raw).split('T');
  return { date: date || '', time: normalizeTime(rest || '') };
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
