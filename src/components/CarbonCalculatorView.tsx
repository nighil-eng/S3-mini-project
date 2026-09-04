import React, { useState } from 'react';
import { Calculator, RefreshCw, BarChart2, ShieldCheck, Target, Layers } from 'lucide-react';
import { DashboardData } from '../types';

interface CarbonCalculatorViewProps {
  data: DashboardData;
}

export const CarbonCalculatorView: React.FC<CarbonCalculatorViewProps> = ({ data }) => {
  // Calculator Interactive State
  const [kwhMonthly, setKwhMonthly] = useState(240);
  const [carKmWeekly, setCarKmWeekly] = useState(60);
  const [busKmWeekly, setBusKmWeekly] = useState(30);
  const [flightsYearly, setFlightsYearly] = useState(2);
  const [meatDaysWeekly, setMeatDaysWeekly] = useState(3);
  const [recyclePercent, setRecyclePercent] = useState(70);

  // Math Calculations
  const electricityCo2 = kwhMonthly * 0.82; // 0.82 kg CO2 / kWh
  const transportCo2Monthly = (carKmWeekly * 0.192 + busKmWeekly * 0.089) * 4.33; // monthly
  const flightCo2Monthly = (flightsYearly * 450) / 12; // avg 450kg CO2 per short/med flight
  const foodCo2Monthly = (meatDaysWeekly * 3.8 + (7 - meatDaysWeekly) * 1.2) * 4.33;
  const wasteOffsetMonthly = (recyclePercent / 100) * 18; // up to 18kg offset

  const calculatedMonthlyTotal = Number(
    (electricityCo2 + transportCo2Monthly + flightCo2Monthly + foodCo2Monthly - wasteOffsetMonthly).toFixed(1)
  );

  const calculatedYearlyTotal = Number(((calculatedMonthlyTotal * 12) / 1000).toFixed(2)); // in metric tonnes

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Aggregated Carbon Engine</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1">Master Carbon Footprint Calculator</h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate custom habits across electricity, transportation, flights, dietary choices, and recycling to test footprint reduction scenarios.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-emerald-500/10 border border-emerald-500/30 px-5 py-3 rounded-2xl">
          <div>
            <p className="text-[11px] text-emerald-300">Simulated Monthly CO₂</p>
            <p className="text-2xl font-black text-emerald-400">{calculatedMonthlyTotal} kg CO₂e</p>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <p className="text-[11px] text-slate-300">Annual Footprint</p>
            <p className="text-xl font-bold text-slate-100">{calculatedYearlyTotal} Tonnes</p>
          </div>
        </div>
      </div>

      {/* Calculator Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Interactive Scenario Controls</span>
          </h3>

          {/* Electricity slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">⚡ Electricity Usage (kWh / month)</span>
              <span className="text-sky-400">{kwhMonthly} kWh ({electricityCo2.toFixed(1)} kg CO₂)</span>
            </div>
            <input
              type="range"
              min="50"
              max="800"
              value={kwhMonthly}
              onChange={(e) => setKwhMonthly(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Car Distance slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">🚗 Gas Car Driving (km / week)</span>
              <span className="text-amber-400">{carKmWeekly} km</span>
            </div>
            <input
              type="range"
              min="0"
              max="400"
              value={carKmWeekly}
              onChange={(e) => setCarKmWeekly(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Public Bus slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">🚌 Bus Transit (km / week)</span>
              <span className="text-emerald-400">{busKmWeekly} km</span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              value={busKmWeekly}
              onChange={(e) => setBusKmWeekly(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Meat Days slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">🥩 Meat Meals (days / week)</span>
              <span className="text-red-400">{meatDaysWeekly} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              value={meatDaysWeekly}
              onChange={(e) => setMeatDaysWeekly(Number(e.target.value))}
              className="w-full accent-red-400 cursor-pointer"
            />
          </div>

          {/* Flights yearly slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">✈️ Flights (per year)</span>
              <span className="text-purple-400">{flightsYearly} flights</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={flightsYearly}
              onChange={(e) => setFlightsYearly(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Recycling percentage */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">♻️ Waste Recycling Rate (%)</span>
              <span className="text-teal-400">{recyclePercent}% (-{wasteOffsetMonthly.toFixed(1)} kg)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={recyclePercent}
              onChange={(e) => setRecyclePercent(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Results & Comparison Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2 mb-4">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Simulated Monthly Emissions Breakdown</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Electricity</span>
                  <span className="font-semibold text-sky-400">{electricityCo2.toFixed(1)} kg</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, (electricityCo2 / calculatedMonthlyTotal) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Transportation & Transit</span>
                  <span className="font-semibold text-amber-400">{transportCo2Monthly.toFixed(1)} kg</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, (transportCo2Monthly / calculatedMonthlyTotal) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Dietary Footprint</span>
                  <span className="font-semibold text-red-400">{foodCo2Monthly.toFixed(1)} kg</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, (foodCo2Monthly / calculatedMonthlyTotal) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Air Travel Amortized</span>
                  <span className="font-semibold text-purple-400">{flightCo2Monthly.toFixed(1)} kg</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, (flightCo2Monthly / calculatedMonthlyTotal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex justify-between items-center font-semibold text-slate-100">
              <span>National Average Comparison</span>
              <span className="text-emerald-400">380 kg CO₂ / month</span>
            </div>
            <p className="text-slate-400">
              Your simulated scenario produces <span className="text-emerald-300 font-bold">{Math.round(100 - (calculatedMonthlyTotal / 380) * 100)}% less carbon</span> than the average household!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
