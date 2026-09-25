import { Skill, SkillCategory } from '../types/skill';
import { MOCK_SKILLS, SKILL_CATEGORIES } from '../data/mockSkills';

const CUSTOM_SKILLS_KEY = 'skill_exchange_custom_skills';

export const skillService = {
  getAllSkills(): Skill[] {
    try {
      const stored = localStorage.getItem(CUSTOM_SKILLS_KEY);
      const custom: Skill[] = stored ? JSON.parse(stored) : [];
      return [...MOCK_SKILLS, ...custom];
    } catch {
      return MOCK_SKILLS;
    }
  },

  getCategories(): SkillCategory[] {
    return SKILL_CATEGORIES;
  },

  getSkillsByCategory(category: SkillCategory): Skill[] {
    return this.getAllSkills().filter((s) => s.category === category);
  },

  searchSkills(query: string): Skill[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAllSkills();
    return this.getAllSkills().filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  },

  addSkill(name: string, category: SkillCategory = 'Programming & Tech'): Skill {
    const skills = this.getAllSkills();
    const existing = skills.find((s) => s.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) return existing;

    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: name.trim(),
      category,
      created_at: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem(CUSTOM_SKILLS_KEY);
      const custom: Skill[] = stored ? JSON.parse(stored) : [];
      custom.push(newSkill);
      localStorage.setItem(CUSTOM_SKILLS_KEY, JSON.stringify(custom));
    } catch {
      // ignore
    }

    return newSkill;
  },
};
