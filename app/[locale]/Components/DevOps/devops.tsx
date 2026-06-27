'use client';

import { useEffect, useRef } from 'react';
import styles from './devops.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { renderStrong } from '../../utils/renderers';

const RECT_ICONS = new Set(['/icones/sonarqube.png', '/icones/owasp.png', '/icones/centreon.png', '/icones/docker.png']);

export default function DevOps() {
  const t = useTranslations('myTools');

  const scrollRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.innerWidth > 900) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          entry.target.classList.remove(styles.activeCard);

          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        });

        if (bestEntry) {
          (bestEntry as IntersectionObserverEntry).target.classList.add(styles.activeCard);
        }
      },
      {
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-20% 0px -20% 0px"
      }
    );

    scrollRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const pillars = [
    { key: 'qualitySecurity', icons: ['/icones/sonarqube.png', '/icones/owasp.png'] },
    { key: 'ciCd', icons: ['/icones/gitlabCICD.png', '/icones/jenkins.png'] },
    { key: 'monitoring', icons: ['/icones/prometheus.png', '/icones/grafana.png', '/icones/centreon.png'] },
    { key: 'architecture', icons: ['/icones/k8s.png', '/icones/docker.png'] }
  ];

  return (
    <section className={styles.devops}>
      <div className={styles.container}>
        <h1 className={styles.maintitle}>{t('title')}</h1>
        <h2 className={styles.title}>{t('devopsTitle')}</h2>

        <div className={styles.grid}>
          {pillars.map((pillar, index) => (
            <div
              key={pillar.key}
              className={styles.card}
              ref={(el) => { scrollRef.current[index] = el; }}
            >
              <h3>{t(`devopsPillars.${pillar.key}.title`)}</h3>

              <p>
                {t.rich(`devopsPillars.${pillar.key}.text`, { important: renderStrong })}
              </p>

              <div className={styles.icons}>
                {pillar.icons.map((icon) => (
                  <Image
                    key={icon}
                    src={icon}
                    alt="tech logo"
                    width={120}
                    height={120}
                    className={RECT_ICONS.has(icon) ? styles.logoRect : styles.logo}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
