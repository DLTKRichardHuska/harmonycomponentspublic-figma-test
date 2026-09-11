import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { typographySheet } from './typography.js';
import { buttonSheet } from './button.js';
import { dialogCss } from '../styles/generated/dialogCss.js';

const HEADER_VARIANTS = new Set(['default', 'primary']);
const ALIGNMENTS = new Set(['left', 'right']);

const styles = createSheet(dialogCss);

const GRIP_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" aria-hidden="true">
  <line x1="12" y1="15" x2="15" y2="12" />
  <line x1="8" y1="15" x2="15" y2="8" />
  <line x1="4" y1="15" x2="15" y2="4" />
</svg>`;

/**
 * Dialog Custom Element (open Shadow DOM) wrapping a native `<dialog>`.
 * Production: close-on-backdrop, dirty + confirm-unsaved nested confirm, cancelable close-request.
 */
export class HarmonyDialog extends HarmonyElement {
  static styles = [typographySheet, buttonSheet, styles];

  static get observedAttributes() {
    return [
      'title',
      'header-variant',
      'button-alignment',
      'resizable',
      'open',
      'close-on-backdrop',
      'dirty',
      'confirm-unsaved',
      'confirm-label',
      'cancel-label',
      'tertiary-label',
      'unsaved-title',
      'unsaved-message',
      'unsaved-discard-label',
      'unsaved-stay-label',
    ];
  }

  /** @type {boolean} */
  #syncingOpen = false;
  /** @type {(() => void) | null} */
  #resizeCleanup = null;
  /** @type {string} */
  #titleId = `harmony-dialog-title-${Math.random().toString(36).slice(2, 9)}`;

  connectedCallback() {
    if (!this.hasAttribute('header-variant')) this.setAttribute('header-variant', 'default');
    if (!this.hasAttribute('button-alignment')) this.setAttribute('button-alignment', 'left');
    if (!this.hasAttribute('resizable')) this.setAttribute('resizable', '');
    if (!this.hasAttribute('close-on-backdrop')) this.setAttribute('close-on-backdrop', '');
    this.#render();
    this.#sync();
    this.#bind();
  }

  disconnectedCallback() {
    this.#unbind();
    this.#resizeCleanup?.();
    this.#resizeCleanup = null;
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === 'open' && !this.#syncingOpen) {
      if (this.hasAttribute('open')) this.show();
      else this.close({ force: true });
      return;
    }
    this.#sync();
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  set title(v) {
    this.reflectString('title', v);
  }

  get headerVariant() {
    const v = this.getAttribute('header-variant') || 'default';
    return HEADER_VARIANTS.has(v) ? v : 'default';
  }

  set headerVariant(v) {
    this.reflectString('header-variant', HEADER_VARIANTS.has(v) ? v : 'default');
  }

  get buttonAlignment() {
    const v = this.getAttribute('button-alignment') || 'left';
    return ALIGNMENTS.has(v) ? v : 'left';
  }

  set buttonAlignment(v) {
    this.reflectString('button-alignment', ALIGNMENTS.has(v) ? v : 'left');
  }

  get resizable() {
    if (!this.hasAttribute('resizable')) return true;
    return this.getAttribute('resizable') !== 'false';
  }

  set resizable(v) {
    if (v) this.setAttribute('resizable', '');
    else this.setAttribute('resizable', 'false');
  }

  get closeOnBackdrop() {
    if (!this.hasAttribute('close-on-backdrop')) return true;
    return this.getAttribute('close-on-backdrop') !== 'false';
  }

  set closeOnBackdrop(v) {
    if (v) this.setAttribute('close-on-backdrop', '');
    else this.setAttribute('close-on-backdrop', 'false');
  }

  get dirty() {
    return this.hasAttribute('dirty');
  }

  set dirty(v) {
    this.reflectBoolean('dirty', Boolean(v));
  }

  get confirmUnsaved() {
    return this.hasAttribute('confirm-unsaved');
  }

  set confirmUnsaved(v) {
    this.reflectBoolean('confirm-unsaved', Boolean(v));
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(v) {
    this.reflectBoolean('open', Boolean(v));
  }

  get confirmLabel() {
    return this.getAttribute('confirm-label') || 'Confirm';
  }

  set confirmLabel(v) {
    this.reflectString('confirm-label', v);
  }

  get cancelLabel() {
    return this.getAttribute('cancel-label') || 'Cancel';
  }

  set cancelLabel(v) {
    this.reflectString('cancel-label', v);
  }

  get tertiaryLabel() {
    return this.getAttribute('tertiary-label') || '';
  }

  set tertiaryLabel(v) {
    this.reflectString('tertiary-label', v);
  }

  get unsavedTitle() {
    return this.getAttribute('unsaved-title') || 'Unsaved changes';
  }

  set unsavedTitle(v) {
    this.reflectString('unsaved-title', v);
  }

  get unsavedMessage() {
    return this.getAttribute('unsaved-message') || 'You have unsaved changes. Discard them?';
  }

  set unsavedMessage(v) {
    this.reflectString('unsaved-message', v);
  }

  get unsavedDiscardLabel() {
    return this.getAttribute('unsaved-discard-label') || 'Discard';
  }

  set unsavedDiscardLabel(v) {
    this.reflectString('unsaved-discard-label', v);
  }

  get unsavedStayLabel() {
    return this.getAttribute('unsaved-stay-label') || 'Keep editing';
  }

  set unsavedStayLabel(v) {
    this.reflectString('unsaved-stay-label', v);
  }

  /** Open the dialog with showModal(). */
  show() {
    const dlg = this.#dialog();
    if (!dlg) return;
    if (!dlg.open) dlg.showModal();
    this.#setOpenAttr(true);
    this.#focusInitial();
  }

  /**
   * Request close. Pass `{ force: true }` to skip the unsaved gate.
   * @param {{ force?: boolean }} [opts]
   */
  close(opts = {}) {
    this.#requestClose('api', Boolean(opts.force));
  }

  #dialog() {
    return /** @type {HTMLDialogElement | null} */ (
      this.shadowRoot?.querySelector('dialog[part="dialog"]')
    );
  }

  #unsavedDialog() {
    return /** @type {HTMLDialogElement | null} */ (
      this.shadowRoot?.querySelector('dialog[part="unsaved"]')
    );
  }

  #setOpenAttr(open) {
    this.#syncingOpen = true;
    this.reflectBoolean('open', open);
    this.#syncingOpen = false;
  }

  #focusInitial() {
    const dlg = this.#dialog();
    if (!dlg) return;
    const closeBtn = dlg.querySelector('[part="close"]');
    if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();
  }

  /**
   * @param {'backdrop' | 'escape' | 'close-button' | 'cancel' | 'api'} reason
   * @param {boolean} [force]
   */
  #requestClose(reason, force = false) {
    const dlg = this.#dialog();
    if (!dlg?.open) return;

    if (reason === 'backdrop' && !this.closeOnBackdrop) return;

    const ev = new CustomEvent('close-request', {
      detail: { reason },
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    this.dispatchEvent(ev);
    if (ev.defaultPrevented) return;

    if (!force && this.dirty) {
      if (this.confirmUnsaved) {
        this.#openUnsavedConfirm();
        return;
      }
      // dirty without confirm-unsaved — stay open
      return;
    }

    this.#doClose();
  }

  #doClose() {
    const unsaved = this.#unsavedDialog();
    if (unsaved?.open) unsaved.close();
    const dlg = this.#dialog();
    if (dlg?.open) dlg.close();
    this.#setOpenAttr(false);
    this.dirty = false;
    this.emit('close');
  }

  #openUnsavedConfirm() {
    const u = this.#unsavedDialog();
    if (!u) return;
    this.#syncUnsavedCopy();
    if (!u.open) u.showModal();
  }

  #bind() {
    const dlg = this.#dialog();
    if (!dlg) return;
    dlg.addEventListener('cancel', this.#onNativeCancel);
    dlg.addEventListener('click', this.#onDialogClick);
    const unsaved = this.#unsavedDialog();
    unsaved?.addEventListener('cancel', this.#onUnsavedCancel);
    this.shadowRoot.addEventListener('click', this.#onShadowClick);
    const footerSlot = this.shadowRoot.querySelector('slot[name="footer"]');
    footerSlot?.addEventListener('slotchange', this.#onFooterSlotChange);
    this.#onFooterSlotChange();
    this.#bindGrip();
  }

  #unbind() {
    const dlg = this.#dialog();
    dlg?.removeEventListener('cancel', this.#onNativeCancel);
    dlg?.removeEventListener('click', this.#onDialogClick);
    this.#unsavedDialog()?.removeEventListener('cancel', this.#onUnsavedCancel);
    this.shadowRoot?.removeEventListener('click', this.#onShadowClick);
  }

  #onNativeCancel = (e) => {
    e.preventDefault();
    this.#requestClose('escape');
  };

  /** Escape / cancel on nested unsaved confirm = Stay (keep editing). */
  #onUnsavedCancel = (e) => {
    e.preventDefault();
    this.#unsavedDialog()?.close();
  };

  #onDialogClick = (e) => {
    const dlg = this.#dialog();
    if (e.target === dlg) this.#requestClose('backdrop');
  };

  #onShadowClick = (e) => {
    const t = /** @type {Element | null} */ (e.target?.closest?.('[data-action]'));
    if (!t) return;
    const action = t.getAttribute('data-action');
    if (action === 'close') {
      e.stopPropagation();
      this.#requestClose('close-button');
      return;
    }
    if (action === 'confirm') {
      e.stopPropagation();
      this.emit('confirm');
      return;
    }
    if (action === 'cancel') {
      e.stopPropagation();
      this.emit('cancel');
      this.#requestClose('cancel');
      return;
    }
    if (action === 'tertiary') {
      e.stopPropagation();
      this.emit('tertiary');
      return;
    }
    if (action === 'unsaved-stay') {
      e.stopPropagation();
      this.#unsavedDialog()?.close();
      return;
    }
    if (action === 'unsaved-discard') {
      e.stopPropagation();
      this.#unsavedDialog()?.close();
      this.#requestClose('api', true);
    }
  };

  #onFooterSlotChange = () => {
    const slot = this.shadowRoot.querySelector('slot[name="footer"]');
    const convenience = this.shadowRoot.querySelector('.dialog__footer-actions');
    if (!slot || !convenience) return;
    const assigned = slot.assignedNodes({ flatten: true }).filter((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      return n.nodeType === Node.TEXT_NODE && n.textContent?.trim();
    });
    convenience.hidden = assigned.length > 0;
  };

  #bindGrip() {
    this.#resizeCleanup?.();
    this.#resizeCleanup = null;
    const grip = this.shadowRoot.querySelector('[part="grip"]');
    const dlg = this.#dialog();
    if (!grip || !dlg || !this.resizable) return;

    const onDown = (e) => {
      e.preventDefault();
      const rect = dlg.getBoundingClientRect();
      const startW = rect.width;
      const startH = rect.height;
      dlg.style.width = `${startW}px`;
      dlg.style.height = `${startH}px`;
      dlg.style.minWidth = '0';
      dlg.style.maxWidth = 'none';
      dlg.style.maxHeight = 'none';
      const startX = e.clientX;
      const startY = e.clientY;

      const onMove = (moveEvent) => {
        const w = Math.max(1, Math.round(startW + (moveEvent.clientX - startX)));
        const h = Math.max(1, Math.round(startH + (moveEvent.clientY - startY)));
        dlg.style.width = `${w}px`;
        dlg.style.height = `${h}px`;
      };
      const onUp = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.body.style.userSelect = '';
      };
      document.body.style.userSelect = 'none';
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };

    grip.addEventListener('pointerdown', onDown);
    this.#resizeCleanup = () => grip.removeEventListener('pointerdown', onDown);
  }

  #syncUnsavedCopy() {
    const title = this.shadowRoot.querySelector('[data-unsaved-title]');
    const msg = this.shadowRoot.querySelector('[data-unsaved-message]');
    const discard = this.shadowRoot.querySelector('[data-action="unsaved-discard"]');
    const stay = this.shadowRoot.querySelector('[data-action="unsaved-stay"]');
    if (title) title.textContent = this.unsavedTitle;
    if (msg) msg.textContent = this.unsavedMessage;
    if (discard) discard.textContent = this.unsavedDiscardLabel;
    if (stay) stay.textContent = this.unsavedStayLabel;
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <dialog part="dialog" aria-labelledby="${this.#titleId}">
        <div part="header">
          <h2 part="title" id="${this.#titleId}"></h2>
          <harmony-button
            part="close"
            data-action="close"
            button-type="theme"
            variant="ghost"
            size="lg"
            icon="x-mark"
            type="button"
            aria-label="Close"
          ></harmony-button>
        </div>
        <div part="body"><slot></slot></div>
        <div part="footer">
          <slot name="footer"></slot>
          <div class="dialog__footer-actions">
            <harmony-button data-action="confirm" button-type="theme" type="button"></harmony-button>
            <harmony-button data-action="cancel" button-type="theme" variant="secondary" type="button"></harmony-button>
            <harmony-button data-action="tertiary" button-type="theme" variant="tertiary" type="button" hidden></harmony-button>
          </div>
        </div>
        <div part="grip" role="img" aria-label="Resize" hidden>${GRIP_SVG}</div>
      </dialog>
      <dialog part="unsaved" aria-labelledby="${this.#titleId}-unsaved">
        <div part="header">
          <h2 part="title" id="${this.#titleId}-unsaved" data-unsaved-title>Unsaved changes</h2>
        </div>
        <div part="body"><p data-unsaved-message>You have unsaved changes. Discard them?</p></div>
        <div part="footer">
          <div class="dialog__footer-actions">
            <harmony-button data-action="unsaved-discard" button-type="theme" variant="destructive" type="button">Discard</harmony-button>
            <harmony-button data-action="unsaved-stay" button-type="theme" variant="secondary" type="button">Keep editing</harmony-button>
          </div>
        </div>
      </dialog>
    `;
  }

  #sync() {
    const dlg = this.#dialog();
    if (!dlg) return;

    const titleEl = this.shadowRoot.querySelector(`#${this.#titleId}`);
    if (titleEl) titleEl.textContent = this.title || 'Dialog';

    dlg.classList.toggle('dialog--resizable', this.resizable);
    const grip = this.shadowRoot.querySelector('[part="grip"]');
    if (grip) grip.hidden = !this.resizable;
    this.#bindGrip();

    const confirmBtn = this.shadowRoot.querySelector('[data-action="confirm"]');
    const cancelBtn = this.shadowRoot.querySelector('[data-action="cancel"]');
    const tertiaryBtn = this.shadowRoot.querySelector('[data-action="tertiary"]');
    if (confirmBtn) confirmBtn.textContent = this.confirmLabel;
    if (cancelBtn) cancelBtn.textContent = this.cancelLabel;
    if (tertiaryBtn) {
      if (this.tertiaryLabel) {
        tertiaryBtn.hidden = false;
        tertiaryBtn.textContent = this.tertiaryLabel;
      } else {
        tertiaryBtn.hidden = true;
        tertiaryBtn.textContent = '';
      }
    }

    this.#onFooterSlotChange();
    this.#syncUnsavedCopy();
  }
}
