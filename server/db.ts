import {
  User,
  UserProfile,
  ElectricityBill,
  ShoppingReceipt,
  TripRecord,
  FoodRecord,
  WasteRecord,
  DailyCarbonRecord,
  PredictionSummary,
  Recommendation,
  ChatMessage,
  EcoNotification,
  DashboardData,
} from '../src/types';

// Seed User & Profile
export const DEFAULT_USER: User = {
  id: 'usr_eco_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@ecotrack.ai',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  createdAt: new Date('2025-01-01').toISOString(),
};

export const DEFAULT_PROFILE: UserProfile = {
  userId: 'usr_eco_01',
  targetMonthlyFootprint: 250, // 250 kg CO2 target
  ecoGoal: 'reduce_20',
  ecoPoints: 1240,
  streakDays: 14,
  country: 'United States',
  gridFactorKgPerKwh: 0.82,
};

// Seed Electricity Bills Collection
export let ELECTRICITY_BILLS: ElectricityBill[] = [
  {
    id: 'bill_01',
    userId: 'usr_eco_01',
    consumerNumber: 'ELEC-987412',
    billingDate: '2026-07-05',
    unitsKwh: 240,
    co2Kg: 196.8, // 240 * 0.82
    billAmount: 52.8,
    utilityProvider: 'EcoPower Energy Grid',
    createdAt: '2026-07-05T10:00:00.000Z',
  },
  {
    id: 'bill_02',
    userId: 'usr_eco_01',
    consumerNumber: 'ELEC-987412',
    billingDate: '2026-06-02',
    unitsKwh: 290,
    co2Kg: 237.8,
    billAmount: 64.2,
    utilityProvider: 'EcoPower Energy Grid',
    createdAt: '2026-06-02T10:00:00.000Z',
  },
];

// Seed Shopping Receipts Collection
export let SHOPPING_RECEIPTS: ShoppingReceipt[] = [
  {
    id: 'rcpt_01',
    userId: 'usr_eco_01',
    storeName: 'GreenEarth Organics Supermarket',
    purchaseDate: '2026-07-20',
    totalAmount: 68.5,
    items: [
      { name: 'Organic Almond Milk 1L', quantity: 2, category: 'Groceries', price: 7.98, co2Kg: 1.4 },
      { name: 'Fairtrade Cotton T-Shirt', quantity: 1, category: 'Clothing', price: 24.5, co2Kg: 3.8 },
      { name: 'Avocado Bag 1kg', quantity: 1, category: 'Groceries', price: 5.99, co2Kg: 1.1 },
      { name: 'Eco Bamboo Toothbrush 4-Pack', quantity: 1, category: 'Personal Care', price: 9.99, co2Kg: 0.3 },
    ],
    totalCo2Kg: 6.6,
    createdAt: '2026-07-20T14:30:00.000Z',
  },
];

// Seed Trips Collection (GPS Transportation)
export let TRIPS: TripRecord[] = [
  {
    id: 'trip_01',
    userId: 'usr_eco_01',
    transportMode: 'Electric Car',
    distanceKm: 18.4,
    avgSpeedKmh: 42.5,
    maxSpeedKmh: 68.0,
    durationMins: 26,
    co2Kg: 0.98,
    startAddress: '742 Evergreen Terrace, Springfield',
    endAddress: 'Eco Tech Innovation Hub, Downtown',
    gpsLogs: [
      { latitude: 37.7749, longitude: -122.4194, timestamp: 1784712000000, speedKmh: 0 },
      { latitude: 37.7833, longitude: -122.4167, timestamp: 1784712600000, speedKmh: 45 },
      { latitude: 37.7915, longitude: -122.4089, timestamp: 1784713560000, speedKmh: 68 },
    ],
    status: 'completed',
    createdAt: '2026-07-22T08:15:00.000Z',
  },
  {
    id: 'trip_02',
    userId: 'usr_eco_01',
    transportMode: 'Cycling',
    distanceKm: 6.2,
    avgSpeedKmh: 15.2,
    maxSpeedKmh: 22.0,
    durationMins: 24,
    co2Kg: 0.0,
    startAddress: 'Central City Park',
    endAddress: 'Springfield Community Garden',
    gpsLogs: [],
    status: 'completed',
    createdAt: '2026-07-21T17:00:00.000Z',
  },
];

