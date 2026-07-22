import {
  Children,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  [
    'flex flex-col overflow-hidden rounded-xl border border-solid',
    'border-border bg-card text-foreground',
  ].join(' '),
  {
    variants: {
      elevated: {
        true: 'shadow-lg',
        false: 'shadow-sm',
      },
      interactive: {
        true: [
          'cursor-pointer transition-[border-color,box-shadow]',
          'hover:border-primary hover:shadow-lg',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          'focus-visible:outline-primary',
        ].join(' '),
        false: '',
      },
      primary: {
        true: 'border-t-[length:var(--space-1)] border-t-[var(--theme-primary)]',
        false: '',
      },
    },
    defaultVariants: {
      elevated: false,
      interactive: false,
      primary: false,
    },
  },
);

export type CardElevated = NonNullable<VariantProps<typeof cardVariants>['elevated']>;

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        'flex items-start justify-between gap-2 px-4 pt-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
  asChild?: boolean;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { className, children, asChild = false, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : 'h2';
  return (
    <Comp
      ref={ref}
      data-slot="card-title"
      className={cn(
        'm-0 font-display text-[length:var(--heading-s)] font-normal',
        'leading-[var(--space-6)] text-foreground',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
});
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, children, ...rest }, ref) {
    return (
      <p
        ref={ref}
        data-slot="card-description"
        className={cn(
          'm-0 font-sans text-[length:var(--label)]',
          'leading-[var(--space-5)] text-secondary',
          className,
        )}
        {...rest}
      >
        {children}
      </p>
    );
  },
);
CardDescription.displayName = 'CardDescription';

export interface CardActionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Top-right header actions (icons/buttons) — shadcn CardAction. */
export const CardAction = forwardRef<HTMLDivElement, CardActionProps>(function CardAction(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn('flex shrink-0 items-center gap-2', className)}
      {...rest}
    >
      {children}
    </div>
  );
});
CardAction.displayName = 'CardAction';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn('p-4 text-sm text-secondary', className)}
      {...rest}
    >
      {children}
    </div>
  );
});
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        'border-t border-solid border-border bg-[var(--elevated-bg)] p-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = 'CardFooter';

function isCardHeaderElement(child: ReactNode): boolean {
  if (!isValidElement(child)) return false;
  const type = child.type as { displayName?: string } | string;
  if (typeof type === 'string') return false;
  return type === CardHeader || type.displayName === 'CardHeader';
}

function hasCompoundHeader(children: ReactNode): boolean {
  return Children.toArray(children).some(isCardHeaderElement);
}

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof cardVariants> {
  /** Shadow elevation (Harmony). */
  elevated?: boolean;
  /** Hover/pointer styles for clickable cards (Harmony). */
  interactive?: boolean;
  /** 6px top border in theme primary (Harmony). */
  primary?: boolean;
  /**
   * Convenience title — auto-renders `CardHeader` + `CardTitle` when you are **not**
   * composing `CardHeader`. Compound children win.
   */
  title?: string;
  /**
   * Convenience description — with `title`, or alone when not composing `CardHeader`.
   */
  description?: string;
  /** Merge props onto a single child (Radix Slot). */
  asChild?: boolean;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    elevated = false,
    interactive = false,
    primary = false,
    title,
    description,
    asChild = false,
    className,
    children,
    tabIndex,
    role,
    ...rest
  },
  ref,
) {
  const classes = cn(cardVariants({ elevated, interactive, primary }), className);
  const useConvenience =
    Boolean(title || description) && !hasCompoundHeader(children);

  const body: ReactNode = useConvenience ? (
    <>
      <CardHeader>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {title ? <CardTitle>{title}</CardTitle> : null}
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </>
  ) : (
    children
  );

  if (asChild) {
    const child = Children.only(children) as ReactElement;
    return (
      <Slot ref={ref} className={classes} {...rest}>
        {child}
      </Slot>
    );
  }

  return (
    <div
      ref={ref}
      data-slot="card"
      className={classes}
      tabIndex={interactive && tabIndex === undefined ? 0 : tabIndex}
      role={interactive && role === undefined ? 'button' : role}
      {...rest}
    >
      {body}
    </div>
  );
});
Card.displayName = 'Card';

export { cardVariants };
