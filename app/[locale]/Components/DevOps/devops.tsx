'use client';

import { useEffect, useRef } from 'react';
import styles from './devops.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function DevOps() {
  const t = useTranslations('myTools');
  
  // Typage de la ref pour un tableau d'éléments HTMLDivElement
  const scrollRef = useRef<(HTMLDivElement | null)[]>([]);

 useEffect(() => {
    if (window.innerWidth > 900) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // On cherche l'entrée qui a le ratio de visibilité le plus élevé
        let bestEntry: IntersectionObserverEntry | null = null;
        let maxRatio = 0;

        // On vérifie parmi toutes les cartes observées lesquelles sont visibles
        entries.forEach((entry) => {
          // On réinitialise systématiquement (on enlève la classe partout d'abord)
          // Note : On peut aussi faire un tour sur toutes les refs pour nettoyer
          entry.target.classList.remove(styles.activeCard);
          
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        });

        // On n'active que celle qui est la plus visible
        if (bestEntry) {
          (bestEntry as IntersectionObserverEntry).target.classList.add(styles.activeCard);
        }
      },
      {
        // On utilise un tableau de seuils pour que l'observer soit notifié 
        // très souvent lors du scroll, permettant de comparer précisément
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-20% 0px -20% 0px" // On resserre la zone de détection au centre
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
              key={index} 
              className={styles.card}
              // Fonction de callback pour remplir le tableau de refs
              ref={(el) => { scrollRef.current[index] = el; }}
            >
              <h3>{t(`devopsPillars.${pillar.key}.title`)}</h3>
              
              <p>
                {t.rich(`devopsPillars.${pillar.key}.text`, {
                  important: (chunks) => <strong>{chunks}</strong>
                })}
              </p>

              <div className={styles.icons}>
                {pillar.icons.map((icon, i) => (
                  <Image
                    key={i}
                    src={icon}
                    alt="tech logo"
                    width={120}
                    height={120}
                    className={
                      ['/icones/sonarqube.png', '/icones/owasp.png', '/icones/centreon.png', '/icones/docker.png'].includes(icon)
                        ? styles.logoRect
                        : styles.logo
                    }
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