# RightSidebar

Right navigation icon rail via `<harmony-right-sidebar>` (open Shadow DOM). Default sections come from the **product kit** and always lead with **Dela AI** (no `variant` attribute). Override with the `sections` property. Wire panels via `right-sidebar-item-select` — the element does not mutate a ShellPanel.

## Usage

```html
<harmony-right-sidebar></harmony-right-sidebar>
```

```html
<harmony-right-sidebar
  id="rail"
  expanded
  inline
></harmony-right-sidebar>
<script type="module">
  const rail = document.getElementById('rail');
  rail.addEventListener('right-sidebar-item-select', (e) => {
    console.log(e.detail); // { id, label, panelTitle, useGradientHeader?, … }
  });
  // Custom sections
  rail.sections = [
    {
      items: [
        {
          label: 'Dela AI',
          isCustom: true,
          customSrc: 'RS_DelaDefault',
          customSrcActive: 'RS_Dela_Active',
          useGradientHeader: true,
        },
        { icon: 'bell', label: 'Alerts' },
      ],
    },
  ];
</script>
```

Compose `harmony-icon` / custom images internally. Collapsed labels use `harmony-tooltip` (`position="left"`, shown when `panel-open`).

Dela defaults use Harmony custom icon names (`RS_DelaDefault` / `RS_Dela_Active`). For host-hosted SVGs, pass URL paths in `customSrc` / `customSrcActive` instead.

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `active-id` | string | uncontrolled (item `active` / last select) |
| `expanded` | boolean | false — force labels visible |
| `panel-open` | boolean | false — keep rail collapsed; tooltips on hover |
| `inline` | boolean | false — docs embed (static, not fixed) |

## Properties

| Property | Type | Notes |
|----------|------|-------|
| `sections` | `SidebarSection[] \| null` | Replaces product defaults when set |

Item shape: `{ id?, icon?, label, href?, active?, isCustom?, customSrc?, customSrcActive?, panelTitle?, panelIcon?, panelContentId?, useGradientHeader? }`.

`customSrc` / `customSrcActive`: Harmony icon name (no `/`, `.`, or `:`) **or** image URL.

## Events

- `right-sidebar-item-select` (`bubbles`, `composed`) — `detail`: `{ id, label, icon?, href?, panelTitle, panelIcon?, panelContentId?, useGradientHeader? }` (Dela / gradient items set `useGradientHeader`)

## Parts

`nav`, `section`, `item`, `icon`, `label`

## Accessibility

Host wraps a `nav` landmark. Items are `button` (or `a` when `href` is a real URL). Collapsed names via tooltip / expand-on-hover. Forced-colors: shadow-local focus and active (Highlight) fallbacks.

## Gaps vs Astro reference

- No consumer `variant` / multi-theme simultaneous DOM (product-once kits)
- No Astro script that mutates `.shell-panel--right` (deferred until ShellPanel)
- No Astro `class` prop passthrough (use host `class`)
