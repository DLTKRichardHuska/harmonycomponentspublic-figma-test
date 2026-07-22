import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

interface UnsupportedEquivalentCalloutProps {
  /** Harmony reference prop or feature name, e.g. `size="xs"` */
  feature: string;
  /** Why there is no native target equivalent */
  reason: string;
}

/**
 * Demo-only callout for reference features skipped in this conversion (per manifest gaps + userDecision).
 */
export function UnsupportedEquivalentCallout({ feature, reason }: UnsupportedEquivalentCalloutProps) {
  return (
    <Alert severity="info" variant="outlined">
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        Not supported in this conversion
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Harmony <code>{feature}</code> has no supported equivalent here. {reason} Recorded as an accepted gap in
        conversion manifest <code>userDecision</code>.
      </Typography>
    </Alert>
  );
}
