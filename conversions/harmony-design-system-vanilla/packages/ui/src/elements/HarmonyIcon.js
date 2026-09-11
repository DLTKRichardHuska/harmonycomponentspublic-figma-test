import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { heroIcons } from './generated/heroIcons.js';
import { customIcons } from './generated/customIcons.js';

const appIcons = new Map();
const instances = new Set();
const VALID_SIZES = new Set(['xs', 'sm', 'md', 'lg', 'xl']);

const styles = createSheet(`
  :host {
    display: inline-flex;
    width: var(--harmony-icon-size, var(--icon-md));
    height: var(--harmony-icon-size, var(--icon-md));
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    color: inherit;
    vertical-align: -0.125em;
  }
  :host([size="xs"]) { --harmony-icon-size: var(--icon-xs); }
  :host([size="sm"]) { --harmony-icon-size: var(--icon-sm); }
  :host([size="md"]) { --harmony-icon-size: var(--icon-md); }
  :host([size="lg"]) { --harmony-icon-size: var(--icon-lg); }
  :host([size="xl"]) { --harmony-icon-size: var(--icon-xl); }
  slot, [part="svg"], [part="fallback"] {
    width: 100%;
    height: 100%;
  }
  slot { display: contents; }
  #generated { display: contents; }
  ::slotted(svg) {
    width: 100%;
    height: 100%;
    color: inherit;
  }
  [part="svg"] {
    display: block;
    color: inherit;
  }
  [part="fallback"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--icon-fallback-radius, var(--space-0-5));
    background: var(--icon-fallback-bg, currentColor);
    color: var(--icon-fallback-text, Canvas);
    font-family: var(--font-sans, sans-serif);
    font-size: var(--icon-fallback-font-size, 0.75em);
    font-weight: var(--font-semibold);
    line-height: var(--leading-none);
  }
  [hidden] { display: none !important; }
  @media (forced-colors: active) {
    :host { color: CanvasText; }
    [part="fallback"] {
      color: Canvas;
      background: CanvasText;
      border: var(--border-width-thin) solid CanvasText;
    }
  }
`);

function sanitizeSvg(markup) {
  const template = document.createElement('template');
  template.innerHTML = String(markup).trim();
  const svg = template.content.querySelector('svg');
  if (!svg) return null;
  for (const unsafe of svg.querySelectorAll('script, foreignObject, iframe, object, embed')) unsafe.remove();
  for (const element of [svg, ...svg.querySelectorAll('*')]) {
    for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith('on') || ((name === 'href' || name === 'xlink:href') && value.startsWith('javascript:'))) {
        element.removeAttribute(attribute.name);
      }
    }
  }
  svg.setAttribute('part', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  return svg;
}

/**
 * Add or replace application-owned icon SVG markup.
 *
 * Lookup after a default-slot SVG: this map, then bundled Harmony custom
 * icons, then Heroicons 24/outline. Connected `<harmony-icon>` instances
 * refresh immediately. Markup must include an `<svg>` root; invalid entries
 * throw TypeError. Treat values as trusted (sanitized, not a sandbox).
 *
 * @param {Record<string, string> | Map<string, string>} map
 */
export function registerIcons(map) {
  const entries = map instanceof Map ? map.entries() : Object.entries(map ?? {});
  for (const [name, svg] of entries) {
    if (!name || typeof svg !== 'string' || !sanitizeSvg(svg)) {
      throw new TypeError(`Icon "${name}" must be a name mapped to valid SVG markup.`);
    }
    appIcons.set(name, svg);
  }
  for (const icon of instances) icon.refresh();
}

/**
 * Presentational Harmony icon. A slotted SVG overrides the name registry.
 */
export class HarmonyIcon extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['name', 'size', 'label'];
  }

  connectedCallback() {
    instances.add(this);
    if (!this.hasAttribute('size')) this.setAttribute('size', 'md');
    this.shadowRoot.addEventListener('slotchange', this.#onSlotChange);
    this.refresh();
  }

  disconnectedCallback() {
    instances.delete(this);
    this.shadowRoot.removeEventListener('slotchange', this.#onSlotChange);
  }

  attributeChangedCallback() {
    if (this.isConnected) this.refresh();
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(value) {
    this.reflectString('name', value);
  }

  get size() {
    const value = this.getAttribute('size') || 'md';
    return VALID_SIZES.has(value) ? value : 'md';
  }

  set size(value) {
    this.setAttribute('size', VALID_SIZES.has(value) ? value : 'md');
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  set label(value) {
    this.reflectString('label', value);
  }

  #onSlotChange = () => this.refresh();

  #hasOverride() {
    const slot = this.shadowRoot.querySelector('slot');
    return Boolean(slot?.assignedNodes({ flatten: true }).some(
      (node) => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim(),
    ));
  }

  refresh() {
    const label = this.label;
    if (label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }

    if (!this.shadowRoot.querySelector('slot')) {
      this.shadowRoot.innerHTML = '<slot></slot><span id="generated"></span>';
    }
    const generated = this.shadowRoot.querySelector('#generated');
    if (this.#hasOverride()) {
      generated.hidden = true;
      generated.replaceChildren();
      return;
    }

    generated.hidden = false;
    const markup = appIcons.get(this.name) ?? customIcons[this.name] ?? heroIcons[this.name];
    const svg = markup ? sanitizeSvg(markup) : null;
    if (svg) {
      generated.replaceChildren(svg);
    } else {
      const fallback = document.createElement('span');
      fallback.setAttribute('part', 'fallback');
      fallback.textContent = '?';
      fallback.title = this.name ? `Icon "${this.name}" not found` : 'Icon name not provided';
      generated.replaceChildren(fallback);
    }
  }
}
