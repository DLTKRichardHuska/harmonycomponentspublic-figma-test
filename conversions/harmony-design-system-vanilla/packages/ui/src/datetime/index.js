/**
 * App-wide date/time defaults, native Date/Intl adapter, and element helpers.
 * Machine values stay ISO strings; Date is a convenience layer.
 *
 * Resolution for locale / timeFormat on elements:
 * 1. Explicit attribute on the element
 * 2. setDateTimeDefaults()
 * 3. <html data-harmony-locale> / data-harmony-time-format
 * 4. Built-in en-US / 24
 */

import {
  dateFromIsoWeek,
  formatIsoDate,
  formatIsoWeek,
  formatTimeValue,
  formatYearMonth,
  parseIsoDate,
  parseIsoWeek,
  parseTimeValue,
  parseYearMonth,
} from '../elements/pickerDates.js';

/** @typedef {'date' | 'time' | 'datetime-local' | 'month' | 'week'} DateTimeType */

/**
 * @typedef {{
 *   toDate(machine: string, type: DateTimeType): Date | null,
 *   fromDate(date: Date, type: DateTimeType): string,
 *   formatDisplay(machine: string, type: DateTimeType, locale: string): string
 * }} DateTimeAdapter
 */

/** @typedef {{ locale: string, timeFormat: '12' | '24' }} DateTimeDefaults */

export const DATETIME_DEFAULTS_EVENT = 'harmony-datetime-defaults';

export const LOCALE_ATTR = 'data-harmony-locale';
export const TIME_FORMAT_ATTR = 'data-harmony-time-format';

/** @type {Partial<DateTimeDefaults>} */
let jsDefaults = {};

/** @type {DateTimeAdapter} */
let adapter = createNativeAdapter();

/**
 * @returns {DateTimeDefaults}
 */
export function getDateTimeDefaults() {
  const fromDoc = readDocumentDefaults();
  return {
    locale: jsDefaults.locale || fromDoc.locale || 'en-US',
    timeFormat: jsDefaults.timeFormat || fromDoc.timeFormat || '24',
  };
}

/**
 * @param {Partial<DateTimeDefaults>} next
 * @param {{ silent?: boolean }} [opts]
 */
export function setDateTimeDefaults(next = {}, opts = {}) {
  if (next.locale != null && next.locale !== '') {
    jsDefaults.locale = String(next.locale);
  }
  if (next.timeFormat === '12' || next.timeFormat === '24') {
    jsDefaults.timeFormat = next.timeFormat;
  }
  if (!opts.silent) notifyDefaultsChanged();
}

/**
 * Read optional document attributes and merge into JS defaults (attrs win only when JS unset).
 * @param {Document} [doc]
 */
export function initDateTimeDefaults(doc = document) {
  const root = doc.documentElement;
  const locale = root.getAttribute(LOCALE_ATTR);
  const timeFormat = root.getAttribute(TIME_FORMAT_ATTR);
  /** @type {Partial<DateTimeDefaults>} */
  const fromDoc = {};
  if (locale) fromDoc.locale = locale;
  if (timeFormat === '12' || timeFormat === '24') fromDoc.timeFormat = timeFormat;
  // Document seeds only fill gaps; explicit setDateTimeDefaults still wins.
  if (!jsDefaults.locale && fromDoc.locale) jsDefaults.locale = fromDoc.locale;
  if (!jsDefaults.timeFormat && fromDoc.timeFormat) jsDefaults.timeFormat = fromDoc.timeFormat;
  notifyDefaultsChanged();
  return getDateTimeDefaults();
}

/**
 * @param {string | null | undefined} attrValue
 * @returns {string}
 */
export function resolveLocale(attrValue) {
  if (attrValue != null && attrValue !== '') return attrValue;
  return getDateTimeDefaults().locale;
}

/**
 * @param {string | null | undefined} attrValue when the attribute is present
 * @param {boolean} hasAttr
 * @returns {'12' | '24'}
 */
