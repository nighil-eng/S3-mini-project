export type UserRole = 'user' | 'admin' | 'auditor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  targetMonthlyFootprint: number; // in kg CO2e
  ecoGoal: 'reduce_20' | 'carbon_neutral' | 'eco_champion';
  ecoPoints: number;
  streakDays: number;
  country: string;
  gridFactorKgPerKwh: number; // default ~0.82
}

export interface ElectricityBill {
  id: string;
  userId: string;
  consumerNumber: string;
  billingDate: string;
  unitsKwh: number;
  co2Kg: number;
  billAmount: number;
  utilityProvider: string;
  fileUrl?: string;
  rawOcrText?: string;
  createdAt: string;
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  category: 'Groceries' | 'Clothing' | 'Electronics' | 'Home' | 'Personal Care' | 'Other';
  price: number;
  co2Kg: number;
}

export interface ShoppingReceipt {
  id: string;
  userId: string;
  storeName: string;
  purchaseDate: string;
  totalAmount: number;
  items: ShoppingItem[];
  totalCo2Kg: number;
  receiptImageUrl?: string;
  createdAt: string;
}

export interface GpsPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speedKmh: number;
}

export type TransportMode = 'Walking' | 'Cycling' | 'Electric Bike' | 'Gasoline Car' | 'Electric Car' | 'Public Bus' | 'Train';

export interface TripRecord {
  id: string;
  userId: string;
  transportMode: TransportMode;
  distanceKm: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  durationMins: number;
  co2Kg: number;
  startAddress: string;
  endAddress: string;
  gpsLogs: GpsPoint[];
  status: 'completed' | 'in_progress';
  createdAt: string;
}

export interface FoodRecord {
  id: string;
  userId: string;
  foodName: string;
  category: 'Red Meat' | 'Poultry' | 'Fish/Seafood' | 'Dairy/Eggs' | 'Plant-based' | 'Grains/Veg';
  portionGrams: number;
  co2Kg: number;
  healthScore: number; // 1-10
  imageUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface WasteRecord {
  id: string;
  userId: string;
  wasteType: 'Plastic' | 'Paper/Cardboard' | 'Metal/Aluminium' | 'Glass' | 'Organic Food Waste' | 'E-Waste';
  weightKg: number;
  disposalMethod: 'Recycled' | 'Composted' | 'Landfill';
  co2SavedKg: number;
  imageUrl?: string;
  createdAt: string;
}

export interface DailyCarbonRecord {
  id: string;
  userId: string;
  date: string;
  electricityCo2: number;
  transportCo2: number;
  shoppingCo2: number;
  foodCo2: number;
  wasteCo2Saved: number;
  netCo2Kg: number;
  sustainabilityScore: number;
}

export interface PredictionSummary {
  userId: string;
  generatedAt: string;
  day30ProjectionKg: number;
  day60ProjectionKg: number;
  day90ProjectionKg: number;
  baselineMonthlyKg: number;
  potentialReductionKg: number;
  trendDirection: 'decreasing' | 'stable' | 'increasing';
  monthlyProjections: { month: string; projectedKg: number; targetKg: number }[];
  scenarios: {
    name: string;
    savingKg: number;
    description: string;
  }[];
}

export interface Recommendation {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'Electricity' | 'Transportation' | 'Shopping' | 'Food' | 'Waste';
  estimatedCo2SavingKg: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  pointsReward: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface EcoNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'achievement' | 'tip';
  read: boolean;
  createdAt: string;
}

export interface DashboardData {
  user: User;
  profile: UserProfile;
  totalCo2ThisMonth: number;
  previousMonthCo2: number;
  sustainabilityScore: number; // 0-100
  ecoGrade: string; // A+, A, B, C, D, F
  streakDays: number;
  categoryBreakdown: {
    electricity: number;
    transportation: number;
    shopping: number;
    food: number;
    wasteSavings: number;
  };
  monthlyTrends: { month: string; electricity: number; transport: number; shopping: number; food: number; total: number }[];
  recentActivities: {
    id: string;
    type: 'Electricity' | 'Transportation' | 'Shopping' | 'Food' | 'Waste';
    title: string;
    detail: string;
    co2Kg: number;
    time: string;
  }[];
}
