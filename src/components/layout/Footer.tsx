import { ArrowUp, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { profileData } from '@/data/profile';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-base relative z-10 font-sans mt-24">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-red to-accent-blue opacity-50" />
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 flex flex-col items-center gap-6">
        <a href="#" className="font-display text-2xl tracking-wider text-primary transition-all duration-300 hover:text-accent-red hover:drop-shadow-[0_0_8px_rgba(224,40,46,0.8)]">
          iannnub<span className="text-accent-red">.</span>
        </a>
        
        <div className="flex items-center gap-6">
          {profileData.socials.linkedin && (
            <a href={profileData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent-blue transition-colors flex items-center gap-2 group" aria-label="LinkedIn">
              <FaLinkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">LinkedIn</span>
            </a>
          )}
          {profileData.socials.github && (
            <a href={profileData.socials.github} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent-red transition-colors flex items-center gap-2 group" aria-label="GitHub">
              <FaGithub className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">GitHub</span>
            </a>
          )}
          {profileData.socials.instagram && (
            <a href={profileData.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-pink-500 transition-colors flex items-center gap-2 group" aria-label="Instagram">
              <FaInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Instagram</span>
            </a>
          )}
          {profileData.socials.email && (
            <a href={`mailto:${profileData.socials.email}`} className="text-secondary hover:text-accent-blue transition-colors flex items-center gap-2 group" aria-label="Email">
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Email</span>
            </a>
          )}
        </div>

        <p className="text-secondary text-sm text-center">
          &copy; {currentYear} {profileData.name}. All rights reserved.
        </p>

        <button
          onClick={scrollToTop}
          className="mt-4 flex flex-col items-center gap-2 text-secondary hover:text-accent-blue transition-colors group"
          aria-label="Back to top"
        >
          <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center group-hover:shadow-[0_0_10px_rgba(91,156,255,0.5)] transition-shadow">
            <ArrowUp size={16} />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest">Top</span>
        </button>
      </div>
    </footer>
  );
}
