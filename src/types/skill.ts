export type SkillCategory =
  | 'Programming & Tech'
  | 'Design & Creative'
  | 'Data & AI'
  | 'Media & Production'
  | 'Business & Marketing'
  | 'Languages & Communication'
  | 'Academics & Science';

export type SkillType = 'OFFERED' | 'WANTED';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  created_at?: string;
}

export interface UserSkillItem {
  id?: string;
  name: string;
  category?: SkillCategory;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
}
