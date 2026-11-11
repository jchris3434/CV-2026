import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {Funnel_Display, Funnel_Sans, Instrument_Serif, JetBrains_Mono} from 'next/font/google';
import {routing} from '@/i18n/routing';
import './globals.css';

const fontSans = Funnel_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const fontDisplay = Funnel_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const fontSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  display: 'swap',
  variable: '--font-serif',
});

const fontVariables = [fontSans, fontDisplay, fontMono, fontSerif]
  .map((font) => font.variable)
  .join(' ');

// Exécuté avant le premier affichage : signale que JavaScript est actif
// (les apparitions au défilement en dépendent) et restaure le thème choisi.
const themeInit = `(function(){var d=document.documentElement;d.dataset.js='';try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){d.dataset.theme=t}}catch(e){}})();`;

type Props = {
  readonly children: React.ReactNode;
  readonly params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{__html: themeInit}} />
        <NextIntlClientProvider locale={locale}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
