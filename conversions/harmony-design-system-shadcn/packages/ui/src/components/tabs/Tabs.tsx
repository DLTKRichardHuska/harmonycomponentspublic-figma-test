import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';
import { Button } from '../button';

export type TabsVariant = 'default' | 'compact' | 'pill';
export type TabsIconPosition = 'left' | 'right' | 'top';
// Built-in list overflow. For auto "move overflowing tabs into a menu", compose useTabOverflow.
export type TabsOverflow = 'none' | 'scroll';

interface TabsListContextValue {
  variant: TabsVariant;
  iconPosition?: TabsIconPosition;
}

const TabsListContext = createContext<TabsListContextValue>({ variant: 'default' });

export const Tabs = TabsPrimitive.Root;

export const tabsListVariants = cva(
  'relative flex w-full items-center gap-1 border-b border-solid border-border',
  {
    variants: {
      variant: {
        default: '',
        compact: '',
        // Pill selected state is VP-only, matching the reference (other products keep the underline).
        pill: '[[data-product=vp]_&]:items-end [[data-product=vp]_&]:gap-2 [[data-product=vp]_&]:pb-2',
      },
      overflow: {
        none: '',
        scroll: 'overflow-x-auto',
      },
    },
    defaultVariants: { variant: 'default', overflow: 'none' },
  },
);

// VP-only pill classes applied to the trigger when variant="pill".
const pillTriggerClasses = cn(
  '[[data-product=vp]_&]:border-b-0 [[data-product=vp]_&]:mb-0',
  '[[data-product=vp]_&]:rounded-[var(--radius-08)]',
  '[[data-product=vp]_&]:px-2 [[data-product=vp]_&]:py-1.5',
  '[[data-product=vp]_&]:text-primary',
  '[[data-product=vp]_&]:data-[state=active]:bg-primary',
  '[[data-product=vp]_&]:data-[state=active]:text-[color:var(--text-inverse)]',
  '[[data-product=vp]_&]:data-[state=active]:border-b-0',
  '[[data-product=vp]_&]:data-[state=active]:font-semibold',
);

export const tabsTriggerVariants = cva(
  [
    'relative -mb-px inline-flex cursor-pointer items-center whitespace-nowrap',
    'border-b-2 border-transparent bg-transparent font-sans font-medium text-secondary',
    'transition-all',
    'hover:text-foreground',
    'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-primary)]',
    'data-[state=active]:border-primary data-[state=active]:text-primary',
    'disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-60',
  ],
  {
    variants: {
      variant: {
        default: 'px-4 py-3 text-sm',
        compact: 'px-3 py-2 text-[13px]',
        pill: cn('px-4 py-3 text-sm', pillTriggerClasses),
      },
      iconPosition: {
        left: 'flex-row gap-2',
        right: 'flex-row-reverse gap-2',
        top: 'flex-col gap-1',
      },
    },
    defaultVariants: { variant: 'default', iconPosition: 'left' },
  },
);

export interface TabsListProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    Pick<VariantProps<typeof tabsListVariants>, 'overflow'> {
  variant?: TabsVariant;
  /** Enforce a single icon position across all triggers (overrides per-trigger iconPosition). */
  iconPosition?: TabsIconPosition;
}

export const TabsList = forwardRef<ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  function TabsList({ className, variant = 'default', iconPosition, overflow = 'none', children, ...props }, ref) {
    return (
      <TabsListContext.Provider value={{ variant, iconPosition }}>
        <TabsPrimitive.List
          ref={ref}
          className={cn(tabsListVariants({ variant, overflow }), className)}
          {...props}
        >
          {children}
        </TabsPrimitive.List>
      </TabsListContext.Provider>
    );
  },
);

export interface TabsTriggerProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** Harmony Icon name. */
  icon?: string;
  /** Per-trigger icon position (overridden by TabsList iconPosition). */
  iconPosition?: TabsIconPosition;
  /** Per-tab toolbar (close / open-in-new / kebab menu) composed beside the label. */
  actions?: ReactNode;
}

export const TabsTrigger = forwardRef<ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  function TabsTrigger({ className, icon, iconPosition, actions, asChild, children, ...props }, ref) {
    const { variant, iconPosition: listIconPosition } = useContext(TabsListContext);
    const resolvedIconPosition = listIconPosition ?? iconPosition ?? 'left';

    const trigger = (
      <TabsPrimitive.Trigger
        ref={ref}
        asChild={asChild}
        // When wrapped by actions, the cell is the overflow unit; otherwise the trigger is.
        data-overflow-item={actions ? undefined : ''}
        className={cn(
          tabsTriggerVariants({ variant, iconPosition: resolvedIconPosition }),
          className,
        )}
        {...props}
      >
        {asChild ? (
          // asChild hands full control of the element to the consumer (e.g. a router Link);
          // icon/label composition is up to them.
          children
        ) : (
          <>
            {icon ? <Icon name={icon} size="sm" className="shrink-0" /> : null}
            {children}
          </>
        )}
      </TabsPrimitive.Trigger>
    );

    if (!actions) return trigger;

    return (
      <div data-overflow-item="" className="inline-flex items-stretch">
        {trigger}
        <div className="flex items-center gap-1 px-1">{actions}</div>
      </div>
    );
  },
);

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'pt-4 text-sm text-secondary focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  );
});

export type TabsAddButtonProps = ComponentPropsWithoutRef<typeof Button>;

export const TabsAddButton = forwardRef<HTMLButtonElement, TabsAddButtonProps>(
  function TabsAddButton({ className, children = 'Add Tab', ...props }, ref) {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        icon="plus"
        className={cn('ml-2 shrink-0', className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);
