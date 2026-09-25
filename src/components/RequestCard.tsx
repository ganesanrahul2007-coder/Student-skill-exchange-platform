import React from 'react';
import { ExchangeRequest } from '../types/request';
import { Check, X, Ban, ArrowRight, Clock, MessageSquare } from 'lucide-react';
import { SkillBadge } from './SkillBadge';

interface RequestCardProps {
  request: ExchangeRequest;
  direction: 'incoming' | 'outgoing';
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onCancel?: (requestId: string) => void;
  onViewStudent?: (studentId: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  direction,
  onAccept,
  onReject,
  onCancel,
  onViewStudent,
}) => {
  const otherParty = direction === 'incoming' ? request.sender : request.receiver;
  const otherPartyName = otherParty?.name || (direction === 'incoming' ? 'Student' : 'Partner');
  const otherPartyCollege = otherParty?.college || 'Campus Member';
  const otherPartyAvatar = otherParty?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';

  const statusConfig = {
    pending: {
      label: 'Pending Response',
      classes: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    accepted: {
      label: 'Accepted',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    rejected: {
      label: 'Declined',
      classes: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    cancelled: {
      label: 'Cancelled',
      classes: 'bg-slate-100 text-slate-600 border-slate-200',
    },
  }[request.status];

  const formattedDate = new Date(request.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={otherPartyAvatar}
            alt={otherPartyName}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => otherParty && onViewStudent && onViewStudent(otherParty.id)}
                className="text-sm font-bold text-slate-900 hover:text-indigo-600 text-left"
              >
                {otherPartyName}
              </button>
              <span className="text-xs text-slate-400">
                {direction === 'incoming' ? 'sent you a request' : 'received your proposal'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{otherPartyCollege}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.classes}`}>
            {statusConfig.label}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Exchange Skill Pair */}
      <div className="my-4 bg-slate-50 rounded-xl p-3 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {direction === 'incoming' ? 'They will teach:' : 'You will teach:'}
          </span>
          <SkillBadge name={request.skill_offered} type="OFFERED" size="md" />
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {direction === 'incoming' ? 'In exchange for:' : 'They will teach:'}
          </span>
          <SkillBadge name={request.skill_requested} type="WANTED" size="md" />
        </div>
      </div>

      {/* Personal Message */}
      {request.message && (
        <div className="mb-4 text-xs text-slate-600 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/60 flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">"{request.message}"</p>
        </div>
      )}

      {/* Action Buttons */}
      {request.status === 'pending' && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          {direction === 'incoming' ? (
            <>
              <button
                type="button"
                onClick={() => onReject && onReject(request.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Decline</span>
              </button>
              <button
                type="button"
                onClick={() => onAccept && onAccept(request.id)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept Exchange</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onCancel && onCancel(request.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Ban className="w-3.5 h-3.5 text-slate-400" />
              <span>Cancel Proposal</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
