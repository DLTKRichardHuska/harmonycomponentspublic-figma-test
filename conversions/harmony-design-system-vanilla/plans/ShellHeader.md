# Conversion plan — ShellHeader / CompanyPicker / UserMenu

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `ShellHeader`, `CompanyPicker`, `UserMenu` |
| status | `completed` |
| createdAt | `2026-09-11T21:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |

## Summary

Ship three catalog **web-components**: `harmony-shell-header`, `harmony-company-picker`, `harmony-user-menu`. Header actions are free composition; product logo from product kit (no logo attribute); optional `gradient-color`.

## Element strategy (user confirmed)

| Element | Strategy | Tag |
|---------|----------|-----|
| ShellHeader | `web-component` | `harmony-shell-header` |
| CompanyPicker | `web-component` | `harmony-company-picker` |
| UserMenu | `web-component` | `harmony-user-menu` |

## Consumer API (user confirmed)

See Cursor plan `vanilla_shell_header` — product-name / gradient-color / actions slot; company-change; name + optional src; no logo-src.

## Blocking dependencies

Avatar, Icon, ListMenu, Tooltip — synced.

## Approval

**Status: completed** — plan execute approved 2026-09-11.
