"use client";

import { useTranslations } from 'next-intl';
import styles from './welcome.module.css';
import Image from 'next/image';
import { useRandomLetters } from '../../Hooks/useRandomLetters';
import { useTypingText } from '../../Hooks/useTypingText';
import { useEffect, useMemo, useState } from 'react';
import { Roboto_Mono } from 'next/font/google';

const robotoMono = Roboto_Mono({
  weight: '300',
  subsets: ['latin'],
  display: 'swap',
});

export default function Welcome() {
  const t = useTranslations('Welcome');

  const nameText = t('name');
  const fullstackText = t('fullstack');
  const devOpsText = t('jobTitle2');

  const nameEffect = useRandomLetters(nameText, 60);

  const titles = [fullstackText, devOpsText];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isTypingEnabled, setTypingEnabled] = useState(false);

  const currentTitle = titles[currentTitleIndex];
  const typedText = useTypingText(currentTitle, 60, isTypingEnabled);

  const letters = useMemo(
    () => nameEffect.text.split('').map((char, pos) => ({ char, pos })),
    [nameEffect.text]
  );

  useEffect(() => {
    if (!nameEffect.isDone) return;

    let timeout: NodeJS.Timeout;

    function onCycleEnd() {
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      cycleTitle();
    }

    function onDisplayEnd() {
      setTypingEnabled(false);
      timeout = setTimeout(onCycleEnd, 1000);
    }

    function cycleTitle() {
      setTypingEnabled(true);
      timeout = setTimeout(onDisplayEnd, 3000);
    }

    cycleTitle();

    return () => clearTimeout(timeout);
  }, [nameEffect.isDone]);

  return (
    <section className={styles.globaleSection}>
      <div className={styles.divLeft}>
        <Image
          src="/images/JC--Pro--NoBG.png"
          width={440}
          height={566}
          alt="Picture of the author"
          className={styles.imageLeft}
        />
      </div>

      <div className={`${styles.divRight} `}>
        <h1 className={styles.name}>
          {letters.map(({ char, pos }) => (
            <span
              key={`char-${pos}`}
              style={{
                opacity: nameEffect.visibility[pos],
                transition: "opacity 0.3s ease",
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p className={styles.fullstack}>
  <span
    className={`${styles.jobTitleContainer} ${robotoMono.className}`}
    style={{
      opacity: isTypingEnabled ? 1 : 0,
      transition: 'opacity 0.5s ease',
    }}
  >
    {typedText}
  </span>
</p>

      </div>
    </section>
  );
}