// Seed Food Records Collection
export let FOOD_RECORDS: FoodRecord[] = [
  {
    id: 'food_01',
    userId: 'usr_eco_01',
    foodName: 'Grilled Tofu Buddha Bowl',
    category: 'Plant-based',
    portionGrams: 450,
    co2Kg: 0.85,
    healthScore: 9,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300',
    notes: 'Quinoa, roasted veggies, avocado & sesame dressing',
    createdAt: '2026-07-22T12:30:00.000Z',
  },
  {
    id: 'food_02',
    userId: 'usr_eco_01',
    foodName: 'Wild Caught Salmon Salad',
    category: 'Fish/Seafood',
    portionGrams: 380,
    co2Kg: 2.1,
    healthScore: 8,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300',
    createdAt: '2026-07-21T19:15:00.000Z',
  },
];

// Seed Waste Records Collection
export let WASTE_RECORDS: WasteRecord[] = [
  {
    id: 'waste_01',
    userId: 'usr_eco_01',
    wasteType: 'Plastic',
    weightKg: 2.5,
    disposalMethod: 'Recycled',
    co2SavedKg: 3.75, // Recycling plastic saves ~1.5 kg CO2/kg
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=300',
    createdAt: '2026-07-20T09:00:00.000Z',
  },
  {
    id: 'waste_02',
    userId: 'usr_eco_01',
    wasteType: 'Organic Food Waste',
    weightKg: 4.0,
    disposalMethod: 'Composted',
    co2SavedKg: 2.8,
    createdAt: '2026-07-18T18:00:00.000Z',
  },
];

// Seed Recommendations Collection
export let RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec_01',
    userId: 'usr_eco_01',
    title: 'Switch 2 Commutes to Cycling or Public Bus',
    description: 'Replacing two short solo car trips with cycling saves ~4.2 kg CO₂ weekly while improving cardiovascular health.',
    category: 'Transportation',
    estimatedCo2SavingKg: 18.5,
    difficulty: 'Easy',
    completed: false,
    pointsReward: 150,
    createdAt: '2026-07-20T00:00:00.000Z',
  },
  {
    id: 'rec_02',
    userId: 'usr_eco_01',
    title: 'Adopt Meatless Mondays',
    description: 'Substituting red meat dinners with plant-based alternatives 1 day a week reduces dietary footprint by ~15%.',
    category: 'Food',
    estimatedCo2SavingKg: 12.0,
    difficulty: 'Easy',
    completed: true,
    pointsReward: 100,
    createdAt: '2026-07-15T00:00:00.000Z',
  },
  {
    id: 'rec_03',
    userId: 'usr_eco_01',
    title: 'Install Smart Power Strips for Phantom Load',
    description: 'Electronics on standby consume up to 10% of household power. Smart plugs cut phantom energy loss automatically.',
    category: 'Electricity',
    estimatedCo2SavingKg: 22.4,
    difficulty: 'Medium',
    completed: false,
    pointsReward: 200,
    createdAt: '2026-07-18T00:00:00.000Z',
  },
];

// Seed Chat History Collection
export let CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    sender: 'assistant',
    text: "Hello Alex! I am your AI Eco Assistant. I have analyzed your recent energy, transport, and food logs. Your sustainability score is 84/100 (Grade A)! How can I help you optimize your carbon footprint today?",
    timestamp: new Date().toISOString(),
    suggestedActions: [
      'Explain my monthly footprint',
      'How to reduce electricity bill CO2?',
      'Suggest low-carbon food alternatives',
    ],
  },
];

