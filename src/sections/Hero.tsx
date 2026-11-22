import { memo, useState, useEffect, useRef } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { profileData } from '@/data/profile';
import { triggerEngineStart } from '@/lib/engineEvents';
import { openDocumentViewer } from '@/lib/documentEvents';
import { Gauge } from 'lucide-react';

const RotatingHeadline = memo(function RotatingHeadline() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0]?.isIntersecting ?? true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % profileData.headline.length);
    }, 2500);
    return () => window.clearInterval(interval);
  }, [isVisible]);

  return (
    <div ref={containerRef} className="h-8 md:h-12 overflow-hidden flex items-center">
      <p className="font-mono text-lg md:text-2xl text-accent-red-glow flex items-center">
        <span className="mr-2">&gt;</span>
        {profileData.headline[roleIndex]}
        <span
          aria-hidden="true"
          className="ml-1.5 w-2 md:w-3 h-5 md:h-7 bg-accent-red-glow inline-block animate-cursor-blink"
        />
      </p>
    </div>
  );
});

export function Hero() {
  return (
    <SectionWrapper
      id="hero"
      className="min-h-[85vh] md:min-h-screen flex flex-col-reverse md:flex-row items-center justify-between overflow-hidden pt-28 md:pt-0"
    >
      {/* Left: Text Content (LCP element - rendered immediately without delay) */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col gap-6 mt-8 md:mt-0">
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <p className="font-mono text-accent-blue-glow">Hello, I am</p>
            <button
              type="button"
              onClick={triggerEngineStart}
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-full border border-accent-red/50 bg-accent-red/10 text-accent-red-glow text-xs font-mono tracking-wider hover:bg-accent-red hover:text-white transition-colors duration-150 shadow-[0_0_15px_rgba(224,40,46,0.2)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              title="Trigger Porsche GT3 RS ignition animation and sound"
              aria-label="Start engine ignition animation"
            >
              <Gauge size={15} aria-hidden="true" />
              <span>START ENGINE</span>
            </button>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-white uppercase tracking-wider leading-none break-words">
            {profileData.name}
            <span className="text-accent-red-glow">.</span>
          </h1>
        </div>

        <RotatingHeadline />

        <p className="font-sans text-secondary text-lg max-w-lg leading-relaxed">
          {profileData.about[3]}
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            variant="primary"
            className="min-h-[44px]"
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            View Projects
          </Button>
          {profileData.socials.resume && (
            <Button
              variant="outline"
              className="min-h-[44px]"
              onClick={() => openDocumentViewer('cv')}
            >
              View CV
            </Button>
          )}
          {profileData.socials.portfolioPdf && (
            <Button
              variant="outline"
              className="min-h-[44px]"
              onClick={() => openDocumentViewer('portfolio')}
            >
              Portfolio PDF
            </Button>
          )}
          <Button
            variant="outline"
            className="min-h-[44px]"
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Contact Me
          </Button>
        </div>
      </div>

      {/* Right: Swinging Spiderman Visual */}
      <div className="relative z-0 w-full md:w-1/2 h-[46vh] md:h-screen flex items-center justify-center">
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-[-8vh] right-[20%] md:right-[30%] origin-top animate-spiderman-swing">
            <div className="absolute top-0 left-[50%] w-[1px] h-[34vh] bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />

            <picture>
              <source srcSet="/spiderman.webp" type="image/webp" />
              <img
                src="/spiderman.png"
                alt="Spiderman Swinging"
                width={500}
                height={333}
                fetchPriority="high"
                decoding="async"
                className="w-48 md:w-80 h-auto object-contain relative z-10"
                style={{
                  marginTop: 'calc(34vh - 12px)',
                  marginLeft: '-20px',
                  filter: 'drop-shadow(0 20px 20px rgba(224,40,46,0.4))',
                }}
              />
            </picture>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
