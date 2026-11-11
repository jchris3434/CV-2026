'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './contact.module.css';
import Reveal from '../Reveal/reveal';
import { trackPointer } from '../../utils/pointer';

const links = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jean-christophe-fontaine-307749269/',
    icon: '/icones/linkedin.png',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/jchris3434?tab=repositories',
    icon: '/icones/github.png',
  },
];

export default function Contact() {
  const t = useTranslations('contact');

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    const res = await fetch("https://formspree.io/f/mvzwgwew", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...form,
        subject: "Message depuis le portfolio",
      }),
    });

    if (res.ok) {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    }

    setLoading(false);
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <Reveal>
            <h1 className="section-title">{t('sectionTitle')}</h1>
          </Reveal>

          <Reveal delay={80}>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </Reveal>

          <Reveal delay={160} className={styles.icons}>
            {links.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.linkIcon}>
                  <Image src={icon} width={40} height={40} alt={label} />
                </span>
                <span aria-hidden="true">{label}</span>
                <svg className={styles.linkArrow} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            ))}
          </Reveal>
        </div>

        <Reveal variant="zoom">
          <form className={styles.form} onSubmit={handleSubmit} onPointerMove={trackPointer}>
            {/* Honeypot anti-spam */}
            <input type="text" name="_gotcha" style={{ display: "none" }} />

            <div className={styles.row}>
              <input
                type="text"
                name="name"
                className={styles.field}
                placeholder={t('placeholders.name')}
                aria-label={t('placeholders.name')}
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                className={styles.field}
                placeholder={t('placeholders.email')}
                aria-label={t('placeholders.email')}
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <textarea
              name="message"
              className={styles.field}
              placeholder={t('placeholders.message')}
              aria-label={t('placeholders.message')}
              value={form.message}
              onChange={handleChange}
              rows={5}
              required
            />

            <div className={styles.footer}>
              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? t('buttons.loading') : t('buttons.submit')}
                <svg className={styles.submitArrow} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>

              <output className={styles.thanks}>{submitted && t('thankYou')}</output>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
