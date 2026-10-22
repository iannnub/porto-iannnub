import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { SkillsOrbit } from './sections/SkillsOrbit';
import { ExperienceJourney } from './sections/ExperienceJourney';
import { Projects } from './sections/Projects';
import { Certifications } from './sections/Certifications';
import { Contact } from './sections/Contact';
import { IntroLoader } from './components/layout/IntroLoader';

function App() {
  return (
    <div className="min-h-screen bg-base flex flex-col relative overflow-x-hidden">
      <IntroLoader />
      <Navbar />

      <main className="flex-1 relative z-10">
        <Hero />
        <About />
        <SkillsOrbit />
        <ExperienceJourney />
        <Projects />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
