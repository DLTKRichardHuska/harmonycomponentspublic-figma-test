import type { HarmonyProduct } from '../tokens';
import { mapColorsToPalette } from './mapColorsToPalette';
import { mapTypographyToTheme } from './mapTypographyToTheme';
import { mapSpacingToTheme } from './mapSpacingToTheme';
import { mapElevationsToTheme } from './mapElevationsToTheme';
import { mapButtonToTheme } from './mapButtonToTheme';
import { mapButtonBaseToTheme } from './mapButtonBaseToTheme';
import { mapButtonGroupToTheme } from './mapButtonGroupToTheme';
import { mapAlertToTheme } from './mapAlertToTheme';
import { mapLinkToTheme } from './mapLinkToTheme';
import { mapProgressBarToTheme } from './mapProgressBarToTheme';
import { mapSpinnerToTheme } from './mapSpinnerToTheme';
import { mapAvatarToTheme } from './mapAvatarToTheme';
import { mapChipToTheme } from './mapChipToTheme';
import { mapNotificationBadgeToTheme } from './mapNotificationBadgeToTheme';
import { mapTooltipToTheme } from './mapTooltipToTheme';
import { mapCardToTheme } from './mapCardToTheme';
import { mapDialogToTheme } from './mapDialogToTheme';
import { mapCheckboxToTheme } from './mapCheckboxToTheme';
import { mapRadioToTheme } from './mapRadioToTheme';
import { mapSelectionControlChromeToTheme } from './mapSelectionControlChromeToTheme';
import { mapTextFieldToTheme } from './mapTextFieldToTheme';
import { mapFormLabelToTheme } from './mapFormLabelToTheme';
import { mapSliderToTheme } from './mapSliderToTheme';
import { mapDatePickersToTheme } from './mapDatePickersToTheme';
import { mapSwitchToTheme } from './mapSwitchToTheme';
import { mapSelectToTheme } from './mapSelectToTheme';
import { mapAccordionToTheme } from './mapAccordionToTheme';
import { mapListToTheme } from './mapListToTheme';
import { mapStepperToTheme } from './mapStepperToTheme';
import { mapTabsToTheme } from './mapTabsToTheme';

export function mapFoundationTokens(product: HarmonyProduct) {
  const typography = mapTypographyToTheme();
  const spacing = mapSpacingToTheme();
  const elevations = mapElevationsToTheme();
  const lightPalette = mapColorsToPalette(product, 'light');
  const darkPalette = mapColorsToPalette(product, 'dark');

  return {
    ...typography,
    ...spacing,
    shadows: elevations.light.shadows,
    colorSchemes: {
      light: {
        ...lightPalette,
        shadows: elevations.light.shadows,
      },
      dark: {
        ...darkPalette,
        shadows: elevations.dark.shadows,
      },
    },
    components: {
      ...mapButtonBaseToTheme(product),
      ...mapButtonToTheme(product),
      ...mapButtonGroupToTheme(product),
      ...mapLinkToTheme(product),
      ...mapAlertToTheme(product),
      ...mapProgressBarToTheme(product),
      ...mapSpinnerToTheme(product),
      ...mapAvatarToTheme(product),
      ...mapChipToTheme(product),
      ...mapNotificationBadgeToTheme(product),
      ...mapTooltipToTheme(product),
      ...mapCardToTheme(product),
      ...mapDialogToTheme(product),
      ...mapCheckboxToTheme(product),
      ...mapRadioToTheme(product),
      ...mapSelectionControlChromeToTheme(product),
      ...mapTextFieldToTheme(product),
      ...mapDatePickersToTheme(product),
      ...mapFormLabelToTheme(product),
      ...mapSliderToTheme(product),
      ...mapSwitchToTheme(product),
      ...mapSelectToTheme(product),
      ...mapAccordionToTheme(product),
      ...mapListToTheme(product),
      ...mapStepperToTheme(product),
      ...mapTabsToTheme(product),
    },
  };
}
