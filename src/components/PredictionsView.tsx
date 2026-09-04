import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, AlertCircle, ArrowDownRight, Layers, Loader2 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { fetchPredictions } from '../lib/api';

export const PredictionsView: React.FC = () => {
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const res = await fetchPredictions();
      setPredictions(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !predictions) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Generating ML Predictive Carbon Forecasts...</p>
      </div>
    );
  }

  const chartData = [
    { period: 'Current', Baseline: predictions.baselineMonthlyKg, Projected: predictions.baselineMonthlyKg, Target: 210 },
    { period: '+30 Days', Baseline: predictions.baselineMonthlyKg, Projected: predictions.day30ProjectionKg, Target: 200 },
    { period: '+60 Days', Baseline: predictions.baselineMonthlyKg, Projected: Math.round(predictions.day60ProjectionKg / 2), Target: 190 },
    { period: '+90 Days', Baseline: predictions.baselineMonthlyKg, Projected: Math.round(predictions.day90ProjectionKg / 3), Target: 180 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Predictive Carbon Analytics</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1">30 / 60 / 90 Day Emission Forecast</h2>
          <p className="text-xs text-slate-400 mt-1">
            Machine Learning forecasting model trained on historical electricity, transport, food, and waste logs.
          </p>
        </div>

        <button
          onClick={loadPredictions}
          className="px-4 py-2 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-colors flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Re-run Forecast Model</span>
        </button>
      </div>

      {/* 30 / 60 / 90 Day Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Next 30 Days Forecast</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400">{predictions.day30ProjectionKg}</span>
            <span className="text-xs text-slate-400">kg CO₂e</span>
          </div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center space-x-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>-12% vs Baseline ({predictions.baselineMonthlyKg} kg)</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Next 60 Days Forecast</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-teal-400">{predictions.day60ProjectionKg}</span>
            <span className="text-xs text-slate-400">kg CO₂ Cumulative</span>
          </div>
          <p className="text-xs text-teal-400 mt-1 flex items-center space-x-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Projected reduction trajectory</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Next 90 Days Forecast</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-cyan-400">{predictions.day90ProjectionKg}</span>
            <span className="text-xs text-slate-400">kg CO₂ Cumulative</span>
          </div>
          <p className="text-xs text-cyan-400 mt-1 flex items-center space-x-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Target: 180 kg/month benchmark</span>
          </p>
        </div>
      </div>

      {/* Forecast Line Chart */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg">
        <h3 className="text-base font-bold text-slate-100 mb-2">Predictive Emission Curve vs Target</h3>
        <p className="text-xs text-slate-400 mb-4">ML regression curve mapping future footprint reduction</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Baseline" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="Projected" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Target" stroke="#38bdf8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictive Reduction Scenarios */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-slate-100">AI-Simulated Reduction Scenarios</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictions.scenarios?.map((s: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100">{s.name}</h4>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  -{s.savingKg} kg
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
