import { useState, useMemo } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Project, ProjectCategory } from '@/data/types';
import { projectsData } from '@/data/projects';
import { ExternalLink, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectGalleryModal } from '@/components/ui/ProjectGalleryModal';
import { cn } from '@/lib/utils';

type FilterTab = 'All' | ProjectCategory;

const FILTER_TABS: FilterTab[] = [
  'All',
  'AI & Data',
  'Enterprise & ERP',
  'Gov & EdTech',
  'Web & Consumer',
];

export function Projects() {
  const [activeGalleryProject, setActiveGalleryProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<FilterTab>('All');

  const categoryCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      All: projectsData.length,
      'AI & Data': 0,
      'Enterprise & ERP': 0,
      'Gov & EdTech': 0,
      'Web & Consumer': 0,
    };
    projectsData.forEach((project) => {
      if (project.category) {
        counts[project.category] += 1;
      }
    });
    return counts;
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projectsData;
    return projectsData.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <SectionWrapper id="projects">
      <SectionHeading
        title="Projects"
        subtitle="Production systems, enterprise ERPs, and applied AI tools"
      />

      {/* iPhone Liquid Glass Segmented Category Filter */}
      <div className="flex justify-center mb-10">
        <div
          role="group"
          aria-label="Filter projects by category"
          className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-3xl backdrop-blur-2xl bg-[#0A0A0F]/80 border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_8px_28px_rgba(0,0,0,0.45)]"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCategory(tab)}
                aria-pressed={isActive}
                className={cn(
                  'relative px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                  isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-project-filter"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{tab}</span>
                <span
                  className={cn(
                    'text-xs font-mono px-1.5 py-0.5 rounded-full transition-colors',
                    isActive
                      ? 'bg-accent-blue/25 text-white border border-accent-blue/40'
                      : 'bg-white/5 text-neutral-400'
                  )}
                >
                  {categoryCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => {
            const coverSrc = project.coverImage || project.images?.[0];
            const imageCount = project.images?.length ?? 0;

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                <Card withHoverEffect className="h-full flex flex-col p-0 group">
                  {/* Cover Thumbnail */}
                  {coverSrc ? (
                    <button
                      type="button"
                      onClick={() => imageCount > 0 && setActiveGalleryProject(project)}
                      aria-label={`Open screenshot gallery for ${project.title}`}
                      className="relative w-full aspect-[16/10] bg-[#0A0A0F] border-b border-white/10 overflow-hidden text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-blue"
                    >
                      <img
                        src={coverSrc}
                        alt={`${project.title} interface preview`}
                        width={720}
                        height={450}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      {imageCount > 0 && (
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A0A0F]/85 backdrop-blur-md border border-white/15 text-white text-xs font-mono shadow-md">
                          <Camera size={12} aria-hidden="true" />
                          <span>
                            {imageCount} {imageCount === 1 ? 'Screen' : 'Screens'}
                          </span>
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="w-full aspect-[16/10] bg-elevated-2 flex items-center justify-center border-b border-white/10 px-4">
                      <span className="font-display text-2xl tracking-wide text-white text-center">
                        {project.title}
                      </span>
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono text-neutral-400 mb-2">
                      <span className="truncate">{project.company || project.category}</span>
                      <span className="shrink-0">{project.date}</span>
                    </div>

                    <h3 className="font-sans font-semibold text-lg text-white leading-snug mb-3">
                      {project.title}
                    </h3>

                    <p className="font-sans text-sm text-secondary mb-5 flex-1 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="rounded-full">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-auto pt-4 border-t border-white/10">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium min-h-[44px] px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/15 text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                        >
                          <ExternalLink size={15} aria-hidden="true" />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {imageCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveGalleryProject(project)}
                          className="relative inline-flex items-center gap-2 text-sm font-medium transition-all min-h-[44px] px-4 py-2 rounded-full bg-accent-blue/15 hover:bg-accent-blue border border-accent-blue/40 text-accent-blue-glow hover:text-white ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                        >
                          <Camera size={15} aria-hidden="true" />
                          <span>Screenshots</span>
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
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
