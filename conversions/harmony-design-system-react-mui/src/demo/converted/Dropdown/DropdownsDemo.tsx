import { useEffect, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { DemoPageHeader } from '@/demo/converted/foundation/DemoPageHeader';
import { DemoSection } from '@/demo/converted/foundation/DemoSection';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  DemoMappingSection,
  PropsTable,
  type PropRow,
} from '@/demo/ui';
import { UnsupportedEquivalentCallout } from '@/demo/UnsupportedEquivalentCallout';
import { demoPageTitle } from '@/demo/demoPageTitle';

const selectProps: PropRow[] = [
  { name: 'value', type: 'string', default: '—', description: 'Selected value' },
  { name: 'displayEmpty', type: 'boolean', default: 'true (theme)', description: 'Allows empty / placeholder selection' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select' },
  { name: 'name / id', type: 'string', default: '—', description: 'Form / DOM attributes' },
  { name: 'children', type: 'MenuItem[]', default: '—', description: 'Options as MenuItem children' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'options[]', type: '—', description: 'MenuItem children (value / label / disabled)' },
  { name: 'value / disabled / name / id', type: '—', description: 'Select props' },
  { name: 'placeholder', type: '—', description: 'displayEmpty + empty MenuItem + renderValue' },
  { name: 'label + labelVariant stacked', type: '—', description: 'Stack: FormLabel above Select' },
  { name: 'label + labelVariant inline', type: '—', description: 'Stack direction="row": FormLabel + Select' },
  { name: 'trigger / option-N slots', type: '—', description: 'Not supported — see callout' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function DropdownsDemo() {
  const [country, setCountry] = useState('');
  const [countryStacked, setCountryStacked] = useState('');
  const [countryInline, setCountryInline] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    document.title = demoPageTitle('Dropdowns');
  }, []);

  const onCountry = (event: SelectChangeEvent) => setCountry(event.target.value);
  const onCountryStacked = (event: SelectChangeEvent) => setCountryStacked(event.target.value);
  const onCountryInline = (event: SelectChangeEvent) => setCountryInline(event.target.value);
  const onPriority = (event: SelectChangeEvent) => setPriority(event.target.value);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Dropdowns"
        description="Dropdowns allow users to select an option from a list. They're useful when space is limited or options exceed 5 items."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature="trigger / option-0…9 slots"
          reason="MUI Select uses MenuItem children for options instead of Astro named slots. Custom trigger replacement is not mapped."
        />

        <DemoExampleGroup title="Basic Dropdown" description="Standard dropdown with options.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="country-basic">Country</FormLabel>
            <FormControl fullWidth>
              <Select
                id="country-basic"
                name="country-basic"
                value={country}
                onChange={onCountry}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) return 'Select a country';
                  return countries.find((c) => c.value === selected)?.label ?? selected;
                }}
              >
                {countries.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Label (Stacked)"
          description="Dropdown with label on top (default for non-CP themes)."
        >
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="country-stacked">Country</FormLabel>
            <FormControl fullWidth>
              <Select
                id="country-stacked"
                name="country-stacked"
                value={countryStacked}
                onChange={onCountryStacked}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) return 'Select a country';
                  return countries.find((c) => c.value === selected)?.label ?? selected;
                }}
              >
                {countries.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Label (Inline)"
          description="Dropdown with label to the left (default for CP theme)."
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ maxWidth: 480, alignItems: 'center' }}
          >
            <FormLabel htmlFor="country-inline">Country</FormLabel>
            <FormControl fullWidth>
              <Select
                id="country-inline"
                name="country-inline"
                value={countryInline}
                onChange={onCountryInline}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) return 'Select a country';
                  return countries.find((c) => c.value === selected)?.label ?? selected;
                }}
              >
                {countries.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Pre-selected Value" description="Dropdown with a default selection.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="priority-select">Priority</FormLabel>
            <FormControl fullWidth>
              <Select
                id="priority-select"
                name="priority"
                value={priority}
                onChange={onPriority}
              >
                {priorities.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Disabled" description="Disabled dropdown state.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="country-disabled">Country (Disabled)</FormLabel>
            <FormControl fullWidth disabled>
              <Select id="country-disabled" name="country-disabled" value="us">
                {countries.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={selectProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Labels" icon="tag">
          Associate labels with selects via <code>FormLabel htmlFor</code> matching the Select <code>id</code>, or
          wrap with <code>FormControl</code> patterns.
        </A11yCard>
        <A11yCard title="Keyboard Navigation" icon="keyboard">
          <kbd>Tab</kbd> focuses the control; <kbd>Enter</kbd>/<kbd>Space</kbd> opens; arrows move options;{' '}
          <kbd>Escape</kbd> closes.
        </A11yCard>
        <A11yCard title="ARIA Attributes" icon="tag">
          MUI Select provides combobox / listbox semantics (<code>aria-expanded</code>, <code>aria-haspopup</code>,
          labelled-by associations).
        </A11yCard>
        <A11yCard title="Disabled State" icon="no-symbol">
          Disabled selects are not focusable and are announced as disabled.
        </A11yCard>
      </DemoSection>
    </Box>
  );
}
