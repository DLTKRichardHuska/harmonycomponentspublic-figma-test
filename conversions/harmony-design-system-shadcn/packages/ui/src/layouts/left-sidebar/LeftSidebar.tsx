import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Icon } from '../../components/icon';
import { useHarmonyThemeOptional } from '../../theme';
import {
  itemId,
  leftSidebarDefaults,
  type SidebarItem,
  type SidebarSection,
  type SidebarVariant,
} from '../sidebar-shared';

export interface LeftSidebarProps extends HTMLAttributes<HTMLElement> {
  /** Product variant. Defaults to the active product from the theme provider. */
  variant?: SidebarVariant;
  /** Override the default sections for the variant. */
  sections?: SidebarSection[];
  /** Controlled active item id (see itemId). */
  activeId?: string;
  onItemSelect?: (item: SidebarItem, id: string) => void;
  /** Force the expanded (labels visible) state, e.g. for docs. */
  expanded?: boolean;
  /** Signals a ShellPanel is open — collapses the rail and unifies with the panel. */
  panelOpen?: boolean;
}

export const LeftSidebar = forwardRef<HTMLElement, LeftSidebarProps>(function LeftSidebar(
  { className, variant, sections, activeId, onItemSelect, expanded, panelOpen, ...props },
  ref,
) {
  const theme = useHarmonyThemeOptional();
  const resolvedVariant: SidebarVariant = variant ?? theme?.product ?? 'cp';
  const resolved = sections ?? leftSidebarDefaults[resolvedVariant];

  return (
    <nav
      ref={ref}
      data-slot="left-sidebar"
      data-variant={resolvedVariant}
      data-expanded={expanded ? 'true' : undefined}
      data-panel-open={panelOpen ? 'true' : undefined}
      className={cn('left-sidebar', className)}
      {...props}
    >
      {resolved.map((section, sectionIndex) => (
        <div className="left-sidebar__section" key={sectionIndex}>
          {section.items.map((item, index) => {
            const id = itemId(item, sectionIndex, index);
            const isActive = activeId != null ? activeId === id : Boolean(item.active);
            const Element = item.href ? 'a' : 'button';
            return (
              <Element
                key={id}
                {...(item.href ? { href: item.href } : { type: 'button' as const })}
                className="left-sidebar__item"
                data-active={isActive ? 'true' : undefined}
                title={item.label}
                onClick={() => onItemSelect?.(item, id)}
              >
                <span className="left-sidebar__icon">
                  {item.isCustom && item.customSrc ? (
                    <img src={item.customSrc} alt="" />
                  ) : item.icon ? (
                    <Icon name={item.icon} />
                  ) : null}
                </span>
                <span className="left-sidebar__label">{item.label}</span>
              </Element>
            );
          })}
        </div>
      ))}
    </nav>
  );
});
