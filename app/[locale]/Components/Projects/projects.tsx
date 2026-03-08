'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './projects.module.css';

type Project = {
  key: string; // clé pour traduire le titre
  video: string;
  thumbnail: string;
};

const projects: Project[] = [
  { key: "exaprint", video: "/videos/trailer-Exaprint.mp4", thumbnail: "/thumbnails/trailer-Exaprint.jpg" },
  { key: "woocommerce", video: "/videos/ceramiste.mp4", thumbnail: "/thumbnails/ceramiste.jpg" },
  { key: "restaurant", video: "/videos/chez-olive.mp4", thumbnail: "/thumbnails/chez-olive.jpg" },
  { key: "landify", video: "/videos/Landify.mp4", thumbnail: "/thumbnails/Landify.jpg" },
  { key: "gestion", video: "/videos/osmova.mp4", thumbnail: "/thumbnails/osmova.jpg" },
  { key: "cmsMaison", video: "/videos/teaser-CMS.mp4", thumbnail: "/thumbnails/teaser-CMS.jpg" },
  { key: "portfolio", video: "/videos/demo-jc.mp4", thumbnail: "/thumbnails/demo-jc.jpg" }
];

export default function Projects() {
  const t = useTranslations('projects');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('sectionTitle')}</h1>
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.thumbnail} onClick={() => setActiveProject(project)}>
                <Image
                  src={project.thumbnail}
                  alt={t(`items.${project.key}`)}
                  width={600}
                  height={400}
                  className={styles.thumbnailImage}
                />
                <div className={styles.playButton}>
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="white">
                    <polygon points="8,4 8,20 20,12" />
                  </svg>
                </div>
              </div>
              <h3>{t(`items.${project.key}`)}</h3>
            </div>
          ))}
        </div>
      </div>

      {activeProject && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setActiveProject(null)}>✕</button>
            <video className={styles.modalVideo} controls autoPlay>
              <source src={activeProject.video} type="video/mp4" />
            </video>
            <h2 className={styles.modalTitle}>{t(`items.${activeProject.key}`)}</h2>
          </div>
        </div>
      )}
    </section>
  );
}