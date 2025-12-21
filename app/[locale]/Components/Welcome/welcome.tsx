"use client";

import { useTranslations } from 'next-intl';
import styles from './welcome.module.css';
import Image from 'next/image';
import { useRandomLetters } from '../../Hooks/useRandomLetters';
import { useTypingText } from '../../Hooks/useTypingText';
import { useEffect, useState } from 'react';
import { Roboto_Mono } from 'next/font/google';

const robotoMono = Roboto_Mono({
  weight: '300',
  subsets: ['latin'],
  display: 'swap',
});

export default function Welcome() {
  const t = useTranslations('Welcome');

  const nameText = t('name');
  const fullstackText = t('fullstack'); // "Full-Stack Développeur"
  const devOpsText = t('jobTitle2'); // "DevOps"

  // 1️⃣ Nom en aléatoire
  const nameEffect = useRandomLetters(nameText, 60);

  // 2️⃣ Typing text avec rotation
  const titles = [fullstackText, devOpsText];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isTypingEnabled, setTypingEnabled] = useState(false);

  const currentTitle = titles[currentTitleIndex];
  const typedText = useTypingText(currentTitle, 60, isTypingEnabled);

  useEffect(() => {
    if (!nameEffect.isDone) return; // Attendre que le nom soit fini

    let timeout: NodeJS.Timeout;

    const cycleTitle = () => {
      setTypingEnabled(true); // Commence l'effet machine à écrire
      // Après 3 secondes + temps d'écriture, on fait le blanc
      const displayDuration = 3000; 
      timeout = setTimeout(() => {
        setTypingEnabled(false); // Efface le texte (1s blanc)
        timeout = setTimeout(() => {
          setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
          cycleTitle(); // Recommence pour le titre suivant
        }, 1000); // 1s de blanc
      }, displayDuration);
    };

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

      <div className={`${styles.divRight} ${robotoMono.className}`}>
        <h1 className={styles.name}>
          {nameEffect.text.split("").map((letter, i) => (
            <span
              key={i}
              style={{
                opacity: nameEffect.visibility[i],
                transition: "opacity 0.3s ease",
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <p className={styles.fullstack}>
  <span
    className={styles.jobTitleContainer}
    style={{
      opacity: isTypingEnabled ? 1 : 0, // Appliquer l'opacité en fonction de l'état
      transition: 'opacity 0.5s ease',  // Ajouter une transition CSS pour l'animation
    }}
  >
    {typedText}
  </span>
</p>

      </div>
    </section>
  );
}
