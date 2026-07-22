import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';

export const Accordion = forwardRef<
  ElementRef<typeof AccordionPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(function Accordion({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={cn(
        'overflow-hidden rounded-lg border border-solid border-border bg-card',
        className,
      )}
      {...props}
    />
  );
});

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-b border-solid border-border last:border-b-0', className)}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'group flex flex-1 items-center justify-between gap-2',
          'px-4 py-4 text-left',
          'text-sm font-[var(--font-medium)] text-foreground',
          'bg-transparent transition-colors',
          'hover:bg-hover focus:outline-none focus:bg-hover',
          'disabled:cursor-not-allowed disabled:opacity-65 disabled:text-muted-foreground',
          'disabled:hover:bg-transparent disabled:focus:bg-transparent',
          'max-md:px-3 max-md:py-3',
          className,
        )}
        {...props}
      >
        {children}
        <Icon
          name="chevron-down"
          size="sm"
          className={cn(
            'shrink-0 text-muted-foreground transition-transform',
            'group-data-[state=open]:rotate-180',
            'group-disabled:text-muted-foreground group-disabled:opacity-80',
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden text-sm text-secondary',
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className,
      )}
      {...props}
    >
      <div className="px-4 pb-4 max-md:px-3 max-md:pb-3">
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
});
