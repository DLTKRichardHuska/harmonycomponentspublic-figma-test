import { HarmonyElement } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { pickersSheet } from './pickers.js';
import {
  calendarDays,
  formatIsoDate,
  isDayOutOfRange,
  isSameDay,
  monthLabel,
  parseIsoDate,
  weekdayShortLabels,
} from './pickerDates.js';
import {
  getDateTimeAdapter,
  resolveLocale,
  subscribeDateTimeDefaults,
} from '../datetime/index.js';

/**
 * Calendar date picker (open Shadow DOM). Not form-associated.
 * Emits `date-select` with `{ date }` (`YYYY-MM-DD`).
 */
export class HarmonyDatePicker extends HarmonyElement {
  static styles = [typographySheet, pickersSheet];

  static get observedAttributes() {
    return ['value', 'min', 'max', 'disabled', 'locale'];
  }

  /** @type {number} */
  #month = new Date().getMonth();
  /** @type {number} */
  #year = new Date().getFullYear();
  /** @type {string} */
  #focusDate = '';
  /** @type {(() => void) | null} */
  #unsubDefaults = null;

  connectedCallback() {
    this.#syncViewFromValue();
    this.#renderChrome();
    this.#renderGrid();
    this.shadowRoot.addEventListener('click', this.#onClick);
    this.shadowRoot.addEventListener('keydown', this.#onKeyDown);
    this.#unsubDefaults = subscribeDateTimeDefaults(() => {
      this.#renderChrome();
      this.#renderGrid();
    });
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#onClick);
    this.shadowRoot.removeEventListener('keydown', this.#onKeyDown);
    this.#unsubDefaults?.();
    this.#unsubDefaults = null;
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#syncViewFromValue();
    this.#renderGrid();
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

  get locale() {
    return resolveLocale(this.getAttribute('locale'));
  }

  set locale(v) {
    this.reflectString('locale', v || '');
  }

  /** @returns {Date | null} */
  get valueAsDate() {
    return getDateTimeAdapter().toDate(this.value, 'date');
  }

  /** @param {Date | null} date */
  set valueAsDate(date) {
    if (date == null || !(date instanceof Date) || Number.isNaN(date.getTime())) {
      if (this.value) this.value = '';
      return;
    }
    const iso = getDateTimeAdapter().fromDate(date, 'date');
    if (this.value === iso) return;
    this.value = iso;
    this.emit('date-select', { date: iso });
  }

  focusSelected() {
    const selected =
      this.shadowRoot.querySelector('.date-picker__day--selected:not(:disabled)') ||
      this.shadowRoot.querySelector('.date-picker__day[tabindex="0"]') ||
      this.shadowRoot.querySelector('.date-picker__day:not(:disabled)');
    selected?.focus();
  }

  #syncViewFromValue() {
    const parsed = parseIsoDate(this.value);
    if (!parsed) return;
    this.#month = parsed.getMonth();
    this.#year = parsed.getFullYear();
  }

  #renderChrome() {
    this.shadowRoot.innerHTML = `
      <div class="date-picker">
        <div class="date-picker__header" part="header">
          <button type="button" class="date-picker__nav-btn" data-nav="-1" aria-label="Previous month">
            <harmony-icon name="chevron-left" size="sm"></harmony-icon>
          </button>
          <div class="date-picker__month-year">
            <span class="date-picker__month"></span>
            <span class="date-picker__year"></span>
          </div>
          <button type="button" class="date-picker__nav-btn" data-nav="1" aria-label="Next month">
            <harmony-icon name="chevron-right" size="sm"></harmony-icon>
          </button>
        </div>
        <div class="date-picker__weekdays"></div>
        <div class="date-picker__grid" part="grid" role="grid"></div>
      </div>
    `;
  }

  #renderGrid() {
    const locale = this.locale;
    const monthEl = this.shadowRoot.querySelector('.date-picker__month');
    const yearEl = this.shadowRoot.querySelector('.date-picker__year');
    const weekdays = this.shadowRoot.querySelector('.date-picker__weekdays');
    const grid = this.shadowRoot.querySelector('.date-picker__grid');
    if (!monthEl || !yearEl || !weekdays || !grid) return;

