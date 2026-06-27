import type { ReactNode } from 'react';

export const renderStrong = (chunks: ReactNode) => <strong>{chunks}</strong>;

export function makeSpanRenderer(className: string) {
  return (chunks: ReactNode) => <span className={className}>{chunks}</span>;
}
