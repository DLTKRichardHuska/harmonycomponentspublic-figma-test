import { useState } from 'react';

export interface ImportSnippetProps {
  /** One or more import lines (already using package name paths). */
  code: string;
  title?: string;
  /** Reminder that Getting Started is assumed. */
  assumeGettingStarted?: boolean;
}

/** Demo-only helper — copyable package import guidance for converted pages. */
export function ImportSnippet({
  code,
  title = 'Usage from npm',
  assumeGettingStarted = true,
}: ImportSnippetProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-border bg-muted/40 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground hover:bg-muted"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {assumeGettingStarted ? (
        <p className="mb-2 text-xs text-muted-foreground">
          Assumes{' '}
          <a className="text-primary underline" href="/getting-started">
            Getting Started
          </a>{' '}
          is complete (package install, peers, provider, base styles).
        </p>
      ) : null}
      <pre className="overflow-x-auto rounded-md bg-card p-3 text-xs leading-relaxed text-foreground">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
