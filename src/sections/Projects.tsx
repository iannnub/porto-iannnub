import { useState, useMemo, useCallback, memo } from 'react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Project, ProjectCategory } from '@/data/types';
import { projectsData } from '@/data/projects';
import { profileData } from '@/data/profile';
import { openDocumentViewer } from '@/lib/documentEvents';
import { ProjectGalleryModal } from '@/components/ui/ProjectGalleryModal';
import { ExternalLink, Camera, FolderOpen, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterTab = 'All' | ProjectCategory;

const FILTER_TABS: FilterTab[] = [
  'All',
  'AI & Data',
  'Enterprise & ERP',
  'Gov & EdTech',
  'Web & Consumer',
];

const ProjectCard = memo(function ProjectCard({
  project,
  onOpenGallery,
}: {
  project: Project;
  onOpenGallery: (project: Project) => void;
}) {
  const coverSrc = project.coverImage || project.images?.[0];
  const imageCount = project.images?.length ?? 0;

  return (
    <Card withHoverEffect className="h-full flex flex-col p-0 group">
      {coverSrc ? (
        <button
          type="button"
          onClick={() => imageCount > 0 && onOpenGallery(project)}
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
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {imageCount > 0 && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A0A0F]/90 border border-white/15 text-white text-xs font-mono shadow-md">
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
              className="inline-flex items-center gap-2 text-sm font-medium min-h-[44px] px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/15 text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              <ExternalLink size={15} aria-hidden="true" />
              <span>Live Demo</span>
            </a>
          )}
          {imageCount > 0 && (
            <button
              type="button"
              onClick={() => onOpenGallery(project)}
              className="relative inline-flex items-center gap-2 text-sm font-medium transition-colors duration-150 min-h-[44px] px-4 py-2 rounded-full bg-accent-blue/15 hover:bg-accent-blue border border-accent-blue/40 text-accent-blue-glow hover:text-white ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              <Camera size={15} aria-hidden="true" />
              <span>Screenshots</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  );
});

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

  const handleOpenGallery = useCallback((project: Project) => {
    setActiveGalleryProject(project);
  }, []);

  return (
    <SectionWrapper id="projects">
      <SectionHeading
        title="Projects"
        subtitle="Production systems, enterprise ERPs, and applied AI tools"
      />

      {/* Category Filter Tabs */}
      <div className="flex justify-center mb-4">
        <div
          role="group"
          aria-label="Filter projects by category"
          className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-3xl bg-[#12121A] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_28px_rgba(0,0,0,0.45)]"
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
                  'relative px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors duration-150 flex items-center gap-2 select-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                  isActive
                    ? 'text-white font-semibold bg-white/10 border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
                    : 'text-neutral-400 border-transparent hover:text-white hover:bg-white/5'
                )}
              >
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

      {/* Portfolio PDF Deck Quick Access Bar */}
      {profileData.socials.portfolioPdf && (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-[#12121A] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_20px_rgba(0,0,0,0.35)]">
            <span className="font-sans text-xs sm:text-sm text-secondary flex items-center gap-2">
              <FolderOpen size={16} className="text-accent-blue shrink-0" />
              <span>Want the complete slide-deck overview?</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openDocumentViewer('portfolio')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-full text-xs sm:text-sm font-medium bg-accent-blue hover:bg-blue-600 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue active:scale-95"
              >
                <span>Preview Portfolio (PDF)</span>
              </button>
              <a
                href={profileData.socials.portfolioPdf}
                download="SeptianPutraRachmanHakim_Portfolio_Academy.pdf"
                aria-label="Download Portfolio Academy PDF"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-full text-xs sm:text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                <Download size={14} />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Memoized Grid (CSS visibility toggling prevents expensive React subtree teardown/remount) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => {
          const isVisible = activeCategory === 'All' || project.category === activeCategory;
          return (
            <div
              key={project.id}
              className={isVisible ? 'h-full cv-card' : 'hidden'}
              aria-hidden={!isVisible}
            >
              <ProjectCard project={project} onOpenGallery={handleOpenGallery} />
            </div>
          );
        })}
      </div>

      {/* Gallery Modal */}
      {activeGalleryProject && (
        <ProjectGalleryModal
          isOpen={true}
          onClose={() => setActiveGalleryProject(null)}
          images={activeGalleryProject.images || []}
          title={activeGalleryProject.title || ''}
        />
      )}
    </SectionWrapper>
  );
}
