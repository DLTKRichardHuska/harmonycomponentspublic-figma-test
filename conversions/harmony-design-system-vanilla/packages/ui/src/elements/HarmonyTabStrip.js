import { HarmonyElement } from './HarmonyElement.js';
import { tabStripSheet } from './tab-strip.js';

const VARIANTS = new Set(['default', 'compact', 'pill']);
const OVERFLOW_MODES = new Set(['auto', 'manual', 'none']);
const ICON_POSITIONS = new Set(['left', 'right', 'top']);
const MORE_RESERVED = 90;

/**
 * Tab strip Custom Element (open Shadow DOM).
 * Panels are consumer-owned outside this element.
 *
 * @typedef {{
 *   id: string;
 *   label: string;
 *   icon?: string;
 *   iconPosition?: 'left' | 'right' | 'top';
 *   active?: boolean;
 *   disabled?: boolean;
 *   href?: string;
 *   showOpenInNewWindow?: boolean;
 *   showClose?: boolean;
 *   showMenu?: boolean;
 * }} TabItem
 */
export class HarmonyTabStrip extends HarmonyElement {
  static styles = [tabStripSheet];
  static shadowRootInit = { mode: 'open' };

  static get observedAttributes() {
    return [
      'variant',
      'overflow-mode',
      'show-add-tab',
      'add-tab-label',
      'icon-position',
      'show-tab-open-in-new',
      'show-tab-close',
      'show-tab-overflow-menu',
      'selected',
    ];
  }

  /** @type {TabItem[]} */
  #tabs = [];
  /** @type {TabItem[]} */
  #overflowTabs = [];
  /** @type {ResizeObserver | null} */
  #resizeObserver = null;
  /** @type {boolean} */
  #bound = false;
  /** @type {number} */
  #moreMenuFocusIndex = -1;
  /** @type {number} */
  #perTabMenuFocusIndex = -1;

