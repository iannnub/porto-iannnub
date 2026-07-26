import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const activeSection = useScrollSpy(NAV_LINKS.map(link => link.href.substring(1)));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans',
        isScrolled ? 'bg-black/40 backdrop-blur-md border-b border-accent-line/30 py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="font-display text-2xl tracking-wider text-primary transition-all duration-300 hover:text-accent-red hover:drop-shadow-[0_0_8px_rgba(224,40,46,0.8)]">
          iannnub<span className="text-accent-red">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={cn(
                    'relative group text-sm font-medium transition-colors hover:text-white',
                    activeSection === link.href.substring(1) ? 'text-white' : 'text-secondary'
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-accent-blue transition-all duration-300",
                    activeSection === link.href.substring(1) ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </a>
              </li>
            ))}
          </ul>
          <Button variant="primary" size="sm" onClick={() => window.open('/assets/cv/CV UMUM.pdf', '_blank')}>
            Download CV
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-elevated border-b border-accent-line shadow-xl">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  'text-lg font-medium py-2 transition-colors',
                  activeSection === link.href.substring(1) ? 'text-accent-blue' : 'text-primary'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button variant="primary" size="md" className="mt-4 w-full" onClick={() => window.open('/assets/cv/CV UMUM.pdf', '_blank')}>
              Download CV
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
