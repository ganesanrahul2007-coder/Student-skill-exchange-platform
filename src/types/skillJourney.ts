import { UserProfile } from './user';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ResourceItem {
  title: string;
  type: 'documentation' | 'tutorial' | 'interactive' | 'cheat-sheet';
  source: string;
  url?: string;
  description: string;
}

export interface PracticeActivity {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  expectedOutcome: string;
  deliverable: string;
}

export interface LearningMilestone {
  id: string;
  stepNumber: number;
  title: string;
  targetLevel: SkillLevel;
  summary: string;
  topics: string[];
  resources: ResourceItem[];
  practiceActivity: PracticeActivity;
  skillsNeeded: string[];
  completed: boolean;
  matchedPartner?: {
    id: string;
    name: string;
    college: string;
    avatar_url: string;
    skill_offered: string;
    match_score: number;
  };
}

export interface SkillGapAnalysis {
  targetSkill: string;
  currentLevel: SkillLevel;
  targetGoal: string;
  identifiedGaps: string[];
  strengths: string[];
  recommendedNextTopics: string[];
  difficultyRating: 'Accessible' | 'Moderate' | 'Challenging';
  estimatedTimeToGoal: string;
  keyConceptsToMaster: string[];
}

export interface PersonalizedLearningPath {
  id: string;
  studentId: string;
  targetSkill: string;
  currentLevel: SkillLevel;
  learningGoal: string;
  gapAnalysis: SkillGapAnalysis;
  milestones: LearningMilestone[];
  continuousImprovementGuidance: string;
  created_at: string;
  updated_at: string;
  overallProgressPercent: number;
}
