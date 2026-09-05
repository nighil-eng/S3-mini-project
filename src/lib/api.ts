// import { DashboardData, ElectricityBill, ShoppingReceipt, TripRecord, FoodRecord, WasteRecord, Recommendation, ChatMessage, EcoNotification, User } from '../types';

// export async function loginUser(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
//   try {
//     const res = await fetch('/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
//     const data = await res.json();
//     return { success: true, user: data.user };
//   } catch (err: any) {
//     return { success: false, error: err.message || 'Login failed' };
//   }
// }

// export async function registerUser(name: string, email: string, password?: string, role?: string): Promise<{ success: boolean; user?: User; error?: string }> {
//   try {
//     const res = await fetch('/api/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password, role }),
//     });
//     const data = await res.json();
//     return { success: true, user: data.user };
//   } catch (err: any) {
//     return { success: false, error: err.message || 'Registration failed' };
//   }
// }

// export async function fetchDashboard(): Promise<DashboardData> {
//   const res = await fetch('/api/dashboard');
//   if (!res.ok) throw new Error('Failed to fetch dashboard');
//   return res.json();
// }

// export async function fetchElectricityBills(): Promise<ElectricityBill[]> {
//   const res = await fetch('/api/electricity');
//   return res.json();
// }

// export async function uploadElectricityBillOcr(imageBase64: string, mimeType: string = 'image/png') {
//   const res = await fetch('/api/electricity/ocr', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ imageBase64, mimeType }),
//   });
//   return res.json();
// }

// export async function deleteElectricityBill(id: string) {
//   const res = await fetch(`/api/electricity/${id}`, { method: 'DELETE' });
//   return res.json();
// }

// export async function fetchShoppingReceipts(): Promise<ShoppingReceipt[]> {
//   const res = await fetch('/api/shopping');
//   return res.json();
// }

// export async function uploadReceiptOcr(imageBase64: string, mimeType: string = 'image/png') {
//   const res = await fetch('/api/shopping/ocr', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ imageBase64, mimeType }),
//   });
//   return res.json();
// }

// export async function deleteShoppingReceipt(id: string) {
//   const res = await fetch(`/api/shopping/${id}`, { method: 'DELETE' });
//   return res.json();
// }

// export async function fetchTrips(): Promise<TripRecord[]> {
//   const res = await fetch('/api/transport');
//   return res.json();
// }

// export async function processGpsTrip(gpsLogs: any[], startAddress?: string, endAddress?: string) {
//   const res = await fetch('/api/transport/process-gps', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ gpsLogs, startAddress, endAddress }),
//   });
//   return res.json();
// }

// export async function deleteTrip(id: string) {
//   const res = await fetch(`/api/transport/${id}`, { method: 'DELETE' });
//   return res.json();
// }

// export async function fetchFoodRecords(): Promise<FoodRecord[]> {
//   const res = await fetch('/api/food');
//   return res.json();
// }

// export async function analyzeFoodImage(imageBase64: string, mimeType: string = 'image/png') {
//   const res = await fetch('/api/food/analyze', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ imageBase64, mimeType }),
//   });
//   return res.json();
// }

// export async function deleteFoodRecord(id: string) {
//   const res = await fetch(`/api/food/${id}`, { method: 'DELETE' });
//   return res.json();
// }

// export async function fetchWasteRecords(): Promise<WasteRecord[]> {
//   const res = await fetch('/api/waste');
//   return res.json();
// }

// export async function analyzeWasteImage(imageBase64: string, mimeType: string = 'image/png') {
//   const res = await fetch('/api/waste/analyze', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ imageBase64, mimeType }),
//   });
//   return res.json();
// }

// export async function deleteWasteRecord(id: string) {
//   const res = await fetch(`/api/waste/${id}`, { method: 'DELETE' });
//   return res.json();
// }

// export async function fetchPredictions() {
//   const res = await fetch('/api/predictions');
//   return res.json();
// }

// export async function fetchRecommendations(): Promise<Recommendation[]> {
//   const res = await fetch('/api/recommendations');
//   return res.json();
// }

// export async function toggleRecommendation(id: string) {
//   const res = await fetch(`/api/recommendations/${id}/toggle`, { method: 'POST' });
//   return res.json();
// }

