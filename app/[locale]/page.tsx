import {useTranslations} from 'next-intl';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jean-Christophe Fontaine',
};
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}