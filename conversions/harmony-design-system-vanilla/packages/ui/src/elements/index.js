/** Barrel for Harmony Custom Elements. Elements register as they are converted. */

export { HarmonyElement, createSheet } from './HarmonyElement.js';
export { HarmonyIcon, registerIcons } from './HarmonyIcon.js';
export { HarmonyButton } from './HarmonyButton.js';
export { HarmonyCard } from './HarmonyCard.js';
export { HarmonyProgress } from './HarmonyProgress.js';
export { HarmonySpinner } from './HarmonySpinner.js';
export { HarmonyAccordion } from './HarmonyAccordion.js';
export { HarmonyAccordionItem } from './HarmonyAccordionItem.js';
export { HarmonyBadge } from './HarmonyBadge.js';
export { HarmonyAvatar } from './HarmonyAvatar.js';
export { HarmonyChip } from './HarmonyChip.js';
export { HarmonyAlert } from './HarmonyAlert.js';
export { HarmonyTooltip } from './HarmonyTooltip.js';
export { HarmonyDialog } from './HarmonyDialog.js';
export { HarmonyInput } from './HarmonyInput.js';
export { HarmonyTextarea } from './HarmonyTextarea.js';
export { HarmonySelect } from './HarmonySelect.js';
export { HarmonyFormLayout } from './HarmonyFormLayout.js';
export { HarmonyFormRow } from './HarmonyFormRow.js';
export { HarmonyPickerPopup } from './HarmonyPickerPopup.js';
export { HarmonyDatePicker } from './HarmonyDatePicker.js';
export { HarmonyTimePicker } from './HarmonyTimePicker.js';
export { HarmonyDateTimePicker } from './HarmonyDateTimePicker.js';
export { HarmonyMonthPicker } from './HarmonyMonthPicker.js';
export { HarmonyWeekPicker } from './HarmonyWeekPicker.js';
export { HarmonyDateInput } from './HarmonyDateInput.js';
export { HarmonyButtonGroup } from './HarmonyButtonGroup.js';
export { HarmonyListMenu } from './HarmonyListMenu.js';
export { HarmonyTable } from './HarmonyTable.js';
export { HarmonyNotificationBadge } from './HarmonyNotificationBadge.js';
export { HarmonyCheckbox } from './HarmonyCheckbox.js';
export { HarmonyRadio } from './HarmonyRadio.js';
export { HarmonyToggle } from './HarmonyToggle.js';
export { HarmonyTabStrip } from './HarmonyTabStrip.js';
export { HarmonyShellHeader } from './HarmonyShellHeader.js';
export { HarmonyLeftSidebar } from './HarmonyLeftSidebar.js';
export { HarmonyRightSidebar } from './HarmonyRightSidebar.js';
export { HarmonyCompanyPicker } from './HarmonyCompanyPicker.js';
export { HarmonyUserMenu } from './HarmonyUserMenu.js';
export { PRODUCT_LOGO_ICON, PRODUCT_LOGO_BY_ID, resolveProductLogoKey, resolveProductLogoUrl } from './productLogo.js';
export {
  PRODUCT_LEFT_SIDEBAR_ID,
  LEFT_SIDEBAR_DEFAULTS_BY_PRODUCT,
  resolveProductLeftSidebarId,
  getLeftSidebarDefaults,
  sidebarItemId,
} from './leftSidebarDefaults.js';
export {
  PRODUCT_RIGHT_SIDEBAR_ID,
  RIGHT_SIDEBAR_DEFAULTS_BY_PRODUCT,
  resolveProductRightSidebarId,
  getRightSidebarDefaults,
  rightSidebarItemId,
  isHarmonyIconName,
} from './rightSidebarDefaults.js';
export { pickersSheet, pickersCss } from './pickers.js';
export { tabStripSheet, tabStripCss } from './tab-strip.js';
export { shellHeaderSheet, shellHeaderCss } from './shell-header.js';
export { leftSidebarSheet, leftSidebarCss } from './left-sidebar.js';
export { rightSidebarSheet, rightSidebarCss } from './right-sidebar.js';
export { companyPickerSheet, companyPickerCss } from './company-picker.js';
export { userMenuSheet, userMenuCss } from './user-menu.js';
export { typographySheet, typographyCss } from './typography.js';
export { buttonSheet, buttonCss } from './button.js';
export { cardSheet, cardCss } from './card.js';
export { progressSheet, progressCss } from './progress.js';
export { spinnerSheet, spinnerCss } from './spinner.js';
export { accordionSheet, accordionItemSheet, accordionCss, accordionItemCss } from './accordion.js';
export { badgeSheet, badgeCss } from './badge.js';
export { avatarSheet, avatarCss } from './avatar.js';
export { chipSheet, chipCss } from './chip.js';
export { linkSheet, linkCss } from './link.js';
export { alertSheet, alertCss } from './alert.js';
export { tooltipSheet, tooltipCss } from './tooltip.js';
export { dialogSheet, dialogCss } from './dialog.js';
export { inputFieldSheet, inputFieldCss } from './input-field.js';
export { labelSheet, labelCss } from './label.js';
export { inputSheet, inputCss } from './input.js';
export { buttonGroupSheet, buttonGroupCss } from './button-group.js';
export { listMenuSheet, listMenuCss } from './list-menu.js';
export { tableSheet, tableCss } from './table.js';
export { notificationBadgeSheet, notificationBadgeCss } from './notification-badge.js';
export { checkboxSheet, checkboxCss } from './checkbox.js';
export { radioSheet, radioCss } from './radio.js';
export { toggleSheet, toggleCss } from './toggle.js';
import { HarmonyIcon } from './HarmonyIcon.js';
import { HarmonyButton } from './HarmonyButton.js';
import { HarmonyCard } from './HarmonyCard.js';
import { HarmonyProgress } from './HarmonyProgress.js';
import { HarmonySpinner } from './HarmonySpinner.js';
import { HarmonyAccordion } from './HarmonyAccordion.js';
import { HarmonyAccordionItem } from './HarmonyAccordionItem.js';
import { HarmonyBadge } from './HarmonyBadge.js';
import { HarmonyAvatar } from './HarmonyAvatar.js';
import { HarmonyChip } from './HarmonyChip.js';
import { HarmonyAlert } from './HarmonyAlert.js';
import { HarmonyTooltip } from './HarmonyTooltip.js';
import { HarmonyDialog } from './HarmonyDialog.js';
import { HarmonyInput } from './HarmonyInput.js';
import { HarmonyTextarea } from './HarmonyTextarea.js';
import { HarmonySelect } from './HarmonySelect.js';
import { HarmonyFormLayout } from './HarmonyFormLayout.js';
import { HarmonyFormRow } from './HarmonyFormRow.js';
import { HarmonyPickerPopup } from './HarmonyPickerPopup.js';
import { HarmonyDatePicker } from './HarmonyDatePicker.js';
import { HarmonyTimePicker } from './HarmonyTimePicker.js';
import { HarmonyDateTimePicker } from './HarmonyDateTimePicker.js';
import { HarmonyMonthPicker } from './HarmonyMonthPicker.js';
import { HarmonyWeekPicker } from './HarmonyWeekPicker.js';
import { HarmonyDateInput } from './HarmonyDateInput.js';
import { HarmonyButtonGroup } from './HarmonyButtonGroup.js';
import { HarmonyListMenu } from './HarmonyListMenu.js';
import { HarmonyTable } from './HarmonyTable.js';
import { HarmonyNotificationBadge } from './HarmonyNotificationBadge.js';
import { HarmonyCheckbox } from './HarmonyCheckbox.js';
import { HarmonyRadio } from './HarmonyRadio.js';
import { HarmonyToggle } from './HarmonyToggle.js';
import { HarmonyTabStrip } from './HarmonyTabStrip.js';
import { HarmonyShellHeader } from './HarmonyShellHeader.js';
import { HarmonyLeftSidebar } from './HarmonyLeftSidebar.js';
import { HarmonyRightSidebar } from './HarmonyRightSidebar.js';
import { HarmonyCompanyPicker } from './HarmonyCompanyPicker.js';
import { HarmonyUserMenu } from './HarmonyUserMenu.js';

