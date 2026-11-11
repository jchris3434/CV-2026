'use client';

import { useEffect, useRef } from 'react';
import styles from './cursorglow.module.css';
import { hasFinePointer, prefersReducedMotion } from '../../utils/motion';

/**
 * Halo lumineux discret qui suit la souris derrière le contenu.
 * Inactif sur écran tactile et quand les animations sont réduites.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--x', `${event.clientX}px`);
        el.style.setProperty('--y', `${event.clientY}px`);
        el.dataset.active = 'true';
      });
    };

    globalThis.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      globalThis.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className={styles.glow} aria-hidden="true" />;
}
