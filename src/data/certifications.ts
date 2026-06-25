import type { Certification } from './types';

export const certificationsData: Certification[] = [
  {
    id: 'aws-cert',
    title: 'AWS Certifications',
    issuer: 'Dicoding Academy',
    date: 'Jun 2026',
    expiry: 'Jun 2029',
    credentialId: '07Z676LJJPQR',
    skills: ['Artificial Intelligence (AI)'],
    image: '/dicoding.jpg'
  },
  {
    id: 'kiro-spec',
    title: 'Spec-Driven Development dengan Kiro',
    issuer: 'Dicoding Academy',
    date: '2026', // Add approx date
    skills: ['AI-assisted workflow', 'Spec-Driven Development'],
    image: '/dicoding.jpg'
  },
  {
    id: 'gcp-data',
    title: 'Google Cloud Data Analytic',
    issuer: 'Google Cloud Skills Boost',
    date: 'Jan 2026',
    expiry: 'Jan 2029',
    skills: ['Data Analysis', 'Back-End Web Development'],
    image: '/gc.jpg'
  },
  {
    id: 'dilesin-cert',
    title: 'Dilesin Academy Certifications',
    issuer: 'Dilesin',
    date: 'Aug 2024',
    skills: [],
    image: '/dilesin.jpg'
  },
  {
    id: 'gcp-cloud',
    title: 'Google Cloud Computing',
    issuer: 'Google',
    date: 'Jun 2025',
    skills: [],
    image: '/gca.jpg'
  }
];
