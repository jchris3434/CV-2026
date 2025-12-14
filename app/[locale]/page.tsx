import {useTranslations} from 'next-intl';
import { Metadata } from 'next';
import Welcome from './Components/Welcome/welcome';
import Navbar from './Components/Navbar/navbar';

export const metadata: Metadata = {
  title: 'Jean-Christophe Fontaine',
};
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <>
      <Navbar />
      <Welcome />
    </>
  );
}