'use client';

import styles from './backend.module.css';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';

export default function BackEnd() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const t = useTranslations('myTools');

  const images = [
    { src: '/icones/nodejs1.svg' },
    { src: '/icones/typescript2.png' },
    { src: '/icones/php.png' },
    { src: '/icones/mySQL.png' },
    { src: '/icones/mongodb.png' },
    { src: '/icones/docker.png' },
    { src: '/icones/postman.png' },
    { src: '/icones/sequelize.png' }
  ];

  return (
    <section className={styles.backend}>
      <div className={styles.layout}>
        {/* TEXTE CENTRÉ */}
        <div className={styles.center}>
          <h1 className={styles.maintitle}>{t('title')}</h1>
          <h2 className={styles.title}>{t('backendTitle')}</h2>

          <p>{t.rich('backendDescription.step1', { important: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t.rich('backendDescription.step2', { important: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t.rich('backendDescription.step3', { important: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t.rich('backendDescription.step4', { important: (chunks) => <strong>{chunks}</strong> })}</p>
          <p>{t.rich('backendDescription.step5', { important: (chunks) => <strong>{chunks}</strong> })}</p>
        </div>

        {/* LOGOS EN BAS */}
        <div className={styles.logosWrapper}>
          <div className={styles.marquee}>
            <div className={styles.track}>
              {images.concat(images).map((img, index) => (
                <div className={styles.logoItem} key={index}>
                  <Image
                    src={img.src}
                    alt={`logo tech ${index + 1}`}
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