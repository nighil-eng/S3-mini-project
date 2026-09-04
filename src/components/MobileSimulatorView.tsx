import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Navigation,
  Play,
  Square,
  Zap,
  Camera,
  Flame,
  Award,
  Footprints,
  Car,
  Bike,
  Bus,
  Train,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Battery,
} from 'lucide-react';
import { DashboardData } from '../types';
import { processGpsTrip } from '../lib/api';

interface MobileSimulatorViewProps {
  data: DashboardData;
  onRefresh: () => void;
  onClose: () => void;
}

export const MobileSimulatorView: React.FC<MobileSimulatorViewProps> = ({ data, onRefresh, onClose }) => {
  const [bgTrackingActive, setBgTrackingActive] = useState(true);
  const [isSimulatingTrip, setIsSimulatingTrip] = useState(false);
  const [simSeconds, setSimSeconds] = useState(0);
  const [simDistance, setSimDistance] = useState(0);
  const [simSpeed, setSimSpeed] = useState(0);
  const [activeTab, setActiveTab] = useState<'home' | 'gps' | 'camera' | 'score'>('home');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isSimulatingTrip) {
      interval = setInterval(() => {
        setSimSeconds((s) => s + 1);
        setSimSpeed(Math.floor(25 + Math.random() * 20)); // simulated 25-45 km/h driving/bus
        setSimDistance((d) => Number((d + 0.01).toFixed(2)));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimulatingTrip]);

  const handleStartMobileTrip = () => {
    setIsSimulatingTrip(true);
    setSimSeconds(0);
    setSimDistance(0);
    setSimSpeed(0);
    setStatusMsg(null);
  };

  const handleStopMobileTrip = async () => {
    setIsSimulatingTrip(false);
    setStatusMsg('Processing mobile GPS trajectory...');

    const now = Date.now();
    const simGpsLogs = [
      { latitude: 37.7749, longitude: -122.4194, timestamp: now - 600000, speedKmh: 0 },
      { latitude: 37.7850, longitude: -122.4100, timestamp: now - 300000, speedKmh: 35 },
      { latitude: 37.7950, longitude: -122.4000, timestamp: now, speedKmh: 28 },
    ];

    try {
      const res = await processGpsTrip(simGpsLogs, 'Mobile App Origin', 'Mobile App Destination');
      if (res.success) {
        setStatusMsg(`Mobile GPS Trip Saved! Mode: ${res.trip.transportMode}, CO₂: ${res.trip.co2Kg} kg.`);
        onRefresh();
      }
    } catch (err: any) {
      setStatusMsg('Error logging mobile trip.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      {/* Mobile Device Frame */}
      <div className="w-full max-w-sm bg-slate-900 border-4 border-slate-700 rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-[700px] relative text-slate-100">
        {/* Notch / Status Bar */}
        <div className="bg-slate-950 px-6 py-2 flex items-center justify-between text-[11px] text-slate-400 font-semibold border-b border-slate-800 shrink-0">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center space-x-1.5">
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100">EcoTrack Native Mobile</h3>
              <p className="text-[10px] text-emerald-400">Background GPS Active</p>
            </div>
          </div>
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg bg-slate-800">
            Close
          </button>
        </div>

        {/* Mobile Screen Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Daily Score Widget */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/60 to-slate-800 border border-emerald-700/40 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Today's Eco Score</span>
                <p className="text-3xl font-black text-slate-100 mt-1">{data.sustainabilityScore} / 100</p>
                <div className="mt-2 flex items-center justify-center space-x-2 text-xs">
                  <span className="flex items-center text-amber-400 font-bold">
                    <Flame className="w-3.5 h-3.5 mr-1" /> {data.streakDays} Days
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center text-emerald-300 font-bold">
                    <Award className="w-3.5 h-3.5 mr-1" /> {data.profile.ecoPoints} Pts
                  </span>
                </div>
              </div>

              {/* Background GPS Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Background Location Service</h4>
                  <p className="text-[10px] text-slate-400">Pure GPS features (Speed, Distance, Stops)</p>
                </div>
                <button
                  onClick={() => setBgTrackingActive(!bgTrackingActive)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    bgTrackingActive ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                      bgTrackingActive ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Quick Trip Recorder Card */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-200">GPS Location Trip Tracker</span>
                  <Navigation className="w-4 h-4 text-amber-400" />
                </div>

                {isSimulatingTrip && (
                  <div className="grid grid-cols-2 gap-2 text-center bg-slate-900 p-2.5 rounded-xl border border-slate-700 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Speed</span>
                      <p className="font-bold text-amber-400">{simSpeed} km/h</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Haversine</span>
                      <p className="font-bold text-emerald-400">{simDistance} km</p>
                    </div>
                  </div>
                )}

                {!isSimulatingTrip ? (
                  <button
                    onClick={handleStartMobileTrip}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Start GPS Tracking</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopMobileTrip}
                    className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2"
                  >
                    <Square className="w-4 h-4 fill-slate-950" />
                    <span>Stop & Classify Mode</span>
                  </button>
                )}
              </div>

              {statusMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] text-center font-medium">
                  {statusMsg}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gps' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-200">GPS Trajectory Log (Haversine)</h4>
              <p className="text-[11px] text-slate-400">
                Transport modes are inferred strictly from lat, lng, speed profiles and stop durations.
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                  <span className="font-semibold text-slate-200">Walking Classifier</span>
                  <span className="text-emerald-400">Speed ≤ 6 km/h</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                  <span className="font-semibold text-slate-200">Cycling Classifier</span>
                  <span className="text-emerald-400">Speed ≤ 20 km/h</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                  <span className="font-semibold text-slate-200">Bus Classifier</span>
                  <span className="text-amber-400">Freq Stops + 30km/h</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex justify-between">
                  <span className="font-semibold text-slate-200">Train Classifier</span>
                  <span className="text-sky-400">Speed &gt; 50 km/h</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="space-y-3 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-200 text-sm">Quick Photo Scanner</h4>
              <p className="text-xs text-slate-400">Snap power bills, store receipts, meal plates, or recycling items.</p>
              <button
                onClick={() => alert('Mobile Camera Active: Switch to Web module tabs for full file upload.')}
                className="mt-2 px-5 py-2 rounded-xl bg-purple-600 text-slate-100 font-bold text-xs"
              >
                Launch Mobile Camera
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Tab Bar */}
        <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center justify-around shrink-0 text-[10px]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1 ${activeTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            <Smartphone className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab('gps')}
            className={`flex flex-col items-center py-1 ${activeTab === 'gps' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            <Navigation className="w-4 h-4 mb-0.5" />
            <span>GPS Trips</span>
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex flex-col items-center py-1 ${activeTab === 'camera' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
          >
            <Camera className="w-4 h-4 mb-0.5" />
            <span>Snap OCR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
