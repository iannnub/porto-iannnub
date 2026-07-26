import { useState, useEffect } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { profileData } from '@/data/profile';
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
    <SectionWrapper id="hero" className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between overflow-hidden pt-32 md:pt-0">
      
      {/* Left: Text Content */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col gap-6 mt-12 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="font-mono text-accent-blue mb-4">Hello, I am</p>
          <h1 className="font-display text-5xl md:text-7xl text-primary uppercase tracking-wider leading-none bg-gradient-to-r from-accent-red to-accent-blue bg-clip-text text-transparent break-words">
            {profileData.name}
          </h1>
        </motion.div>

        <motion.div
          className="h-8 md:h-12 overflow-hidden flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <motion.p
            key={roleIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
        </motion.div>

        <motion.p
          className="font-sans text-secondary text-lg max-w-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          {profileData.about[3]}
        </motion.p>

        <motion.div
          className="flex gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <Button variant="primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            View Projects
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Contact Me
          </Button>
        </motion.div>
      </div>

      {/* Right: 3D Scene */}
      <div className="relative z-0 w-full md:w-1/2 h-[50vh] md:h-screen flex items-center justify-center">
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          {/* Static Background Effect */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #5B9CFF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-accent-red to-accent-blue blur-[80px] opacity-20" />
          
          {/* Spiderman Animation */}
          <motion.div 
            className="absolute top-[-10vh] right-[20%] md:right-[30%] origin-top"
            animate={{ 
              rotate: [-15, 15, -15],
              y: [0, -20, 0]
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 2.25, ease: "easeInOut" }
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
              className="w-48 md:w-80 object-contain relative z-10"
              style={{ marginTop: 'calc(40vh - 20px)', marginLeft: '-20px', filter: 'drop-shadow(0 20px 20px rgba(224,40,46,0.4))' }}
            />
          </motion.div>
        </div>
      </div>



    </SectionWrapper>
  );
}
