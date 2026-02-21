'use client';

import styles from './mytools.module.css';
import { useTranslations } from 'next-intl';
import Conception from '../Conception/conception';

export default function MyTools() {
  // const t = useTranslations('myTools');

  return (
    <section id="tools" className={styles.sectionMyTools}>
      <div className={styles.container}>
        {/* <h1 className={styles.title}>{t('title')}</h1> */}

        <Conception />

        {/* <p>Back Node</p>
        <p>Front React</p>
        <p>Sonarqube</p>
        <p>CI/CD</p>
        <p>Monitoring</p> */}
      </div>
    </section>
  );
}
