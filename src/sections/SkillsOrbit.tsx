import { useDevicePerformanceTier } from '@/hooks/useDevicePerformanceTier';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { skillsData } from '@/data/skills';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
// SkillsSphere removed due to WebGL context loss issues on some devices

function StaticSkills() {
  return (
    <div className="flex flex-wrap gap-4 justify-center max-w-4xl">
      {skillsData.map((category) => {
        const isFrontend = category.category.toLowerCase().includes('frontend');
        const badgeVariant = isFrontend ? 'red' : 'blue';
        return (
        <div key={category.category} className="w-full flex flex-col gap-4 mb-6">
          <h4 className="font-mono text-accent-red uppercase tracking-widest text-sm">{category.category}</h4>
          <div className="flex flex-wrap gap-3">
            {category.skills.map((skill) => (
              <Badge key={skill} variant={badgeVariant} className="text-sm px-4 py-1.5 rounded-full cursor-default">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        );
      })}
    </div>
  );
}

function OrbitingSkills() {
  return (
    <div className="w-full h-[350px] md:h-[700px] flex items-center justify-center overflow-hidden">
      <div className="relative w-[700px] h-[700px] flex-shrink-0 flex items-center justify-center scale-[0.5] sm:scale-[0.7] md:scale-100 origin-center">
        <div className="absolute w-24 h-24 bg-elevated-2 border-2 border-accent-red rounded-full z-10 flex items-center justify-center shadow-[0_0_30px_rgba(224,40,46,0.3)]">
        <span className="font-display text-primary">Core</span>
      </div>

      {skillsData.map((category, i) => {
        const radius = 120 + i * 70;
        const duration = 25 + i * 15;
        const reverse = i % 2 !== 0;

        return (
          <motion.div
            key={category.category}
            className="absolute rounded-full border border-accent-line/30"
            style={{ width: radius * 2, height: radius * 2 }}
            animate={{ rotate: reverse ? -360 : 360 }}
            transition={{ duration, repeat: Infinity, ease: 'linear' }}
          >
            {category.skills.slice(0, 6).map((skill, j) => {
              const numSkills = Math.min(6, category.skills.length);
              const angle = (j / numSkills) * Math.PI * 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={skill}
                  className="absolute left-1/2 top-1/2 origin-center"
                  style={{ x: `calc(-50% + ${x}px)`, y: `calc(-50% + ${y}px)` }}
                  animate={{ rotate: reverse ? 360 : -360 }}
                  transition={{ duration, repeat: Infinity, ease: 'linear' }}
                >
                  <Badge variant="blue" className="shadow-lg whitespace-nowrap text-xs md:text-sm">
                    {skill}
                  </Badge>
                </motion.div>
              );
            })}
          </motion.div>
        );
      })}
      </div>
    </div>
  );
}

export function SkillsOrbit() {
  const tier = useDevicePerformanceTier();

  return (
    <SectionWrapper id="skills" className="overflow-hidden">
      <SectionHeading title="Skills" subtitle="My technical toolkit" />
      <div className="mt-12 w-full flex justify-center items-center min-h-[500px]">
        {tier === 'static' ? (
          <StaticSkills />
        ) : (
          <OrbitingSkills />
        )}
      </div>
      
      {tier !== 'static' && (
        <div className="mt-8 md:mt-0 text-center">
          <p className="text-secondary font-sans text-sm md:text-base">
            * Displaying top skills per category. Check my resume for the full list.
          </p>
        </div>
      )}
    </SectionWrapper>
  );
}