// export async function sendChatMessage(message: string): Promise<{ success: boolean; message: ChatMessage }> {
//   const res = await fetch('/api/chatbot', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ message }),
//   });
//   return res.json();
// }

// export async function fetchChatHistory(): Promise<ChatMessage[]> {
//   const res = await fetch('/api/chatbot');
//   return res.json();
// }

// export async function fetchNotifications(): Promise<EcoNotification[]> {
//   const res = await fetch('/api/notifications');
//   return res.json();
// }

// export async function fetchReportSummary() {
//   const res = await fetch('/api/reports/summary');
//   return res.json();
// }


import {
  DashboardData,
  ElectricityBill,
  ShoppingReceipt,
  TripRecord,
  FoodRecord,
  WasteRecord,
  Recommendation,
  ChatMessage,
  EcoNotification,
  User,
} from '../types';

/*
 * ============================================================
 * API CONFIGURATION
 * ============================================================
 *
 * For local development:
 *   VITE_API_URL=http://localhost:5000
 *
 * For production/GitHub Pages:
 *   VITE_API_URL=https://YOUR-BACKEND-URL.com
 *
 * IMPORTANT:
 * Do NOT use localhost for the GitHub Pages version.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

/*
 * Remove trailing slash from backend URL.
 */
const API_BASE = API_BASE_URL.replace(/\/+$/, '');

/*
 * Create a complete API URL.
 */
function apiUrl(endpoint: string): string {
  return `${API_BASE}${endpoint}`;
}

/*
 * ============================================================
 * COMMON RESPONSE HANDLER
 * ============================================================
 */

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';

  let data: any;

  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = text ? { message: text } : {};
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;

    throw new Error(message);
  }

  return data as T;
}

/*
 * ============================================================
 * AUTHENTICATION
 * ============================================================
 */

export async function loginUser(
  email: string,
  password?: string
): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await handleResponse<{ user?: User; message?: string }>(res);

    return {
      success: true,
      user: data.user,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Login failed',
    };
  }
}

export async function registerUser(
  name: string,
  email: string,
  password?: string,
  role?: string
): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  try {
    const res = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    const data = await handleResponse<{ user?: User; message?: string }>(res);

    return {
      success: true,
      user: data.user,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Registration failed',
    };
  }
}

/*
 * ============================================================
 * DASHBOARD
 * ============================================================
 */

export async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch(apiUrl('/api/dashboard'));
  return handleResponse<DashboardData>(res);
}

/*
 * ============================================================
 * ELECTRICITY
 * ============================================================
 */

export async function fetchElectricityBills(): Promise<ElectricityBill[]> {
  const res = await fetch(apiUrl('/api/electricity'));

  return handleResponse<ElectricityBill[]>(res);
}

export async function uploadElectricityBillOcr(
  imageBase64: string,
  mimeType: string = 'image/png'
) {
  const res = await fetch(apiUrl('/api/electricity/ocr'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      mimeType,
    }),
  });

  return handleResponse<any>(res);
}

export async function deleteElectricityBill(id: string) {
  const res = await fetch(
    apiUrl(`/api/electricity/${encodeURIComponent(id)}`),
    {
      method: 'DELETE',
    }
  );

  return handleResponse<any>(res);
}

/*
 * ============================================================
 * SHOPPING
 * ============================================================
 */

export async function fetchShoppingReceipts(): Promise<ShoppingReceipt[]> {
  const res = await fetch(apiUrl('/api/shopping'));

  return handleResponse<ShoppingReceipt[]>(res);
}

export async function uploadReceiptOcr(
  imageBase64: string,
  mimeType: string = 'image/png'
) {
  const res = await fetch(apiUrl('/api/shopping/ocr'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      mimeType,
    }),
  });

  return handleResponse<any>(res);
}

export async function deleteShoppingReceipt(id: string) {
  const res = await fetch(
    apiUrl(`/api/shopping/${encodeURIComponent(id)}`),
    {
      method: 'DELETE',
    }
  );

  return handleResponse<any>(res);
}

/*
 * ============================================================
 * TRANSPORTATION
 * ============================================================
 */

