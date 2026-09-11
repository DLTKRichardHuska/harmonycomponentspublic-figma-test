import { HarmonyElement } from './HarmonyElement.js';

const VARIANTS = new Set([
  'primary',
  'secondary',
  'tertiary',
  'outline',
  'ghost',
  'destructive',
]);
const SIZES = new Set(['xs', 'sm', 'md', 'lg']);
const ORIENTATIONS = new Set(['horizontal', 'vertical']);
const BUTTON_TYPES = new Set(['theme', 'pageHeader']);
const HTML_TYPES = new Set(['button', 'submit', 'reset']);
const ICON_POSITIONS = new Set(['left', 'right']);

const ICON_SIZE_MAP = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

const MANAGED_CLASSES = new Set([
  'btn',
  'btn--primary',
  'btn--secondary',
  'btn--tertiary',
  'btn--outline',
  'btn--ghost',
  'btn--destructive',
  'btn--page-header',
  'btn--xs',
  'btn--sm',
  'btn--md',
  'btn--lg',
  'btn--icon-xs',
  'btn--icon-sm',
  'btn--icon-md',
  'btn--icon-lg',
  'btn--vertical',
  'btn--disabled',
  'btn--loading',
  'btn--full',
]);

/**
 * Light-DOM hybrid helper: maps attributes to the native `.btn` class recipe.
 * Document `styles.css` (or `buttonSheet` in Shadow hosts) styles the host.
 * Preserves consumer light-DOM text/nodes; only injects managed icon/spinner.
 */
export class HarmonyButton extends HarmonyElement {
  static shadowRootInit = null;
  static formAssociated = true;

  static get observedAttributes() {
    return [
      'variant',
      'button-type',
      'size',
      'orientation',
      'disabled',
      'loading',
      'loading-text',
      'icon',
      'icon-position',
      'type',
      'full-width',
    ];
  }