export function resolveTimeFormat(attrValue, hasAttr) {
  if (hasAttr) return attrValue === '12' ? '12' : '24';
  return getDateTimeDefaults().timeFormat;
}

/**
 * @param {DateTimeAdapter} next
 */
export function setDateTimeAdapter(next) {
  if (!next || typeof next.toDate !== 'function' || typeof next.fromDate !== 'function') {
    throw new TypeError('DateTimeAdapter requires toDate and fromDate');
  }
  adapter = {
    toDate: next.toDate.bind(next),
    fromDate: next.fromDate.bind(next),
    formatDisplay:
      typeof next.formatDisplay === 'function'
        ? next.formatDisplay.bind(next)
        : createNativeAdapter().formatDisplay,
  };
}

/**
 * @returns {DateTimeAdapter}
 */
export function getDateTimeAdapter() {
  return adapter;
}

/**
 * @param {Element} el
 * @returns {Date | null}
 */
export function getDateValue(el) {
  if (!el) return null;
  const host = /** @type {HTMLElement & { valueAsDate?: Date | null }} */ (el);
  const proto = Object.getPrototypeOf(host);
  if (proto && Object.prototype.hasOwnProperty.call(proto, 'valueAsDate')) {
    return host.valueAsDate ?? null;
  }
  const type = machineTypeOf(el);
  if (!type) return null;
  return adapter.toDate(getMachineValue(el), type);
}

/**
 * @param {Element} el
 * @param {Date | null} date
 */
export function setDateValue(el, date) {
  if (!el) return;
  const host = /** @type {HTMLElement & { valueAsDate?: Date | null }} */ (el);
  host.valueAsDate = date;
}

/**
 * @param {Element} el
 * @returns {string}
 */
export function getMachineValue(el) {
  const host = /** @type {HTMLElement & { value?: string }} */ (el);
  if (typeof host.value === 'string') return host.value;
  return el.getAttribute('value') || '';
}

/**
 * @param {Element} el
 * @param {string} iso
 */
export function setMachineValue(el, iso) {
  const type = machineTypeOf(el);
  const next = iso == null ? '' : String(iso);
  if (!type) {
    if (next) el.setAttribute('value', next);
    else el.removeAttribute('value');
    return;
  }
  // Round-trip through Date so DateInput commits and widgets emit select events.
  setDateValue(el, next ? adapter.toDate(next, type) : null);
}

/**
 * @param {string} machine
 * @param {DateTimeType} type
 * @param {string} [locale]
 */
export function formatDisplay(machine, type, locale) {
  return adapter.formatDisplay(machine, type, locale || getDateTimeDefaults().locale);
}

/**
 * Subscribe a host to defaults changes. Returns an unsubscribe function.
 * @param {() => void} onChange
 */
export function subscribeDateTimeDefaults(onChange) {
  const handler = () => onChange();
  document.addEventListener(DATETIME_DEFAULTS_EVENT, handler);
  return () => document.removeEventListener(DATETIME_DEFAULTS_EVENT, handler);
}

/**
 * @returns {DateTimeAdapter}
 */
