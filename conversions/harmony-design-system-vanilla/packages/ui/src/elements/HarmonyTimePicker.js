import { HarmonyElement } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { pickersSheet } from './pickers.js';
import { formatTimeValue, parseTimeValue, to12Hour, to24Hour } from './pickerDates.js';
import {
  getDateTimeAdapter,
  resolveTimeFormat,
  subscribeDateTimeDefaults,
} from '../datetime/index.js';

/**
 * Time picker (open Shadow DOM). Not form-associated.
 * `value` is always 24-hour `HH:MM`. Emits `time-select` with `{ time }`.
 */
export class HarmonyTimePicker extends HarmonyElement {
  static styles = [typographySheet, pickersSheet];

  static get observedAttributes() {
    return ['value', 'min', 'max', 'disabled', 'format', 'step'];
  }

  /** @type {(() => void) | null} */
  #unsubDefaults = null;

  connectedCallback() {
    this.#render();
    this.shadowRoot.addEventListener('click', this.#onClick);
    this.shadowRoot.addEventListener('keydown', this.#onKeyDown);
    this.#unsubDefaults = subscribeDateTimeDefaults(() => this.#paint());
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#onClick);
    this.shadowRoot.removeEventListener('keydown', this.#onKeyDown);
    this.#unsubDefaults?.();
    this.#unsubDefaults = null;
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#paint();
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

  get format() {
    return resolveTimeFormat(this.getAttribute('format'), this.hasAttribute('format'));
  }

  set format(v) {
    this.reflectString('format', v === '12' ? '12' : '24');
  }

  /** @returns {Date | null} */
  get valueAsDate() {
    return getDateTimeAdapter().toDate(this.value, 'time');
  }

  /** @param {Date | null} date */
  set valueAsDate(date) {
    if (date == null || !(date instanceof Date) || Number.isNaN(date.getTime())) {
      if (this.value) this.value = '';
      return;
    }
    const iso = getDateTimeAdapter().fromDate(date, 'time');
    if (this.value === iso) return;
    this.value = iso;
    this.emit('time-select', { time: iso });
  }

  get step() {
    const n = Number(this.getAttribute('step') || '1');
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
  }

  set step(v) {
    this.reflectString('step', String(v));
  }

  focusSelected() {
    this.shadowRoot.querySelector('[data-spin="hour"]')?.focus();
  }

  #parts() {
    const parsed = parseTimeValue(this.value) || { hour: 0, minute: 0 };
    const display = this.format === '12' ? to12Hour(parsed.hour) : { hour: parsed.hour, period: 'AM' };
    return { hour24: parsed.hour, minute: parsed.minute, displayHour: display.hour, period: display.period };
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <div class="time-picker" role="group" aria-label="Time">
        <div class="time-picker__controls">
          <div class="time-picker__hour">
            <button type="button" class="time-picker__increment" data-delta="hour" data-sign="1" aria-label="Increment hour">
              <harmony-icon name="chevron-up" size="sm"></harmony-icon>
            </button>
            <input class="time-picker__input" data-spin="hour" type="text" readonly inputmode="numeric" aria-label="Hour" />
            <button type="button" class="time-picker__decrement" data-delta="hour" data-sign="-1" aria-label="Decrement hour">
              <harmony-icon name="chevron-down" size="sm"></harmony-icon>
            </button>
          </div>
          <span class="time-picker__separator" aria-hidden="true">:</span>
          <div class="time-picker__minute">
            <button type="button" class="time-picker__increment" data-delta="minute" data-sign="1" aria-label="Increment minute">
              <harmony-icon name="chevron-up" size="sm"></harmony-icon>
            </button>
            <input class="time-picker__input" data-spin="minute" type="text" readonly inputmode="numeric" aria-label="Minute" />
            <button type="button" class="time-picker__decrement" data-delta="minute" data-sign="-1" aria-label="Decrement minute">
              <harmony-icon name="chevron-down" size="sm"></harmony-icon>
            </button>
          </div>
          <div class="time-picker__period" data-period-wrap hidden>
            <button type="button" class="time-picker__period-btn" data-period="AM" aria-label="AM">AM</button>
            <button type="button" class="time-picker__period-btn" data-period="PM" aria-label="PM">PM</button>
          </div>
        </div>
      </div>
    `;
    this.#paint();
  }

  #paint() {
    const { hour24, minute, displayHour, period } = this.#parts();
    const hourInput = this.shadowRoot.querySelector('[data-spin="hour"]');
    const minuteInput = this.shadowRoot.querySelector('[data-spin="minute"]');
    if (hourInput) {
      hourInput.value = String(displayHour).padStart(2, '0');
      hourInput.setAttribute('aria-valuenow', String(displayHour));
      hourInput.setAttribute('role', 'spinbutton');
    }
    if (minuteInput) {
      minuteInput.value = String(minute).padStart(2, '0');
      minuteInput.setAttribute('aria-valuenow', String(minute));
      minuteInput.setAttribute('role', 'spinbutton');
    }
    const periodWrap = this.shadowRoot.querySelector('[data-period-wrap]');
    periodWrap?.toggleAttribute('hidden', this.format !== '12');
    for (const btn of this.shadowRoot.querySelectorAll('[data-period]')) {
      const active = btn.getAttribute('data-period') === period;
      btn.classList.toggle('time-picker__period-btn--active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    const disabled = this.disabled;
    for (const control of this.shadowRoot.querySelectorAll('button')) {
      control.toggleAttribute('disabled', disabled);
    }
    hourInput?.toggleAttribute('disabled', disabled);
    minuteInput?.toggleAttribute('disabled', disabled);
    void hour24;
  }

  #minutes(hour, minute) {
    return hour * 60 + minute;
  }

  #inRange(hour24, minute) {
    const value = this.#minutes(hour24, minute);
    const min = parseTimeValue(this.min);
    const max = parseTimeValue(this.max);
    if (min && value < this.#minutes(min.hour, min.minute)) return false;
    if (max && value > this.#minutes(max.hour, max.minute)) return false;
    return true;
  }

  #commit(hour24, minute) {
    const step = this.step;
    let nextMinute = Math.round(minute / step) * step;
    let nextHour = hour24;
    if (nextMinute > 59) {
      nextMinute = 0;
      nextHour = (hour24 + 1) % 24;
    }
    if (nextMinute < 0) {
      nextMinute = Math.floor(59 / step) * step;
      nextHour = (hour24 + 23) % 24;
    }
    nextHour = (nextHour + 24) % 24;
    if (!this.#inRange(nextHour, nextMinute)) return;
    const iso = formatTimeValue(nextHour, nextMinute);
    if (this.value !== iso) this.setAttribute('value', iso);
    else this.#paint();
    this.emit('time-select', { time: iso });
  }

  #changeHour(sign) {
    const { hour24 } = this.#parts();
    this.#commit(hour24 + sign, this.#parts().minute);
  }

  #changeMinute(sign) {
    const { hour24, minute } = this.#parts();
    const next = minute + sign * this.step;
    if (next > 59) this.#commit(hour24 + 1, next - 60);
    else if (next < 0) this.#commit(hour24 - 1, 60 + next);
    else this.#commit(hour24, next);
  }

  #setPeriod(period) {
    const { displayHour } = this.#parts();
    this.#commit(to24Hour(displayHour, period), this.#parts().minute);
  }

  #onClick = (event) => {
    if (this.disabled) return;
    const delta = event.target.closest('[data-delta]');
    if (delta && this.shadowRoot.contains(delta)) {
      event.preventDefault();
      const sign = Number(delta.getAttribute('data-sign'));
      if (delta.getAttribute('data-delta') === 'hour') this.#changeHour(sign);
      else this.#changeMinute(sign);
      return;
    }
    const period = event.target.closest('[data-period]');
    if (period && this.shadowRoot.contains(period)) {
      event.preventDefault();
      this.#setPeriod(period.getAttribute('data-period'));
    }
  };

  #onKeyDown = (event) => {
    const spin = event.target.closest?.('[data-spin]');
    if (!spin || !this.shadowRoot.contains(spin)) return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const sign = event.key === 'ArrowUp' ? 1 : -1;
    if (spin.getAttribute('data-spin') === 'hour') this.#changeHour(sign);
    else this.#changeMinute(sign);
  };
}
