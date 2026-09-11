import {
  HarmonyElement,
  createSheet,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import {
  toggleColorScheme,
  initColorScheme,
  persistColorScheme,
} from '@dltkrichardhuska/harmony-design-system-vanilla/theme';
import { titleForHref } from '../demoNavigation.js';
import {
  STORAGE_PRODUCT,
  demoChromeSheet,
  applyProductStylesheet,
} from './shared.js';
import './DemoHeader.js';
import './DemoNav.js';
import './DemoCoverage.js';
import '../pages/register.js';

const styles = createSheet(`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: var(--page-bg);
    color: var(--text-primary);
  }
  :host-context(html.dark) {
    background: var(--page-bg);
  }
  .body {
    position: relative;
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  aside {
    display: flex;
    flex-direction: column;
    width: 16rem;
    flex-shrink: 0;
    border-right: var(--border-width-thin) solid var(--border-color);
    background: var(--nav-bg);
    min-height: 0;
  }
  :host-context(html.dark) aside {
    background: var(--nav-bg);
    border-color: var(--border-color);
  }
  .sidebar-header {
    flex-shrink: 0;
    padding: var(--space-4);
    border-bottom: var(--border-width-thin) solid var(--border-color);
  }
  .brand {
    font-family: var(--font-display, Lexend, sans-serif);
    font-size: var(--heading-s);
    font-weight: var(--font-semibold);
    line-height: var(--leading-snug);
  }
  .brand-sub {
    font-size: var(--caption);
    line-height: var(--leading-normal);
    opacity: 0.7;
    margin-top: var(--space-0-5);
  }
  main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
  }
  .content {
    padding: var(--space-6) var(--space-8) var(--space-10);
    max-width: 56rem;
  }
  .backdrop {
    display: none;
  }
  @media (max-width: 1023px) {
    .backdrop {
      display: block;
      position: absolute;
      inset: 0;
      z-index: var(--z-30);
      border: 0;
      padding: 0;
      background: var(--overlay-backdrop-opacity);
      cursor: pointer;
    }
    aside {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: var(--z-40);
      max-width: 85vw;
      transform: translateX(-100%);
      transition: transform var(--transition-base);
      box-shadow: var(--shadow-2xl);
    }
    :host([nav-open]) aside {
      transform: translateX(0);
    }
  }
  @media (forced-colors: active) {
    :host,
    :host-context(html.dark) {
      background: Canvas;
      color: CanvasText;
    }
    aside,
    :host-context(html.dark) aside {
      background: Canvas;
      border-color: CanvasText;
    }
    .sidebar-header {
      border-color: CanvasText;
    }
    .backdrop {
      background: Canvas;
      opacity: 0.85;
      border: var(--border-width-thin) solid CanvasText;
    }
    aside {
      box-shadow: none;
      border-right: var(--border-width-standard) solid CanvasText;
    }
  }
`);

/**
 * Root demo application — Custom Element chrome that dogfoods the package.
 * Product theming: swap flattened product stylesheet only (never data-product).
 */
export class DemoApp extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, styles];

  static get observedAttributes() {
    return ['path', 'nav-open', 'product'];
  }

  #boundPopState = () => this.#syncPathFromLocation();

  connectedCallback() {
    const savedProduct = localStorage.getItem(STORAGE_PRODUCT) || 'vp';
    this.product = this.product || savedProduct;
    applyProductStylesheet(this.product);
    initColorScheme({ followSystem: true });
    this.#syncPathFromLocation();
    this.#render();
    this.shadowRoot.addEventListener('demo-navigate', this.#onNavigate);
    this.shadowRoot.addEventListener('demo-nav-toggle', this.#onNavToggle);
    this.shadowRoot.addEventListener('demo-mode-toggle', this.#onModeToggle);
    this.shadowRoot.addEventListener('demo-product-change', this.#onProductChange);
    this.shadowRoot.addEventListener('click', this.#onBackdrop);
    window.addEventListener('popstate', this.#boundPopState);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.#boundPopState);
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === 'product') applyProductStylesheet(this.product);
    this.#render();
    this.#updateDocumentChrome();
  }

  get path() {
    return this.getAttribute('path') || '/';
  }

  set path(value) {
    this.reflectString('path', value);
  }

  get product() {
    return this.getAttribute('product') || 'vp';
  }

  set product(value) {
    this.reflectString('product', value);
  }

  get navOpen() {
    return this.hasAttribute('nav-open');
  }

  set navOpen(value) {
    this.reflectBoolean('nav-open', Boolean(value));
  }

  #syncPathFromLocation() {
    const path = location.pathname.replace(/\/$/, '') || '/';
    if (this.path !== path) this.path = path;
    else this.#render();
  }

  #updateDocumentChrome() {
    document.title =
      this.path === '/'
        ? 'Harmony Design System — Vanilla'
        : `${titleForHref(this.path)} · Harmony Vanilla`;
    document.body.style.overflow = this.navOpen ? 'hidden' : '';
  }

  #onNavigate = (e) => {
    const href = e.detail?.href;
    if (!href) return;
    history.pushState({}, '', href);
    this.navOpen = false;
    this.path = href.replace(/\/$/, '') || '/';
  };

  #onNavToggle = () => {
    this.navOpen = !this.navOpen;
  };

  #onModeToggle = () => {
    const next = toggleColorScheme();
    persistColorScheme(next);
    this.#render();
  };

  #onProductChange = (e) => {
    this.product = e.detail?.product || 'vp';
  };

  #onBackdrop = (e) => {
    if (e.target.id === 'nav-backdrop') this.navOpen = false;
  };

  #pageTag() {
    switch (this.path) {
      case '/':
        return '<demo-home-page></demo-home-page>';
      case '/getting-started':
        return '<demo-getting-started-page></demo-getting-started-page>';
      case '/changelog':
        return '<demo-changelog-page></demo-changelog-page>';
      case '/foundation/colors':
        return '<demo-foundation-colors-page></demo-foundation-colors-page>';
      case '/foundation/typography':
        return '<demo-foundation-typography-page></demo-foundation-typography-page>';
      case '/foundation/spacing':
        return '<demo-foundation-spacing-page></demo-foundation-spacing-page>';
      case '/foundation/elevations':
        return '<demo-foundation-elevations-page></demo-foundation-elevations-page>';
      case '/components/icons':
        return '<demo-icons-page></demo-icons-page>';
      case '/components/buttons':
        return '<demo-buttons-page></demo-buttons-page>';
      case '/components/cards':
        return '<demo-cards-page></demo-cards-page>';
      case '/components/alerts':
        return '<demo-alerts-page></demo-alerts-page>';
      case '/components/tooltips':
        return '<demo-tooltips-page></demo-tooltips-page>';
      case '/components/dialogs':
        return '<demo-dialogs-page></demo-dialogs-page>';
      case '/components/progress-bar':
        return '<demo-progress-bar-page></demo-progress-bar-page>';
      case '/components/spinner':
        return '<demo-spinner-page></demo-spinner-page>';
      case '/components/accordion':
        return '<demo-accordion-page></demo-accordion-page>';
      case '/components/links':
        return '<demo-links-page></demo-links-page>';
      case '/components/badges':
        return '<demo-badges-page></demo-badges-page>';
      case '/components/avatar':
        return '<demo-avatar-page></demo-avatar-page>';
      case '/shell/header':
        return '<demo-shell-header-page></demo-shell-header-page>';
      case '/shell/left-sidebar':
        return '<demo-left-sidebar-page></demo-left-sidebar-page>';
      case '/shell/right-sidebar':
        return '<demo-right-sidebar-page></demo-right-sidebar-page>';
      case '/components/company-picker':
        return '<demo-company-picker-page></demo-company-picker-page>';
      case '/components/user-menu':
        return '<demo-user-menu-page></demo-user-menu-page>';
      case '/components/chips':
        return '<demo-chips-page></demo-chips-page>';
      case '/components/inputs':
        return '<demo-inputs-page></demo-inputs-page>';
      case '/components/dropdowns':
        return '<demo-dropdowns-page></demo-dropdowns-page>';
      case '/components/labels':
        return '<demo-labels-page></demo-labels-page>';
      case '/components/date-picker':
        return '<demo-date-picker-page></demo-date-picker-page>';
      case '/components/button-groups':
        return '<demo-button-groups-page></demo-button-groups-page>';
      case '/components/list-menu':
        return '<demo-list-menu-page></demo-list-menu-page>';
      case '/components/notification-badges':
        return '<demo-notification-badges-page></demo-notification-badges-page>';
      case '/components/checkboxes':
        return '<demo-checkboxes-page></demo-checkboxes-page>';
      case '/components/radio-buttons':
        return '<demo-radio-buttons-page></demo-radio-buttons-page>';
      case '/components/toggle-switches':
        return '<demo-toggle-switches-page></demo-toggle-switches-page>';
      case '/components/tab-strip':
        return '<demo-tab-strip-page></demo-tab-strip-page>';
      case '/components/tables':
        return '<demo-tables-page></demo-tables-page>';
      default:
        return `<demo-placeholder-page path="${this.path}"></demo-placeholder-page>`;
    }
  }

  #render() {
    if (!this.shadowRoot) return;
    const path = this.path;
    this.shadowRoot.innerHTML = `
      <demo-header product="${this.product}" ${this.navOpen ? 'nav-open' : ''}></demo-header>
      <div class="body">
        ${this.navOpen ? '<button type="button" class="backdrop" id="nav-backdrop" aria-label="Close navigation overlay"></button>' : ''}
        <aside id="docs-sidebar" aria-label="Documentation navigation">
          <div class="sidebar-header">
            <div class="brand">Navigation</div>
            <div class="brand-sub">Custom Elements · review demo</div>
          </div>
          <demo-nav active-path="${path}"></demo-nav>
          <demo-coverage></demo-coverage>
        </aside>
        <main>
          <div class="content">${this.#pageTag()}</div>
        </main>
      </div>
    `;
    this.#updateDocumentChrome();
    const header = this.shadowRoot.querySelector('demo-header');
    if (header) header.setAttribute('product', this.product);
  }
}

if (!customElements.get('demo-app')) {
  customElements.define('demo-app', DemoApp);
}
