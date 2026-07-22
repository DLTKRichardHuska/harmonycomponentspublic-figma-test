import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';

const linkVariants = cva(
  [
    'inline font-normal text-link no-underline',
    'transition-colors',
    'hover:underline',
  ],
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      muted: {
        true: 'text-muted-foreground hover:text-foreground hover:no-underline',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      muted: false,
    },
  },
);

export type LinkSize = NonNullable<VariantProps<typeof linkVariants>['size']>;

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof linkVariants> {
  href: string;
  /** Opens in a new tab with noopener and shows external Icon. */
  external?: boolean;
  muted?: boolean;
  size?: LinkSize;
  asChild?: boolean;
  children?: ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    className,
    href,
    external = false,
    muted = false,
    size = 'md',
    asChild = false,
    children,
    target,
    rel,
    ...rest
  },
  ref,
) {
  const Comp = asChild ? Slot : 'a';
  const externalTarget = external ? '_blank' : target;
  const externalRel = external ? 'noopener noreferrer' : rel;

  return (
    <Comp
      ref={ref}
      href={href}
      target={externalTarget}
      rel={externalRel}
      className={cn(linkVariants({ size, muted }), className)}
      {...rest}
    >
      {children}
      {external && !asChild ? (
        <Icon
          name="arrow-top-right-on-square"
          size="xs"
          className="ml-1 inline-flex align-middle"
        />
      ) : null}
    </Comp>
  );
});

export { linkVariants };
