import Welcome from './Components/Welcome/welcome';
import Navbar from './Components/Navbar/navbar';
import AboutMe from './Components/AboutMe/about';
import MyTools from './Components/MyTools/mytools';
import Projects from './Components/Projects/projects';
import Contact from './Components/Contact/contact';
import { Funnel_Sans  } from 'next/font/google';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jean-Christophe Fontaine',
};

const funnelSans = Funnel_Sans({
  weight: '300',
  subsets: ['latin'],
  display: 'swap',
});

export default function HomePage() {
  return (
    <div className={funnelSans.className}>
      <Navbar />
      <Welcome />
      <AboutMe />
      <MyTools />
      <Projects />
      <Contact />
    </div>
  );
}
