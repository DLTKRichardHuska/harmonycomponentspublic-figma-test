# LeftSidebar

Left navigation icon rail via `<harmony-left-sidebar>` (open Shadow DOM). Default sections come from the **product kit** (no `variant` attribute). Override with the `sections` property. Wire panels via `left-sidebar-item-select` — the element does not mutate a ShellPanel.

## Usage

```html
<harmony-left-sidebar></harmony-left-sidebar>
```

```html
<harmony-left-sidebar
  id="rail"
  expanded
  inline
></harmony-left-sidebar>
<script type="module">
  const rail = document.getElementById('rail');
  rail.addEventListener('left-sidebar-item-select', (e) => {
    console.log(e.detail); // { id, label, panelTitle, … }
  });
  // Custom sections
  rail.sections = [
    {
      items: [
        { icon: 'home', label: 'Home', active: true },
        { icon: 'cog-6-tooth', label: 'Settings' },
      ],
    },
  ];
</script>
```

Compose `harmony-icon` / custom images internally. Collapsed labels use `harmony-tooltip` (shown when `panel-open`).

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

Item shape: `{ id?, icon?, label, href?, active?, isCustom?, customSrc?, panelTitle?, panelIcon?, panelContentId?, useGradientHeader? }`.

## Events

- `left-sidebar-item-select` (`bubbles`, `composed`) — `detail`: `{ id, label, icon?, href?, panelTitle, panelIcon?, panelContentId?, useGradientHeader? }`

## Parts

`nav`, `section`, `item`, `icon`, `label`

## Accessibility

Host wraps a `nav` landmark. Items are `button` (or `a` when `href` is a real URL). Collapsed names via tooltip / expand-on-hover. Forced-colors: shadow-local focus and active (Highlight) fallbacks.

## Gaps vs Astro reference

- No consumer `variant` / multi-theme simultaneous DOM (product-once kits)
- No Astro script that mutates `.shell-panel--left` (deferred until ShellPanel)