// Seed Notifications Collection
export let NOTIFICATIONS: EcoNotification[] = [
  {
    id: 'notif_01',
    title: '🔥 14-Day Eco Streak!',
    message: 'You have logged green activities for 14 consecutive days. Earned +50 Eco Points!',
    type: 'achievement',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif_02',
    title: '⚡ Electricity Bill Processed',
    message: 'July electricity bill OCR completed: 240 kWh (196.8 kg CO₂e).',
    type: 'tip',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper functions for MongoDB-like aggregation
export function getAggregatedDashboardData(): DashboardData {
  const electricityTotal = ELECTRICITY_BILLS.reduce((sum, b) => sum + b.co2Kg, 0);
  const transportTotal = TRIPS.reduce((sum, t) => sum + t.co2Kg, 0);
  const shoppingTotal = SHOPPING_RECEIPTS.reduce((sum, r) => sum + r.totalCo2Kg, 0);
  const foodTotal = FOOD_RECORDS.reduce((sum, f) => sum + f.co2Kg, 0);
  const wasteSavings = WASTE_RECORDS.reduce((sum, w) => sum + w.co2SavedKg, 0);

  const totalCo2ThisMonth = Math.max(0, electricityTotal + transportTotal + shoppingTotal + foodTotal - wasteSavings);
  const previousMonthCo2 = 285.4; // Benchmark previous month

  // Compute sustainability score: 100 - (Current/Target * 50) + WasteBonus
  const ratio = totalCo2ThisMonth / DEFAULT_PROFILE.targetMonthlyFootprint;
  let score = Math.round(Math.max(10, Math.min(100, 100 - (ratio - 0.7) * 40)));
  if (score > 100) score = 100;

  let ecoGrade = 'A';
  if (score >= 90) ecoGrade = 'A+';
  else if (score >= 80) ecoGrade = 'A';
  else if (score >= 70) ecoGrade = 'B';
  else if (score >= 60) ecoGrade = 'C';
  else ecoGrade = 'D';

  const monthlyTrends = [
    { month: 'Feb', electricity: 260, transport: 65, shopping: 45, food: 70, total: 440 },
    { month: 'Mar', electricity: 245, transport: 58, shopping: 40, food: 68, total: 411 },
    { month: 'Apr', electricity: 230, transport: 50, shopping: 38, food: 62, total: 380 },
    { month: 'May', electricity: 210, transport: 42, shopping: 35, food: 58, total: 345 },
    { month: 'Jun', electricity: 237.8, transport: 35, shopping: 30, food: 55, total: 357.8 },
    { month: 'Jul', electricity: 196.8, transport: Number(transportTotal.toFixed(1)), shopping: Number(shoppingTotal.toFixed(1)), food: Number(foodTotal.toFixed(1)), total: Number(totalCo2ThisMonth.toFixed(1)) },
  ];

  const recentActivities = [
    ...ELECTRICITY_BILLS.map((b) => ({
      id: b.id,
      type: 'Electricity' as const,
      title: `Electricity Bill (${b.unitsKwh} kWh)`,
      detail: `${b.utilityProvider} - Bill Date ${b.billingDate}`,
      co2Kg: b.co2Kg,
      time: b.createdAt,
    })),
    ...SHOPPING_RECEIPTS.map((r) => ({
      id: r.id,
      type: 'Shopping' as const,
      title: `Receipt: ${r.storeName}`,
      detail: `${r.items.length} items purchased ($${r.totalAmount})`,
      co2Kg: r.totalCo2Kg,
      time: r.createdAt,
    })),
    ...TRIPS.map((t) => ({
      id: t.id,
      type: 'Transportation' as const,
      title: `${t.transportMode} Trip (${t.distanceKm} km)`,
      detail: `${t.startAddress} ➔ ${t.endAddress}`,
      co2Kg: t.co2Kg,
      time: t.createdAt,
    })),
    ...FOOD_RECORDS.map((f) => ({
      id: f.id,
      type: 'Food' as const,
      title: `Meal: ${f.foodName}`,
      detail: `${f.category} (${f.portionGrams}g)`,
      co2Kg: f.co2Kg,
      time: f.createdAt,
    })),
    ...WASTE_RECORDS.map((w) => ({
      id: w.id,
      type: 'Waste' as const,
      title: `Diverted ${w.weightKg}kg ${w.wasteType}`,
      detail: `Method: ${w.disposalMethod} (-${w.co2SavedKg}kg CO₂)`,
      co2Kg: -w.co2SavedKg,
      time: w.createdAt,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  return {
    user: DEFAULT_USER,
    profile: DEFAULT_PROFILE,
    totalCo2ThisMonth: Number(totalCo2ThisMonth.toFixed(1)),
    previousMonthCo2,
    sustainabilityScore: score,
    ecoGrade,
    streakDays: DEFAULT_PROFILE.streakDays,
    categoryBreakdown: {
      electricity: Number(electricityTotal.toFixed(1)),
      transportation: Number(transportTotal.toFixed(1)),
      shopping: Number(shoppingTotal.toFixed(1)),
      food: Number(foodTotal.toFixed(1)),
      wasteSavings: Number(wasteSavings.toFixed(1)),
    },
    monthlyTrends,
    recentActivities,
  };
}
