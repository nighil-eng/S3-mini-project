import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle2, Award, Zap, Navigation, ShoppingBag, UtensilsCrossed, Recycle } from 'lucide-react';
import { Recommendation } from '../types';
import { fetchRecommendations, toggleRecommendation } from '../lib/api';

interface RecommendationsViewProps {
  onRefresh: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ onRefresh }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filter, setFilter] = useState<'All' | 'Electricity' | 'Transportation' | 'Food'>('All');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await fetchRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id: string) => {
    await toggleRecommendation(id);
    await loadRecommendations();
    onRefresh();
  };

  const filteredRecs = filter === 'All' ? recommendations : recommendations.filter((r) => r.category === filter);

  const totalPotentialSavings = recommendations.reduce((sum, r) => sum + r.estimatedCo2SavingKg, 0);
  const completedSavings = recommendations.filter((r) => r.completed).reduce((sum, r) => sum + r.estimatedCo2SavingKg, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>AI Recommendation Engine</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1">Personalized Carbon Action Plan</h2>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven action items tailored to your historical emission hotspots. Complete tasks to earn Eco Points.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700/60">
          <div>
            <p className="text-[11px] text-slate-400">Completed Reduction</p>
            <p className="text-xl font-bold text-emerald-400">{completedSavings} / {totalPotentialSavings} kg</p>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <p className="text-[11px] text-slate-400">Action Plan</p>
            <p className="text-xl font-bold text-amber-400">{recommendations.filter((r) => r.completed).length} Done</p>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['All', 'Electricity', 'Transportation', 'Food'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
              filter === cat
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat} Actions
          </button>
        ))}
      </div>

      {/* Recommendations Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              rec.completed
                ? 'bg-emerald-950/20 border-emerald-800/40 opacity-80'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {rec.category}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    rec.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {rec.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-100">{rec.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{rec.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center space-x-3 text-xs">
                <span className="font-bold text-emerald-400">-{rec.estimatedCo2SavingKg} kg CO₂/mo</span>
                <span className="text-amber-400 flex items-center space-x-1 font-medium">
                  <Award className="w-3.5 h-3.5" />
                  <span>+{rec.pointsReward} pts</span>
                </span>
              </div>

              <button
                onClick={() => handleToggle(rec.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  rec.completed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{rec.completed ? 'Completed' : 'Mark Done'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