    const monthName = monthLabel(locale, this.#month);
    monthEl.textContent = monthName;
    yearEl.textContent = String(this.#year);
    weekdays.replaceChildren(
      ...weekdayShortLabels(locale).map((label) => {
        const cell = document.createElement('div');
        cell.className = 'date-picker__weekday';
        cell.setAttribute('aria-hidden', 'true');
        cell.textContent = label;
        return cell;
      }),
    );
    grid.setAttribute('aria-label', `Calendar for ${monthName} ${this.#year}`);

    const selected = parseIsoDate(this.value);
    const min = parseIsoDate(this.min);
    const max = parseIsoDate(this.max);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const disabled = this.disabled;
    const focusDate = this.#focusDate || this.value;

    for (const nav of this.shadowRoot.querySelectorAll('[data-nav]')) {
      nav.toggleAttribute('disabled', disabled);
    }

    grid.replaceChildren();
    for (const day of calendarDays(this.#month, this.#year)) {
      const date = new Date(day.date);
      date.setHours(0, 0, 0, 0);
      const iso = formatIsoDate(date);
      const outOfRange = isDayOutOfRange(date, min, max);
      const isSelected = selected ? isSameDay(date, selected) : false;
      const isToday = isSameDay(date, today);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = [
        'date-picker__day',
        !day.inMonth ? 'date-picker__day--other-month' : '',
        isToday ? 'date-picker__day--today' : '',
        isSelected ? 'date-picker__day--selected' : '',
        outOfRange || disabled ? 'date-picker__day--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ');
      button.dataset.date = iso;
      button.textContent = String(date.getDate());
      button.setAttribute('role', 'gridcell');
      button.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      if (isToday) button.setAttribute('aria-current', 'date');
      button.setAttribute(
        'aria-label',
        date.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      );
      const cellDisabled = disabled || outOfRange;
      button.disabled = cellDisabled;
      button.tabIndex = !cellDisabled && iso === focusDate ? 0 : -1;
      grid.append(button);
    }

    if (!grid.querySelector('[tabindex="0"]')) {
      const fallback = grid.querySelector('.date-picker__day:not(:disabled)');
      if (fallback) fallback.tabIndex = 0;
    }
  }

  #shiftMonth(delta) {
    this.#month += delta;
    if (this.#month < 0) {
      this.#month = 11;
      this.#year -= 1;
    } else if (this.#month > 11) {
      this.#month = 0;
      this.#year += 1;
    }
    this.#renderGrid();
  }

  #select(iso) {
    if (this.disabled) return;
    const date = parseIsoDate(iso);
    if (!date || isDayOutOfRange(date, parseIsoDate(this.min), parseIsoDate(this.max))) return;
    this.#focusDate = iso;
    this.#month = date.getMonth();
    this.#year = date.getFullYear();
    if (this.value !== iso) this.setAttribute('value', iso);
    else this.#renderGrid();
    this.emit('date-select', { date: iso });
  }

  #moveFocus(deltaDays) {
    const current = this.shadowRoot.querySelector('.date-picker__day:focus');
    const base = parseIsoDate(current?.dataset.date || this.#focusDate || this.value) || new Date(this.#year, this.#month, 1);
    const next = new Date(base);
    next.setDate(base.getDate() + deltaDays);
    const iso = formatIsoDate(next);
    this.#focusDate = iso;
    this.#month = next.getMonth();
    this.#year = next.getFullYear();
    this.#renderGrid();
    this.shadowRoot.querySelector(`[data-date="${iso}"]`)?.focus();
  }

  #onClick = (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav && this.shadowRoot.contains(nav)) {
      event.preventDefault();
      this.#shiftMonth(Number(nav.getAttribute('data-nav')));
      return;
    }
    const day = event.target.closest('.date-picker__day');
    if (day && this.shadowRoot.contains(day) && !day.disabled) {
      event.preventDefault();
      this.#select(day.dataset.date);
    }
  };

  #onKeyDown = (event) => {
    const target = event.target.closest?.('.date-picker__day');
    if (!target || !this.shadowRoot.contains(target)) return;
    const deltas = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in deltas) {
      event.preventDefault();
      this.#moveFocus(deltas[event.key]);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      const date = parseIsoDate(target.dataset.date);
      if (!date) return;
      this.#moveFocus(-date.getDay());
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      const date = parseIsoDate(target.dataset.date);
      if (!date) return;
      this.#moveFocus(6 - date.getDay());
      return;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const date = parseIsoDate(target.dataset.date);
      if (!date) return;
      const next = new Date(date);
      next.setMonth(date.getMonth() + (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1));
      this.#focusDate = formatIsoDate(next);
      this.#month = next.getMonth();
      this.#year = next.getFullYear();
      this.#renderGrid();
      this.shadowRoot.querySelector(`[data-date="${this.#focusDate}"]`)?.focus();
    }
  };
}
