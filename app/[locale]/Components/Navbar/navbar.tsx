"use client";

import { useTranslations } from 'next-intl';
import styles from './navbar.module.css';
import { Link } from "react-scroll";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import LocaleSelect from '../LocaleSelect/LocaleSelect';
import ThemeToggle from '../ThemeToggle/themetoggle';
import { lockPageScroll } from '../../utils/scroll';

const sectionKeys: { [key: string]: string } = {
    "about-me": "about",
    "tools": "tools",
    "projects": "projects",
    "contact": "contact",
};

export default function Navbar() {
    const t = useTranslations();
    // État pour le menu mobile
    const [isOpen, setIsOpen] = useState(false);

    const listRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
    const activeRef = useRef<string | null>(null);

    // Déplace la pastille de surbrillance sous le lien de la section affichée.
    const moveIndicator = useCallback(() => {
        const list = listRef.current;
        if (!list) return;

        const item = activeRef.current ? itemRefs.current[activeRef.current] : null;
        if (!item) {
            delete list.dataset.active;
            return;
        }

        list.style.setProperty('--indicator-x', `${item.offsetLeft}px`);
        list.style.setProperty('--indicator-width', `${item.offsetWidth}px`);
        list.dataset.active = 'true';
    }, []);

    const handleSetActive = (section: string) => {
        activeRef.current = section;
        moveIndicator();
    };

    const handleSetInactive = (section: string) => {
        if (activeRef.current !== section) return;
        activeRef.current = null;
        moveIndicator();
    };

    // La largeur des liens change avec la fenêtre : on recale la pastille.
    useEffect(() => {
        globalThis.addEventListener('resize', moveIndicator);
        return () => globalThis.removeEventListener('resize', moveIndicator);
    }, [moveIndicator]);

    // Pas de défilement de la page derrière le menu mobile ouvert.
    useEffect(() => {
        if (!isOpen) return;
        return lockPageScroll();
    }, [isOpen]);

    // Fermer le menu lors d'un clic sur un lien
    const closeMenu = () => setIsOpen(false);

    return (
        <header className={styles.header}>
            <div className={styles.progress} aria-hidden="true" />

            <div className={styles.bar}>
                <Link
                    href="#top"
                    to="top"
                    smooth
                    className={styles.brand}
                    onClick={closeMenu}
                    aria-label={t('ui.home')}
                >
                    <svg className={styles.brandIcon} viewBox="0 0 24 24" aria-hidden="true">
                        <g transform="translate(0 0.5)">
                            <path d="M3 10.5 12 3l9 7.5" />
                            <path d="M5 9v10a1 1 0 0 0 1 1h3.5v-6h5v6H18a1 1 0 0 0 1-1V9" />
                        </g>
                    </svg>
                </Link>

                <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}>
                    <ul className={styles.navList} ref={listRef}>
                        {Object.keys(sectionKeys).map((section, index) => (
                            <li
                                key={section}
                                className={styles.navItem}
                                style={{ '--i': index } as CSSProperties}
                                ref={(el) => { itemRefs.current[section] = el; }}
                            >
                                <Link
                                    href={`#${section}`}
                                    className={styles.navLink}
                                    activeClass={styles.navLinkActive}
                                    smooth spy to={section}
                                    onSetActive={handleSetActive}
                                    onSetInactive={handleSetInactive}
                                    onClick={closeMenu} // Ferme le menu au clic
                                >
                                    {t(`navbar.${sectionKeys[section]}` as Parameters<typeof t>[0])}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.actions}>
                    <LocaleSelect />
                    <ThemeToggle />

                    {/* Bouton Hamburger */}
                    <button
                        type="button"
                        className={styles.hamburger}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Menu"
                        aria-expanded={isOpen}
                    >
                        <span className={`${styles.line} ${isOpen ? styles.lineOpen : ''}`}></span>
                        <span className={`${styles.line} ${isOpen ? styles.lineOpen : ''}`}></span>
                    </button>
                </div>
            </div>
        </header>
    );
}
