import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsAddButton } from '../../components/tabs';

export interface ShellFooterTab {
  id: string;
  label: string;
  /** Harmony Icon name (non-active tabs). Active tabs always show a pin. */
  icon?: string;
}

export interface ShellFooterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: ShellFooterTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  showAddButton?: boolean;
  onAddTab?: () => void;
  variant?: 'default' | 'compact';
  /** Extra controls placed after the tabs (e.g. an overflow menu). */
  actions?: ReactNode;
}

export const ShellFooter = forwardRef<HTMLDivElement, ShellFooterProps>(function ShellFooter(
  {
    className,
    tabs,
    value,
    defaultValue,
    onValueChange,
    showAddButton = true,
    onAddTab,
    variant = 'default',
    actions,
    ...props
  },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.id);
  const active = value ?? internal;

  const handleChange = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div
      ref={ref}
      data-slot="shell-footer"
      data-variant={variant}
      className={cn('shell-footer', className)}
      {...props}
    >
      <Tabs value={active} onValueChange={handleChange} className="w-full">
        <TabsList variant={variant === 'compact' ? 'compact' : 'default'} className="w-full border-b-0">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} icon={tab.id === active ? 'pin' : tab.icon}>
              {tab.label}
            </TabsTrigger>
          ))}
          {showAddButton ? <TabsAddButton onClick={onAddTab} /> : null}
          {actions}
        </TabsList>
      </Tabs>
    </div>
  );
});
