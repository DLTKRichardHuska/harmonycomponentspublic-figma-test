# TabStrip

Tab list as `<harmony-tab-strip>` (open Shadow DOM). **Panels are consumer-owned** outside this element — wire `selected` / `tab-select` to show your own content.

## Usage

```html
<harmony-tab-strip id="tabs" selected="overview"></harmony-tab-strip>
<div id="panel-overview" role="tabpanel">Overview</div>
<div id="panel-details" role="tabpanel" hidden>Details</div>
```

```js
const strip = document.querySelector('#tabs');
strip.tabs = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'details', label: 'Details', icon: 'information-circle' },
  { id: 'settings', label: 'Settings', disabled: true },
];

strip.addEventListener('tab-select', (e) => {
  const id = e.detail.id;
  strip.selected = id;
  document.querySelectorAll('[role="tabpanel"]').forEach((p) => {
    p.hidden = p.id !== `panel-${id}`;
  });
});
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `variant` | default \| compact \| pill | default |
| `overflow-mode` | auto \| manual \| none | auto |
| `show-add-tab` | boolean | false |
| `add-tab-label` | string | Add Tab |
| `icon-position` | left \| right \| top | — (per-tab or left) |
| `show-tab-open-in-new` | boolean | false |
| `show-tab-close` | boolean | false |
| `show-tab-overflow-menu` | boolean | false |
| `selected` | tab `id` | — |

## Properties

| Property | Type | Notes |
|----------|------|-------|
| `tabs` | `TabItem[]` | `{ id, label, icon?, iconPosition?, active?, disabled?, href?, showOpenInNewWindow?, showClose?, showMenu? }` |
| `overflowTabs` | `TabItem[]` | Used when `overflow-mode="manual"` |

## Events

| Event | Detail | When |
|-------|--------|------|
| `tab-select` | `{ id }` | Tab activated |
| `tab-close` | `{ id }` | Close action |
| `tab-add` | — | Add Tab |
| `tab-open-new` | `{ id }` | Open in new window |
| `tab-set-default` | `{ id }` | Set as default (per-tab menu) |

## Notes

- No public document `.tab-strip` recipe; no Astro named slots `tab-0`…`tab-9`
- `href` on a tab renders an `<a role="tab">` (navigation still emits `tab-select`)
- Forced-colors: shadow-local
- Adopt `tabStripSheet` only if embedding the same styles in another Shadow host
