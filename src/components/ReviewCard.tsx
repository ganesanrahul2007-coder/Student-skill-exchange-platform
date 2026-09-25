import React from 'react';
import { ReviewRating } from '../types/rating';
import { RatingStars } from './RatingStars';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface ReviewCardProps {
  review: ReviewRating;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = new Date(review.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const reviewerName = review.reviewer?.name || 'Verified Student';
  const reviewerCollege = review.reviewer?.college || 'Campus Member';
  const reviewerAvatar = review.reviewer?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={reviewerAvatar}
            alt={reviewerName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-slate-900">{reviewerName}</h4>
              <span title="Verified Exchange" className="text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{reviewerCollege}</p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <RatingStars rating={review.rating} size="sm" />
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed mb-3">
        "{review.feedback}"
      </p>

      {review.skill_exchanged && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Exchanged Skill:</span>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
            {review.skill_exchanged}
          </span>
        </div>
      )}
    </div>
  );
};
