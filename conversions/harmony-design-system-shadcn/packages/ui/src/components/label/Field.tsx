import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Label, type LabelProps } from './Label';

const fieldVariants = cva('flex gap-1.5', {
  variants: {
    orientation: {
      stacked: 'flex-col',
      horizontal: 'flex-row items-center gap-3',
      // Token-driven: layout follows the active product's --field-label-* vars
      // (column/stacked by default, row/inline for CP) with no product logic.
      auto: '[flex-direction:var(--field-label-flex-direction)] [align-items:var(--field-label-align-items)] gap-[var(--field-label-gap)]',
    },
  },
  defaultVariants: {
    orientation: 'stacked',
  },
});

export type FieldOrientation = NonNullable<VariantProps<typeof fieldVariants>['orientation']>;

interface FieldContextValue {
  orientation: FieldOrientation;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue>({
  orientation: 'stacked',
  invalid: false,
});

export function useFieldContext() {
  return useContext(FieldContext);
}

export interface FieldProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fieldVariants> {
  /** Layout: stacked (label above) or horizontal (label beside). */
  orientation?: FieldOrientation;
  /** Marks the field invalid for styling (pair with aria-invalid on the control). */
  'data-invalid'?: boolean | '';
  children?: ReactNode;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { className, orientation = 'stacked', children, ...rest },
  ref,
) {
  const invalidAttr = rest['data-invalid'];
  const invalid = invalidAttr === true || invalidAttr === '';
  return (
    <FieldContext.Provider value={{ orientation, invalid }}>
      <div
        ref={ref}
        role="group"
        data-orientation={orientation}
        className={cn(fieldVariants({ orientation }), className)}
        {...rest}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
});

export interface FieldLabelProps extends LabelProps {}

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, ...rest },
  ref,
) {
  const { orientation } = useFieldContext();
  return (
    <Label
      ref={ref}
      className={cn(
        orientation === 'horizontal' && 'mb-0 shrink-0 min-w-[7rem]',
        orientation === 'stacked' && 'mb-1.5',
        orientation === 'auto' &&
          'shrink-0 [margin-bottom:var(--field-label-mb)] min-w-[var(--field-label-min-width)]',
        className,
      )}
      {...rest}
    />
  );
});

export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ className, ...rest }, ref) {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...rest}
      />
    );
  },
);

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(function FieldError(
  { className, ...rest },
  ref,
) {
  return (
    <p
      ref={ref}
      role="alert"
      className={cn('mt-1 text-sm text-error', className)}
      {...rest}
    />
  );
});

export { fieldVariants };
