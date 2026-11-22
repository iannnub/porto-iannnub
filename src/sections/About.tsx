import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { profileData } from '@/data/profile';
import { Card } from '@/components/ui/Card';
import { openDocumentViewer } from '@/lib/documentEvents';
import { Mail, MapPin, FileText, FolderOpen, Download } from 'lucide-react';

export function About() {
  return (
    <SectionWrapper id="about">
      <SectionHeading title="About Me" subtitle="A brief introduction" />

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left: Bio Text */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 border-l-4 border-accent-red pl-6 font-sans text-secondary text-lg leading-relaxed">
          {profileData.about.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
          <div className="mt-4">
            <h3 className="font-display text-xl text-primary mb-2">Quick Facts</h3>
            <div className="flex flex-col gap-3 font-sans text-secondary">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-accent-red" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-accent-red" />
                <a
                  href={`mailto:${profileData.socials.email}`}
                  className="hover:text-accent-blue transition-colors"
                >
                  {profileData.socials.email}
                </a>
              </div>
              {profileData.socials.resume && (
                <div className="flex flex-wrap items-center gap-3">
                  <FileText size={18} className="text-accent-red-glow shrink-0" />
                  <button
                    type="button"
                    onClick={() => openDocumentViewer('cv')}
                    className="min-h-[44px] inline-flex items-center hover:text-accent-blue-glow transition-colors underline-offset-4 hover:underline text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded px-1"
                  >
                    Preview CV (PDF)
                  </button>
                  <a
                    href={profileData.socials.resume}
                    download="SeptianPutraRachmanHakim_CV_Academy.pdf"
                    aria-label="Save CV PDF"
                    className="inline-flex items-center gap-1.5 font-mono text-xs px-3.5 py-2 min-h-[44px] rounded-full bg-white/5 border border-white/15 text-secondary hover:text-white hover:border-accent-blue/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  >
                    <Download size={13} />
                    <span>Save</span>
                  </a>
                </div>
              )}
              {profileData.socials.portfolioPdf && (
                <div className="flex flex-wrap items-center gap-3">
                  <FolderOpen size={18} className="text-accent-red-glow shrink-0" />
                  <button
                    type="button"
                    onClick={() => openDocumentViewer('portfolio')}
                    className="min-h-[44px] inline-flex items-center hover:text-accent-blue-glow transition-colors underline-offset-4 hover:underline text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded px-1"
                  >
                    Preview Portfolio Deck (PDF)
                  </button>
                  <a
                    href={profileData.socials.portfolioPdf}
                    download="SeptianPutraRachmanHakim_Portfolio_Academy.pdf"
                    aria-label="Save Portfolio Deck PDF"
                    className="inline-flex items-center gap-1.5 font-mono text-xs px-3.5 py-2 min-h-[44px] rounded-full bg-white/5 border border-white/15 text-secondary hover:text-white hover:border-accent-blue/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  >
                    <Download size={13} />
                    <span>Save</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stat List */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {Object.entries(profileData.stats).map(([key, value]) => (
            <Card
              key={key}
              className="flex items-center gap-6 p-6 md:p-8 bg-[#12121A] border border-white/10 hover:border-accent-blue/40 hover:bg-[#171722] transition-colors group shadow-lg"
            >
              <div className="flex-1">
                <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-accent-red-glow mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="font-display text-2xl md:text-4xl text-white group-hover:text-accent-blue transition-colors drop-shadow-[0_0_10px_rgba(45,108,223,0.3)]">
                  {value}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
