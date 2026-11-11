/**
 * Bloque le défilement de la page (menu mobile, fenêtre vidéo ouverte).
 * Renvoie la fonction qui le rétablit, à utiliser comme nettoyage d'effet.
 */
export function lockPageScroll(): () => void {
  const root = document.documentElement;
  root.style.overflow = 'hidden';

  return () => {
    root.style.overflow = '';
  };
}
