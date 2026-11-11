'use client';

import type { MouseEvent } from 'react';
import { useTranslations } from 'next-intl';
import styles from './themetoggle.module.css';
import { runViewTransition } from '../../utils/motion';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Stockage indisponible (navigation privée) : le thème vaut pour cette visite.
  }
}

/**
 * Bascule nuit / jour. Quand le navigateur le permet, le nouveau thème
 * s'ouvre en cercle depuis le bouton (View Transitions API).
 */
export default function ThemeToggle() {
  const t = useTranslations('ui');

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === 'light' ? 'dark' : 'light';

    const rect = event.currentTarget.getBoundingClientRect();
    const transition = runViewTransition(() => applyTheme(next), 'themeSwitch');
    if (!transition) return;

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, globalThis.innerWidth - x),
      Math.max(y, globalThis.innerHeight - y),
    );

    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 700,
            easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {
        // Transition interrompue : le thème est déjà appliqué, rien à rattraper.
      });
  };

  return (
    <button type="button" className={styles.toggle} onClick={toggle} aria-label={t('theme')}>
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <mask id="theme-toggle-moon">
          <rect width="24" height="24" fill="#fff" />
          <circle className={styles.cutout} cx="24" cy="2" r="7" fill="#000" />
        </mask>
        <circle
          className={styles.core}
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask="url(#theme-toggle-moon)"
        />
        <g className={styles.rays} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
