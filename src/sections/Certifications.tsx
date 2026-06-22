import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { certificationsData } from '@/data/certifications';
import { motion } from 'framer-motion';

export function Certifications() {
  return (
    <SectionWrapper id="certifications">
      <SectionHeading title="Certifications" subtitle="Professional credentials" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificationsData.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 30, borderColor: 'rgba(255,255,255,0.05)' }}
            whileInView={{ 
              opacity: 1, 
              y: 0, 
              borderColor: ['rgba(224,40,46,0.8)', 'rgba(45,108,223,0.8)', 'rgba(255,255,255,0.05)'] 
            }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: idx * 0.1 }}
            className="h-full rounded-xl border"
          >
            <div className="h-full flex flex-col bg-white/5 backdrop-blur-md rounded-xl hover:border-accent-blue/50 transition-colors duration-500 hover:shadow-[0_0_15px_rgba(45,108,223,0.2)] overflow-hidden group">
              {cert.image && (
                <div className="w-full h-40 bg-white/5 border-b border-white/10 overflow-hidden relative">
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <p className="font-sans text-accent-blue mb-1 text-sm font-medium">
                {cert.issuer}
              </p>
              <h3 className="font-sans font-bold text-lg text-white mb-4 flex-1">
                {cert.title}
              </h3>
              
              <div className="flex items-center justify-between pt-4 border-t border-accent-line">
                <span className="font-mono text-xs text-secondary">{cert.date}</span>
                {cert.credentialId && (
                  <span className="font-mono text-xs text-secondary">
                    ID: {cert.credentialId}
                  </span>
                )}
              </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
