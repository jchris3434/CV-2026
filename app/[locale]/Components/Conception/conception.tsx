'use client';

import styles from './conception.module.css';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';

export default function Conception() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const t = useTranslations('myTools');

  const images = [
    { src: '/images/Annexe00.png', variant: 'wide' },
    { src: '/images/Annexe01.png', variant: 'tall' },
    { src: '/images/Annexe02.png', variant: 'wide' },
    { src: '/images/Annexe03.jpg', variant: 'wide' },
    { src: '/images/Annexe04.jpg', variant: 'wide' },
    { src: '/images/Annexe05.png', variant: 'wide' },
    { src: '/images/Annexe06.png', variant: 'wide' }
  ];

  return (
    <section className={styles.conception}>
      <div className={styles.layout}>
        {/* COLONNE GAUCHE — CAROUSEL */}
        <div className={styles.leftside}>
          <div className={styles.embla} ref={emblaRef}>
            <div className={styles.emblaContainer}>
              {images.map((img, index) => (
                <div className={`${styles.emblaSlide} ${styles[img.variant]}`} key={index}>
                  <Image
                    src={img.src}
                    alt={`Diagramme UML ${index + 1}`}
                    width={1220}
                    height={740}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE — TEXTE */}
        <div className={styles.center}>
          <h1 className={styles.maintitle}>{t('title')}</h1>
          <h2 className={styles.title}>{t('conceptionTitle')}</h2>

          <p>{t.rich('conceptionDescription.step1', { important: (chunks) => <span className={styles.spanBold}>{chunks}</span> })}</p>
          <p>{t.rich('conceptionDescription.step2', { important: (chunks) => <span className={styles.spanBold}>{chunks}</span> })}</p>
          <p>{t.rich('conceptionDescription.step3', { important: (chunks) => <span className={styles.spanBold}>{chunks}</span> })}</p>
          <p>{t.rich('conceptionDescription.step4', { important: (chunks) => <span className={styles.spanBold}>{chunks}</span> })}</p>
        </div>
      </div>
    </section>
  );
}