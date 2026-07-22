import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const textareaVariants = cva([
  'w-full min-h-[var(--field-textarea-min-height)] px-[var(--field-padding-x)] py-[var(--field-textarea-padding-y)]',
  'font-sans text-[length:var(--field-font-size)] text-foreground',
  'bg-input border border-solid border-border',
  'rounded-[var(--field-radius)] resize-y transition-all',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[var(--focus-ring-primary)]',
  'disabled:bg-[var(--input-disabled-bg)] disabled:text-muted-foreground disabled:cursor-not-allowed',
  'max-md:min-h-[var(--field-textarea-min-height-mobile)] max-md:px-[var(--field-padding-x-mobile)] max-md:text-base',
]);

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible rows (default 4). */
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(textareaVariants(), className)}
      {...rest}
    />
  );
});

export { textareaVariants };
