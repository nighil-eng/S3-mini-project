import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Printer, ShieldCheck, CheckCircle2, Award, FileText } from 'lucide-react';
import { fetchReportSummary } from '../lib/api';

export const ReportsView: React.FC = () => {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await fetchReportSummary();
      setReport(data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadCsv = () => {
    if (!report) return;
    const rows = [
      ['Category', 'Monthly Emission (kg CO2e)'],
      ['Electricity', report.dashboard.categoryBreakdown.electricity],
      ['Transportation', report.dashboard.categoryBreakdown.transportation],
      ['Shopping', report.dashboard.categoryBreakdown.shopping],
      ['Food', report.dashboard.categoryBreakdown.food],
      ['Waste Savings Offset', -report.dashboard.categoryBreakdown.wasteSavings],
      ['NET TOTAL', report.dashboard.totalCo2ThisMonth],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EcoTrack_Carbon_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!report) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Official Audit Module</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1">Sustainability & Carbon Audit Report</h2>
          <p className="text-xs text-slate-400 mt-1">
            Certified carbon audit summary formatted for sustainability reporting, CSV export, or PDF printing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={downloadCsv}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Audit Certificate Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 printable-area">
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span className="text-xl font-black text-slate-100 tracking-tight">EcoTrack AI Certified Audit</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Generated: {new Date(report.generatedDate).toLocaleString()}</p>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/30">
              Grade {report.dashboard.ecoGrade} Certified
            </span>
            <p className="text-xs text-slate-400 mt-1">User ID: {report.user.id}</p>
          </div>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">Account Name</span>
            <p className="text-sm font-bold text-slate-100">{report.user.name}</p>
          </div>
          <div>
            <span className="text-slate-400">Sustainability Score</span>
            <p className="text-sm font-bold text-emerald-400">{report.dashboard.sustainabilityScore} / 100</p>
          </div>
          <div>
            <span className="text-slate-400">Monthly Net CO₂</span>
            <p className="text-sm font-bold text-slate-100">{report.dashboard.totalCo2ThisMonth} kg CO₂e</p>
          </div>
          <div>
            <span className="text-slate-400">Target Benchmark</span>
            <p className="text-sm font-bold text-sky-400">{report.profile.targetMonthlyFootprint} kg CO₂e</p>
          </div>
        </div>

        {/* Audit Category Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Module Emissions Audit</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Module Sector</th>
                  <th className="py-2.5 px-4">CO₂ Footprint</th>
                  <th className="py-2.5 px-4">Share (%)</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-100">Electricity (Grid Power)</td>
                  <td className="py-2.5 px-4 font-bold text-sky-400">{report.dashboard.categoryBreakdown.electricity} kg</td>
                  <td className="py-2.5 px-4">
                    {Math.round((report.dashboard.categoryBreakdown.electricity / report.dashboard.totalCo2ThisMonth) * 100)}%
                  </td>
                  <td className="py-2.5 px-4 text-emerald-400 font-medium">Verified OCR</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-100">Transportation (GPS Location)</td>
                  <td className="py-2.5 px-4 font-bold text-amber-400">{report.dashboard.categoryBreakdown.transportation} kg</td>
                  <td className="py-2.5 px-4">
                    {Math.round((report.dashboard.categoryBreakdown.transportation / report.dashboard.totalCo2ThisMonth) * 100)}%
                  </td>
                  <td className="py-2.5 px-4 text-emerald-400 font-medium">Verified GPS</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-100">Shopping Receipts</td>
                  <td className="py-2.5 px-4 font-bold text-purple-400">{report.dashboard.categoryBreakdown.shopping} kg</td>
                  <td className="py-2.5 px-4">
                    {Math.round((report.dashboard.categoryBreakdown.shopping / report.dashboard.totalCo2ThisMonth) * 100)}%
                  </td>
                  <td className="py-2.5 px-4 text-emerald-400 font-medium">Verified OCR</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-100">Food & Dietary</td>
                  <td className="py-2.5 px-4 font-bold text-red-400">{report.dashboard.categoryBreakdown.food} kg</td>
                  <td className="py-2.5 px-4">
                    {Math.round((report.dashboard.categoryBreakdown.food / report.dashboard.totalCo2ThisMonth) * 100)}%
                  </td>
                  <td className="py-2.5 px-4 text-emerald-400 font-medium">Verified AI Vision</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-100">Waste Landfill Diversion</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-400">-{report.dashboard.categoryBreakdown.wasteSavings} kg</td>
                  <td className="py-2.5 px-4">Offset</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-medium">Verified AI Vision</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
