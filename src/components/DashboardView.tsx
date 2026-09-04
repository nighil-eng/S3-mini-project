import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Zap,
  Navigation,
  ShoppingBag,
  UtensilsCrossed,
  Recycle,
  Sparkles,
  TrendingDown,
  Award,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { DashboardData } from '../types';

interface DashboardViewProps {
  data: DashboardData;
  setActiveTab: (tab: string) => void;
}

const CATEGORY_COLORS = {
  electricity: '#38bdf8', // sky-400
  transportation: '#f59e0b', // amber-500
  shopping: '#a855f7', // purple-500
  food: '#ef4444', // red-500
  wasteSavings: '#10b981', // emerald-500
};

export const DashboardView: React.FC<DashboardViewProps> = ({ data, setActiveTab }) => {
  const pieData = [
    { name: 'Electricity', value: data.categoryBreakdown.electricity, color: CATEGORY_COLORS.electricity },
    { name: 'Transportation', value: data.categoryBreakdown.transportation, color: CATEGORY_COLORS.transportation },
    { name: 'Shopping', value: data.categoryBreakdown.shopping, color: CATEGORY_COLORS.shopping },
    { name: 'Food', value: data.categoryBreakdown.food, color: CATEGORY_COLORS.food },
  ];

  const diffFromPrev = Number((data.totalCo2ThisMonth - data.previousMonthCo2).toFixed(1));
  const isDiffPositive = diffFromPrev > 0;

  return (
    <div className="space-y-6">
      {/* Welcome & AI Quick Insight Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">
                AI Sustainability Engine Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
              Welcome back, {data.user.name}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Your carbon footprint this month is <span className="text-emerald-400 font-semibold">{data.totalCo2ThisMonth} kg CO₂e</span>, placing you in the <span className="text-emerald-300 font-bold">Top 12% Eco Champions</span> in your area.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('chatbot')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Eco AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Emission Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Monthly CO₂ Footprint</span>
            <span className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-100">{data.totalCo2ThisMonth}</span>
            <span className="text-xs text-slate-400">kg CO₂e</span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs font-medium">
            <span className={isDiffPositive ? 'text-amber-400' : 'text-emerald-400'}>
              {isDiffPositive ? `+${diffFromPrev}` : diffFromPrev} kg
            </span>
            <span className="text-slate-500">vs last month ({data.previousMonthCo2} kg)</span>
          </div>
        </div>

        {/* Sustainability Score */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Sustainability Score</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold">
              Grade {data.ecoGrade}
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400">{data.sustainabilityScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${data.sustainabilityScore}%` }}
            />
          </div>
        </div>

        {/* Eco Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Eco Streak</span>
            <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400">{data.streakDays}</span>
            <span className="text-xs text-slate-400">Days Consecutive</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Goal: Reach 30 days to unlock <span className="text-amber-300 font-semibold">+250 Eco Points</span>
          </p>
        </div>

        {/* Waste Diverted CO2 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Waste Diverted Savings</span>
            <Recycle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400">-{data.categoryBreakdown.wasteSavings}</span>
            <span className="text-xs text-slate-400">kg CO₂ Offset</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Equal to planting <span className="text-emerald-300 font-semibold">3.2 trees</span> this month!
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">6-Month Carbon Emission Trend</h3>
              <p className="text-xs text-slate-400">Historical breakdown across electricity, transport, food & shopping</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              Target: {data.profile.targetMonthlyFootprint} kg
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#totalColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Category Share</h3>
            <p className="text-xs text-slate-400">Distribution of current emissions</p>
          </div>
          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-slate-300">Electricity: {data.categoryBreakdown.electricity}kg</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">Transport: {data.categoryBreakdown.transportation}kg</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-slate-300">Shopping: {data.categoryBreakdown.shopping}kg</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-300">Food: {data.categoryBreakdown.food}kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Shortcuts & Recent Activity Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fast Action Module Shortcuts */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-100">Quick Trackers</h3>

          <div
            onClick={() => setActiveTab('electricity')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Scan Electricity Bill</h4>
                <p className="text-xs text-slate-400">OCR document scanner</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
          </div>

          <div
            onClick={() => setActiveTab('transport')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">GPS Trip Tracker</h4>
                <p className="text-xs text-slate-400">Location-only mode classifier</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
          </div>

          <div
            onClick={() => setActiveTab('food')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Scan Meal Photo</h4>
                <p className="text-xs text-slate-400">Computer Vision food footprint</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
          </div>

          <div
            onClick={() => setActiveTab('waste')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Recycle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Scan Waste Material</h4>
                <p className="text-xs text-slate-400">Recycling & diversion AI</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
          </div>
        </div>

        {/* Recent Activities Feed */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100">Recent Carbon Activity Logs</h3>
            <span className="text-xs text-slate-400">MongoDB Records</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {data.recentActivities.map((act) => (
              <div key={act.id} className="py-3.5 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                    {act.type === 'Electricity' && <Zap className="w-4 h-4 text-sky-400" />}
                    {act.type === 'Transportation' && <Navigation className="w-4 h-4 text-amber-400" />}
                    {act.type === 'Shopping' && <ShoppingBag className="w-4 h-4 text-purple-400" />}
                    {act.type === 'Food' && <UtensilsCrossed className="w-4 h-4 text-red-400" />}
                    {act.type === 'Waste' && <Recycle className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{act.title}</h4>
                    <p className="text-xs text-slate-400">{act.detail}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold ${
                      act.co2Kg < 0 ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {act.co2Kg < 0 ? `${act.co2Kg} kg` : `+${act.co2Kg} kg`}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {new Date(act.time).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
