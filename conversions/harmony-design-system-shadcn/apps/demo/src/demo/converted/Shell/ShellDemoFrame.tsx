import type { CSSProperties, ReactNode } from 'react';

/**
 * Contains the shell primitives (which use fixed positioning in real apps) inside a
 * bounded, scrollable preview box so they can be shown inline in the docs.
 */
export function ShellDemoFrame({
  children,
  height = 560,
  style,
}: {
  children: ReactNode;
  height?: number;
  style?: CSSProperties;
}) {
  return (
    <div className="shell-demo-frame" style={{ height, ...style }}>
      {children}
    </div>
  );
}
