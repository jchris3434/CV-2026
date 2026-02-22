'use client';

import styles from './devops.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function DevOps() {
    const t = useTranslations('myTools');

    const pillars = [
        {
            title: 'Qualité & Sécurité',
            text: `
Analyse continue du code avec SonarQube afin de détecter
les bugs, vulnérabilités et mauvaises pratiques.

Application des bonnes pratiques OWASP pour renforcer
la sécurité des applications et prévenir les failles courantes.
      `,
            icons: ['/icones/sonarqube.png', '/icones/owasp.png']
        },
        {
            title: 'CI/CD & Automatisation',
            text: `
Mise en place de pipelines CI/CD avec GitLab CI/CD
et Jenkins pour automatiser les tests, builds et déploiements.

Objectif : livraisons rapides, fiables et reproductibles.
      `,
            icons: ['/icones/gitlabCICD.png', '/icones/jenkins.png']
        },
        {
            title: 'Monitoring & Observabilité',
            text: `
Supervision des services et infrastructures avec
Prometheus et Grafana pour le monitoring temps réel.

Mise en place d’alertes et tableaux de bord pour
anticiper les incidents.
      `,
            icons: ['/icones/prometheus.png', '/icones/grafana.png', '/icones/centreon.png']
        },
        {
            title: 'Architecture & Orchestration',
            text: `
Notions d’architectures microservices et orchestration
avec Kubernetes pour des applications scalables,
résilientes et adaptées aux environnements cloud.

Conteneurisation avec Docker pour garantir
portabilité et cohérence des déploiements.
      `,
            icons: ['/icones/k8s.png', '/icones/docker.png']
        }
    ];

    return (
        <section className={styles.devops}>
            <div className={styles.container}>
                <h1 className={styles.maintitle}>{t('backend.title')}</h1>
                <h2 className={styles.title}>Déploiement & DevOps</h2>

                <div className={styles.grid}>
                    {pillars.map((pillar, index) => (
                        <div key={index} className={styles.card}>
                            <h3>{pillar.title}</h3>
                            <p>{pillar.text}</p>

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