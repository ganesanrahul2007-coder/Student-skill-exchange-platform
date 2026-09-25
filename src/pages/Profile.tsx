import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SkillBadge } from '../components/SkillBadge';
import { RatingStars } from '../components/RatingStars';
import { skillService } from '../services/skillService';
import {
  User,
  GraduationCap,
  MapPin,
  Clock,
  Sparkles,
  Save,
  Plus,
  Star,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user, updateProfile, profileCompletion } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [course, setCourse] = useState(user?.course || '');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [bio, setBio] = useState(user?.bio || '');
  const [availability, setAvailability] = useState(user?.availability || '');
  const [skillsOffered, setSkillsOffered] = useState<string[]>(user?.skills_offered || []);
  const [skillsWanted, setSkillsWanted] = useState<string[]>(user?.skills_wanted || []);
  const [skillLevels, setSkillLevels] = useState<Record<string, any>>(user?.skill_levels || {});
  const [learningGoal, setLearningGoal] = useState<string>(user?.learning_goals?.[0] || '');

  // Skill input additions
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-500 mb-4">Please log in to manage your profile.</p>
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

  const handleAddOffered = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferedSkill.trim()) return;
    const trimmed = newOfferedSkill.trim();
    if (!skillsOffered.includes(trimmed)) {
      setSkillsOffered([...skillsOffered, trimmed]);
      skillService.addSkill(trimmed);
    }
    setNewOfferedSkill('');
  };

  const handleRemoveOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter((s) => s !== skill));
  };

  const handleAddWanted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWantedSkill.trim()) return;
    const trimmed = newWantedSkill.trim();
    if (!skillsWanted.includes(trimmed)) {
      setSkillsWanted([...skillsWanted, trimmed]);
      skillService.addSkill(trimmed);
    }
    setNewWantedSkill('');
  };

  const handleRemoveWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter((s) => s !== skill));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      college: college.trim(),
      course: course.trim(),
      year,
      bio: bio.trim(),
      availability: availability.trim(),
      skills_offered: skillsOffered,
      skills_wanted: skillsWanted,
      skill_levels: skillLevels,
      learning_goals: learningGoal.trim() ? [learningGoal.trim()] : [],
      active_learning_goal: learningGoal.trim() || skillsWanted[0],
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Profile
            </h1>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified Student
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal bio, availability hours, and skills you teach vs skills you want to learn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes successfully saved! Skill matching weights have been refreshed.</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {user.course} • {user.year}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
                <RatingStars rating={user.rating} size="sm" />
                <span>{user.rating}</span>
                <span className="text-slate-400">({user.rating_count} reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {user.college}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {user.availability}
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                {user.exchanges_count} exchanges completed
              </span>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Profile Completeness</span>
            <span className="text-indigo-600 font-bold">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Edit Form or Read Mode */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Edit Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                College / University
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Course / Major
              </label>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate / MS">Graduate / MS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Short Bio & Background
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Weekly Availability Window
            </label>
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Weekday Evenings & Saturday mornings"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Primary Learning Goal (Powers AI RAG Journey) */}
          <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900">
                Primary Learning Goal (Powers AI RAG Learning Path)
              </label>
              <button
                type="button"
                onClick={() => onNavigate('skill-development')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
              >
                View Skill Roadmap →
              </button>
            </div>
            <input
              type="text"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="e.g. Master Machine Learning, Full-Stack React, or Figma Design Systems..."
              className="w-full px-3 py-2 text-xs bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Manage Skills Offered */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Skills You Can Teach (Offered)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skillsOffered.map((skill) => (
                <SkillBadge
                  key={skill}
                  name={skill}
                  type="OFFERED"
                  size="md"
                  onRemove={() => handleRemoveOffered(skill)}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newOfferedSkill}
                onChange={(e) => setNewOfferedSkill(e.target.value)}
                placeholder="Add skill you teach (e.g. Python, SQL, Figma)..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={handleAddOffered}
                className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Manage Skills Wanted */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Skills You Want to Learn (Wanted)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skillsWanted.map((skill) => (
                <SkillBadge
                  key={skill}
                  name={skill}
                  type="WANTED"
                  size="md"
                  onRemove={() => handleRemoveWanted(skill)}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newWantedSkill}
                onChange={(e) => setNewWantedSkill(e.target.value)}
                placeholder="Add skill you want (e.g. UI/UX Design, Docker)..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={handleAddWanted}
                className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg"
              >
                Add Skill
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* Read-only Bio and Skills View */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About Me & Background
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {user.bio || 'No bio written yet. Click Edit Profile to add a summary of your experience!'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {/* Skills Offered */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Skills Offered ({user.skills_offered.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills_offered.map((skill) => (
                    <SkillBadge key={skill} name={skill} type="OFFERED" size="md" />
                  ))}
                </div>
              </div>

              {/* Skills Wanted */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Skills Wanted ({user.skills_wanted.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills_wanted.map((skill) => (
                    <SkillBadge key={skill} name={skill} type="WANTED" size="md" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
