import { HarmonyElement } from './HarmonyElement.js';

const MANAGED_CLASSES = new Set([
  'card',
  'card--elevated',
  'card--interactive',
  'card--primary',
  'card--with-header',
]);

const SLOT_HEADER = 'header';
const SLOT_ACTIONS = 'header-actions';
const SLOT_FOOTER = 'footer';

/**
 * Light-DOM hybrid helper: maps attributes to the native `.card` class recipe
 * and wraps light-DOM slot markers into BEM structure.
 * Document `styles.css` (or `cardSheet` in Shadow hosts) styles the host.
 */
export class HarmonyCard extends HarmonyElement {
  static shadowRootInit = null;

  static get observedAttributes() {
    return ['elevated', 'interactive', 'primary', 'title', 'subtitle'];
  }

  /** @type {ElementInternals | null} */
  #internals = null;
  /** @type {boolean} */
  #syncing = false;
  /** @type {MutationObserver | null} */
  #childObserver = null;
  /** @type {boolean} */
  #ownedTabIndex = false;

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      this.#internals = this.attachInternals();
    }
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
      attributes: true,
      attributeFilter: ['slot'],
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

  get elevated() {
    return this.hasAttribute('elevated');
  }

  set elevated(value) {
    this.reflectBoolean('elevated', Boolean(value));
  }

  get interactive() {
    return this.hasAttribute('interactive');
  }

  set interactive(value) {
    this.reflectBoolean('interactive', Boolean(value));
  }

  get primary() {
    return this.hasAttribute('primary');
  }

  set primary(value) {
    this.reflectBoolean('primary', Boolean(value));
  }

  /** Card heading — also the HTML tooltip attribute on the host. */
  get title() {
    return this.getAttribute('title') || '';
  }

  set title(value) {
    this.reflectString('title', value);
  }

  get subtitle() {
    return this.getAttribute('subtitle') || '';
  }

  set subtitle(value) {
    this.reflectString('subtitle', value);
  }

  #onKeyDown = (e) => {
    if (!this.interactive) return;
    if (e.target !== this) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  };

  #findManaged(className) {
    for (const child of this.children) {
      if (
        child instanceof HTMLElement &&
        child.hasAttribute('data-harmony-card-managed') &&
        child.classList.contains(className)
      ) {
        return child;
      }
    }
    return null;
  }

  #ensureSection(className) {
    let el = this.#findManaged(className);
    if (!el) {
      el = document.createElement('div');
      el.className = className;
      el.setAttribute('data-harmony-card-managed', '');
    }
    return el;
  }

  /**
   * Collect consumer nodes from direct children and from existing managed regions
   * so a re-sync does not drop content already wrapped into BEM structure.
   */
  #collectContent() {
    const headerSlotNodes = [];
    const actionsSlotNodes = [];
    const footerSlotNodes = [];
    const bodyNodes = [];

    const takeConsumer = (node, bucket) => {
      if (node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement) {
        if (node.hasAttribute('data-harmony-card-managed')) return;
        bucket.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        bucket.push(node);
      }
    };

    for (const node of [...this.childNodes]) {
      if (!(node instanceof HTMLElement)) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          bodyNodes.push(node);
        }
        continue;
      }
      if (!node.hasAttribute('data-harmony-card-managed')) {
        const slot = node.getAttribute('slot') || '';
        if (slot === SLOT_HEADER) headerSlotNodes.push(node);
        else if (slot === SLOT_ACTIONS) actionsSlotNodes.push(node);
        else if (slot === SLOT_FOOTER) footerSlotNodes.push(node);
        else bodyNodes.push(node);
        continue;
      }

      if (node.classList.contains('card__header')) {
        for (const child of [...node.childNodes]) {
          if (!(child instanceof HTMLElement)) continue;
          if (child.hasAttribute('data-harmony-card-managed')) {
            if (child.classList.contains('card__header-actions')) {
              for (const action of [...child.childNodes]) {
                takeConsumer(action, actionsSlotNodes);
              }
            }
            // prop-generated header-content is rebuilt from title/subtitle
            continue;
          }
          const slot = child.getAttribute('slot') || '';
          if (slot === SLOT_HEADER || !slot) {
            // Custom header slot content (may still carry slot=header)
            if (slot === SLOT_ACTIONS) actionsSlotNodes.push(child);
            else if (slot === SLOT_FOOTER) footerSlotNodes.push(child);
            else headerSlotNodes.push(child);
          } else if (slot === SLOT_ACTIONS) {
            actionsSlotNodes.push(child);
          }
        }
      } else if (node.classList.contains('card__body')) {
        for (const child of [...node.childNodes]) {
          takeConsumer(child, bodyNodes);
        }
      } else if (node.classList.contains('card__footer')) {
        for (const child of [...node.childNodes]) {
          takeConsumer(child, footerSlotNodes);
        }
      }
    }

    return { headerSlotNodes, actionsSlotNodes, footerSlotNodes, bodyNodes };
  }

  #syncStructure() {
    const { headerSlotNodes, actionsSlotNodes, footerSlotNodes, bodyNodes } =
      this.#collectContent();

    const title = this.title;
    const subtitle = this.subtitle;
    const hasPropHeader = Boolean(title || subtitle);
    const needsHeader =
      headerSlotNodes.length > 0 || actionsSlotNodes.length > 0 || hasPropHeader;
    const needsFooter = footerSlotNodes.length > 0;

    const header = needsHeader ? this.#ensureSection('card__header') : null;
    const body = this.#ensureSection('card__body');
    const footer = needsFooter ? this.#ensureSection('card__footer') : null;

    // Park sections off-host while we rebuild so MutationObserver can be ignored via #syncing
    for (const el of [header, body, footer]) {
      if (el && el.parentNode === this) el.remove();
    }

    // Remove any other stale managed sections
    for (const child of [...this.children]) {
      if (
        child instanceof HTMLElement &&
        child.hasAttribute('data-harmony-card-managed')
      ) {
        child.remove();
      }
    }

    if (header) {
      header.replaceChildren();

      if (headerSlotNodes.length > 0) {
        for (const n of headerSlotNodes) header.append(n);
      } else if (hasPropHeader) {
        const content = document.createElement('div');
        content.className = 'card__header-content';
        content.setAttribute('data-harmony-card-managed', '');
        if (title) {
          const h2 = document.createElement('h2');
          h2.className = 'card__header-title';
          h2.textContent = title;
          content.append(h2);
        }
        if (subtitle) {
          const p = document.createElement('p');
          p.className = 'card__header-subtitle';
          p.textContent = subtitle;
          content.append(p);
        }
        header.append(content);
      }

      if (actionsSlotNodes.length > 0) {
        const actions = document.createElement('div');
        actions.className = 'card__header-actions';
        actions.setAttribute('data-harmony-card-managed', '');
        for (const n of actionsSlotNodes) actions.append(n);
        header.append(actions);
      }

      this.append(header);
    }

    body.replaceChildren();
    for (const n of bodyNodes) body.append(n);
    this.append(body);

    if (footer) {
      footer.replaceChildren();
      for (const n of footerSlotNodes) footer.append(n);
      this.append(footer);
    } else {
      // Drop empty managed footer if it existed
      const staleFooter = this.#findManaged('card__footer');
      if (staleFooter) staleFooter.remove();
    }

    // Drop empty managed header if no longer needed
    if (!needsHeader) {
      const staleHeader = this.#findManaged('card__header');
      if (staleHeader) staleHeader.remove();
    }

    return needsHeader;
  }

  #syncInteractive(interactive) {
    if (interactive) {
      if (this.#internals) this.#internals.role = 'button';
      this.setAttribute('role', 'button');
      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = 0;
        this.#ownedTabIndex = true;
      }
    } else {
      if (this.#internals) this.#internals.role = null;
      this.removeAttribute('role');
      if (this.#ownedTabIndex) {
        this.removeAttribute('tabindex');
        this.#ownedTabIndex = false;
      }
    }
  }

  #sync() {
    this.#syncing = true;
    try {
      const hasHeader = this.#syncStructure();

      const classes = [
        'card',
        this.elevated ? 'card--elevated' : '',
        this.interactive ? 'card--interactive' : '',
        this.primary ? 'card--primary' : '',
        hasHeader ? 'card--with-header' : '',
      ].filter(Boolean);

      const extra = [...this.classList].filter((c) => !MANAGED_CLASSES.has(c));
      this.className = [...classes, ...extra].join(' ');

      this.#syncInteractive(this.interactive);
    } finally {
      this.#syncing = false;
    }
  }
}
