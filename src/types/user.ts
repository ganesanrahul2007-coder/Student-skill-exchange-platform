import { SkillType } from './skill';
import { SkillLevel } from './skillJourney';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  year: string; // e.g. "3rd Year", "Sophomore", "Final Year"
  bio: string;
  avatar_url: string;
  availability: string; // e.g. "Weekends & Evenings", "10-15 hrs/week"
  created_at: string;
  
  // Skills breakdown
  skills_offered: string[];
  skills_wanted: string[];
  rating: number;
  rating_count: number;
  exchanges_count: number;
  interests?: string[];
  github_or_portfolio?: string;

  // Integrated Skill Development & RAG Journey Attributes
  skill_levels?: Record<string, SkillLevel>; // e.g. { 'Python': 'Beginner', 'FastAPI': 'Intermediate' }
  learning_goals?: string[]; // e.g. ['Machine Learning', 'UI/UX Design Systems']
  active_learning_goal?: string; // current prioritized learning focus
  completed_milestones?: string[];
  skill_interests?: string[];
}

export interface UserSkillRecord {
  id: string;
  user_id: string;
  skill_id: string;
  type: SkillType;
  level?: SkillLevel;
  created_at?: string;
}

export interface MatchScoreDetails {
  totalScore: number;
  mutualExchangeBonus: boolean;
  matchingOfferedToWanted: string[];
  matchingWantedToOffered: string[];
  sameCollege: boolean;
  commonInterests: string[];
  explanation: string;
}
