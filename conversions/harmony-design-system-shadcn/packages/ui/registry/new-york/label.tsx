/**
 * Harmony registry shim — re-exports the package Label.
 * Do not replace with stock shadcn components or Lucide icons.
 *
 * Preferred (apps): import from the package directly:
 *   import { … } from '@dltkrichardhuska/harmony-design-system-shadcn'
 */
export {
  Label,
  labelVariants,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  fieldVariants,
  useFieldContext,
  type LabelProps,
  type FieldProps,
  type FieldOrientation,
  type FieldLabelProps,
  type FieldDescriptionProps,
  type FieldErrorProps,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
