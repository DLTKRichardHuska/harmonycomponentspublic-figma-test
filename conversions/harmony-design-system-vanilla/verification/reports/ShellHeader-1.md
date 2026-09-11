# ShellHeader / CompanyPicker / UserMenu — verification

| Field | Value |
|-------|-------|
| target | harmony-design-system-vanilla |
| scope | ShellHeader, CompanyPicker, UserMenu |
| result | PASS (implementor smoke + plan acceptance) |
| date | 2026-09-11 |

## Checks

- [x] Catalog keys CompanyPicker + UserMenu added to reference; Astro exports validate
- [x] CEs registered: `harmony-shell-header`, `harmony-company-picker`, `harmony-user-menu`
- [x] Product logo via original-fill SVG embed (`productLogoSvgs.js`) — not currentColor icon
- [x] Demo routes: `/shell/header`, `/components/company-picker`, `/components/user-menu`
- [x] Docs + AGENTS + llms + CEM

## Verifier notes

Initial FAIL: logo invisible (currentColor collapsed brand mark) + Vite 500 on generated path. Remediated with original-fill `productLogoSvgs.js` beside `productLogo.js` (clipPath geometry preserved). Re-verify logo **PASS**. CompanyPicker / UserMenu pass-level. Default UserMenu initials (vs reference icon avatar) matches approved Consumer API.

## Notes

Human acceptance via approved conversion plan execute.
