export interface Profile {
  name: string;
  pronouns: string;
  headline: string[];
  location: string;
  about: string[];
  stats: {
    experience: string;
    location: string;
    languages: string;
    education: string;
  };
  socials: {
    linkedin: string | null;
    github: string | null;
    email: string | null;
    phone: string | null;
    resume: string | null;
  };
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  type: string;
  date: string;
  location: string;
  bullets: string[];
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  date: string;
  company?: string;
  description: string;
  skills: string[];
  liveUrl?: string;
  tags?: string[];
  imagePlaceholder?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  expiry?: string;
  credentialId?: string;
  skills: string[];
  image?: string;
}
