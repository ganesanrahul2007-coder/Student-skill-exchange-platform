import React, { useState } from 'react';
import { UserProfile } from '../types/user';
import { useExchange } from '../context/ExchangeContext';
import { RatingStars } from './RatingStars';
import { X, Star, HeartHandshake, AlertCircle } from 'lucide-react';

interface RatingModalProps {
  partner: UserProfile | null;
  exchangeId?: string;
  skillExchanged?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  partner,
  exchangeId,
  skillExchanged,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { submitReview } = useExchange();
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !partner) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please provide a sentence or two of constructive feedback.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ok = await submitReview(
        partner.id,
        rating,
        feedback.trim(),
        exchangeId,
        skillExchanged
      );
      if (ok) {
        onSuccess && onSuccess();
        onClose();
      } else {
        setError('Could not record review. Please try again.');
      }
    } catch {
      setError('Failed to record review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Rate Your Skill Exchange
              </h3>
              <p className="text-xs text-slate-500">With {partner.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-center py-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Overall Experience & Tutoring Quality
            </label>
            <div className="flex justify-center">
              <RatingStars rating={rating} size="lg" interactive onChange={setRating} />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {rating === 5 && '🌟 Outstanding mentor & collaborator'}
              {rating === 4 && '👍 Great exchange, learned a lot'}
              {rating === 3 && '👌 Good session, met expectations'}
              {rating === 2 && '⚠️ Needs improvement in preparation'}
              {rating === 1 && '❌ Unhelpful session or did not show up'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Written Feedback & Review
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={`How was ${partner.name}'s teaching style? What topics did you cover? Would you recommend them to other students?`}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Honest reviews strengthen the student community trust network.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