  /** @type {ElementInternals} */
  #internals;
  /** @type {boolean} */
  #syncing = false;
  /** @type {MutationObserver | null} */
  #childObserver = null;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.#internals.role = 'button';
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    this.addEventListener('click', this.#onClick);
    this.addEventListener('keydown', this.#onKeyDown);
  }

  connectedCallback() {
    this.#sync();
    this.#childObserver = new MutationObserver(() => {
      if (this.#syncing) return;
      this.#sync();
    });
    this.#childObserver.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  disconnectedCallback() {
    this.#childObserver?.disconnect();
    this.#childObserver = null;
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get variant() {
    const v = this.getAttribute('variant') || 'primary';
    return VARIANTS.has(v) ? v : 'primary';
  }

  set variant(value) {
    this.reflectString('variant', value);
  }

  get buttonType() {
    const v = this.getAttribute('button-type') || 'theme';
    return BUTTON_TYPES.has(v) ? v : 'theme';
  }

  set buttonType(value) {
    this.reflectString('button-type', value);
  }

  get size() {
    const v = this.getAttribute('size') || 'md';
    return SIZES.has(v) ? v : 'md';
  }

  set size(value) {
    this.reflectString('size', value);
  }

  get orientation() {
    const v = this.getAttribute('orientation') || 'horizontal';
    return ORIENTATIONS.has(v) ? v : 'horizontal';
  }

  set orientation(value) {
    this.reflectString('orientation', value);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    this.reflectBoolean('disabled', Boolean(value));
  }

  get loading() {
    return this.hasAttribute('loading');
  }

  set loading(value) {
    this.reflectBoolean('loading', Boolean(value));
  }

  get loadingText() {
    return this.getAttribute('loading-text') || '';
  }

  set loadingText(value) {
    this.reflectString('loading-text', value);
  }

  get icon() {
    return this.getAttribute('icon') || '';
  }

  set icon(value) {
    this.reflectString('icon', value);
  }

  get iconPosition() {
    const v = this.getAttribute('icon-position') || 'left';
    return ICON_POSITIONS.has(v) ? v : 'left';
  }

  set iconPosition(value) {
    this.reflectString('icon-position', value);
  }

  get type() {
    const v = this.getAttribute('type') || 'button';
    return HTML_TYPES.has(v) ? v : 'button';
  }

  set type(value) {
    this.reflectString('type', value);
  }

  get fullWidth() {
    return this.hasAttribute('full-width');
  }

  set fullWidth(value) {
    this.reflectBoolean('full-width', Boolean(value));
  }

  #hasUserLabel() {
    for (const node of this.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) return true;
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node instanceof HTMLElement &&
        !node.hasAttribute('data-harmony-button-managed') &&
        node.tagName !== 'HARMONY-ICON' &&
        node.textContent?.trim()
      ) {
        return true;
      }
    }
    return false;
  }

  #clearManaged() {
    for (const el of [...this.querySelectorAll('[data-harmony-button-managed]')]) {
      el.remove();
    }
  }

  #setUserContentHidden(hidden) {
    for (const node of this.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement) {
        if (node.hasAttribute('data-harmony-button-managed')) continue;
        node.hidden = hidden;
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (hidden) {
          if (node.__harmonyButtonText == null) node.__harmonyButtonText = node.textContent;
          node.textContent = '';
        } else if (node.__harmonyButtonText != null) {
          node.textContent = node.__harmonyButtonText;
          delete node.__harmonyButtonText;
        }
      }
    }
  }

  #onClick = (e) => {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    const form = this.#internals.form;
    if (!form) return;
    if (this.type === 'submit') {
      e.preventDefault();
      form.requestSubmit();
    } else if (this.type === 'reset') {
      e.preventDefault();
      form.reset();
    }
  };

  #onKeyDown = (e) => {
    if (this.disabled || this.loading) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  };

  #sync() {
    this.#syncing = true;
    try {
      const variant = this.variant;
      const size = this.size;
      const loading = this.loading;
      const disabled = this.disabled || loading;
      const icon = this.icon;
      const hasLabel = this.#hasUserLabel();
      const isIconOnly = Boolean(icon) && !hasLabel && !loading;

      const classes = [
        'btn',
        `btn--${variant}`,
        this.buttonType === 'pageHeader' ? 'btn--page-header' : '',
        isIconOnly ? `btn--icon-${size}` : `btn--${size}`,
        this.orientation === 'vertical' ? 'btn--vertical' : '',
        disabled ? 'btn--disabled' : '',
        loading ? 'btn--loading' : '',
        this.fullWidth ? 'btn--full' : '',
      ].filter(Boolean);

      const extra = [...this.classList].filter((c) => !MANAGED_CLASSES.has(c));
      this.className = [...classes, ...extra].join(' ');

      this.#internals.ariaDisabled = disabled ? 'true' : 'false';
      this.#internals.ariaBusy = loading ? 'true' : null;
      this.tabIndex = disabled ? -1 : 0;

      this.#clearManaged();

      if (loading) {
        this.#setUserContentHidden(true);
        const spinner = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        spinner.setAttribute('class', 'btn__spinner');
        spinner.setAttribute('viewBox', '0 0 24 24');
        spinner.setAttribute('fill', 'none');
        spinner.setAttribute('aria-hidden', 'true');
        spinner.setAttribute('focusable', 'false');
        spinner.setAttribute('data-harmony-button-managed', '');
        spinner.innerHTML =
          '<circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="var(--btn-spinner-stroke-width)"></circle>' +
          '<path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>';
        this.prepend(spinner);
        if (this.loadingText) {
          const span = document.createElement('span');
          span.setAttribute('data-harmony-button-managed', '');
          span.textContent = this.loadingText;
          this.append(span);
        }
      } else {
        this.#setUserContentHidden(false);
        if (icon) {
          const iconEl = document.createElement('harmony-icon');
          iconEl.setAttribute('name', icon);
          iconEl.setAttribute('size', ICON_SIZE_MAP[size] || 'sm');
          iconEl.setAttribute('data-harmony-button-managed', '');
          if (this.iconPosition === 'right') this.append(iconEl);
          else this.prepend(iconEl);
        }
      }
    } finally {
      this.#syncing = false;
    }
  }
}
