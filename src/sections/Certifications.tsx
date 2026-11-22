import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { certificationsData } from '@/data/certifications';
import { Award, ExternalLink } from 'lucide-react';

export function Certifications() {
  return (
    <SectionWrapper id="certifications">
      <SectionHeading title="Certifications" subtitle="Professional credentials" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificationsData.map((cert) => (
          <div
            key={cert.id}
            className="h-full rounded-xl border border-white/10 bg-[#12121A] hover:border-accent-blue/50 transition-colors duration-200 hover:shadow-[0_0_15px_rgba(45,108,223,0.18)] overflow-hidden group flex flex-col"
          >
            {cert.image ? (
              <div className="w-full h-40 bg-[#0A0A0F] border-b border-white/10 overflow-hidden relative">
                <img
                  src={cert.image}
                  alt={cert.title}
                  width={400}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-elevated-2 border-b border-accent-line flex flex-col items-center justify-center relative p-4 text-center">
                <Award
                  size={36}
                  className="text-accent-blue-glow mb-2 group-hover:scale-110 group-hover:text-accent-red-glow transition-transform duration-200"
                />
                <span className="font-mono text-xs uppercase tracking-wider text-secondary">
                  {cert.issuer}
                </span>
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              <p className="font-sans text-accent-blue-glow mb-1 text-sm font-medium">
                {cert.issuer}
              </p>
              <h3 className="font-sans font-bold text-lg text-white mb-4 flex-1">{cert.title}</h3>

              <div className="flex items-center justify-between pt-4 border-t border-accent-line">
                <span className="font-mono text-xs text-secondary">{cert.date}</span>
                {cert.file ? (
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-accent-blue-glow hover:text-white inline-flex items-center gap-1 min-h-[44px] px-2.5 py-2 -mr-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                  >
                    View Certificate <ExternalLink size={12} aria-hidden="true" />
                  </a>
                ) : cert.credentialId ? (
                  <span className="font-mono text-xs text-secondary">ID: {cert.credentialId}</span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
