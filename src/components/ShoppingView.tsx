import React, { useState } from 'react';
import { ShoppingBag, Upload, Trash2, CheckCircle2, AlertCircle, Loader2, Tag } from 'lucide-react';
import { ShoppingReceipt } from '../types';
import { uploadReceiptOcr, deleteShoppingReceipt } from '../lib/api';

interface ShoppingViewProps {
  receipts: ShoppingReceipt[];
  onRefresh: () => void;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({ receipts, onRefresh }) => {
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
        const res = await uploadReceiptOcr(base64Data, file.type || 'image/png');
        if (res.success) {
          setSuccessMsg(`Receipt scanned! Store: ${res.receipt.storeName}, Total CO₂: ${res.receipt.totalCo2Kg} kg.`);
          onRefresh();
        } else {
          setError(res.error || 'Failed to scan receipt.');
        }
        setLoading(false);
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Unexpected error scanning receipt.');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this receipt record?')) {
      await deleteShoppingReceipt(id);
      onRefresh();
    }
  };

  const totalSpent = receipts.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalCo2 = Number(receipts.reduce((sum, r) => sum + r.totalCo2Kg, 0).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" />
            <span>Shopping Module</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1">AI Shopping Receipt Scanner</h2>
          <p className="text-xs text-slate-400 mt-1">
            Scan store receipts to automatically extract product names, prices, categories, and individual carbon intensity factors.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700/60">
          <div>
            <p className="text-[11px] text-slate-400">Shopping CO₂ Footprint</p>
            <p className="text-xl font-bold text-purple-400">{totalCo2} kg CO₂e</p>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <p className="text-[11px] text-slate-400">Total Spend</p>
            <p className="text-xl font-bold text-slate-100">${totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-base font-bold text-slate-100 mb-3">Scan Receipt Image</h3>

        <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/50 bg-slate-950/40 rounded-2xl p-8 text-center transition-all cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            id="receipt-upload-input"
            disabled={loading}
          />
          <label htmlFor="receipt-upload-input" className="cursor-pointer flex flex-col items-center">
            {loading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                <span className="text-sm font-semibold text-purple-300">Extracting Receipt Items via AI...</span>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Drop shopping receipt here, or <span className="text-purple-400 underline">select photo</span>
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

      {/* Receipts List */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-slate-100">Saved Shopping Receipts</h3>

        {receipts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No shopping receipts uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {receipts.map((rcpt) => (
              <div key={rcpt.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 relative space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{rcpt.storeName}</h4>
                    <p className="text-xs text-slate-400">{rcpt.purchaseDate} • ${rcpt.totalAmount}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                      {rcpt.totalCo2Kg} kg CO₂
                    </span>
                    <button
                      onClick={() => handleDelete(rcpt.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-700/60 pt-2 divide-y divide-slate-700/40 text-xs">
                  {rcpt.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-3 h-3 text-purple-400" />
                        <span className="text-slate-200">{item.name}</span>
                        <span className="text-[10px] text-slate-400">({item.category})</span>
                      </div>
                      <div className="flex items-center space-x-3 text-slate-300">
                        <span>${item.price}</span>
                        <span className="font-semibold text-purple-300">+{item.co2Kg}kg CO₂</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
