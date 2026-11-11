'use client'; // Indiquer que ce composant doit être rendu côté client

import { useRouter, usePathname } from 'next/navigation'; // Importer useRouter depuis next/navigation (pas next/router)
import styles from './localeselect.module.css';
import Image from 'next/image';

// Le créole (locale « re », drapeau RunFlagV2.png) est prêt dans les
// dictionnaires mais n'est pas encore proposé dans le sélecteur.
const locales = [
  { code: 'en', label: 'English', flag: '/icones/ukFlag.png' },
  { code: 'fr', label: 'Français', flag: '/icones/frFlag.png' },
];

export default function LocaleSelect() {
  const router = useRouter(); // Utilisation de useRouter depuis next/navigation
  const pathname = usePathname(); // Obtenir le chemin actuel
  const current = pathname.split('/')[1];

  // Fonction pour changer de langue
  const changeLocale = (locale: string) => {
    // Le push dans app/ fonctionne de la manière suivante avec next/navigation
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${locale}`); // Remplacer la locale dans le chemin
    router.push(newPathname); // Changer la locale tout en gardant la même route
  };

  return (
    <nav className={styles.locales}>
      {locales.map(({ code, label, flag }) => (
        <button
          key={code}
          type="button"
          className={`${styles.flag} ${code === current ? styles.flagActive : ''}`}
          onClick={() => changeLocale(code)}
          aria-current={code === current ? 'true' : undefined}
        >
          <Image src={flag} width={22} height={22} alt={label} />
        </button>
      ))}
    </nav>
  );
}
