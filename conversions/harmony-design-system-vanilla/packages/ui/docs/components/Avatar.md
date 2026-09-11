# Avatar

User avatar as `<harmony-avatar>` (open Shadow DOM).

## Usage

```html
<harmony-avatar size="md"></harmony-avatar>
<harmony-avatar variant="initials" initials="Jane Doe"></harmony-avatar>
<harmony-avatar variant="image" src="/photo.jpg" alt="Jane Doe"></harmony-avatar>
<harmony-avatar interactive></harmony-avatar>
```

```js
avatar.addEventListener('click', () => openMenu());
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `size` | sm \| md \| lg | md |
| `variant` | icon \| initials \| image | icon |
| `initials` | string | — |
| `src` | URL | — |
| `alt` | string | — |
| `interactive` | boolean | false |
| `disabled` | boolean | false |

Missing initials/src falls back to the default `user` icon. Initials are normalized (first + last initial, or up to two characters).

## Events

- `click` — when `interactive` and not `disabled`. Enter/Space synthesize `click`.

## Parts

- `icon`, `initials`, `image`

## Accessibility

Non-interactive: `role="img"` + label. Interactive: `role="button"`, focusable, `delegatesFocus`. Image `alt=""`; name on host. Forced-colors: shadow-local.
