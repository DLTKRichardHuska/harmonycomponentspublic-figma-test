import { HarmonyElement } from './HarmonyElement.js';

const HEADER_VARIANTS = new Set(['gray', 'white', 'none']);
const VARIANTS = new Set(['default', 'commandCenter']);
const SORT_DIRS = new Set(['asc', 'desc']);
const MAX_DEPTH = 4;

const MANAGED_HOST = new Set([
  'table-wrapper',
  'table-wrapper--command-center',
  'table-wrapper--has-command-center-toolbar',
  'table-wrapper--has-command-center-aside',
]);

const MANAGED_TABLE = new Set([
  'table--header-white',
  'table--header-none',
  'table--command-center',
  'table--striped',
  'table--reorderable',
  'table--grouped',
]);

const MARK = 'data-harmony-table-managed';
const INJECTED = 'data-harmony-table-injected';

/**
 * Light-DOM hybrid table: host is `.table-wrapper`; inner unclassed `<table>`
 * gets modifier classes only. Maps slots into BEM chrome and wires sort /
 * reorder / grouped / selection / Command Center behaviors.
 */
export class HarmonyTable extends HarmonyElement {
  static shadowRootInit = null;

  static get observedAttributes() {
    return [
      'header-variant',
      'variant',
      'striped',
      'reorderable',
      'grouped',
      'grouped-default-expanded',
      'sort-column',
      'sort-direction',
      'columns',
      'selected-row-ids',
    ];
  }

  /** @type {MutationObserver | null} */
  #childObserver = null;
  /** @type {boolean} */
  #syncing = false;
  /** @type {Set<string>} */
  #expandedIds = new Set();
  /** @type {HTMLTableRowElement | null} */
  #draggedRow = null;
  /** @type {boolean} */
  #behaviorsBound = false;

