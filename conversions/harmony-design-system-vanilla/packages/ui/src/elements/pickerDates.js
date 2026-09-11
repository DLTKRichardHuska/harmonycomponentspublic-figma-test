/**
 * Date helpers shared by date / month / week pickers.
 */

/**
 * @param {Date} date
 * @returns {string} YYYY-MM-DD
 */
export function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * @param {string | null | undefined} value
 * @returns {Date | null}
 */
export function parseIsoDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * @param {Date} a
 * @param {Date} b
 */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * @param {string} locale
 * @returns {string[]}
 */
export function weekdayShortLabels(locale) {
  const fmt = new Intl.DateTimeFormat(locale || 'en-US', { weekday: 'short' });
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2023, 0, 1 + i)));
}

/**
 * @param {string} locale
 * @param {number} monthIndex
 * @param {'long' | 'short'} [style]
 */
export function monthLabel(locale, monthIndex, style = 'long') {
  return new Intl.DateTimeFormat(locale || 'en-US', { month: style }).format(
    new Date(2023, monthIndex, 1),
  );
}

/**
 * @param {number} month
 * @param {number} year
 * @returns {{ date: Date, inMonth: boolean }[]}
 */
export function calendarDays(month, year) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  /** @type {{ date: Date, inMonth: boolean }[]} */
  const days = [];
  const cursor = new Date(start);
  for (let i = 0; i < 42; i++) {
    days.push({ date: new Date(cursor), inMonth: cursor.getMonth() === month });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

/**
 * @param {Date} day
 * @param {Date | null} min
 * @param {Date | null} max
 */
export function isDayOutOfRange(day, min, max) {
  const value = new Date(day);
  value.setHours(0, 0, 0, 0);
  if (min) {
    const bound = new Date(min);
    bound.setHours(0, 0, 0, 0);
    if (value < bound) return true;
  }
  if (max) {
    const bound = new Date(max);
    bound.setHours(0, 0, 0, 0);
    if (value > bound) return true;
  }
  return false;
}

/**
 * @param {Date} date
 * @returns {{ year: number, week: number }}
 */
export function isoWeekParts(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

/**
 * Monday of an ISO week.
 * @param {number} year
 * @param {number} week
 */
export function dateFromIsoWeek(year, week) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const start = new Date(simple);
  if (dow <= 4) start.setDate(simple.getDate() - simple.getDay() + 1);
  else start.setDate(simple.getDate() + 8 - simple.getDay());
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * @param {number} year ISO week-year
 * @returns {number}
 */
export function weeksInIsoYear(year) {
  const dec28 = isoWeekParts(new Date(year, 11, 28));
  return dec28.week === 53 ? 53 : 52;
}

/**
 * @param {string | null | undefined} value YYYY-Www
 * @returns {{ year: number, week: number } | null}
 */
export function parseIsoWeek(value) {
  const match = String(value || '').match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const week = Number(match[2]);
  if (week < 1 || week > 53) return null;
  return { year, week };
}

/**
 * @param {number} year
 * @param {number} week
 */
export function formatIsoWeek(year, week) {
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/**
 * @param {string | null | undefined} value YYYY-MM
 * @returns {{ year: number, month: number } | null} month is 0-based
 */
export function parseYearMonth(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (month < 0 || month > 11) return null;
  return { year, month };
}

/**
 * @param {number} year
 * @param {number} month 0-based
 */
export function formatYearMonth(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

/**
 * @param {number} hour24
 * @param {number} minute
 */
export function formatTimeValue(hour24, minute) {
  return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * @param {string | null | undefined} value
 * @returns {{ hour: number, minute: number } | null}
 */
export function parseTimeValue(value) {
  const match = String(value || '').match(/^(\d{2}):(\d{2})/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

/**
 * @param {number} hour24
 * @returns {{ hour: number, period: 'AM' | 'PM' }}
 */
export function to12Hour(hour24) {
  if (hour24 === 0) return { hour: 12, period: 'AM' };
  if (hour24 === 12) return { hour: 12, period: 'PM' };
  if (hour24 > 12) return { hour: hour24 - 12, period: 'PM' };
  return { hour: hour24, period: 'AM' };
}

/**
 * @param {number} hour12
 * @param {'AM' | 'PM'} period
 */
export function to24Hour(hour12, period) {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}
