import { useState, useEffect } from 'react';
import { useDevicePerformanceTier } from '@/hooks/useDevicePerformanceTier';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceLite } from './ExperienceLite';
import { ExperienceFull } from './ExperienceFull';

export function ExperienceJourney() {
  const tier = useDevicePerformanceTier();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check immediately on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // For 'full' tier on DESKTOP ONLY, we use pinning.
  // On mobile, horizontal scrolling cards are unreadable, so we fallback.
  if (tier === 'full' && !isMobile) {
    return (
      <section id="experience" className="w-full max-w-[100vw] mx-auto py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
          <SectionHeading title="Experience" subtitle="My professional journey" />
        </div>
        <ExperienceFull />
      </section>
    );
  }

  return (
    <SectionWrapper id="experience" className="overflow-visible">
      <SectionHeading title="Experience" subtitle="My professional journey" />
      <div className="mt-12 w-full">
        {/* On mobile or non-full tier, render animated vertical list */}
        <ExperienceLite />
      </div>
    </SectionWrapper>
  );
}
