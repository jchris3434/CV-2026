'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type Props = {
  readonly children: ReactNode;
  readonly className?: string;
  /** Retard de l'apparition, en millisecondes (pour les effets en cascade). */
  readonly delay?: number;
  readonly variant?: 'up' | 'left' | 'right' | 'zoom';
};

/**
 * Fait apparaître son contenu quand il entre dans l'écran.
 * Les styles sont dans globals.css ([data-reveal]) : sans JavaScript,
 * le contenu reste simplement visible.
 */
export default function Reveal({ children, className, delay = 0, variant = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.revealed = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.dataset.revealed = 'true';
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal={variant}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
