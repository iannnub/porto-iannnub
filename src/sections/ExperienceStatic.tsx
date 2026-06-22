import { motion } from 'framer-motion';
import { experienceData } from '@/data/experience';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function ExperienceStatic() {
  return (
    <div className="flex flex-col gap-8 relative border-l-2 border-accent-line ml-4 md:ml-8 pl-8">
      {experienceData.map((exp, idx) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="relative"
        >
          {/* Timeline dot */}
          <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-base border-4 border-accent-blue shadow-[0_0_10px_rgba(45,108,223,0.5)]" />
          
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display text-2xl tracking-wide text-primary">{exp.title}</h3>
                <p className="font-sans text-accent-blue font-medium">{exp.company} • {exp.type}</p>
              </div>
              <div className="text-left md:text-right font-mono text-sm text-secondary">
                <p>{exp.date}</p>
                <p>{exp.location}</p>
              </div>
            </div>
            
            <ul className="list-disc list-outside ml-5 mb-6 text-secondary space-y-2">
              {exp.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
            
            <div className="flex flex-wrap gap-2">
              {exp.skills.map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
