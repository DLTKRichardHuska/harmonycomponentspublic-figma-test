import {
  HarmonyElement,
  createSheet,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from './shared.js';
import { scopeFromPath, shouldShowConversionStatus } from '../demoScope.js';
import { getConversionStatusForScope } from '../manifestStatus.js';
import { statusBadgeHtml } from '../demoStatusBadge.js';

const styles = createSheet(`
  :host {
    display: block;
    margin: 0 0 var(--space-8);
    padding: 0 0 var(--space-6);
    border-bottom: var(--border-width-thin) solid var(--border-color);
  }
  .title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-3);
    margin: 0 0 var(--space-2);
  }
  h1 {
    margin: 0;
  }
  .desc {
    margin: 0;
    max-width: 50rem;
    color: var(--text-secondary);
  }
  ::slotted(p) {
    margin: 0;
    max-width: 50rem;
    color: var(--text-secondary);
  }
  @media (forced-colors: active) {
    :host {
      border-bottom-color: CanvasText;
    }
    .desc,
    ::slotted(p) {
      color: CanvasText;
    }
  }
`);

/**
 * Shared demo page header — title + optional conversion sync status badge.
 * Mirrors shadcn DemoPageHeader.
 *
 * Attributes:
 * - title (required)
 * - description (optional)
 * - scope — manifest element key; when set, always shows status badge
 * - path — route path; used to resolve scope and whether to show status
 */
export class DemoPageHeader extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, styles];

  static get observedAttributes() {
    return ['title', 'description', 'scope', 'path'];
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#render();
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  set title(value) {
    this.reflectString('title', value);
  }

  get description() {
    return this.getAttribute('description') || '';
  }

  set description(value) {
    this.reflectString('description', value);
  }

  get scope() {
    return this.getAttribute('scope') || '';
  }

  set scope(value) {
    this.reflectString('scope', value);
  }

  get path() {
    return this.getAttribute('path') || '';
  }

  set path(value) {
    this.reflectString('path', value);
  }

  #render() {
    const title = this.title;
    const description = this.description;
    const path = this.path;
    const scopeAttr = this.scope;

    let badgeHtml = '';
    const showFromPath = path && shouldShowConversionStatus(path);
    const showFromScope = Boolean(scopeAttr);
    if (showFromPath || showFromScope) {
      const scope = scopeAttr || scopeFromPath(path);
      const conversionStatus = getConversionStatusForScope(scope);
      badgeHtml = statusBadgeHtml({
        label: conversionStatus.label,
        variant: conversionStatus.variant,
        size: 'large',
      });
    }

    // Attribute description is plain text; rich HTML intros use the default slot.
    const descHtml = description
      ? `<p class="desc">${escapeHtml(description)}</p>`
      : '';

    this.shadowRoot.innerHTML = `
      <header>
        <div class="title-row">
          <h1>${escapeHtml(title)}</h1>
          ${badgeHtml}
        </div>
        ${descHtml}
        <slot></slot>
      </header>
    `;
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

if (!customElements.get('demo-page-header')) {
  customElements.define('demo-page-header', DemoPageHeader);
}
