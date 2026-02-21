'use client';

import styles from './conception.module.css';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';

export default function Conception() {
  const [emblaRef] = useEmblaCarousel(
  {
    loop: true,
    align: 'center'
  },
  [
    Autoplay({
      delay: 3000,        // 3 secondes
      stopOnInteraction: false, // continue après swipe utilisateur
      stopOnMouseEnter: true    // pause au survol (UX 👍)
    })
  ]
);

  const t = useTranslations('myTools');

  const images = [
  { src: '/images/DiagActiviteFront.png', variant: 'tall' },
  { src: '/images/Annexe18-MPD.png', variant: 'wide' }
];

  return (
    <section className={styles.conception}>
      

      <div className={styles.layout}>
        {/* COLONNE GAUCHE — CAROUSEL */}
        <div className={styles.leftside}>
          <div className={styles.embla} ref={emblaRef}>
            <div className={styles.emblaContainer}>
              {images.map((img, index) => (
  <div
    className={`${styles.emblaSlide} ${styles[img.variant]}`}
    key={index}
  >
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
          <h2 className={styles.title}>Conception & Modélisation</h2>
          <p>
            La conception débute par une analyse fonctionnelle du besoin à l’aide des diagrammes
            de cas d’utilisation et d’activités. Ces diagrammes permettent de poser les bases du
            projet en identifiant les acteurs, les objectifs, les parcours utilisateurs et les
            processus métier.
          </p>

          <p>
            Une fois les besoins clarifiés, j’utilise les diagrammes UML pour concevoir une
            architecture applicative claire et modulaire, notamment à travers les diagrammes
            de classes, de composants et de paquetages. Pour la conception des bases de
            données, j’applique également la méthode Merise à l’aide de MCD et de MLD.
          </p>

          <p>
            Les diagrammes de séquence, de communication, d’états-transitions et d’objets me
            permettent de modéliser les interactions entre services, les flux applicatifs et
            le comportement du système.
          </p>

          <p>
            Enfin, les diagrammes de déploiement et d’interaction globale représentent
            l’infrastructure, les environnements, les conteneurs et les dépendances entre
            services, dans une logique DevOps orientée déploiement et maintenabilité.
          </p>
        </div>
      </div>
    </section>
  );
}