import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';
import { ActiveExchange } from '../types/exchange';
import { UserProfile } from '../types/user';
import { RatingModal } from '../components/RatingModal';
import { EmptyState } from '../components/EmptyState';
import { SkillBadge } from '../components/SkillBadge';
import {
  UserCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Star,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ExchangesProps {
  onNavigate: (page: string) => void;
  onViewStudent: (student: UserProfile) => void;
}

export const Exchanges: React.FC<ExchangesProps> = ({ onNavigate, onViewStudent }) => {
  const { user } = useAuth();
  const { activeExchanges, completedExchanges, completeExchange } = useExchange();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [ratingTargetExchange, setRatingTargetExchange] = useState<ActiveExchange | null>(null);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-500 mb-4">Please log in to view your skill exchanges.</p>
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

  const handleMarkCompleted = async (exchange: ActiveExchange) => {
    await completeExchange(exchange.id);
    // Automatically prompt rating modal as specified in Requirement 12
    setRatingTargetExchange(exchange);
  };

  const displayedList = activeTab === 'active' ? activeExchanges : completedExchanges;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Active Skill Exchanges
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your ongoing study barter partnerships, pair sessions, and learning milestones.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({activeExchanges.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedExchanges.length})
          </button>
        </div>
      </div>

      {/* Exchanges List */}
      {displayedList.length > 0 ? (
        <div className="space-y-4">
          {displayedList.map((exchange) => {
            const partner = exchange.partner;
            const startDateFormatted = new Date(exchange.start_date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={exchange.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={partner?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={partner?.name || 'Partner'}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {partner?.name || 'Exchange Partner'}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            exchange.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {exchange.status === 'active' ? 'Active Collaboration' : 'Completed'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{partner?.college}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Started {startDateFormatted}
                    </span>
                  </div>
                </div>

                {/* Skills Exchanged Matrix */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Partner Teaches You:
                    </span>
                    <SkillBadge name={exchange.partner_offered_skill || 'Core Skill'} type="WANTED" size="md" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      You Teach Partner:
                    </span>
                    <SkillBadge name={exchange.my_offered_skill || 'Core Skill'} type="OFFERED" size="md" />
                  </div>
                </div>

                {/* Last Activity & Notes */}
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Last Activity: {exchange.last_activity}</span>
                  </div>
                  {exchange.notes && (
                    <p className="text-slate-500 pl-5 italic text-[11px]">"{exchange.notes}"</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {partner && (
                      <button
                        type="button"
                        onClick={() => onViewStudent(partner)}
                        className="text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        View Partner Profile
                      </button>
                    )}

                    {exchange.meeting_link && exchange.status === 'active' && (
                      <a
                        href={exchange.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Study Call</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {exchange.status === 'active' ? (
                      <button
                        type="button"
                        onClick={() => handleMarkCompleted(exchange)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-lg shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Completed</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRatingTargetExchange(exchange)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Rate Your Skill Exchange</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={UserCheck}
          title={activeTab === 'active' ? 'No Active Exchanges' : 'No Completed Exchanges Yet'}
          description={
            activeTab === 'active'
              ? 'When a partner accepts your exchange proposal, your study collaboration begins here.'
              : 'Completed learning sessions and your historical reviews will appear here.'
          }
          actionText="Find a Partner"
          onAction={() => onNavigate('partners')}
        />
      )}

      {/* Rating Modal */}
      <RatingModal
        partner={ratingTargetExchange?.partner || null}
        exchangeId={ratingTargetExchange?.id}
        skillExchanged={ratingTargetExchange?.partner_offered_skill}
        isOpen={Boolean(ratingTargetExchange)}
        onClose={() => setRatingTargetExchange(null)}
        onSuccess={() => onNavigate('ratings')}
      />
    </div>
  );
};
