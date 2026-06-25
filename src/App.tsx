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
      {/* Premium Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent-blue/5 blur-[60px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-accent-red/5 blur-[60px]" />
      </div>

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
