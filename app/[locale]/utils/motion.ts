function matches(query: string): boolean {
  return (
    typeof globalThis.window !== 'undefined' &&
    typeof globalThis.window.matchMedia === 'function' &&
    globalThis.window.matchMedia(query).matches
  );
}

// Le visiteur a demandé à son système de limiter les animations.
export function prefersReducedMotion(): boolean {
  return matches('(prefers-reduced-motion: reduce)');
}

// Souris ou pavé tactile (par opposition à un écran tactile).
export function hasFinePointer(): boolean {
  return matches('(pointer: fine)');
}

let transitionCount = 0;

/**
 * Applique `update` dans une transition de vue : le navigateur photographie la
 * page avant et après, puis anime le passage de l'une à l'autre.
 *
 * `marker` est posé sur <html> (attribut data-…) le temps de la transition,
 * pour que le CSS puisse la cibler (voir « Transitions de vue » dans globals.css).
 *
 * Sans prise en charge du navigateur, ou si le visiteur limite les animations,
 * `update` est appliqué tout de suite et la fonction renvoie `null`.
 */
export function runViewTransition(update: () => void, marker: string): ViewTransition | null {
  if (typeof document.startViewTransition !== 'function' || prefersReducedMotion()) {
    update();
    return null;
  }

  const root = document.documentElement;
  transitionCount += 1;
  const token = String(transitionCount);
  root.dataset[marker] = token;

  const transition = document.startViewTransition(update);

  // Une transition interrompue par la suivante ne doit pas effacer son marqueur.
  const clear = () => {
    if (root.dataset[marker] === token) delete root.dataset[marker];
  };
  transition.finished.then(clear, clear);

  return transition;
}
