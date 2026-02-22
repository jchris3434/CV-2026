'use client';

import styles from './backend.module.css';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';

export default function BackEnd() {
    const [emblaRef] = useEmblaCarousel(
        { loop: true, align: 'center' },
        [
            Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true
            })
        ]
    );

    const t = useTranslations('myTools');

    const images = [
        { src: '/icones/nodejs1.svg' },
        { src: '/icones/typescript2.png' },
        { src: '/icones/php.png' },
        { src: '/icones/mySQL.png' },
        { src: '/icones/mongodb.png' },
        { src: '/icones/docker.png' },
        { src: '/icones/postman.png' },
        { src: '/icones/sequelize.png' }

    ];

    return (
        <section className={styles.backend}>
            <div className={styles.layout}>

                {/* TEXTE CENTRÉ */}
                <div className={styles.center}>
                    <h1 className={styles.maintitle}>{t('backend.title')}</h1>
                    <h2 className={styles.title}>Back-End & Architecture</h2>

                    <p>
                        Je conçois et développe des applications et <strong>API REST</strong> robustes
                        en environnement <strong>Node.js</strong> et <strong>TypeScript</strong>, en
                        privilégiant des architectures modulaires, maintenables et performantes.
                    </p>

                    <p>
                        J’implémente des services sécurisés avec gestion de l’authentification,
                        validation des données et organisation claire des routes et couches métiers.
                    </p>

                    <p>
                        Pour la persistance des données, j’utilise des bases relationnelles comme
                        <strong> MySQL</strong> ou NoSQL telles que <strong>MongoDB</strong>, ainsi que
                        des ORM comme <strong>Sequelize</strong> afin de
                        garantir cohérence, maintenabilité et évolutivité du code.
                    </p>

                    <p>
                        Selon les besoins du projet, je peux également intervenir en <strong>PHP </strong>
                        pour la maintenance ou l’évolution d’applications existantes.
                    </p>

                    <p>
                        Je travaille dans des environnements conteneurisés avec <strong>Docker</strong>,
                        garantissant reproductibilité, portabilité et déploiements fiables dans une
                        approche orientée DevOps.
                    </p>
                </div>

                {/* LOGOS EN BAS */}
                <div className={styles.logosWrapper}>
                    <div className={styles.marquee}>
                        <div className={styles.track}>
                            {images.concat(images).map((img, index) => (
                                <div className={styles.logoItem} key={index}>
                                    <Image
                                        src={img.src}
                                        alt={`logo tech ${index + 1}`}
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