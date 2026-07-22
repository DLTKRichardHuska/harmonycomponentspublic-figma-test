import { forwardRef, type LabelHTMLAttributes, type ReactNode } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const labelVariants = cva(
  [
    'font-display text-sm font-normal text-foreground',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  ],
  {
    variants: {
      required: {
        true: "after:ml-0.5 after:text-error after:content-['*']",
        false: '',
      },
    },
    defaultVariants: {
      required: false,
    },
  },
);

export interface LabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'>,
    VariantProps<typeof labelVariants> {
  /** Associate with a control id (React `htmlFor`, not Astro `for`). */
  htmlFor?: string;
  /** Shows a required asterisk after the label text. */
  required?: boolean;
  /** Helper text shown in parentheses after the label. */
  helper?: string;
  children?: ReactNode;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, required = false, helper, children, ...rest },
  ref,
) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants({ required }), className)}
      {...rest}
    >
      {children}
      {helper ? (
        <span className="font-normal text-muted-foreground"> ({helper})</span>
      ) : null}
    </LabelPrimitive.Root>
  );
});

export { labelVariants };
