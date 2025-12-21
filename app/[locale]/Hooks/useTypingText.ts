import { useEffect, useState } from 'react';

export function useTypingText(text: string, speed = 70, enabled = true) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    setVisibleCount(0);

    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return text.slice(0, visibleCount);
}
