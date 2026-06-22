import { useRef, useLayoutEffect, Suspense, lazy } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Experience } from '@/data/types';
import { experienceData } from '@/data/experience';

const ExperienceRoadScene = lazy(() => import('@/three/ExperienceRoadScene'));

gsap.registerPlugin(ScrollTrigger);

export function ExperienceFull({ data = experienceData }: { data?: Experience[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.experience-card');
      
      const track = trackRef.current;
      if (!track) return;
      
      const amountToScroll = track.scrollWidth - window.innerWidth + 300; 
      
      const tween = gsap.to(track, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${amountToScroll}`,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          }
        }
      });
      
      cards.forEach((card: unknown) => {
        const el = card as HTMLElement;
        gsap.fromTo(el, 
          { y: 100, opacity: 0, rotationZ: 5 },
          { 
            y: 0, opacity: 1, rotationZ: 0,
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: "left center+=200",
              end: "left center-=200",
              scrub: true,
            }
          }
        );
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="h-screen w-full overflow-hidden bg-base relative">
      <Suspense fallback={<div className="absolute inset-0 z-0 bg-base" />}>
        <ExperienceRoadScene progressRef={progressRef} />
      </Suspense>
      
      <div ref={trackRef} className="flex gap-12 lg:gap-24 items-center pl-12 pr-[50vw] z-10 relative h-full">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-accent-red to-accent-blue -translate-y-1/2 z-0" />
        
        {data.map((exp, idx) => {
          const isLatest = idx === 0;
          const isOldest = idx === data.length - 1;
          const borderClass = isLatest ? 'border-l-accent-red' : isOldest ? 'border-l-accent-blue' : 'border-l-purple-500';

          return (
          <div key={exp.id} className="experience-card w-[85vw] md:w-[600px] shrink-0 relative z-10 py-10">
             <div className={`absolute top-1/2 -left-6 md:-left-12 w-4 h-4 rounded-full shadow-[0_0_15px_rgba(224,40,46,0.5)] -translate-y-1/2 z-20 ${isLatest ? 'bg-accent-red' : 'bg-accent-blue'}`} />
             <Card className={`p-8 bg-elevated/80 backdrop-blur-xl border border-white/5 border-l-4 ${borderClass} shadow-2xl relative overflow-hidden group`}>
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 relative z-10">
                 <div>
                   <h3 className="font-display text-3xl tracking-wide text-primary font-bold">{exp.title}</h3>
                   <p className={`font-sans font-medium text-lg ${isLatest ? 'text-accent-red' : 'text-accent-blue'}`}>{exp.company} • {exp.type}</p>
                 </div>
                 <div className="text-left md:text-right font-mono text-sm text-secondary">
                   <p>{exp.date}</p>
                   <p>{exp.location}</p>
                 </div>
               </div>
               
               <ul className="space-y-3 mb-6 text-secondary text-lg relative z-10">
                 {exp.bullets.map((bullet, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-accent-red mt-2.5 shrink-0" />
                     <span>{bullet}</span>
                   </li>
                 ))}
               </ul>
               
               <div className="flex flex-wrap gap-2 relative z-10">
                 {exp.skills.map((skill) => (
                   <Badge key={skill} variant={isLatest ? "red" : "blue"}>{skill}</Badge>
                 ))}
               </div>
             </Card>
          </div>
          );
        })}
      </div>
    </div>
  );
}
