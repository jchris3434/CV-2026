'use client';

import styles from './about.module.css';
import { useTranslations } from 'next-intl';
import Reveal from '../Reveal/reveal';
import { makeSpanRenderer } from '../../utils/renderers';

const renderImportant = makeSpanRenderer(styles.spanBold);

const paragraphs = ['reconversion', 'experience', 'dsio'] as const;

export default function AboutMe() {
  const t = useTranslations('aboutMe');

  return (
    <section id="about-me" className={styles.sectionAbout}>
      <div className={styles.inner}>
        <div className={styles.divLeft}>
          <Reveal>
            <h1 className={`section-title ${styles.spanTitle}`}>{t('title')}</h1>
          </Reveal>

          <Reveal delay={80}>
            <p className={styles.spanPassion}>
              {t.rich('passion', { important: renderImportant })}
            </p>
          </Reveal>

          {paragraphs.map((key, index) => (
            <Reveal key={key} delay={140 + index * 70}>
              <p>{t.rich(key, { important: renderImportant })}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