/**
 * Register all shipped custom elements.
 * Call after importing styles for the chosen product.
 */
export function registerHarmonyElements() {
  if (!customElements.get('harmony-icon')) customElements.define('harmony-icon', HarmonyIcon);
  if (!customElements.get('harmony-button')) customElements.define('harmony-button', HarmonyButton);
  if (!customElements.get('harmony-card')) customElements.define('harmony-card', HarmonyCard);
  if (!customElements.get('harmony-progress'))
    customElements.define('harmony-progress', HarmonyProgress);
  if (!customElements.get('harmony-spinner'))
    customElements.define('harmony-spinner', HarmonySpinner);
  if (!customElements.get('harmony-accordion'))
    customElements.define('harmony-accordion', HarmonyAccordion);
  if (!customElements.get('harmony-accordion-item'))
    customElements.define('harmony-accordion-item', HarmonyAccordionItem);
  if (!customElements.get('harmony-badge')) customElements.define('harmony-badge', HarmonyBadge);
  if (!customElements.get('harmony-avatar')) customElements.define('harmony-avatar', HarmonyAvatar);
  if (!customElements.get('harmony-chip')) customElements.define('harmony-chip', HarmonyChip);
  if (!customElements.get('harmony-alert')) customElements.define('harmony-alert', HarmonyAlert);
  if (!customElements.get('harmony-tooltip'))
    customElements.define('harmony-tooltip', HarmonyTooltip);
  if (!customElements.get('harmony-dialog')) customElements.define('harmony-dialog', HarmonyDialog);
  if (!customElements.get('harmony-input')) customElements.define('harmony-input', HarmonyInput);
  if (!customElements.get('harmony-textarea'))
    customElements.define('harmony-textarea', HarmonyTextarea);
  if (!customElements.get('harmony-select')) customElements.define('harmony-select', HarmonySelect);
  if (!customElements.get('harmony-form-layout'))
    customElements.define('harmony-form-layout', HarmonyFormLayout);
  if (!customElements.get('harmony-form-row'))
    customElements.define('harmony-form-row', HarmonyFormRow);
  if (!customElements.get('harmony-picker-popup'))
    customElements.define('harmony-picker-popup', HarmonyPickerPopup);
  if (!customElements.get('harmony-date-picker'))
    customElements.define('harmony-date-picker', HarmonyDatePicker);
  if (!customElements.get('harmony-time-picker'))
    customElements.define('harmony-time-picker', HarmonyTimePicker);
  if (!customElements.get('harmony-datetime-picker'))
    customElements.define('harmony-datetime-picker', HarmonyDateTimePicker);
  if (!customElements.get('harmony-month-picker'))
    customElements.define('harmony-month-picker', HarmonyMonthPicker);
  if (!customElements.get('harmony-week-picker'))
    customElements.define('harmony-week-picker', HarmonyWeekPicker);
  if (!customElements.get('harmony-date-input'))
    customElements.define('harmony-date-input', HarmonyDateInput);
  if (!customElements.get('harmony-button-group'))
    customElements.define('harmony-button-group', HarmonyButtonGroup);
  if (!customElements.get('harmony-list-menu'))
    customElements.define('harmony-list-menu', HarmonyListMenu);
  if (!customElements.get('harmony-table')) customElements.define('harmony-table', HarmonyTable);
  if (!customElements.get('harmony-notification-badge'))
    customElements.define('harmony-notification-badge', HarmonyNotificationBadge);
  if (!customElements.get('harmony-checkbox'))
    customElements.define('harmony-checkbox', HarmonyCheckbox);
  if (!customElements.get('harmony-radio')) customElements.define('harmony-radio', HarmonyRadio);
  if (!customElements.get('harmony-toggle')) customElements.define('harmony-toggle', HarmonyToggle);
  if (!customElements.get('harmony-tab-strip'))
    customElements.define('harmony-tab-strip', HarmonyTabStrip);
  if (!customElements.get('harmony-shell-header'))
    customElements.define('harmony-shell-header', HarmonyShellHeader);
  if (!customElements.get('harmony-left-sidebar'))
    customElements.define('harmony-left-sidebar', HarmonyLeftSidebar);
  if (!customElements.get('harmony-right-sidebar'))
    customElements.define('harmony-right-sidebar', HarmonyRightSidebar);
  if (!customElements.get('harmony-company-picker'))
    customElements.define('harmony-company-picker', HarmonyCompanyPicker);
  if (!customElements.get('harmony-user-menu'))
    customElements.define('harmony-user-menu', HarmonyUserMenu);
}

export default registerHarmonyElements;
