import { HarmonyElement } from './HarmonyElement.js';

/**
 * Light-DOM row group for {@link HarmonyFormLayout}.
 * Place 2+ fields inside so they share a horizontal row while the parent
 * layout still owns label stacking / inline alignment and density (`data-compact`).
 *
 * Use the `columns` attribute (default 2) — no inline styles.
 *
 * @example
 * <harmony-form-layout label-layout="inline">
 *   <harmony-form-row>
 *     <harmony-input label="First Name" required></harmony-input>
 *     <harmony-input label="Last Name" required></harmony-input>
 *   </harmony-form-row>
 *   <harmony-input label="Email" type="email" required></harmony-input>
 * </harmony-form-layout>
 */
export class HarmonyFormRow extends HarmonyElement {
  static shadowRootInit = null;

  static get observedAttributes() {
    return ['columns'];
  }

  get columns() {
    const n = Number(this.getAttribute('columns') || '2');
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 2;
  }

  set columns(v) {
    this.setAttribute('columns', String(v));
  }
}
