import { useEffect, useMemo, useState } from 'react';
import {
  DateInput,
  DateInputField,
  Label,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  ImportSnippet,
  PropsTable,
  type PropRow,
} from '../../ui';
import { UnsupportedEquivalentCallout } from '../../UnsupportedEquivalentCallout';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

const dateInputPropRows: PropRow[] = [
  {
    name: 'type',
    type: "'date' | 'time' | 'datetime-local' | 'month' | 'week'",
    default: "'date'",
    description: 'Which picker panel opens',
  },
  { name: 'value', type: 'string', default: '—', description: 'ISO value for the selected type' },
  { name: 'onChange', type: '(value: string) => void', default: '—', description: 'Form-style value handler' },
  { name: 'min / max', type: 'string', default: '—', description: 'Bounds in the same ISO shape as value' },
  { name: 'timeFormat', type: "'12' | '24'", default: "'24'", description: 'Time display/spinner format' },
  { name: 'locale', type: 'string', default: "'en-US'", description: 'Display locale' },
  { name: 'error / errorMessage', type: 'boolean / string', default: '—', description: 'Same as Input' },
  { name: 'disabled / required / name / id', type: '—', default: '—', description: 'Standard form props' },
];

const datePickerPropRows: PropRow[] = [
  { name: 'value', type: 'string (YYYY-MM-DD)', default: '—', description: 'Selected date' },
  { name: 'onSelect', type: '(date: string) => void', default: '—', description: 'Day selected' },
  { name: 'min / max', type: 'string', default: '—', description: 'Selectable bounds' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all days' },
  { name: 'locale', type: 'string', default: "'en-US'", description: 'Display locale hint' },
];

const timePickerPropRows: PropRow[] = [
  { name: 'value', type: 'string (HH:MM)', default: '—', description: '24h time value' },
  { name: 'onSelect', type: '(time: string) => void', default: '—', description: 'Time changed' },
  { name: 'format', type: "'12' | '24'", default: "'24'", description: 'Display / spinner mode' },
  { name: 'step', type: 'number', default: '1', description: 'Minute step' },
  { name: 'min / max', type: 'string', default: '—', description: 'Time bounds' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable controls' },
];

const monthPickerPropRows: PropRow[] = [
  { name: 'value', type: 'string (YYYY-MM)', default: '—', description: 'Selected month' },
  { name: 'onSelect', type: '(month: string) => void', default: '—', description: 'Month selected' },
  { name: 'min / max', type: 'string', default: '—', description: 'Bounds' },
  { name: 'locale', type: 'string', default: "'en-US'", description: 'Month labels' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable' },
];

const weekPickerPropRows: PropRow[] = [
  { name: 'value', type: 'string (YYYY-Www)', default: '—', description: 'Selected ISO week' },
  { name: 'onSelect', type: '(week: string) => void', default: '—', description: 'Week selected' },
  { name: 'min / max', type: 'string', default: '—', description: 'Bounds' },
  { name: 'locale', type: 'string', default: "'en-US'", description: 'Range labels' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable' },
];

const dateTimePickerPropRows: PropRow[] = [
  { name: 'value', type: 'string (YYYY-MM-DDTHH:MM)', default: '—', description: 'Selected datetime' },
  { name: 'onSelect', type: '(datetime: string) => void', default: '—', description: 'Fires when both date and time are set' },
  { name: 'timeFormat', type: "'12' | '24'", default: "'24'", description: 'Time panel format' },
  { name: 'min / max', type: 'string', default: '—', description: 'Datetime or date bounds' },
  { name: 'locale', type: 'string', default: "'en-US'", description: 'Date locale' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#date-range-picker', label: 'Date Range Picker', icon: 'calendar' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function DatePickerDemo() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [datetime, setDatetime] = useState('');
  const [month, setMonth] = useState('');
  const [week, setWeek] = useState('');
  const [time12, setTime12] = useState('');
  const [constrained, setConstrained] = useState('');

  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const max = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return {
      minDate: today.toISOString().split('T')[0],
      maxDate: max.toISOString().split('T')[0],
    };
  }, []);

  useEffect(() => {
    document.title = demoPageTitle('Date Picker');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Date Picker"
        description="Custom date and time pickers with Popover + Calendar patterns, form Field compatibility, and accessibility support."
      />

      <ImportSnippet
        code={`import {
  DateInput,
  DateInputField,
  DatePicker,
  Calendar,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<DateInput type="date" value={date} onChange={setDate} />
<DateInputField label="Select Date" labelVariant="stacked" value={date} onChange={setDate} />
<Calendar value={date} onSelect={setDate} />`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Date Input" description="Standard date picker.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="date-basic">Select Date</Label>
            <DateInput id="date-basic" value={date} onChange={setDate} />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Time Input" description="Time picker.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="time-basic">Select Time</Label>
            <DateInput id="time-basic" type="time" value={time} onChange={setTime} />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Date and Time" description="Combined date and time picker.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="datetime-basic">Select Date & Time</Label>
            <DateInput
              id="datetime-basic"
              type="datetime-local"
              value={datetime}
              onChange={setDatetime}
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Constraints" description="Date picker with min/max limits.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="date-constrained">Select Date (Next 30 days)</Label>
            <DateInput
              id="date-constrained"
              value={constrained}
              onChange={setConstrained}
              min={minDate}
              max={maxDate}
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Disabled" description="Disabled date picker.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="date-disabled">Select Date (Disabled)</Label>
            <DateInput id="date-disabled" disabled value="2024-01-15" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Label (Stacked)"
          description="DateInputField with label on top (default for non-CP themes)."
        >
          <div className="max-w-sm">
            <DateInputField
              label="Select Date"
              labelVariant="stacked"
              value={date}
              onChange={setDate}
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Label (Inline)"
          description="DateInputField with label to the left (default for CP theme)."
        >
          <div className="max-w-sm">
            <DateInputField
              label="Select Date"
              labelVariant="inline"
              value={date}
              onChange={setDate}
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Month Picker" description="Month and year selection.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="month-basic">Select Month</Label>
            <DateInput id="month-basic" type="month" value={month} onChange={setMonth} />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Week Picker" description="ISO week selection.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="week-basic">Select Week</Label>
            <DateInput id="week-basic" type="week" value={week} onChange={setWeek} />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="12-Hour Time Format" description="Time picker with 12-hour format and AM/PM.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="time-12h">Select Time (12-hour)</Label>
            <DateInput
              id="time-12h"
              type="time"
              timeFormat="12"
              value={time12}
              onChange={setTime12}
            />
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="date-range-picker" title="Date Range Picker">
        <UnsupportedEquivalentCallout
          feature="DateRangePicker / DateRangePickerExpanded"
          reason="Internal reference components — out of scope for this conversion batch. Convert in a follow-up plan."
        />
      </DemoSection>

      <DemoSection id="props" title="Props">
        <h3 className="mb-3 text-base font-semibold">DateInput</h3>
        <PropsTable props={dateInputPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">DatePicker / Calendar</h3>
        <PropsTable props={datePickerPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">TimePicker</h3>
        <PropsTable props={timePickerPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">MonthPicker</h3>
        <PropsTable props={monthPickerPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">WeekPicker</h3>
        <PropsTable props={weekPickerPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">DateTimePicker</h3>
        <PropsTable props={dateTimePickerPropRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="grid gap-4 md:grid-cols-2">
          <A11yCard icon="keyboard" title="Keyboard Navigation">
            <p>All pickers support full keyboard navigation:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <kbd>Arrow Keys</kbd> — Navigate between dates/months/weeks
              </li>
              <li>
                <kbd>Enter</kbd> or <kbd>Space</kbd> — Select the focused item
              </li>
              <li>
                <kbd>Home</kbd> / <kbd>End</kbd> — Jump to first/last item in current view
              </li>
              <li>
                <kbd>Page Up</kbd> / <kbd>Page Down</kbd> — Navigate months (date picker)
              </li>
              <li>
                <kbd>Escape</kbd> — Close the picker popup
              </li>
            </ul>
          </A11yCard>
          <A11yCard icon="eye" title="ARIA Attributes">
            <p>All pickers include proper ARIA roles and attributes:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <code>role=&quot;dialog&quot;</code> on the popup container
              </li>
              <li>
                <code>role=&quot;grid&quot;</code> on calendar grids
              </li>
              <li>
                <code>role=&quot;gridcell&quot;</code> on individual date/month cells
              </li>
              <li>
                <code>aria-label</code> and <code>aria-selected</code> for screen reader support
              </li>
              <li>Proper focus management within the picker</li>
            </ul>
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Focus Indicators">
            All interactive elements have visible focus indicators using the theme primary color with
            sufficient contrast for WCAG 2.1 compliance.
          </A11yCard>
          <A11yCard icon="hand-raised" title="Screen Reader Support">
            Screen readers announce the picker type, current selection, available dates/times, and
            navigation instructions. Selected items are clearly indicated with{' '}
            <code>aria-selected=&quot;true&quot;</code>.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
