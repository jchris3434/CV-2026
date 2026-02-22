'use client';

import styles from '../BackEnd/backend.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function FrontEnd() {

  const t = useTranslations('myTools');

  const images = [
      
    { src: '/icones/html5.png' },
    { src: '/icones/css3.png' },
    { src: '/icones/JS.png' },
    { src: '/icones/react.png' },
    { src: '/icones/typescript2.png' },
    { src: '/icones/graphql.png' }, 
    { src: '/icones/vuejs.png' },
     { src: '/icones/pinia.png' },
    { src: '/icones/abtasty.png' },
    { src: '/icones/contentsquare.png' },
  ];

  return (
    <section className={styles.backend}>
      <div className={styles.layout}>

        {/* TEXTE */}
        <div className={styles.center}>
          <h1 className={styles.maintitle}>{t('backend.title')}</h1>
          <h2 className={styles.title}>Front-End & Expérience Utilisateur</h2>

          <p>
            Je conçois des interfaces modernes, performantes et accessibles,
            avec une forte orientation <strong>JavaScript</strong> et plus
            particulièrement <strong>React</strong>.
          </p>

          <p>
            Lors de mon expérience chez <strong>Exaprint</strong>, j’ai participé à
            l’évolution d’un site e-commerce en développant de nouvelles
            fonctionnalités basées sur l’analyse comportementale via <strong>ContentSquare</strong> et les
            <strong> A/B tests</strong>, principalement en <strong>React</strong>,
            <strong> TypeScript</strong> et <strong>GraphQL</strong>, dans un
            environnement Agile.
          </p>

          <p>
            Je porte une attention particulière à la performance,
            l’accessibilité et l’expérience utilisateur afin de proposer
            des interfaces fluides et intuitives.
          </p>

          <p>
            Je maîtrise également l’intégration de maquettes <strong>Figma</strong>,
            le responsive design et les architectures front modulaires.
            J’ai aussi travaillé avec <strong>Vue.js</strong> et
            <strong> Pinia</strong> pour la gestion d’état.
          </p>

          <p>
            Mon objectif est de créer des applications web rapides,
            maintenables et agréables à utiliser, en lien étroit avec
            les enjeux métier et l’expérience utilisateur.
          </p>
        </div>

        {/* LOGOS */}
        <div className={styles.logosWrapper}>
          <div className={styles.marquee}>
            <div className={styles.track}>
              {images.concat(images).map((img, index) => (
                <div className={styles.logoItem} key={index}>
                  <Image
                    src={img.src}
                    alt={`logo front ${index + 1}`}
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