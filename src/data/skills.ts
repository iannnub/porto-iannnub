import type { SkillCategory } from './types';

export const skillsData: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Vue.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    category: 'Backend & AI',
    skills: ['Python', 'FastAPI', 'Laravel', 'PHP', 'RAG & LLM', 'Recommender Systems', 'REST API'],
  },
  {
    category: 'Database & Cloud',
    skills: ['PostgreSQL', 'Supabase', 'MySQL', 'ChromaDB', 'AWS', 'Google Cloud'],
  },
  {
    category: 'Product & Operations',
    skills: [
      'Systems Analysis',
      'RBAC & Security',
      'API Integration',
      'Operations Management',
      'Problem Solving',
      'Customer Support',
    ],
  },
];
