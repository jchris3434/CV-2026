import type { PointerEvent } from 'react';

/**
 * Publie la position du pointeur sur l'élément survolé sous forme de
 * variables CSS, pour les effets de reflet et d'inclinaison des cartes :
 *   --mx / --my : position en pourcentage (0% -> 100%)
 *   --px / --py : position centrée (-1 -> 1)
 */
export function trackPointer(event: PointerEvent<HTMLElement>): void {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  el.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
  el.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
  el.style.setProperty('--px', (x * 2 - 1).toFixed(3));
  el.style.setProperty('--py', (y * 2 - 1).toFixed(3));
}

// Remet l'élément au repos quand le pointeur le quitte.
export function resetPointer(event: PointerEvent<HTMLElement>): void {
  const el = event.currentTarget;
  el.style.setProperty('--px', '0');
  el.style.setProperty('--py', '0');
}
