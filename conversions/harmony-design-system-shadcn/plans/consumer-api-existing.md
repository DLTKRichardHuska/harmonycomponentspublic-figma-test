# Conversion plan

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `consumer-api-existing` (Button, Icon) |
| status | `approved` (parent plan: Consumer API converters; recommended packets) |
| createdAt | `2026-07-18T18:45:00.000Z` |
| referenceVersion | (current conversion manifest) |
| coverageAtPlan | n/a — API remediation only |

## Summary

Lock and document Consumer public APIs for shipped package components. Optimize for AI on shadcn + Tailwind + Radix. Docs must list events/polymorphism, not only Harmony visual props. No breaking API renames.

## Element strategy (user confirmed)

| Element | Strategy | recommendedTarget | userDecision |
|---------|----------|-------------------|--------------|
| Button | component | `Button` | Keep Harmony variants + stack patterns |
| Icon | component | `Icon` | Keep string-name API; non-interactive |

## Consumer API (user confirmed)

### Button

| Field | Value |
|-------|-------|
| Export name | `Button` |
| Base / stack pattern | shadcn-style `cva` + Radix `Slot` (`asChild`) + button/`<a>` polymorphism |
| Inherited props / events | `ButtonHTMLAttributes` when no `href`; `AnchorHTMLAttributes` (minus conflicting `type`) when `href` set — includes `onClick`, `onFocus`, `onKeyDown`, `disabled`, `aria-*`, etc. |
| Harmony-specific props | `variant`, `buttonType`, `size`, `orientation`, `loading`, `loadingText`, `icon` (name string), `iconPosition`, `fullWidth`, `asChild`, `className`, `children` |
| Omissions / divergences | Harmony variant names (not stock shadcn `default`); icons via `icon` string not Lucide children; export `buttonVariants` for composition |
| TypeScript surface | `ButtonProps`, `buttonVariants` |
| Docs / AI artifacts | `docs/components/Button.md` (props + events/polymorphism), `AGENTS.md` |

### Icon

| Field | Value |
|-------|-------|
| Export name | `Icon` |
| Base / stack pattern | Tailwind + `cva` sizes; presentational span/`aria-hidden` |
| Inherited props / events | None for interaction — wrap in `<button>` / `Button` for clicks; `className` for styling |
| Harmony-specific props | `name` (required), `size`, `variant`, `product`, `className` |
| Omissions / divergences | No Lucide/Heroicons/Tabler at call sites; no click handlers on Icon itself |
| TypeScript surface | `IconProps`, `IconSize` |
| Docs / AI artifacts | `docs/components/Icon.md`, `AGENTS.md` |

## Scope

| In scope | Out of scope |
|----------|--------------|
| AI docs + manifest `userDecision` for Consumer API | Visual re-verify / synced flip for Button |
| Clarify events/polymorphism in docs | Breaking prop renames |

## Approval

**Status: approved** — remediate under Consumer API packets above (docs/manifest; no breaking code changes).

| Approved by | Date | Notes |
|-------------|------|-------|
| plan execute | 2026-07-18 | Recommended packets from audit; docs-first |
