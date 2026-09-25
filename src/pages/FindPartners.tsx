import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types/user';
import { StudentCard } from '../components/StudentCard';
import { SendRequestModal } from '../components/SendRequestModal';
import { EmptyState } from '../components/EmptyState';
import { SKILL_CATEGORIES } from '../data/mockSkills';
import { calculateMatchScore } from '../services/matchingService';
import {
  Search,
  Filter,
  Users,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  GraduationCap,
  Award,
  Layers,
} from 'lucide-react';

interface FindPartnersProps {
  onSelectStudent: (student: UserProfile) => void;
  onNavigate: (page: string) => void;
}

export const FindPartners: React.FC<FindPartnersProps> = ({
  onSelectStudent,
  onNavigate,
}) => {
  const { user, allUsers } = useAuth();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterOfferedSkill, setFilterOfferedSkill] = useState<string>('all');
  const [filterWantedSkill, setFilterWantedSkill] = useState<string>('all');
  const [filterCollege, setFilterCollege] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'exchanges'>('match');
  const [displayCount, setDisplayCount] = useState<number>(6);

  // Request modal state
  const [requestTarget, setRequestTarget] = useState<UserProfile | null>(null);

  // Distinct lists for dropdown filters
  const uniqueColleges = useMemo(() => {
    const set = new Set<string>();
    allUsers.forEach((u) => {
      if (u.college) set.add(u.college);
    });
    return Array.from(set);
  }, [allUsers]);

  const uniqueOfferedSkills = useMemo(() => {
    const set = new Set<string>();
    allUsers.forEach((u) => u.skills_offered.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [allUsers]);

  const uniqueWantedSkills = useMemo(() => {
    const set = new Set<string>();
    allUsers.forEach((u) => u.skills_wanted.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [allUsers]);

  // Filter & sort logic
  const filteredStudents = useMemo(() => {
    return allUsers.filter((student) => {
      // Free text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesCollege = student.college.toLowerCase().includes(q);
        const matchesCourse = student.course.toLowerCase().includes(q);
        const matchesOffered = student.skills_offered.some((s) => s.toLowerCase().includes(q));
        const matchesWanted = student.skills_wanted.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCollege && !matchesCourse && !matchesOffered && !matchesWanted) {
          return false;
        }
      }

      // Filter by offered skill
      if (filterOfferedSkill !== 'all') {
        if (!student.skills_offered.includes(filterOfferedSkill)) return false;
      }

      // Filter by wanted skill
      if (filterWantedSkill !== 'all') {
        if (!student.skills_wanted.includes(filterWantedSkill)) return false;
      }

      // Filter by college
      if (filterCollege !== 'all') {
        if (student.college !== filterCollege) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'exchanges') {
        return b.exchanges_count - a.exchanges_count;
      }
      // Sort by Match Score with current user
      if (user) {
        const scoreA = calculateMatchScore(user, a).totalScore;
        const scoreB = calculateMatchScore(user, b).totalScore;
        return scoreB - scoreA;
      }
      return b.rating - a.rating;
    });
  }, [
    allUsers,
    searchQuery,
    filterOfferedSkill,
    filterWantedSkill,
    filterCollege,
    sortBy,
    user,
  ]);

  const displayedStudents = filteredStudents.slice(0, displayCount);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setFilterOfferedSkill('all');
    setFilterWantedSkill('all');
    setFilterCollege('all');
    setSortBy('match');
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Find Skill Partners
            </h1>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              {filteredStudents.length} Students Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover peers by offered skills, learning wishlists, and reciprocal matching compatibility.
          </p>
        </div>

        {/* Sorting Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="match">Compatibility Match %</option>
            <option value="rating">Highest Rating</option>
            <option value="exchanges">Most Completed Exchanges</option>
          </select>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, college, or skills (e.g. Python, UI/UX, Flutter, React)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Filter by Offered Skill */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>Skill They Offer</span>
            </label>
            <select
              value={filterOfferedSkill}
              onChange={(e) => setFilterOfferedSkill(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Offered Skills</option>
              {uniqueOfferedSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Wanted Skill */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-600" />
              <span>Skill They Want</span>
            </label>
            <select
              value={filterWantedSkill}
              onChange={(e) => setFilterWantedSkill(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Wanted Skills</option>
              {uniqueWantedSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by College */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-indigo-600" />
              <span>University Campus</span>
            </label>
            <select
              value={filterCollege}
              onChange={(e) => setFilterCollege(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none truncate"
            >
              <option value="all">All Universities</option>
              {uniqueColleges.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Cards Grid */}
      {displayedStudents.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewProfile={(s) => onSelectStudent(s)}
                onRequestExchange={(s) => setRequestTarget(s)}
              />
            ))}
          </div>

          {/* Load More Button */}
          {displayCount < filteredStudents.length && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => prev + 6)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all"
              >
                <span>Load More Students ({filteredStudents.length - displayCount} remaining)</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={allUsers.length === 0 ? 'No Students Registered Yet' : 'No Matching Students Found'}
          description={
            allUsers.length === 0
              ? 'Be the first student to register your profile, add skills you can teach, and list skills you want to learn!'
              : 'Try broadening your skill criteria or university filters to find more campus peers.'
          }
          actionText={
            allUsers.length === 0
              ? !user
                ? 'Create Your Student Account'
                : 'Add Skills to Your Profile'
              : 'Clear All Filters'
          }
          onAction={
            allUsers.length === 0
              ? !user
                ? () => onNavigate('signup')
                : () => onNavigate('profile')
              : handleResetFilters
          }
        />
      )}

      {/* Send Request Modal */}
      <SendRequestModal
        partner={requestTarget}
        isOpen={Boolean(requestTarget)}
        onClose={() => setRequestTarget(null)}
        onSuccess={() => onNavigate('requests')}
      />
    </div>
  );
};
