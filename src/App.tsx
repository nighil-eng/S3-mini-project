import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { ElectricityView } from './components/ElectricityView';
import { ShoppingView } from './components/ShoppingView';
import { TransportView } from './components/TransportView';
import { FoodView } from './components/FoodView';
import { WasteView } from './components/WasteView';
import { CarbonCalculatorView } from './components/CarbonCalculatorView';
import { PredictionsView } from './components/PredictionsView';
import { RecommendationsView } from './components/RecommendationsView';
import { ChatbotView } from './components/ChatbotView';
import { ReportsView } from './components/ReportsView';
import { MobileSimulatorView } from './components/MobileSimulatorView';

import {
  fetchDashboard,
  fetchElectricityBills,
  fetchShoppingReceipts,
  fetchTrips,
  fetchFoodRecords,
  fetchWasteRecords,
  fetchNotifications,
} from './lib/api';
import { DashboardData, ElectricityBill, ShoppingReceipt, TripRecord, FoodRecord, WasteRecord, EcoNotification, User } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSimOpen, setIsMobileSimOpen] = useState<boolean>(false);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>([]);
  const [shoppingReceipts, setShoppingReceipts] = useState<ShoppingReceipt[]>([]);
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [foodRecords, setFoodRecords] = useState<FoodRecord[]>([]);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [notifications, setNotifications] = useState<EcoNotification[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [dash, bills, receipts, tripList, food, waste, notifs] = await Promise.all([
        fetchDashboard(),
        fetchElectricityBills(),
        fetchShoppingReceipts(),
        fetchTrips(),
        fetchFoodRecords(),
        fetchWasteRecords(),
        fetchNotifications(),
      ]);

      setDashboardData(dash);
      setElectricityBills(bills);
      setShoppingReceipts(receipts);
      setTrips(tripList);
      setFoodRecords(food);
      setWasteRecords(waste);
      setNotifications(notifs);
    } catch (err) {
      console.error('Error loading app state:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user: User) => {
    if (dashboardData) {
      setDashboardData({
        ...dashboardData,
        user: { ...dashboardData.user, name: user.name, email: user.email, avatar: user.avatar || dashboardData.user.avatar },
      });
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Initializing EcoTrack AI Carbon Platform...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        user={dashboardData.user}
        profile={dashboardData.profile}
        notifications={notifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileSimOpen={isMobileSimOpen}
        setIsMobileSimOpen={setIsMobileSimOpen}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthenticated(false)}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileSimOpen={isMobileSimOpen}
          setIsMobileSimOpen={setIsMobileSimOpen}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthenticated(false)}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto min-w-0">
          {activeTab === 'dashboard' && <DashboardView data={dashboardData} setActiveTab={setActiveTab} />}
          {activeTab === 'electricity' && <ElectricityView bills={electricityBills} onRefresh={loadAllData} />}
          {activeTab === 'shopping' && <ShoppingView receipts={shoppingReceipts} onRefresh={loadAllData} />}
          {activeTab === 'transport' && <TransportView trips={trips} onRefresh={loadAllData} />}
          {activeTab === 'food' && <FoodView records={foodRecords} onRefresh={loadAllData} />}
          {activeTab === 'waste' && <WasteView records={wasteRecords} onRefresh={loadAllData} />}
          {activeTab === 'calculator' && <CarbonCalculatorView data={dashboardData} />}
          {activeTab === 'predictions' && <PredictionsView />}
          {activeTab === 'recommendations' && <RecommendationsView onRefresh={loadAllData} />}
          {activeTab === 'chatbot' && <ChatbotView />}
          {activeTab === 'reports' && <ReportsView />}
        </main>
      </div>

      {/* React Native Mobile Simulator Modal */}
      {isMobileSimOpen && (
        <MobileSimulatorView
          data={dashboardData}
          onRefresh={loadAllData}
          onClose={() => setIsMobileSimOpen(false)}
        />
      )}
    </div>
  );
}
