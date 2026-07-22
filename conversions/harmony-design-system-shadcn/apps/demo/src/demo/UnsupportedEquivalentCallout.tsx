import { Alert } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

interface UnsupportedEquivalentCalloutProps {
  feature: string;
  reason: string;
}

/** Demo-only callout for reference features deferred or skipped in this conversion. */
export function UnsupportedEquivalentCallout({ feature, reason }: UnsupportedEquivalentCalloutProps) {
  return (
    <Alert variant="info" title="Not supported in this conversion yet">
      Harmony <code>{feature}</code> is not converted here yet. {reason} Recorded as a gap in the
      conversion manifest.
    </Alert>
  );
}
