import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';
import { Icon } from '../../components/icon';
import { Avatar } from '../../components/avatar';
import { useHarmonyThemeOptional } from '../../theme';
import { FALLBACK_LOGO } from '../../data/product-meta';

export interface CompanyOption {
  id: string;
  name: string;
  color?: string;
}

const DEFAULT_COMPANIES: CompanyOption[] = [
  { id: 'acme-corp', name: 'Acme Corporation', color: '#FF507B' },
  { id: 'ocean-industries', name: 'Ocean Industries', color: '#285F8C' },
  { id: 'violet-systems', name: 'Violet Systems', color: '#DC50FF' },
  { id: 'azure-dynamics', name: 'Azure Dynamics', color: '#5077FF' },
  { id: 'sunset-corporation', name: 'Sunset Corporation', color: '#FFAF50' },
];

export interface ShellHeaderProps extends HTMLAttributes<HTMLElement> {
  /**
   * Product display name. In a single-product build (or under HarmonyThemeProvider)
   * this defaults to the active product's name — pass only to override the brand.
   */
  productName?: string;
  /**
   * Product logo. Defaults to the active product's baked logo (data URI) — pass only
   * to override the brand.
   */
  logoSrc?: string;
  /** Fallback label shown when the picker has no companies to choose from. */
  companyName?: string;
  showCompanyPicker?: boolean;
  /** Overrides the selected-company indicator + header gradient color. Defaults to the selected company's color. */
  companyColor?: string;
  /**
   * Company options for the picker. This is the per-customer list — pass the
   * companies the signed-in user can switch between. Defaults to a built-in demo list.
   */
  companies?: CompanyOption[];
  /** Controlled selected company id. When set, the parent owns selection. */
  selectedId?: string;
  /** Initial selected company id (uncontrolled). Defaults to the first company. */
  defaultSelectedId?: string;
  /** Called when a company is selected. */
  onCompanyChange?: (company: CompanyOption) => void;
  /** Full override of the right-side actions (company picker + avatar). */
  actions?: ReactNode;
  /** Home link target for the brand. */
  brandHref?: string;
}

function gradientFor(color?: string): string | undefined {
  if (!color) return undefined;
  return `linear-gradient(to right, ${color}05, ${color} 50%, ${color}05)`;
}

export const ShellHeader = forwardRef<HTMLElement, ShellHeaderProps>(function ShellHeader(
  {
    className,
    productName,
    logoSrc,
    companyName = 'Company name',
    showCompanyPicker = true,
    companyColor,
    companies,
    selectedId,
    defaultSelectedId,
    onCompanyChange,
    actions,
    brandHref = '/',
    ...props
  },
  ref,
) {
  // Product identity comes from the theme provider (single-product build or demo)
  // unless the caller overrides it with explicit props.
  const theme = useHarmonyThemeOptional();
  const resolvedProductName = productName ?? theme?.productName ?? 'Harmony';
  const resolvedLogoSrc = logoSrc ?? theme?.logoSrc ?? FALLBACK_LOGO;

  const options = companies ?? DEFAULT_COMPANIES;
  const isControlled = selectedId !== undefined;
  const [internalId, setInternalId] = useState(defaultSelectedId ?? options[0]?.id);
  const activeId = isControlled ? selectedId : internalId;
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const pickerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = options.find((c) => c.id === activeId) ?? options[0];
  const activeColor = companyColor ?? selected?.color;
  const displayName = selected ? selected.name : companyName;

  const handleSelect = (company: CompanyOption) => {
    if (!isControlled) setInternalId(company.id);
    setOpen(false);
    onCompanyChange?.(company);
  };

  // Position the portaled menu under the button, aligned to its right edge.
  const updatePosition = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMenuStyle({
      position: 'fixed',
      top: rect.bottom + 8,
      right: Math.max(0, window.innerWidth - rect.right),
      minWidth: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function onDocPointer(e: MouseEvent) {
      const target = e.target as Node;
      if (
        pickerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header ref={ref} data-slot="shell-header" className={cn('shell-header', className)} {...props}>
      <div className="shell-header__brand">
        <a href={brandHref} className="shell-header__brand-link">
          <img src={resolvedLogoSrc} alt="" className="shell-header__logo" />
          <span className="shell-header__title">{resolvedProductName}</span>
        </a>
      </div>

      <div className="shell-header__actions">
        {actions != null ? (
          actions
        ) : (
          <>
            {showCompanyPicker ? (
              <>
                <div className="company-picker" ref={pickerRef}>
                  <button
                    ref={btnRef}
                    type="button"
                    className="company-picker__btn"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                  >
                    <span
                      className="company-picker__indicator"
                      style={activeColor ? { backgroundColor: activeColor } : undefined}
                    />
                    <span className="company-picker__name">{displayName}</span>
                    <Icon name="chevron-down" size="sm" className="company-picker__chevron" />
                  </button>
                  {open && typeof document !== 'undefined'
                    ? createPortal(
                        <div
                          ref={menuRef}
                          className="company-picker__menu"
                          role="listbox"
                          style={menuStyle}
                        >
                          {options.map((company) => (
                            <button
                              type="button"
                              key={company.id}
                              role="option"
                              aria-selected={company.id === activeId}
                              className={cn(
                                'company-picker__option',
                                company.id === activeId && 'company-picker__option--selected',
                              )}
                              onClick={() => handleSelect(company)}
                            >
                              <span
                                className="company-picker__option-indicator"
                                style={company.color ? { backgroundColor: company.color } : undefined}
                              />
                              <span className="company-picker__option-name">{company.name}</span>
                            </button>
                          ))}
                        </div>,
                        document.body,
                      )
                    : null}
                </div>
                <div className="shell-header__divider" />
              </>
            ) : null}
            <Avatar size="sm" variant="icon" interactive />
          </>
        )}
      </div>

      <div className="shell-header__gradient" style={activeColor ? { background: gradientFor(activeColor) } : undefined} />
    </header>
  );
});
