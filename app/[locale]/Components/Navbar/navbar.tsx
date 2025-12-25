"use client";

import { useTranslations } from 'next-intl';
import styles from './navbar.module.css';
//import { Link } from "react-scroll";
import Link from 'next/link';
import { useEffect, useState } from "react";
import LocaleSelect from '../LocaleSelect/LocaleSelect';
import { Funnel_Sans  } from 'next/font/google';

// Mapper les sections avec les clés exactes de traduction
const sectionKeys: { [key: string]: string } = {
    "about-me": "about",
    "tools": "tools",
    "resume": "resume",
    "projects": "projects",
    "contact": "contact",
};

const funnelSans = Funnel_Sans({
  weight: '300', // Poids Light (300)
  subsets: ['latin'], // Support pour les caractères latins
  display: 'swap', // Meilleure performance de rendu
});

export default function Navbar() {
    const t = useTranslations();

    // État pour gérer la visibilité des items
    const [visibleItems, setVisibleItems] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleItems((prev) => Math.min(prev + 1, Object.keys(sectionKeys).length));
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
  <header className={`${styles.header} ${funnelSans.className}`}>
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {Object.keys(sectionKeys).map((section, index) => {
            const isVisible = visibleItems > index;

            return (
              <li
                key={section}
                className={`
                  ${styles.navItem}
                  ${isVisible ? styles.navItemVisible : ''}
                `}
              >
                <Link
                  href={`#${section}`}
                  className={styles.navLink}
                >
                  {t(
                    `navbar.${sectionKeys[section]}` as
                      | 'navbar.about'
                      | 'navbar.education'
                      | 'navbar.resume'
                      | 'navbar.projects'
                      | 'navbar.contact'
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <LocaleSelect />
    </div>
  </header>
);
}