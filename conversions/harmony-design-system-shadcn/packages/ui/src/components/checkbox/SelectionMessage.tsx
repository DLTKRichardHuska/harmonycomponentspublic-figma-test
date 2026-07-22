import { useId } from 'react';
import { Icon } from '../icon';
import { cn } from '../../lib/utils';

export interface SelectionValidationProps {
  error?: boolean;
  warning?: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export function useSelectionMessageIds(
  id: string | undefined,
  { error, warning, errorMessage, warningMessage }: SelectionValidationProps,
) {
  const reactId = useId();
  const controlId = id ?? reactId;
  const showError = Boolean(error && errorMessage);
  const showWarning = Boolean(!error && warning && warningMessage);
  const messageId = showError
    ? `${controlId}-error`
    : showWarning
      ? `${controlId}-warning`
      : undefined;
  return { controlId, messageId, showError, showWarning };
}

export function SelectionMessage({
  messageId,
  showError,
  showWarning,
  errorMessage,
  warningMessage,
  className,
}: {
  messageId?: string;
  showError: boolean;
  showWarning: boolean;
  errorMessage?: string;
  warningMessage?: string;
  className?: string;
}) {
  if (showError && errorMessage) {
    return (
      <p
        id={messageId}
        className={cn(
          'mt-1 flex items-center gap-1 text-sm text-secondary',
          className,
        )}
      >
        <Icon
          name="exclamation-circle"
          size="sm"
          className="shrink-0 text-error"
        />
        {errorMessage}
      </p>
    );
  }
  if (showWarning && warningMessage) {
    return (
      <p
        id={messageId}
        className={cn(
          'mt-1 flex items-center gap-1 text-sm text-secondary',
          className,
        )}
      >
        <Icon
          name="exclamation-triangle"
          size="sm"
          className="shrink-0 text-warning"
        />
        {warningMessage}
      </p>
    );
  }
  return null;
}
