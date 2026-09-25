import React from 'react';
import { UserProfile } from '../types/user';
import { calculateMatchScore } from '../services/matchingService';
import { useAuth } from '../context/AuthContext';
import { SkillBadge } from './SkillBadge';
import { RatingStars } from './RatingStars';
import { Sparkles, MapPin, GraduationCap, ArrowRight, Send } from 'lucide-react';

interface StudentCardProps {
  student: UserProfile;
  onViewProfile: (student: UserProfile) => void;
  onRequestExchange: (student: UserProfile) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onViewProfile,
  onRequestExchange,
}) => {
  const { user } = useAuth();

  const matchDetails = user ? calculateMatchScore(user, student) : null;
  const matchScore = matchDetails?.totalScore || 70;
  const isMutual = matchDetails?.mutualExchangeBonus || false;
  const isSelf = user?.id === student.id;

  const scoreColor =
    matchScore >= 85
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20'
      : matchScore >= 70
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20'
      : 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-400/20';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Banner & Match Badge */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={student.avatar_url}
                alt={student.name}
                className="w-13 h-13 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Active on campus" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {student.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="truncate max-w-[170px]">{student.course} • {student.year}</span>
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          {!isSelf && user && (
            <div
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ring-1 ${scoreColor}`}
              title={matchDetails?.explanation}
            >
              {isMutual && <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* College & Rating summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 py-1.5 border-y border-slate-100 mb-3">
          <div className="flex items-center gap-1 truncate max-w-[200px]" title={student.college}>
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{student.college}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-medium">
            <RatingStars rating={student.rating} size="sm" />
            <span className="text-slate-700 font-semibold">{student.rating}</span>
            <span className="text-slate-400">({student.rating_count})</span>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {student.bio}
        </p>

        {/* Skills Section */}
        <div className="space-y-3">
          {/* Skills Offered */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Can Teach
              </span>
              <span className="text-emerald-700 text-[10px] font-medium bg-emerald-50 px-1.5 py-0.5 rounded">Offered</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {student.skills_offered.slice(0, 3).map((skill) => (
                <SkillBadge key={skill} name={skill} type="OFFERED" size="sm" />
              ))}
              {student.skills_offered.length > 3 && (
                <span className="text-xs text-slate-400 self-center">
                  +{student.skills_offered.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Wants to Learn
              </span>
              <span className="text-amber-800 text-[10px] font-medium bg-amber-50 px-1.5 py-0.5 rounded">Wanted</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {student.skills_wanted.slice(0, 3).map((skill) => (
                <SkillBadge key={skill} name={skill} type="WANTED" size="sm" />
              ))}
              {student.skills_wanted.length > 3 && (
                <span className="text-xs text-slate-400 self-center">
                  +{student.skills_wanted.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 pt-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <button
          type="button"
          onClick={() => onViewProfile(student)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {!isSelf ? (
          <button
            type="button"
            onClick={() => onRequestExchange(student)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span>Request</span>
          </button>
        ) : (
          <span className="text-xs font-medium text-slate-400 italic px-2">You (Current Profile)</span>
        )}
      </div>
    </div>
  );
};
