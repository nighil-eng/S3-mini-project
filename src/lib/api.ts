import { DashboardData, ElectricityBill, ShoppingReceipt, TripRecord, FoodRecord, WasteRecord, Recommendation, ChatMessage, EcoNotification, User } from '../types';

export async function loginUser(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed' };
  }
}

export async function registerUser(name: string, email: string, password?: string, role?: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed' };
  }
}

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch('/api/dashboard');
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

export async function fetchElectricityBills(): Promise<ElectricityBill[]> {
  const res = await fetch('/api/electricity');
  return res.json();
}

export async function uploadElectricityBillOcr(imageBase64: string, mimeType: string = 'image/png') {
  const res = await fetch('/api/electricity/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  });
  return res.json();
}

export async function deleteElectricityBill(id: string) {
  const res = await fetch(`/api/electricity/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchShoppingReceipts(): Promise<ShoppingReceipt[]> {
  const res = await fetch('/api/shopping');
  return res.json();
}

export async function uploadReceiptOcr(imageBase64: string, mimeType: string = 'image/png') {
  const res = await fetch('/api/shopping/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  });
  return res.json();
}

export async function deleteShoppingReceipt(id: string) {
  const res = await fetch(`/api/shopping/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchTrips(): Promise<TripRecord[]> {
  const res = await fetch('/api/transport');
  return res.json();
}

export async function processGpsTrip(gpsLogs: any[], startAddress?: string, endAddress?: string) {
  const res = await fetch('/api/transport/process-gps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gpsLogs, startAddress, endAddress }),
  });
  return res.json();
}

export async function deleteTrip(id: string) {
  const res = await fetch(`/api/transport/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchFoodRecords(): Promise<FoodRecord[]> {
  const res = await fetch('/api/food');
  return res.json();
}

export async function analyzeFoodImage(imageBase64: string, mimeType: string = 'image/png') {
  const res = await fetch('/api/food/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  });
  return res.json();
}

export async function deleteFoodRecord(id: string) {
  const res = await fetch(`/api/food/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchWasteRecords(): Promise<WasteRecord[]> {
  const res = await fetch('/api/waste');
  return res.json();
}

export async function analyzeWasteImage(imageBase64: string, mimeType: string = 'image/png') {
  const res = await fetch('/api/waste/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType }),
  });
  return res.json();
}

export async function deleteWasteRecord(id: string) {
  const res = await fetch(`/api/waste/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchPredictions() {
  const res = await fetch('/api/predictions');
  return res.json();
}

export async function fetchRecommendations(): Promise<Recommendation[]> {
  const res = await fetch('/api/recommendations');
  return res.json();
}

export async function toggleRecommendation(id: string) {
  const res = await fetch(`/api/recommendations/${id}/toggle`, { method: 'POST' });
  return res.json();
}

export async function sendChatMessage(message: string): Promise<{ success: boolean; message: ChatMessage }> {
  const res = await fetch('/api/chatbot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return res.json();
}

export async function fetchChatHistory(): Promise<ChatMessage[]> {
  const res = await fetch('/api/chatbot');
  return res.json();
}

export async function fetchNotifications(): Promise<EcoNotification[]> {
  const res = await fetch('/api/notifications');
  return res.json();
}

export async function fetchReportSummary() {
  const res = await fetch('/api/reports/summary');
  return res.json();
}
