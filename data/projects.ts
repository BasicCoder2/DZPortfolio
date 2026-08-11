import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'lmmu-governance-admissions', slug: 'lmmu-governance-admissions', title: 'LMMU Governance / Admissions Platform', shortTitle: 'LMMU Admissions', category: 'Enterprise System',
    description: 'Institutional admissions and governance workflows brought together in a structured digital platform.',
    longDescription: 'A confidential institutional platform focused on admissions workflows, applicant ranking, advanced standing, and administration.',
    tags: ['Laravel', 'React', 'Inertia.js', 'Tailwind', 'MySQL'], href: '/projects/lmmu-governance-admissions', featured: true, status: 'completed', date: '2024', coverImage: '/images/projects/lmmu-governance-admissions.svg',
    caseStudy: { overview: 'Content pending final project documentation.', problem: 'Content pending final project documentation.', role: 'Content pending final project documentation.', solution: 'Content pending final project documentation.', architecture: 'Content pending final project documentation.', decisions: ['Content pending final project documentation.'], challenges: 'Content pending final project documentation.', outcome: 'Content pending final project documentation.', reflection: 'Content pending final project documentation.' },
  },
  {
    id: 'fase-plaza', slug: 'fase-plaza', title: 'FASE Plaza Platform', shortTitle: 'FASE Plaza', category: 'Commercial Platform',
    description: 'A business and community platform supporting membership, content, governance, notifications, and digital operations.',
    tags: ['PHP', 'WordPress', 'Membership', 'Notifications'], href: '/projects/fase-plaza', featured: true, status: 'completed', date: '2023', coverImage: '/images/projects/fase-plaza.svg',
    caseStudy: { overview: 'Content pending final project documentation.', problem: 'Content pending final project documentation.', role: 'Content pending final project documentation.', solution: 'Content pending final project documentation.', architecture: 'Content pending final project documentation.', decisions: ['Content pending final project documentation.'], challenges: 'Content pending final project documentation.', outcome: 'Content pending final project documentation.', reflection: 'Content pending final project documentation.' },
  },
  {
    id: 'uka-smart-home', slug: 'uka-smart-home', title: 'Uka Smart Home System', shortTitle: 'Uka Smart Home', category: 'AI / IoT',
    description: 'An AI-powered assistive smart-home system designed for visually impaired users.', tags: ['Flutter', 'Python', 'YOLO', 'TensorFlow Lite', 'Vosk', 'MQTT', 'ESP32'], href: '/projects/uka-smart-home', featured: true, status: 'in-progress', date: '2024', coverImage: '/images/projects/uka-smart-home.svg',
    caseStudy: { overview: 'Content pending final project documentation.', problem: 'Content pending final project documentation.', role: 'Content pending final project documentation.', solution: 'Content pending final project documentation.', architecture: 'Content pending final project documentation.', decisions: ['Content pending final project documentation.'], challenges: 'Content pending final project documentation.', outcome: 'Content pending final project documentation.', reflection: 'Content pending final project documentation.' },
  },
  {
    id: 'loan-tracking', slug: 'loan-tracking', title: 'Loan Tracking Application', shortTitle: 'Loan Tracking', category: 'Mobile Application',
    description: 'A mobile workflow for tracking loans, backed by Firebase and PDF reporting.', tags: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'PDF reporting'], href: '/projects/loan-tracking', featured: false, status: 'completed', date: '2023', coverImage: '/images/projects/loan-tracking.svg',
    caseStudy: { overview: 'Content pending final project documentation.', problem: 'Content pending final project documentation.', role: 'Content pending final project documentation.', solution: 'Content pending final project documentation.', architecture: 'Content pending final project documentation.', decisions: ['Content pending final project documentation.'], challenges: 'Content pending final project documentation.', outcome: 'Content pending final project documentation.', reflection: 'Content pending final project documentation.' },
  },
]

export function getProject(slug: string) { return projects.find((project) => project.slug === slug) }
