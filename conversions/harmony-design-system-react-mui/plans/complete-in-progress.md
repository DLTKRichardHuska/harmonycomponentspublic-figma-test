# Plan: Complete in-progress elements

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** Spinner, Avatar, Checkbox, RadioButton, CheckboxGroup, RadioGroup  
**Approved by:** user (execute Complete in-progress MUI plan)  
**Date:** 2026-07-14

## Strategy sources (reuse — do not re-litigate)

- [button-group-spinner-avatar.md](./button-group-spinner-avatar.md) — Spinner, Avatar
- [checkbox-radio-form-controls.md](./checkbox-radio-form-controls.md) — Checkbox, CheckboxGroup, RadioButton, RadioGroup

## Sequence

1. Spinner — accept Spinner-2 PASS → `synced`
2. Avatar — re-verify → accept → `synced` (keep accepted per-size radius/font gap)
3. Checkbox + RadioButton — accept checkbox-radio-2 PASS → `synced`
4. CheckboxGroup + RadioGroup — unblocked after step 3 → accept → `synced`
5. `compute_coverage.mjs --conversion harmony-design-system-react-mui --write`

## Out of scope

New elements; strategy changes; custom Harmony* wrappers.
