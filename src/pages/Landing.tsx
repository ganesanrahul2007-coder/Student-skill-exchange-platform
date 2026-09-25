import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
  Star,
  ArrowRightLeft,
  GraduationCap,
  Layers,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingProps {
  onNavigate: (page: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  const { isAuthenticated, allUsers } = useAuth();

  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      desc: 'Sign up with your campus email, add your university, major course, and academic year.',
      icon: GraduationCap,
    },
    {
      step: '02',
      title: 'Add Skills You Offer',
      desc: 'Highlight topics you excel at — from Python and React to UI Design and Video Editing.',
      icon: Award,
    },
    {
      step: '03',
      title: 'Add Skills You Want',
      desc: 'Specify technologies or subjects you want to master for upcoming projects or internships.',
      icon: Layers,
    },
    {
      step: '04',
      title: 'Connect & Exchange',
      desc: 'Our engine identifies mutual barter opportunities. Send a request, schedule calls, and grow together.',
      icon: ArrowRightLeft,
    },
  ];

  const features = [
    {
      icon: BrainCircuit,
      title: 'Smart Skill Matching',
      desc: 'Reciprocal algorithm identifies pairs where Student A offers what Student B needs and vice-versa, scoring compatibility up to 98%.',
      badge: 'Algorithm Powered',
    },
    {
      icon: Users,
      title: 'Verified Student Profiles',
      desc: 'Detailed student portfolios featuring university affiliation, skills offered/wanted breakdown, availability windows, and verified reviews.',
      badge: 'Campus Verified',
    },
    {
      icon: ArrowRightLeft,
      title: 'Skill Exchange Requests',
      desc: 'Send, accept, decline, or cancel structured proposals specifying exact skill barter pairs and introductory goals.',
      badge: 'Interactive Workflow',
    },
    {
      icon: Star,
      title: 'Ratings & Trust Reviews',
      desc: 'Transparent peer feedback with 1-5 star ratings and qualitative reviews following completed study collaborations.',
      badge: 'Trust System',
    },
    {
      icon: Sparkles,
      title: 'SkillMate AI Assistant',
      desc: 'Retrieval-Augmented Generation (RAG) knowledge chatbot providing instant assistance on platform rules and matching guidance.',
      badge: 'RAG Architecture',
    },
    {
      icon: ShieldCheck,
      title: 'Supabase-Ready Schema',
      desc: 'Engineered with relational data models for profiles, skills, requests, reviews, and RAG document vector chunks.',
      badge: 'Production Ready',
    },
  ];

  const stats = [
    { label: 'Registered Students', value: `${allUsers.length}` },
    { label: 'Skill Categories', value: '7 Active' },
    { label: 'Campus Knowledge Barter', value: '100% Free' },
    { label: 'Reciprocal Synergy Score', value: 'Up to 98%' },
  ];

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Soft background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-400/15 via-purple-400/15 to-pink-400/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Hackathon Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-500" />
            <span>Campus Knowledge Barter • Zero Money, Pure Learning</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Learn. Teach. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Exchange Skills.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-10">
            Connect with students who have the skills you want to learn and share the skills you already know.
            A peer-to-peer barter platform powered by reciprocal matching and AI assistance.
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16">
            <button
              type="button"
              onClick={() => onNavigate('partners')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all"
            >
              <span>Find Your Skill Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'signup')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all"
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}</span>
            </button>
          </div>

          {/* Live Reciprocal Match Concept Visualization */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 text-left relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  How The Reciprocal Match Works
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                92% Compatibility Score
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Student A Concept */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm ring-2 ring-indigo-200">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Student A</h4>
                    <p className="text-xs text-slate-500">Peer Knowledge Provider</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Offers (Teaches):</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">Python</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Wants (Learns):</span>
                    <span className="font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">UI/UX Design</span>
                  </div>
                </div>
              </div>

              {/* Student B Concept */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm ring-2 ring-purple-200">
                    B
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Student B</h4>
                    <p className="text-xs text-slate-500">Peer Exchange Partner</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Offers (Teaches):</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">UI/UX Design</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Wants (Learns):</span>
                    <span className="font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">Python</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
              <span className="flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Mutual match bonus (+50 points) unlocked! Both students teach what the other needs.</span>
              </span>
              <button
                type="button"
                onClick={() => onNavigate('partners')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 shrink-0"
              >
                Browse directory →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How Skill Exchange Works
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            No payments, no middleman tuition fees. Just campus peers sharing knowledge in equal measure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">{item.step}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-100/60 py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Modern Campus Collaboration
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Every feature is built around trust, reciprocity, and seamless student-to-student interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Realistic Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            Ready to teach what you know and learn what you need?
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto mb-8">
            Join hundreds of campus peers exchanging Python, Design, Web Development, Public Speaking, and more today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('partners')}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Explore All Partners
            </button>
            <button
              type="button"
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'signup')}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Create Free Account'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
