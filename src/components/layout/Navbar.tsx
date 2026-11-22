import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { profileData } from '@/data/profile';
import { openDocumentViewer } from '@/lib/documentEvents';

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
      const scrolled = window.scrollY > 20;
      setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
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
          'pointer-events-auto relative w-full max-w-5xl rounded-full transition-shadow duration-200 flex items-center justify-between py-2.5 px-4 sm:px-6',
          'backdrop-blur-md bg-[#0A0A0F]/90 border border-white/15',
          isScrolled
            ? 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_12px_36px_rgba(0,0,0,0.65)]'
            : 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_8px_32px_rgba(0,0,0,0.5)]'
        )}
      >
        <a
          href="#"
          className="font-display text-xl sm:text-2xl tracking-wider text-primary transition-colors duration-200 hover:text-accent-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-lg py-1 px-1.5"
          aria-label="Homepage iannnub"
        >
          iannnub<span className="text-accent-red">.</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 relative" aria-label="Desktop Navigation">
          <ul className="flex items-center gap-1 relative">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <li key={link.name} className="relative">
                  <a
                    href={link.href}
                    className={cn(
                      'relative px-3.5 py-2 text-sm font-medium rounded-full transition-colors duration-150 flex items-center justify-center min-h-[44px] select-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                      isActive
                        ? 'text-white font-semibold bg-white/10 border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                        : 'text-neutral-400 border-transparent hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>

          {(profileData.socials.resume || profileData.socials.portfolioPdf) && (
            <button
              type="button"
              onClick={() => openDocumentViewer('cv')}
              className="ml-3 inline-flex items-center justify-center rounded-full font-sans font-medium bg-accent-red text-white hover:bg-red-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(224,40,46,0.4)] px-4 py-2 min-h-[44px] text-sm transition-[transform,background-color] duration-150 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              CV &amp; Portfolio
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle button */}
        <button
          type="button"
          className="md:hidden text-primary p-2 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-full active:scale-90 transition-transform"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile Navigation Dropdown (Solid dark panel - zero backdrop-filter blur lag) */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 rounded-3xl bg-[#0D0D14] border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.85)] overflow-hidden p-5 animate-[menu-pop_140ms_ease-out]"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile Menu Navigation">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'text-base font-medium px-4 py-2.5 rounded-xl transition-colors duration-150 min-h-[44px] flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                      isActive
                        ? 'bg-white/10 text-white font-semibold border border-white/15'
                        : 'text-neutral-300 hover:text-white hover:bg-white/5'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />}
                  </a>
                );
              })}
              {(profileData.socials.resume || profileData.socials.portfolioPdf) && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {profileData.socials.resume && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full font-sans font-medium bg-accent-red text-white hover:bg-red-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(224,40,46,0.35)] px-4 py-2.5 text-sm w-full min-h-[44px] active:scale-95 transition-[transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openDocumentViewer('cv');
                      }}
                    >
                      View CV
                    </button>
                  )}
                  {profileData.socials.portfolioPdf && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full font-sans font-medium bg-white/10 text-white hover:bg-white/15 border border-white/20 px-4 py-2.5 text-sm w-full min-h-[44px] active:scale-95 transition-[transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openDocumentViewer('portfolio');
                      }}
                    >
                      Portfolio PDF
                    </button>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
