import { useEffect } from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { HarmonyIcon } from '@/components/HarmonyIcon';
import { DemoPageHeader } from '@/demo/converted/foundation/DemoPageHeader';
import { DemoSection } from '@/demo/converted/foundation/DemoSection';
import { DemoCallout } from '@/demo/converted/foundation/DemoCallout';
import { UnsupportedEquivalentCallout } from '@/demo/UnsupportedEquivalentCallout';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  DemoMappingSection,
  PropsTable,
  type PropRow,
} from '@/demo/ui';
import { demoPageTitle } from '@/demo/demoPageTitle';

const dateInputProps: PropRow[] = [
  {
    name: 'type',
    type: "'date' | 'time' | 'datetime-local' | 'month'",
    default: "'date'",
    description: 'Select DatePicker, TimePicker, DateTimePicker, or month-view DatePicker.',
  },
  {
    name: 'value / defaultValue',
    type: 'Dayjs | null',
    default: 'null',
    description: 'MUI X uses adapter-native Dayjs values rather than ISO strings.',
  },
  {
    name: 'min / max',
    type: 'string',
    default: '—',
    description: 'Map to minDate / maxDate or minTime / maxTime with Dayjs values.',
  },
  {
    name: 'disabled / required',
    type: 'boolean',
    default: 'false',
    description: 'Use picker disabled and slotProps.textField.required.',
  },
  {
    name: 'name / id',
    type: 'string',
    default: '—',
    description: 'Pass through the field and slotProps.textField.',
  },
  {
    name: 'timeFormat',
    type: "'12' | '24'",
    default: "'24'",
    description: 'Map to ampm={true} for 12-hour or ampm={false} for 24-hour time.',
  },
  {
    name: 'locale',
    type: 'string',
    default: "'en-US'",
    description: 'Configure adapterLocale on the nearest LocalizationProvider.',
  },
  {
    name: 'label / labelVariant',
    type: 'string / stacked | inline',
    default: '—',
    description: 'Compose FormLabel + picker in a column or row Stack.',
  },
];

const mappingRows: PropRow[] = [
  {
    name: 'DateInput type="date"',
    type: 'DatePicker',
    description: 'Outlined MUI X DatePicker with Harmony field and calendar theme overrides.',
  },
  {
    name: 'DateInput type="time"',
    type: 'TimePicker',
    description: 'MUI X TimePicker; timeFormat maps to the documented ampm prop.',
  },
  {
    name: 'DateInput type="datetime-local"',
    type: 'DateTimePicker',
    description: 'MUI X DateTimePicker with the Dayjs adapter.',
  },
  {
    name: 'DateInput type="month"',
    type: 'DatePicker',
    description: "DatePicker with views={['year', 'month']} and openTo=\"month\".",
  },
  {
    name: 'labelVariant',
    type: 'Stack + FormLabel',
    description: 'Column Stack for stacked labels; row Stack for inline labels.',
  },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#date-range-picker', label: 'Date Range Picker' },
  { href: '#props', label: 'Props' },
  { href: '#accessibility', label: 'Accessibility' },
  { href: '#mapping', label: 'Harmony mapping' },
];

export function DatePickerDemo() {
  const today = dayjs().startOf('day');

  useEffect(() => {
    document.title = demoPageTitle('Date Picker');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Date Picker"
        description="Date and time input components powered by MUI X with Harmony field and popup styling."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Date Input" description="Standard date picker.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="date-basic">Select Date</FormLabel>
            <DatePicker
              format="MMM D, YYYY"
              slotProps={{ textField: { id: 'date-basic' } }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Time Input" description="Time picker.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="time-basic">Select Time</FormLabel>
            <TimePicker
              ampm={false}
              format="HH:mm"
              slotProps={{ textField: { id: 'time-basic' } }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Date and Time" description="Combined date and time picker.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="datetime-basic">Select Date &amp; Time</FormLabel>
            <DateTimePicker
              ampm={false}
              format="MMM D, YYYY HH:mm"
              slotProps={{ textField: { id: 'datetime-basic' } }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Constraints" description="Date picker with min/max limits.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="date-constrained">Select Date (Next 30 days)</FormLabel>
            <DatePicker
              minDate={today}
              maxDate={today.add(30, 'day')}
              format="MMM D, YYYY"
              slotProps={{ textField: { id: 'date-constrained' } }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Disabled" description="Disabled date picker.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="date-disabled">Select Date (Disabled)</FormLabel>
            <DatePicker
              disabled
              defaultValue={dayjs('2024-01-15')}
              format="MMM D, YYYY"
              slotProps={{ textField: { id: 'date-disabled' } }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Label (Stacked)"
          description="Date input with label on top (default for non-CP themes)."
        >
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="date-stacked">Select Date</FormLabel>
            <DatePicker
              format="MMM D, YYYY"
              slotProps={{ textField: { id: 'date-stacked' } }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Label (Inline)"
          description="Date input with label to the left (default for CP theme)."
        >
          <Stack direction="row" spacing={1} sx={{ maxWidth: 420, alignItems: 'center' }}>
            <FormLabel htmlFor="date-inline" sx={{ whiteSpace: 'nowrap' }}>
              Select Date
            </FormLabel>
            <DatePicker
              format="MMM D, YYYY"
              slotProps={{ textField: { id: 'date-inline' } }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Month Picker" description="Month and year selection.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="month-basic">Select Month</FormLabel>
            <DatePicker
              views={['year', 'month']}
              openTo="month"
              format="MMMM YYYY"
              slotProps={{ textField: { id: 'month-basic' } }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Week Picker" description="ISO week selection.">
          <UnsupportedEquivalentCallout
            feature='DateInput type="week"'
            reason="MUI X Community does not ship a WeekPicker component. The user approved skipping this type."
          />
        </DemoExampleGroup>

        <DemoExampleGroup
          title="12-Hour Time Format"
          description="Time picker with 12-hour format and AM/PM."
        >
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="time-12h">Select Time (12-hour)</FormLabel>
            <TimePicker
              ampm
              format="hh:mm A"
              slotProps={{ textField: { id: 'time-12h' } }}
            />
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="date-range-picker" title="Date Range Picker">
        <DemoCallout
          title="Date range conversion follows separately"
          icon={<HarmonyIcon name="calendar" fontSize="inherit" />}
        >
          The reference page also documents DateRangePicker and DateRangePickerExpanded. Those internal
          components are outside this DateInput scope and remain a separate follow-up.
        </DemoCallout>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <Typography variant="h6" sx={{ mb: 2 }}>
          DateInput
        </Typography>
        <PropsTable props={dateInputProps} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard title="Keyboard Navigation" icon="keyboard">
            Arrow keys navigate dates and time options. Enter or Space selects, Page Up and Page Down
            change months, and Escape closes the picker.
          </A11yCard>
          <A11yCard title="ARIA Attributes" icon="eye">
            MUI X supplies dialog, grid, gridcell, selected-state, and field labeling semantics through
            its documented picker components.
          </A11yCard>
          <A11yCard title="Focus Indicators" icon="cursor-arrow-rays">
            The Harmony theme preserves visible keyboard focus on the field, calendar days, navigation
            controls, and time options.
          </A11yCard>
          <A11yCard title="Screen Reader Support" icon="hand-raised">
            Use an associated FormLabel or the picker label prop so the selected value and available
            controls have an accessible name.
          </A11yCard>
        </Stack>
      </DemoSection>

      <DemoMappingSection rows={mappingRows} />
    </Box>
  );
}
