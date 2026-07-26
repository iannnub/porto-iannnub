import { useState } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Project } from '@/data/types';
import { projectsData } from '@/data/projects';
import { ExternalLink, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectGalleryModal } from '@/components/ui/ProjectGalleryModal';

export function Projects() {
  const [activeGalleryProject, setActiveGalleryProject] = useState<Project | null>(null);

  return (
    <SectionWrapper id="projects">
      <SectionHeading title="Projects" subtitle="Some of my recent work" />



      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projectsData.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 100, damping: 12 }}
            >
              <Card className="h-full flex flex-col p-0 border-accent-line hover:border-accent-blue/50 transition-all duration-300 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden group hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(45,108,223,0.3)]">
                <div className="w-full h-40 bg-gradient-to-br from-accent-red/20 to-accent-blue/20 flex items-center justify-center border-b border-white/10 group-hover:from-accent-red/30 group-hover:to-accent-blue/30 transition-colors">
                  <h3 className="font-display text-3xl tracking-wide text-white drop-shadow-md text-center px-4">
                    {project.title}
                  </h3>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <p className="font-sans text-secondary mb-6 flex-1 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="rounded-full">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-accent-line">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-sm font-medium transition-all ${
                          project.title.includes('JemberTrip') 
                            ? 'text-accent-red hover:text-red-400 drop-shadow-[0_0_8px_rgba(224,40,46,0.6)]' 
                            : 'text-primary hover:text-accent-blue'
                        }`}
                      >
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                    {project.images && project.images.length > 0 && (
                      <button
                        onClick={() => setActiveGalleryProject(project)}
                        className="flex items-center gap-2 text-sm font-medium transition-all text-secondary hover:text-white ml-auto group"
                      >
                        <Camera size={16} className="group-hover:scale-110 transition-transform" /> Gallery
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Gallery Modal */}
      <ProjectGalleryModal
        isOpen={!!activeGalleryProject}
        onClose={() => setActiveGalleryProject(null)}
        images={activeGalleryProject?.images || []}
        title={activeGalleryProject?.title || ''}
      />
    </SectionWrapper>
  );
}
