import {useTranslations} from 'next-intl';
import { Metadata } from 'next';
import Welcome from './Components/Welcome/welcome';
import Navbar from './Components/Navbar/navbar';
import AboutMe from './Components/AboutMe/about';
import { Funnel_Sans  } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Jean-Christophe Fontaine',
};

const funnelSans = Funnel_Sans({
  weight: '300', 
  subsets: ['latin'], 
  display: 'swap',
});
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <>
    <div className={funnelSans.className}>
      <Navbar />
      <Welcome />
      <AboutMe />
    </div>
      
    </>
  );
}