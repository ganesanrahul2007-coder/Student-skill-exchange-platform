import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';
import { X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { SkillBadge } from './SkillBadge';

interface SendRequestModalProps {
  partner: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SendRequestModal: React.FC<SendRequestModalProps> = ({
  partner,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { sendRequest } = useExchange();

  const [selectedOffered, setSelectedOffered] = useState<string>('');
  const [selectedRequested, setSelectedRequested] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (partner && user) {
      // Pick sensible defaults
      setSelectedOffered(user.skills_offered[0] || 'General Tutoring');
      setSelectedRequested(partner.skills_offered[0] || 'Skill Coaching');
      setMessage(
        `Hi ${partner.name}! I noticed your experience with ${partner.skills_offered[0] || 'your skills'}. I would love to connect and exchange knowledge!`
      );
      setError(null);
    }
  }, [partner, user]);

  if (!isOpen || !partner || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffered.trim()) {
      setError('Please select or specify a skill you can teach.');
      return;
    }
    if (!selectedRequested.trim()) {
      setError('Please select a skill you want to learn.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ok = await sendRequest(
        partner.id,
        selectedOffered.trim(),
        selectedRequested.trim(),
        message.trim()
      );
      if (ok) {
        onSuccess && onSuccess();
        onClose();
      } else {
        setError('Could not dispatch request. Please try again.');
      }
    } catch {
      setError('Unexpected error sending request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <img
              src={partner.avatar_url}
              alt={partner.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Propose Skill Exchange
              </h3>
              <p className="text-xs text-slate-500">With {partner.name} • {partner.college}</p>
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Skill you offer */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              1. Skill You Will Teach (From Your Profile)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {user.skills_offered.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedOffered(skill)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                    selectedOffered === skill
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={selectedOffered}
              onChange={(e) => setSelectedOffered(e.target.value)}
              placeholder="Or enter custom skill you can offer..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Skill you want to learn */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              2. Skill You Want to Learn from {partner.name}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {partner.skills_offered.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedRequested(skill)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                    selectedRequested === skill
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={selectedRequested}
              onChange={(e) => setSelectedRequested(e.target.value)}
              placeholder="Or specify particular topic..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              3. Introductory Note & Availability
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain what you hope to achieve and preferred times to connect..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Reciprocal Banner */}
          <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Both peers maintain equal commitment. Sessions typically run 1-2 hours per week.
            </span>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Sending...' : 'Send Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
