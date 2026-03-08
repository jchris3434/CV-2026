'use client';

import styles from '../BackEnd/backend.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function FrontEnd() {
  const t = useTranslations('myTools');

  const images = [
    { src: '/icones/html5.png' },
    { src: '/icones/css3.png' },
    { src: '/icones/JS.png' },
    { src: '/icones/react.png' },
    { src: '/icones/typescript2.png' },
    { src: '/icones/graphql.png' },
    { src: '/icones/vuejs.png' },
    { src: '/icones/pinia.png' },
    { src: '/icones/abtasty.png' },
    { src: '/icones/contentsquare.png' }
  ];

  return (
    <section className={styles.backend}>
      <div className={styles.layout}>
        {/* TEXTE */}
        <div className={styles.center}>
          <h1 className={styles.maintitle}>{t('title')}</h1>
          <h2 className={styles.title}>{t('frontendTitle')}</h2>

          <p>{t.rich('frontendDescription.step1', { important: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t.rich('frontendDescription.step2', { important: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t.rich('frontendDescription.step3', { important: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t.rich('frontendDescription.step4', { important: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t.rich('frontendDescription.step5', { important: (chunks) => <strong>{chunks}</strong> })}</p>
        </div>

        {/* LOGOS */}
        <div className={styles.logosWrapper}>
          <div className={styles.marquee}>
            <div className={styles.trackReverse}>
              {images.concat(images).map((img, index) => (
                <div className={styles.logoItem} key={index}>
                  <Image
                    src={img.src}
                    alt={`logo front ${index + 1}`}
                    width={100}
                    height={120}
                    className={styles.logo}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}