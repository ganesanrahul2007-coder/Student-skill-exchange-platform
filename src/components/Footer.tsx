import React from 'react';
import { ArrowRightLeft, Github, Heart, Shield, Sparkles, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Skill<span className="text-indigo-600">Exchange</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering college students to trade knowledge freely, master new skills, and foster peer-to-peer campus mentorship.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Built for College Hackathons & Production</span>
            </div>
          </div>

          {/* Platform Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('partners')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Find Skill Partners
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  How Bartering Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('requests')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Exchange Proposals
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Architecture & Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Reciprocal Matching Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>SkillMate AI (RAG Pipeline)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Supabase-Ready Schema</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Verified Peer Reviews</span>
              </li>
            </ul>
          </div>

          {/* Trust & Guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academic Integrity Code</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a
                  href="mailto:contact@campus-skill-exchange.edu"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Campus Support Desk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Student Skill Exchange Platform. Open Source Hackathon Edition.</p>
          <div className="flex items-center gap-4">
            <span>React • TypeScript • Tailwind CSS • Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
