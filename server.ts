import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  DEFAULT_USER,
  DEFAULT_PROFILE,
  ELECTRICITY_BILLS,
  SHOPPING_RECEIPTS,
  TRIPS,
  FOOD_RECORDS,
  WASTE_RECORDS,
  RECOMMENDATIONS,
  CHAT_MESSAGES,
  NOTIFICATIONS,
  getAggregatedDashboardData,
} from './server/db';
import {
  ocrElectricityBill,
  ocrShoppingReceipt,
  analyzeFoodPhoto,
  analyzeWastePhoto,
  generatePredictions,
  chatWithEcoAssistant,
} from './server/gemini';
import { classifyTransportModeFromGps, EMISSION_FACTORS_PER_KM } from './src/lib/haversine';
import { GpsPoint } from './src/types';
import { connectMongoDB } from './server/mongo';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize MongoDB connection if MONGODB_URI is provided
  await connectMongoDB();

  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Routes
  // ------------------------------
  // Auth & Profile
  app.get('/api/auth/me', (req, res) => {
    res.json({ user: DEFAULT_USER, profile: DEFAULT_PROFILE });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    const name = email ? email.split('@')[0].replace('.', ' ') : DEFAULT_USER.name;
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    res.json({
      token: 'jwt_mock_token_ecotrack_2026',
      user: {
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
        name: email === DEFAULT_USER.email ? DEFAULT_USER.name : formattedName,
      },
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, role } = req.body;
    res.json({
      token: 'jwt_mock_token_ecotrack_2026',
      user: {
        id: `u_${Date.now()}`,
        name: name || 'Eco Warrior',
        email: email || 'user@ecotrack.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      },
    });
  });

  app.put('/api/profile', (req, res) => {
    const { targetMonthlyFootprint, ecoGoal, country } = req.body;
    if (targetMonthlyFootprint) DEFAULT_PROFILE.targetMonthlyFootprint = Number(targetMonthlyFootprint);
    if (ecoGoal) DEFAULT_PROFILE.ecoGoal = ecoGoal;
    if (country) DEFAULT_PROFILE.country = country;
    res.json(DEFAULT_PROFILE);
  });

  // Dashboard Aggregation
  app.get('/api/dashboard', (req, res) => {
    res.json(getAggregatedDashboardData());
  });

  // Electricity Module
  app.get('/api/electricity', (req, res) => {
    res.json(ELECTRICITY_BILLS);
  });

  app.post('/api/electricity/ocr', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      const result = await ocrElectricityBill(imageBase64, mimeType);

      // Compute CO2 = units * grid factor (0.82 kg CO2 / kWh)
      const unitsKwh = Number(result.unitsKwh) || 150;
      const co2Kg = Number((unitsKwh * DEFAULT_PROFILE.gridFactorKgPerKwh).toFixed(2));

      const newBill = {
        id: `bill_${Date.now()}`,
        userId: DEFAULT_USER.id,
        consumerNumber: result.consumerNumber || 'ELEC-102938',
        billingDate: result.billingDate || new Date().toISOString().split('T')[0],
        unitsKwh,
        co2Kg,
        billAmount: Number(result.billAmount) || 45,
        utilityProvider: result.utilityProvider || 'Clean Grid Electric',
        rawOcrText: result.rawOcrText,
        createdAt: new Date().toISOString(),
      };

      ELECTRICITY_BILLS.unshift(newBill);
      DEFAULT_PROFILE.ecoPoints += 25;

      res.json({ success: true, bill: newBill });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Electricity OCR failed' });
    }
  });

  app.delete('/api/electricity/:id', (req, res) => {
    const index = ELECTRICITY_BILLS.findIndex((b) => b.id === req.params.id);
    if (index !== -1) ELECTRICITY_BILLS.splice(index, 1);
    res.json({ success: true });
  });

  // Shopping Module
  app.get('/api/shopping', (req, res) => {
    res.json(SHOPPING_RECEIPTS);
  });

  app.post('/api/shopping/ocr', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      const result = await ocrShoppingReceipt(imageBase64, mimeType);

      const items = result.items || [];
      const totalCo2Kg = Number(items.reduce((s: number, i: any) => s + (Number(i.co2Kg) || 0.5), 0).toFixed(2));

      const newReceipt = {
        id: `rcpt_${Date.now()}`,
        userId: DEFAULT_USER.id,
        storeName: result.storeName || 'Eco Retail Store',
        purchaseDate: result.purchaseDate || new Date().toISOString().split('T')[0],
        totalAmount: Number(result.totalAmount) || 35,
        items,
        totalCo2Kg,
        createdAt: new Date().toISOString(),
      };

      SHOPPING_RECEIPTS.unshift(newReceipt);
      DEFAULT_PROFILE.ecoPoints += 30;

      res.json({ success: true, receipt: newReceipt });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Receipt OCR failed' });
    }
  });

  app.delete('/api/shopping/:id', (req, res) => {
    const index = SHOPPING_RECEIPTS.findIndex((r) => r.id === req.params.id);
    if (index !== -1) SHOPPING_RECEIPTS.splice(index, 1);
    res.json({ success: true });
  });

  // Transportation (GPS-only) Module
  app.get('/api/transport', (req, res) => {
    res.json(TRIPS);
  });

  app.post('/api/transport/process-gps', (req, res) => {
    try {
      const { gpsLogs, startAddress, endAddress } = req.body as {
        gpsLogs: GpsPoint[];
        startAddress?: string;
        endAddress?: string;
      };

      if (!gpsLogs || gpsLogs.length < 2) {
        return res.status(400).json({ error: 'At least 2 GPS coordinates are required to classify trip.' });
      }

      // Process strictly via GPS Haversine and trajectory classifier
      const summary = classifyTransportModeFromGps(gpsLogs);
      const co2Kg = Number((summary.totalDistanceKm * summary.co2FactorKgPerKm).toFixed(2));

      const newTrip = {
        id: `trip_${Date.now()}`,
        userId: DEFAULT_USER.id,
        transportMode: summary.mode,
        distanceKm: summary.totalDistanceKm,
        avgSpeedKmh: summary.avgSpeedKmh,
        maxSpeedKmh: summary.maxSpeedKmh,
        durationMins: summary.durationMins,
        co2Kg,
        startAddress: startAddress || 'Starting Point (GPS)',
        endAddress: endAddress || 'Destination (GPS)',
        gpsLogs,
        status: 'completed' as const,
        createdAt: new Date().toISOString(),
      };

      TRIPS.unshift(newTrip);
      DEFAULT_PROFILE.ecoPoints += summary.mode === 'Walking' || summary.mode === 'Cycling' ? 50 : 20;

      res.json({ success: true, trip: newTrip });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Trip calculation failed' });
    }
  });

  app.delete('/api/transport/:id', (req, res) => {
    const index = TRIPS.findIndex((t) => t.id === req.params.id);
    if (index !== -1) TRIPS.splice(index, 1);
    res.json({ success: true });
  });

  // Food Vision Module
  app.get('/api/food', (req, res) => {
    res.json(FOOD_RECORDS);
  });

  app.post('/api/food/analyze', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      const result = await analyzeFoodPhoto(imageBase64, mimeType);

      const newFood = {
        id: `food_${Date.now()}`,
        userId: DEFAULT_USER.id,
        foodName: result.foodName || 'Nourishing Meal',
        category: result.category || 'Plant-based',
        portionGrams: Number(result.portionGrams) || 300,
        co2Kg: Number(result.co2Kg) || 1.2,
        healthScore: Number(result.healthScore) || 8,
        notes: result.notes,
        createdAt: new Date().toISOString(),
      };

      FOOD_RECORDS.unshift(newFood);
      DEFAULT_PROFILE.ecoPoints += 20;

      res.json({ success: true, food: newFood });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Food analysis failed' });
    }
  });

  app.delete('/api/food/:id', (req, res) => {
    const index = FOOD_RECORDS.findIndex((f) => f.id === req.params.id);
    if (index !== -1) FOOD_RECORDS.splice(index, 1);
    res.json({ success: true });
  });

  // Waste Vision Module
  app.get('/api/waste', (req, res) => {
    res.json(WASTE_RECORDS);
  });

  app.post('/api/waste/analyze', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      const result = await analyzeWastePhoto(imageBase64, mimeType);

      const newWaste = {
        id: `waste_${Date.now()}`,
        userId: DEFAULT_USER.id,
        wasteType: result.wasteType || 'Plastic',
        weightKg: Number(result.weightKg) || 1.5,
        disposalMethod: result.disposalMethod || 'Recycled',
        co2SavedKg: Number(result.co2SavedKg) || 2.25,
        createdAt: new Date().toISOString(),
      };

      WASTE_RECORDS.unshift(newWaste);
      DEFAULT_PROFILE.ecoPoints += 35;

      res.json({ success: true, waste: newWaste });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Waste analysis failed' });
    }
  });

  app.delete('/api/waste/:id', (req, res) => {
    const index = WASTE_RECORDS.findIndex((w) => w.id === req.params.id);
    if (index !== -1) WASTE_RECORDS.splice(index, 1);
    res.json({ success: true });
  });

  // Predictions Module
  app.get('/api/predictions', async (req, res) => {
    const aggregated = getAggregatedDashboardData();
    const predictions = await generatePredictions(aggregated);
    res.json(predictions);
  });

  // Recommendations Module
  app.get('/api/recommendations', (req, res) => {
    res.json(RECOMMENDATIONS);
  });

  app.post('/api/recommendations/:id/toggle', (req, res) => {
    const rec = RECOMMENDATIONS.find((r) => r.id === req.params.id);
    if (rec) {
      rec.completed = !rec.completed;
      if (rec.completed) DEFAULT_PROFILE.ecoPoints += rec.pointsReward;
    }
    res.json({ success: true, recommendation: rec });
  });

  // Chatbot Module
  app.get('/api/chatbot', (req, res) => {
    res.json(CHAT_MESSAGES);
  });

  app.post('/api/chatbot', async (req, res) => {
    try {
      const { message } = req.body;
      const userMsg = {
        id: `msg_${Date.now()}`,
        sender: 'user' as const,
        text: message,
        timestamp: new Date().toISOString(),
      };
      CHAT_MESSAGES.push(userMsg);

      const dashboard = getAggregatedDashboardData();
      const reply = await chatWithEcoAssistant(CHAT_MESSAGES, dashboard);

      const assistantMsg = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant' as const,
        text: reply.text,
        timestamp: new Date().toISOString(),
        suggestedActions: reply.suggestedActions,
      };

      CHAT_MESSAGES.push(assistantMsg);

      res.json({ success: true, message: assistantMsg });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Chatbot request failed' });
    }
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    res.json(NOTIFICATIONS);
  });

  // Reports
  app.get('/api/reports/summary', (req, res) => {
    const dashboard = getAggregatedDashboardData();
    res.json({
      title: 'EcoTrack AI Sustainability Audit & Carbon Report',
      generatedDate: new Date().toISOString(),
      user: DEFAULT_USER,
      profile: DEFAULT_PROFILE,
      dashboard,
      recommendations: RECOMMENDATIONS,
    });
  });

  // Vite Middleware in Development vs Static in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoTrack AI Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
