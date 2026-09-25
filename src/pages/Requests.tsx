import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';
import { RequestCard } from '../components/RequestCard';
import { EmptyState } from '../components/EmptyState';
import { Inbox, Send, CheckCircle2, Clock } from 'lucide-react';

interface RequestsProps {
  onNavigate: (page: string) => void;
  onViewStudent: (studentId: string) => void;
}

export const Requests: React.FC<RequestsProps> = ({ onNavigate, onViewStudent }) => {
  const { user } = useAuth();
  const {
    incomingRequests,
    outgoingRequests,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    pendingIncomingCount,
  } = useExchange();

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-500 mb-4">Please log in to manage your exchange requests.</p>
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

  const handleAccept = async (requestId: string) => {
    const ok = await acceptRequest(requestId);
    if (ok) {
      setActionSuccess('Exchange accepted! It has been added to your Active Exchanges.');
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleReject = async (requestId: string) => {
    await rejectRequest(requestId);
    setActionSuccess('Request declined.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleCancel = async (requestId: string) => {
    await cancelRequest(requestId);
    setActionSuccess('Proposal cancelled.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Skill Exchange Requests
          </h1>
          {pendingIncomingCount > 0 && (
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              {pendingIncomingCount} Action Required
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review incoming proposals from peers and manage outgoing skill trade requests.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          {actionSuccess.includes('Active Exchanges') && (
            <button
              type="button"
              onClick={() => onNavigate('exchanges')}
              className="font-bold underline text-emerald-900"
            >
              View Active Exchanges →
            </button>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'incoming'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Requests</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'incoming' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {incomingRequests.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'outgoing'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Outgoing Proposals</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === 'outgoing' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {outgoingRequests.length}
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'incoming' ? (
        incomingRequests.length > 0 ? (
          <div className="space-y-4">
            {incomingRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                direction="incoming"
                onAccept={handleAccept}
                onReject={handleReject}
                onViewStudent={onViewStudent}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="No Incoming Requests"
            description="When campus peers find your offered skills and send an exchange proposal, it will appear here."
            actionText="Find Skill Partners"
            onAction={() => onNavigate('partners')}
          />
        )
      ) : outgoingRequests.length > 0 ? (
        <div className="space-y-4">
          {outgoingRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              direction="outgoing"
              onCancel={handleCancel}
              onViewStudent={onViewStudent}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Send}
          title="No Outgoing Proposals"
          description="Browse student profiles to discover peers who offer skills you want, and send your first barter request."
          actionText="Explore Partners"
          onAction={() => onNavigate('partners')}
        />
      )}
    </div>
  );
};
