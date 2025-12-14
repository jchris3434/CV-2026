import { useTranslations } from 'next-intl';
import styles from './welcome.module.css';

export default function Welcome() {
  const t = useTranslations('Welcome');
  return (
    <section className={styles.globaleSection}>
      <div className={styles.divLeft}>Gauche photo</div>
      <div className={styles.divRight}>Droite Title</div>
    </section>
  );
}
