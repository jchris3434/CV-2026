'use client';

import styles from './devops.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function DevOps() {
  const t = useTranslations('myTools');

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
            <div key={index} className={styles.card}>
              <h3>{t(`devopsPillars.${pillar.key}.title`)}</h3>
              
              {/* Utilisation de t.rich pour gérer <important> */}
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