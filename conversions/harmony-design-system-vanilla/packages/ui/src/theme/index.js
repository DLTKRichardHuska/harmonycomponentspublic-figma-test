/** @typedef {'light' | 'dark'} HarmonyMode */

/** Documented localStorage key for an explicit user color-scheme override. */
export const COLOR_SCHEME_STORAGE_KEY = 'harmony-color-scheme';

/**
 * Toggle document color scheme. Product is fixed by which build/subpath/zip you loaded —
 * never switch product at runtime in consumer apps.
 * @param {HarmonyMode} mode
 * @param {Document} [doc]
 */
export function setColorScheme(mode, doc = document) {
  const root = doc.documentElement;
  if (mode === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

/**
 * @param {Document} [doc]
 * @returns {HarmonyMode}
 */
export function getColorScheme(doc = document) {
  return doc.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * @param {Document} [doc]
 * @returns {HarmonyMode}
 */
export function toggleColorScheme(doc = document) {
  const next = getColorScheme(doc) === 'dark' ? 'light' : 'dark';
  setColorScheme(next, doc);
  return next;
}

/**
 * Persist an explicit light/dark choice so it wins over OS prefers-color-scheme.
 * @param {HarmonyMode} mode
 * @param {Storage} [storage]
 */
export function persistColorScheme(mode, storage = globalThis.localStorage) {
  try {
    storage?.setItem(COLOR_SCHEME_STORAGE_KEY, mode);
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * Clear the explicit override so the next initColorScheme follows the OS again.
 * @param {Storage} [storage]
 */
export function clearPersistedColorScheme(storage = globalThis.localStorage) {
  try {
    storage?.removeItem(COLOR_SCHEME_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Read saved preference, if any.
 * @param {Storage} [storage]
 * @returns {HarmonyMode | null}
 */
export function getPersistedColorScheme(storage = globalThis.localStorage) {
  try {
    const v = storage?.getItem(COLOR_SCHEME_STORAGE_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Apply color scheme on load:
 * - If an explicit preference is saved → use it.
 * - Else → use `matchMedia('(prefers-color-scheme: dark)')`.
 *
 * When `followSystem` is true (default) and there is no saved preference, listens for OS
 * changes until the consumer calls `persistColorScheme` / `setColorScheme` with persistence.
 *
 * @param {{
 *   doc?: Document,
 *   storage?: Storage,
 *   followSystem?: boolean,
 *   matchMedia?: typeof globalThis.matchMedia,
 * }} [options]
 * @returns {HarmonyMode}
 */
export function initColorScheme(options = {}) {
  const {
    doc = document,
    storage = globalThis.localStorage,
    followSystem = true,
    matchMedia = globalThis.matchMedia?.bind(globalThis),
  } = options;

  const applyFromMedia = () => {
    const dark = Boolean(matchMedia?.('(prefers-color-scheme: dark)')?.matches);
    setColorScheme(dark ? 'dark' : 'light', doc);
    return getColorScheme(doc);
  };

  const saved = getPersistedColorScheme(storage);
  if (saved) {
    setColorScheme(saved, doc);
    return saved;
  }

  const mode = applyFromMedia();

  if (followSystem && matchMedia) {
    const mql = matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getPersistedColorScheme(storage)) return;
      applyFromMedia();
    };
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(onChange);
    }
  }

  return mode;
}