  connectedCallback() {
    this.#ensureCcStripedDefault();
    this.#initExpandedFromAttr();
    this.#sync();
    this.#bindBehaviors();
    this.#childObserver = new MutationObserver(() => {
      if (this.#syncing) return;
      this.#sync();
    });
    this.#childObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['slot'],
    });
  }

  disconnectedCallback() {
    this.#childObserver?.disconnect();
    this.#childObserver = null;
    this.#unbindBehaviors();
  }

  attributeChangedCallback(name) {
    if (!this.isConnected || this.#syncing) return;
    if (name === 'variant') this.#ensureCcStripedDefault();
    if (name === 'grouped-default-expanded' && this.#expandedIds.size === 0) {
      this.#initExpandedFromAttr();
    }
    this.#sync();
  }

  /* ---- attrs / props ---- */

  get headerVariant() {
    const v = this.getAttribute('header-variant') || 'gray';
    return HEADER_VARIANTS.has(v) ? v : 'gray';
  }

  set headerVariant(value) {
    this.reflectString('header-variant', HEADER_VARIANTS.has(value) ? value : 'gray');
  }

  get variant() {
    const v = this.getAttribute('variant') || 'default';
    return VARIANTS.has(v) ? v : 'default';
  }

  set variant(value) {
    this.reflectString('variant', VARIANTS.has(value) ? value : 'default');
  }

  get striped() {
    const raw = this.getAttribute('striped');
    if (raw === 'false') return false;
    return this.hasAttribute('striped');
  }

  set striped(value) {
    if (value === false || value === 'false') this.setAttribute('striped', 'false');
    else this.reflectBoolean('striped', Boolean(value));
  }

  get reorderable() {
    return this.hasAttribute('reorderable');
  }

  set reorderable(value) {
    this.reflectBoolean('reorderable', Boolean(value));
  }

  get grouped() {
    return this.hasAttribute('grouped');
  }

  set grouped(value) {
    this.reflectBoolean('grouped', Boolean(value));
  }

  get groupedDefaultExpanded() {
    return this.getAttribute('grouped-default-expanded') || '';
  }

  set groupedDefaultExpanded(value) {
    this.reflectString('grouped-default-expanded', value);
  }

  get sortColumn() {
    return this.getAttribute('sort-column');
  }

  set sortColumn(value) {
    this.reflectString('sort-column', value);
  }

  get sortDirection() {
    const d = this.getAttribute('sort-direction');
    return SORT_DIRS.has(d) ? d : null;
  }

  set sortDirection(value) {
    if (value == null || value === '') this.removeAttribute('sort-direction');
    else this.reflectString('sort-direction', SORT_DIRS.has(value) ? value : null);
  }

  /** @returns {Array<{key:string,label:string,align?:string,sortable?:boolean,filterable?:boolean}>} */
  get columns() {
    const raw = this.getAttribute('columns');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  set columns(value) {
    if (value == null || (Array.isArray(value) && value.length === 0)) {
      this.removeAttribute('columns');
    } else {
      this.setAttribute('columns', JSON.stringify(value));
    }
  }

  get selectedRowIds() {
    const raw = this.getAttribute('selected-row-ids') || '';
    return raw
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  set selectedRowIds(value) {
    const list = Array.isArray(value) ? value : String(value || '').split(/[\s,]+/);
    const cleaned = list.map((s) => String(s).trim()).filter(Boolean);
    this.reflectString('selected-row-ids', cleaned.join(','));
  }

  /* ---- public methods ---- */

  expandAll() {
    const tbody = this.#tbody();
    if (!tbody) return;
    for (const row of tbody.querySelectorAll('tr[data-has-children]')) {
      const id = row.getAttribute('data-row-id');
      if (id) this.#expandedIds.add(id);
    }
    this.#applyGroupedVisibility();
    this.emit('expand-change', { expandedIds: this.getExpanded() });
  }

  collapseAll() {
    this.#expandedIds.clear();
    this.#applyGroupedVisibility();
    this.emit('expand-change', { expandedIds: [] });
  }

  /** @param {string[]} ids */
  setExpanded(ids) {
    this.#expandedIds = new Set((ids || []).filter(Boolean));
    this.#applyGroupedVisibility();
    this.emit('expand-change', { expandedIds: this.getExpanded() });
  }

  getExpanded() {
    return [...this.#expandedIds];
  }

  getSelected() {
    const tbody = this.#tbody();
    if (!tbody) return [];
    const ids = [];
    for (const row of tbody.querySelectorAll('tr.table-row--selected, tr.table-row--command-center-selected')) {
      const id = row.getAttribute('data-row-id');
      ids.push(id || String([...tbody.querySelectorAll('tr')].indexOf(row)));
    }
    return ids;
  }

  getOrder() {
    const tbody = this.#tbody();
    if (!tbody) return [];
    return [...tbody.querySelectorAll('tr:not(.table-row--total)')].map((row, i) => {
      return row.getAttribute('data-row-id') || String(i);
    });
  }

  /* ---- internals ---- */

  #ensureCcStripedDefault() {
    if (this.variant === 'commandCenter' && !this.hasAttribute('striped')) {
      this.setAttribute('striped', '');
    }
  }

  #initExpandedFromAttr() {
    const raw = this.groupedDefaultExpanded;
    if (!raw) return;
    for (const id of raw.split(/[\s,]+/)) {
      const t = id.trim();
      if (t) this.#expandedIds.add(t);
    }
  }

  #isCommandCenter() {
    return this.variant === 'commandCenter';
  }

  #tableEl() {
    return this.querySelector(`table[${MARK}]`) || this.querySelector('table');
  }

  #tbody() {
    return this.#tableEl()?.querySelector('tbody') || null;
  }

  #thead() {
    return this.#tableEl()?.querySelector('thead') || null;
  }

  #bindBehaviors() {
    if (this.#behaviorsBound) return;
    this.#behaviorsBound = true;
    this.addEventListener('change', this.#onCheckboxChange);
    this.addEventListener('click', this.#onClick);
  }

  #unbindBehaviors() {
    if (!this.#behaviorsBound) return;
    this.#behaviorsBound = false;
    this.removeEventListener('change', this.#onCheckboxChange);
    this.removeEventListener('click', this.#onClick);
  }

  #onCheckboxChange = (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const native = t instanceof HTMLInputElement && t.type === 'checkbox' ? t : null;
    const harmony = t.closest?.('harmony-checkbox') || (t.tagName === 'HARMONY-CHECKBOX' ? t : null);
    if (!native && !harmony) return;

    const control = harmony || native;
    const table = this.#tableEl();
    if (!table || !table.contains(control)) return;

    const checked = harmony
      ? /** @type {HTMLElement & {checked?: boolean}} */ (harmony).checked
      : /** @type {HTMLInputElement} */ (native).checked;

    const inThead = Boolean(control.closest('thead'));
    const name = harmony
      ? harmony.getAttribute('name')
      : /** @type {HTMLInputElement} */ (native).name;
    const isSelectAll = name === 'select-all' || inThead;

    if (isSelectAll) {
      const tbody = this.#tbody();
      if (!tbody) return;
      for (const row of tbody.querySelectorAll('tr')) {
        this.#setRowCheckbox(row, checked);
        row.classList.toggle('table-row--selected', checked);
      }
    } else {
      const row = control.closest('tr');
      if (row && row.closest('tbody')) {
        row.classList.toggle('table-row--selected', checked);
      }
    }
    this.#reflectSelectedAttr();
    this.emit('selection-change', { selectedIds: this.getSelected() });
  };

  #setRowCheckbox(row, checked) {
    for (const input of row.querySelectorAll('input[type="checkbox"]')) {
      if (input instanceof HTMLInputElement) input.checked = checked;
    }
    for (const hc of row.querySelectorAll('harmony-checkbox')) {
      if ('checked' in hc) /** @type {HTMLElement & {checked: boolean}} */ (hc).checked = checked;
    }
  }

  #reflectSelectedAttr() {
    const ids = this.getSelected();
    this.#syncing = true;
    try {
      this.reflectString('selected-row-ids', ids.length ? ids.join(',') : null);
    } finally {
      this.#syncing = false;
    }
  }

  #onClick = (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const sortBtn = t.closest('.table__sort-header, .table__cc-header-btn');
    if (sortBtn && this.contains(sortBtn)) {
      if (sortBtn.getAttribute('data-action') === 'filter') {
        const key = sortBtn.getAttribute('data-column-key');
        if (key) this.emit('filter-click', { key });
        return;
      }
      const key = sortBtn.getAttribute('data-column-key');
      if (key) this.#toggleSort(key);
      return;
    }

    const expandBtn = t.closest('.table__expand-btn');
    if (expandBtn && this.contains(expandBtn)) {
      const row = expandBtn.closest('tr');
      const id = row?.getAttribute('data-row-id');
      if (id) {
        if (this.#expandedIds.has(id)) this.#expandedIds.delete(id);
        else this.#expandedIds.add(id);
        this.#applyGroupedVisibility();
        this.emit('expand-change', { expandedIds: this.getExpanded() });
      }
      return;
    }

    if (this.#isCommandCenter()) {
      const row = t.closest('tbody tr');
      if (
        row &&
        this.contains(row) &&
        !t.closest('a, button, input, label, harmony-checkbox, harmony-button, select, textarea')
      ) {
        const tbody = this.#tbody();
        tbody?.querySelectorAll('tr.table-row--command-center-selected').forEach((r) => {
          r.classList.remove('table-row--command-center-selected');
        });
        row.classList.add('table-row--command-center-selected');
        const rowId = row.getAttribute('data-row-id');
        this.emit('row-select', { rowId, row });
      }
    }
  };

  #toggleSort(key) {
    const current = this.sortColumn;
    const dir = this.sortDirection;
    let nextCol = key;
    let nextDir = 'asc';
    if (current === key) {
      if (dir === 'asc') nextDir = 'desc';
      else if (dir === 'desc') {
        nextCol = null;
        nextDir = null;
      }
    }
    this.#syncing = true;
    try {
      this.reflectString('sort-column', nextCol);
      this.reflectString('sort-direction', nextDir);
    } finally {
      this.#syncing = false;
    }
    this.#renderSortHeader();
    this.emit('sort-change', { key: nextCol, direction: nextDir });
  }

  /* ---- structure sync ---- */

  #sync() {
    this.#syncing = true;
    this.#childObserver?.disconnect();
    try {
      const content = this.#collectContent();
      this.#rebuildStructure(content);
      this.#syncHostClasses(content);
      this.#syncTableClasses();
      this.#injectReorderable();
      this.#injectGrouped();
      this.#applyGroupedVisibility();
      this.#applySelectedFromAttr();
    } finally {
      this.#syncing = false;
      if (this.isConnected && this.#childObserver) {
        this.#childObserver.observe(this, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['slot'],
        });
      }
    }
  }

  #collectContent() {
    const filterBar = [];
    const titleContent = [];
    const titleIcons = [];
    const actionBar = [];
    const ccToolbar = [];
    const ccAside = [];
    const headerRows = [];
    const bodyRows = [];
    const footerRows = [];

    const takeFromManaged = (node) => {
      if (!(node instanceof HTMLElement) || !node.hasAttribute(MARK)) return;
      if (node.classList.contains('table__filter-bar')) {
        for (const c of [...node.childNodes]) this.#pushConsumer(c, filterBar);
      } else if (node.classList.contains('table__title-bar')) {
        const content = node.querySelector('.table__title-bar-content');
        const icons = node.querySelector('.table__title-bar-icons');
        if (content) {
          for (const c of [...content.childNodes]) {
            if (c instanceof HTMLElement && c.classList.contains('table__title-bar-icons')) continue;
            this.#pushConsumer(c, titleContent);
          }
        }
        if (icons) {
          for (const c of [...icons.childNodes]) this.#pushConsumer(c, titleIcons);
        }
      } else if (node.classList.contains('table__action-bar')) {
        for (const c of [...node.childNodes]) this.#pushConsumer(c, actionBar);
      } else if (node.classList.contains('table__command-center-toolbar')) {
        for (const c of [...node.childNodes]) this.#pushConsumer(c, ccToolbar);
      } else if (node.classList.contains('command-center-canvas')) {
        const toolbar = node.querySelector('.table__command-center-toolbar');
        const aside = node.querySelector('.command-center-canvas__aside');
        const main = node.querySelector('.command-center-canvas__main');
        if (toolbar) for (const c of [...toolbar.childNodes]) this.#pushConsumer(c, ccToolbar);
        if (aside) for (const c of [...aside.childNodes]) this.#pushConsumer(c, ccAside);
        if (main) {
          for (const child of [...main.children]) takeFromManaged(child);
          const table = main.querySelector('table');
          if (table) this.#collectTableRows(table, headerRows, bodyRows, footerRows);
        }
      } else if (node.tagName === 'TABLE') {
        this.#collectTableRows(node, headerRows, bodyRows, footerRows);
      }
    };

    for (const node of [...this.childNodes]) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }
      if (node.hasAttribute(MARK)) {
        takeFromManaged(node);
        continue;
      }
      const slot = node.getAttribute('slot') || '';
      if (slot === 'filter-bar') filterBar.push(node);
      else if (slot === 'title-bar-content') titleContent.push(node);
      else if (slot === 'title-bar-icons') titleIcons.push(node);
      else if (slot === 'action-bar') actionBar.push(node);
      else if (slot === 'command-center-toolbar') ccToolbar.push(node);
      else if (slot === 'command-center-aside') ccAside.push(node);
      else if (slot === 'header') {
        if (node.tagName === 'TR') headerRows.push(node);
        else for (const tr of node.querySelectorAll(':scope > tr')) headerRows.push(tr);
      } else if (slot === 'body') {
        if (node.tagName === 'TR') bodyRows.push(node);
        else for (const tr of node.querySelectorAll(':scope > tr')) bodyRows.push(tr);
      } else if (node.tagName === 'TR') {
        bodyRows.push(node);
      } else if (node.tagName === 'TABLE') {
        this.#collectTableRows(node, headerRows, bodyRows, footerRows);
      } else if (node.tagName === 'THEAD') {
        for (const tr of node.querySelectorAll(':scope > tr')) headerRows.push(tr);
      } else if (node.tagName === 'TBODY') {
        for (const tr of node.querySelectorAll(':scope > tr')) bodyRows.push(tr);
      } else if (node.tagName === 'TFOOT') {
        for (const tr of node.querySelectorAll(':scope > tr')) footerRows.push(tr);
      }
    }

    return {
      filterBar,
      titleContent,
      titleIcons,
      actionBar,
      ccToolbar,
      ccAside,
      headerRows,
      bodyRows,
      footerRows,
    };
  }

  #pushConsumer(node, bucket) {
    if (node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement) {
      if (node.hasAttribute(MARK) || node.hasAttribute(INJECTED)) return;
      bucket.push(node);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      bucket.push(node);
    }
  }

  #collectTableRows(table, headerRows, bodyRows, footerRows) {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    if (thead) {
      for (const tr of [...thead.querySelectorAll(':scope > tr')]) {
        this.#stripInjected(tr);
        headerRows.push(tr);
      }
    }
    if (tbody) {
      for (const tr of [...tbody.querySelectorAll(':scope > tr')]) {
        this.#stripInjected(tr);
        bodyRows.push(tr);
      }
    }
    if (tfoot && footerRows) {
      for (const tr of [...tfoot.querySelectorAll(':scope > tr')]) {
        this.#stripInjected(tr);
        footerRows.push(tr);
      }
    }
  }

  #stripInjected(row) {
    for (const cell of [...row.querySelectorAll(`[${INJECTED}]`)]) {
      cell.remove();
    }
    // Unwrap CC project-id inner if present so re-inject can rebuild
    const inner = row.querySelector('.table__cc-project-id-inner');
    if (inner && inner.parentElement) {
      const td = inner.parentElement;
      const text = inner.querySelector('.table__cc-project-id-text, a.text-link, a');
      const keep = [];
      if (text) keep.push(...text.childNodes);
      else {
        for (const c of [...inner.childNodes]) {
          if (c instanceof HTMLElement && (
            c.classList.contains('table__cc-inline-expand') ||
            c.classList.contains('table__cc-inline-expand-gutter')
          )) continue;
          keep.push(c);
        }
      }
      td.replaceChildren(...keep);
      td.classList.remove('table__cc-project-id-cell');
      td.style.paddingLeft = '';
    }
  }

  #rebuildStructure(content) {
    const {
      filterBar,
      titleContent,
      titleIcons,
      actionBar,
      ccToolbar,
      ccAside,
      headerRows,
      bodyRows,
      footerRows,
    } = content;

    const isCC = this.#isCommandCenter();
    const columns = this.columns;
    const useSortHeader = columns.length > 0;
    const hasAside = isCC && ccAside.length > 0;
    const hasToolbar = isCC && ccToolbar.length > 0;
    const hasFilter = filterBar.length > 0;
    const hasTitle = titleContent.length > 0 || titleIcons.length > 0;
    const hasAction = actionBar.length > 0;

    // Park existing managed nodes off-host temporarily by clearing host children
    // after we've already collected consumer nodes into arrays.
    for (const child of [...this.children]) {
      child.remove();
    }

    const table = document.createElement('table');
    table.setAttribute(MARK, '');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    if (useSortHeader) {
      thead.append(this.#buildSortHeaderRow(columns));
    } else if (headerRows.length) {
      for (const tr of headerRows) thead.append(tr);
    }

    if (bodyRows.length) {
      for (const tr of bodyRows) tbody.append(tr);
    }

    table.append(thead, tbody);

    if (footerRows?.length) {
      const tfoot = document.createElement('tfoot');
      for (const tr of footerRows) tfoot.append(tr);
      table.append(tfoot);
    }

    const dataRegion = () => {
      const frag = document.createDocumentFragment();
      // Bar order: title → filter → action → table (vanilla chrome order)
      if (hasTitle) {
        const bar = document.createElement('div');
        bar.className = 'table__title-bar';
        bar.setAttribute(MARK, '');
        const wrap = document.createElement('div');
        wrap.className = 'table__title-bar-content';
        wrap.setAttribute(MARK, '');
        for (const n of titleContent) wrap.append(n);
        if (titleIcons.length) {
          const icons = document.createElement('div');
          icons.className = 'table__title-bar-icons';
          icons.setAttribute(MARK, '');
          for (const n of titleIcons) icons.append(n);
          wrap.append(icons);
        }
        bar.append(wrap);
        frag.append(bar);
      }
      if (hasFilter) {
        const bar = document.createElement('div');
        bar.className = 'table__filter-bar';
        bar.setAttribute(MARK, '');
        for (const n of filterBar) bar.append(n);
        frag.append(bar);
      }
      if (hasAction) {
        const bar = document.createElement('div');
        bar.className = 'table__action-bar';
        bar.setAttribute(MARK, '');
        for (const n of actionBar) bar.append(n);
        frag.append(bar);
      }
      frag.append(table);
      return frag;
    };

    if (hasAside) {
      const canvas = document.createElement('div');
      canvas.className = [
        'command-center-canvas',
        hasToolbar ? 'command-center-canvas--with-toolbar' : 'command-center-canvas--no-toolbar',
      ].join(' ');
      canvas.setAttribute(MARK, '');

      if (hasToolbar) {
        const toolbarWrap = document.createElement('div');
        toolbarWrap.className = 'command-center-canvas__toolbar';
        toolbarWrap.setAttribute(MARK, '');
        const toolbar = document.createElement('div');
        toolbar.className = 'table__command-center-toolbar';
        toolbar.setAttribute(MARK, '');
        for (const n of ccToolbar) toolbar.append(n);
        toolbarWrap.append(toolbar);
        canvas.append(toolbarWrap);
        const spacer = document.createElement('div');
        spacer.className = 'command-center-canvas__spacer';
        spacer.setAttribute('aria-hidden', 'true');
        spacer.setAttribute(MARK, '');
        canvas.append(spacer);
      }

      const main = document.createElement('div');
      main.className = 'command-center-canvas__main';
      main.setAttribute(MARK, '');
      main.append(dataRegion());
      canvas.append(main);

      const aside = document.createElement('div');
      aside.className = 'command-center-canvas__aside';
      aside.setAttribute(MARK, '');
      for (const n of ccAside) aside.append(n);
      canvas.append(aside);

      this.append(canvas);
    } else {
      if (hasToolbar) {
        const toolbar = document.createElement('div');
        toolbar.className = 'table__command-center-toolbar';
        toolbar.setAttribute(MARK, '');
        for (const n of ccToolbar) toolbar.append(n);
        this.append(toolbar);
      }
      this.append(dataRegion());
    }
  }

  #buildSortHeaderRow(columns) {
    const isCC = this.#isCommandCenter();
    const tr = document.createElement('tr');
    tr.setAttribute(MARK, '');

    if (this.reorderable) {
      const th = document.createElement('th');
      th.className = 'table__grip-column';
      th.scope = 'col';
      th.setAttribute('aria-label', 'Reorder');
      tr.append(th);
    }
    if (this.grouped && !isCC) {
      const th = document.createElement('th');
      th.className = 'table__expand-column';
      th.scope = 'col';
      th.setAttribute('aria-label', 'Expand');
      tr.append(th);
    }

    for (const col of columns) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.className = col.align === 'right' ? 'text-right' : 'text-left';
      const aria = this.#ariaSort(col.key);
      if (aria) th.setAttribute('aria-sort', aria);
      else th.removeAttribute('aria-sort');

      if (isCC) {
        th.append(this.#buildCcHeader(col));
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'table__sort-header';
        btn.setAttribute('data-column-key', col.key);
        btn.setAttribute('aria-label', this.#sortLabel(col.key, col.label));
        btn.append(document.createTextNode(col.label + ' '));
        const icon = document.createElement('harmony-icon');
        icon.setAttribute('name', this.#sortIcon(col.key));
        icon.setAttribute('size', 'sm');
        btn.append(icon);
        th.append(btn);
      }
      tr.append(th);
    }
    return tr;
  }

  #buildCcHeader(col) {
    const wrap = document.createElement('div');
    wrap.className = 'table__cc-header';
    const label = document.createElement('span');
    label.className = 'table__cc-header-label';
    label.textContent = col.label;
    wrap.append(label);

    const actions = document.createElement('div');
    actions.className = 'table__cc-header-actions';
    actions.setAttribute('role', 'group');
    actions.setAttribute('aria-label', col.label);

    if (col.sortable !== false) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'table__cc-header-btn';
      btn.setAttribute('data-column-key', col.key);
      btn.setAttribute('aria-label', this.#sortLabel(col.key, col.label));
      const icon = document.createElement('harmony-icon');
      icon.setAttribute('name', this.#sortIcon(col.key));
      icon.setAttribute('size', 'sm');
      btn.append(icon);
      actions.append(btn);
    }
    if (col.filterable !== false) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'table__cc-header-btn';
      btn.setAttribute('data-action', 'filter');
      btn.setAttribute('data-column-key', col.key);
      btn.setAttribute('aria-label', `Filter ${col.label}`);
      const icon = document.createElement('harmony-icon');
      icon.setAttribute('name', 'funnel');
      icon.setAttribute('size', 'sm');
      btn.append(icon);
      actions.append(btn);
    }
    wrap.append(actions);
    return wrap;
  }

  #renderSortHeader() {
    const columns = this.columns;
    if (!columns.length) return;
    const thead = this.#thead();
    if (!thead) return;
    const existing = thead.querySelector(`tr[${MARK}]`);
    const row = this.#buildSortHeaderRow(columns);
    if (existing) existing.replaceWith(row);
    else thead.replaceChildren(row);
  }

  #sortIcon(key) {
    if (this.sortColumn !== key) return 'chevron-up-down';
    return this.sortDirection === 'asc' ? 'chevron-up' : 'chevron-down';
  }

  #ariaSort(key) {
    if (this.sortColumn !== key) return undefined;
    return this.sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  #sortLabel(key, label) {
    if (this.sortColumn !== key) return `Sort by ${label}`;
    return `Sort by ${label} ${this.sortDirection === 'asc' ? 'ascending' : 'descending'}`;
  }

  #syncHostClasses(content) {
    const isCC = this.#isCommandCenter();
    const classes = [
      'table-wrapper',
      isCC ? 'table-wrapper--command-center' : '',
      isCC && content.ccToolbar.length ? 'table-wrapper--has-command-center-toolbar' : '',
      isCC && content.ccAside.length ? 'table-wrapper--has-command-center-aside' : '',
    ].filter(Boolean);
    const extra = [...this.classList].filter((c) => !MANAGED_HOST.has(c));
    this.className = [...classes, ...extra].join(' ');

    if (this.reorderable) this.setAttribute('data-reorderable', '');
    else this.removeAttribute('data-reorderable');
    if (this.grouped) this.setAttribute('data-grouped', '');
    else this.removeAttribute('data-grouped');
    if (isCC) this.setAttribute('data-table-variant', 'commandCenter');
    else this.removeAttribute('data-table-variant');
  }

  #syncTableClasses() {
    const table = this.#tableEl();
    if (!table) return;
    const isCC = this.#isCommandCenter();
    const hv = this.headerVariant;
    const classes = [
      isCC ? 'table--command-center' : '',
      !isCC && hv === 'white' ? 'table--header-white' : '',
      !isCC && hv === 'none' ? 'table--header-none' : '',
      this.striped ? 'table--striped' : '',
      this.reorderable ? 'table--reorderable' : '',
      this.grouped ? 'table--grouped' : '',
    ].filter(Boolean);
    const extra = [...table.classList].filter((c) => !MANAGED_TABLE.has(c));
    table.className = [...classes, ...extra].join(' ');
  }

  /* ---- reorder / grouped injection ---- */

  #injectReorderable() {
    if (!this.reorderable) return;

    const thead = this.#thead();
    if (thead) {
      for (const headerRow of thead.querySelectorAll('tr')) {
        if (headerRow.querySelector('.table__grip-column')) continue;
        const th = document.createElement('th');
        th.className = 'table__grip-column';
        th.scope = 'col';
        th.setAttribute('aria-label', 'Reorder');
        th.setAttribute(INJECTED, '');
        headerRow.insertBefore(th, headerRow.firstChild);
      }
    }

    const tbody = this.#tbody();
    if (!tbody) return;

    for (const row of tbody.querySelectorAll('tr')) {
      if (row.querySelector(`.table__grip-cell[${INJECTED}]`)) continue;

      if (row.classList.contains('table-row--total')) {
        const empty = document.createElement('td');
        empty.className = 'table__grip-cell table__grip-cell--placeholder';
        empty.setAttribute('aria-hidden', 'true');
        empty.setAttribute(INJECTED, '');
        row.insertBefore(empty, row.firstChild);
        continue;
      }

      const gripTd = document.createElement('td');
      gripTd.className = 'table__grip-cell';
      gripTd.setAttribute(INJECTED, '');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'table__grip-handle';
      btn.setAttribute('aria-label', 'Drag to reorder');
      gripTd.append(btn);
      row.insertBefore(gripTd, row.firstChild);

      row.setAttribute('draggable', 'true');
      this.#bindRowDrag(row, tbody);
    }

    const tfoot = this.#tableEl()?.querySelector('tfoot');
    if (tfoot) {
      for (const row of tfoot.querySelectorAll('tr')) {
        if (row.querySelector('.table__grip-cell')) continue;
        const empty = document.createElement('td');
        empty.className = 'table__grip-cell table__grip-cell--placeholder';
        empty.setAttribute('aria-hidden', 'true');
        empty.setAttribute(INJECTED, '');
        row.insertBefore(empty, row.firstChild);
      }
    }
  }

  #bindRowDrag(row, tbody) {
    if (row.hasAttribute('data-harmony-dnd')) return;
    row.setAttribute('data-harmony-dnd', '');

    row.addEventListener('dragstart', (e) => {
      this.#draggedRow = row;
      row.classList.add('table-row--dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'reorder');
        try {
          e.dataTransfer.setDragImage(row, 0, 0);
        } catch {
          /* ignore */
        }
      }
    });

    row.addEventListener('dragend', () => {
      row.classList.remove('table-row--dragging');
      this.#draggedRow = null;
    });

    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      if (
        this.#draggedRow &&
        this.#draggedRow !== row &&
        !row.classList.contains('table-row--total')
      ) {
        row.classList.add('table-row--drag-over');
      }
    });

    row.addEventListener('dragleave', () => {
      row.classList.remove('table-row--drag-over');
    });

    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('table-row--drag-over');
      const dragged = this.#draggedRow;
      if (!dragged || dragged === row || row.classList.contains('table-row--total')) return;
      const currentRows = [...tbody.querySelectorAll('tr:not(.table-row--total)')];
      const fromIndex = currentRows.indexOf(dragged);
      const toIndex = currentRows.indexOf(row);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
      if (fromIndex < toIndex) tbody.insertBefore(dragged, row.nextSibling);
      else tbody.insertBefore(dragged, row);
      this.emit('table-reorder', { fromIndex, toIndex });
    });
  }

  #injectGrouped() {
    if (!this.grouped) return;
    const isCC = this.#isCommandCenter();

    if (!isCC) {
      const thead = this.#thead();
      if (thead) {
        for (const headerRow of thead.querySelectorAll('tr')) {
          if (headerRow.querySelector('.table__expand-column')) continue;
          const th = document.createElement('th');
          th.className = 'table__expand-column';
          th.scope = 'col';
          th.setAttribute('aria-label', 'Expand');
          th.setAttribute(INJECTED, '');
          // Keep grip leftmost when both reorderable and grouped are on.
          const grip = headerRow.querySelector('.table__grip-column');
          headerRow.insertBefore(th, grip ? grip.nextSibling : headerRow.firstChild);
        }
      }
    }

    const tbody = this.#tbody();
    if (!tbody) return;

    for (const row of tbody.querySelectorAll('tr')) {
      if (row.querySelector(`[${INJECTED}].table__expand-cell, [${INJECTED}].table__cc-project-id-inner`)) {
        continue;
      }
      // also skip if already has cc inner from a prior pass without mark
      if (row.querySelector('.table__cc-project-id-inner')) continue;

      if (row.classList.contains('table-row--total')) {
        if (isCC) {
          const tdf = row.querySelector('td');
          if (tdf && !tdf.querySelector('.table__cc-project-id-inner')) {
            tdf.classList.add('table__cc-project-id-cell');
            const inr = document.createElement('div');
            inr.className = 'table__cc-project-id-inner';
            inr.setAttribute(INJECTED, '');
            const gg = document.createElement('span');
            gg.className = 'table__cc-inline-expand-gutter';
            gg.setAttribute('aria-hidden', 'true');
            inr.append(gg);
            while (tdf.firstChild) inr.append(tdf.firstChild);
            tdf.append(inr);
          }
        } else {
          const empty = document.createElement('td');
          empty.className = 'table__expand-cell table__expand-cell--placeholder';
          empty.setAttribute('aria-hidden', 'true');
          empty.setAttribute(INJECTED, '');
          const grip = row.querySelector('.table__grip-cell');
          row.insertBefore(empty, grip ? grip.nextSibling : row.firstChild);
        }
        continue;
      }

      if (isCC) {
        this.#injectCcGroupedCell(row);
        continue;
      }

      const expandTd = document.createElement('td');
      expandTd.className = 'table__expand-cell';
      expandTd.setAttribute(INJECTED, '');
      if (row.hasAttribute('data-has-children')) {
        expandTd.append(this.#makeExpandBtn());
      }
      const grip = row.querySelector('.table__grip-cell');
      row.insertBefore(expandTd, grip ? grip.nextSibling : row.firstChild);

      const depth = this.#getDepth(row);
      if (depth > 0) {
        const firstContent = [...row.children].find(
          (c) =>
            c instanceof HTMLElement &&
            !c.classList.contains('table__grip-cell') &&
            !c.classList.contains('table__expand-cell'),
        );
        if (firstContent instanceof HTMLElement) {
          firstContent.style.paddingLeft = `calc(var(--space-4) * ${depth} + var(--space-4))`;
        }
      }
    }

    if (!isCC) {
      const tfoot = this.#tableEl()?.querySelector('tfoot');
      if (tfoot) {
        for (const row of tfoot.querySelectorAll('tr')) {
          if (row.querySelector('.table__expand-cell')) continue;
          const empty = document.createElement('td');
          empty.className = 'table__expand-cell table__expand-cell--placeholder';
          empty.setAttribute('aria-hidden', 'true');
          empty.setAttribute(INJECTED, '');
          const grip = row.querySelector('.table__grip-cell');
          row.insertBefore(empty, grip ? grip.nextSibling : row.firstChild);
        }
      }
    }
  }

  #makeExpandBtn() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'table__expand-btn';
    btn.setAttribute('aria-label', 'Expand row');
    btn.setAttribute('aria-expanded', 'false');
    const icon = document.createElement('span');
    icon.className = 'table__expand-icon';
    icon.setAttribute('aria-hidden', 'true');
    btn.append(icon);
    return btn;
  }

  #injectCcGroupedCell(row) {
    const firstTd = row.querySelector('td');
    if (!firstTd || firstTd.querySelector('.table__cc-project-id-inner')) return;

    const depth = this.#getDepth(row);
    if (depth > 0) {
      firstTd.style.paddingLeft = `calc(var(--space-4) * ${depth} + var(--space-4))`;
    }

    const inner = document.createElement('div');
    inner.className = 'table__cc-project-id-inner';
    inner.setAttribute(INJECTED, '');

    const parentId = row.getAttribute('data-parent-id');
    if (parentId) {
      const gr = document.createElement('span');
      gr.className = 'table__cc-inline-expand-gutter';
      gr.setAttribute('aria-hidden', 'true');
      inner.append(gr);
    } else if (row.hasAttribute('data-has-children')) {
      const wrap = document.createElement('span');
      wrap.className = 'table__cc-inline-expand';
      wrap.append(this.#makeExpandBtn());
      inner.append(wrap);
    } else {
      const wlf = document.createElement('span');
      wlf.className = 'table__cc-inline-expand';
      wlf.setAttribute('aria-hidden', 'true');
      const ic = document.createElement('span');
      ic.className = 'table__expand-icon table__expand-icon--cc-leaf';
      wlf.append(ic);
      inner.append(wlf);
    }

    const rest = document.createDocumentFragment();
    while (firstTd.firstChild) rest.append(firstTd.firstChild);
    const nodes = [...rest.childNodes];
    let vNode;
    if (nodes.length === 1 && nodes[0].nodeType === Node.TEXT_NODE) {
      const a = document.createElement('a');
      a.className = 'text-link';
      a.href = '#';
      a.addEventListener('click', (e) => e.preventDefault());
      a.textContent = nodes[0].textContent;
      vNode = a;
    } else if (nodes.length === 1 && nodes[0].nodeName === 'A') {
      /** @type {HTMLElement} */ (nodes[0]).classList.add('text-link');
      vNode = nodes[0];
    } else {
      const sp = document.createElement('span');
      sp.className = 'table__cc-project-id-text';
      for (const n of nodes) sp.append(n);
      vNode = sp;
    }
    inner.append(vNode);
    firstTd.classList.add('table__cc-project-id-cell');
    firstTd.append(inner);
  }

  #getDepth(row) {
    const d = parseInt(row.getAttribute('data-depth') || '0', 10);
    return Math.min(Math.max(d, 0), MAX_DEPTH);
  }

  #isRowVisible(row, tbody) {
    const parentId = row.getAttribute('data-parent-id');
    if (!parentId) return true;
    if (!this.#expandedIds.has(parentId)) return false;
    const parentRow = tbody.querySelector(`tr[data-row-id="${CSS.escape(parentId)}"]`);
    return parentRow ? this.#isRowVisible(parentRow, tbody) : false;
  }

  #applyGroupedVisibility() {
    const tbody = this.#tbody();
    if (!tbody || !this.grouped) return;

    for (const row of tbody.querySelectorAll('tr[data-parent-id]')) {
      row.style.display = this.#isRowVisible(row, tbody) ? '' : 'none';
    }

    for (const row of tbody.querySelectorAll('tr[data-has-children]')) {
      const id = row.getAttribute('data-row-id');
      if (!id) continue;
      const btn = row.querySelector('.table__expand-btn');
      if (!btn) continue;
      const open = this.#expandedIds.has(id);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Collapse row' : 'Expand row');
      btn.classList.toggle('table__expand-btn--expanded', open);
    }
  }

  #applySelectedFromAttr() {
    const ids = new Set(this.selectedRowIds);
    if (!ids.size) return;
    const tbody = this.#tbody();
    if (!tbody) return;
    for (const row of tbody.querySelectorAll('tr')) {
      const id = row.getAttribute('data-row-id');
      if (id && ids.has(id)) {
        row.classList.add('table-row--selected');
        this.#setRowCheckbox(row, true);
      }
    }
  }
}