export function createNativeAdapter() {
  return {
    toDate(machine, type) {
      if (!machine) return null;
      if (type === 'date') return parseIsoDate(machine);
      if (type === 'time') {
        const parts = parseTimeValue(machine);
        if (!parts) return null;
        const date = new Date(1970, 0, 1, parts.hour, parts.minute, 0, 0);
        return Number.isNaN(date.getTime()) ? null : date;
      }
      if (type === 'datetime-local') {
        const [datePart, timePart = '00:00'] = String(machine).split('T');
        const day = parseIsoDate(datePart);
        const clock = parseTimeValue(timePart.split('.')[0]);
        if (!day || !clock) return null;
        const date = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          clock.hour,
          clock.minute,
          0,
          0,
        );
        return Number.isNaN(date.getTime()) ? null : date;
      }
      if (type === 'month') {
        const parts = parseYearMonth(machine);
        if (!parts) return null;
        return new Date(parts.year, parts.month, 1, 0, 0, 0, 0);
      }
      if (type === 'week') {
        const parts = parseIsoWeek(machine);
        if (!parts) return null;
        return dateFromIsoWeek(parts.year, parts.week);
      }
      return null;
    },
    fromDate(date, type) {
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
      if (type === 'date') return formatIsoDate(date);
      if (type === 'time') return formatTimeValue(date.getHours(), date.getMinutes());
      if (type === 'datetime-local') {
        return `${formatIsoDate(date)}T${formatTimeValue(date.getHours(), date.getMinutes())}`;
      }
      if (type === 'month') return formatYearMonth(date.getFullYear(), date.getMonth());
      if (type === 'week') {
        // Reuse ISO week from local calendar date via UTC helper in pickerDates
        const { year, week } = isoWeekFromLocal(date);
        return formatIsoWeek(year, week);
      }
      return '';
    },
    formatDisplay(machine, type, locale) {
      if (!machine) return '';
      try {
        if (type === 'date') {
          const date = parseIsoDate(machine);
          if (!date) return machine;
          return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        }
        if (type === 'time') {
          const parts = parseTimeValue(machine);
          if (!parts) return machine;
          return formatTimeValue(parts.hour, parts.minute);
        }
        if (type === 'datetime-local') {
          const [datePart, timePart] = String(machine).split('T');
          const date = parseIsoDate(datePart);
          if (!date) return machine;
          const dateStr = date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          const timeStr = timePart ? timePart.split('.')[0].slice(0, 5) : '';
          return `${dateStr} ${timeStr}`.trim();
        }
        if (type === 'month') {
          const parts = parseYearMonth(machine);
          if (!parts) return machine;
          return new Date(parts.year, parts.month, 1).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
          });
        }
        if (type === 'week') {
          const match = String(machine).match(/^(\d{4})-W(\d{2})$/);
          if (match) return `${match[1]}, Week ${parseInt(match[2], 10)}`;
          return machine;
        }
      } catch {
        return machine;
      }
      return machine;
    },
  };
}

/**
 * @param {Date} date
 */
function isoWeekFromLocal(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

/**
 * @returns {Partial<DateTimeDefaults>}
 */
function readDocumentDefaults() {
  if (typeof document === 'undefined') return {};
  const root = document.documentElement;
  if (!root) return {};
  /** @type {Partial<DateTimeDefaults>} */
  const out = {};
  const locale = root.getAttribute(LOCALE_ATTR);
  const timeFormat = root.getAttribute(TIME_FORMAT_ATTR);
  if (locale) out.locale = locale;
  if (timeFormat === '12' || timeFormat === '24') out.timeFormat = timeFormat;
  return out;
}

function notifyDefaultsChanged() {
  if (typeof document === 'undefined') return;
  document.dispatchEvent(
    new CustomEvent(DATETIME_DEFAULTS_EVENT, {
      bubbles: true,
      detail: getDateTimeDefaults(),
    }),
  );
}

/**
 * @param {Element} el
 * @returns {DateTimeType | null}
 */
export function machineTypeOf(el) {
  const tag = el.tagName;
  if (tag === 'HARMONY-DATE-INPUT') {
    const t = el.getAttribute('type') || 'date';
    return /** @type {DateTimeType} */ (
      t === 'time' || t === 'datetime-local' || t === 'month' || t === 'week' ? t : 'date'
    );
  }
  if (tag === 'HARMONY-DATE-PICKER') return 'date';
  if (tag === 'HARMONY-TIME-PICKER') return 'time';
  if (tag === 'HARMONY-DATETIME-PICKER') return 'datetime-local';
  if (tag === 'HARMONY-MONTH-PICKER') return 'month';
  if (tag === 'HARMONY-WEEK-PICKER') return 'week';
  return null;
}
