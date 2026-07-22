import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Icon } from '../../components/icon';
import { useHarmonyThemeOptional } from '../../theme';
import {
  itemId,
  rightSidebarDefaults,
  type SidebarItem,
  type SidebarSection,
  type SidebarVariant,
} from '../sidebar-shared';

export interface RightSidebarProps extends HTMLAttributes<HTMLElement> {
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

export const RightSidebar = forwardRef<HTMLElement, RightSidebarProps>(function RightSidebar(
  { className, variant, sections, activeId, onItemSelect, expanded, panelOpen, ...props },
  ref,
) {
  const theme = useHarmonyThemeOptional();
  const resolvedVariant: SidebarVariant = variant ?? theme?.product ?? 'cp';
  const resolved = sections ?? rightSidebarDefaults[resolvedVariant];

  return (
    <nav
      ref={ref}
      data-slot="right-sidebar"
      data-variant={resolvedVariant}
      data-expanded={expanded ? 'true' : undefined}
      data-panel-open={panelOpen ? 'true' : undefined}
      className={cn('right-sidebar', className)}
      {...props}
    >
      {resolved.map((section, sectionIndex) => (
        <div className="right-sidebar__section" key={sectionIndex}>
          {section.items.map((item, index) => {
            const id = itemId(item, sectionIndex, index);
            const isActive = activeId != null ? activeId === id : Boolean(item.active);
            const Element = item.href ? 'a' : 'button';
            return (
              <Element
                key={id}
                {...(item.href ? { href: item.href } : { type: 'button' as const })}
                className="right-sidebar__item"
                data-active={isActive ? 'true' : undefined}
                title={item.label}
                onClick={() => onItemSelect?.(item, id)}
              >
                <span className="right-sidebar__label">{item.label}</span>
                <span className="right-sidebar__icon">
                  {item.isCustom && item.customSrc ? (
                    item.customSrcActive ? (
                      <>
                        <img src={item.customSrc} alt="" className="right-sidebar__dela-logo right-sidebar__dela-logo--default" />
                        <img
                          src={item.customSrcActive}
                          alt=""
                          className="right-sidebar__dela-logo right-sidebar__dela-logo--active"
                        />
                      </>
                    ) : (
                      <img src={item.customSrc} alt="" className="right-sidebar__dela-logo" />
                    )
                  ) : item.icon ? (
                    <Icon name={item.icon} />
                  ) : null}
                </span>
              </Element>
            );
          })}
        </div>
      ))}
    </nav>
  );
});
