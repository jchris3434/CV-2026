import Welcome from './Components/Welcome/welcome';
import Navbar from './Components/Navbar/navbar';
import AboutMe from './Components/AboutMe/about';
import MyTools from './Components/MyTools/mytools';
import Projects from './Components/Projects/projects';
import Contact from './Components/Contact/contact';
import CursorGlow from './Components/CursorGlow/cursorglow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jean-Christophe Fontaine',
};

export default function HomePage() {
  return (
    <div className="page">
      <CursorGlow />
      <Navbar />
      <main>
        <Welcome />
        <AboutMe />
        <MyTools />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}
