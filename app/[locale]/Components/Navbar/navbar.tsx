"use client";

import { useTranslations } from 'next-intl';
import styles from './navbar.module.css';
//import { Link } from "react-scroll";
import Link from 'next/link';
import { useEffect, useState } from "react";

// Mapper les sections avec les clés exactes de traduction
const sectionKeys: { [key: string]: string } = {
    "about-me": "about",
    "education": "education",
    "resume": "resume",
    "projects": "projects",
    "contact": "contact",
};

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
  <header className={styles.header}>
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
      {/* <LocaleSelect /> */}
    </div>
  </header>
);
}