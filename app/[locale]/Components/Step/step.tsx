import type { ReactNode } from 'react';
import styles from './step.module.css';

type Props = {
  /** Numéro de l'étape dans le déroulé d'un projet (1 à 4). */
  readonly number?: number;
  /** Petit rappel affiché au-dessus du titre. */
  readonly eyebrow?: string;
  readonly title: string;
  readonly children: ReactNode;
};

/**
 * Une étape du déroulé « Comment se déroule un projet ? » : un en-tête qui
 * reste accroché pendant la lecture, et une ligne de progression qui se
 * remplit au défilement.
 */
export default function Step({ number, eyebrow, title, children }: Props) {
  return (
    <div className={styles.step} data-step={number}>
      <span className={styles.line} aria-hidden="true">
        <span className={styles.fill} />
      </span>
      <span className={styles.node} aria-hidden="true" />

      <header className={styles.head}>
        {number !== undefined && (
          <span className={styles.number} aria-hidden="true">
            {String(number).padStart(2, '0')}
          </span>
        )}
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2 className={styles.title}>{title}</h2>
      </header>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
