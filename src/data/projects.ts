import type { Project } from './types';

export const projectsData: Project[] = [
  {
    id: 'jembertrip',
    title: 'JemberTrip – AI-Based Tourism Recommendation System',
    date: 'Dec 2025 – Present',
    company: 'Universitas Muhammadiyah Jember',
    description: 'Content-based filtering tourism recommender for Jember using K-Nearest Neighbors (KNN) with cosine similarity and transformer-based embeddings, for personalized, item-based recommendations. Python backend + React frontend.',
    skills: ['Artificial Intelligence (AI)', 'Recommender Systems', 'Python', 'React'],
    liveUrl: 'https://jembertrip.vercel.app/',
    tags: [],
    images: [
      '/projects/jembertrip/3.png',
      '/projects/jembertrip/1.png',
      '/projects/jembertrip/2.png',
      '/projects/jembertrip/4.png'
    ]
  },
  {
    id: 'jember-rag-chatbot',
    title: 'Jember RAG Chatbot – Local Knowledge Assistant',
    date: 'Dec 2025 – Present',
    company: 'Universitas Muhammadiyah Jember',
    description: 'RAG chatbot for verified information about the Jember region; semantic search + contextual prompt engineering to stay within defined geographic knowledge boundaries; embedding-based retrieval for document QA.',
    skills: ['Artificial Intelligence (AI)', 'Natural Language Processing (NLP)', 'RAG'],
    tags: [],
    images: [
      '/projects/jember-rag-chatbot/1.png',
      '/projects/jember-rag-chatbot/2.png'
    ]
  },
  {
    id: 'kakyo-lesson',
    title: 'Kakyo Lesson — EdTech Management & Student Progress System',
    date: 'Dec 2025 – Jan 2026',
    company: 'Freelance / Independent Business',
    description: 'Web-based LMS for a music academy, built with Vue.js. Multi-role dashboard (Admin/Instructor/Student): automated attendance tracking, integrated financial reporting, real-time invoice/payment status, interactive learning-progress tracker replacing paper records with digital video storage and assignment notification triggers.',
    skills: ['Vue.js', 'LMS', 'Web Application Development'],
    tags: [],
    images: [
      '/projects/kakyo-lesson/1.png'
    ]
  },
  {
    id: 'school-attendance',
    title: 'School Attendance System with WhatsApp Notification',
    date: 'Dec 2025 – Present',
    company: 'Universitas Muhammadiyah Jember',
    description: 'Web-based attendance system that auto-notifies parents via WhatsApp when a student is absent/late.',
    skills: ['Laravel', 'Web Application Development', 'API Integration'],
    tags: [],
    images: [
      '/projects/school-attendance/1.png',
      '/projects/school-attendance/2.png',
      '/projects/school-attendance/3.png'
    ]
  },
  {
    id: 'drug-inventory-system',
    title: 'Drug Inventory Information System – Puskesmas Wuluhan',
    date: 'Nov 2025 – Jan 2026',
    company: 'Puskesmas Wuluhan',
    description: 'Developed an inventory management information system to monitor drug stock across multiple departments, enabling accurate monitoring of medicine availability for daily healthcare operations.',
    skills: ['Inventory Management', 'Information Systems', 'Systems Analysis'],
    tags: ['Internship project'],
    images: [
      '/projects/drug-inventory-system/1.png',
      '/projects/drug-inventory-system/2.png'
    ]
  },
  {
    id: 'mis-pt-antosa',
    title: 'Management Information System – PT Antosa Arsitek',
    date: 'Jun 2025 – Aug 2025',
    company: 'PT Antosa Arsitek',
    description: 'Built a multi-role system (admin, client, project team) for residential construction projects to submit requests, review progress, and request design revisions.',
    skills: ['Information Systems', 'Systems Analysis', 'PHP'],
    tags: ['Internship project'],
    images: [
      '/projects/mis-pt-antosa/1.png'
    ]
  },
  {
    id: 'antrokan-waterfall',
    title: 'Antrokan Waterfall — E-Tourism Discovery Platform',
    date: '2025',
    description: 'Vue.js web portfolio for Antrokan Waterfall tourism, built during a community service (KKN) project — travel info, visual galleries, site accessibility for out-of-region visitors.',
    skills: ['Vue.js', 'Web Development'],
    tags: [],
    images: [
      '/projects/antrokan-waterfall/1.png',
      '/projects/antrokan-waterfall/2.png',
      '/projects/antrokan-waterfall/3.png',
      '/projects/antrokan-waterfall/4.png',
      '/projects/antrokan-waterfall/5.png',
      '/projects/antrokan-waterfall/6.png'
    ]
  },
  {
    id: 'kopi-malas-tanggul',
    title: 'Kopi Malas Tanggul — UMKM Digitalization Platform',
    date: '2025',
    description: 'Vue.js responsive web portfolio for a local coffee business in Tanggul, Jember (university KKN project) — digitizes marketing, enhances brand visibility, streamlines product promotion for SMEs.',
    skills: ['Vue.js', 'Web Development'],
    tags: [],
    images: [
      '/projects/kopi-malas-tanggul/1.png',
      '/projects/kopi-malas-tanggul/2.png',
      '/projects/kopi-malas-tanggul/3.png',
      '/projects/kopi-malas-tanggul/4.png',
      '/projects/kopi-malas-tanggul/5.png'
    ]
  }
];
