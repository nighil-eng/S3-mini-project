import React, { useState } from 'react';
import { Zap, Upload, FileText, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ElectricityBill } from '../types';
import { uploadElectricityBillOcr, deleteElectricityBill } from '../lib/api';

interface ElectricityViewProps {
  bills: ElectricityBill[];
  onRefresh: () => void;
}

export const ElectricityView: React.FC<ElectricityViewProps> = ({ bills, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Manual fallback inputs or scanned result state
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await uploadElectricityBillOcr(base64Data, file.type || 'image/png');
        if (res.success) {
          setSuccessMsg(`OCR Extracted successfully! ${res.bill.unitsKwh} kWh processed (${res.bill.co2Kg} kg CO₂e).`);
          onRefresh();
        } else {
          setError(res.error || 'Failed to process electricity bill OCR.');
        }
        setLoading(false);
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Unexpected error scanning document.');
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this electricity bill record?')) {
      await deleteElectricityBill(id);
      onRefresh();
    }
  };

  const totalKwh = bills.reduce((sum, b) => sum + b.unitsKwh, 0);
  const totalCo2 = Number(bills.reduce((sum, b) => sum + b.co2Kg, 0).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Electricity Module</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1">AI Electricity OCR Scanner</h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload power bills (PDF, PNG, JPG). OCR extracts kWh consumption and computes grid emissions (CO₂ = kWh × 0.82 kg/kWh).
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700/60">
          <div>
            <p className="text-[11px] text-slate-400">Total Electricity Footprint</p>
            <p className="text-xl font-bold text-sky-400">{totalCo2} kg CO₂e</p>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <p className="text-[11px] text-slate-400">Units Consumed</p>
            <p className="text-xl font-bold text-slate-100">{totalKwh} kWh</p>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-base font-bold text-slate-100 mb-3">Upload Power Bill Document</h3>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-sky-400 bg-sky-500/10'
              : 'border-slate-700 hover:border-slate-600 bg-slate-950/40'
          }`}
        >
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            id="bill-upload-input"
            disabled={loading}
          />
          <label htmlFor="bill-upload-input" className="cursor-pointer flex flex-col items-center">
            {loading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
                <span className="text-sm font-semibold text-sky-300">Extracting Bill via Gemini OCR...</span>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-400 mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Drop electricity bill here, or <span className="text-sky-400 underline">browse file</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG (Max 15MB)</p>
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

      {/* Processed Bills History Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg">
        <h3 className="text-base font-bold text-slate-100 mb-4">Saved Electricity Bills (MongoDB)</h3>

        {bills.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No electricity bills uploaded yet. Upload a bill above to calculate emissions.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Consumer No</th>
                  <th className="py-3 px-4">Billing Date</th>
                  <th className="py-3 px-4">Utility Provider</th>
                  <th className="py-3 px-4">Units (kWh)</th>
                  <th className="py-3 px-4">CO₂ Footprint</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-sky-400">{bill.consumerNumber}</td>
                    <td className="py-3 px-4">{bill.billingDate}</td>
                    <td className="py-3 px-4 text-slate-300">{bill.utilityProvider}</td>
                    <td className="py-3 px-4 font-semibold text-slate-100">{bill.unitsKwh} kWh</td>
                    <td className="py-3 px-4 font-bold text-sky-400">{bill.co2Kg} kg CO₂e</td>
                    <td className="py-3 px-4">${bill.billAmount}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete bill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
