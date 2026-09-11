import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { rightSidebarCss } from '../styles/generated/rightSidebarCss.js';
import {
  getRightSidebarDefaults,
  rightSidebarItemId,
  isHarmonyIconName,
} from './rightSidebarDefaults.js';

const styles = createSheet(rightSidebarCss);

/**
 * Right navigation icon rail (open Shadow DOM).
 * Product-kit default sections (Dela AI first); override via `sections` property.
 * Emits `right-sidebar-item-select` for ShellPanel wiring (no DOM mutation).
 */
export class HarmonyRightSidebar extends HarmonyElement {
  static styles = [typographySheet, styles];

  static get observedAttributes() {
    return ['active-id', 'expanded', 'panel-open', 'inline'];
  }

  /** @type {import('./rightSidebarDefaults.js').SidebarSection[] | null} */
  #sectionsOverride = null;
  /** @type {MutationObserver | null} */
  #styleObserver = null;
  /** @type {string} */
  #uncontrolledActiveId = '';

  connectedCallback() {
    this.#render();
    this.#observeProductStyles();
    this.shadowRoot?.addEventListener('click', this.#onClick);
  }

  disconnectedCallback() {
    this.#styleObserver?.disconnect();
    this.#styleObserver = null;
    this.shadowRoot?.removeEventListener('click', this.#onClick);
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#render();
  }

  get activeId() {
    return this.getAttribute('active-id') || '';
  }

  set activeId(v) {
    this.reflectString('active-id', v);
  }

  get expanded() {
    return this.hasAttribute('expanded');
  }

  set expanded(v) {
    this.reflectBoolean('expanded', Boolean(v));
  }

  get panelOpen() {
    return this.hasAttribute('panel-open');
  }

  set panelOpen(v) {
    this.reflectBoolean('panel-open', Boolean(v));
  }

  get inline() {
    return this.hasAttribute('inline');
  }

  set inline(v) {
    this.reflectBoolean('inline', Boolean(v));
  }

  /** @type {import('./rightSidebarDefaults.js').SidebarSection[] | null} */
  get sections() {
    return this.#sectionsOverride;
  }

  set sections(v) {
    this.#sectionsOverride = Array.isArray(v) ? v : null;
    if (this.isConnected) this.#render();
  }

  #observeProductStyles() {
    const link = document.getElementById('harmony-product-styles');
    if (!link) return;
    this.#styleObserver = new MutationObserver(() => {
      if (!this.#sectionsOverride) this.#render();
    });
    this.#styleObserver.observe(link, { attributes: true, attributeFilter: ['href'] });
  }

  /** @returns {import('./rightSidebarDefaults.js').SidebarSection[]} */
  #resolvedSections() {
    if (this.#sectionsOverride) return this.#sectionsOverride;
    return getRightSidebarDefaults();
  }

