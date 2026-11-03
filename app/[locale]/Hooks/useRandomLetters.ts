import { useEffect, useState } from 'react';

function getSecureRandomIndex(max: number) {
  const array = new Uint32Array(1);
  globalThis.crypto.getRandomValues(array);
  return array[0] % max;
}

export function useRandomLetters(text: string, delay = 120) {
  // La visibilité est associée au texte : un changement de texte repart de zéro
  // sans appeler setState de façon synchrone dans l'effet.
  const [state, setState] = useState<{ text: string; visibility: number[] }>({
    text,
    visibility: new Array(text.length).fill(0),
  });
  const visibility =
    state.text === text ? state.visibility : new Array(text.length).fill(0);
  const isDone = visibility.length > 0 && visibility.every(v => v === 1);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    const indexes = Array.from({ length: text.length }, (_, i) => i);

    while (indexes.length > 0) {
      const randomIndex = getSecureRandomIndex(indexes.length);
      const letterIndex = indexes.splice(randomIndex, 1)[0];

      const timeout = setTimeout(() => {
        setState(prev => {
          const base =
            prev.text === text ? prev.visibility : new Array(text.length).fill(0);
          if (base[letterIndex] === 1) return prev;
          const next = [...base];
          next[letterIndex] = 1;
          return { text, visibility: next };
        });
      }, randomIndex * delay);

      timeouts.push(timeout);
    }

    return () => timeouts.forEach(clearTimeout);
  }, [text, delay]);

  return { text, visibility, isDone };
}
