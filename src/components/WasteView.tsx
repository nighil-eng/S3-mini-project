import React, { useState } from 'react';
import { Recycle, Upload, Trash2, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { WasteRecord } from '../types';
import { analyzeWasteImage, deleteWasteRecord } from '../lib/api';

interface WasteViewProps {
  records: WasteRecord[];
  onRefresh: () => void;
}

export const WasteView: React.FC<WasteViewProps> = ({ records, onRefresh }) => {
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
        const res = await analyzeWasteImage(base64Data, file.type || 'image/png');
        if (res.success) {
          setSuccessMsg(
            `Waste Vision AI detected: ${res.waste.wasteType} (${res.waste.weightKg} kg). Diverted CO₂ Saved: ${res.waste.co2SavedKg} kg!`
          );
          onRefresh();
        } else {
          setError(res.error || 'Failed to analyze waste photo.');
        }
        setLoading(false);
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Error uploading waste photo.');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this waste log?')) {
      await deleteWasteRecord(id);
      onRefresh();
    }
  };

  const totalWasteSaved = Number(records.reduce((s, r) => s + r.co2SavedKg, 0).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Recycle className="w-4 h-4" />
            <span>Waste Vision AI Module</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1">Computer Vision Waste Classifier</h2>
          <p className="text-xs text-slate-400 mt-1">
            Detects Plastic, Paper, Metal, Organic, Glass, and E-waste. Calculates landfill diversion savings and environmental impact.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700/60">
          <div>
            <p className="text-[11px] text-slate-400">Total CO₂ Diverted</p>
            <p className="text-xl font-bold text-emerald-400">-{totalWasteSaved} kg CO₂</p>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <p className="text-[11px] text-slate-400">Items Scanned</p>
            <p className="text-xl font-bold text-slate-100">{records.length} Items</p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-base font-bold text-slate-100 mb-3">Snap or Upload Waste Photo</h3>

        <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/40 rounded-2xl p-8 text-center transition-all cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            id="waste-upload-input"
            disabled={loading}
          />
          <label htmlFor="waste-upload-input" className="cursor-pointer flex flex-col items-center">
            {loading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                <span className="text-sm font-semibold text-emerald-300">Classifying Waste Material via Vision AI...</span>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Drop waste photo here, or <span className="text-emerald-400 underline">browse photo</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Classifies Plastic, Paper, Glass, Metals, Organic Scraps & E-Waste</p>
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

      {/* Waste Logs Grid */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-slate-100">Saved Waste Diversion Records</h3>

        {records.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No waste records scanned yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((w) => (
              <div key={w.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <Recycle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{w.wasteType}</h4>
                      <p className="text-xs text-slate-400">
                        Method: {w.disposalMethod} • {w.weightKg} kg
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                      -{w.co2SavedKg} kg CO₂
                    </span>
                    <button
                      onClick={() => handleDelete(w.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="flex items-center space-x-1 text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Diverted from landfill</span>
                  </span>
                  <span>{new Date(w.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