  #effectiveActiveId() {
    if (this.hasAttribute('active-id')) return this.activeId;
    return this.#uncontrolledActiveId;
  }

  #onClick = (e) => {
    const target = /** @type {HTMLElement | null} */ (e.target);
    const itemEl = target?.closest?.('[data-right-sidebar-item]');
    if (!itemEl || !this.shadowRoot?.contains(itemEl)) return;

    const id = itemEl.getAttribute('data-item-id') || '';
    const label = itemEl.getAttribute('data-label') || '';
    const icon = itemEl.getAttribute('data-panel-icon') || itemEl.getAttribute('data-icon') || '';
    const href = itemEl.getAttribute('href') || '';
    const panelContentId = itemEl.getAttribute('data-panel-content-id') || undefined;
    const panelTitle = itemEl.getAttribute('data-panel-title') || label;
    const panelIcon = itemEl.getAttribute('data-panel-icon') || icon || undefined;
    const isDela =
      label === 'Dela AI' || itemEl.querySelector('.right-sidebar__dela-logo') !== null;
    const useGradientHeader =
      itemEl.getAttribute('data-use-gradient-header') === 'true' || isDela;

    e.preventDefault();

    if (!this.hasAttribute('active-id')) {
      this.#uncontrolledActiveId = id;
      this.#syncActiveOnly();
    }

    this.emit('right-sidebar-item-select', {
      id,
      label,
      icon: icon || undefined,
      href: href && href !== '#' ? href : undefined,
      panelTitle,
      panelIcon,
      panelContentId,
      useGradientHeader: useGradientHeader || undefined,
    });
  };

  #syncActiveOnly() {
    const activeId = this.#effectiveActiveId();
    const items = this.shadowRoot?.querySelectorAll('[data-right-sidebar-item]') ?? [];
    for (const el of items) {
      const id = el.getAttribute('data-item-id') || '';
      const isActive = activeId ? id === activeId : el.hasAttribute('data-default-active');
      if (isActive) el.setAttribute('data-active', 'true');
      else el.removeAttribute('data-active');
    }
  }

  /**
   * @param {import('./rightSidebarDefaults.js').SidebarItem} item
   */
  #iconInner(item) {
    if (item.isCustom && item.customSrc) {
      if (item.customSrcActive) {
        if (isHarmonyIconName(item.customSrc)) {
          return `
            <harmony-icon name="${escapeAttr(item.customSrc)}" size="lg" class="right-sidebar__dela-logo right-sidebar__dela-logo--default"></harmony-icon>
            <harmony-icon name="${escapeAttr(item.customSrcActive)}" size="lg" class="right-sidebar__dela-logo right-sidebar__dela-logo--active"></harmony-icon>
          `;
        }
        return `
          <img src="${escapeAttr(item.customSrc)}" alt="" class="right-sidebar__dela-logo right-sidebar__dela-logo--default" />
          <img src="${escapeAttr(item.customSrcActive)}" alt="" class="right-sidebar__dela-logo right-sidebar__dela-logo--active" />
        `;
      }
      if (isHarmonyIconName(item.customSrc)) {
        return `<harmony-icon name="${escapeAttr(item.customSrc)}" size="lg" class="right-sidebar__dela-logo"></harmony-icon>`;
      }
      return `<img src="${escapeAttr(item.customSrc)}" alt="" class="right-sidebar__dela-logo" />`;
    }
    if (item.icon) {
      return `<harmony-icon name="${escapeAttr(item.icon)}" size="md"></harmony-icon>`;
    }
    return '';
  }

  /**
   * @param {import('./rightSidebarDefaults.js').SidebarItem} item
   * @param {string} id
   * @param {boolean} isActive
   */
  #itemHtml(item, id, isActive) {
    const panelTitle = item.panelTitle || item.label;
    const panelIcon = item.panelIcon || item.icon || '';
    const href = item.href || '#';
    const useGradient = item.useGradientHeader ? 'true' : 'false';
    const tag = item.href && item.href !== '#' ? 'a' : 'button';
    const tagAttrs = tag === 'a' ? `href="${escapeAttr(href)}"` : `type="button"`;
    const dataActive = isActive ? ' data-active="true"' : '';
    const defaultActive = item.active ? ' data-default-active' : '';

    return `
      <${tag}
        ${tagAttrs}
        class="right-sidebar__item"
        part="item"
        data-right-sidebar-item
        data-item-id="${escapeAttr(id)}"
        data-label="${escapeAttr(item.label)}"
        data-icon="${escapeAttr(item.icon || '')}"
        data-panel-title="${escapeAttr(panelTitle)}"
        data-panel-icon="${escapeAttr(panelIcon)}"
        ${item.panelContentId ? `data-panel-content-id="${escapeAttr(item.panelContentId)}"` : ''}
        data-use-gradient-header="${useGradient}"
        ${dataActive}${defaultActive}
      >
        <span class="right-sidebar__label" part="label">${escapeHtml(item.label)}</span>
        <harmony-tooltip text="${escapeAttr(item.label)}" position="left" class="right-sidebar__item-tooltip">
          <span class="right-sidebar__icon" part="icon">${this.#iconInner(item)}</span>
        </harmony-tooltip>
      </${tag}>
    `;
  }

  #render() {
    const sections = this.#resolvedSections();
    const controlled = this.hasAttribute('active-id');
    const activeId = this.#effectiveActiveId();

    const sectionsHtml = sections
      .map((section, sectionIndex) => {
        const itemsHtml = (section.items || [])
          .map((item, index) => {
            const id = rightSidebarItemId(item, sectionIndex, index);
            const isActive = controlled
              ? activeId === id
              : activeId
                ? activeId === id
                : Boolean(item.active);
            return this.#itemHtml(item, id, isActive);
          })
          .join('');
        return `<div class="right-sidebar__section" part="section">${itemsHtml}</div>`;
      })
      .join('');

    this.shadowRoot.innerHTML = `
      <nav class="right-sidebar__nav" part="nav" aria-label="Right navigation">
        ${sectionsHtml}
      </nav>
    `;
  }
}

/**
 * @param {string} s
 */
function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * @param {string} s
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
