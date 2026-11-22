import { useState, useEffect, useRef } from 'react';

export function IntroLoader() {
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleStart = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      setIsPlaying(true);

      try {
        const audio = new Audio('/jdm-engine.mp3');
        audio.volume = 1.0;
        audio.play().catch(() => {
          // Autoplay blocked by browser policy
        });
      } catch {
        // Ignore audio instantiation errors in headless environments
      }

      timerRef.current = window.setTimeout(() => {
        setIsPlaying(false);
        timerRef.current = null;
      }, 3500);
    };

    window.addEventListener('start-engine', handleStart);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      window.removeEventListener('start-engine', handleStart);
    };
  }, []);

  if (!isPlaying) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Porsche GT3 RS ignition sequence animation"
      className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center pointer-events-none overflow-hidden animate-[modal-fade_200ms_ease-out]"
    >
      <div className="relative w-full max-w-4xl h-64 flex items-center justify-center">
        {/* Speed lines */}
        <div className="absolute inset-0 flex items-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              data-anim="engine"
              className="absolute h-1 w-48 bg-accent-blue/60 rounded-full opacity-0"
              style={{
                top: `${30 + i * 15}%`,
                left: '10%',
                animation: `engine-speedline 0.6s linear ${2.2 + i * 0.05}s forwards`,
              }}
            />
          ))}
        </div>

        {/* Porsche GT3 RS SVG */}
        <div
          data-anim="engine"
          className="relative z-10"
          style={{ animation: 'engine-car 3s ease-in-out forwards' }}
        >
          <div
            data-anim="engine"
            className="absolute left-[-20px] bottom-[20px] w-8 h-3 bg-accent-red rounded-full"
            style={{
              transformOrigin: '100% 50%',
              animation: 'engine-flame 3s ease-in-out forwards',
            }}
          />

          <svg
            viewBox="0 0 300 100"
            className="w-72 md:w-[500px] text-white drop-shadow-[0_0_20px_rgba(224,40,46,0.3)]"
          >
            <path
              d="M30 70 
                 C 20 70, 10 60, 15 50
                 C 30 45, 60 40, 80 35
                 C 120 20, 160 20, 190 35
                 C 220 40, 260 45, 275 45
                 C 285 45, 290 55, 290 65
                 C 290 70, 280 70, 270 70
                 Z"
              fill="currentColor"
            />
            <path
              d="M 30 45 L 20 20 L 70 15 L 60 40 Z"
              fill="#0A0A0F"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M 25 15 L 75 10" stroke="#E0282E" strokeWidth="4" />
            <path d="M 110 30 C 140 25, 170 25, 185 35 L 185 45 L 100 45 Z" fill="#0A0A0F" />
            <path d="M 80 60 L 260 60" stroke="#E0282E" strokeWidth="3" opacity="0.8" />

            <g
              data-anim="engine"
              style={{
                transformOrigin: '60px 70px',
                animation: 'engine-wheel 3s ease-in-out forwards',
              }}
            >
              <circle cx="60" cy="70" r="18" fill="#0A0A0F" stroke="#E0282E" strokeWidth="4" />
              <circle cx="60" cy="70" r="6" fill="#2D6CDF" />
              <line x1="60" y1="52" x2="60" y2="88" stroke="#E0282E" strokeWidth="2" />
              <line x1="42" y1="70" x2="78" y2="70" stroke="#E0282E" strokeWidth="2" />
            </g>

            <g
              data-anim="engine"
              style={{
                transformOrigin: '230px 70px',
                animation: 'engine-wheel 3s ease-in-out forwards',
              }}
            >
              <circle cx="230" cy="70" r="18" fill="#0A0A0F" stroke="#E0282E" strokeWidth="4" />
              <circle cx="230" cy="70" r="6" fill="#2D6CDF" />
              <line x1="230" y1="52" x2="230" y2="88" stroke="#E0282E" strokeWidth="2" />
              <line x1="212" y1="70" x2="248" y2="70" stroke="#E0282E" strokeWidth="2" />
            </g>
          </svg>
        </div>

        <p
          data-anim="engine"
          className="absolute bottom-10 font-display text-2xl text-accent-red tracking-widest drop-shadow-md"
          style={{ animation: 'engine-text 3s ease-in-out forwards' }}
        >
          IGNITION SEQUENCE START...
        </p>
      </div>
    </div>
  );
}
