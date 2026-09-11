# Alert

Status / notification message as `<harmony-alert>` (open Shadow DOM).

## Usage

```html
<harmony-alert variant="info" title="Information">
  This is an informational message.
</harmony-alert>

<harmony-alert variant="success" enhanced title="Saved" dismissible>
  Done.
  <div slot="actions">
    <harmony-button size="xs" variant="primary">OK</harmony-button>
    <harmony-button size="xs" variant="secondary">Cancel</harmony-button>
    <a href="/docs">Learn more</a>
  </div>
</harmony-alert>

<harmony-alert variant="warning" enhanced title="Countdown" progress-value="45" dismissible>
  Expiring soon.
</harmony-alert>
```

```js
alert.addEventListener('dismiss', () => alert.remove());
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `variant` | info \| success \| warning \| error | info |
| `enhanced` | boolean | false |
| `title` | string | — |
| `dismissible` | boolean | false |
| `icon` | harmony-icon name | per variant |
| `progress-value` | number (enhanced) | — |

Default icons: info→`information-circle`, success→`check-circle`, warning→`exclamation-triangle`, error→`exclamation-circle`.

## Slots

- **default** — message body
- **`actions`** — enhanced actions row; compose `harmony-button`, native `.btn`, and/or `<a>` links (use `.text-xs` for Astro-compact link size)

## Events

- **`dismiss`** — CustomEvent (`bubbles`, `composed`) when the close control is activated. The host is **not** removed automatically.

## Parts

`border`, `icon`, `title`, `message`, `close`, `actions`, `progress`

## Accessibility

`role="alert"`. Close button `aria-label="Dismiss"`. Forced-colors: shadow-local.

## Notes

- No public document `.alert` recipe (CE-only)
- No Astro `primaryButton` / `linkText` props — use the `actions` slot
- Boolean `enhanced` instead of Astro `style="enhanced"` (HTML `style` reserved)
- `progress-value` composes synced `<harmony-progress size="sm">`
