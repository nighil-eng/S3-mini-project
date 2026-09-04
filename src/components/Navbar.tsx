import React, { useState } from 'react';
import { Leaf, Flame, Award, Bell, Smartphone, ShieldCheck, User as UserIcon, LogOut, KeyRound } from 'lucide-react';
import { User, UserProfile, EcoNotification } from '../types';

interface NavbarProps {
  user: User;
  profile: UserProfile;
  notifications: EcoNotification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileSimOpen: boolean;
  setIsMobileSimOpen: (open: boolean) => void;
  onLogout?: () => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  profile,
  notifications,
  activeTab,
  setActiveTab,
  isMobileSimOpen,
  setIsMobileSimOpen,
  onLogout,
  onOpenAuth,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/40 text-slate-100 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                EcoTrack AI
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PROD v2.6
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI-Driven Carbon Footprint Intelligence</p>
          </div>
        </div>

        {/* Right Badges & Controls */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Streak Counter */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{profile.streakDays} Day Streak</span>
          </div>

          {/* Eco Points */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{profile.ecoPoints} Points</span>
          </div>

          {/* Mobile Simulator Toggle Button */}
          <button
            onClick={() => setIsMobileSimOpen(!isMobileSimOpen)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isMobileSimOpen
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
            title="Open Mobile App Simulator"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">Mobile App</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-300 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-200">Eco Notifications</h4>
                  <span className="text-xs text-emerald-400">{notifications.length} total</span>
                </div>
                <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto mt-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-slate-800/40 rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500">Just now</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative pl-2 border-l border-slate-800">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-left p-1 rounded-xl hover:bg-slate-800/80 transition-colors focus:outline-none"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-none">{user.name}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Sustainability Auditor</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-slate-800">
                <div className="p-3">
                  <p className="text-xs font-bold text-slate-100">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onOpenAuth) onOpenAuth();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 rounded-xl transition-colors flex items-center space-x-2"
                  >
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>Sign In / Switch Account</span>
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
