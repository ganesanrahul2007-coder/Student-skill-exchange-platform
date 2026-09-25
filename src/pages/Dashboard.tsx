import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';
import { calculateMatchScore } from '../services/matchingService';
import { skillJourneyService } from '../services/skillJourneyService';
import { UserProfile } from '../types/user';
import { MatchCard } from '../components/MatchCard';
import { SkillBadge } from '../components/SkillBadge';
import { RatingStars } from '../components/RatingStars';
import { SendRequestModal } from '../components/SendRequestModal';
import {
  Sparkles,
  ArrowRight,
  Inbox,
  UserCheck,
  Star,
  Plus,
  Compass,
  ArrowRightLeft,
  Bot,
  Layers,
  Award,
  CheckCircle2,
  BrainCircuit,
  Target,
  TrendingUp,
  FileCode,
  BookOpen,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onSelectStudent: (student: UserProfile) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onSelectStudent,
}) => {
  const { user, allUsers, profileCompletion } = useAuth();
  const {
    incomingRequests,
    outgoingRequests,
    activeExchanges,
    getReviewsForUser,
  } = useExchange();

  const [requestModalPartner, setRequestModalPartner] = useState<UserProfile | null>(null);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-500 mb-4">Please log in to view your student dashboard.</p>
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

  // Calculate recommended partners (excluding self, sorted by compatibility score)
  const candidatePartners = allUsers
    .filter((p) => p.id !== user.id)
    .map((p) => ({
      partner: p,
      match: calculateMatchScore(user, p),
    }))
    .sort((a, b) => b.match.totalScore - a.match.totalScore);

  const topRecommendations = candidatePartners.slice(0, 3);
  const pendingIncoming = incomingRequests.filter((r) => r.status === 'pending');
  const myReviews = getReviewsForUser(user.id).slice(0, 2);
  const activeJourney = skillJourneyService.getActiveLearningPath(user);
  const nextMilestone = activeJourney.milestones.find((m) => !m.completed) || activeJourney.milestones[0];

  return (
    <div className="space-y-8 py-6">
      {/* 1. Welcome Message & Profile Overview Hero */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                  Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100 mt-1">
                {user.college} • {user.course} ({user.year})
              </p>
              <div className="flex items-center gap-4 text-xs text-indigo-200 mt-2 font-medium">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <strong className="text-white">{user.rating}</strong> ({user.rating_count} reviews)
                </span>
                <span>•</span>
                <span>
                  <strong className="text-white">{activeExchanges.length}</strong> active exchanges
                </span>
              </div>
            </div>
          </div>

          {/* 2. Profile Completion Bar */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-indigo-100">Profile Completion</span>
              <span className="text-white font-bold">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-indigo-200">
              <span>{profileCompletion === 100 ? 'All details filled' : 'Add bio & more skills'}</span>
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className="text-white font-bold underline hover:text-indigo-100"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 9. AI RAG Assistant Shortcut Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bot className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">SkillMate AI Assistant Ready</h3>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                Connected to Your Journey
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Have questions about your {activeJourney.targetSkill} learning path or need practice tips? Ask SkillMate anytime!
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const floatingBtn = document.querySelector('button[aria-label="Open SkillMate AI Chatbot"]') as HTMLButtonElement;
            if (floatingBtn) floatingBtn.click();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shrink-0 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask SkillMate AI</span>
        </button>
      </div>

      {/* Integrated Skill Development Journey & AI Roadmap Banner */}
      <div className="bg-white rounded-3xl border border-indigo-100 p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Your AI Skill Development Journey
                </h2>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  RAG Curriculum
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Targeting: <strong className="text-indigo-600 font-semibold">{activeJourney.targetSkill}</strong> • Current Assessed Level: <strong className="text-slate-700">{activeJourney.currentLevel}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('skill-development')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors shrink-0"
          >
            <span>Open Full Learning Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Milestone & Practice Highlight */}
        {nextMilestone && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Target Milestone */}
            <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Active Milestone {nextMilestone.stepNumber}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {activeJourney.overallProgressPercent}% Completed
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{nextMilestone.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{nextMilestone.summary}</p>
              </div>

              {/* Practice activity callout */}
              <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                  <FileCode className="w-3.5 h-3.5 text-amber-600" />
                  <span>Practice Exercise: {nextMilestone.practiceActivity.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {nextMilestone.practiceActivity.description}
                </p>
              </div>
            </div>

            {/* Matched Tutor or Skill Gap Box */}
            <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-2xl p-4 border border-indigo-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                  Identified Skill Gap
                </span>
                <p className="text-xs text-slate-800 font-semibold mb-2">
                  {activeJourney.gapAnalysis.identifiedGaps[0] || 'Foundational prerequisite topics'}
                </p>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>• Estimated timeline: {activeJourney.gapAnalysis.estimatedTimeToGoal}</p>
                  <p>• Difficulty: {activeJourney.gapAnalysis.difficultyRating}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-indigo-100/80 mt-3">
                <button
                  type="button"
                  onClick={() => onNavigate('skill-development')}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs text-center"
                >
                  Manage Milestones & Tutors
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3 & 4. Skills Offered & Skills Wanted Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Offered Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Skills You Can Teach (Offered)</h3>
                <p className="text-[11px] text-slate-400">Available to trade with peers</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {user.skills_offered.map((skill) => (
              <SkillBadge key={skill} name={skill} type="OFFERED" size="md" />
            ))}
          </div>
        </div>

        {/* Skills Wanted Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Skills You Want to Learn (Wanted)</h3>
                <p className="text-[11px] text-slate-400">Used by engine to find your matches</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {user.skills_wanted.map((skill) => (
              <SkillBadge key={skill} name={skill} type="WANTED" size="md" />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recommended Partners (Mutual High Matches) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Top Recommended Partners</h2>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Reciprocal Matching
              </span>
            </div>
            <p className="text-xs text-slate-500">Students with the highest skill compatibility with your profile</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('partners')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {topRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topRecommendations.map(({ partner }) => (
              <MatchCard
                key={partner.id}
                partner={partner}
                onRequestExchange={(p) => setRequestModalPartner(p)}
                onViewProfile={(p) => onSelectStudent(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-2xs">
            <p className="text-sm font-bold text-slate-800 mb-1">No Other Students Registered Yet</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              As soon as peers register and list skills they offer or want to learn, the matching engine will calculate your compatibility score and show top recommendations here.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Update Your Skills Wishlist
            </button>
          </div>
        )}
      </div>

      {/* 6, 7 & 8. Quick Activity Matrix: Requests, Active Exchanges, Recent Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6. Pending Requests Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pending Requests</h3>
                  <p className="text-[11px] text-slate-400">Incoming & outgoing proposals</p>
                </div>
              </div>
              {pendingIncoming.length > 0 && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  {pendingIncoming.length} new
                </span>
              )}
            </div>

            <div className="space-y-2.5 mt-3">
              {incomingRequests.slice(0, 2).map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {req.sender?.name || 'Peer'}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        req.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Trade: {req.skill_offered} ⇄ {req.skill_requested}
                  </p>
                </div>
              ))}

              {incomingRequests.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center italic">
                  No incoming requests yet.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('requests')}
            className="w-full mt-4 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center"
          >
            Manage All Requests ({incomingRequests.length + outgoingRequests.length})
          </button>
        </div>

        {/* 7. Active Exchanges Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Active Exchanges</h3>
                  <p className="text-[11px] text-slate-400">Current peer study partnerships</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {activeExchanges.length} active
              </span>
            </div>

            <div className="space-y-2.5 mt-3">
              {activeExchanges.slice(0, 2).map((exch) => (
                <div
                  key={exch.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      With {exch.partner?.name || 'Partner'}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      In Progress
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Exchanging: {exch.partner_offered_skill} & {exch.my_offered_skill}
                  </p>
                </div>
              ))}

              {activeExchanges.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center italic">
                  No active exchange sessions right now.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('exchanges')}
            className="w-full mt-4 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center"
          >
            View Active Exchanges ({activeExchanges.length})
          </button>
        </div>

        {/* 8. Recent Ratings Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Feedback</h3>
                  <p className="text-[11px] text-slate-400">Campus peer reviews</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <RatingStars rating={user.rating} size="sm" />
                <span className="text-xs font-bold text-slate-800">{user.rating}</span>
              </div>
            </div>

            <div className="space-y-2.5 mt-3">
              {myReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">
                      {rev.reviewer?.name || 'Verified Student'}
                    </span>
                    <RatingStars rating={rev.rating} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                    "{rev.feedback}"
                  </p>
                </div>
              ))}

              {myReviews.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center italic">
                  No reviews received yet. Complete an exchange to get rated!
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('ratings')}
            className="w-full mt-4 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center"
          >
            See Community Reviews
          </button>
        </div>
      </div>

      {/* Send Request Modal Triggered from Match Cards */}
      <SendRequestModal
        partner={requestModalPartner}
        isOpen={Boolean(requestModalPartner)}
        onClose={() => setRequestModalPartner(null)}
        onSuccess={() => onNavigate('requests')}
      />
    </div>
  );
};
