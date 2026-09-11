import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { titleForHref } from '../demoNavigation.js';
import { getConversionStatusForScope } from '../manifestStatus.js';
import { scopeFromPath } from '../demoScope.js';
import { demoChromeSheet } from '../elements/shared.js';
import { pageStyles } from './pageStyles.js';
import '../elements/DemoPageHeader.js';

function statusDescription(status, strategy) {
  if (status === 'gap' && strategy === 'skip') {
    return 'This catalog element will not be converted to vanilla. The demo route exists so navigation matches the reference docs site.';
  }
  if (status === 'gap') {
    return 'This scope is an accepted gap for this conversion. The demo route exists so navigation matches the reference docs site; full content is deferred by human decision.';
  }
  return 'This scope is not converted yet. The demo route exists so navigation matches the reference docs site. After conversion, this page will demonstrate Harmony Custom Elements with npm and static import snippets.';
}

export class DemoPlaceholderPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, pageStyles];

  static get observedAttributes() {
    return ['path'];
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

  get path() {
    return this.getAttribute('path') || '/';
  }

  set path(value) {
    this.reflectString('path', value);
  }

  #onClick = (e) => {
    const a = e.target.closest('a[data-nav]');
    if (!a) return;
    e.preventDefault();
    this.emit('demo-navigate', { href: a.getAttribute('href') });
  };

  #render() {
    const path = this.path;
    const title = titleForHref(path);
    const scope = scopeFromPath(path);
    const conversionStatus = getConversionStatusForScope(scope);
    this.shadowRoot.innerHTML = `
      <demo-page-header title="${escapeAttr(title)}" path="${escapeAttr(path)}" description="${escapeAttr(statusDescription(conversionStatus.status, conversionStatus.strategy))}"></demo-page-header>
      <p><a href="/getting-started" data-nav>Getting Started</a></p>
    `;
  }
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

if (!customElements.get('demo-placeholder-page')) {
  customElements.define('demo-placeholder-page', DemoPlaceholderPage);
}
