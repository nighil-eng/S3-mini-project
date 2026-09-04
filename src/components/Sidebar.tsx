import React from 'react';
import {
  LayoutDashboard,
  Zap,
  ShoppingBag,
  Navigation,
  UtensilsCrossed,
  Recycle,
  Calculator,
  TrendingUp,
  Lightbulb,
  MessageSquareCode,
  FileSpreadsheet,
  Smartphone,
  LogOut,
  KeyRound,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileSimOpen: boolean;
  setIsMobileSimOpen: (open: boolean) => void;
  onLogout?: () => void;
  onOpenAuth?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileSimOpen,
  setIsMobileSimOpen,
  onLogout,
  onOpenAuth,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'electricity', label: 'Electricity OCR', icon: Zap },
    { id: 'shopping', label: 'Shopping Receipts', icon: ShoppingBag },
    { id: 'transport', label: 'GPS Transport Tracker', icon: Navigation },
    { id: 'food', label: 'Food Recognition AI', icon: UtensilsCrossed },
    { id: 'waste', label: 'Waste Vision AI', icon: Recycle },
    { id: 'calculator', label: 'Carbon Calculator', icon: Calculator },
    { id: 'predictions', label: 'AI Predictive Engine', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'chatbot', label: 'AI Eco Assistant', icon: MessageSquareCode },
    { id: 'reports', label: 'Audit Reports', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900/60 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Core Modules
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Simulator CTA Box */}
      <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-800/40 text-left">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
          <Smartphone className="w-4 h-4" />
          <span>React Native Simulator</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Test real-time background GPS tracking & quick camera uploads.
        </p>
        <button
          onClick={() => setIsMobileSimOpen(!isMobileSimOpen)}
          className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition-colors"
        >
          {isMobileSimOpen ? 'Hide Mobile View' : 'Launch Mobile View'}
        </button>
      </div>
      {/* Account Controls */}
      <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
        <button
          onClick={onOpenAuth}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition-colors"
        >
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <span>Switch Account / Login</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
