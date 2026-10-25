import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { profileData } from '@/data/profile';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.href.substring(1));

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeSection = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 sm:pt-4 px-3 sm:px-6 font-sans pointer-events-none">
      <div
        className={cn(
          'pointer-events-auto relative w-full max-w-5xl rounded-full transition-all duration-300 flex items-center justify-between',
          'backdrop-blur-2xl bg-[#0A0A0F]/80 border border-white/15',
          'shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)]',
          isScrolled ? 'py-2 px-4 sm:px-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_36px_rgba(0,0,0,0.65)]' : 'py-2.5 px-5 sm:px-7'
        )}
      >
        <a
          href="#"
          className="font-display text-xl sm:text-2xl tracking-wider text-primary transition-all duration-200 hover:text-accent-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-lg py-1 px-1.5"
          aria-label="Homepage iannnub"
        >
          iannnub<span className="text-accent-red">.</span>
        </a>

        {/* Desktop Nav with iPhone Liquid Morphing Pill */}
        <nav className="hidden md:flex items-center gap-1 relative" aria-label="Desktop Navigation">
          <ul className="flex items-center gap-1 relative">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <li key={link.name} className="relative">
                  <a
                    href={link.href}
                    className={cn(
                      'relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 flex items-center justify-center min-h-[36px] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                      isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-pill"
                        className="absolute inset-0 rounded-full bg-white/10 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>

          {profileData.socials.resume && (
            <motion.a
              href={profileData.socials.resume}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="ml-3 inline-flex items-center justify-center rounded-full font-sans font-medium bg-accent-red text-white hover:bg-red-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(224,40,46,0.45)] px-3.5 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              Download CV
            </motion.a>
          )}
        </nav>

        {/* Mobile Menu Toggle button */}
        <button
          className="md:hidden text-primary p-2 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-full active:scale-90 transition-transform"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile Nav Liquid Glass Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 rounded-3xl backdrop-blur-2xl bg-[#0A0A0F]/95 border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden p-5"
            >
              <nav className="flex flex-col gap-2" aria-label="Mobile Menu Navigation">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className={cn(
                        'text-base font-medium px-4 py-2.5 rounded-xl transition-all min-h-[44px] flex items-center justify-between',
                        isActive
                          ? 'bg-white/10 text-white font-semibold border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                          : 'text-neutral-300 hover:text-white hover:bg-white/5'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{link.name}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />}
                    </a>
                  );
                })}
                {profileData.socials.resume && (
                  <a
                    href={profileData.socials.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full font-sans font-medium bg-accent-red text-white hover:bg-red-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(224,40,46,0.4)] px-4 py-2.5 text-base mt-2 w-full min-h-[44px] active:scale-95 transition-transform"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Download CV
                  </a>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
