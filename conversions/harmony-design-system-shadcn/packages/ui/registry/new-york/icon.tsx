/**
 * Harmony registry shim — re-exports the package Icon.
 * Do not replace with stock shadcn components or Lucide icons.
 *
 * Preferred (apps): import from the package directly:
 *   import { … } from '@dltkrichardhuska/harmony-design-system-shadcn'
 */
export {
  Icon,
  iconVariants,
  iconSizeDimensions,
  buttonIconSizeMap,
  resolveHeroIcon,
  resolveManifestIcon,
  type IconProps,
  type IconSize,
  type HarmonyButtonSize,
  type HeroIconComponent,
  type ManifestIconEntry,
  type ManifestIconSource,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
