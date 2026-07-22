import { useEffect, useState } from 'react';
import {
  DateInput,
  Input,
  Label,
  NumberField,
  NumberInput,
  RangeField,
  RangeInput,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  DemoArticleNav,
  DemoExampleGroup,
  ImportSnippet,
  PropsTable,
  type PropRow,
} from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

const numberPropRows: PropRow[] = [
  { name: 'value', type: 'number', default: '—', description: 'Controlled value' },
  { name: 'defaultValue', type: 'number', default: '0', description: 'Uncontrolled initial value' },
  { name: 'onChange', type: '(value: number) => void', default: '—', description: 'Value change handler' },
  { name: 'min', type: 'number', default: '—', description: 'Minimum value' },
  { name: 'max', type: 'number', default: '—', description: 'Maximum value' },
  { name: 'step', type: 'number', default: '1', description: 'Increment step' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control' },
];

const rangePropRows: PropRow[] = [
  { name: 'value', type: 'number', default: '—', description: 'Controlled value' },
  { name: 'defaultValue', type: 'number', default: '50', description: 'Uncontrolled initial value' },
  { name: 'onChange', type: '(value: number) => void', default: '—', description: 'Value change handler' },
  { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
  { name: 'step', type: 'number', default: '1', description: 'Step increment' },
  { name: 'showPercent', type: 'boolean', default: 'false', description: 'Show value as percentage' },
  { name: 'prefix', type: 'string', default: "''", description: 'Prefix before value' },
  { name: 'suffix', type: 'string', default: "''", description: 'Suffix after value' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the slider' },
];

const timePickerPropRows: PropRow[] = [
  { name: 'value', type: 'string (HH:MM)', default: '—', description: '24h time value' },
  { name: 'onSelect', type: '(time: string) => void', default: '—', description: 'Time changed' },
  { name: 'format', type: "'12' | '24'", default: "'24'", description: 'Display / spinner mode' },
  { name: 'step', type: 'number', default: '1', description: 'Minute step' },
  { name: 'min / max / disabled', type: '—', default: '—', description: 'Bounds and disabled' },
];

const monthPickerPropRows: PropRow[] = [
  { name: 'value', type: 'string (YYYY-MM)', default: '—', description: 'Selected month' },
  { name: 'onSelect', type: '(month: string) => void', default: '—', description: 'Month selected' },
  { name: 'min / max / locale / disabled', type: '—', default: '—', description: 'Bounds, locale, disabled' },
];

const weekPickerPropRows: PropRow[] = [
  { name: 'value', type: 'string (YYYY-Www)', default: '—', description: 'Selected ISO week' },
  { name: 'onSelect', type: '(week: string) => void', default: '—', description: 'Week selected' },
  { name: 'min / max / locale / disabled', type: '—', default: '—', description: 'Bounds, locale, disabled' },
];

const dateTimePickerPropRows: PropRow[] = [
  { name: 'value', type: 'string (YYYY-MM-DDTHH:MM)', default: '—', description: 'Selected datetime' },
  { name: 'onSelect', type: '(datetime: string) => void', default: '—', description: 'Fires when both parts set' },
  { name: 'timeFormat', type: "'12' | '24'", default: "'24'", description: 'Time panel format' },
  { name: 'min / max / locale / disabled', type: '—', default: '—', description: 'Bounds, locale, disabled' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
] as const;

export function SpecialtyInputsDemo() {
  const [qty, setQty] = useState(1);
  const [step5, setStep5] = useState(10);
  const [volume, setVolume] = useState(75);
  const [price, setPrice] = useState(100);
  const [specialtyDate, setSpecialtyDate] = useState('');
  const [specialtyTime, setSpecialtyTime] = useState('');

  useEffect(() => {
    document.title = demoPageTitle('Specialty Inputs');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Specialty Inputs"
        description="Specialized input types for numbers, ranges, URLs, and other formatted data."
      />

      <ImportSnippet
        code={`import {
  NumberInput,
  NumberField,
  RangeInput,
  RangeField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<NumberInput value={1} min={0} max={99} onChange={setQty} />
<RangeInput value={75} showPercent onChange={setVolume} />
<NumberField label="Quantity" labelVariant="inline" value={1} />`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Number type (Input)" description="Plain Input type=number.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="number-basic">Quantity</Label>
            <Input type="number" id="number-basic" placeholder="0" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Number Input"
          description="Number input with increment/decrement buttons."
        >
          <div className="max-w-xs space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ni-qty">Quantity</Label>
              <NumberInput id="ni-qty" value={qty} min={0} max={99} onChange={setQty} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ni-step">Step by 5</Label>
              <NumberInput
                id="ni-step"
                value={step5}
                step={5}
                min={0}
                max={100}
                onChange={setStep5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ni-disabled">Disabled</Label>
              <NumberInput id="ni-disabled" value={5} disabled />
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="NumberField"
          description="Convenience composite with inline label."
        >
          <div className="max-w-xs">
            <NumberField label="Quantity" labelVariant="inline" value={qty} min={0} max={99} onChange={setQty} />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Range Input" description="Slider for selecting a value within a range.">
          <div className="max-w-sm space-y-6">
            <div className="space-y-2">
              <Label>Volume</Label>
              <RangeInput value={volume} showPercent onChange={setVolume} />
            </div>
            <div className="space-y-2">
              <Label>Price Range</Label>
              <RangeInput value={price} min={0} max={200} prefix="$" onChange={setPrice} />
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="RangeField" description="Convenience composite with inline label.">
          <div className="max-w-sm">
            <RangeField
              label="Volume"
              labelVariant="inline"
              value={volume}
              showPercent
              onChange={setVolume}
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Date and Time" description="Inputs for date and time values.">
          <div className="grid max-w-md gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="specialty-date">Date</Label>
              <DateInput id="specialty-date" value={specialtyDate} onChange={setSpecialtyDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty-time">Time</Label>
              <DateInput
                id="specialty-time"
                type="time"
                value={specialtyTime}
                onChange={setSpecialtyTime}
              />
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="URL Input" description="Input for website URLs.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="url-input">Website URL</Label>
            <Input type="url" id="url-input" icon="link" placeholder="https://example.com" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Phone Input" description="Input for phone numbers.">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="phone-input">Phone Number</Label>
            <Input type="tel" id="phone-input" icon="phone" placeholder="(555) 555-5555" />
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <h3 className="mb-3 text-base font-semibold">NumberInput</h3>
        <PropsTable props={numberPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">RangeInput</h3>
        <PropsTable props={rangePropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">TimePicker</h3>
        <PropsTable props={timePickerPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">MonthPicker</h3>
        <PropsTable props={monthPickerPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">WeekPicker</h3>
        <PropsTable props={weekPickerPropRows} />
        <h3 className="mb-3 mt-8 text-base font-semibold">DateTimePicker</h3>
        <PropsTable props={dateTimePickerPropRows} />
      </DemoSection>
    </article>
  );
}
