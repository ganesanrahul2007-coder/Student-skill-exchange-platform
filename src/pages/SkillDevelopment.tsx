import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';
import { skillJourneyService } from '../services/skillJourneyService';
import { UserProfile } from '../types/user';
import { SkillLevel } from '../types/skillJourney';
import { SkillBadge } from '../components/SkillBadge';
import { SendRequestModal } from '../components/SendRequestModal';
import {
  Compass,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
  Target,
  BrainCircuit,
  Users,
  Send,
  ExternalLink,
  Award,
  Layers,
  HelpCircle,
  TrendingUp,
  FileCode,
  RotateCw,
} from 'lucide-react';

interface SkillDevelopmentProps {
  onNavigate: (page: string) => void;
  onSelectStudent: (student: UserProfile) => void;
}

export const SkillDevelopment: React.FC<SkillDevelopmentProps> = ({
  onNavigate,
  onSelectStudent,
}) => {
  const { user, updateProfile, allUsers } = useAuth();
  const { activeExchanges } = useExchange();

  // Active target skill selection
  const [selectedSkill, setSelectedSkill] = useState<string>(() => {
    return user?.active_learning_goal || user?.skills_wanted[0] || 'Python';
  });

  const [currentLevel, setCurrentLevel] = useState<SkillLevel>(() => {
    return user?.skill_levels?.[selectedSkill] || 'Beginner';
  });

  const [learningGoalInput, setLearningGoalInput] = useState<string>(() => {
    return user?.learning_goals?.[0] || 'Build Real-World Applications & Master Fundamentals';
  });

  const [requestTargetPartner, setRequestTargetPartner] = useState<UserProfile | null>(null);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-500 mb-4">Please log in to access your Skill Development Journey.</p>
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Generate RAG-powered learning path for active selected skill and level
  const learningPath = useMemo(() => {
    return skillJourneyService.generateLearningPath(user, selectedSkill, learningGoalInput);
  }, [user, selectedSkill, learningGoalInput]);

  const gapAnalysis = learningPath.gapAnalysis;

  // Handle changing level
  const handleLevelChange = (newLevel: SkillLevel) => {
    setCurrentLevel(newLevel);
    const updatedLevels = {
      ...(user.skill_levels || {}),
      [selectedSkill]: newLevel,
    };
    updateProfile({ skill_levels: updatedLevels });
  };

  // Handle changing target skill
  const handleSelectSkill = (skill: string) => {
    setSelectedSkill(skill);
    const lvl = user.skill_levels?.[skill] || 'Beginner';
    setCurrentLevel(lvl);
    updateProfile({ active_learning_goal: skill });
  };

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId: string) => {
    const updatedUser = skillJourneyService.toggleMilestone(user, milestoneId);
    updateProfile({ completed_milestones: updatedUser.completed_milestones });
  };

  // Available skills to assess: skills wanted + skills offered + standard common catalog
  const selectableSkills = Array.from(
    new Set([...user.skills_wanted, ...user.skills_offered, 'Python', 'UI/UX Design', 'Machine Learning', 'React'])
  );

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Workflow Stepper Navigation Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4" />
                  AI RAG Skill Development Hub
                </span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Continuous Learning
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                Your Skill Development Journey
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-2xl">
                Retrieval-Augmented Generation synthesizes your profile, current skill levels, and learning goals to diagnose gaps, recommend customized milestones, and pair you with campus mentors.
              </p>
            </div>

            {/* Overall Progress Widget */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:min-w-[200px] text-center shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 block mb-1">
                Pathway Progress
              </span>
              <div className="text-3xl font-black text-white">
                {learningPath.overallProgressPercent}%
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden mt-2">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${learningPath.overallProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Workflow Stepper Graphic */}
          <div className="pt-4 border-t border-white/10 hidden md:grid grid-cols-6 gap-2 text-center text-[11px] font-semibold text-indigo-200">
            <div className="bg-white/15 text-white py-1.5 px-2 rounded-lg">1. Student Profile</div>
            <div className="bg-white/15 text-white py-1.5 px-2 rounded-lg">2. Assessment</div>
            <div className="bg-white/15 text-white py-1.5 px-2 rounded-lg">3. Skill Gap</div>
            <div className="bg-white/15 text-white py-1.5 px-2 rounded-lg">4. Guidance</div>
            <div className="bg-white/15 text-white py-1.5 px-2 rounded-lg">5. Partner Match</div>
            <div className="bg-white/15 text-white py-1.5 px-2 rounded-lg">6. Exchange & Grow</div>
          </div>
        </div>
      </div>

      {/* 1 & 2. Skill Selection & Current Level Assessment */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>1. Skill Assessment & Target Selection</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select the skill you want to focus on and calibrate your current proficiency level.
            </p>
          </div>

          {/* Skill Selector Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {selectableSkills.map((sk) => (
              <button
                key={sk}
                type="button"
                onClick={() => handleSelectSkill(sk)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSkill.toLowerCase() === sk.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sk}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level Assessment Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Your Current Level in {selectedSkill}:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleLevelChange(lvl)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    currentLevel === lvl
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/20 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="block">{lvl}</span>
                  <span className="text-[10px] font-normal text-slate-400 block mt-0.5">
                    {lvl === 'Beginner' && 'Foundations'}
                    {lvl === 'Intermediate' && 'Hands-on Pro'}
                    {lvl === 'Advanced' && 'Architect / Mentor'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Goal Target */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Your Primary Learning Goal:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={learningGoalInput}
                onChange={(e) => setLearningGoalInput(e.target.value)}
                placeholder="e.g. Machine Learning, Figma Design System, Production Web Apps..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  updateProfile({
                    learning_goals: [learningGoalInput],
                    active_learning_goal: selectedSkill,
                  });
                }}
                className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Apply
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              The RAG engine uses this goal to generate your tailored gap analysis and resource list below.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Skill Gap Diagnosis (RAG Analyzed) */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  AI Skill Gap Diagnosis
                </h2>
                <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full uppercase">
                  RAG Retrieved
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Evaluating delta between current level ({currentLevel}) and target goal ({learningGoalInput})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <span className="bg-white border border-indigo-200 px-2.5 py-1 rounded-lg">
              Difficulty: <strong className="text-indigo-600">{gapAnalysis.difficultyRating}</strong>
            </span>
            <span className="bg-white border border-indigo-200 px-2.5 py-1 rounded-lg">
              Timeline: <strong className="text-indigo-600">{gapAnalysis.estimatedTimeToGoal}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Missing Prerequisite Gaps */}
          <div className="bg-white/90 rounded-2xl p-4 border border-indigo-100/90 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-rose-500" />
              <span>Identified Conceptual Gaps to Bridge</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {gapAnalysis.identifiedGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 bg-rose-50/50 p-2 rounded-lg border border-rose-100/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Next Topics */}
          <div className="bg-white/90 rounded-2xl p-4 border border-indigo-100/90 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Recommended Topics to Master Next</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {gapAnalysis.recommendedNextTopics.map((topic, i) => (
                <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="font-semibold text-slate-800">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Personalized Learning Path Milestones */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>2. Step-by-Step Personalized Learning Path</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured roadmap calibrated to your skill level. Complete practice exercises and partner pairing to progress.
          </p>
        </div>

        <div className="space-y-4">
          {learningPath.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`bg-white rounded-3xl border transition-all p-6 sm:p-7 shadow-xs ${
                milestone.completed ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleMilestone(milestone.id)}
                    className="mt-1 text-slate-400 hover:text-emerald-600 focus:outline-none transition-colors"
                    title={milestone.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {milestone.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-slate-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Milestone {milestone.stepNumber}
                      </span>
                      <h3
                        className={`text-base font-bold ${
                          milestone.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {milestone.title}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {milestone.targetLevel} Level
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{milestone.summary}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleMilestone(milestone.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border shrink-0 transition-colors ${
                    milestone.completed
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  {milestone.completed ? '✓ Completed' : 'Mark as Done'}
                </button>
              </div>

              {/* Topics Grid */}
              <div className="my-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Topics Covered in this Milestone:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {milestone.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hands-On Practice Activity & Deliverable */}
              <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/70 my-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <FileCode className="w-4 h-4 text-amber-600" />
                    <span>Hands-On Practice Activity: {milestone.practiceActivity.title}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    ~{milestone.practiceActivity.estimatedHours} hrs
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {milestone.practiceActivity.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold pt-1">
                  <span>Deliverable:</span>
                  <code className="bg-white/80 px-2 py-0.5 rounded border border-amber-200 text-amber-800 font-mono text-[11px]">
                    {milestone.practiceActivity.deliverable}
                  </code>
                </div>
              </div>

              {/* Curated Resources */}
              <div className="my-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Curated Learning Resources:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {milestone.resources.map((res, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 mb-1">
                          <span>{res.title}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 bg-indigo-50 border border-indigo-200 rounded">
                            {res.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{res.description}</p>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 font-mono">{res.source}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Campus Mentor Card for this Milestone */}
              {milestone.matchedPartner && (
                <div className="mt-4 pt-4 border-t border-slate-100 bg-indigo-50/60 rounded-2xl p-4 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={milestone.matchedPartner.avatar_url}
                      alt={milestone.matchedPartner.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          Matched Tutor: {milestone.matchedPartner.name}
                        </h4>
                        <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded-full">
                          {milestone.matchedPartner.match_score}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Teaches {milestone.matchedPartner.skill_offered} • {milestone.matchedPartner.college}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetStudent = allUsers.find((u) => u.id === milestone.matchedPartner?.id);
                        if (targetStudent) onSelectStudent(targetStudent);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const targetStudent = allUsers.find((u) => u.id === milestone.matchedPartner?.id);
                        if (targetStudent) setRequestTargetPartner(targetStudent);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Propose Barter for this Milestone</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Continuous Improvement Guidance Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Continuous Skill Improvement Cycle</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Ready to teach back what you've learned?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            As you complete milestones, add your newly acquired skills to your "Skills Offered" section so other campus peers can learn from you in return!
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors shrink-0"
        >
          Update My Offered Skills
        </button>
      </div>

      {/* Send Request Modal Triggered from Milestone Partner */}
      <SendRequestModal
        partner={requestTargetPartner}
        isOpen={Boolean(requestTargetPartner)}
        onClose={() => setRequestTargetPartner(null)}
        onSuccess={() => onNavigate('requests')}
      />
    </div>
  );
};
