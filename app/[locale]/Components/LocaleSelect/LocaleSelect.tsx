'use client'; // Indiquer que ce composant doit être rendu côté client

import { useRouter, usePathname } from 'next/navigation'; // Importer useRouter depuis next/navigation (pas next/router)
import styles from '../Navbar/navbar.module.css'; // Importer les styles CSS Modules
import Image from 'next/image';

export default function LocaleSelect() {
  const router = useRouter(); // Utilisation de useRouter depuis next/navigation
  const pathname = usePathname(); // Obtenir le chemin actuel
  
  // Fonction pour changer de langue
  const changeLocale = (locale: string) => {
    // Le push dans app/ fonctionne de la manière suivante avec next/navigation
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${locale}`); // Remplacer la locale dans le chemin
    router.push(newPathname); // Changer la locale tout en gardant la même route
  };

  return (
    <nav className={styles.navFlag}>
      <button className={styles.buttonFlag} onClick={() => changeLocale('en')}>
        <Image
          src="/icones/ukFlag.png"
          width={25}
          height={25}
          alt="English"
        />
      </button>
      <button className={styles.buttonFlag}onClick={() => changeLocale('fr')}>
        <Image
          className={styles.frenchFlag}
          src="/icones/frFlag.png"
          width={27}
          height={27}
          alt="Français"
        />
      </button>
      <button className={styles.buttonFlag}onClick={() => changeLocale('re')}>
        <Image
          className={styles.frenchFlag}
          src="/icones/RunFlagV2.png"
          width={27}
          height={27}
          alt="Créole"
        />
      </button>
    </nav>
  );
}