  connectedCallback() {
    this.#render();
    this.#bind();
    this.#setupOverflow();
    queueMicrotask(() => this.#calculateOverflow());
  }

  disconnectedCallback() {
    this.#teardownOverflow();
    this.#unbind();
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === 'selected') {
      this.#syncSelectedUi();
      this.#calculateOverflow();
      return;
    }
    this.#render();
    this.#setupOverflow();
    queueMicrotask(() => this.#calculateOverflow());
  }

  get variant() {
    const v = this.getAttribute('variant') || 'default';
    return VARIANTS.has(v) ? v : 'default';
  }

  set variant(value) {
    this.reflectString('variant', VARIANTS.has(value) ? value : 'default');
  }

  get overflowMode() {
    const v = this.getAttribute('overflow-mode') || 'auto';
    return OVERFLOW_MODES.has(v) ? v : 'auto';
  }

  set overflowMode(value) {
    this.reflectString('overflow-mode', OVERFLOW_MODES.has(value) ? value : 'auto');
  }

  get showAddTab() {
    return this.hasAttribute('show-add-tab');
  }

  set showAddTab(value) {
    this.reflectBoolean('show-add-tab', Boolean(value));
  }

  get addTabLabel() {
    return this.getAttribute('add-tab-label') || 'Add Tab';
  }

  set addTabLabel(value) {
    this.reflectString('add-tab-label', value || 'Add Tab');
  }

  get iconPosition() {
    const v = this.getAttribute('icon-position');
    return v && ICON_POSITIONS.has(v) ? v : null;
  }

  set iconPosition(value) {
    if (value == null || value === '') this.removeAttribute('icon-position');
    else this.reflectString('icon-position', ICON_POSITIONS.has(value) ? value : 'left');
  }

  get showTabOpenInNew() {
    return this.hasAttribute('show-tab-open-in-new');
  }

  set showTabOpenInNew(value) {
    this.reflectBoolean('show-tab-open-in-new', Boolean(value));
  }

  get showTabClose() {
    return this.hasAttribute('show-tab-close');
  }

  set showTabClose(value) {
    this.reflectBoolean('show-tab-close', Boolean(value));
  }

  get showTabOverflowMenu() {
    return this.hasAttribute('show-tab-overflow-menu');
  }

  set showTabOverflowMenu(value) {
    this.reflectBoolean('show-tab-overflow-menu', Boolean(value));
  }

  get selected() {
    return this.getAttribute('selected') || '';
  }

  set selected(value) {
    this.reflectString('selected', value);
  }

  /** @returns {TabItem[]} */
  get tabs() {
    return this.#tabs;
  }

  /** @param {TabItem[]} value */
  set tabs(value) {
    this.#tabs = Array.isArray(value) ? value.map((t) => ({ ...t })) : [];
    if (!this.hasAttribute('selected')) {
      const active = this.#tabs.find((t) => t.active && !t.disabled);
      if (active) this.setAttribute('selected', active.id);
    }
    if (this.isConnected) {
      this.#render();
      this.#setupOverflow();
      queueMicrotask(() => this.#calculateOverflow());
    }
  }

  /** @returns {TabItem[]} */
  get overflowTabs() {
    return this.#overflowTabs;
  }

  /** @param {TabItem[]} value */
  set overflowTabs(value) {
    this.#overflowTabs = Array.isArray(value) ? value.map((t) => ({ ...t })) : [];
    if (this.isConnected) {
      this.#render();
      this.#setupOverflow();
      queueMicrotask(() => this.#calculateOverflow());
    }
  }

  /** @returns {string} */
  #resolvedSelected() {
    const attr = this.selected;
    if (attr && this.#tabs.some((t) => t.id === attr && !t.disabled)) return attr;
    const active = this.#tabs.find((t) => t.active && !t.disabled);
    if (active) return active.id;
    const first = this.#tabs.find((t) => !t.disabled);
    return first?.id || '';
  }

  /** @param {TabItem} tab */
  #iconPos(tab) {
    return this.iconPosition || tab.iconPosition || 'left';
  }

  /** @param {TabItem} tab */
  #effFlags(tab) {
    const open =
      tab.showOpenInNewWindow !== undefined ? tab.showOpenInNewWindow : this.showTabOpenInNew;
    const close = tab.showClose !== undefined ? tab.showClose : this.showTabClose;
    const menu = tab.showMenu !== undefined ? tab.showMenu : this.showTabOverflowMenu;
    return { open, close, menu };
  }

  #root() {
    return this.shadowRoot;
  }

