import { HarmonyElement } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { pickersSheet } from './pickers.js';
import { dateFromIsoWeek, formatIsoWeek, parseIsoWeek, weeksInIsoYear } from './pickerDates.js';
import {
  getDateTimeAdapter,
  resolveLocale,
  subscribeDateTimeDefaults,
} from '../datetime/index.js';

/**
 * ISO week picker (open Shadow DOM). Not form-associated.
 * `value` is `YYYY-Www`. Emits `week-select` with `{ value }`.
 */
export class HarmonyWeekPicker extends HarmonyElement {
  static styles = [typographySheet, pickersSheet];

  static get observedAttributes() {
    return ['value', 'min', 'max', 'disabled', 'locale'];
  }

  /** @type {number} */
  #year = new Date().getFullYear();
  /** @type {number} */
  #focusWeek = 1;
  /** @type {(() => void) | null} */
  #unsubDefaults = null;

  connectedCallback() {
    const parsed = parseIsoWeek(this.value);
    if (parsed) this.#year = parsed.year;
    this.#renderChrome();
    this.#renderList();
    this.shadowRoot.addEventListener('click', this.#onClick);
    this.shadowRoot.addEventListener('keydown', this.#onKeyDown);
    this.#unsubDefaults = subscribeDateTimeDefaults(() => {
      this.#renderChrome();
      this.#renderList();
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
      const parsed = parseIsoWeek(this.value);
      if (parsed) this.#year = parsed.year;
    }
    this.#renderList();
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
    return getDateTimeAdapter().toDate(this.value, 'week');
  }

  /** @param {Date | null} date */
  set valueAsDate(date) {
    if (date == null || !(date instanceof Date) || Number.isNaN(date.getTime())) {
      if (this.value) this.value = '';
      return;
    }
    const iso = getDateTimeAdapter().fromDate(date, 'week');
    if (this.value === iso) return;
    this.value = iso;
    this.emit('week-select', { value: iso });
  }

  focusSelected() {
    const selected =
      this.shadowRoot.querySelector('.week-picker__week--selected:not(:disabled)') ||
      this.shadowRoot.querySelector('.week-picker__week[tabindex="0"]') ||
      this.shadowRoot.querySelector('.week-picker__week:not(:disabled)');
    selected?.focus();
    selected?.scrollIntoView({ block: 'nearest' });
  }

  #compare(year, week, bound) {
    if (!bound) return 0;
    if (year !== bound.year) return year - bound.year;
    return week - bound.week;
  }

  #outOfRange(week) {
    const min = parseIsoWeek(this.min);
    const max = parseIsoWeek(this.max);
    if (min && this.#compare(this.#year, week, min) < 0) return true;
    if (max && this.#compare(this.#year, week, max) > 0) return true;
    return false;
  }

  #rangeLabel(week) {
    const start = dateFromIsoWeek(this.#year, week);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const fmt = new Intl.DateTimeFormat(this.locale, { month: 'short', day: 'numeric' });
    return `${fmt.format(start)} - ${fmt.format(end)}`;
  }

  #renderChrome() {
    this.shadowRoot.innerHTML = `
      <div class="week-picker">
        <div class="week-picker__header" part="header">
          <button type="button" class="week-picker__nav-btn" data-nav="-1" aria-label="Previous year">
            <harmony-icon name="chevron-left" size="sm"></harmony-icon>
          </button>
          <div class="week-picker__year"></div>
          <button type="button" class="week-picker__nav-btn" data-nav="1" aria-label="Next year">
            <harmony-icon name="chevron-right" size="sm"></harmony-icon>
          </button>
        </div>
        <div class="week-picker__list" part="list" role="listbox"></div>
      </div>
    `;
  }

  #renderList() {
    const yearEl = this.shadowRoot.querySelector('.week-picker__year');
    const list = this.shadowRoot.querySelector('.week-picker__list');
    if (!yearEl || !list) return;
    yearEl.textContent = String(this.#year);
    list.setAttribute('aria-label', `Weeks for ${this.#year}`);
    const selected = parseIsoWeek(this.value);
    const disabled = this.disabled;
    const total = weeksInIsoYear(this.#year);
    for (const nav of this.shadowRoot.querySelectorAll('[data-nav]')) {
      nav.toggleAttribute('disabled', disabled);
    }
    list.replaceChildren();
    for (let week = 1; week <= total; week++) {
      const iso = formatIsoWeek(this.#year, week);
      const isSelected = selected?.year === this.#year && selected.week === week;
      const out = this.#outOfRange(week);
      const range = this.#rangeLabel(week);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = [
        'week-picker__week',
        isSelected ? 'week-picker__week--selected' : '',
        out || disabled ? 'week-picker__week--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ');
      button.dataset.week = String(week);
      button.dataset.value = iso;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      button.setAttribute('aria-label', `Week ${week}, ${range.replace(' - ', ' to ')}`);
      button.disabled = disabled || out;
      const focused = isSelected || (!selected && week === this.#focusWeek);
      button.tabIndex = !button.disabled && focused ? 0 : -1;
      const number = document.createElement('span');
      number.className = 'week-picker__week-number';
      number.textContent = `Week ${week}`;
      const rangeEl = document.createElement('span');
      rangeEl.className = 'week-picker__week-range';
      rangeEl.textContent = range;
      button.append(number, rangeEl);
      list.append(button);
    }
    const focused = [...list.querySelectorAll('[tabindex="0"]')];
    if (focused.length > 1) {
      for (const el of focused.slice(1)) el.tabIndex = -1;
    }
    if (!list.querySelector('[tabindex="0"]')) {
      const fallback = list.querySelector('.week-picker__week:not(:disabled)');
      if (fallback) fallback.tabIndex = 0;
    }
  }

  #select(week) {
    if (this.disabled || this.#outOfRange(week)) return;
    const iso = formatIsoWeek(this.#year, week);
    this.#focusWeek = week;
    if (this.value !== iso) this.setAttribute('value', iso);
    else this.#renderList();
    this.emit('week-select', { value: iso });
  }

  #moveFocus(delta) {
    const current = Number(
      this.shadowRoot.querySelector('.week-picker__week:focus')?.dataset.week ?? this.#focusWeek,
    );
    const total = weeksInIsoYear(this.#year);
    let next = current + delta;
    if (next < 1) {
      this.#year -= 1;
      next = weeksInIsoYear(this.#year);
    } else if (next > total) {
      this.#year += 1;
      next = 1;
    }
    this.#focusWeek = next;
    this.#renderList();
    const el = this.shadowRoot.querySelector(`[data-week="${next}"]`);
    el?.focus();
    el?.scrollIntoView({ block: 'nearest' });
  }

  #onClick = (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav && this.shadowRoot.contains(nav)) {
      event.preventDefault();
      this.#year += Number(nav.getAttribute('data-nav'));
      this.#renderList();
      return;
    }
    const week = event.target.closest('.week-picker__week');
    if (week && this.shadowRoot.contains(week) && !week.disabled) {
      event.preventDefault();
      this.#select(Number(week.dataset.week));
    }
  };

  #onKeyDown = (event) => {
    const target = event.target.closest?.('.week-picker__week');
    if (!target || !this.shadowRoot.contains(target)) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.#moveFocus(1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.#moveFocus(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.#focusWeek = 1;
      this.#renderList();
      this.shadowRoot.querySelector('[data-week="1"]')?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      this.#focusWeek = weeksInIsoYear(this.#year);
      this.#renderList();
      this.shadowRoot.querySelector(`[data-week="${this.#focusWeek}"]`)?.focus();
    }
  };
}