export async function fetchTrips(): Promise<TripRecord[]> {
  const res = await fetch(apiUrl('/api/transport'));

  return handleResponse<TripRecord[]>(res);
}

export async function processGpsTrip(
  gpsLogs: any[],
  startAddress?: string,
  endAddress?: string
) {
  const res = await fetch(apiUrl('/api/transport/process-gps'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gpsLogs,
      startAddress,
      endAddress,
    }),
  });

  return handleResponse<any>(res);
}

export async function deleteTrip(id: string) {
  const res = await fetch(
    apiUrl(`/api/transport/${encodeURIComponent(id)}`),
    {
      method: 'DELETE',
    }
  );

  return handleResponse<any>(res);
}

/*
 * ============================================================
 * FOOD
 * ============================================================
 */

export async function fetchFoodRecords(): Promise<FoodRecord[]> {
  const res = await fetch(apiUrl('/api/food'));

  return handleResponse<FoodRecord[]>(res);
}

export async function analyzeFoodImage(
  imageBase64: string,
  mimeType: string = 'image/png'
) {
  const res = await fetch(apiUrl('/api/food/analyze'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      mimeType,
    }),
  });

  return handleResponse<any>(res);
}

export async function deleteFoodRecord(id: string) {
  const res = await fetch(
    apiUrl(`/api/food/${encodeURIComponent(id)}`),
    {
      method: 'DELETE',
    }
  );

  return handleResponse<any>(res);
}

/*
 * ============================================================
 * WASTE
 * ============================================================
 */

export async function fetchWasteRecords(): Promise<WasteRecord[]> {
  const res = await fetch(apiUrl('/api/waste'));

  return handleResponse<WasteRecord[]>(res);
}

export async function analyzeWasteImage(
  imageBase64: string,
  mimeType: string = 'image/png'
) {
  const res = await fetch(apiUrl('/api/waste/analyze'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      mimeType,
    }),
  });

  return handleResponse<any>(res);
}

export async function deleteWasteRecord(id: string) {
  const res = await fetch(
    apiUrl(`/api/waste/${encodeURIComponent(id)}`),
    {
      method: 'DELETE',
    }
  );

  return handleResponse<any>(res);
}

/*
 * ============================================================
 * PREDICTIONS
 * ============================================================
 */

export async function fetchPredictions() {
  const res = await fetch(apiUrl('/api/predictions'));

  return handleResponse<any>(res);
}

/*
 * ============================================================
 * RECOMMENDATIONS
 * ============================================================
 */

export async function fetchRecommendations(): Promise<
  Recommendation[]
> {
  const res = await fetch(apiUrl('/api/recommendations'));

  return handleResponse<Recommendation[]>(res);
}

export async function toggleRecommendation(id: string) {
  const res = await fetch(
    apiUrl(
      `/api/recommendations/${encodeURIComponent(id)}/toggle`
    ),
    {
      method: 'POST',
    }
  );

  return handleResponse<any>(res);
}

/*
 * ============================================================
 * AI CHATBOT
 * ============================================================
 */

export async function sendChatMessage(
  message: string
): Promise<{
  success: boolean;
  message: ChatMessage;
}> {
  const res = await fetch(apiUrl('/api/chatbot'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
    }),
  });

  return handleResponse<{
    success: boolean;
    message: ChatMessage;
  }>(res);
}

export async function fetchChatHistory(): Promise<ChatMessage[]> {
  const res = await fetch(apiUrl('/api/chatbot'));

  return handleResponse<ChatMessage[]>(res);
}

/*
 * ============================================================
 * NOTIFICATIONS
 * ============================================================
 */

export async function fetchNotifications(): Promise<EcoNotification[]> {
  const res = await fetch(apiUrl('/api/notifications'));

  return handleResponse<EcoNotification[]>(res);
}

/*
 * ============================================================
 * REPORTS
 * ============================================================
 */

export async function fetchReportSummary() {
  const res = await fetch(apiUrl('/api/reports/summary'));

  return handleResponse<any>(res);
}

/*
 * ============================================================
 * EXPORT API BASE URL
 * ============================================================
 *
 * Useful if another part of the application needs to know
 * which backend is being used.
 */

export { API_BASE };
