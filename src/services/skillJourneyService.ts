import { UserProfile } from '../types/user';
import {
  SkillLevel,
  SkillGapAnalysis,
  PersonalizedLearningPath,
  LearningMilestone,
  ResourceItem,
  PracticeActivity,
} from '../types/skillJourney';
import { ragService } from './ragService';
import { authService } from './authService';
import { calculateMatchScore } from './matchingService';

const JOURNEY_STORAGE_KEY = 'skill_exchange_learning_journeys_v1';

export const skillJourneyService = {
  /**
   * Retrieves stored learning paths for a student
   */
  getStoredJourneys(): Record<string, PersonalizedLearningPath[]> {
    try {
      const stored = localStorage.getItem(JOURNEY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  saveStoredJourneys(data: Record<string, PersonalizedLearningPath[]>): void {
    try {
      localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  },

  /**
   * Analyzes skill gaps for a student based on their profile, current level, and target goals
   * Uses RAG retrieval to pull relevant curricula rules and prerequisite competency graphs.
   */
  analyzeSkillGap(
    student: UserProfile,
    targetSkill: string,
    targetGoal?: string
  ): SkillGapAnalysis {
    const currentLevel: SkillLevel =
      student.skill_levels?.[targetSkill] || 'Beginner';
    
    const goal = targetGoal || (student.learning_goals?.[0] || `Master ${targetSkill}`);

    // Retrieve RAG context chunks matching this skill and goal
    const query = `${targetSkill} ${goal} roadmap prerequisites learning path`;
    const retrieved = ragService.retrieveContext(query, 2);

    const normSkill = targetSkill.toLowerCase();
    const normGoal = goal.toLowerCase();

    let identifiedGaps: string[] = [];
    let strengths: string[] = [];
    let recommendedNextTopics: string[] = [];
    let difficultyRating: 'Accessible' | 'Moderate' | 'Challenging' = 'Moderate';
    let estimatedTimeToGoal = '4 - 6 weeks (4 hrs/week)';
    let keyConceptsToMaster: string[] = [];

    // Domain-specific RAG knowledge synthesis
    if (normSkill.includes('python') || normGoal.includes('machine learning') || normSkill.includes('machine learning')) {
      if (currentLevel === 'Beginner') {
        identifiedGaps = [
          'NumPy multi-dimensional arrays & vectorization',
          'Pandas DataFrames, data cleaning & aggregations',
          'Descriptive statistics & correlation matrices',
          'Supervised learning workflows with Scikit-Learn',
        ];
        strengths = ['Basic Python syntax', 'Variables & loops', 'Problem solving motivation'];
        recommendedNextTopics = [
          'Python List Comprehensions & Lambdas',
          'NumPy Matrix Operations',
          'Pandas CSV ingestion & missing values',
        ];
        difficultyRating = 'Moderate';
        estimatedTimeToGoal = '5 - 7 weeks';
        keyConceptsToMaster = ['Vectorized Computing', 'Data Wrangling', 'Model Train/Test Splits', 'Overfitting Prevention'];
      } else if (currentLevel === 'Intermediate') {
        identifiedGaps = [
          'PyTorch neural network architectures (Linear, Conv2D, Dropout)',
          'Hyperparameter tuning & cross-validation strategies',
          'Model evaluation metrics (ROC-AUC, F1-Score, Confusion Matrix)',
        ];
        strengths = ['Solid Pandas data handling', 'Classical regression & classification', 'Matplotlib visualizations'];
        recommendedNextTopics = ['Tensors in PyTorch', 'Loss Functions & Optimizers', 'Model Serving with FastAPI'];
        difficultyRating = 'Challenging';
        estimatedTimeToGoal = '6 - 8 weeks';
        keyConceptsToMaster = ['Backpropagation', 'Gradient Descent', 'Feature Engineering', 'Loss Minimization'];
      } else {
        identifiedGaps = ['Transformer architectures', 'MLOps pipelines', 'Distributed model training'];
        strengths = ['End-to-end model training', 'Deep learning fundamentals'];
        recommendedNextTopics = ['HuggingFace fine-tuning', 'Vector databases & embeddings', 'ONNX deployment'];
        difficultyRating = 'Challenging';
        estimatedTimeToGoal = '8+ weeks';
        keyConceptsToMaster = ['Attention Mechanisms', 'Quantization', 'Model Latency Optimization'];
      }
    } else if (normSkill.includes('design') || normSkill.includes('ui') || normSkill.includes('ux') || normSkill.includes('figma')) {
      if (currentLevel === 'Beginner') {
        identifiedGaps = [
          'Figma Auto-Layout 5.0 and responsive frame constraints',
          '8-point spatial grid systems and typography hierarchical scales',
          'Color contrast WCAG accessibility standards (AA/AAA)',
          'Component variants, properties, and boolean flags',
        ];
        strengths = ['Visual curiosity', 'Aesthetic appreciation', 'User empathy'];
        recommendedNextTopics = [
          'Figma Auto-Layout shortcuts & nesting',
          'Typography Pairing & Line Height rules',
          'Creating Reusable Button Variants',
        ];
        difficultyRating = 'Accessible';
        estimatedTimeToGoal = '3 - 5 weeks';
        keyConceptsToMaster = ['Auto-Layout', 'Design Tokens', 'Visual Hierarchy', 'Component Variants'];
      } else {
        identifiedGaps = [
          'Scalable multi-platform design systems with token variables',
          'User research interview synthesis and heuristic evaluation',
          'Interactive micro-interactions & smart-animate prototyping',
        ];
        strengths = ['Solid Figma proficiency', 'Wireframing speed', 'Component creation'];
        recommendedNextTopics = [
          'Figma Variables (Color, Spacing, Modes)',
          'Interactive State Management',
          'Usability Testing Protocol',
        ];
        difficultyRating = 'Moderate';
        estimatedTimeToGoal = '4 - 6 weeks';
        keyConceptsToMaster = ['Design System Tokens', 'Heuristic Audits', 'Usability Metrics'];
      }
    } else if (normSkill.includes('react') || normSkill.includes('web') || normSkill.includes('javascript')) {
      identifiedGaps = [
        'React state management lifecycle & custom hooks',
        'TypeScript interface typing and generic component props',
        'Asynchronous data fetching with caching & error boundaries',
        'Tailwind CSS layout patterns and mobile-first responsiveness',
      ];
      strengths = ['HTML/CSS fundamentals', 'Basic JavaScript ES6 syntax'];
      recommendedNextTopics = [
        'React useState and useEffect mastery',
        'TypeScript with React Props',
        'Tailwind Grid & Flexbox patterns',
      ];
      difficultyRating = 'Moderate';
      estimatedTimeToGoal = '4 - 6 weeks';
      keyConceptsToMaster = ['Declarative UI', 'Reactivity & Immutability', 'Component Props Contracts'];
    } else {
      identifiedGaps = [
        `Core foundational syntax and principles of ${targetSkill}`,
        `Intermediate problem solving and design patterns in ${targetSkill}`,
        `Practical portfolio-ready project implementation`,
      ];
      strengths = ['Eager campus learner', 'Transferable academic skills'];
      recommendedNextTopics = [
        `Introduction to ${targetSkill} architecture`,
        `Hands-on guided walkthrough`,
        `Peer review with campus mentor`,
      ];
      difficultyRating = 'Moderate';
      estimatedTimeToGoal = '4 weeks';
      keyConceptsToMaster = ['Core Paradigms', 'Debugging & Testing', 'Best Practices'];
    }

    return {
      targetSkill,
      currentLevel,
      targetGoal: goal,
      identifiedGaps,
      strengths,
      recommendedNextTopics,
      difficultyRating,
      estimatedTimeToGoal,
      keyConceptsToMaster,
    };
  },

  /**
   * Generates a personalized learning pathway with milestones, practice exercises,
   * curated learning resources, and matched campus mentors for each gap.
   */
  generateLearningPath(
    student: UserProfile,
    targetSkill: string,
    targetGoal?: string
  ): PersonalizedLearningPath {
    const gapAnalysis = this.analyzeSkillGap(student, targetSkill, targetGoal);
    const allStudents = authService.getAllUsers().filter((u) => u.id !== student.id);

    // Helper to find a registered campus student who teaches this or related skill
    const findPartnerForSkill = (skillQuery: string) => {
      const candidates = allStudents.filter((s) =>
        s.skills_offered.some(
          (o) =>
            o.toLowerCase().includes(skillQuery.toLowerCase()) ||
            skillQuery.toLowerCase().includes(o.toLowerCase())
        )
      );
      if (candidates.length === 0) return undefined;

      // Pick the best match score with current student
      const sorted = candidates.sort(
        (a, b) => calculateMatchScore(student, b).totalScore - calculateMatchScore(student, a).totalScore
      );
      const best = sorted[0];
      return {
        id: best.id,
        name: best.name,
        college: best.college,
        avatar_url: best.avatar_url,
        skill_offered: best.skills_offered[0] || skillQuery,
        match_score: calculateMatchScore(student, best).totalScore,
      };
    };

    let milestones: LearningMilestone[] = [];

    const normSkill = targetSkill.toLowerCase();

    if (normSkill.includes('python') || normSkill.includes('machine learning')) {
      milestones = [
        {
          id: 'ms-1',
          stepNumber: 1,
          title: 'Python Data Structures & Numerical Arrays with NumPy',
          targetLevel: 'Beginner',
          summary: 'Transition from basic syntax to numerical vectorization and matrix manipulation.',
          topics: ['List Comprehensions', 'NumPy ndarray creation', 'Array slicing & broadcasting', 'Vectorized math operations'],
          resources: [
            {
              title: 'NumPy Quickstart for Campus Developers',
              type: 'documentation',
              source: 'numpy.org/doc/stable',
              description: 'Official interactive tutorial on multidimensional arrays and vectorization.',
            },
            {
              title: 'Python for Data Analysis Chapter 4',
              type: 'tutorial',
              source: 'Wes McKinney O\'Reilly Reference',
              description: 'Clear explanations on array orientation and boolean indexing.',
            },
          ],
          practiceActivity: {
            id: 'pa-1',
            title: 'Build a Multi-Student Grade Statistics Engine',
            description: 'Write a script using NumPy that takes an array of 50 student test scores across 4 semesters, normalizes curves using z-score standardization, and outputs class percentiles.',
            estimatedHours: 4,
            expectedOutcome: 'Understanding vector math without slow Python for-loops.',
            deliverable: 'grade_engine.py script with test assertions.',
          },
          skillsNeeded: ['Python', 'NumPy'],
          completed: false,
          matchedPartner: findPartnerForSkill('Python'),
        },
        {
          id: 'ms-2',
          stepNumber: 2,
          title: 'Data Wrangling & Exploratory Analysis with Pandas',
          targetLevel: 'Intermediate',
          summary: 'Clean messy real-world datasets, impute missing values, and group data for insights.',
          topics: ['DataFrames & Series', 'Handling NaN & Null values', 'GroupBy aggregations & pivots', 'Time series & string operations'],
          resources: [
            {
              title: '10 Minutes to Pandas',
              type: 'cheat-sheet',
              source: 'pandas.pydata.org',
              description: 'Compact reference covering filtering, merging, and reshaping DataFrames.',
            },
            {
              title: 'Kaggle Micro-Course: Pandas',
              type: 'interactive',
              source: 'kaggle.com/learn/pandas',
              description: 'Free interactive browser notebooks with automated checking.',
            },
          ],
          practiceActivity: {
            id: 'pa-2',
            title: 'Campus Housing or Hackathon Dataset EDA Report',
            description: 'Download a public campus dataset, clean 10+ columns, remove duplicates, handle outliers, and visualize correlations using Seaborn heatmaps.',
            estimatedHours: 6,
            expectedOutcome: 'Fluency in filtering, joining, and summarizing data frames.',
            deliverable: 'eda_notebook.ipynb with annotated findings and charts.',
          },
          skillsNeeded: ['Data Science', 'Pandas'],
          completed: false,
          matchedPartner: findPartnerForSkill('Data Science'),
        },
        {
          id: 'ms-3',
          stepNumber: 3,
          title: 'Supervised Learning Algorithms with Scikit-Learn',
          targetLevel: 'Intermediate',
          summary: 'Build, evaluate, and tune predictive machine learning models.',
          topics: ['Feature scaling & encoding', 'Train/Test split & Cross-Validation', 'Linear Regression & Random Forests', 'Evaluation Metrics (RMSE, Accuracy, F1)'],
          resources: [
            {
              title: 'Scikit-Learn Model Selection Guide',
              type: 'documentation',
              source: 'scikit-learn.org',
              description: 'Flowchart helping select the right estimator for classification vs regression.',
            },
          ],
          practiceActivity: {
            id: 'pa-3',
            title: 'Predict Student Course Performance Classifier',
            description: 'Train a Random Forest model to predict student final grades based on study hours, attendance, and assignment scores. Tune max_depth using GridSearchCV.',
            estimatedHours: 8,
            expectedOutcome: 'Understanding the complete machine learning pipeline from features to evaluation.',
            deliverable: 'predictive_model.py with confusion matrix plot.',
          },
          skillsNeeded: ['Machine Learning', 'Python'],
          completed: false,
          matchedPartner: findPartnerForSkill('Machine Learning'),
        },
      ];
    } else if (normSkill.includes('ui') || normSkill.includes('design') || normSkill.includes('figma')) {
      milestones = [
        {
          id: 'ms-ui-1',
          stepNumber: 1,
          title: 'Figma Auto-Layout & Spacing Systems',
          targetLevel: 'Beginner',
          summary: 'Master responsive UI layout mechanics and visual spacing standards.',
          topics: ['Auto-Layout 5.0 padding & gaps', 'Horizontal/Vertical direction & wrap', 'Fixed vs Hug vs Fill container resizing', '8pt design grid system'],
          resources: [
            {
              title: 'Figma Auto-Layout Playground',
              type: 'interactive',
              source: 'figma.com/@figma',
              description: 'Official Figma community file with hands-on exercises for constraints and auto-layout.',
            },
            {
              title: 'Refactoring UI: Visual Hierarchy',
              type: 'tutorial',
              source: 'Adam Wathan & Steve Schoger',
              description: 'Practical tactics for clean typography, spacing, and subtle contrast.',
            },
          ],
          practiceActivity: {
            id: 'pa-ui-1',
            title: 'Design an Auto-Layout Campus Study Group Card',
            description: 'Create a responsive card component containing member avatars, category badges, date metadata, and a primary action button that dynamically resizes cleanly from 280px to 480px width.',
            estimatedHours: 3,
            expectedOutcome: 'Flawless control over Auto-Layout constraints and fluid resizing.',
            deliverable: 'Figma share link or frame export with Auto-Layout applied.',
          },
          skillsNeeded: ['UI/UX Design', 'Figma'],
          completed: false,
          matchedPartner: findPartnerForSkill('UI/UX Design'),
        },
        {
          id: 'ms-ui-2',
          stepNumber: 2,
          title: 'Design Tokens, Styles & Reusable Component Variants',
          targetLevel: 'Intermediate',
          summary: 'Build scalable design systems with tokenized styles and multi-state variants.',
          topics: ['Color and typography styles', 'Component properties & boolean toggles', 'Hover, active, disabled variant states', 'Icon set integration'],
          resources: [
            {
              title: 'Design Systems Handbook',
              type: 'documentation',
              source: 'DesignBetter.co',
              description: 'Best practices for establishing tokens and component libraries.',
            },
          ],
          practiceActivity: {
            id: 'pa-ui-2',
            title: 'Build a 10-Piece UI Component Kit',
            description: 'Design a reusable UI kit featuring Buttons (3 sizes, 4 variants), Input Fields (error, focused, valid), and Notification Toasts with smooth interactive states.',
            estimatedHours: 5,
            expectedOutcome: 'Understanding how design systems accelerate product development.',
            deliverable: 'Published Figma local component library.',
          },
          skillsNeeded: ['Design Systems', 'Figma'],
          completed: false,
          matchedPartner: findPartnerForSkill('Design Systems'),
        },
        {
          id: 'ms-ui-3',
          stepNumber: 3,
          title: 'User Flows, Wireframing & Usability Testing',
          targetLevel: 'Advanced',
          summary: 'Validate design decisions with real users and construct interactive click-through prototypes.',
          topics: ['Information architecture & user journey mapping', 'Low-fidelity wireframing', 'Interactive smart-animate prototyping', 'Conducting 5-user think-aloud tests'],
          resources: [
            {
              title: 'Nielsen Norman Group: Heuristic Evaluation',
              type: 'documentation',
              source: 'nngroup.com',
              description: 'The 10 foundational usability heuristics for user interface design.',
            },
          ],
          practiceActivity: {
            id: 'pa-ui-3',
            title: 'End-to-End Skill Exchange App Flow & User Test',
            description: 'Prototype a 4-screen flow for finding a partner, reviewing their profile, and sending a trade request. Record a peer walkthrough session and document 3 actionable usability fixes.',
            estimatedHours: 7,
            expectedOutcome: 'Experience designing for real humans and validating usability.',
            deliverable: 'Interactive Figma prototype URL and 1-page heuristic audit report.',
          },
          skillsNeeded: ['UI/UX Design', 'User Research'],
          completed: false,
          matchedPartner: findPartnerForSkill('UI/UX Design'),
        },
      ];
    } else {
      milestones = [
        {
          id: 'ms-gen-1',
          stepNumber: 1,
          title: `Foundations & Core Principles of ${targetSkill}`,
          targetLevel: 'Beginner',
          summary: `Establish rock-solid understanding of essential concepts and toolchains.`,
          topics: [`Introduction to ${targetSkill} ecosystem`, 'Core syntax and design conventions', 'Development environment setup'],
          resources: [
            {
              title: `${targetSkill} Getting Started Guide`,
              type: 'documentation',
              source: 'Official Docs',
              description: 'Essential documentation covering syntax and first steps.',
            },
          ],
          practiceActivity: {
            id: 'pa-gen-1',
            title: `Build Your First Guided ${targetSkill} Mini-Project`,
            description: `Create a clean working prototype applying the first 3 core principles of ${targetSkill}.`,
            estimatedHours: 4,
            expectedOutcome: `Hands-on familiarity with fundamentals.`,
            deliverable: `Completed code repository or design artifact.`,
          },
          skillsNeeded: [targetSkill],
          completed: false,
          matchedPartner: findPartnerForSkill(targetSkill),
        },
        {
          id: 'ms-gen-2',
          stepNumber: 2,
          title: `Intermediate Problem Solving & Project Architecture`,
          targetLevel: 'Intermediate',
          summary: `Combine multiple concepts into a production-grade student showcase project.`,
          topics: ['Modular code structure', 'Error handling & edge cases', 'Best practices and performance'],
          resources: [
            {
              title: `${targetSkill} Best Practices Reference`,
              type: 'tutorial',
              source: 'Community Guide',
              description: 'Architectural patterns used by professional campus teams.',
            },
          ],
          practiceActivity: {
            id: 'pa-gen-2',
            title: `Collaborative Milestone Challenge with Campus Peer`,
            description: `Schedule a 1-hour pairing session with an exchange partner to review your deliverable and refactor for performance.`,
            estimatedHours: 6,
            expectedOutcome: `Constructive peer feedback and code/design review experience.`,
            deliverable: `Refactored deliverable with peer review notes.`,
          },
          skillsNeeded: [targetSkill],
          completed: false,
          matchedPartner: findPartnerForSkill(targetSkill),
        },
      ];
    }

    // Check which milestones student has already completed
    const completedIds = new Set(student.completed_milestones || []);
    milestones = milestones.map((m) => ({
      ...m,
      completed: completedIds.has(m.id),
    }));

    const completedCount = milestones.filter((m) => m.completed).length;
    const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

    const path: PersonalizedLearningPath = {
      id: `path-${student.id}-${targetSkill.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      studentId: student.id,
      targetSkill,
      currentLevel,
      learningGoal: gapAnalysis.targetGoal,
      gapAnalysis,
      milestones,
      continuousImprovementGuidance:
        'Continuous improvement tip: Share your code or Figma links with your exchange partner before each weekly session. Explaining what you built tests your true conceptual mastery!',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      overallProgressPercent: progressPercent,
    };

    // Store in journeys storage
    const all = this.getStoredJourneys();
    const userJourneys = all[student.id] || [];
    const existingIndex = userJourneys.findIndex((j) => j.targetSkill.toLowerCase() === targetSkill.toLowerCase());
    if (existingIndex >= 0) {
      userJourneys[existingIndex] = path;
    } else {
      userJourneys.push(path);
    }
    all[student.id] = userJourneys;
    this.saveStoredJourneys(all);

    return path;
  },

  /**
   * Retrieves active or default learning path for student
   */
  getActiveLearningPath(student: UserProfile): PersonalizedLearningPath {
    const targetSkill =
      student.active_learning_goal ||
      student.skills_wanted[0] ||
      (student.skills_offered[0] ? `Advanced ${student.skills_offered[0]}` : 'Python');
    
    return this.generateLearningPath(student, targetSkill);
  },

  /**
   * Toggles milestone completion state and updates student record
   */
  toggleMilestone(student: UserProfile, milestoneId: string): UserProfile {
    const currentCompleted = new Set(student.completed_milestones || []);
    if (currentCompleted.has(milestoneId)) {
      currentCompleted.delete(milestoneId);
    } else {
      currentCompleted.add(milestoneId);
    }

    const updatedProfile: UserProfile = {
      ...student,
      completed_milestones: Array.from(currentCompleted),
    };

    authService.saveCustomProfile(updatedProfile);
    return updatedProfile;
  },
};
