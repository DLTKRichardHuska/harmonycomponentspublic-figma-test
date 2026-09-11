/**
 * Base class for Harmony Custom Elements.
 * Open Shadow DOM by default; set `static shadowRootInit = null` for light-DOM
 * hybrid helpers that rely on product document CSS.
 */
export class HarmonyElement extends HTMLElement {
  /**
   * Shadow root init, or `null` / falsy to stay in light DOM (hybrid helpers).
   * @type {ShadowRootInit | null}
   */
  static shadowRootInit = { mode: 'open' };

  /** @type {CSSStyleSheet[]} */
  static styles = [];

  constructor() {
    super();
    const init = /** @type {typeof HarmonyElement} */ (this.constructor).shadowRootInit;
    if (init) {
      this.attachShadow(init);
      this.#adoptStyles();
    }
  }

  #adoptStyles() {
    const sheets = /** @type {typeof HarmonyElement} */ (this.constructor).styles;
    if (!sheets?.length || !this.shadowRoot) return;
    if ('adoptedStyleSheets' in this.shadowRoot) {
      this.shadowRoot.adoptedStyleSheets = [...sheets];
    } else {
      for (const sheet of sheets) {
        const style = document.createElement('style');
        style.textContent = [...sheet.cssRules].map((r) => r.cssText).join('\n');
        this.shadowRoot.append(style);
      }
    }
  }

  /**
   * Reflect a boolean attribute.
   * @param {string} name
   * @param {boolean} value
   */
  reflectBoolean(name, value) {
    if (value) this.setAttribute(name, '');
    else this.removeAttribute(name);
  }

  /**
   * Reflect a string attribute.
   * @param {string} name
   * @param {string | null | undefined} value
   */
  reflectString(name, value) {
    if (value == null || value === '') this.removeAttribute(name);
    else this.setAttribute(name, value);
  }

  /**
   * Dispatch a composed CustomEvent.
   * @param {string} type
   * @param {unknown} [detail]
   * @param {{ bubbles?: boolean; cancelable?: boolean }} [opts]
   */
  emit(type, detail, opts = {}) {
    this.dispatchEvent(
      new CustomEvent(type, {
        detail,
        bubbles: opts.bubbles ?? true,
        composed: true,
        cancelable: opts.cancelable ?? false,
      }),
    );
  }
}

/**
 * Create a constructable stylesheet from CSS text.
 * @param {string} cssText
 */
export function createSheet(cssText) {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssText);
  return sheet;
}