  #tabsEl() {
    return this.#root()?.querySelector('[data-tabstrip-tabs]');
  }

  #moreWrapper() {
    return this.#root()?.querySelector('[data-tabstrip-more]');
  }

  #moreButton() {
    return this.#root()?.querySelector('[data-tabstrip-more-btn]');
  }

  #moreLabel() {
    return this.#root()?.querySelector('[data-tabstrip-more-label]');
  }

  #dropdownItems() {
    return this.#root()?.querySelector('[data-tabstrip-dropdown-items]');
  }

  #addButton() {
    return this.#root()?.querySelector('[data-tabstrip-add]');
  }

  /** @returns {(HTMLButtonElement | HTMLAnchorElement)[]} */
  #tabButtons() {
    return Array.from(
      this.#root()?.querySelectorAll(
        '[data-tabstrip-tabs] [data-tabstrip-tab-cell] [role="tab"]',
      ) ?? [],
    );
  }

  /** @returns {HTMLElement[]} */
  #enabledTabButtons() {
    return this.#tabButtons().filter((el) => el.getAttribute('aria-disabled') !== 'true');
  }

  #closeAllPerTabMenus() {
    this.#root()?.querySelectorAll('[data-tabstrip-per-tab-menu].is-open').forEach((wrap) => {
      wrap.classList.remove('is-open');
      wrap.querySelector('[data-tabstrip-per-tab-menu-btn]')?.setAttribute('aria-expanded', 'false');
    });
  }

  #closeMoreMenu() {
    const wrap = this.#moreWrapper();
    const btn = this.#moreButton();
    wrap?.setAttribute('aria-expanded', 'false');
    btn?.setAttribute('aria-expanded', 'false');
  }

  /** @param {string} id */
  #selectTab(id) {
    if (!id) return;
    const tab = this.#tabs.find((t) => t.id === id);
    if (!tab || tab.disabled) return;
    if (this.selected !== id) this.setAttribute('selected', id);
    else this.#syncSelectedUi();
    this.emit('tab-select', { id });
  }

  #syncSelectedUi() {
    const selected = this.#resolvedSelected();
    for (const btn of this.#tabButtons()) {
      const id = btn.getAttribute('data-tab-id');
      const isActive = id === selected;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.tabIndex = isActive && btn.getAttribute('aria-disabled') !== 'true' ? 0 : -1;
    }
    this.#root()?.querySelectorAll('.tabstrip__dropdown-item').forEach((item) => {
      const id = item.querySelector('[data-tab-id]')?.getAttribute('data-tab-id');
      item.classList.toggle('is-active', id === selected);
    });
  }

  #bind() {
    if (this.#bound || !this.shadowRoot) return;
    this.#bound = true;
    this.shadowRoot.addEventListener('click', this.#onShadowClick);
    this.shadowRoot.addEventListener('keydown', this.#onShadowKeydown);
    document.addEventListener('click', this.#onDocumentClick);
  }

  #unbind() {
    if (!this.#bound) return;
    this.#bound = false;
    this.shadowRoot?.removeEventListener('click', this.#onShadowClick);
    this.shadowRoot?.removeEventListener('keydown', this.#onShadowKeydown);
    document.removeEventListener('click', this.#onDocumentClick);
  }

  #onDocumentClick = (e) => {
    const path = e.composedPath();
    if (path.includes(this)) return;
    this.#closeMoreMenu();
    this.#closeAllPerTabMenus();
  };

  #onShadowClick = (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (!(target instanceof Element)) return;

    const menuToggle = target.closest('[data-tabstrip-per-tab-menu-btn]');
    if (menuToggle) {
      e.stopPropagation();
      const wrap = menuToggle.closest('[data-tabstrip-per-tab-menu]');
      if (!wrap) return;
      const opening = !wrap.classList.contains('is-open');
      this.#closeAllPerTabMenus();
      this.#closeMoreMenu();
      if (opening) {
        wrap.classList.add('is-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        this.#perTabMenuFocusIndex = -1;
      }
      return;
    }

    const moreBtn = target.closest('[data-tabstrip-more-btn]');
    if (moreBtn) {
      e.stopPropagation();
      this.#closeAllPerTabMenus();
      const wrap = this.#moreWrapper();
      const isOpen = wrap?.getAttribute('aria-expanded') === 'true';
      const next = (!isOpen).toString();
      wrap?.setAttribute('aria-expanded', next);
      moreBtn.setAttribute('aria-expanded', next);
      this.#moreMenuFocusIndex = -1;
      return;
    }

    const addBtn = target.closest('[data-tabstrip-add]');
    if (addBtn) {
      e.stopPropagation();
      this.emit('tab-add');
      return;
    }

    const actionEl = target.closest('[data-action]');
    if (actionEl) {
      e.stopPropagation();
      const action = actionEl.getAttribute('data-action');
      const id = actionEl.getAttribute('data-tab-id') || '';
      this.#dispatchAction(action, id);
      this.#closeMoreMenu();
      this.#closeAllPerTabMenus();
      return;
    }

    const tabEl = target.closest('[role="tab"]');
    if (tabEl && tabEl.closest('[data-tabstrip-tabs]')) {
      if (tabEl.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
        return;
      }
      const id = tabEl.getAttribute('data-tab-id') || '';
      if (tabEl.tagName === 'A') {
        // Allow navigation; still emit select for consumers.
      } else {
        e.preventDefault();
      }
      this.#selectTab(id);
    }
  };

  /** @param {string | null} action @param {string} id */
  #dispatchAction(action, id) {
    if (action === 'select-tab') this.#selectTab(id);
    else if (action === 'close-tab') this.emit('tab-close', { id });
    else if (action === 'open-new-window') this.emit('tab-open-new', { id });
    else if (action === 'set-default') this.emit('tab-set-default', { id });
  }

  #onShadowKeydown = (e) => {
    const moreWrap = this.#moreWrapper();
    const isMoreOpen = moreWrap?.getAttribute('aria-expanded') === 'true';
    const openPerTab = this.#root()?.querySelector('[data-tabstrip-per-tab-menu].is-open');
    const dropdown = this.#root()?.querySelector('[data-tabstrip-dropdown]');
    const moreItems = dropdown
      ? Array.from(dropdown.querySelectorAll('[data-action]'))
      : [];
    const perTabItems = openPerTab
      ? Array.from(openPerTab.querySelectorAll('[data-tabstrip-per-tab-dropdown] [data-action]'))
      : [];

    if (e.key === 'Escape') {
      if (isMoreOpen) {
        e.preventDefault();
        this.#closeMoreMenu();
        this.#moreButton()?.focus();
      } else if (openPerTab) {
        e.preventDefault();
        this.#closeAllPerTabMenus();
        /** @type {HTMLElement | null} */ (
          openPerTab.querySelector('[data-tabstrip-per-tab-menu-btn]')
        )?.focus();
      }
      return;
    }

    if (isMoreOpen && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      this.#moreMenuFocusIndex = moveMenuIndex(this.#moreMenuFocusIndex, e.key, moreItems.length);
      moreItems[this.#moreMenuFocusIndex]?.focus();
      return;
    }

    if (openPerTab && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      this.#perTabMenuFocusIndex = moveMenuIndex(
        this.#perTabMenuFocusIndex,
        e.key,
        perTabItems.length,
      );
      perTabItems[this.#perTabMenuFocusIndex]?.focus();
      return;
    }

    if (isMoreOpen || openPerTab) return;

    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const tabs = this.#enabledTabButtons();
    if (!tabs.length) return;

    const active = this.shadowRoot?.activeElement;
    const currentIndex = tabs.indexOf(/** @type {HTMLElement} */ (active));
    if (currentIndex < 0 && e.key !== 'Home' && e.key !== 'End') return;

    e.preventDefault();
    let nextIndex = currentIndex;
    if (e.key === 'ArrowLeft') nextIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1;
    else if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = tabs.length - 1;

    const next = tabs[nextIndex];
    if (!next) return;
    next.focus();
    const id = next.getAttribute('data-tab-id') || '';
    this.#selectTab(id);
  };

  #setupOverflow() {
    this.#teardownOverflow();
    if (this.overflowMode !== 'auto') {
      this.#calculateOverflow();
      return;
    }
    const container = this.#tabsEl()?.parentElement;
    if (!container) return;
    this.#resizeObserver = new ResizeObserver(() => this.#calculateOverflow());
    this.#resizeObserver.observe(container);
  }

  #teardownOverflow() {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
  }

  #calculateOverflow() {
    const mode = this.overflowMode;
    const moreWrap = this.#moreWrapper();
    const moreLabel = this.#moreLabel();
    const dropdownItems = this.#dropdownItems();
    const tabsContainer = this.#tabsEl();

    if (mode === 'none' || !moreWrap) {
      if (moreWrap) moreWrap.style.display = 'none';
      return;
    }

    if (mode === 'manual') {
      const count = dropdownItems?.children.length ?? 0;
      moreWrap.style.display = count > 0 ? 'flex' : 'none';
      if (moreLabel) moreLabel.textContent = `More (${count})`;
      return;
    }

    if (!tabsContainer?.parentElement || !dropdownItems) return;

    const cells = /** @type {HTMLElement[]} */ (
      Array.from(tabsContainer.querySelectorAll('[data-tabstrip-tab-cell]'))
    );
    for (const cell of cells) cell.style.display = '';

    const parent = tabsContainer.parentElement;
    const addBtn = this.#addButton();
    const addWidth =
      addBtn && addBtn.offsetParent !== null
        ? addBtn.offsetWidth +
          parseInt(getComputedStyle(addBtn).marginLeft || '0', 10) +
          parseInt(getComputedStyle(addBtn).marginRight || '0', 10)
        : 0;
    const available = parent.offsetWidth - addWidth - MORE_RESERVED;
    const gap = parseInt(getComputedStyle(tabsContainer).gap || '0', 10) || 0;
    const selectedId = this.#resolvedSelected();

    /** @type {HTMLElement[]} */
    const overflowCells = [];
    let total = 0;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const w =
        cell.offsetWidth +
        parseInt(getComputedStyle(cell).marginLeft || '0', 10) +
        parseInt(getComputedStyle(cell).marginRight || '0', 10);
      const g = i > 0 ? gap : 0;
      if (total + w + g <= available) {
        total += w + g;
      } else {
        overflowCells.push(cell);
        cell.style.display = 'none';
      }
    }

    // Prefer keeping the selected tab visible when it would overflow.
    const selectedCell = cells.find((c) => c.getAttribute('data-tab-id') === selectedId);
    if (selectedCell && selectedCell.style.display === 'none') {
      selectedCell.style.display = '';
      const idx = overflowCells.indexOf(selectedCell);
      if (idx >= 0) overflowCells.splice(idx, 1);

      let used = 0;
      const visible = cells.filter((c) => c.style.display !== 'none');
      for (let i = 0; i < visible.length; i++) {
        const cell = visible[i];
        const w =
          cell.offsetWidth +
          parseInt(getComputedStyle(cell).marginLeft || '0', 10) +
          parseInt(getComputedStyle(cell).marginRight || '0', 10);
        used += w + (i > 0 ? gap : 0);
      }
      // Hide non-selected visible tabs from the end until selected fits.
      for (let i = visible.length - 1; i >= 0 && used > available; i--) {
        const cell = visible[i];
        if (cell === selectedCell) continue;
        const w =
          cell.offsetWidth +
          parseInt(getComputedStyle(cell).marginLeft || '0', 10) +
          parseInt(getComputedStyle(cell).marginRight || '0', 10);
        cell.style.display = 'none';
        overflowCells.push(cell);
        used -= w + gap;
      }
    }

    dropdownItems.innerHTML = '';
    for (const cell of overflowCells) {
      const tabId = cell.getAttribute('data-tab-id') || '';
      const tab = this.#tabs.find((t) => t.id === tabId);
      if (tab) dropdownItems.appendChild(this.#overflowItemEl(tab));
    }

    if (overflowCells.length > 0) {
      moreWrap.style.display = 'flex';
      if (moreLabel) moreLabel.textContent = `More (${overflowCells.length})`;
    } else {
      moreWrap.style.display = 'none';
      this.#closeMoreMenu();
    }
  }

  /** @param {TabItem} tab */
  #overflowItemEl(tab) {
    const selected = this.#resolvedSelected() === tab.id;
    const item = document.createElement('div');
    item.className = `tabstrip__dropdown-item${selected ? ' is-active' : ''}`;
    item.setAttribute('role', 'menuitem');

    const labelBtn = document.createElement('button');
    labelBtn.type = 'button';
    labelBtn.className = 'tabstrip__dropdown-item-label';
    labelBtn.setAttribute('data-tab-id', tab.id);
    labelBtn.setAttribute('data-action', 'select-tab');
    if (tab.icon) {
      labelBtn.innerHTML = `<harmony-icon name="${escapeAttr(tab.icon)}" size="sm" class="tabstrip__dropdown-item-icon"></harmony-icon><span></span>`;
      labelBtn.querySelector('span').textContent = tab.label;
    } else {
      const span = document.createElement('span');
      span.textContent = tab.label;
      labelBtn.append(span);
    }

    const actions = document.createElement('div');
    actions.className = 'tabstrip__dropdown-item-actions';
    actions.innerHTML = `
      <button type="button" class="tabstrip__dropdown-action-btn" data-tab-id="${escapeAttr(tab.id)}" data-action="open-new-window" aria-label="Open ${escapeAttr(tab.label)} in new window" title="Open in new window">
        <harmony-icon name="arrow-top-right-on-square" size="sm"></harmony-icon>
      </button>
      <button type="button" class="tabstrip__dropdown-action-btn" data-tab-id="${escapeAttr(tab.id)}" data-action="close-tab" aria-label="Close ${escapeAttr(tab.label)}" title="Close">
        <harmony-icon name="x-mark" size="sm"></harmony-icon>
      </button>`;

    item.append(labelBtn, actions);
    return item;
  }

  /** @param {TabItem} tab */
  #tabCellHtml(tab) {
    const selected = this.#resolvedSelected() === tab.id;
    const iconPos = this.#iconPos(tab);
    const iconMod =
      iconPos === 'top' ? 'tab--icon-top' : iconPos === 'right' ? 'tab--icon-right' : 'tab--icon-left';
    const { open, close, menu } = this.#effFlags(tab);
    const showToolbar = open || close || menu;
    const menuOpenInNew = menu && !open;
    const menuClose = menu && !close;
    const menuSetDefault = menu;

    const iconHtml = tab.icon
      ? iconPos === 'top'
        ? `<span class="tab__icon-wrapper"><harmony-icon name="${escapeAttr(tab.icon)}" size="sm" class="tab__icon"></harmony-icon></span>`
        : `<harmony-icon name="${escapeAttr(tab.icon)}" size="sm" class="tab__icon"></harmony-icon>`
      : '';

    const content =
      iconPos === 'right'
        ? `<span class="tab__label">${escapeHtml(tab.label)}</span>${iconHtml}`
        : `${iconHtml}<span class="tab__label">${escapeHtml(tab.label)}</span>`;

    const classes = ['tab', selected && 'is-active', tab.disabled && 'tab--disabled', iconMod]
      .filter(Boolean)
      .join(' ');
    const tabIndex = selected && !tab.disabled ? 0 : -1;
    const common = `role="tab" aria-selected="${selected ? 'true' : 'false'}" aria-disabled="${tab.disabled ? 'true' : 'false'}" class="${classes}" tabindex="${tabIndex}" data-tab-id="${escapeAttr(tab.id)}" data-tab-icon="${escapeAttr(tab.icon || '')}"`;

    const control = tab.href
      ? `<a href="${escapeAttr(tab.href)}" ${common}>${content}</a>`
      : `<button type="button" ${common}${tab.disabled ? ' disabled' : ''}>${content}</button>`;

    let toolbar = '';
    if (showToolbar) {
      const openBtn = open
        ? `<button type="button" class="tabstrip__tab-action-btn" data-tab-id="${escapeAttr(tab.id)}" data-action="open-new-window" aria-label="Open ${escapeAttr(tab.label)} in new window" title="Open in new window"><harmony-icon name="arrow-top-right-on-square" size="sm"></harmony-icon></button>`
        : '';
      const closeBtn = close
        ? `<button type="button" class="tabstrip__tab-action-btn" data-tab-id="${escapeAttr(tab.id)}" data-action="close-tab" aria-label="Close ${escapeAttr(tab.label)}" title="Close"><harmony-icon name="x-mark" size="sm"></harmony-icon></button>`
        : '';
      let menuHtml = '';
      if (menu) {
        const items = [
          menuOpenInNew
            ? `<button type="button" class="tabstrip__dropdown-menu-item" role="menuitem" data-tab-id="${escapeAttr(tab.id)}" data-action="open-new-window">Open in new window</button>`
            : '',
          menuClose
            ? `<button type="button" class="tabstrip__dropdown-menu-item" role="menuitem" data-tab-id="${escapeAttr(tab.id)}" data-action="close-tab">Close tab</button>`
            : '',
          menuSetDefault
            ? `<button type="button" class="tabstrip__dropdown-menu-item" role="menuitem" data-tab-id="${escapeAttr(tab.id)}" data-action="set-default">Set as default</button>`
            : '',
        ].join('');
        menuHtml = `<div class="tabstrip__tab-menu-wrapper" data-tabstrip-per-tab-menu>
          <button type="button" class="tabstrip__tab-action-btn" aria-haspopup="true" aria-expanded="false" aria-label="More actions for ${escapeAttr(tab.label)}" data-tabstrip-per-tab-menu-btn>
            <harmony-icon name="ellipsis-vertical" size="sm"></harmony-icon>
          </button>
          <div class="tabstrip__dropdown tabstrip__dropdown--per-tab" role="menu" aria-label="${escapeAttr(tab.label)} tab actions" data-tabstrip-per-tab-dropdown>${items}</div>
        </div>`;
      }
      toolbar = `<div class="tabstrip__tab-toolbar" data-tabstrip-tab-toolbar>${openBtn}${closeBtn}${menuHtml}</div>`;
    }

    return `<div class="tabstrip__tab-cell" data-tabstrip-tab-cell data-tab-id="${escapeAttr(tab.id)}">${control}${toolbar}</div>`;
  }

  #render() {
    if (!this.shadowRoot) return;
    const variant = this.variant;
    const variantMod =
      variant === 'compact' ? 'tabstrip--compact' : variant === 'pill' ? 'tabstrip--pill' : '';
    const mode = this.overflowMode;
    const rootClass = ['tabstrip', variantMod].filter(Boolean).join(' ');

    const cells = this.#tabs.map((t) => this.#tabCellHtml(t)).join('');
    const addHtml = this.showAddTab
      ? `<button type="button" class="tab tabstrip__add" aria-label="${escapeAttr(this.addTabLabel)}" data-tabstrip-add>
          <harmony-icon name="plus" size="sm"></harmony-icon>
          <span>${escapeHtml(this.addTabLabel)}</span>
        </button>`
      : '';

    let moreHtml = '';
    if (mode !== 'none') {
      const manualItems =
        mode === 'manual'
          ? this.#overflowTabs.map((t) => this.#overflowItemEl(t).outerHTML).join('')
          : '';
      moreHtml = `<div class="tabstrip__more-wrapper" data-tabstrip-more style="display: none;" aria-expanded="false">
        <button type="button" class="tab tabstrip__more" aria-label="Show more tabs" aria-haspopup="true" aria-expanded="false" data-tabstrip-more-btn>
          <span data-tabstrip-more-label>More (0)</span>
          <harmony-icon name="ellipsis-horizontal" size="sm"></harmony-icon>
        </button>
        <div class="tabstrip__dropdown" role="menu" aria-label="Overflow tabs menu" data-tabstrip-dropdown>
          <div class="tabstrip__dropdown-section" data-tabstrip-dropdown-items>${manualItems}</div>
        </div>
      </div>`;
    }

    this.shadowRoot.innerHTML = `
      <div class="${rootClass}" data-tabstrip data-variant="${escapeAttr(variant)}" data-overflow-mode="${escapeAttr(mode)}">
        <nav role="tablist" aria-label="Tabs" class="tabstrip__nav">
          <div class="tabstrip__container">
            <div class="tabstrip__tabs" data-tabstrip-tabs>${cells}</div>
            ${addHtml}
            ${moreHtml}
          </div>
        </nav>
      </div>`;
  }
}

/**
 * @param {number} current
 * @param {string} key
 * @param {number} length
 */
function moveMenuIndex(current, key, length) {
  if (!length) return -1;
  if (key === 'ArrowDown') return (current + 1) % length;
  if (key === 'ArrowUp') return current <= 0 ? length - 1 : current - 1;
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  return current;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/'/g, '&#39;');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
