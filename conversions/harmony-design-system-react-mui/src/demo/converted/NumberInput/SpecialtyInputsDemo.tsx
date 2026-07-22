import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { HarmonyIcon } from '@/components/HarmonyIcon';
import { useDemoPreferences } from '@/demo/DemoPreferencesProvider';
import { DemoPageHeader } from '@/demo/converted/foundation/DemoPageHeader';
import { DemoSection } from '@/demo/converted/foundation/DemoSection';
import { UnsupportedEquivalentCallout } from '@/demo/UnsupportedEquivalentCallout';
import {
  DemoArticleNav,
  DemoExampleGroup,
  DemoMappingSection,
  PropsTable,
  type PropRow,
} from '@/demo/ui';
import { demoPageTitle } from '@/demo/demoPageTitle';

const numberInputProps: PropRow[] = [
  { name: 'value', type: 'number', default: '0', description: 'Current value (controlled TextField)' },
  { name: 'min / max / step', type: 'number', default: '— / — / 1', description: 'Clamp and step for IconButton handlers' },
  { name: 'name / id / disabled', type: '—', default: '—', description: 'Standard TextField props' },
  {
    name: 'slotProps.input.startAdornment / endAdornment',
    type: 'ReactNode',
    default: '—',
    description: 'InputAdornment + IconButton + HarmonyIcon minus/plus',
  },
];

const rangeInputProps: PropRow[] = [
  { name: 'value / min / max / step', type: 'number', default: '—', description: 'Slider props' },
  { name: 'disabled / name / id', type: '—', default: '—', description: 'Standard Slider / FormControl props' },
  {
    name: 'showPercent / prefix / suffix',
    type: '—',
    default: '—',
    description: 'Format sibling Typography value label (composite)',
  },
];

const timePickerProps: PropRow[] = [
  {
    name: 'value / defaultValue',
    type: 'Dayjs | null',
    default: 'null',
    description: 'MUI X TimePicker uses adapter-native Dayjs values.',
  },
  {
    name: 'min / max',
    type: 'string',
    default: '—',
    description: 'Map to minTime / maxTime with Dayjs values.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the picker' },
  {
    name: 'format (Harmony)',
    type: "'12' | '24'",
    default: "'24'",
    description: 'Map to ampm={true} for 12-hour or ampm={false} for 24-hour time.',
  },
  {
    name: 'step',
    type: 'number',
    default: '1',
    description: 'Map to timeSteps.minutes on TimePicker.',
  },
  { name: 'id', type: 'string', default: '—', description: 'Pass through slotProps.textField.id' },
];

const monthPickerProps: PropRow[] = [
  {
    name: 'value / defaultValue',
    type: 'Dayjs | null',
    default: 'null',
    description: 'Dayjs value on DatePicker with year/month views.',
  },
  {
    name: 'min / max',
    type: 'string',
    default: '—',
    description: 'Map to minDate / maxDate with Dayjs values.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the picker' },
  {
    name: 'locale',
    type: 'string',
    default: "'en-US'",
    description: 'Configure adapterLocale on the nearest LocalizationProvider.',
  },
  {
    name: 'month-only selection',
    type: '—',
    default: '—',
    description: "DatePicker views={['year', 'month']} openTo=\"month\" format=\"MMMM YYYY\".",
  },
  { name: 'id', type: 'string', default: '—', description: 'Pass through slotProps.textField.id' },
];

