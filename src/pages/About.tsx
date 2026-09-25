import React from 'react';
import {
  ShieldCheck,
  BrainCircuit,
  Database,
  Users,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
          Platform Architecture & Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Student Skill Exchange
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          A modern peer-to-peer knowledge bartering system designed for college campuses, built with
          production-grade architecture, reciprocal matching algorithms, and RAG AI.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero-Cost Knowledge Barter</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tutoring and skill courses often cost students hundreds of dollars per semester.
            SkillExchange proves that every student possesses valuable knowledge — from code and data to
            visual design and public speaking — that can be traded reciprocally without money.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Reciprocal Matching Engine</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike simple keyword search directories, our matching algorithm calculates true mutual
            barter potential: If Student A offers Python and wants UI/UX, while Student B offers UI/UX
            and wants Python, they receive a +50 mutual bonus, yielding a 92%+ compatibility score.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Supabase-Ready Schema</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineered with clear separation of business logic and storage. Relational models for
            profiles, skills, requests, active sessions, ratings, and RAG document chunks are configured
            for instant cloud migration via environment variables.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">SkillMate AI (RAG Pipeline)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Retrieval-Augmented Generation extracts query concepts, searches chunk embeddings
            using vector similarity, and constructs factual, hallucination-free guidance on campus rules,
            peer matching, and platform etiquette.
          </p>
        </div>
      </div>

      {/* Academic Integrity Code */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400">
          <ShieldCheck className="w-6 h-6" />
          <h2 className="text-lg font-bold tracking-tight text-white">
            Campus Academic Integrity & Safety Rules
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          SkillExchange enforces strict adherence to campus academic honor codes:
        </p>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Exchanges are for conceptual coaching, code reviews, and pair debugging.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Never request or agree to complete graded assignments or take tests for others.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Respect agreed meeting times and report fraudulent behavior to student moderators.</span>
          </li>
        </ul>
      </div>

      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => onNavigate('partners')}
          className="px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
        >
          Find a Skill Exchange Partner
        </button>
      </div>
    </div>
  );
};
