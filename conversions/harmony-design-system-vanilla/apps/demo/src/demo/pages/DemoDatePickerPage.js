import {
  HarmonyElement,
  createSheet,
  typographySheet,
  buttonSheet,
  inputSheet,
  labelSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { setDateTimeDefaults } from '@dltkrichardhuska/harmony-design-system-vanilla';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';
import '../elements/DemoCallout.js';

const pageSheet = createSheet(`
  .stack { display: flex; flex-direction: column; gap: var(--space-4); }
  .widgets {
    display: grid;
    gap: var(--space-6);
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    align-items: start;
  }
  .widget {
    max-width: 320px;
    padding: var(--space-4);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--card-bg);
  }
  .field { display: flex; flex-direction: column; gap: var(--space-2); max-width: 20rem; }
  .fields { display: grid; gap: var(--space-4); max-width: 24rem; }
  .form-card { max-width: 40rem; }
  .value { color: var(--text-secondary); font-size: var(--text-sm); }
  .muted { color: var(--text-muted); font-size: var(--text-sm); }
`);

function isoDaysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class DemoDatePickerPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet, buttonSheet, labelSheet, inputSheet, pageSheet];

  connectedCallback() {
    setDateTimeDefaults({ locale: 'en-US', timeFormat: '24' });
    const min = isoDaysFromNow(0);
    const max = isoDaysFromNow(30);
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Date Picker" scope="DatePicker">
        <p>Calendar, time, date-and-time, month, and week widgets plus an anchored <code>&lt;harmony-picker-popup&gt;</code>. The form field is <code>&lt;harmony-date-input&gt;</code>. App defaults come from <code>setDateTimeDefaults</code> (or <code>data-harmony-*</code> on <code>html</code>).</p>
      </demo-page-header>

      <h2 id="examples">Examples</h2>

      <h3>App defaults</h3>
      <p class="muted">This page calls <code>setDateTimeDefaults({ locale: 'en-US', timeFormat: '24' })</code>. Controls without <code>locale</code> / <code>time-format</code> inherit that. Use <code>valueAsDate</code> for <code>Date</code> values.</p>
      <demo-example>
        <div class="field">
          <harmony-date-input id="field-as-date" label="valueAsDate"></harmony-date-input>
          <button type="button" class="btn" id="set-as-date">Set to today</button>
          <p class="value" id="field-as-date-value">valueAsDate: —</p>
        </div>
      </demo-example>

      <h3>Date calendar</h3>
      <demo-example>
        <div class="widget">
          <harmony-date-picker id="date-basic"></harmony-date-picker>
        </div>
        <p class="value" id="date-basic-value">Selected: —</p>
      </demo-example>

      <h3>With constraints</h3>
      <p class="muted">Next 30 days. Days outside min/max are disabled.</p>
      <demo-example>
        <div class="widget">
          <harmony-date-picker id="date-constrained" min="${min}" max="${max}"></harmony-date-picker>
        </div>
      </demo-example>

      <h3>Disabled</h3>
      <demo-example>
        <div class="widget">
          <harmony-date-picker disabled value="2024-01-15"></harmony-date-picker>
        </div>
      </demo-example>

      <h3>Time</h3>
      <demo-example>
        <div class="widgets">
          <div class="widget">
            <harmony-time-picker id="time-24" value="14:30"></harmony-time-picker>
          </div>
          <div class="widget">
            <harmony-time-picker id="time-12" value="14:30" format="12" step="15"></harmony-time-picker>
          </div>
        </div>
        <p class="value" id="time-value">Selected: —</p>
      </demo-example>

      <h3>Date and time</h3>
      <p class="muted">Combined widget. <code>datetime-select</code> fires when both halves are known, including a value set up front.</p>
      <demo-example>
        <div class="widgets">
          <div class="widget">
            <harmony-datetime-picker id="dt-empty"></harmony-datetime-picker>
          </div>
          <div class="widget">
            <harmony-datetime-picker id="dt-value" value="2024-01-15T14:30"></harmony-datetime-picker>
          </div>
        </div>
        <p class="value" id="dt-value-readout">Selected: 2024-01-15T14:30</p>
      </demo-example>

      <h3>12-hour time</h3>
      <demo-example>
        <div class="widget">
          <harmony-datetime-picker id="dt-12" value="2024-01-15T14:30" time-format="12"></harmony-datetime-picker>
        </div>
      </demo-example>

      <h3>Disabled date and time</h3>
      <demo-example>
        <div class="widget">
          <harmony-datetime-picker disabled value="2024-01-15T14:30"></harmony-datetime-picker>
        </div>
      </demo-example>

      <h3>Month and week</h3>
      <demo-example>
        <div class="widgets">
          <div class="widget">
            <harmony-month-picker id="month-basic" value="2024-06"></harmony-month-picker>
          </div>
          <div class="widget">
            <harmony-week-picker id="week-basic" value="2024-W03"></harmony-week-picker>
          </div>
        </div>
        <p class="value" id="month-week-value">Selected: —</p>
      </demo-example>

      <h3>Popup</h3>
      <p class="muted">Popover API anchored to the trigger. Choosing a date closes the popup.</p>
      <demo-example>
        <div class="field">
          <button type="button" id="open-date">Choose date</button>
          <p class="value" id="popup-value">Selected: —</p>
        </div>
        <harmony-picker-popup id="date-popup" for="open-date" title="Select date">
          <harmony-date-picker id="popup-date"></harmony-date-picker>
        </harmony-picker-popup>
      </demo-example>

      <h2 id="date-input">Date input</h2>
      <p class="muted">Form field. The control shows a locale date; the form value stays the machine string. <code>time-format</code> changes the popup clock only.</p>

      <h3>Date</h3>
      <demo-example>
        <div class="fields">
          <harmony-date-input id="field-date"></harmony-date-input>
        </div>
        <p class="value" id="field-date-value">Value: —</p>
      </demo-example>

      <h3>Time</h3>
      <demo-example>
        <div class="fields">
          <harmony-date-input id="field-time" type="time" value="14:30"></harmony-date-input>
        </div>
      </demo-example>

      <h3>Date and time</h3>
      <demo-example>
        <div class="fields">
          <harmony-date-input id="field-datetime" type="datetime-local" value="2024-01-15T14:30"></harmony-date-input>
        </div>
      </demo-example>

      <h3>Month and week</h3>
      <demo-example>
        <div class="fields">
          <harmony-date-input id="field-month" type="month" value="2024-06"></harmony-date-input>
          <harmony-date-input id="field-week" type="week" value="2024-W03"></harmony-date-input>
        </div>
      </demo-example>

      <h3>With constraints</h3>
      <p class="muted">Next 30 days. Days outside min/max are disabled in the popup.</p>
      <demo-example>
        <div class="fields">
          <harmony-date-input id="field-constrained" min="${min}" max="${max}"></harmony-date-input>
        </div>
      </demo-example>

      <h3>Disabled</h3>
      <demo-example>
        <div class="fields">
          <harmony-date-input id="field-disabled" disabled value="2024-01-15"></harmony-date-input>
        </div>
      </demo-example>

      <h3>With label</h3>
      <demo-example>
        <div class="fields">
          <harmony-date-input id="field-stacked" label="Select Date" label-variant="stacked"></harmony-date-input>
          <harmony-date-input id="field-inline" label="Select Date" label-variant="inline"></harmony-date-input>
        </div>
      </demo-example>

      <h3>12-hour time</h3>
      <demo-example>
        <div class="fields">
          <harmony-date-input id="field-time-12" type="time" time-format="12" value="14:30"></harmony-date-input>
        </div>
      </demo-example>

      <h3>Form layout</h3>
      <p class="muted">Same label column and required mark as <code>harmony-input</code>.</p>
      <demo-example>
        <form class="form-card">
          <harmony-form-layout id="field-form" label-layout="inline">
            <harmony-form-row>
              <harmony-input id="field-name" name="name" label="Name" value="Ada"></harmony-input>
              <harmony-date-input id="field-start" name="start" label="Start" type="date" required></harmony-date-input>
            </harmony-form-row>
          </harmony-form-layout>
        </form>
      </demo-example>

      <h2 id="not-converted">Not in this scope</h2>
      <demo-callout tone="warning" heading="Date range picker">
        Date range and expanded range pickers are internal reference components, not catalog elements. Range day styles are not on <code>harmony-date-picker</code>.
      </demo-callout>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Tag</th><th>Events</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><code>harmony-date-input</code></td><td><code>input</code>, <code>change</code></td><td>machine string</td></tr>
            <tr><td><code>harmony-picker-popup</code></td><td><code>toggle</code></td><td>—</td></tr>
            <tr><td><code>harmony-date-picker</code></td><td><code>date-select</code></td><td><code>YYYY-MM-DD</code></td></tr>
            <tr><td><code>harmony-time-picker</code></td><td><code>time-select</code></td><td><code>HH:MM</code></td></tr>
            <tr><td><code>harmony-datetime-picker</code></td><td><code>datetime-select</code></td><td><code>YYYY-MM-DDTHH:MM</code></td></tr>
            <tr><td><code>harmony-month-picker</code></td><td><code>month-select</code></td><td><code>YYYY-MM</code></td></tr>
            <tr><td><code>harmony-week-picker</code></td><td><code>week-select</code></td><td><code>YYYY-Www</code></td></tr>
          </tbody>
        </table>
        <p class="muted">Widgets are not form-associated. <code>harmony-date-input</code> is. Forced-colors: shadow-local Highlight focus and a GrayText disabled field.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n` +
      `import { setDateTimeDefaults } from '@dltkrichardhuska/harmony-design-system-vanilla';\n\n` +
      `registerHarmonyElements();\n` +
      `setDateTimeDefaults({ locale: 'en-US', timeFormat: '24' });\n\n` +
      `<harmony-date-input id="start" name="start" label="Start" type="date" required></harmony-date-input>`;
    consume.staticZip =
      `<html data-harmony-locale="en-US" data-harmony-time-format="24">\n` +
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-date-input id="start" name="start" type="date"></harmony-date-input>`;

    const setText = (id, text) => {
      const el = this.shadowRoot.getElementById(id);
      if (el) el.textContent = text;
    };
    const asDateField = this.shadowRoot.getElementById('field-as-date');
    const refreshAsDate = () => {
      const d = asDateField?.valueAsDate;
      setText(
        'field-as-date-value',
        d ? `valueAsDate: ${d.toDateString()} (machine ${asDateField.value})` : 'valueAsDate: —',
      );
    };
    this.shadowRoot.getElementById('set-as-date')?.addEventListener('click', () => {
      if (!asDateField) return;
      asDateField.valueAsDate = new Date();
      refreshAsDate();
    });
    asDateField?.addEventListener('change', refreshAsDate);
    this.shadowRoot.getElementById('field-date')?.addEventListener('change', (event) => {
      setText('field-date-value', `Value: ${event.detail}`);
    });
    this.shadowRoot.getElementById('date-basic')?.addEventListener('date-select', (event) => {
      setText('date-basic-value', `Selected: ${event.detail.date}`);
    });
    this.shadowRoot.getElementById('time-24')?.addEventListener('time-select', (event) => {
      setText('time-value', `Selected: ${event.detail.time}`);
    });
    const onDateTime = (event) => {
      setText('dt-value-readout', `Selected: ${event.detail.datetime}`);
    };
    this.shadowRoot.getElementById('dt-empty')?.addEventListener('datetime-select', onDateTime);
    this.shadowRoot.getElementById('dt-value')?.addEventListener('datetime-select', onDateTime);
    this.shadowRoot.getElementById('dt-12')?.addEventListener('datetime-select', onDateTime);
    this.shadowRoot.getElementById('time-12')?.addEventListener('time-select', (event) => {
      setText('time-value', `Selected: ${event.detail.time}`);
    });
    this.shadowRoot.getElementById('month-basic')?.addEventListener('month-select', (event) => {
      setText('month-week-value', `Selected: ${event.detail.value}`);
    });
    this.shadowRoot.getElementById('week-basic')?.addEventListener('week-select', (event) => {
      setText('month-week-value', `Selected: ${event.detail.value}`);
    });
    this.shadowRoot.getElementById('popup-date')?.addEventListener('date-select', (event) => {
      setText('popup-value', `Selected: ${event.detail.date}`);
      this.shadowRoot.getElementById('date-popup')?.hide();
    });
  }
}

if (!customElements.get('demo-date-picker-page')) {
  customElements.define('demo-date-picker-page', DemoDatePickerPage);
}
