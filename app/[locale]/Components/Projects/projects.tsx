'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type SyntheticEvent,
} from 'react';
import { flushSync } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './projects.module.css';
import Reveal from '../Reveal/reveal';
import { runViewTransition } from '../../utils/motion';
import { trackPointer } from '../../utils/pointer';
import { lockPageScroll } from '../../utils/scroll';

type Project = {
  readonly key: string;
  readonly video: string;
  readonly thumbnail: string;
  /** Rapport largeur / hauteur de la vidéo, quand ce n'est pas du 16/9. */
  readonly ratio?: number;
};

const projects: Project[] = [
  { key: "exaprint", video: "/videos/trailer-Exaprint.mp4", thumbnail: "/thumbnails/trailer-Exaprint.jpg" },
  { key: "woocommerce", video: "/videos/ceramiste.mp4", thumbnail: "/thumbnails/ceramiste.jpg" },
  { key: "restaurant", video: "/videos/chez-olive.mp4", thumbnail: "/thumbnails/chez-olive.jpg" },
  { key: "landify", video: "/videos/Landify.mp4", thumbnail: "/thumbnails/Landify.jpg" },
  { key: "gestion", video: "/videos/osmova.mp4", thumbnail: "/thumbnails/osmova.jpg", ratio: 1918 / 916 },
  { key: "cmsMaison", video: "/videos/teaser-CMS.mp4", thumbnail: "/thumbnails/teaser-CMS.jpg" },
  { key: "portfolio", video: "/videos/demo-jc.mp4", thumbnail: "/thumbnails/demo-jc.jpg" }
];

const DEFAULT_RATIO = 16 / 9;

// La grille montre une grande vignette, quatre petites, puis deux moyennes.
const SMALL_SIZES = '(max-width: 560px) 100vw, (max-width: 900px) 50vw, 300px';
const WIDE_SIZES = '(max-width: 900px) 100vw, 600px';
const isSmall = (index: number) => index >= 1 && index <= 4;

// Noms de transition de vue (leurs règles sont dans globals.css). Deux éléments
// qui portent le même nom avant et après un changement sont reliés par le
// navigateur : il fait glisser l'un vers l'autre.
const MEDIA_TRANSITION: CSSProperties = { viewTransitionName: 'project-media' };
const LIGHTBOX_TRANSITION: CSSProperties = { viewTransitionName: 'lightbox' };

// Charge l'image d'attente de la vidéo dès que le pointeur arrive sur la
// vignette : au clic, elle est déjà en cache et s'affiche sans délai.
const preloadPoster = (src: string) => {
  const image = new globalThis.Image();
  image.src = src;
};

export default function Projects() {
  const t = useTranslations('projects');
  const ui = useTranslations('ui');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  // Projet dont la vignette est reliée au lecteur vidéo (voir MEDIA_TRANSITION).
  const [linkedKey, setLinkedKey] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const transitionCount = useRef(0);
  const titleId = useId();

  // La vignette prend le nom de transition juste avant l'ouverture, puis le cède
  // au lecteur : elle se transforme en lecteur sous les yeux du visiteur.
  const open = (project: Project, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    transitionCount.current += 1;
    flushSync(() => setLinkedKey(project.key));
    runViewTransition(() => flushSync(() => setActiveProject(project)), 'lightboxOpen');
  };

  // Chemin inverse : le lecteur rend son nom à la vignette, qui le garde
  // jusqu'à la fin de l'animation de retour.
  const close = useCallback(() => {
    transitionCount.current += 1;
    const count = transitionCount.current;
    const unlink = () => {
      if (transitionCount.current === count) setLinkedKey(null);
    };

    const transition = runViewTransition(
      () => flushSync(() => setActiveProject(null)),
      'lightboxClose',
    );

    if (transition) {
      transition.finished.then(unlink, unlink);
    } else {
      unlink();
    }
  }, []);

  // Échap : on garde la main sur la fermeture pour jouer l'animation de retour.
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    close();
  };

  // La fenêtre est ouverte dès que React l'a créée, donc avant que le navigateur
  // ne photographie le nouvel état de la page : le lecteur y est déjà visible.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (typeof dialog.showModal !== 'function') {
      dialog.setAttribute('open', '');
    } else if (!dialog.open) {
      dialog.showModal();
    }
    closeRef.current?.focus({ preventScroll: true });

    // Un clic sur le fond (la fenêtre elle-même, pas son contenu) la referme.
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) close();
    };
    dialog.addEventListener('click', onBackdropClick);
    const unlockScroll = lockPageScroll();

    return () => {
      dialog.removeEventListener('click', onBackdropClick);
      unlockScroll();
    };
  }, [activeProject, close]);

  // À la fermeture, le focus revient sur la vignette qui avait ouvert la fenêtre.
  useEffect(() => {
    if (activeProject) return;
    openerRef.current?.focus({ preventScroll: true });
    openerRef.current = null;
  }, [activeProject]);

  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <Reveal>
          <h1 className={`section-title ${styles.title}`}>{t('sectionTitle')}</h1>
        </Reveal>

        <div className={styles.grid}>
          {projects.map((project, index) => {
            const title = t(`items.${project.key}`);
            // Pendant que son projet est ouvert, la vignette est « partie »
            // dans la fenêtre vidéo : sa place reste vide dans la grille.
            const away = activeProject?.key === project.key;
            const linked = !away && linkedKey === project.key;

            return (
              <Reveal key={project.key} className={styles.cell} delay={(index % 4) * 80}>
                <article className={styles.card} onPointerMove={trackPointer}>
                  <button
                    type="button"
                    className={styles.thumbnail}
                    onPointerEnter={() => preloadPoster(project.thumbnail)}
                    onClick={(event) => open(project, event.currentTarget)}
                  >
                    <span
                      className={away ? `${styles.media} ${styles.mediaAway}` : styles.media}
                      style={linked ? MEDIA_TRANSITION : undefined}
                    >
                      <Image
                        src={project.thumbnail}
                        alt={title}
                        width={1280}
                        height={720}
                        sizes={isSmall(index) ? SMALL_SIZES : WIDE_SIZES}
                        className={styles.thumbnailImage}
                      />
                    </span>
                    <span className={styles.playButton} aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <polygon points="9,5 9,19 20,12" />
                      </svg>
                    </span>
                  </button>

                  <div className={styles.caption}>
                    <span className={styles.index} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className={styles.cardTitle}>{title}</h3>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {activeProject && (
        <dialog
          ref={dialogRef}
          className={styles.modal}
          style={LIGHTBOX_TRANSITION}
          aria-labelledby={titleId}
          onCancel={handleCancel}
          onClose={close}
        >
          <div
            className={styles.modalContent}
            style={{ '--ratio': activeProject.ratio ?? DEFAULT_RATIO } as CSSProperties}
          >
            <video
              className={styles.modalVideo}
              style={MEDIA_TRANSITION}
              controls
              autoPlay
              playsInline
              poster={activeProject.thumbnail}
            >
              <source src={activeProject.video} type="video/mp4" />
              <track kind="captions" />
            </video>

            <h2 id={titleId} className={styles.modalTitle}>
              {t(`items.${activeProject.key}`)}
            </h2>

            <button
              ref={closeRef}
              type="button"
              className={styles.closeButton}
              onClick={close}
              aria-label={ui('close')}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </dialog>
      )}
    </section>
  );
}
