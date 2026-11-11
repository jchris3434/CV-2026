'use client';

import { useEffect, useState } from 'react';
import styles from './conception.module.css';
import stepStyles from '../Step/step.module.css';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';
import Step from '../Step/step';
import Reveal from '../Reveal/reveal';
import { renderStrong } from '../../utils/renderers';

const images = [
  '/images/Annexe00.png',
  '/images/Annexe01.png',
  '/images/Annexe02.png',
  '/images/Annexe03.jpg',
  '/images/Annexe04.jpg',
  '/images/Annexe05.png',
  '/images/Annexe06.png',
];

const steps = [1, 2, 3, 4];

const twoDigits = (n: number) => String(n).padStart(2, '0');

export default function Conception() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [selected, setSelected] = useState(0);

  const t = useTranslations('myTools');

  // Suit le diagramme affiché pour le compteur et les points de navigation.
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className={styles.conception}>
      <Reveal>
        <h1 className={`section-title ${styles.maintitle}`}>{t('title')}</h1>
      </Reveal>

      <Step number={1} title={t('conceptionTitle')}>
        {/* CAROUSEL */}
        <Reveal variant="zoom" className={styles.stage}>
          <div className={styles.frame}>
            <div className={styles.frameBar} aria-hidden="true">
              <span className={styles.light} />
              <span className={styles.light} />
              <span className={styles.light} />
              <span className={styles.counter}>
                {twoDigits(selected + 1)} / {twoDigits(images.length)}
              </span>
            </div>

            <div className={styles.embla} ref={emblaRef}>
              <div className={styles.emblaContainer}>
                {images.map((src, index) => (
                  <div className={styles.emblaSlide} key={src}>
                    <Image
                      src={src}
                      alt={`Diagramme UML ${index + 1}`}
                      width={1220}
                      height={740}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.dots}>
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={`${styles.dot} ${index === selected ? styles.dotActive : ''}`}
                  aria-label={`Diagramme UML ${index + 1}`}
                  aria-current={index === selected ? 'true' : undefined}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* TEXTE */}
        <div className={stepStyles.prose}>
          {steps.map((step) => (
            <Reveal key={`step-${step}`}>
              <p>{t.rich(`conceptionDescription.step${step}`, { important: renderStrong })}</p>
            </Reveal>
          ))}
        </div>
      </Step>
    </section>
  );
}
