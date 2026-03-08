'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './projects.module.css';

type Project = {
  title: string;
  video: string;
  thumbnail: string;
};

const projects: Project[] = [
{ title: "Exaprint", video: "/videos/trailer-Exaprint.mp4", thumbnail: "/thumbnails/trailer-Exaprint.jpg" },
  { title: "Site WooCommerce", video: "/videos/ceramiste.mp4", thumbnail: "/thumbnails/ceramiste.jpg" },
  { title: "Restaurant", video: "/videos/chez-olive.mp4", thumbnail: "/thumbnails/chez-olive.jpg" },  
  { title: "Landify", video: "/videos/Landify.mp4", thumbnail: "/thumbnails/Landify.jpg" },
  { title: "Logiciel Gestion", video: "/videos/osmova.mp4", thumbnail: "/thumbnails/osmova.jpg" },
  { title: "Création CMS Maison", video: "/videos/teaser-CMS.mp4", thumbnail: "/thumbnails/teaser-CMS.jpg" },
  { title: "Portfolio 2024", video: "/videos/demo-jc.mp4", thumbnail: "/thumbnails/demo-jc.jpg" },
  
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <h1 className={styles.title}>Projets</h1>
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.thumbnail} onClick={() => setActiveProject(project)}>
                <Image
                  src={project.thumbnail}
                  alt={project.title}
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
              <h3>{project.title}</h3>
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
            <h2 className={styles.modalTitle}>{activeProject.title}</h2>
          </div>
        </div>
      )}
    </section>
  );
}