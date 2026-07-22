import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { HarmonyIcon } from '@/components/HarmonyIcon';
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
import { demoPageTitle } from '@/demo/demoPageTitle';

const inputProps: PropRow[] = [
  { name: 'type', type: 'string', default: "'text'", description: 'HTML input type' },
  { name: 'placeholder / value / name / id', type: 'string', default: '—', description: 'Standard field props' },
  { name: 'disabled / required', type: 'boolean', default: 'false', description: 'Native form flags' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Error state on TextField' },
  { name: 'helperText', type: 'string', default: '—', description: 'Maps Harmony errorMessage' },
  { name: 'variant', type: "'outlined' | 'filled' | 'standard'", default: "'outlined'", description: 'outlined = Harmony; filled/standard = stock MUI' },
  { name: 'slotProps.input.startAdornment', type: 'ReactNode', default: '—', description: 'Leading icon / adornment' },
  { name: 'slotProps.input.endAdornment', type: 'ReactNode', default: '—', description: 'Trailing icon or action' },
];

const textareaProps: PropRow[] = [
  { name: 'multiline', type: 'boolean', default: 'true', description: 'Enable textarea mode' },
  { name: 'rows', type: 'number', default: '4', description: 'Visible rows (Harmony default 4)' },
  { name: 'placeholder / value / name / id', type: 'string', default: '—', description: 'Standard field props' },
  { name: 'disabled / required', type: 'boolean', default: 'false', description: 'Native form flags' },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'type / placeholder / value / name / id / disabled / required', type: '—', description: 'Same TextField props' },
  { name: 'error / errorMessage', type: '—', description: 'error + helperText' },
  { name: 'icon', type: '—', description: 'InputAdornment start + HarmonyIcon' },
  { name: 'trailingIcon / trailing slot', type: '—', description: 'InputAdornment end + HarmonyIcon or IconButton' },
  { name: 'label + labelVariant stacked', type: '—', description: 'Stack: FormLabel above TextField' },
  { name: 'label + labelVariant inline', type: '—', description: 'Stack direction="row": FormLabel + TextField' },
  { name: 'Textarea', type: '—', description: 'TextField multiline rows={4}' },
  {
    name: 'CP product density',
    type: '—',
    description:
      'createHarmonyTheme({ product: "cp" }) → 20px height, text-xs, radius-04; other products → 40px, text-base, radius-08',
  },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#usage', label: 'Usage' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function InputsDemo() {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = demoPageTitle('Inputs');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Inputs"
        description="Text inputs allow users to enter and edit text. They're used in forms, search fields, and anywhere text input is needed."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Input" description="Standard text input with label.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="email-basic">Email</FormLabel>
            <TextField id="email-basic" type="email" placeholder="you@example.com" fullWidth />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Input Types" description="Different input types for various data.">
          <Stack spacing={2} sx={{ maxWidth: 360 }}>
            <Stack spacing={1}>
              <FormLabel htmlFor="text-input">Text</FormLabel>
              <TextField id="text-input" placeholder="Enter text..." fullWidth />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="email-input">Email</FormLabel>
              <TextField id="email-input" type="email" placeholder="you@example.com" fullWidth />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="password-input">Password</FormLabel>
              <TextField id="password-input" type="password" placeholder="Enter password" fullWidth />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="number-input">Number</FormLabel>
              <TextField id="number-input" type="number" placeholder="0" fullWidth />
            </Stack>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icon" description="Input with leading icon for context.">
          <Stack spacing={2} sx={{ maxWidth: 360 }}>
            <Stack spacing={1}>
              <FormLabel htmlFor="search-input">Search</FormLabel>
              <TextField
                id="search-input"
                placeholder="Search…"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <HarmonyIcon name="magnifying-glass" fontSize="inherit" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="email-icon">Email</FormLabel>
              <TextField
                id="email-icon"
                type="email"
                placeholder="you@example.com"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <HarmonyIcon name="envelope" fontSize="inherit" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Trailing icon and slot"
          description="Use end adornment for a decorative icon, or an IconButton for interactive controls (password visibility)."
        >
          <Stack spacing={2} sx={{ maxWidth: 360 }}>
            <Stack spacing={1}>
              <FormLabel htmlFor="input-trailing-icon">Trailing icon</FormLabel>
              <TextField
                id="input-trailing-icon"
                placeholder="0.00"
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <HarmonyIcon name="currency-dollar" fontSize="inherit" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="input-lead-trail">Leading and trailing icons</FormLabel>
              <TextField
                id="input-lead-trail"
                placeholder="Search"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <HarmonyIcon name="magnifying-glass" fontSize="inherit" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <HarmonyIcon name="x-mark" fontSize="inherit" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="input-trailing-slot">Trailing slot (action)</FormLabel>
              <TextField
                id="input-trailing-slot"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          edge="end"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          <HarmonyIcon name={showPassword ? 'eye-slash' : 'eye'} fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Stack>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="States" description="Different input states for feedback.">
          <Stack spacing={2} sx={{ maxWidth: 360 }}>
            <Stack spacing={1}>
              <FormLabel htmlFor="default-state">Default</FormLabel>
              <TextField id="default-state" placeholder="Default state" fullWidth />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="disabled-state">Disabled</FormLabel>
              <TextField id="disabled-state" disabled defaultValue="Disabled input" fullWidth />
            </Stack>
            <Stack spacing={1}>
              <FormLabel htmlFor="error-state">Error</FormLabel>
              <TextField
                id="error-state"
                error
                helperText="Please enter a valid value"
                defaultValue="Invalid value"
                fullWidth
              />
            </Stack>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Textarea" description="Multi-line text input.">
          <Stack spacing={1} sx={{ maxWidth: 360 }}>
            <FormLabel htmlFor="textarea-basic">Description</FormLabel>
            <TextField
              id="textarea-basic"
              multiline
              rows={4}
              placeholder="Enter your message..."
              fullWidth
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Label (Stacked)"
          description="Input with label on top (default for non-CP themes)."
        >
          <FormControl fullWidth sx={{ maxWidth: 360 }}>
            <Stack spacing={1}>
              <FormLabel htmlFor="stacked-email">Email Address</FormLabel>
              <TextField id="stacked-email" type="email" placeholder="you@example.com" fullWidth />
            </Stack>
          </FormControl>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Label (Inline)"
          description="Input with label to the left (default for CP theme)."
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ maxWidth: 360, alignItems: 'center' }}
          >
            <FormLabel htmlFor="inline-email" sx={{ mb: 0, whiteSpace: 'nowrap' }}>
              Email Address
            </FormLabel>
            <TextField id="inline-email" type="email" placeholder="you@example.com" fullWidth />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Textarea With Label" description="Textarea with inline label.">
          <Stack
            direction="row"
            spacing={1}
            sx={{ maxWidth: 360, alignItems: 'flex-start' }}
          >
            <FormLabel htmlFor="inline-message" sx={{ mb: 0, whiteSpace: 'nowrap', mt: 1 }}>
              Message
            </FormLabel>
            <TextField
              id="inline-message"
              multiline
              rows={4}
              placeholder="Enter your message..."
              fullWidth
            />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Form Example" description="Complete form with inputs and labels.">
          <Card sx={{ maxWidth: 448 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Form
              </Typography>
              <Stack component="form" spacing={2} onSubmit={(e) => e.preventDefault()}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <FormLabel htmlFor="first-name" required>
                      First Name
                    </FormLabel>
                    <TextField id="first-name" placeholder="John" required fullWidth />
                  </Stack>
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <FormLabel htmlFor="last-name" required>
                      Last Name
                    </FormLabel>
                    <TextField id="last-name" placeholder="Doe" required fullWidth />
                  </Stack>
                </Stack>
                <Stack spacing={1}>
                  <FormLabel htmlFor="contact-email" required>
                    Email
                  </FormLabel>
                  <TextField
                    id="contact-email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <HarmonyIcon name="envelope" fontSize="inherit" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Stack>
                <Stack spacing={1}>
                  <FormLabel htmlFor="message" required>
                    Message
                  </FormLabel>
                  <TextField
                    id="message"
                    multiline
                    rows={4}
                    placeholder="How can we help you?"
                    required
                    fullWidth
                  />
                </Stack>
                <Button type="submit" variant="contained" fullWidth>
                  Send Message
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Form Example with Inline Labels"
          description="Complete form using inline labels (default for CP theme)."
        >
          <Card sx={{ maxWidth: 448 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Form
              </Typography>
              <Stack component="form" spacing={2} onSubmit={(e) => e.preventDefault()}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Stack direction="row" spacing={1} sx={{ flex: 1, alignItems: 'center' }}>
                    <FormLabel htmlFor="inline-first" required sx={{ mb: 0, whiteSpace: 'nowrap' }}>
                      First Name
                    </FormLabel>
                    <TextField id="inline-first" placeholder="John" required fullWidth />
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ flex: 1, alignItems: 'center' }}>
                    <FormLabel htmlFor="inline-last" required sx={{ mb: 0, whiteSpace: 'nowrap' }}>
                      Last Name
                    </FormLabel>
                    <TextField id="inline-last" placeholder="Doe" required fullWidth />
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <FormLabel htmlFor="inline-contact-email" required sx={{ mb: 0, whiteSpace: 'nowrap' }}>
                    Email
                  </FormLabel>
                  <TextField
                    id="inline-contact-email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <HarmonyIcon name="envelope" fontSize="inherit" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                  <FormLabel htmlFor="inline-form-message" required sx={{ mb: 0, whiteSpace: 'nowrap', mt: 1 }}>
                    Message
                  </FormLabel>
                  <TextField
                    id="inline-form-message"
                    multiline
                    rows={4}
                    placeholder="How can we help you?"
                    required
                    fullWidth
                  />
                </Stack>
                <Button type="submit" variant="contained" fullWidth>
                  Send Message
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Input Props">
        <PropsTable props={inputProps} />
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Textarea Props
        </Typography>
        <PropsTable props={textareaProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="usage" title="Usage Guidelines">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Do
            </Typography>
            <Typography component="ul" variant="body2" sx={{ pl: 2, m: 0 }}>
              <li>Always use labels with inputs</li>
              <li>Provide helpful placeholder text</li>
              <li>Show validation feedback inline</li>
              <li>Use appropriate input types</li>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Don&apos;t
            </Typography>
            <Typography component="ul" variant="body2" sx={{ pl: 2, m: 0 }}>
              <li>Use placeholder as label</li>
              <li>Hide error messages</li>
              <li>Disable without explanation</li>
              <li>Use generic error messages</li>
            </Typography>
          </Box>
        </Stack>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard icon="tag" title="Labels">
          Always associate labels with inputs using <code>htmlFor</code> / <code>id</code>. Prefer external{' '}
          <code>FormLabel</code> over floating TextField labels for Harmony stacked/inline layouts.
        </A11yCard>
        <A11yCard icon="exclamation-circle" title="Error messages">
          Error messages are associated via TextField <code>helperText</code> and <code>error</code> (
          <code>aria-invalid</code> / described-by wiring).
        </A11yCard>
      </DemoSection>
    </Box>
  );
}
