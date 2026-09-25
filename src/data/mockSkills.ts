import { Skill, SkillCategory } from '../types/skill';

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Programming & Tech',
  'Design & Creative',
  'Data & AI',
  'Media & Production',
  'Business & Marketing',
  'Languages & Communication',
  'Academics & Science',
];

export const MOCK_SKILLS: Skill[] = [
  // Programming & Tech
  { id: 'sk-1', name: 'Python', category: 'Programming & Tech' },
  { id: 'sk-2', name: 'JavaScript', category: 'Programming & Tech' },
  { id: 'sk-3', name: 'TypeScript', category: 'Programming & Tech' },
  { id: 'sk-4', name: 'React', category: 'Programming & Tech' },
  { id: 'sk-5', name: 'Java', category: 'Programming & Tech' },
  { id: 'sk-6', name: 'Flutter', category: 'Programming & Tech' },
  { id: 'sk-7', name: 'Next.js', category: 'Programming & Tech' },
  { id: 'sk-8', name: 'Docker & DevOps', category: 'Programming & Tech' },
  { id: 'sk-9', name: 'C++', category: 'Programming & Tech' },
  { id: 'sk-10', name: 'FastAPI', category: 'Programming & Tech' },
  
  // Design & Creative
  { id: 'sk-11', name: 'UI/UX Design', category: 'Design & Creative' },
  { id: 'sk-12', name: 'Figma', category: 'Design & Creative' },
  { id: 'sk-13', name: 'Graphic Design', category: 'Design & Creative' },
  { id: 'sk-14', name: 'Design Systems', category: 'Design & Creative' },
  { id: 'sk-15', name: '3D Modeling (Blender)', category: 'Design & Creative' },
  { id: 'sk-16', name: 'Illustration', category: 'Design & Creative' },

  // Data & AI
  { id: 'sk-17', name: 'Data Science', category: 'Data & AI' },
  { id: 'sk-18', name: 'Machine Learning', category: 'Data & AI' },
  { id: 'sk-19', name: 'PyTorch', category: 'Data & AI' },
  { id: 'sk-20', name: 'SQL & Databases', category: 'Data & AI' },
  { id: 'sk-21', name: 'Generative AI & LLMs', category: 'Data & AI' },
  { id: 'sk-22', name: 'Data Visualization', category: 'Data & AI' },

  // Media & Production
  { id: 'sk-23', name: 'Video Editing', category: 'Media & Production' },
  { id: 'sk-24', name: 'Photography', category: 'Media & Production' },
  { id: 'sk-25', name: 'Premiere Pro', category: 'Media & Production' },
  { id: 'sk-26', name: 'Motion Graphics', category: 'Media & Production' },
  { id: 'sk-27', name: 'Audio Production', category: 'Media & Production' },

  // Business & Marketing
  { id: 'sk-28', name: 'Digital Marketing', category: 'Business & Marketing' },
  { id: 'sk-29', name: 'SEO & Growth', category: 'Business & Marketing' },
  { id: 'sk-30', name: 'Product Management', category: 'Business & Marketing' },
  { id: 'sk-31', name: 'Financial Modeling', category: 'Business & Marketing' },

  // Languages & Communication
  { id: 'sk-32', name: 'Public Speaking', category: 'Languages & Communication' },
  { id: 'sk-33', name: 'Pitch Deck Presentation', category: 'Languages & Communication' },
  { id: 'sk-34', name: 'Technical Writing', category: 'Languages & Communication' },
  { id: 'sk-35', name: 'Spanish Fluency', category: 'Languages & Communication' },
  { id: 'sk-36', name: 'Japanese (JLPT N3)', category: 'Languages & Communication' },

  // Academics
  { id: 'sk-37', name: 'Linear Algebra', category: 'Academics & Science' },
  { id: 'sk-38', name: 'Calculus III', category: 'Academics & Science' },
  { id: 'sk-39', name: 'DSA & Algorithms', category: 'Academics & Science' },
];
