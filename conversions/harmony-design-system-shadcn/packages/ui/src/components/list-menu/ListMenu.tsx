import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';

const listMenuVariants = cva(
  'm-0 flex list-none flex-col overflow-hidden rounded-lg border border-solid border-border bg-card p-0',
  {
    variants: {
      variant: {
        default:
          '[&>li:not(:last-child)]:border-b [&>li:not(:last-child)]:border-solid [&>li:not(:last-child)]:border-border',
        'no-borders': '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const listMenuButtonVariants = cva([
  'group flex w-full items-center gap-3 px-4 py-3 max-md:min-h-[44px]',
  'text-left text-sm text-foreground no-underline',
  'cursor-pointer border-0 bg-transparent transition-colors',
  'hover:bg-hover hover:no-underline',
  'focus-visible:outline-none focus-visible:bg-hover',
  'data-[active=true]:bg-primary data-[active=true]:text-white',
  'data-[active=true]:hover:bg-[var(--theme-primary-hover)]',
  'disabled:cursor-not-allowed disabled:opacity-65',
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-65',
]);

export type ListMenuVariant = NonNullable<VariantProps<typeof listMenuVariants>['variant']>;

export interface ListMenuProps
  extends HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof listMenuVariants> {}

export const ListMenu = forwardRef<HTMLUListElement, ListMenuProps>(function ListMenu(
  { className, variant = 'default', ...props },
  ref,
) {
  return (
    <ul
      ref={ref}
      data-slot="list-menu"
      data-variant={variant}
      className={cn(listMenuVariants({ variant }), className)}
      {...props}
    />
  );
});

export type ListMenuItemProps = HTMLAttributes<HTMLLIElement>;

export const ListMenuItem = forwardRef<HTMLLIElement, ListMenuItemProps>(function ListMenuItem(
  { className, ...props },
  ref,
) {
  return (
    <li ref={ref} data-slot="list-menu-item" className={cn('list-none', className)} {...props} />
  );
});

export interface ListMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Mark the item as the active / current destination. */
  isActive?: boolean;
  /** Harmony icon name rendered before the label (resolved via package Icon). */
  icon?: string;
  /** Render the child element instead of a button (e.g. an `<a>` or router Link). */
  asChild?: boolean;
}

export const ListMenuButton = forwardRef<HTMLButtonElement, ListMenuButtonProps>(
  function ListMenuButton(
    { className, isActive = false, icon, asChild = false, type, children, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : 'button';

    const leadingIcon = icon ? (
      <Icon
        name={icon}
        size="md"
        className={cn(
          'shrink-0',
          isActive
            ? 'text-white'
            : 'text-[var(--text-muted)] transition-colors group-hover:text-[var(--theme-primary)]',
        )}
      />
    ) : null;

    return (
      <Comp
        ref={ref as never}
        data-slot="list-menu-button"
        data-active={isActive || undefined}
        className={cn(listMenuButtonVariants(), className)}
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {leadingIcon}
            {children}
          </>
        )}
      </Comp>
    );
  },
);

export { listMenuVariants, listMenuButtonVariants };
