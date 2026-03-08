'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './contact.module.css';

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
      <h1 className={styles.title}>{t('sectionTitle')}</h1>
      <p className={styles.subtitle}>{t('subtitle')}</p>

      <div className={styles.icons}>
        <a
          href="https://www.linkedin.com/in/jean-christophe-fontaine-307749269/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/icones/linkedin.png" width={500} height={500} alt="LinkedIn" />
        </a>

        <a
          href="https://github.com/jchris3434?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/icones/github.png" width={500} height={500} alt="GitHub" />
        </a>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Honeypot anti-spam */}
        <input type="text" name="_gotcha" style={{ display: "none" }} />

        <input
          type="text"
          name="name"
          placeholder={t('placeholders.name')}
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder={t('placeholders.email')}
          value={form.email}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder={t('placeholders.message')}
          value={form.message}
          onChange={handleChange}
          rows={5}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? t('buttons.loading') : t('buttons.submit')}
        </button>

        {submitted && <p className={styles.thanks}>{t('thankYou')}</p>}
      </form>
    </section>
  );
}