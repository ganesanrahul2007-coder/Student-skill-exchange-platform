import React, { useState } from 'react';
import { UserProfile } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';
import { calculateMatchScore } from '../services/matchingService';
import { SkillBadge } from '../components/SkillBadge';
import { RatingStars } from '../components/RatingStars';
import { ReviewCard } from '../components/ReviewCard';
import { SendRequestModal } from '../components/SendRequestModal';
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  Clock,
  Sparkles,
  Send,
  Star,
  Award,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface StudentDetailsProps {
  student: UserProfile;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const StudentDetails: React.FC<StudentDetailsProps> = ({
  student,
  onBack,
  onNavigate,
}) => {
  const { user } = useAuth();
  const { getReviewsForUser } = useExchange();
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const match = user ? calculateMatchScore(user, student) : null;
  const reviews = getReviewsForUser(student.id);
  const isSelf = user?.id === student.id;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Partners</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        {/* Accent background header stripe */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 pointer-events-none" />

        <div className="relative pt-8 sm:pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={student.avatar_url}
                alt={student.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-white"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" title="Online Member" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                {match?.mutualExchangeBonus && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    Mutual Match
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600 flex items-center justify-center sm:justify-start gap-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{student.course} • {student.year}</span>
              </p>

              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.college}</span>
              </p>
            </div>
          </div>

          {/* Action & Match Score Display */}
          <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
            {!isSelf && user && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-center sm:text-right w-full sm:w-auto">
                <div className="text-2xl font-black text-indigo-600">{match?.totalScore}%</div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Compatibility Score
                </span>
              </div>
            )}

            {!isSelf ? (
              <button
                type="button"
                onClick={() => setRequestModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Skill Exchange Request</span>
              </button>
            ) : (
              <span className="text-xs font-medium text-slate-400 italic">This is your profile</span>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-center gap-1">
              <RatingStars rating={student.rating} size="sm" />
              <span className="text-sm font-bold text-slate-900">{student.rating}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{student.rating_count} Reviews</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-sm font-bold text-slate-900">{student.exchanges_count}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Completed Exchanges</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-sm font-bold text-emerald-600">Active</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Campus Status</p>
          </div>
        </div>
      </div>

      {/* Match Breakdown Explanation */}
      {match && !isSelf && (
        <div className="bg-gradient-to-r from-indigo-50/70 to-purple-50/70 rounded-2xl border border-indigo-200/80 p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Matching Engine Analysis</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed mb-3">
            {match.explanation}
          </p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {match.mutualExchangeBonus && (
              <span className="bg-indigo-100 text-indigo-800 font-semibold px-2.5 py-1 rounded-full">
                ✓ Reciprocal Barter Bonus (+50)
              </span>
            )}
            {match.sameCollege && (
              <span className="bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
                ✓ Same University Bonus (+10)
              </span>
            )}
            {match.matchingOfferedToWanted.length > 0 && (
              <span className="bg-amber-100 text-amber-900 font-semibold px-2.5 py-1 rounded-full">
                ✓ Offers {match.matchingOfferedToWanted.join(', ')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* About & Availability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              About {student.name}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {student.bio}
            </p>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Skills {student.name} Can Teach (Offered)
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.skills_offered.map((skill) => (
                  <SkillBadge key={skill} name={skill} type="OFFERED" size="md" />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Skills {student.name} Wants to Learn (Wanted)
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.skills_wanted.map((skill) => (
                  <SkillBadge key={skill} name={skill} type="WANTED" size="md" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Availability
              </span>
              <div className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>{student.availability}</span>
              </div>
            </div>

            {student.interests && student.interests.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Interests & Activities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {student.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {student.github_or_portfolio && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Portfolio / GitHub
                </span>
                <a
                  href={`https://${student.github_or_portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <span>{student.github_or_portfolio}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Peer Reviews & Endorsements</h2>
            <p className="text-xs text-slate-500">Verified feedback from completed skill exchanges</p>
          </div>
          <div className="flex items-center gap-1.5">
            <RatingStars rating={student.rating} size="md" />
            <span className="text-sm font-extrabold text-slate-900">{student.rating}</span>
            <span className="text-xs text-slate-400">({reviews.length})</span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center italic">
            No reviews yet. Be the first to exchange skills with {student.name}!
          </p>
        )}
      </div>

      {/* Send Request Modal */}
      <SendRequestModal
        partner={student}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSuccess={() => onNavigate('requests')}
      />
    </div>
  );
};
