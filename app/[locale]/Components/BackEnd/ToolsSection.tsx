'use client';

import styles from './backend.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { renderStrong } from '../../utils/renderers';

type Props = {
  readonly titleKey: string;
  readonly descriptionPrefix: string;
  readonly stepCount: number;
  readonly images: readonly { src: string }[];
  readonly reverse?: boolean;
  readonly altPrefix: string;
};

export default function ToolsSection({ titleKey, descriptionPrefix, stepCount, images, reverse = false, altPrefix }: Props) {
  const t = useTranslations('myTools');
  const doubled = [...images, ...images];
  const trackClass = reverse ? styles.trackReverse : styles.track;

  return (
    <section className={styles.backend}>
      <div className={styles.layout}>
        <div className={styles.center}>
          <h1 className={styles.maintitle}>{t('title')}</h1>
          <h2 className={styles.title}>{t(titleKey)}</h2>

          {Array.from({ length: stepCount }, (_, i) => (
            <p key={`step-${i + 1}`}>
              {t.rich(`${descriptionPrefix}.step${i + 1}`, { important: renderStrong })}
            </p>
          ))}
        </div>

        <div className={styles.logosWrapper}>
          <div className={styles.marquee}>
            <div className={trackClass}>
              {doubled.map((img, index) => (
                <div className={styles.logoItem} key={`${img.src}-${index}`}>
                  <Image
                    src={img.src}
                    alt={`${altPrefix} ${index + 1}`}
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
