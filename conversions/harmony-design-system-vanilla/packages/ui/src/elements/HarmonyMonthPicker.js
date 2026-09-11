import { HarmonyElement } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { pickersSheet } from './pickers.js';
import { formatYearMonth, monthLabel, parseYearMonth } from './pickerDates.js';
import {
  getDateTimeAdapter,
  resolveLocale,
  subscribeDateTimeDefaults,
} from '../datetime/index.js';

/**
 * Month picker (open Shadow DOM). Not form-associated.
 * `value` is `YYYY-MM`. Emits `month-select` with `{ value }`.
 */
export class HarmonyMonthPicker extends HarmonyElement {
  static styles = [typographySheet, pickersSheet];

  static get observedAttributes() {
    return ['value', 'min', 'max', 'disabled', 'locale'];
  }

  /** @type {number} */
  #year = new Date().getFullYear();
  /** @type {number} */
  #focusMonth = new Date().getMonth();
  /** @type {(() => void) | null} */
  #unsubDefaults = null;

  connectedCallback() {
    const parsed = parseYearMonth(this.value);
    if (parsed) this.#year = parsed.year;
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

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === 'value') {
      const parsed = parseYearMonth(this.value);
      if (parsed) this.#year = parsed.year;
    }
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
    return getDateTimeAdapter().toDate(this.value, 'month');
  }

  /** @param {Date | null} date */
  set valueAsDate(date) {
    if (date == null || !(date instanceof Date) || Number.isNaN(date.getTime())) {
      if (this.value) this.value = '';
      return;
    }
    const iso = getDateTimeAdapter().fromDate(date, 'month');
    if (this.value === iso) return;
    this.value = iso;
    this.emit('month-select', { value: iso });
  }

  focusSelected() {
    const selected =
      this.shadowRoot.querySelector('.month-picker__month--selected:not(:disabled)') ||
      this.shadowRoot.querySelector('.month-picker__month[tabindex="0"]') ||
      this.shadowRoot.querySelector('.month-picker__month:not(:disabled)');
    selected?.focus();
  }

  #outOfRange(month) {
    const min = parseYearMonth(this.min);
    const max = parseYearMonth(this.max);
    if (min && (this.#year < min.year || (this.#year === min.year && month < min.month))) return true;
    if (max && (this.#year > max.year || (this.#year === max.year && month > max.month))) return true;
    return false;
  }

  #renderChrome() {
    this.shadowRoot.innerHTML = `
      <div class="month-picker">
        <div class="month-picker__header" part="header">
          <button type="button" class="month-picker__nav-btn" data-nav="-1" aria-label="Previous year">
            <harmony-icon name="chevron-left" size="sm"></harmony-icon>
          </button>
          <div class="month-picker__year"></div>
          <button type="button" class="month-picker__nav-btn" data-nav="1" aria-label="Next year">
            <harmony-icon name="chevron-right" size="sm"></harmony-icon>
          </button>
        </div>
        <div class="month-picker__grid" part="grid" role="grid"></div>
      </div>
    `;
  }

  #renderGrid() {
    const yearEl = this.shadowRoot.querySelector('.month-picker__year');
    const grid = this.shadowRoot.querySelector('.month-picker__grid');
    if (!yearEl || !grid) return;
    yearEl.textContent = String(this.#year);
    grid.setAttribute('aria-label', `Months for ${this.#year}`);
    const selected = parseYearMonth(this.value);
    const disabled = this.disabled;
    for (const nav of this.shadowRoot.querySelectorAll('[data-nav]')) {
      nav.toggleAttribute('disabled', disabled);
    }
    grid.replaceChildren();
    for (let month = 0; month < 12; month++) {
      const iso = formatYearMonth(this.#year, month);
      const isSelected = selected?.year === this.#year && selected.month === month;
      const out = this.#outOfRange(month);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = [
        'month-picker__month',
        isSelected ? 'month-picker__month--selected' : '',
        out || disabled ? 'month-picker__month--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ');
      button.dataset.month = String(month);
      button.dataset.value = iso;
      button.textContent = monthLabel(this.locale, month, 'short');
      button.setAttribute('role', 'gridcell');
      button.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      button.setAttribute('aria-label', `${monthLabel(this.locale, month)} ${this.#year}`);
      button.disabled = disabled || out;
      const focused = isSelected || (!selected && month === this.#focusMonth);
      button.tabIndex = !button.disabled && focused ? 0 : -1;
      grid.append(button);
    }
    const focused = [...grid.querySelectorAll('[tabindex="0"]')];
    if (focused.length > 1) {
      for (const el of focused.slice(1)) el.tabIndex = -1;
    }
    if (!grid.querySelector('[tabindex="0"]')) {
      const fallback = grid.querySelector('.month-picker__month:not(:disabled)');
      if (fallback) fallback.tabIndex = 0;
    }
  }

  #select(month) {
    if (this.disabled || this.#outOfRange(month)) return;
    const iso = formatYearMonth(this.#year, month);
    this.#focusMonth = month;
    if (this.value !== iso) this.setAttribute('value', iso);
    else this.#renderGrid();
    this.emit('month-select', { value: iso });
  }

  #shiftYear(delta) {
    this.#year += delta;
    this.#renderGrid();
  }

  #moveFocus(delta) {
    const current = Number(
      this.shadowRoot.querySelector('.month-picker__month:focus')?.dataset.month ?? this.#focusMonth,
    );
    let next = current + delta;
    if (next < 0) {
      this.#year -= 1;
      next = 12 + next;
    } else if (next > 11) {
      this.#year += 1;
      next -= 12;
    }
    this.#focusMonth = next;
    this.#renderGrid();
    this.shadowRoot.querySelector(`[data-month="${next}"]`)?.focus();
  }

  #onClick = (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav && this.shadowRoot.contains(nav)) {
      event.preventDefault();
      this.#shiftYear(Number(nav.getAttribute('data-nav')));
      return;
    }
    const month = event.target.closest('.month-picker__month');
    if (month && this.shadowRoot.contains(month) && !month.disabled) {
      event.preventDefault();
      this.#select(Number(month.dataset.month));
    }
  };

  #onKeyDown = (event) => {
    const target = event.target.closest?.('.month-picker__month');
    if (!target || !this.shadowRoot.contains(target)) return;
    const deltas = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 };
    if (event.key in deltas) {
      event.preventDefault();
      this.#moveFocus(deltas[event.key]);
      return;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      this.#year += event.key === 'PageUp' ? -1 : 1;
      this.#focusMonth = Number(target.dataset.month);
      this.#renderGrid();
      this.shadowRoot.querySelector(`[data-month="${this.#focusMonth}"]`)?.focus();
    }
  };
}
