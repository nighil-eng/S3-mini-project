import mongoose from 'mongoose';

// MongoDB URI from environment variables or default local URI
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;

export async function connectMongoDB(): Promise<boolean> {
  if (!MONGODB_URI) {
    console.log('ℹ️  No MONGODB_URI found in environment. Running with in-memory JSON database.');
    return false;
  }

  try {
    if (mongoose.connection.readyState >= 1) {
      return true;
    }
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    return false;
  }
}

// Schemas & Models
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: 'user' },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
});

const ElectricityBillSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  consumerNumber: String,
  billingDate: String,
  unitsKwh: Number,
  co2Kg: Number,
  billAmount: Number,
  utilityProvider: String,
  fileUrl: String,
  rawOcrText: String,
  createdAt: { type: Date, default: Date.now },
});

const ShoppingReceiptSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  storeName: String,
  purchaseDate: String,
  totalAmount: Number,
  items: [
    {
      name: String,
      quantity: Number,
      category: String,
      price: Number,
      co2Kg: Number,
    },
  ],
  totalCo2Kg: Number,
  receiptImageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const TripSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  transportMode: String,
  distanceKm: Number,
  avgSpeedKmh: Number,
  maxSpeedKmh: Number,
  durationMins: Number,
  co2Kg: Number,
  startAddress: String,
  endAddress: String,
  gpsLogs: [
    {
      latitude: Number,
      longitude: Number,
      timestamp: Number,
      speedKmh: Number,
    },
  ],
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now },
});

const FoodRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  foodName: String,
  category: String,
  portionGrams: Number,
  co2Kg: Number,
  healthScore: Number,
  imageUrl: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const WasteRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  wasteType: String,
  weightKg: Number,
  disposalMethod: String,
  co2SavedKg: Number,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ElectricityBillModel = mongoose.models.ElectricityBill || mongoose.model('ElectricityBill', ElectricityBillSchema);
export const ShoppingReceiptModel = mongoose.models.ShoppingReceipt || mongoose.model('ShoppingReceipt', ShoppingReceiptSchema);
export const TripModel = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
export const FoodRecordModel = mongoose.models.FoodRecord || mongoose.model('FoodRecord', FoodRecordSchema);
export const WasteRecordModel = mongoose.models.WasteRecord || mongoose.model('WasteRecord', WasteRecordSchema);
