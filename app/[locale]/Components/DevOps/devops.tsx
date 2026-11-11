'use client';

import { useEffect, useRef } from 'react';
import styles from './devops.module.css';
import stepStyles from '../Step/step.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Step from '../Step/step';
import Reveal from '../Reveal/reveal';
import { renderStrong } from '../../utils/renderers';
import { trackPointer } from '../../utils/pointer';

const pillars = [
  { key: 'qualitySecurity', icons: ['/icones/sonarqube.png', '/icones/owasp.png'] },
  { key: 'ciCd', icons: ['/icones/gitlabCICD.png', '/icones/jenkins.png'] },
  { key: 'monitoring', icons: ['/icones/prometheus.png', '/icones/grafana.png', '/icones/centreon.png'] },
  { key: 'architecture', icons: ['/icones/k8s.png', '/icones/docker.png'] },
];

const THRESHOLDS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

export default function DevOps() {
  const t = useTranslations('myTools');

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sur petit écran il n'y a pas de survol : la carte la plus visible
  // s'allume à la place, au fil du défilement.
  useEffect(() => {
    if (globalThis.innerWidth > 900 || typeof IntersectionObserver === 'undefined') return;

    const ratios = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let best: Element | null = null;
        let bestRatio = 0;
        for (const [card, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = card;
            bestRatio = ratio;
          }
        }

        for (const card of ratios.keys()) {
          card.classList.toggle(styles.activeCard, card === best);
        }
      },
      { threshold: THRESHOLDS, rootMargin: '-20% 0px -20% 0px' },
    );

    for (const card of cardRefs.current) {
      if (card) observer.observe(card);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section>
      <Step number={4} eyebrow={t('title')} title={t('devopsTitle')}>
        <div className={styles.grid}>
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.key} className={styles.cell} delay={index * 90}>
              <div
                className={styles.card}
                onPointerMove={trackPointer}
                ref={(el) => { cardRefs.current[index] = el; }}
              >
                <h3 className={styles.cardTitle}>{t(`devopsPillars.${pillar.key}.title`)}</h3>

                <p className={styles.text}>
                  {t.rich(`devopsPillars.${pillar.key}.text`, { important: renderStrong })}
                </p>

                <div className={styles.icons}>
                  {pillar.icons.map((icon) => (
                    <span key={icon} className={`${stepStyles.tile} ${styles.tile}`}>
                      <Image src={icon} alt="tech logo" width={120} height={120} />
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Step>
    </section>
  );
}
