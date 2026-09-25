import React from 'react';
import { UserProfile } from '../types/user';
import { calculateMatchScore } from '../services/matchingService';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRightLeft, Send, Check } from 'lucide-react';
import { SkillBadge } from './SkillBadge';

interface MatchCardProps {
  partner: UserProfile;
  onRequestExchange: (partner: UserProfile) => void;
  onViewProfile: (partner: UserProfile) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  partner,
  onRequestExchange,
  onViewProfile,
}) => {
  const { user } = useAuth();
  if (!user) return null;

  const match = calculateMatchScore(user, partner);

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/40 rounded-2xl border border-indigo-100 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={partner.avatar_url}
            alt={partner.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">{partner.name}</h4>
              {match.mutualExchangeBonus && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-indigo-600 fill-indigo-500" />
                  Mutual Match
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{partner.college}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-extrabold text-indigo-600 tracking-tight">
            {match.totalScore}%
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Compatibility
          </span>
        </div>
      </div>

      {/* Reciprocal Trade Diagram */}
      <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-indigo-100/80 p-3 my-3">
        <div className="text-xs text-slate-700 flex items-center justify-between gap-2 mb-2 font-medium">
          <div className="flex items-center gap-1.5 text-indigo-900">
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" />
            <span>Exchange Synergy</span>
          </div>
          {match.sameCollege && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" /> Same Campus
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              You teach them:
            </span>
            <div className="flex flex-wrap gap-1">
              {match.matchingWantedToOffered.length > 0 ? (
                match.matchingWantedToOffered.map((s) => (
                  <SkillBadge key={s} name={s} type="OFFERED" size="sm" />
                ))
              ) : (
                <span className="text-slate-400 italic text-[11px]">{user.skills_offered[0] || 'Your skills'}</span>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              They teach you:
            </span>
            <div className="flex flex-wrap gap-1">
              {match.matchingOfferedToWanted.length > 0 ? (
                match.matchingOfferedToWanted.map((s) => (
                  <SkillBadge key={s} name={s} type="WANTED" size="sm" />
                ))
              ) : (
                <span className="text-slate-400 italic text-[11px]">{partner.skills_offered[0] || 'Their skills'}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 line-clamp-1 mb-4 italic">
        "{match.explanation}"
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onRequestExchange(partner)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
        >
          <Send className="w-3 h-3" />
          <span>Send Exchange Proposal</span>
        </button>
        <button
          type="button"
          onClick={() => onViewProfile(partner)}
          className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
};
