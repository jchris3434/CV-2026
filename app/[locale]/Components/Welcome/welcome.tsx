"use client";

import { useTranslations } from 'next-intl';
import styles from './welcome.module.css';
import Image from 'next/image';
import { Link } from 'react-scroll';
import { useRandomLetters } from '../../Hooks/useRandomLetters';
import { useTypingText } from '../../Hooks/useTypingText';
import { useEffect, useMemo, useRef, useState } from 'react';
import TopoCanvas from '../TopoCanvas/topocanvas';
import { resetPointer, trackPointer } from '../../utils/pointer';

export default function Welcome() {
  const t = useTranslations('Welcome');
  const nav = useTranslations('navbar');

  const nameText = t('name');
  const fullstackText = t('fullstack');
  const devOpsText = t('jobTitle2');

  const contentRef = useRef<HTMLDivElement>(null);
  const nameEffect = useRandomLetters(nameText, 60);

  const titles = [fullstackText, devOpsText];
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isTypingEnabled, setTypingEnabled] = useState(false);

  const currentTitle = titles[currentTitleIndex];
  const typedText = useTypingText(currentTitle, 60, isTypingEnabled);

  // Le nom est découpé en mots (insécables), puis en lettres : chaque lettre
  // garde sa position dans le texte complet pour retrouver sa visibilité.
  const words = useMemo(() => {
    const parts = nameEffect.text.split(' ');
    return parts.map((word, index) => ({
      start: parts.slice(0, index).join(' ').length + (index > 0 ? 1 : 0),
      chars: [...word],
    }));
  }, [nameEffect.text]);

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
  }, [nameEffect.isDone, titles.length]);

  return (
    <section
      id="top"
      className={styles.hero}
      onPointerMove={trackPointer}
      onPointerLeave={resetPointer}
    >
      <TopoCanvas avoid={contentRef} />
      <div className={styles.aurora} aria-hidden="true">
        <span className={styles.blobLava} />
        <span className={styles.blobLagoon} />
      </div>

      <div className={styles.inner}>
        <div className={styles.content} ref={contentRef}>
          <p className={styles.greeting}>{t('greeting')}</p>

          <h1 className={styles.name} aria-label={nameText}>
            {words.map(({ start, chars }) => (
              <span key={`word-${start}`} className={styles.word} aria-hidden="true">
                {chars.map((char, offset) => (
                  <span
                    key={`char-${start + offset}`}
                    className={`${styles.letter} ${
                      nameEffect.visibility[start + offset] ? styles.letterVisible : ''
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className={styles.role}>
            <span className={styles.prompt} aria-hidden="true">›</span>
            <span
              className={styles.typed}
              style={{
                opacity: isTypingEnabled ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            >
              {typedText}
            </span>
            <span className={styles.caret} aria-hidden="true" />
          </p>

          <p className={styles.description}>{t('description')}</p>

          <div className={styles.actions}>
            <Link href="#projects" to="projects" smooth className={styles.primary}>
              {nav('projects')}
              <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="#contact" to="contact" smooth className={styles.secondary}>
              {nav('contact')}
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.halo} aria-hidden="true" />
          <div className={styles.ring} aria-hidden="true" />
          <div className={styles.disc} aria-hidden="true" />
          <div className={styles.cutout}>
            <Image
              src="/images/JC--Pro--NoBG.png"
              width={440}
              height={566}
              alt="Picture of the author"
              className={styles.portrait}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <span className={styles.coords} aria-hidden="true">
            <span className={styles.coordsDot} />
            La Réunion · 21.1°S 55.5°E
          </span>
        </div>
      </div>

      <Link
        href="#about-me"
        to="about-me"
        smooth
        className={styles.scrollCue}
        aria-label={nav('about')}
      >
        <span className={styles.scrollDot} />
      </Link>
    </section>
  );
}
