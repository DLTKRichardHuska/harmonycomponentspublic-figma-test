import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { userMenuCss } from '../styles/generated/userMenuCss.js';

const styles = createSheet(userMenuCss);

let seq = 0;

function normalizeInitials(s) {
  if (!s?.trim()) return '';
  const parts = s.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  const t = parts[0] ?? '';
  if (t.length <= 2) return t.toUpperCase();
  return t.slice(0, 2).toUpperCase();
}

/**
 * User menu Custom Element (open Shadow DOM).
 * Interactive avatar + tooltip (full name); slotted a/button menu items.
 */
export class HarmonyUserMenu extends HarmonyElement {
  static styles = [styles];
  static shadowRootInit = { mode: 'open', delegatesFocus: true };

  static get observedAttributes() {
    return ['name', 'src'];
  }

  /** @type {(() => void) | null} */
  #onDocClick = null;
  /** @type {((e: KeyboardEvent) => void) | null} */
  #onDocKey = null;

  connectedCallback() {
    if (!this.id) this.id = `harmony-user-menu-${++seq}`;
    this.#render();
    this.#sync();
    this.#bind();
  }

  disconnectedCallback() {
    this.#teardownDocListeners();
    this.shadowRoot?.querySelector('harmony-avatar')?.removeEventListener('click', this.#onAvatarClick);
    this.shadowRoot?.querySelector('slot')?.removeEventListener('slotchange', this.#onSlotChange);
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get name() {
    return this.getAttribute('name') || '';
  }

  set name(v) {
    this.reflectString('name', v);
  }

  get src() {
    return this.getAttribute('src') || '';
  }

  set src(v) {
    this.reflectString('src', v);
  }

  get open() {
    return this.shadowRoot
      ?.querySelector('[data-user-menu-menu]')
      ?.classList.contains('user-menu__menu--open');
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <div class="user-menu__trigger-wrap" part="trigger">
        <harmony-tooltip position="bottom">
          <harmony-avatar size="sm" interactive part="avatar"></harmony-avatar>
        </harmony-tooltip>
      </div>
      <div class="user-menu__menu" part="menu" data-user-menu-menu role="menu" hidden>
        <div class="user-menu__list" part="list">
          <slot></slot>
        </div>
      </div>
    `;
  }

  #bind() {
    this.shadowRoot.querySelector('harmony-avatar')?.addEventListener('click', this.#onAvatarClick);
    this.shadowRoot.querySelector('slot')?.addEventListener('slotchange', this.#onSlotChange);
    this.#onSlotChange();
  }

  #sync() {
    const name = this.name || 'User';
    const src = this.src;
    const tooltip = this.shadowRoot.querySelector('harmony-tooltip');
    const avatar = this.shadowRoot.querySelector('harmony-avatar');
    if (tooltip) tooltip.setAttribute('text', name);
    if (!avatar) return;
    avatar.setAttribute('alt', name);
    if (src) {
      avatar.setAttribute('variant', 'image');
      avatar.setAttribute('src', src);
      avatar.removeAttribute('initials');
    } else {
      avatar.setAttribute('variant', 'initials');
      avatar.setAttribute('initials', normalizeInitials(name) || name);
      avatar.removeAttribute('src');
    }
  }

  #setOpen(open) {
    const menu = this.shadowRoot.querySelector('[data-user-menu-menu]');
    const avatar = this.shadowRoot.querySelector('harmony-avatar');
    if (!menu) return;
    menu.classList.toggle('user-menu__menu--open', open);
    menu.hidden = !open;
    avatar?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) this.#ensureDocListeners();
    else this.#teardownDocListeners();
  }

  #ensureDocListeners() {
    if (this.#onDocClick) return;
    this.#onDocClick = () => this.#setOpen(false);
    this.#onDocKey = (e) => {
      if (e.key === 'Escape') this.#setOpen(false);
    };
    queueMicrotask(() => {
      document.addEventListener('click', this.#onDocClick);
      document.addEventListener('keydown', this.#onDocKey);
    });
  }

  #teardownDocListeners() {
    if (this.#onDocClick) document.removeEventListener('click', this.#onDocClick);
    if (this.#onDocKey) document.removeEventListener('keydown', this.#onDocKey);
    this.#onDocClick = null;
    this.#onDocKey = null;
  }

  #onAvatarClick = (e) => {
    e.stopPropagation();
    this.#setOpen(!this.open);
  };

  /** @param {HTMLElement} el */
  #styleItem(el) {
    el.classList.add('user-menu__item');
    // Layout props inline to beat product button defaults.
    // Do not set backgroundColor/color here — that blocks ::slotted :hover.
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'flex-start';
    el.style.gap = 'var(--space-3)';
    el.style.width = '100%';
    el.style.height = 'auto';
    el.style.minHeight = '0';
    el.style.margin = '0';
    el.style.padding = 'var(--space-2) var(--space-3)';
    el.style.border = 'none';
    el.style.borderRadius = 'var(--radius-md)';
    el.style.fontFamily = 'var(--font-sans)';
    el.style.fontSize = 'var(--text-sm)';
    el.style.fontWeight = 'var(--font-medium)';
    el.style.lineHeight = 'var(--leading-normal)';
    el.style.textAlign = 'left';
    el.style.textDecoration = 'none';
    el.style.cursor = 'pointer';
    el.style.boxSizing = 'border-box';
  }

  /** @param {HTMLElement} el */
  #ensureIcon(el) {
    if (el.querySelector('[data-user-menu-icon], harmony-icon')) return;
    const name = el.getAttribute('data-icon')?.trim();
    if (!name) return;
    const icon = document.createElement('harmony-icon');
    icon.setAttribute('data-user-menu-icon', '');
    icon.setAttribute('name', name);
    icon.setAttribute('size', 'sm');
    icon.setAttribute('aria-hidden', 'true');
    icon.className = 'user-menu__item-icon';
    icon.style.cssText = 'flex-shrink:0;color:currentColor;';
    el.prepend(icon);
  }

  #onSlotChange = () => {
    const slot = this.shadowRoot.querySelector('slot');
    for (const el of slot?.assignedElements({ flatten: true }) ?? []) {
      if (!(el instanceof HTMLElement)) continue;
      if (el.tagName !== 'A' && el.tagName !== 'BUTTON') continue;
      this.#styleItem(el);
      this.#ensureIcon(el);
      el.setAttribute('role', 'menuitem');
      el.addEventListener('click', () => this.#setOpen(false));
    }
  };
}