const weekPickerProps: PropRow[] = [
  { name: 'value', type: 'string', default: '—', description: 'Current value (ISO week) — skipped in this conversion' },
  { name: 'min', type: 'string', default: '—', description: 'Minimum date — skipped' },
  { name: 'max', type: 'string', default: '—', description: 'Maximum date — skipped' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the picker — skipped' },
  { name: 'locale', type: 'string', default: "'en-US'", description: 'Locale for formatting — skipped' },
  { name: 'id', type: 'string', default: '—', description: 'Element id — skipped' },
];

const dateTimePickerProps: PropRow[] = [
  {
    name: 'value / defaultValue',
    type: 'Dayjs | null',
    default: 'null',
    description: 'MUI X DateTimePicker uses adapter-native Dayjs values.',
  },
  {
    name: 'min / max',
    type: 'string',
    default: '—',
    description: 'Map to minDateTime / maxDateTime with Dayjs values.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the picker' },
  {
    name: 'timeFormat',
    type: "'12' | '24'",
    default: "'24'",
    description: 'Map to ampm on DateTimePicker.',
  },
  {
    name: 'locale',
    type: 'string',
    default: "'en-US'",
    description: 'Configure adapterLocale on the nearest LocalizationProvider.',
  },
  { name: 'id', type: 'string', default: '—', description: 'Pass through slotProps.textField.id' },
];

const harmonyMappingRows: PropRow[] = [
  {
    name: 'NumberInput steppers',
    type: '—',
    description:
      'TextField type="number" + InputAdornment start/end with IconButton + HarmonyIcon minus/plus',
  },
  {
    name: 'RangeInput',
    type: '—',
    description: 'Slider + Typography for showPercent / prefix / suffix',
  },
  {
    name: 'DateInput type="date"',
    type: 'DatePicker',
    description: 'Outlined MUI X DatePicker with Harmony field and calendar theme overrides.',
  },
  {
    name: 'DateInput type="time"',
    type: 'TimePicker',
    description: 'MUI X TimePicker; Harmony timeFormat maps to the documented ampm prop.',
  },
  {
    name: 'labelVariant stacked / inline',
    type: '—',
    description: 'Stack column vs row FormLabel + control',
  },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
];

function formatRangeValue(
  value: number,
  min: number,
  max: number,
  showPercent: boolean,
  prefix: string,
  suffix: string,
) {
  if (showPercent) {
    const pct = Math.round(((value - min) / (max - min)) * 100);
    return `${prefix}${pct}%${suffix}`;
  }
  return `${prefix}${value}${suffix}`;
}

export function SpecialtyInputsDemo() {
  const { product } = useDemoPreferences();
  /** CP compact steppers are narrower; other products match the default field density. */
  const stepperWidth = product === 'cp' ? 112 : 168;
  const [qty, setQty] = useState(1);
  const [stepQty, setStepQty] = useState(10);
  const [volume, setVolume] = useState(75);
  const [price, setPrice] = useState(100);
  const [inlineVolume, setInlineVolume] = useState(75);
  const [inlineQty, setInlineQty] = useState(1);

  useEffect(() => {
    document.title = demoPageTitle('Specialty Inputs');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Specialty Inputs"
        description="Specialized input types for numbers, URLs, currency, dates, and other formatted data."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Number Input" description="Input for numeric values.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="number-basic">Quantity</FormLabel>
            <TextField id="number-basic" type="number" placeholder="0" fullWidth />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Number Input with steppers"
          description="Number input with increment/decrement buttons via InputAdornment + IconButton."
        >
          <Stack spacing={2} sx={{ maxWidth: 280 }}>
            <Stack spacing={1}>
              <FormLabel htmlFor="number-stepper">Quantity</FormLabel>
              <TextField
                id="number-stepper"
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                sx={{ width: stepperWidth }}
                slotProps={{
                  htmlInput: { min: 0, max: 99, step: 1 },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="Decrement"
                          size="small"
                          disabled={qty <= 0}
                          onClick={() => setQty((v) => Math.max(0, v - 1))}
                        >
                          <HarmonyIcon name="minus" fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Increment"
                          size="small"
                          disabled={qty >= 99}
                          onClick={() => setQty((v) => Math.min(99, v + 1))}
                        >
                          <HarmonyIcon name="plus" fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="number-step-5">Step by 5</FormLabel>
              <TextField
                id="number-step-5"
                type="number"
                value={stepQty}
                onChange={(e) => setStepQty(Number(e.target.value))}
                sx={{ width: stepperWidth }}
                slotProps={{
                  htmlInput: { min: 0, max: 100, step: 5 },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="Decrement by 5"
                          size="small"
                          disabled={stepQty <= 0}
                          onClick={() => setStepQty((v) => Math.max(0, v - 5))}
                        >
                          <HarmonyIcon name="minus" fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Increment by 5"
                          size="small"
                          disabled={stepQty >= 100}
                          onClick={() => setStepQty((v) => Math.min(100, v + 5))}
                        >
                          <HarmonyIcon name="plus" fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="number-disabled">Disabled</FormLabel>
              <TextField
                id="number-disabled"
                type="number"
                value={5}
                disabled
                sx={{ width: stepperWidth }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton aria-label="Decrement" size="small" disabled>
                          <HarmonyIcon name="minus" fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="Increment" size="small" disabled>
                          <HarmonyIcon name="plus" fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Number Input With Label"
          description="Number input with inline label (default for CP theme)."
        >
          <Stack direction="row" spacing={1} sx={{ maxWidth: 320, alignItems: 'center' }}>
            <FormLabel htmlFor="inline-qty" sx={{ mb: 0, whiteSpace: 'nowrap' }}>
              Quantity
            </FormLabel>
            <TextField
              id="inline-qty"
              type="number"
              value={inlineQty}
              onChange={(e) => setInlineQty(Number(e.target.value))}
              sx={{ width: stepperWidth }}
              slotProps={{
                htmlInput: { min: 0, max: 99, step: 1 },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="Decrement"
                        size="small"
                        disabled={inlineQty <= 0}
                        onClick={() => setInlineQty((v) => Math.max(0, v - 1))}
                      >
                        <HarmonyIcon name="minus" fontSize="inherit" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Increment"
                        size="small"
                        disabled={inlineQty >= 99}
                        onClick={() => setInlineQty((v) => Math.min(99, v + 1))}
                      >
                        <HarmonyIcon name="plus" fontSize="inherit" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Range Input" description="Slider for selecting a value within a range.">
          <Stack spacing={3} sx={{ maxWidth: 360 }}>
            <Stack spacing={1}>
              <FormLabel id="volume-label">Volume</FormLabel>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Slider
                  aria-labelledby="volume-label"
                  value={volume}
                  min={0}
                  max={100}
                  onChange={(_, v) => setVolume(v as number)}
                  sx={{ flex: 1 }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ minWidth: 50, textAlign: 'right' }}>
                  {formatRangeValue(volume, 0, 100, true, '', '')}
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <FormLabel id="price-label">Price Range</FormLabel>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Slider
                  aria-labelledby="price-label"
                  value={price}
                  min={0}
                  max={200}
                  onChange={(_, v) => setPrice(v as number)}
                  sx={{ flex: 1 }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ minWidth: 50, textAlign: 'right' }}>
                  {formatRangeValue(price, 0, 200, false, '$', '')}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Range Input With Label"
          description="Range input with inline label (default for CP theme)."
        >
          <Stack direction="row" spacing={1} sx={{ maxWidth: 400, alignItems: 'center' }}>
            <FormLabel id="inline-volume-label" sx={{ mb: 0, whiteSpace: 'nowrap' }}>
              Volume
            </FormLabel>
            <Stack direction="row" spacing={1.5} sx={{ flex: 1, alignItems: 'center' }}>
              <Slider
                aria-labelledby="inline-volume-label"
                value={inlineVolume}
                min={0}
                max={100}
                onChange={(_, v) => setInlineVolume(v as number)}
                sx={{ flex: 1 }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ minWidth: 50, textAlign: 'right' }}>
                {formatRangeValue(inlineVolume, 0, 100, true, '', '')}
              </Typography>
            </Stack>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Date and Time" description="Inputs for date and time values.">
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              maxWidth: 448,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
          >
            <Stack spacing={1}>
              <FormLabel htmlFor="specialty-date">Date</FormLabel>
              <DatePicker
                format="MMM D, YYYY"
                slotProps={{ textField: { id: 'specialty-date', fullWidth: true } }}
              />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="specialty-time">Time</FormLabel>
              <TimePicker
                ampm={false}
                format="HH:mm"
                slotProps={{ textField: { id: 'specialty-time', fullWidth: true } }}
              />
            </Stack>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="URL Input" description="Input for website URLs.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="url-input">Website URL</FormLabel>
            <TextField
              id="url-input"
              type="url"
              placeholder="https://example.com"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <HarmonyIcon name="link" fontSize="inherit" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Phone Input" description="Input for phone numbers.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="phone-input">Phone Number</FormLabel>
            <TextField
              id="phone-input"
              type="tel"
              placeholder="(555) 555-5555"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <HarmonyIcon name="phone" fontSize="inherit" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <Typography variant="h6" sx={{ mb: 2 }}>
          NumberInput
        </Typography>
        <PropsTable props={numberInputProps} />
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          RangeInput
        </Typography>
        <PropsTable props={rangeInputProps} />
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          TimePicker
        </Typography>
        <PropsTable props={timePickerProps} />
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          MonthPicker
        </Typography>
        <PropsTable props={monthPickerProps} />
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          WeekPicker
        </Typography>
        <UnsupportedEquivalentCallout
          feature="WeekPicker"
          reason="MUI X Community does not ship a WeekPicker component. The user approved skipping this type."
        />
        <Box sx={{ mt: 2 }}>
          <PropsTable props={weekPickerProps} />
        </Box>
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          DateTimePicker
        </Typography>
        <PropsTable props={dateTimePickerProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />
    </Box>
  );
}
