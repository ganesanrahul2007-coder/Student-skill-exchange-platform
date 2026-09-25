import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExchange } from '../context/ExchangeContext';
import {
  ArrowRightLeft,
  Users,
  Compass,
  LayoutDashboard,
  Inbox,
  UserCheck,
  Star,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  User,
  Info,
  BrainCircuit,
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { pendingIncomingCount, activeExchanges } = useExchange();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Compass, publicOnly: false },
    { id: 'partners', label: 'Find Partners', icon: Users, publicOnly: false },
    { id: 'how-it-works', label: 'How It Works', icon: Sparkles, publicOnly: false },
    { id: 'about', label: 'About', icon: Info, publicOnly: false },
  ];

  const authNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'skill-development',
      label: 'Skill Journey',
      icon: BrainCircuit,
      badge: 'AI',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'requests',
      label: 'Requests',
      icon: Inbox,
      badge: pendingIncomingCount > 0 ? pendingIncomingCount : null,
    },
    {
      id: 'exchanges',
      label: 'Active Exchanges',
      icon: UserCheck,
      badge: activeExchanges.length > 0 ? activeExchanges.length : null,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    { id: 'ratings', label: 'Reviews', icon: Star },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                  Skill<span className="text-indigo-600">Exchange</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
                  Campus Barter
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === item.id
                      ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {isAuthenticated && (
                <div className="h-4 w-[1px] bg-slate-200 mx-2" />
              )}

              {isAuthenticated &&
                authNavItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === item.id
                        ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          item.badgeColor || 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Right Header Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Authenticated user menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <span className="text-xs font-bold text-slate-700 max-w-[110px] truncate hidden md:inline-block">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Edit My Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>My Dashboard</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        onNavigate('landing');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open mobile navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {isAuthenticated && user && (
            <div className="p-3 bg-indigo-50/60 rounded-xl mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-200"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.college}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate('profile');
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-indigo-600"
              >
                Profile
              </button>
            </div>
          )}

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === item.id
                    ? 'text-indigo-600 bg-indigo-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            ))}

            {isAuthenticated && (
              <>
                <div className="border-t border-slate-100 my-2 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                    Student Workspace
                  </span>
                  {authNavItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === item.id
                          ? 'text-indigo-600 bg-indigo-50 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && item.badge !== undefined && (
                        <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  onNavigate('landing');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
