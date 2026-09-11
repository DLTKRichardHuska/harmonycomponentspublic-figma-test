import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { leftSidebarCss } from '../styles/generated/leftSidebarCss.js';
import {
  getLeftSidebarDefaults,
  sidebarItemId,
} from './leftSidebarDefaults.js';

const styles = createSheet(leftSidebarCss);

/**
 * Left navigation icon rail (open Shadow DOM).
 * Product-kit default sections; override via `sections` property.
 * Emits `left-sidebar-item-select` for ShellPanel wiring (no DOM mutation).
 */
export class HarmonyLeftSidebar extends HarmonyElement {
  static styles = [typographySheet, styles];

  static get observedAttributes() {
    return ['active-id', 'expanded', 'panel-open', 'inline'];
  }

  /** @type {import('./leftSidebarDefaults.js').SidebarSection[] | null} */
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

  /** @type {import('./leftSidebarDefaults.js').SidebarSection[] | null} */
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

  /** @returns {import('./leftSidebarDefaults.js').SidebarSection[]} */
  #resolvedSections() {
    if (this.#sectionsOverride) return this.#sectionsOverride;
    return getLeftSidebarDefaults();
  }

  #effectiveActiveId() {
    if (this.hasAttribute('active-id')) return this.activeId;
    return this.#uncontrolledActiveId;
  }

  #onClick = (e) => {
    const target = /** @type {HTMLElement | null} */ (e.target);
    const itemEl = target?.closest?.('[data-left-sidebar-item]');
    if (!itemEl || !this.shadowRoot?.contains(itemEl)) return;

    const id = itemEl.getAttribute('data-item-id') || '';
    const label = itemEl.getAttribute('data-panel-title') || itemEl.getAttribute('data-label') || '';
    const icon = itemEl.getAttribute('data-panel-icon') || itemEl.getAttribute('data-icon') || '';
    const href = itemEl.getAttribute('href') || '';
    const panelContentId = itemEl.getAttribute('data-panel-content-id') || undefined;
    const useGradientHeader = itemEl.getAttribute('data-use-gradient-header') === 'true';
    const panelTitle = itemEl.getAttribute('data-panel-title') || label;
    const panelIcon = itemEl.getAttribute('data-panel-icon') || icon || undefined;

    // Real navigation only when href is a non-hash URL and consumer didn't set panel metadata intent.
    // Defaults always carry panelTitle (= label), so preventDefault and emit.
    e.preventDefault();

    if (!this.hasAttribute('active-id')) {
      this.#uncontrolledActiveId = id;
      this.#syncActiveOnly();
    }

    this.emit('left-sidebar-item-select', {
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
    const items = this.shadowRoot?.querySelectorAll('[data-left-sidebar-item]') ?? [];
    for (const el of items) {
      const id = el.getAttribute('data-item-id') || '';
      const isActive = activeId ? id === activeId : el.hasAttribute('data-default-active');
      if (isActive) el.setAttribute('data-active', 'true');
      else el.removeAttribute('data-active');
      el.classList.toggle('left-sidebar__item--active', isActive && !activeId);
    }
  }

  /**
   * @param {import('./leftSidebarDefaults.js').SidebarItem} item
   * @param {string} id
   * @param {boolean} isActive
   */
  #itemHtml(item, id, isActive) {
    const panelTitle = item.panelTitle || item.label;
    const panelIcon = item.panelIcon || item.icon || '';
    const href = item.href || '#';
    const useGradient = item.useGradientHeader ? 'true' : 'false';
    const tag = item.href && item.href !== '#' ? 'a' : 'button';
    const tagAttrs =
      tag === 'a'
        ? `href="${escapeAttr(href)}"`
        : `type="button"`;

    let iconInner = '';
    if (item.isCustom && item.customSrc) {
      iconInner = `<img src="${escapeAttr(item.customSrc)}" alt="" class="left-sidebar__custom-icon" />`;
    } else if (item.icon) {
      iconInner = `<harmony-icon name="${escapeAttr(item.icon)}" size="md"></harmony-icon>`;
    }

    const activeClass = isActive && !this.hasAttribute('active-id') ? ' left-sidebar__item--active' : '';
    const dataActive = isActive ? ' data-active="true"' : '';
    const defaultActive = item.active ? ' data-default-active' : '';

    return `
      <${tag}
        ${tagAttrs}
        class="left-sidebar__item${activeClass}"
        part="item"
        data-left-sidebar-item
        data-item-id="${escapeAttr(id)}"
        data-label="${escapeAttr(item.label)}"
        data-icon="${escapeAttr(item.icon || '')}"
        data-panel-title="${escapeAttr(panelTitle)}"
        data-panel-icon="${escapeAttr(panelIcon)}"
        ${item.panelContentId ? `data-panel-content-id="${escapeAttr(item.panelContentId)}"` : ''}
        data-use-gradient-header="${useGradient}"
        ${dataActive}${defaultActive}
      >
        <harmony-tooltip text="${escapeAttr(item.label)}" position="right" class="left-sidebar__item-tooltip">
          <span class="left-sidebar__icon" part="icon">${iconInner}</span>
        </harmony-tooltip>
        <span class="left-sidebar__label" part="label">${escapeHtml(item.label)}</span>
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
            const id = sidebarItemId(item, sectionIndex, index);
            const isActive = controlled
              ? activeId === id
              : activeId
                ? activeId === id
                : Boolean(item.active);
            return this.#itemHtml(item, id, isActive);
          })
          .join('');
        return `<div class="left-sidebar__section" part="section">${itemsHtml}</div>`;
      })
      .join('');

    this.shadowRoot.innerHTML = `
      <nav class="left-sidebar__nav" part="nav" aria-label="Left navigation">
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
