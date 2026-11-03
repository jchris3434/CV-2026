import { useEffect, useState } from 'react';

export function useTypingText(text: string, speed = 70, enabled = true) {
  // Le compteur est associé au texte : un changement de texte repart de 0
  // sans appeler setState de façon synchrone dans l'effet.
  const [state, setState] = useState({ text, count: 0 });
  const visibleCount = state.text === text ? state.count : 0;

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setState(prev => {
        const count = prev.text === text ? prev.count : 0;
        if (count >= text.length) {
          clearInterval(interval);
          return prev.text === text ? prev : { text, count };
        }
        return { text, count: count + 1 };
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return text.slice(0, visibleCount);
}
