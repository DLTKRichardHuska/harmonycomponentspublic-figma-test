#!/usr/bin/env node
/** Generate a minimal Custom Elements Manifest from known exports. Expand as elements convert. */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..');

const manifest = {
  schemaVersion: '1.0.0',
  readme: 'AGENTS.md',
  modules: [
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyElement.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyElement',
          customElement: true,
          description:
            'Base class for Harmony Custom Elements (open Shadow DOM, adoptedStyleSheets). Concrete tags are defined as catalog elements convert.',
          members: [
            {
              kind: 'method',
              name: 'emit',
              description: 'Dispatch a composed CustomEvent',
            },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyElement', declaration: { name: 'HarmonyElement' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyIcon.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyIcon',
          tagName: 'harmony-icon',
          customElement: true,
          description:
            'Presentational outline icon with bundled Heroicons, Harmony custom glyphs, app registration, and raw SVG slot override.',
          members: [
            {
              kind: 'field',
              name: 'name',
              type: { text: 'string' },
              attribute: 'name',
              description: 'Icon registry name.',
            },
            {
              kind: 'field',
              name: 'size',
              type: { text: "'xs' | 'sm' | 'md' | 'lg' | 'xl'" },
              default: "'md'",
              attribute: 'size',
              description: 'Token-backed icon size.',
            },
            {
              kind: 'field',
              name: 'label',
              type: { text: 'string' },
              attribute: 'label',
              description: 'Optional accessible name; otherwise the icon is decorative.',
            },
          ],
          slots: [
            {
              name: '',
              description: 'Raw SVG override. Slotted content wins over registry lookup.',
            },
          ],
          cssParts: [
            { name: 'svg', description: 'The generated SVG.' },
            { name: 'fallback', description: 'Missing-icon question-mark fallback.' },
          ],
        },
        {
          kind: 'function',
          name: 'registerIcons',
          description:
            'Register or replace trusted app SVG markup by name. Merges into a document-global map; connected harmony-icon instances refresh. Lookup: slot → registerIcons → Harmony custom → Hero outline → fallback. Throws TypeError if a name is empty or the value is not a string with an <svg> root.',
          parameters: [
            {
              name: 'map',
              type: { text: 'Record<string, string> | Map<string, string>' },
              description: 'Icon name → SVG markup string.',
            },
          ],
        },
      ],
      exports: [
        { kind: 'js', name: 'HarmonyIcon', declaration: { name: 'HarmonyIcon' } },
        { kind: 'js', name: 'registerIcons', declaration: { name: 'registerIcons' } },
      ],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyButton.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyButton',
          tagName: 'harmony-button',
          customElement: true,
          description:
            'Light-DOM hybrid button helper. Maps attributes to the native button / .btn class recipe. formAssociated via ElementInternals. Not a real HTMLButtonElement — use native button or input[type=submit] when querySelector/form drop-ins matter. No href (use <a class="btn">).',
          members: [
            {
              kind: 'field',
              name: 'variant',
              type: {
                text: "'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'destructive'",
              },
              default: "'primary'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'buttonType',
              type: { text: "'theme' | 'pageHeader'" },
              default: "'theme'",
              attribute: 'button-type',
            },
            {
              kind: 'field',
              name: 'size',
              type: { text: "'xs' | 'sm' | 'md' | 'lg'" },
              default: "'md'",
              attribute: 'size',
            },
            {
              kind: 'field',
              name: 'orientation',
              type: { text: "'horizontal' | 'vertical'" },
              default: "'horizontal'",
              attribute: 'orientation',
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'loading',
              type: { text: 'boolean' },
              attribute: 'loading',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'loadingText',
              type: { text: 'string' },
              attribute: 'loading-text',
            },
            {
              kind: 'field',
              name: 'icon',
              type: { text: 'string' },
              attribute: 'icon',
              description: 'harmony-icon name',
            },
            {
              kind: 'field',
              name: 'iconPosition',
              type: { text: "'left' | 'right'" },
              default: "'left'",
              attribute: 'icon-position',
            },
            {
              kind: 'field',
              name: 'type',
              type: { text: "'button' | 'submit' | 'reset'" },
              default: "'button'",
              attribute: 'type',
            },
            {
              kind: 'field',
              name: 'fullWidth',
              type: { text: 'boolean' },
              attribute: 'full-width',
              reflect: true,
            },
          ],
          slots: [
            {
              name: '',
              description: 'Button label text (light DOM children).',
            },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyButton', declaration: { name: 'HarmonyButton' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyCard.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyCard',
          tagName: 'harmony-card',
          customElement: true,
          description:
            'Light-DOM hybrid card helper. Maps attributes to the native .card BEM recipe and wraps light-DOM slot markers (header, header-actions, footer) into structure. interactive applies role=button, focus, and Enter/Space → click. No form association. title also sets the HTML tooltip attribute.',
          members: [
            {
              kind: 'field',
              name: 'elevated',
              type: { text: 'boolean' },
              attribute: 'elevated',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'interactive',
              type: { text: 'boolean' },
              attribute: 'interactive',
              reflect: true,
              description:
                'Hover/cursor class plus button a11y (role=button, tabindex, Enter/Space).',
            },
            {
              kind: 'field',
              name: 'primary',
              type: { text: 'boolean' },
              attribute: 'primary',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'title',
              type: { text: 'string' },
              attribute: 'title',
              description:
                'Header title when no slot=header child. Also the HTML tooltip attribute.',
            },
            {
              kind: 'field',
              name: 'subtitle',
              type: { text: 'string' },
              attribute: 'subtitle',
              description: 'Header subtitle when no slot=header child.',
            },
          ],
          slots: [
            {
              name: '',
              description: 'Card body content (unmarked light-DOM children).',
            },
            {
              name: 'header',
              description:
                'Custom header content. Takes precedence over title/subtitle attributes.',
            },
            {
              name: 'header-actions',
              description:
                'Header action controls (compose ghost icon-only buttons). Independent of header slot.',
            },
            {
              name: 'footer',
              description: 'Optional footer content.',
            },
          ],
        },
      ],
          exports: [{ kind: 'js', name: 'HarmonyCard', declaration: { name: 'HarmonyCard' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyProgress.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyProgress',
          tagName: 'harmony-progress',
          customElement: true,
          description:
            'Determinate progress bar. Open Shadow DOM. Fill width is computed in shadow; ElementInternals role=progressbar.',
          members: [
            {
              kind: 'field',
              name: 'value',
              type: { text: 'number' },
              default: '0',
              attribute: 'value',
            },
            {
              kind: 'field',
              name: 'max',
              type: { text: 'number' },
              default: '100',
              attribute: 'max',
            },
            {
              kind: 'field',
              name: 'size',
              type: { text: "'sm' | 'md' | 'lg'" },
              default: "'md'",
              attribute: 'size',
            },
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'default' | 'success' | 'warning' | 'error'" },
              default: "'default'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'showLabel',
              type: { text: 'boolean' },
              attribute: 'show-label',
              reflect: true,
            },
          ],
          cssParts: [
            { name: 'track', description: 'Progress track.' },
            { name: 'bar', description: 'Filled bar.' },
            { name: 'label', description: 'Optional percentage label.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyProgress', declaration: { name: 'HarmonyProgress' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonySpinner.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonySpinner',
          tagName: 'harmony-spinner',
          customElement: true,
          description:
            'Loading spinner. Open Shadow DOM. ElementInternals role=status; label sets aria-label.',
          members: [
            {
              kind: 'field',
              name: 'size',
              type: { text: "'sm' | 'md' | 'lg'" },
              default: "'md'",
              attribute: 'size',
            },
            {
              kind: 'field',
              name: 'label',
              type: { text: 'string' },
              default: "'Loading'",
              attribute: 'label',
              description: 'Accessible name for the status region.',
            },
          ],
          cssParts: [{ name: 'spinner', description: 'Animated ring.' }],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonySpinner', declaration: { name: 'HarmonySpinner' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyAccordion.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyAccordion',
          tagName: 'harmony-accordion',
          customElement: true,
          description:
            'Accordion container. Open Shadow DOM. Children are harmony-accordion-item elements.',
          members: [
            {
              kind: 'field',
              name: 'allowMultiple',
              type: { text: 'boolean' },
              attribute: 'allow-multiple',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'label',
              type: { text: 'string' },
              attribute: 'label',
            },
          ],
          slots: [{ name: '', description: 'harmony-accordion-item children.' }],
          cssParts: [
            { name: 'label', description: 'Optional group label.' },
            { name: 'surface', description: 'Bordered accordion surface.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyAccordion', declaration: { name: 'HarmonyAccordion' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyAccordionItem.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyAccordionItem',
          tagName: 'harmony-accordion-item',
          customElement: true,
          description:
            'Accordion section. Open Shadow DOM. Default slot is panel body. Emits toggle { open }.',
          members: [
            {
              kind: 'field',
              name: 'title',
              type: { text: 'string' },
              attribute: 'title',
            },
            {
              kind: 'field',
              name: 'open',
              type: { text: 'boolean' },
              attribute: 'open',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
          ],
          events: [
            {
              name: 'toggle',
              type: { text: 'CustomEvent<{ open: boolean }>' },
              description: 'Fired when the panel opens or closes.',
            },
          ],
          slots: [{ name: '', description: 'Panel body content.' }],
          cssParts: [
            { name: 'trigger', description: 'Header button.' },
            { name: 'icon', description: 'Chevron icon.' },
            { name: 'panel', description: 'Expandable panel.' },
          ],
        },
      ],
      exports: [
        { kind: 'js', name: 'HarmonyAccordionItem', declaration: { name: 'HarmonyAccordionItem' } },
      ],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyBadge.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyBadge',
          tagName: 'harmony-badge',
          customElement: true,
          description:
            'Status badge. Open Shadow DOM. Optional icon attribute injects harmony-icon. disabled is a visual variant only.',
          members: [
            {
              kind: 'field',
              name: 'variant',
              type: {
                text: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'orange' | 'pink' | 'disabled'",
              },
              default: "'default'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'size',
              type: { text: "'small' | 'medium' | 'large'" },
              default: "'large'",
              attribute: 'size',
            },
            {
              kind: 'field',
              name: 'icon',
              type: { text: 'string' },
              attribute: 'icon',
              description: 'Optional harmony-icon name.',
            },
          ],
          slots: [{ name: '', description: 'Badge label.' }],
          cssParts: [{ name: 'icon', description: 'Optional leading icon.' }],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyBadge', declaration: { name: 'HarmonyBadge' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyAvatar.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyAvatar',
          tagName: 'harmony-avatar',
          customElement: true,
          description:
            'User avatar. Open Shadow DOM. interactive applies role=button; Enter/Space synthesize click. Disabled suppresses click.',
          members: [
            {
              kind: 'field',
              name: 'size',
              type: { text: "'sm' | 'md' | 'lg'" },
              default: "'md'",
              attribute: 'size',
            },
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'icon' | 'initials' | 'image'" },
              default: "'icon'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'initials',
              type: { text: 'string' },
              attribute: 'initials',
            },
            {
              kind: 'field',
              name: 'src',
              type: { text: 'string' },
              attribute: 'src',
            },
            {
              kind: 'field',
              name: 'alt',
              type: { text: 'string' },
              attribute: 'alt',
              description: 'Accessible name for image variant.',
            },
            {
              kind: 'field',
              name: 'interactive',
              type: { text: 'boolean' },
              attribute: 'interactive',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
          ],
          events: [
            {
              name: 'click',
              description: 'When interactive and not disabled (keyboard synthesizes click).',
            },
          ],
          cssParts: [
            { name: 'icon', description: 'Default user icon.' },
            { name: 'initials', description: 'Initials text.' },
            { name: 'image', description: 'Photo img.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyAvatar', declaration: { name: 'HarmonyAvatar' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyChip.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyChip',
          tagName: 'harmony-chip',
          customElement: true,
          description:
            'Chip for tags/filters. Open Shadow DOM. Body click for select; remove CustomEvent on remove control (does not bubble chip click). selected is controlled.',
          members: [
            {
              kind: 'field',
              name: 'size',
              type: { text: "'sm' | 'md' | 'lg'" },
              default: "'md'",
              attribute: 'size',
            },
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'fill' | 'outline'" },
              default: "'fill'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'type',
              type: { text: "'chip' | 'horiz-dots' | 'vert-dots' | 'overflow'" },
              default: "'chip'",
              attribute: 'type',
            },
            {
              kind: 'field',
              name: 'overflowCount',
              type: { text: 'number' },
              default: '10',
              attribute: 'overflow-count',
            },
            {
              kind: 'field',
              name: 'selected',
              type: { text: 'boolean' },
              attribute: 'selected',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'removable',
              type: { text: 'boolean' },
              attribute: 'removable',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'icon',
              type: { text: 'string' },
              attribute: 'icon',
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
          ],
          slots: [{ name: '', description: 'Chip label (default Chip).' }],
          events: [
            {
              name: 'click',
              description: 'Chip body click (remove control does not fire this).',
            },
            {
              name: 'remove',
              type: { text: 'CustomEvent' },
              description: 'Fired when the remove control is activated (bubbles, composed).',
            },
          ],
          cssParts: [
            { name: 'icon', description: 'Leading icon.' },
            { name: 'remove', description: 'Remove button.' },
            { name: 'dots', description: 'Dots type glyph.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyChip', declaration: { name: 'HarmonyChip' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyAlert.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyAlert',
          tagName: 'harmony-alert',
          customElement: true,
          description:
            'Alert / notification. Open Shadow DOM. dismiss CustomEvent on close (does not auto-remove). Enhanced actions via actions slot composing design-system buttons and links. progress-value composes harmony-progress.',
          members: [
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'info' | 'success' | 'warning' | 'error'" },
              default: "'info'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'enhanced',
              type: { text: 'boolean' },
              attribute: 'enhanced',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'title',
              type: { text: 'string' },
              attribute: 'title',
            },
            {
              kind: 'field',
              name: 'dismissible',
              type: { text: 'boolean' },
              attribute: 'dismissible',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'icon',
              type: { text: 'string' },
              attribute: 'icon',
              description: 'Override default variant icon name.',
            },
            {
              kind: 'field',
              name: 'progressValue',
              type: { text: 'number | null' },
              attribute: 'progress-value',
              description: 'Enhanced only — renders harmony-progress.',
            },
          ],
          slots: [
            { name: '', description: 'Alert message body.' },
            {
              name: 'actions',
              description:
                'Enhanced actions row. Compose harmony-button, .btn, and/or anchor links.',
            },
          ],
          events: [
            {
              name: 'dismiss',
              type: { text: 'CustomEvent' },
              description: 'Fired when the close control is activated (bubbles, composed).',
            },
          ],
          cssParts: [
            { name: 'border', description: 'Enhanced accent border.' },
            { name: 'icon', description: 'Leading status icon.' },
            { name: 'title', description: 'Title text.' },
            { name: 'message', description: 'Message region.' },
            { name: 'close', description: 'Dismiss button.' },
            { name: 'actions', description: 'Actions slot host.' },
            { name: 'progress', description: 'Progress region.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyAlert', declaration: { name: 'HarmonyAlert' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyTooltip.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyTooltip',
          tagName: 'harmony-tooltip',
          customElement: true,
          description:
            'Tooltip on hover and focus-within. Open Shadow DOM. content slot wins over text. Escape dismisses. Associates trigger via aria-describedby / ariaDescribedByElements.',
          members: [
            {
              kind: 'field',
              name: 'text',
              type: { text: 'string' },
              attribute: 'text',
              description: 'Tip body when content slot is empty.',
            },
            {
              kind: 'field',
              name: 'position',
              type: { text: "'top' | 'bottom' | 'left' | 'right'" },
              default: "'top'",
              attribute: 'position',
            },
            {
              kind: 'field',
              name: 'cornerVariant',
              type: { text: "'top' | 'bottom' | 'left' | 'right' | ''" },
              attribute: 'corner-variant',
              description: 'Sharp corner on the named side; hides arrow.',
            },
          ],
          slots: [
            { name: '', description: 'Trigger element.' },
            {
              name: 'content',
              description: 'Rich HTML tip body; wins over text.',
            },
          ],
          cssParts: [{ name: 'content', description: 'Tip bubble (decorative aria-hidden).' }],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyTooltip', declaration: { name: 'HarmonyTooltip' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyDialog.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyDialog',
          tagName: 'harmony-dialog',
          customElement: true,
          description:
            'Modal dialog wrapping native HTMLDialogElement. show()/close({force}). close-on-backdrop, dirty + confirm-unsaved nested confirm, cancelable close-request.',
          members: [
            { kind: 'field', name: 'title', type: { text: 'string' }, attribute: 'title' },
            {
              kind: 'field',
              name: 'headerVariant',
              type: { text: "'default' | 'primary'" },
              default: "'default'",
              attribute: 'header-variant',
            },
            {
              kind: 'field',
              name: 'buttonAlignment',
              type: { text: "'left' | 'right'" },
              default: "'left'",
              attribute: 'button-alignment',
            },
            {
              kind: 'field',
              name: 'resizable',
              type: { text: 'boolean' },
              default: 'true',
              attribute: 'resizable',
            },
            {
              kind: 'field',
              name: 'open',
              type: { text: 'boolean' },
              attribute: 'open',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'closeOnBackdrop',
              type: { text: 'boolean' },
              default: 'true',
              attribute: 'close-on-backdrop',
            },
            {
              kind: 'field',
              name: 'dirty',
              type: { text: 'boolean' },
              attribute: 'dirty',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'confirmUnsaved',
              type: { text: 'boolean' },
              attribute: 'confirm-unsaved',
              reflect: true,
            },
            {
              kind: 'method',
              name: 'show',
              description: 'Open via showModal().',
            },
            {
              kind: 'method',
              name: 'close',
              description: 'Request close. Pass { force: true } to skip unsaved gate.',
              parameters: [
                {
                  name: 'opts',
                  type: { text: '{ force?: boolean }' },
                  optional: true,
                },
              ],
            },
          ],
          slots: [
            { name: '', description: 'Dialog body.' },
            {
              name: 'footer',
              description: 'Footer actions; wins over convenience labels.',
            },
          ],
          events: [
            {
              name: 'close-request',
              type: { text: 'CustomEvent<{ reason: string }>' },
              description: 'Cancelable dismiss request.',
            },
            { name: 'close', type: { text: 'CustomEvent' }, description: 'After close.' },
            { name: 'confirm', type: { text: 'CustomEvent' } },
            { name: 'cancel', type: { text: 'CustomEvent' } },
            { name: 'tertiary', type: { text: 'CustomEvent' } },
          ],
          cssParts: [
            { name: 'dialog', description: 'Main native dialog.' },
            { name: 'header' },
            { name: 'title' },
            { name: 'close' },
            { name: 'body' },
            { name: 'footer' },
            { name: 'grip' },
            { name: 'unsaved', description: 'Nested unsaved-changes confirm dialog.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyDialog', declaration: { name: 'HarmonyDialog' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyInput.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyInput',
          tagName: 'harmony-input',
          customElement: true,
          description:
            'Form-associated text input (open Shadow DOM). Dual path with native text-like inputs in product CSS.',
          members: [
            {
              kind: 'field',
              name: 'type',
              type: { text: "'text' | 'email' | 'password' | 'number' | 'url' | 'search' | 'tel'" },
              default: "'text'",
              attribute: 'type',
            },
            { kind: 'field', name: 'name', type: { text: 'string' }, attribute: 'name' },
            { kind: 'field', name: 'value', type: { text: 'string' }, attribute: 'value' },
            {
              kind: 'field',
              name: 'placeholder',
              type: { text: 'string' },
              attribute: 'placeholder',
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'required',
              type: { text: 'boolean' },
              attribute: 'required',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'readOnly',
              type: { text: 'boolean' },
              attribute: 'readonly',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'error',
              type: { text: 'boolean' },
              attribute: 'error',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'errorMessage',
              type: { text: 'string' },
              attribute: 'error-message',
            },
            { kind: 'field', name: 'icon', type: { text: 'string' }, attribute: 'icon' },
            {
              kind: 'field',
              name: 'trailingIcon',
              type: { text: 'string' },
              attribute: 'trailing-icon',
            },
            { kind: 'field', name: 'label', type: { text: 'string' }, attribute: 'label' },
          ],
          slots: [
            {
              name: 'trailing',
              description: 'Trailing action gutter (prefer icon-only ghost button).',
            },
          ],
          events: [
            { name: 'input', type: { text: 'Event' }, description: 'Retargeted from inner control.' },
            {
              name: 'change',
              type: { text: 'Event' },
              description: 'Retargeted from inner control.',
            },
          ],
          cssParts: [
            { name: 'label', description: 'Standalone stacked label.' },
            { name: 'control', description: 'Inner native input.' },
            { name: 'icon', description: 'Leading harmony-icon.' },
            { name: 'trailing-icon', description: 'Trailing decorative icon.' },
            { name: 'trailing', description: 'Trailing slot host.' },
            { name: 'error', description: 'Error message.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyInput', declaration: { name: 'HarmonyInput' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyTextarea.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyTextarea',
          tagName: 'harmony-textarea',
          customElement: true,
          description:
            'Form-associated textarea (open Shadow DOM). Dual path with native textarea in product CSS.',
          members: [
            { kind: 'field', name: 'name', type: { text: 'string' }, attribute: 'name' },
            { kind: 'field', name: 'value', type: { text: 'string' }, attribute: 'value' },
            {
              kind: 'field',
              name: 'placeholder',
              type: { text: 'string' },
              attribute: 'placeholder',
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'required',
              type: { text: 'boolean' },
              attribute: 'required',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'readOnly',
              type: { text: 'boolean' },
              attribute: 'readonly',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'rows',
              type: { text: 'number' },
              default: '4',
              attribute: 'rows',
            },
            {
              kind: 'field',
              name: 'error',
              type: { text: 'boolean' },
              attribute: 'error',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'errorMessage',
              type: { text: 'string' },
              attribute: 'error-message',
            },
            { kind: 'field', name: 'label', type: { text: 'string' }, attribute: 'label' },
          ],
          events: [
            { name: 'input', type: { text: 'Event' }, description: 'Retargeted from inner control.' },
            {
              name: 'change',
              type: { text: 'Event' },
              description: 'Retargeted from inner control.',
            },
          ],
          cssParts: [
            { name: 'label', description: 'Standalone stacked label.' },
            { name: 'control', description: 'Inner native textarea.' },
            { name: 'error', description: 'Error message.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyTextarea', declaration: { name: 'HarmonyTextarea' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonySelect.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonySelect',
          tagName: 'harmony-select',
          customElement: true,
          description:
            'Form-associated select (open Shadow DOM). Catalog Dropdown. Dual path with native select. Options are light-DOM option/optgroup. Open list is the OS picker.',
          members: [
            { kind: 'field', name: 'name', type: { text: 'string' }, attribute: 'name' },
            {
              kind: 'field',
              name: 'value',
              type: { text: 'string' },
              attribute: 'value',
              description: 'Selected value.',
            },
            {
              kind: 'field',
              name: 'placeholder',
              type: { text: 'string' },
              attribute: 'placeholder',
              description: 'Disabled empty first option.',
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'required',
              type: { text: 'boolean' },
              attribute: 'required',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'error',
              type: { text: 'boolean' },
              attribute: 'error',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'errorMessage',
              type: { text: 'string' },
              attribute: 'error-message',
            },
            { kind: 'field', name: 'label', type: { text: 'string' }, attribute: 'label' },
            {
              kind: 'field',
              name: 'labelVariant',
              type: { text: "'inline' | 'stacked' | ''" },
              attribute: 'label-variant',
              description: 'Ignored inside harmony-form-layout.',
            },
          ],
          events: [
            { name: 'input', type: { text: 'Event' }, description: 'Retargeted from inner select.' },
            {
              name: 'change',
              type: { text: 'Event' },
              description: 'Retargeted from inner select.',
            },
          ],
          slots: [
            {
              name: '',
              description: 'option and optgroup elements (copied into the shadow select).',
            },
          ],
          cssParts: [
            { name: 'label', description: 'Standalone label. Hidden inside harmony-form-layout.' },
            { name: 'control', description: 'Inner native select.' },
            { name: 'error', description: 'Error message.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonySelect', declaration: { name: 'HarmonySelect' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyFormLayout.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyFormLayout',
          tagName: 'harmony-form-layout',
          customElement: true,
          description:
            'Light-DOM layout helper inside a native form. Aligns labels from child label attrs. Supports harmony-form-row for multi-field rows. CP kits default unset label-layout to inline.',
          members: [
            {
              kind: 'field',
              name: 'labelLayout',
              type: { text: "'inline' | 'stacked' | ''" },
              attribute: 'label-layout',
              description: 'Explicit layout. Empty uses product default (stacked; inline on CP).',
            },
          ],
          slots: [
            {
              name: '',
              description:
                'harmony-input / harmony-textarea / harmony-select fields and optional harmony-form-row groups.',
            },
          ],
        },
      ],
      exports: [
        { kind: 'js', name: 'HarmonyFormLayout', declaration: { name: 'HarmonyFormLayout' } },
      ],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyFormRow.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyFormRow',
          tagName: 'harmony-form-row',
          customElement: true,
          description:
            'Light-DOM row group for harmony-form-layout. Places multiple fields on one row; inline mode uses CSS subgrid for shared label columns.',
          members: [
            {
              kind: 'field',
              name: 'columns',
              type: { text: 'number' },
              default: '2',
              attribute: 'columns',
            },
          ],
          slots: [
            {
              name: '',
              description: 'harmony-input / harmony-textarea / harmony-select fields that share the row.',
            },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyFormRow', declaration: { name: 'HarmonyFormRow' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyPickerPopup.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyPickerPopup',
          tagName: 'harmony-picker-popup',
          customElement: true,
          description:
            'Anchored picker popover using the Popover API. Not a form control and not harmony-dialog.',
          members: [
            { kind: 'field', name: 'triggerId', type: { text: 'string' }, attribute: 'for' },
            { kind: 'field', name: 'open', type: { text: 'boolean' }, attribute: 'open', reflect: true },
            { kind: 'field', name: 'titleText', type: { text: 'string' }, attribute: 'title' },
            { kind: 'method', name: 'show', description: 'Open the popover and focus the slotted picker.' },
            { kind: 'method', name: 'hide', description: 'Close the popover.' },
          ],
          events: [
            { name: 'toggle', description: 'Fires when the popover opens or closes. detail.open is boolean.' },
          ],
          slots: [{ name: '', description: 'Picker content.' }],
          cssParts: [{ name: 'panel', description: 'Popup surface.' }],
        },
      ],
      exports: [
        { kind: 'js', name: 'HarmonyPickerPopup', declaration: { name: 'HarmonyPickerPopup' } },
      ],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyDatePicker.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyDatePicker',
          tagName: 'harmony-date-picker',
          customElement: true,
          description: 'Calendar widget. Not form-associated. Emits date-select with YYYY-MM-DD.',
          members: [
            { kind: 'field', name: 'value', type: { text: 'string' }, attribute: 'value' },
            { kind: 'field', name: 'min', type: { text: 'string' }, attribute: 'min' },
            { kind: 'field', name: 'max', type: { text: 'string' }, attribute: 'max' },
            { kind: 'field', name: 'disabled', type: { text: 'boolean' }, attribute: 'disabled' },
            { kind: 'field', name: 'locale', type: { text: 'string' }, default: "'en-US'", attribute: 'locale' },
          ],
          events: [{ name: 'date-select', description: 'detail.date is YYYY-MM-DD.' }],
          cssParts: [
            { name: 'header', description: 'Month navigation.' },
            { name: 'grid', description: 'Day grid.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyDatePicker', declaration: { name: 'HarmonyDatePicker' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyTimePicker.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyTimePicker',
          tagName: 'harmony-time-picker',
          customElement: true,
          description: 'Time widget. value is 24-hour HH:MM. Emits time-select.',
          members: [
            { kind: 'field', name: 'value', type: { text: 'string' }, attribute: 'value' },
            { kind: 'field', name: 'min', type: { text: 'string' }, attribute: 'min' },
            { kind: 'field', name: 'max', type: { text: 'string' }, attribute: 'max' },
            { kind: 'field', name: 'disabled', type: { text: 'boolean' }, attribute: 'disabled' },
            {
              kind: 'field',
              name: 'format',
              type: { text: "'12' | '24'" },
              default: "'24'",
              attribute: 'format',
            },
            { kind: 'field', name: 'step', type: { text: 'number' }, default: '1', attribute: 'step' },
          ],
          events: [{ name: 'time-select', description: 'detail.time is HH:MM.' }],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyTimePicker', declaration: { name: 'HarmonyTimePicker' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyDateTimePicker.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyDateTimePicker',
          tagName: 'harmony-datetime-picker',
          customElement: true,
          description:
            'Combined date and time widget. Not form-associated. Emits datetime-select with YYYY-MM-DDTHH:MM when both halves are known.',
          members: [
            { kind: 'field', name: 'value', type: { text: 'string' }, attribute: 'value' },
            { kind: 'field', name: 'min', type: { text: 'string' }, attribute: 'min' },
            { kind: 'field', name: 'max', type: { text: 'string' }, attribute: 'max' },
            { kind: 'field', name: 'disabled', type: { text: 'boolean' }, attribute: 'disabled' },
            {
              kind: 'field',
              name: 'timeFormat',
              type: { text: "'12' | '24'" },
              default: "'24'",
              attribute: 'time-format',
            },
            { kind: 'field', name: 'locale', type: { text: 'string' }, default: "'en-US'", attribute: 'locale' },
          ],
          events: [{ name: 'datetime-select', description: 'detail.datetime is YYYY-MM-DDTHH:MM.' }],
          cssParts: [
            { name: 'date', description: 'Date calendar section.' },
            { name: 'time', description: 'Time spinner section.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyDateTimePicker', declaration: { name: 'HarmonyDateTimePicker' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyMonthPicker.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyMonthPicker',
          tagName: 'harmony-month-picker',
          customElement: true,
          description: 'Month widget. value is YYYY-MM. Emits month-select.',
          members: [
            { kind: 'field', name: 'value', type: { text: 'string' }, attribute: 'value' },
            { kind: 'field', name: 'min', type: { text: 'string' }, attribute: 'min' },
            { kind: 'field', name: 'max', type: { text: 'string' }, attribute: 'max' },
            { kind: 'field', name: 'disabled', type: { text: 'boolean' }, attribute: 'disabled' },
            { kind: 'field', name: 'locale', type: { text: 'string' }, default: "'en-US'", attribute: 'locale' },
          ],
          events: [{ name: 'month-select', description: 'detail.value is YYYY-MM.' }],
          cssParts: [
            { name: 'header', description: 'Year navigation.' },
            { name: 'grid', description: 'Month grid.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyMonthPicker', declaration: { name: 'HarmonyMonthPicker' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyWeekPicker.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyWeekPicker',
          tagName: 'harmony-week-picker',
          customElement: true,
          description: 'ISO week widget. value is YYYY-Www. Emits week-select.',
          members: [
            { kind: 'field', name: 'value', type: { text: 'string' }, attribute: 'value' },
            { kind: 'field', name: 'min', type: { text: 'string' }, attribute: 'min' },
            { kind: 'field', name: 'max', type: { text: 'string' }, attribute: 'max' },
            { kind: 'field', name: 'disabled', type: { text: 'boolean' }, attribute: 'disabled' },
            { kind: 'field', name: 'locale', type: { text: 'string' }, default: "'en-US'", attribute: 'locale' },
          ],
          events: [{ name: 'week-select', description: 'detail.value is YYYY-Www.' }],
          cssParts: [
            { name: 'header', description: 'Year navigation.' },
            { name: 'list', description: 'Week listbox.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyWeekPicker', declaration: { name: 'HarmonyWeekPicker' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyDateInput.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyDateInput',
          tagName: 'harmony-date-input',
          customElement: true,
          description:
            'Form-associated date/time field. Composes a picker popup and widget. Form value is the machine string, not the display text.',
          members: [
            {
              kind: 'field',
              name: 'type',
              type: { text: "'date' | 'time' | 'datetime-local' | 'month' | 'week'" },
              default: "'date'",
              attribute: 'type',
            },
            { kind: 'field', name: 'value', type: { text: 'string' }, attribute: 'value' },
            { kind: 'field', name: 'name', type: { text: 'string' }, attribute: 'name' },
            { kind: 'field', name: 'min', type: { text: 'string' }, attribute: 'min' },
            { kind: 'field', name: 'max', type: { text: 'string' }, attribute: 'max' },
            { kind: 'field', name: 'disabled', type: { text: 'boolean' }, attribute: 'disabled' },
            { kind: 'field', name: 'required', type: { text: 'boolean' }, attribute: 'required' },
            { kind: 'field', name: 'label', type: { text: 'string' }, attribute: 'label' },
            {
              kind: 'field',
              name: 'labelVariant',
              type: { text: "'inline' | 'stacked'" },
              attribute: 'label-variant',
            },
            {
              kind: 'field',
              name: 'timeFormat',
              type: { text: "'12' | '24'" },
              default: "'24'",
              attribute: 'time-format',
            },
            { kind: 'field', name: 'locale', type: { text: 'string' }, default: "'en-US'", attribute: 'locale' },
          ],
          events: [
            { name: 'input', description: 'detail is the machine value. bubbles and composed.' },
            { name: 'change', description: 'detail is the machine value. bubbles and composed.' },
          ],
          cssParts: [
            { name: 'field', description: 'Readonly text control showing the locale display value.' },
            { name: 'icon', description: 'Calendar or clock button that opens the popup.' },
            { name: 'popup', description: 'Anchored picker popup.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyDateInput', declaration: { name: 'HarmonyDateInput' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyButtonGroup.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyButtonGroup',
          tagName: 'harmony-button-group',
          customElement: true,
          description:
            'Light-DOM hybrid button-group helper. Maps attributes to the native .btn-group class recipe. Sets role=group when missing. Compose button / .btn / harmony-button children.',
          members: [
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'default' | 'outline'" },
              default: "'default'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'size',
              type: { text: "'sm' | 'md' | 'lg'" },
              default: "'md'",
              attribute: 'size',
            },
            {
              kind: 'field',
              name: 'orientation',
              type: { text: "'horizontal' | 'vertical'" },
              default: "'horizontal'",
              attribute: 'orientation',
            },
          ],
          slots: [{ name: '', description: 'Button children (native button, .btn, or harmony-button).' }],
        },
      ],
      exports: [
        { kind: 'js', name: 'HarmonyButtonGroup', declaration: { name: 'HarmonyButtonGroup' } },
      ],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyListMenu.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyListMenu',
          tagName: 'harmony-list-menu',
          customElement: true,
          description:
            'Light-DOM hybrid list-menu helper. Maps attributes to the native .list-menu class recipe and ensures direct a/button children carry .list-menu__item (and nested harmony-icon get .list-menu__item-icon). Compose children — no items JSON.',
          members: [
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'default' | 'no-borders'" },
              default: "'default'",
              attribute: 'variant',
            },
          ],
          slots: [{ name: '', description: 'Compose a / button menu items.' }],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyListMenu', declaration: { name: 'HarmonyListMenu' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyTable.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyTable',
          tagName: 'harmony-table',
          customElement: true,
          description:
            'Light-DOM hybrid table helper. Host is .table-wrapper; builds bars and an unclassed inner table with modifier classes. Wires sort, reorder, grouped expand, selection, and Command Center behaviors. Sort/filter algorithms stay in the host.',
          members: [
            {
              kind: 'field',
              name: 'headerVariant',
              type: { text: "'gray' | 'white' | 'none'" },
              default: "'gray'",
              attribute: 'header-variant',
            },
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'default' | 'commandCenter'" },
              default: "'default'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'striped',
              type: { text: 'boolean' },
              default: 'false',
              attribute: 'striped',
              description: 'For commandCenter, defaults true unless striped="false".',
            },
            {
              kind: 'field',
              name: 'reorderable',
              type: { text: 'boolean' },
              default: 'false',
              attribute: 'reorderable',
            },
            {
              kind: 'field',
              name: 'grouped',
              type: { text: 'boolean' },
              default: 'false',
              attribute: 'grouped',
            },
            {
              kind: 'field',
              name: 'groupedDefaultExpanded',
              type: { text: 'string' },
              attribute: 'grouped-default-expanded',
            },
            {
              kind: 'field',
              name: 'columns',
              type: { text: 'Array<{key:string,label:string,align?:string,sortable?:boolean,filterable?:boolean}>' },
              attribute: 'columns',
              description: 'JSON attribute; builds sort header when set.',
            },
            {
              kind: 'field',
              name: 'sortColumn',
              type: { text: 'string | null' },
              attribute: 'sort-column',
            },
            {
              kind: 'field',
              name: 'sortDirection',
              type: { text: "'asc' | 'desc' | null" },
              attribute: 'sort-direction',
            },
            {
              kind: 'field',
              name: 'selectedRowIds',
              type: { text: 'string[]' },
              attribute: 'selected-row-ids',
            },
            {
              kind: 'method',
              name: 'expandAll',
              description: 'Expand all grouped parent rows.',
            },
            {
              kind: 'method',
              name: 'collapseAll',
              description: 'Collapse all grouped parent rows.',
            },
            {
              kind: 'method',
              name: 'setExpanded',
              parameters: [{ name: 'ids', type: { text: 'string[]' } }],
              description: 'Set expanded parent data-row-id values.',
            },
            {
              kind: 'method',
              name: 'getExpanded',
              return: { type: { text: 'string[]' } },
            },
            {
              kind: 'method',
              name: 'getSelected',
              return: { type: { text: 'string[]' } },
            },
            {
              kind: 'method',
              name: 'getOrder',
              return: { type: { text: 'string[]' } },
            },
          ],
          events: [
            { name: 'sort-change', type: { text: 'CustomEvent<{key:string|null,direction:string|null}>' } },
            { name: 'filter-click', type: { text: 'CustomEvent<{key:string}>' } },
            { name: 'table-reorder', type: { text: 'CustomEvent<{fromIndex:number,toIndex:number}>' } },
            { name: 'expand-change', type: { text: 'CustomEvent<{expandedIds:string[]}>' } },
            { name: 'selection-change', type: { text: 'CustomEvent<{selectedIds:string[]}>' } },
            { name: 'row-select', type: { text: 'CustomEvent<{rowId:string|null,row:HTMLTableRowElement}>' } },
          ],
          slots: [
            { name: 'filter-bar', description: 'Filter bar above the table.' },
            { name: 'title-bar-content', description: 'Title bar main content.' },
            { name: 'title-bar-icons', description: 'Title bar trailing icons/actions.' },
            { name: 'action-bar', description: 'Action bar above the table.' },
            { name: 'command-center-toolbar', description: 'Command Center toolbar row.' },
            { name: 'command-center-aside', description: 'Docked Command Center aside; enables canvas layout.' },
            { name: 'header', description: 'thead rows when columns is not set.' },
            { name: 'body', description: 'tbody rows (direct tr without slot also accepted).' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyTable', declaration: { name: 'HarmonyTable' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyNotificationBadge.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyNotificationBadge',
          tagName: 'harmony-notification-badge',
          customElement: true,
          description:
            'Notification badge (open Shadow DOM). Wrap-target API: default slot is the anchor; badge sits absolute (default top-end). Empty slot → standalone badge.',
          members: [
            {
              kind: 'field',
              name: 'type',
              type: { text: "'dot' | 'number' | 'overflow'" },
              default: "'number'",
              attribute: 'type',
            },
            {
              kind: 'field',
              name: 'size',
              type: { text: "'sm' | 'md' | 'lg'" },
              default: "'md'",
              attribute: 'size',
            },
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'error' | 'primary'" },
              default: "'primary'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'value',
              type: { text: 'string' },
              default: "'1'",
              attribute: 'value',
            },
            {
              kind: 'field',
              name: 'border',
              type: { text: 'boolean' },
              attribute: 'border',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'position',
              type: { text: "'top-end'" },
              default: "'top-end'",
              attribute: 'position',
            },
          ],
          slots: [{ name: '', description: 'Optional wrap target (button, avatar, icon, …).' }],
          cssParts: [{ name: 'badge', description: 'Absolute indicator span.' }],
        },
      ],
      exports: [
        {
          kind: 'js',
          name: 'HarmonyNotificationBadge',
          declaration: { name: 'HarmonyNotificationBadge' },
        },
      ],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyCheckbox.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyCheckbox',
          tagName: 'harmony-checkbox',
          customElement: true,
          description:
            'Form-associated checkbox (open Shadow DOM). Dual path with native input[type=checkbox] in product CSS. indeterminate is a property (not an attribute). Participates in harmony-form-layout.',
          members: [
            { kind: 'field', name: 'name', type: { text: 'string' }, attribute: 'name' },
            {
              kind: 'field',
              name: 'value',
              type: { text: 'string' },
              default: "'on'",
              attribute: 'value',
            },
            {
              kind: 'field',
              name: 'checked',
              type: { text: 'boolean' },
              attribute: 'checked',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'indeterminate',
              type: { text: 'boolean' },
              description: 'Property only — sets the inner control indeterminate state.',
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'required',
              type: { text: 'boolean' },
              attribute: 'required',
              reflect: true,
            },
            { kind: 'field', name: 'label', type: { text: 'string' }, attribute: 'label' },
            {
              kind: 'field',
              name: 'labelVariant',
              type: { text: "'inline' | 'stacked'" },
              attribute: 'label-variant',
            },
            {
              kind: 'field',
              name: 'error',
              type: { text: 'boolean' },
              attribute: 'error',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'errorMessage',
              type: { text: 'string' },
              attribute: 'error-message',
            },
            {
              kind: 'field',
              name: 'warning',
              type: { text: 'boolean' },
              attribute: 'warning',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'warningMessage',
              type: { text: 'string' },
              attribute: 'warning-message',
            },
          ],
          events: [
            { name: 'input', type: { text: 'Event' }, description: 'Retargeted from inner control.' },
            {
              name: 'change',
              type: { text: 'Event' },
              description: 'Retargeted from inner control.',
            },
          ],
          cssParts: [
            { name: 'control', description: 'Labeled control root.' },
            { name: 'input', description: 'Inner native checkbox.' },
            { name: 'box', description: 'Visual checkbox box.' },
            { name: 'label', description: 'Beside-control label text.' },
            { name: 'message', description: 'Error or warning message.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyCheckbox', declaration: { name: 'HarmonyCheckbox' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyRadio.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyRadio',
          tagName: 'harmony-radio',
          customElement: true,
          description:
            'Form-associated radio (open Shadow DOM). Catalog RadioButton. Dual path with native input[type=radio] in product CSS. Group via shared name. Participates in harmony-form-layout.',
          members: [
            { kind: 'field', name: 'name', type: { text: 'string' }, attribute: 'name' },
            { kind: 'field', name: 'value', type: { text: 'string' }, attribute: 'value' },
            {
              kind: 'field',
              name: 'checked',
              type: { text: 'boolean' },
              attribute: 'checked',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'required',
              type: { text: 'boolean' },
              attribute: 'required',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'size',
              type: { text: "'small' | 'medium' | 'large'" },
              default: "'medium'",
              attribute: 'size',
            },
            { kind: 'field', name: 'label', type: { text: 'string' }, attribute: 'label' },
            {
              kind: 'field',
              name: 'labelVariant',
              type: { text: "'inline' | 'stacked'" },
              attribute: 'label-variant',
            },
            {
              kind: 'field',
              name: 'error',
              type: { text: 'boolean' },
              attribute: 'error',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'errorMessage',
              type: { text: 'string' },
              attribute: 'error-message',
            },
            {
              kind: 'field',
              name: 'warning',
              type: { text: 'boolean' },
              attribute: 'warning',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'warningMessage',
              type: { text: 'string' },
              attribute: 'warning-message',
            },
          ],
          events: [
            { name: 'input', type: { text: 'Event' }, description: 'Retargeted from inner control.' },
            {
              name: 'change',
              type: { text: 'Event' },
              description: 'Retargeted from inner control.',
            },
          ],
          cssParts: [
            { name: 'control', description: 'Labeled control root.' },
            { name: 'input', description: 'Inner native radio.' },
            { name: 'circle', description: 'Visual radio circle.' },
            { name: 'dot', description: 'Selected indicator.' },
            { name: 'label', description: 'Beside-control label text.' },
            { name: 'message', description: 'Error or warning message.' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyRadio', declaration: { name: 'HarmonyRadio' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyToggle.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyToggle',
          tagName: 'harmony-toggle',
          customElement: true,
          description:
            'Form-associated toggle / switch (open Shadow DOM). CE-only — no public document .toggle recipe. Participates in harmony-form-layout.',
          members: [
            { kind: 'field', name: 'name', type: { text: 'string' }, attribute: 'name' },
            {
              kind: 'field',
              name: 'checked',
              type: { text: 'boolean' },
              attribute: 'checked',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'disabled',
              type: { text: 'boolean' },
              attribute: 'disabled',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'required',
              type: { text: 'boolean' },
              attribute: 'required',
              reflect: true,
            },
            { kind: 'field', name: 'label', type: { text: 'string' }, attribute: 'label' },
            {
              kind: 'field',
              name: 'labelVariant',
              type: { text: "'inline' | 'stacked'" },
              attribute: 'label-variant',
            },
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'default' | 'segmented'" },
              default: "'default'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'optionLabelLeft',
              type: { text: 'string' },
              default: "'Item 1'",
              attribute: 'option-label-left',
            },
            {
              kind: 'field',
              name: 'optionLabelRight',
              type: { text: 'string' },
              default: "'Item 2'",
              attribute: 'option-label-right',
            },
            {
              kind: 'field',
              name: 'size',
              type: { text: "'sm' | 'md'" },
              default: "'md'",
              attribute: 'size',
            },
          ],
          events: [
            { name: 'input', type: { text: 'Event' }, description: 'Retargeted from inner control.' },
            {
              name: 'change',
              type: { text: 'Event' },
              description: 'Retargeted from inner control.',
            },
          ],
          cssParts: [
            { name: 'control', description: 'Labeled control root.' },
            { name: 'input', description: 'Inner switch checkbox.' },
            { name: 'track', description: 'Track.' },
            { name: 'thumb', description: 'Thumb.' },
            { name: 'label', description: 'Beside-control label (default variant).' },
            { name: 'segment-left', description: 'Left segment label (segmented).' },
            { name: 'segment-right', description: 'Right segment label (segmented).' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyToggle', declaration: { name: 'HarmonyToggle' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyTabStrip.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyTabStrip',
          tagName: 'harmony-tab-strip',
          customElement: true,
          description:
            'Tab strip (open Shadow DOM). Set tabs[] (and optional overflowTabs). Panels are consumer-owned outside this element. Events: tab-select, tab-close, tab-add, tab-open-new, tab-set-default.',
          members: [
            {
              kind: 'field',
              name: 'variant',
              type: { text: "'default' | 'compact' | 'pill'" },
              default: "'default'",
              attribute: 'variant',
            },
            {
              kind: 'field',
              name: 'overflowMode',
              type: { text: "'auto' | 'manual' | 'none'" },
              default: "'auto'",
              attribute: 'overflow-mode',
            },
            {
              kind: 'field',
              name: 'showAddTab',
              type: { text: 'boolean' },
              attribute: 'show-add-tab',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'addTabLabel',
              type: { text: 'string' },
              default: "'Add Tab'",
              attribute: 'add-tab-label',
            },
            {
              kind: 'field',
              name: 'iconPosition',
              type: { text: "'left' | 'right' | 'top' | null" },
              attribute: 'icon-position',
            },
            {
              kind: 'field',
              name: 'showTabOpenInNew',
              type: { text: 'boolean' },
              attribute: 'show-tab-open-in-new',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'showTabClose',
              type: { text: 'boolean' },
              attribute: 'show-tab-close',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'showTabOverflowMenu',
              type: { text: 'boolean' },
              attribute: 'show-tab-overflow-menu',
              reflect: true,
            },
            {
              kind: 'field',
              name: 'selected',
              type: { text: 'string' },
              attribute: 'selected',
              description: 'Selected tab id.',
            },
            {
              kind: 'field',
              name: 'tabs',
              type: { text: 'TabItem[]' },
              description:
                'Tab definitions: { id, label, icon?, iconPosition?, active?, disabled?, href?, showOpenInNewWindow?, showClose?, showMenu? }.',
            },
            {
              kind: 'field',
              name: 'overflowTabs',
              type: { text: 'TabItem[]' },
              description: 'Manual overflow list when overflow-mode is manual.',
            },
          ],
          events: [
            {
              name: 'tab-select',
              type: { text: 'CustomEvent' },
              description: 'detail.id — tab activated.',
            },
            {
              name: 'tab-close',
              type: { text: 'CustomEvent' },
              description: 'detail.id — close action.',
            },
            { name: 'tab-add', type: { text: 'CustomEvent' }, description: 'Add Tab activated.' },
            {
              name: 'tab-open-new',
              type: { text: 'CustomEvent' },
              description: 'detail.id — open in new window.',
            },
            {
              name: 'tab-set-default',
              type: { text: 'CustomEvent' },
              description: 'detail.id — set as default.',
            },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyTabStrip', declaration: { name: 'HarmonyTabStrip' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyShellHeader.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyShellHeader',
          tagName: 'harmony-shell-header',
          customElement: true,
          description:
            'Shell header. Product logo from kit (no logo-src). Slot actions for CompanyPicker, UserMenu, and custom controls.',
          members: [
            {
              kind: 'field',
              name: 'productName',
              type: { text: 'string' },
              default: "'Harmony'",
              attribute: 'product-name',
            },
            {
              kind: 'field',
              name: 'gradientColor',
              type: { text: 'string' },
              attribute: 'gradient-color',
              description: 'Overrides product primary for the bottom gradient bar.',
            },
            {
              kind: 'field',
              name: 'brandHref',
              type: { text: 'string' },
              default: "'/'",
              attribute: 'href',
            },
          ],
          slots: [{ name: 'actions', description: 'Right-side controls composition.' }],
          cssParts: [
            { name: 'header' },
            { name: 'brand' },
            { name: 'brand-link' },
            { name: 'logo' },
            { name: 'title' },
            { name: 'actions' },
            { name: 'gradient' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyShellHeader', declaration: { name: 'HarmonyShellHeader' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyCompanyPicker.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyCompanyPicker',
          tagName: 'harmony-company-picker',
          customElement: true,
          description:
            'Company picker dropdown. Slotted options with data-company-id and data-company-color. Fires company-change.',
          members: [
            {
              kind: 'field',
              name: 'companyName',
              type: { text: 'string' },
              attribute: 'company-name',
            },
            {
              kind: 'field',
              name: 'companyId',
              type: { text: 'string' },
              attribute: 'company-id',
            },
            {
              kind: 'field',
              name: 'companyColor',
              type: { text: 'string' },
              attribute: 'company-color',
            },
          ],
          events: [
            {
              name: 'company-change',
              type: { text: 'CustomEvent' },
              description: 'detail: { id, name, color }',
            },
          ],
          slots: [{ name: '', description: 'Option buttons.' }],
          cssParts: [
            { name: 'button' },
            { name: 'indicator' },
            { name: 'name' },
            { name: 'menu' },
          ],
        },
      ],
      exports: [
        { kind: 'js', name: 'HarmonyCompanyPicker', declaration: { name: 'HarmonyCompanyPicker' } },
      ],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyUserMenu.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyUserMenu',
          tagName: 'harmony-user-menu',
          customElement: true,
          description:
            'User avatar menu. name for tooltip/initials; optional src for image. Slotted a/button items.',
          members: [
            {
              kind: 'field',
              name: 'name',
              type: { text: 'string' },
              attribute: 'name',
            },
            {
              kind: 'field',
              name: 'src',
              type: { text: 'string' },
              attribute: 'src',
            },
          ],
          slots: [{ name: '', description: 'Menu items (a / button).' }],
          cssParts: [
            { name: 'trigger' },
            { name: 'avatar' },
            { name: 'menu' },
            { name: 'list' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyUserMenu', declaration: { name: 'HarmonyUserMenu' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyLeftSidebar.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyLeftSidebar',
          tagName: 'harmony-left-sidebar',
          customElement: true,
          description:
            'Left navigation icon rail. Product-kit default sections; sections property overrides. Emits left-sidebar-item-select for panel wiring.',
          members: [
            {
              kind: 'field',
              name: 'activeId',
              type: { text: 'string' },
              attribute: 'active-id',
            },
            {
              kind: 'field',
              name: 'expanded',
              type: { text: 'boolean' },
              attribute: 'expanded',
              reflects: true,
            },
            {
              kind: 'field',
              name: 'panelOpen',
              type: { text: 'boolean' },
              attribute: 'panel-open',
              reflects: true,
            },
            {
              kind: 'field',
              name: 'inline',
              type: { text: 'boolean' },
              attribute: 'inline',
              reflects: true,
              description: 'Static positioning for docs/demo embeds (not fixed to viewport).',
            },
            {
              kind: 'field',
              name: 'sections',
              type: { text: 'SidebarSection[] | null' },
              description: 'Override product default sections.',
            },
          ],
          events: [
            {
              name: 'left-sidebar-item-select',
              type: { text: 'CustomEvent' },
              description:
                'detail: { id, label, icon?, href?, panelTitle, panelIcon?, panelContentId?, useGradientHeader? }',
            },
          ],
          cssParts: [
            { name: 'nav' },
            { name: 'section' },
            { name: 'item' },
            { name: 'icon' },
            { name: 'label' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyLeftSidebar', declaration: { name: 'HarmonyLeftSidebar' } }],
    },
    {
      kind: 'javascript-module',
      path: 'src/elements/HarmonyRightSidebar.js',
      declarations: [
        {
          kind: 'class',
          name: 'HarmonyRightSidebar',
          tagName: 'harmony-right-sidebar',
          customElement: true,
          description:
            'Right navigation icon rail. Product-kit defaults lead with Dela AI; sections property overrides. Emits right-sidebar-item-select for panel wiring.',
          members: [
            {
              kind: 'field',
              name: 'activeId',
              type: { text: 'string' },
              attribute: 'active-id',
            },
            {
              kind: 'field',
              name: 'expanded',
              type: { text: 'boolean' },
              attribute: 'expanded',
              reflects: true,
            },
            {
              kind: 'field',
              name: 'panelOpen',
              type: { text: 'boolean' },
              attribute: 'panel-open',
              reflects: true,
            },
            {
              kind: 'field',
              name: 'inline',
              type: { text: 'boolean' },
              attribute: 'inline',
              reflects: true,
              description: 'Static positioning for docs/demo embeds (not fixed to viewport).',
            },
            {
              kind: 'field',
              name: 'sections',
              type: { text: 'SidebarSection[] | null' },
              description: 'Override product default sections.',
            },
          ],
          events: [
            {
              name: 'right-sidebar-item-select',
              type: { text: 'CustomEvent' },
              description:
                'detail: { id, label, icon?, href?, panelTitle, panelIcon?, panelContentId?, useGradientHeader? }',
            },
          ],
          cssParts: [
            { name: 'nav' },
            { name: 'section' },
            { name: 'item' },
            { name: 'icon' },
            { name: 'label' },
          ],
        },
      ],
      exports: [{ kind: 'js', name: 'HarmonyRightSidebar', declaration: { name: 'HarmonyRightSidebar' } }],
    },
  ],
};

writeFileSync(join(PKG, 'custom-elements.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Wrote custom-elements.json');
