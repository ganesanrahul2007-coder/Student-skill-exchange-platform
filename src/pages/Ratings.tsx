import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ratingService } from '../services/ratingService';
import { RatingStars } from '../components/RatingStars';
import { ReviewCard } from '../components/ReviewCard';
import { EmptyState } from '../components/EmptyState';
import { Star, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface RatingsProps {
  onNavigate: (page: string) => void;
}

export const Ratings: React.FC<RatingsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'received' | 'given'>('received');

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-500 mb-4">Please log in to view community ratings.</p>
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

  const reviewsReceived = ratingService.getReviewsForStudent(user.id);
  const reviewsGiven = ratingService.getReviewsGivenByStudent(user.id);
  const stats = ratingService.getRatingStats(user.id);

  const displayedReviews = tab === 'received' ? reviewsReceived : reviewsGiven;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ratings & Peer Reviews
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Campus reputation score and transparent testimonials from completed skill exchanges.
        </p>
      </div>

      {/* Trust & Rating Summary Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Average Score */}
          <div className="text-center md:border-r md:border-slate-100 pr-0 md:pr-6">
            <div className="text-5xl font-black text-slate-900 tracking-tight mb-2">
              {stats.average}
            </div>
            <RatingStars rating={stats.average} size="lg" />
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Based on {stats.count} peer review{stats.count !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-1.5 md:col-span-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as keyof typeof stats.distribution] || 0;
              const percent = stats.count > 0 ? (count / stats.count) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-slate-500 font-medium text-right flex items-center justify-end gap-1">
                    <span>{star}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-slate-400 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setTab('received')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'received'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4 fill-amber-300" />
          <span>Reviews Received ({reviewsReceived.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('given')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'given'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Reviews Given by You ({reviewsGiven.length})</span>
        </button>
      </div>

      {/* Review Cards Grid */}
      {displayedReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedReviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title={tab === 'received' ? 'No Reviews Received Yet' : 'No Reviews Given Yet'}
          description={
            tab === 'received'
              ? 'Complete a skill exchange session with a partner to receive your first campus endorsement.'
              : 'When you finish an active exchange, you can rate your partner to build campus trust.'
          }
          actionText="View Active Exchanges"
          onAction={() => onNavigate('exchanges')}
        />
      )}
    </div>
  );
};
