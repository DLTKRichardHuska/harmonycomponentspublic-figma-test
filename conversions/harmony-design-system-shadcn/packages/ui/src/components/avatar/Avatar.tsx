import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';

const avatarVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden box-border',
    'bg-primary text-white',
  ],
  {
    variants: {
      size: {
        sm: 'h-[var(--avatar-size-sm)] w-[var(--avatar-size-sm)] rounded-[var(--radius-04)]',
        md: 'h-[var(--avatar-size-md)] w-[var(--avatar-size-md)] rounded-[var(--radius-08)]',
        lg: 'h-[var(--avatar-size-lg)] w-[var(--avatar-size-lg)] rounded-[var(--radius-12)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const avatarIconSizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

const initialsSizeClass = {
  sm: 'text-[10px]',
  md: 'text-[12px]',
  lg: 'text-[14px]',
} as const;

export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;
export type AvatarContentVariant = 'icon' | 'initials' | 'image';

function normalizeInitials(s?: string): string {
  if (!s?.trim()) return '';
  const parts = s.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  const t = parts[0] ?? '';
  if (t.length <= 2) return t.toUpperCase();
  return t.slice(0, 2).toUpperCase();
}

export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(function AvatarImage(
  { className, alt = '', ...rest },
  ref,
) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      alt={alt}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...rest}
    />
  );
});

export interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ className, children, ...rest }, ref) {
    return (
      <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center bg-primary text-white',
          className,
        )}
        {...rest}
      >
        {children}
      </AvatarPrimitive.Fallback>
    );
  },
);

type AvatarConvenienceBase = {
  /** Avatar dimensions. */
  size?: AvatarSize;
  /** Content mode. */
  variant?: AvatarContentVariant;
  /** Initials source string (normalized to 1–2 letters). */
  initials?: string;
  /** Image URL when `variant="image"`. */
  src?: string;
  /** Accessible name for image / overall avatar. */
  alt?: string;
  /** Render as button for menu triggers. */
  interactive?: boolean;
  /** Disabled when interactive. */
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

export type AvatarProps =
  | (AvatarConvenienceBase &
      Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'> & {
        interactive: true;
      })
  | (AvatarConvenienceBase &
      Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
        interactive?: false;
      });

export const Avatar = forwardRef<HTMLButtonElement | HTMLDivElement, AvatarProps>(function Avatar(
  props,
  ref,
) {
  const {
    size = 'md',
    variant = 'icon',
    initials: initialsProp,
    src,
    alt = '',
    interactive = false,
    disabled = false,
    className,
    children,
    ...rest
  } = props;

  const initials = normalizeInitials(initialsProp);
  let contentVariant: AvatarContentVariant = variant;
  if (variant === 'initials' && !initials) contentVariant = 'icon';
  if (variant === 'image' && !src && !children) contentVariant = 'icon';

  const ariaLabel =
    contentVariant === 'initials'
      ? `Avatar, initials ${initials}`
      : contentVariant === 'image'
        ? alt || 'User avatar photo'
        : 'User avatar';

  const rootClass = cn(
    avatarVariants({ size }),
    contentVariant === 'image' && 'bg-[var(--surface-bg,transparent)] p-0',
    interactive &&
      !disabled &&
      'cursor-pointer border-0 p-0 appearance-none hover:bg-[var(--theme-primary-hover)]',
    interactive && disabled && 'cursor-not-allowed opacity-50',
    className,
  );

  const content =
    children ??
    (contentVariant === 'image' && src ? (
      <AvatarPrimitive.Root className="h-full w-full">
        <AvatarImage src={src} alt="" />
        <AvatarFallback>
          <Icon name="user" size={avatarIconSizeMap[size]} className="text-white" />
        </AvatarFallback>
      </AvatarPrimitive.Root>
    ) : contentVariant === 'initials' ? (
      <span
        className={cn(
          'font-sans font-semibold uppercase tracking-[0.02em] text-white leading-none',
          initialsSizeClass[size],
        )}
        aria-hidden
      >
        {initials}
      </span>
    ) : (
      <Icon name="user" size={avatarIconSizeMap[size]} className="text-white" />
    ));

  if (interactive) {
    const { onClick, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        className={rootClass}
        onClick={onClick}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      role="img"
      aria-label={ariaLabel}
      className={rootClass}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      {content}
    </div>
  );
});

export { avatarVariants };
