import { useState, useEffect, lazy, Suspense } from 'react';
import { useDevicePerformanceTier } from '@/hooks/useDevicePerformanceTier';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceLite } from './ExperienceLite';

const ExperienceFull = lazy(() =>
  import('./ExperienceFull').then((m) => ({ default: m.ExperienceFull }))
);

export function ExperienceJourney() {
  const tier = useDevicePerformanceTier();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : true
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Only load heavy GSAP + Three.js horizontal timeline on desktop full tier
  if (tier === 'full' && !isMobile) {
    return (
      <section id="experience" className="w-full max-w-[100vw] mx-auto py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
          <SectionHeading title="Experience" subtitle="My professional journey" />
        </div>
        <Suspense
          fallback={
            <div className="max-w-6xl mx-auto px-6 md:px-12">
              <ExperienceLite />
            </div>
          }
        >
          <ExperienceFull />
        </Suspense>
      </section>
    );
  }

  return (
    <SectionWrapper id="experience" className="overflow-visible">
      <SectionHeading title="Experience" subtitle="My professional journey" />
      <div className="mt-12 w-full">
        <ExperienceLite />
      </div>
    </SectionWrapper>
  );
}
