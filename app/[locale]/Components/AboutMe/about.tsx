'use client';

import styles from './about.module.css';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutMe() {
  const t = useTranslations('aboutMe');

  return (
    <section id="about-me" className={styles.sectionAbout}>
      <div className={styles.divLeft}>
        <h1 className={styles.spanTitle}>{t('title')}</h1>

        <p className={styles.spanPassion}>
          {t.rich('passion', {
            important: (chunks) => (
              <span className={styles.spanBold}>{chunks}</span>
            )
          })}
        </p>

        <p>
          {t.rich('reconversion', {
            important: (chunks) => (
              <span className={styles.spanBold}>{chunks}</span>
            )
          })}
        </p>

        <p>
          {t.rich('experience', {
            important: (chunks) => (
              <span className={styles.spanBold}>{chunks}</span>
            )
          })}
        </p>

        <p>
          {t.rich('dsio', {
            important: (chunks) => (
              <span className={styles.spanBold}>{chunks}</span>
            )
          })}
        </p>
      </div>

      <div className={styles.divRight}>
        <Image
          src="/images/aboutMe-NoBG.png"
          width={6016}
          height={4016}
          alt="Picture of the author"
          className={styles.imageLeft}
        />
      </div>
    </section>
  );
}
