import { useEffect, useState } from 'react';

export function useRandomLetters(text: string, delay = 120) {
  const [visibility, setVisibility] = useState<number[]>(
    Array(text.length).fill(0)
  );
  const [isDone, setIsDone] = useState(false);

  function getSecureRandomIndex(max: number) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }

  useEffect(() => {
    setVisibility(Array(text.length).fill(0));
    setIsDone(false);

    const timeouts: NodeJS.Timeout[] = [];
    const indexes = Array.from({ length: text.length }, (_, i) => i);

    let revealedCount = 0;

    while (indexes.length > 0) {
      const randomIndex = getSecureRandomIndex(indexes.length);
      const letterIndex = indexes.splice(randomIndex, 1)[0];

      const timeout = setTimeout(() => {
        setVisibility(prev => {
          const next = [...prev];
          if (next[letterIndex] === 0) {
            next[letterIndex] = 1;
            revealedCount++;

            if (revealedCount === text.length) {
              setIsDone(true);
            }
          }
          return next;
        });
      }, randomIndex * delay);

      timeouts.push(timeout);
    }

    return () => timeouts.forEach(clearTimeout);
  }, [text, delay]);

  return { text, visibility, isDone };
}
