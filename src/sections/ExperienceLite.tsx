import { useRef, useEffect } from 'react';
import { experienceData } from '@/data/experience';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function ExperienceLite() {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopLineRef = useRef<HTMLDivElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const updateProgress = () => {
      rafId = null;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = vh * 0.5;
      const raw = (center - rect.top) / Math.max(rect.height, 1);
      const progress = Math.max(0, Math.min(1, raw));
      const scaleVal = `scaleY(${progress})`;

      if (desktopLineRef.current) {
        desktopLineRef.current.style.transform = scaleVal;
      }
      if (mobileLineRef.current) {
        mobileLineRef.current.style.transform = scaleVal;
      }
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative py-8 md:py-16 px-4 md:px-0">
      {/* Center line for desktop */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent-line -translate-x-1/2 hidden md:block z-0" />
      <div
        ref={desktopLineRef}
        className="absolute left-1/2 top-0 bottom-0 w-1 bg-accent-blue -translate-x-1/2 hidden md:block z-0 origin-top shadow-[0_0_10px_rgba(45,108,223,0.65)] will-change-transform"
        style={{ transform: 'scaleY(0)' }}
      />

      {/* Left line for mobile */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent-line md:hidden z-0" />
      <div
        ref={mobileLineRef}
        className="absolute left-6 top-0 bottom-0 w-1 bg-accent-blue md:hidden z-0 origin-top shadow-[0_0_10px_rgba(45,108,223,0.65)] will-change-transform"
        style={{ transform: 'scaleY(0)' }}
      />

      <div className="flex flex-col gap-12 md:gap-16 relative z-10">
        {experienceData.map((exp, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={exp.id}
              className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
                {/* Node for md+ */}
                <div className="hidden md:block absolute left-1/2 w-5 h-5 rounded-full bg-base border-[3px] border-accent-blue shadow-[0_0_10px_rgba(45,108,223,0.7)] -translate-x-1/2 mt-8 z-10" />

                {/* Node for mobile */}
                <div className="md:hidden absolute -left-2 w-4 h-4 rounded-full bg-base border-[3px] border-accent-blue shadow-[0_0_10px_rgba(45,108,223,0.7)] mt-8 z-10" />

                <div className={`w-full pl-8 md:pl-0 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                  <Card className="p-6 md:p-8" withHoverEffect>
                    <div className="flex flex-col gap-2 mb-4">
                      <h3 className="font-display text-2xl tracking-wide text-primary">
                        {exp.title}
                      </h3>
                      <p className="font-sans text-accent-red-glow font-medium">
                        {exp.company} • {exp.type}
                      </p>
                      <p className="font-mono text-sm text-secondary">
                        {exp.date} | {exp.location}
                      </p>
                    </div>
                    <ul className="list-disc list-outside ml-5 mb-6 text-secondary space-y-1">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
              <div className="hidden md:block w-1/2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
