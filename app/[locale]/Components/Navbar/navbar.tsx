"use client";

import { useTranslations } from 'next-intl';
import styles from './navbar.module.css';
import { Link } from "react-scroll";
import { useEffect, useState } from "react";
import LocaleSelect from '../LocaleSelect/LocaleSelect';
import { Funnel_Sans } from 'next/font/google';

const sectionKeys: { [key: string]: string } = {
    "about-me": "about",
    "tools": "tools",
    "projects": "projects",
    "contact": "contact",
};

const funnelSans = Funnel_Sans({
    weight: '300',
    subsets: ['latin'],
    display: 'swap',
});

export default function Navbar() {
    const t = useTranslations();
    const [visibleItems, setVisibleItems] = useState<number>(0);
    // État pour le menu mobile
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleItems((prev) => Math.min(prev + 1, Object.keys(sectionKeys).length));
        }, 300);
        return () => clearInterval(interval);
    }, []);

    // Fermer le menu lors d'un clic sur un lien
    const closeMenu = () => setIsOpen(false);

    return (
        <header className={`${styles.header} ${funnelSans.className}`}>
            <div className={styles.navContainer}>
                
                {/* Bouton Hamburger */}
                <button 
                    className={styles.hamburger} 
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu"
                >
                    <span className={`${styles.bar} ${isOpen ? styles.barOpen : ''}`}></span>
                    <span className={`${styles.bar} ${isOpen ? styles.barOpen : ''}`}></span>
                    <span className={`${styles.bar} ${isOpen ? styles.barOpen : ''}`}></span>
                </button>

                <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}>
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
                                        activeClass={styles.navItemActive} 
                                        smooth spy to={section}
                                        onClick={closeMenu} // Ferme le menu au clic
                                    >
                                        {t(`navbar.${sectionKeys[section]}` as Parameters<typeof t>[0])}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                
                <div className={styles.localeWrapper}>
                    <LocaleSelect />
                </div>
            </div>
        </header>
    );
}