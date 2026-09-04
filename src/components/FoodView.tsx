import React, { useState } from 'react';
import { UtensilsCrossed, Upload, Trash2, CheckCircle2, AlertCircle, Loader2, Heart, Leaf } from 'lucide-react';
import { FoodRecord } from '../types';
import { analyzeFoodImage, deleteFoodRecord } from '../lib/api';

interface FoodViewProps {
  records: FoodRecord[];
  onRefresh: () => void;
}

export const FoodView: React.FC<FoodViewProps> = ({ records, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await analyzeFoodImage(base64Data, file.type || 'image/png');
        if (res.success) {
          setSuccessMsg(
            `Food AI Vision identified: ${res.food.foodName} (${res.food.category}), Footprint: ${res.food.co2Kg} kg CO₂.`
          );
          onRefresh();
        } else {
          setError(res.error || 'Failed to analyze food photo.');
        }
        setLoading(false);
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Error uploading food image.');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this food log record?')) {
      await deleteFoodRecord(id);
      onRefresh();
    }
  };

  const totalFoodCo2 = Number(records.reduce((s, r) => s + r.co2Kg, 0).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Food AI Vision Module</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1">Computer Vision Food Scanner</h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload food photos to analyze portion size, dietary carbon intensity, health score, and low-emission recipe swaps.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700/60">
          <div>
            <p className="text-[11px] text-slate-400">Food CO₂ Footprint</p>
            <p className="text-xl font-bold text-red-400">{totalFoodCo2} kg CO₂e</p>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <p className="text-[11px] text-slate-400">Meals Analyzed</p>
            <p className="text-xl font-bold text-slate-100">{records.length} Meals</p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-base font-bold text-slate-100 mb-3">Snap or Upload Food Photo</h3>

        <div className="border-2 border-dashed border-slate-700 hover:border-red-500/50 bg-slate-950/40 rounded-2xl p-8 text-center transition-all cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            id="food-upload-input"
            disabled={loading}
          />
          <label htmlFor="food-upload-input" className="cursor-pointer flex flex-col items-center">
            {loading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-10 h-10 text-red-400 animate-spin" />
                <span className="text-sm font-semibold text-red-300">Analyzing Food Dish via Vision AI...</span>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-red-500/10 text-red-400 mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Drop dish photo here, or <span className="text-red-400 underline">browse photo</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP</p>
              </>
            )}
          </label>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Food Logs Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-slate-100">Saved Meal Carbon Logs</h3>

        {records.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No food logs available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((food) => (
              <div key={food.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{food.foodName}</h4>
                      <p className="text-xs text-slate-400">
                        {food.category} • {food.portionGrams}g
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                      {food.co2Kg} kg CO₂
                    </span>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/60">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Health Rating: {food.healthScore}/10</span>
                  </span>
                  <span className="text-slate-500">{new Date(food.createdAt).toLocaleDateString()}</span>
                </div>

                {food.notes && (
                  <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl flex items-center space-x-1.5">
                    <Leaf className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>{food.notes}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
