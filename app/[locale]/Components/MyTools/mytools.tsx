'use client';

import styles from './mytools.module.css';
import { useTranslations } from 'next-intl';

export default function MyTools() {
  const t = useTranslations('myTools');

  return (
    <section id="tools" className={styles.sectionMyTools}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>
      </div>
    </section>
  );
}
