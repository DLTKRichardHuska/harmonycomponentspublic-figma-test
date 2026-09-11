# Dialog

Modal dialog as `<harmony-dialog>` — open Shadow DOM wrapping a native `<dialog>` (`showModal` / `close`).

## Usage

```html
<harmony-button type="button" id="open">Open</harmony-button>
<harmony-dialog id="dlg" title="Dialog Title" confirm-label="Confirm" cancel-label="Cancel">
  <p>Dialog content.</p>
</harmony-dialog>

<script type="module">
  open.addEventListener('click', () => dlg.show());
  dlg.addEventListener('confirm', () => {
    // save…
    dlg.close({ force: true });
  });
</script>
```

### Form-safe (production)

```html
<harmony-dialog
  id="form-dialog"
  title="Edit item"
  close-on-backdrop="false"
  confirm-unsaved
  unsaved-message="Discard unsaved edits?"
>
  <form id="edit"><!-- … --></form>
</harmony-dialog>

<script type="module">
  edit.addEventListener('input', () => { formDialog.dirty = true; });
  formDialog.addEventListener('confirm', () => {
    formDialog.dirty = false;
    formDialog.close({ force: true });
  });
  formDialog.addEventListener('close-request', (e) => {
    // optional: e.preventDefault(); show custom UI
  });
</script>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `title` | string | — (also sets native HTML tooltip) |
| `header-variant` | default \| primary | default |
| `button-alignment` | left \| right | left |
| `resizable` | boolean | true |
| `open` | boolean (reflected) | false |
| `close-on-backdrop` | boolean | true |
| `dirty` | boolean | false |
| `confirm-unsaved` | boolean | false |
| `confirm-label` / `cancel-label` / `tertiary-label` | string | Confirm / Cancel / — |
| `unsaved-title` / `unsaved-message` / `unsaved-discard-label` / `unsaved-stay-label` | string | defaults below |

Unsaved defaults: title `Unsaved changes`; message `You have unsaved changes. Discard them?`; discard `Discard`; stay `Keep editing`.

## Methods

- **`show()`** — `showModal()` on the inner dialog
- **`close({ force?: boolean })`** — request close; `force: true` skips the unsaved gate

## Events

| Event | When |
|-------|------|
| `close-request` | Cancelable; `detail.reason`: `backdrop` \| `escape` \| `close-button` \| `cancel` \| `api` |
| `close` | After the dialog actually closes |
| `confirm` / `cancel` / `tertiary` | Convenience footer buttons (`cancel` also requests close) |

Convenience **Confirm** / **tertiary** do **not** auto-close — save then `close({ force: true })`.

## Slots

- **default** — body
- **`footer`** — composed actions in a plain wrapper (e.g. `<div slot="footer">…</div>`); no special class required — same pattern as Alert `actions`. Wins over convenience labels. Buttons get `gap: var(--space-3)` via `::slotted`.

```html
<harmony-dialog title="Confirm">
  <p>Are you sure?</p>
  <div slot="footer">
    <harmony-button type="button" button-type="theme">Confirm</harmony-button>
    <harmony-button type="button" button-type="theme" variant="secondary">Cancel</harmony-button>
  </div>
</harmony-dialog>
```

## Parts

`dialog`, `header`, `title`, `close`, `body`, `footer`, `grip`, `unsaved`

## Dismiss algorithm

1. Backdrop click only if `close-on-backdrop`. Escape, X, Cancel, and `close()` request close.
2. Fire cancelable `close-request`.
3. If `dirty` and not forced: nested confirm when `confirm-unsaved`; else stay open.
4. Else close and emit `close`.

## Accessibility

Native modal dialog (focus trap, Escape, restore). Title via `aria-labelledby`. Nested unsaved confirm is modal with `close-on-backdrop` effectively locked (Stay / Escape keep editing). Forced-colors: shadow-local.

## Notes

- No `window.openDialog` / `closeDialog` / `confirmCallbackName` globals
- No public document `.dialog-overlay` recipe (CE-only)
- Close control: `harmony-button` ghost lg `icon="x-mark"`
