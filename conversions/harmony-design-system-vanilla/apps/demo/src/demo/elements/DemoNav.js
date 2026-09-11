import {
  HarmonyElement,
  createSheet,
  typographySheet,
  listMenuSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoNavigation } from '../demoNavigation.js';
import { demoChromeSheet } from './shared.js';

const styles = createSheet(`
  :host {
    display: block;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--space-4);
  }
  nav { display: block; }
  .section { margin-bottom: var(--space-4); }
  h2 {
    margin: 0 0 var(--space-1-5);
    padding: 0 var(--space-1-5);
    opacity: 0.6;
  }
  .list-menu.list-menu--no-borders {
    background: transparent;
    border: none;
    border-radius: 0;
    overflow: visible;
  }
  a.list-menu__item {
    text-decoration: none;
    box-sizing: border-box;
  }
  a.list-menu__item:not(.is-active) {
    color: inherit;
  }
  @media (forced-colors: active) {
    h2 { opacity: 1; color: GrayText; }
    a.list-menu__item { color: LinkText; }
    a.list-menu__item:hover {
      background: Highlight;
      color: HighlightText;
    }
    a.list-menu__item.is-active {
      background: Highlight;
      color: HighlightText;
      outline: var(--border-width-standard) solid CanvasText;
      outline-offset: calc(var(--space-0-5) * -1);
    }
    a.list-menu__item:focus-visible {
      outline: var(--border-width-standard) solid Highlight;
      outline-offset: var(--space-0-5);
    }
  }
`);

/**
 * Docs navigation — dogfoods list-menu recipe (listMenuSheet) per section.
 */
export class DemoNav extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, listMenuSheet, styles];

  static get observedAttributes() {
    return ['active-path'];
  }

  connectedCallback() {
    this.#render();
    this.shadowRoot.addEventListener('click', this.#onClick);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#onClick);
  }

  attributeChangedCallback() {
    this.#render();
  }

  get activePath() {
    return this.getAttribute('active-path') || '/';
  }

  set activePath(value) {
    this.reflectString('active-path', value);
  }

  #onClick = (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http')) return;
    e.preventDefault();
    this.emit('demo-navigate', { href });
  };

  #render() {
    const active = this.activePath;
    const sections = demoNavigation
      .map((section) => {
        const links = section.items
          .map((item) => {
            const current = item.href === active;
            const currentAttr = current ? ' aria-current="page"' : '';
            const activeClass = current ? ' is-active' : '';
            return `<a class="list-menu__item${activeClass}" href="${item.href}"${currentAttr}><harmony-icon name="${item.icon}" size="sm" class="list-menu__item-icon"></harmony-icon><span>${item.title}</span></a>`;
          })
          .join('');
        return `<div class="section"><h2 class="text-overline">${section.title}</h2><div class="list-menu list-menu--no-borders" role="list">${links}</div></div>`;
      })
      .join('');
    this.shadowRoot.innerHTML = `<nav part="nav" aria-label="Documentation">${sections}</nav>`;
  }
}

if (!customElements.get('demo-nav')) {
  customElements.define('demo-nav', DemoNav);
}
