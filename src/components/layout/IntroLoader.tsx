import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isLoading || !hasStarted) return;

    // AUDIO LOGIC
    try {
      const audio = new Audio('/jdm-engine.mp3');
      audio.volume = 1.0;
      audio.play().catch(() => {
        // Autoplay blocked by browser
      });
    } catch {
      // Ignore
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Let the audio play out naturally even after loader disappears
    }, 3500);

    return () => {
      clearTimeout(timer);
      // We purposefully don't pause the audio here so the turbo flutter can ring out 
      // into the main page view for a seamless transition.
    };
  }, [isLoading, hasStarted]);

  return (
    <AnimatePresence>
      {isLoading && !hasStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[101] bg-[#050508] flex items-center justify-center"
        >
          <button 
            onClick={() => setHasStarted(true)} 
            className="px-8 py-4 border-2 border-accent-red text-accent-red font-display text-2xl hover:bg-accent-red hover:text-white transition-all rounded shadow-[0_0_20px_rgba(224,40,46,0.5)]"
          >
            TAP TO START ENGINE
          </button>
        </motion.div>
      )}

      {isLoading && hasStarted && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#050508] flex items-center justify-center pointer-events-none overflow-hidden"
        >
          <div className="relative w-full max-w-4xl h-64 flex items-center justify-center">
            
            {/* Speed lines effect (appears when driving off) */}
            <motion.div 
              className="absolute inset-0 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ duration: 3.5, times: [0, 0.7, 0.8, 1] }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 bg-accent-blue/50 rounded-full"
                  style={{ top: `${30 + i * 15}%`, left: '10%' }}
                  initial={{ width: 0, x: 0 }}
                  animate={{ width: [0, 200, 0], x: [0, 800, 1500] }}
                  transition={{ duration: 0.6, delay: 2.2 + i * 0.05, ease: "linear" }}
                />
              ))}
            </motion.div>

            {/* Porsche GT3 RS SVG & Animation */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ 
                opacity: [0, 1, 1, 1, 0], 
                x: [-100, 0, 0, 1500, 1500],
                y: [0, 0, -2, 2, -1, 1, 0, 0],
                rotate: [0, 0, -1, 1, -0.5, 0.5, 0, -5]
              }}
              transition={{ 
                duration: 3, 
                times: [0, 0.3, 0.4, 0.8, 1],
                y: { duration: 1, delay: 1, repeat: 1, repeatType: "mirror" }, // Revving vibration
                rotate: { duration: 1, delay: 1, repeat: 1, repeatType: "mirror" },
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              {/* Exhaust flame */}
              <motion.div
                className="absolute left-[-20px] bottom-[20px] w-8 h-3 bg-gradient-to-r from-accent-blue to-accent-red rounded-full blur-[2px]"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 0, 1, 0], scaleX: [0, 0, 2, 0] }}
                transition={{ duration: 3, times: [0, 0.4, 0.75, 1] }}
                style={{ originX: 1 }}
              />

              <svg viewBox="0 0 300 100" className="w-72 md:w-[500px] text-white drop-shadow-[0_0_20px_rgba(224,40,46,0.3)]">
                {/* Car Body */}
                <path d="M30 70 
                         C 20 70, 10 60, 15 50
                         C 30 45, 60 40, 80 35
                         C 120 20, 160 20, 190 35
                         C 220 40, 260 45, 275 45
                         C 285 45, 290 55, 290 65
                         C 290 70, 280 70, 270 70
                         Z" 
                      fill="currentColor"/>
                {/* GT3 Wing */}
                <path d="M 30 45 L 20 20 L 70 15 L 60 40 Z" fill="#0A0A0F" stroke="currentColor" strokeWidth="2" />
                <path d="M 25 15 L 75 10" stroke="#E0282E" strokeWidth="4" />
                {/* Windows */}
                <path d="M 110 30 C 140 25, 170 25, 185 35 L 185 45 L 100 45 Z" fill="#0A0A0F" />
                {/* Red Decal / Line */}
                <path d="M 80 60 L 260 60" stroke="#E0282E" strokeWidth="3" opacity="0.8" />
                
                {/* Wheels */}
                {/* Back Wheel (left) */}
                <motion.g
                  animate={{ rotate: [0, 0, 360, 1440] }}
                  transition={{ duration: 3, times: [0, 0.4, 0.7, 1] }}
                  style={{ originX: '60px', originY: '70px' }}
                >
                  <circle cx="60" cy="70" r="18" fill="#0A0A0F" stroke="#E0282E" strokeWidth="4" />
                  <circle cx="60" cy="70" r="6" fill="#2D6CDF" />
                  <line x1="60" y1="52" x2="60" y2="88" stroke="#E0282E" strokeWidth="2" />
                  <line x1="42" y1="70" x2="78" y2="70" stroke="#E0282E" strokeWidth="2" />
                </motion.g>

                {/* Front Wheel (right) */}
                <motion.g
                  animate={{ rotate: [0, 0, 360, 1440] }}
                  transition={{ duration: 3, times: [0, 0.4, 0.7, 1] }}
                  style={{ originX: '230px', originY: '70px' }}
                >
                  <circle cx="230" cy="70" r="18" fill="#0A0A0F" stroke="#E0282E" strokeWidth="4" />
                  <circle cx="230" cy="70" r="6" fill="#2D6CDF" />
                  <line x1="230" y1="52" x2="230" y2="88" stroke="#E0282E" strokeWidth="2" />
                  <line x1="212" y1="70" x2="248" y2="70" stroke="#E0282E" strokeWidth="2" />
                </motion.g>
              </svg>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, times: [0, 0.2, 0.8, 1] }}
              className="absolute bottom-10 font-display text-2xl text-accent-red tracking-widest drop-shadow-md"
            >
              IGNITION SEQUENCE START...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
