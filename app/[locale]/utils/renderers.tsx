import type { ReactNode } from 'react';

export const renderStrong = (chunks: ReactNode) => <strong>{chunks}</strong>;

export function makeSpanRenderer(className: string) {
  const renderSpan = (chunks: ReactNode) => <span className={className}>{chunks}</span>;
  return renderSpan;
}
