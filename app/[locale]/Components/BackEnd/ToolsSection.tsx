'use client';

import styles from './backend.module.css';
import stepStyles from '../Step/step.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Step from '../Step/step';
import Reveal from '../Reveal/reveal';
import { renderStrong } from '../../utils/renderers';

type Props = {
  readonly titleKey: string;
  readonly descriptionPrefix: string;
  readonly stepCount: number;
  readonly images: readonly { src: string }[];
  readonly reverse?: boolean;
  readonly altPrefix: string;
  /** Numéro de l'étape dans le déroulé d'un projet. */
  readonly stepNumber?: number;
  /** Défilement des logos sur toute la colonne, au lieu de la largeur du texte. */
  readonly fullWidth?: boolean;
};

export default function ToolsSection({ titleKey, descriptionPrefix, stepCount, images, reverse = false, altPrefix, stepNumber, fullWidth = false }: Props) {
  const t = useTranslations('myTools');
  const doubled = [...images, ...images];
  const trackClass = reverse ? `${styles.track} ${styles.trackReverse}` : styles.track;

  return (
    <section>
      <Step number={stepNumber} eyebrow={t('title')} title={t(titleKey)}>
        <div className={stepStyles.prose}>
          {Array.from({ length: stepCount }, (_, i) => (
            <Reveal key={`step-${i + 1}`}>
              <p>
                {t.rich(`${descriptionPrefix}.step${i + 1}`, { important: renderStrong })}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className={fullWidth ? `${styles.logosWrapper} ${styles.logosFull}` : styles.logosWrapper}>
          <div className={styles.marquee}>
            <div className={trackClass}>
              {doubled.map((img, index) => (
                <div className={`${stepStyles.tile} ${styles.logoItem}`} key={`${img.src}-${index}`}>
                  <Image
                    src={img.src}
                    alt={`${altPrefix} ${index + 1}`}
                    width={100}
                    height={120}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Step>
    </section>
  );
}
