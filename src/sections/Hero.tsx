import { useState, useEffect } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { profileData } from '@/data/profile';
import { triggerEngineStart } from '@/lib/engineEvents';
import { motion } from 'framer-motion';

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % profileData.headline.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <SectionWrapper
      id="hero"
      className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between overflow-hidden pt-32 md:pt-0"
    >
      {/* Left: Text Content (LCP element - rendered immediately without delay) */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col gap-6 mt-12 md:mt-0">
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <p className="font-mono text-accent-blue">Hello, I am</p>
            <button
              onClick={triggerEngineStart}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-red/50 bg-accent-red/10 text-accent-red text-xs font-mono tracking-wider hover:bg-accent-red hover:text-white transition-all shadow-[0_0_15px_rgba(224,40,46,0.2)] active:scale-95"
              title="Ignition - Porsche Rev & Sound"
            >
              <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
              START ENGINE 🏎️
            </button>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-white uppercase tracking-wider leading-none break-words">
            {profileData.name}
            <span className="text-accent-red">.</span>
          </h1>
        </div>

        <div className="h-8 md:h-12 overflow-hidden flex items-center">
          <motion.p
            key={roleIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-mono text-lg md:text-2xl text-accent-red flex items-center"
          >
            <span className="mr-2">&gt;</span>
            {profileData.headline[roleIndex]}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="ml-1 w-2 md:w-3 h-5 md:h-7 bg-accent-red inline-block"
            />
          </motion.p>
        </div>

        <p className="font-sans text-secondary text-lg max-w-lg leading-relaxed">
          {profileData.about[3]}
        </p>

        <div className="flex flex-wrap gap-4 mt-6">
          <Button
            variant="primary"
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            View Projects
          </Button>
          {profileData.socials.resume && (
            <a
              href={profileData.socials.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="outline">Download CV</Button>
            </a>
          )}
          <Button
            variant="outline"
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Contact Me
          </Button>
        </div>
      </div>

      {/* Right: 3D Scene */}
      <div className="relative z-0 w-full md:w-1/2 h-[50vh] md:h-screen flex items-center justify-center">
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          {/* Spiderman Animation */}
          <motion.div
            className="absolute top-[-10vh] right-[20%] md:right-[30%] origin-top"
            animate={{
              rotate: [-15, 15, -15],
              y: [0, -20, 0],
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
              y: { repeat: Infinity, duration: 2.25, ease: 'easeInOut' },
            }}
          >
            {/* The web line */}
            <div className="absolute top-0 left-[50%] w-[1px] h-[40vh] bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />

            <img
              src="/spiderman.png"
              alt="Spiderman Swinging"
              width={320}
              height={320}
              fetchPriority="high"
              decoding="async"
              className="w-48 md:w-80 aspect-square object-contain relative z-10"
              style={{
                marginTop: 'calc(40vh - 20px)',
                marginLeft: '-20px',
                filter: 'drop-shadow(0 20px 20px rgba(224,40,46,0.4))',
              }}
            />
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
