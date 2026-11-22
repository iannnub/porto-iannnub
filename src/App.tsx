import { lazy, Suspense } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { SkillsOrbit } from './sections/SkillsOrbit';
import { ExperienceJourney } from './sections/ExperienceJourney';
import { Projects } from './sections/Projects';
import { Certifications } from './sections/Certifications';
import { IntroLoader } from './components/layout/IntroLoader';
import { DocumentViewerModal } from './components/ui/DocumentViewerModal';

const Contact = lazy(() => import('./sections/Contact').then((m) => ({ default: m.Contact })));

function App() {
  return (
    <div className="min-h-screen bg-base flex flex-col relative overflow-x-hidden">
      <IntroLoader />
      <Navbar />
      <DocumentViewerModal />

      <main className="flex-1 relative z-10">
        <Hero />
        <About />
        <SkillsOrbit />
        <ExperienceJourney />
        <Projects />
        <Certifications />
        <Suspense
          fallback={
            <section
              id="contact"
              className="w-full max-w-6xl mx-auto px-6 md:px-12 py-20 min-h-[600px]"
            />
          }
        >
          <Contact />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;
