import { GpsPoint, TransportMode } from '../types';

/**
 * Calculates distance between two GPS coordinates using the Haversine formula
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes total distance of a GPS point trajectory
 */
export function computeTrajectoryDistance(points: GpsPoint[]): number {
  if (points.length < 2) return 0;
  let totalDist = 0;
  for (let i = 1; i < points.length; i++) {
    totalDist += calculateHaversineDistance(
      points[i - 1].latitude,
      points[i - 1].longitude,
      points[i].latitude,
      points[i].longitude
    );
  }
  return totalDist;
}

/**
 * Infers transport mode using ONLY GPS-derived trajectory parameters:
 * - Average speed
 * - Maximum speed
 * - Stop duration & frequency
 * - Total distance & duration
 */
export function classifyTransportModeFromGps(points: GpsPoint[]): {
  mode: TransportMode;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  totalDistanceKm: number;
  durationMins: number;
  co2FactorKgPerKm: number; // kg CO2 / km
} {
  if (points.length < 2) {
    return {
      mode: 'Walking',
      avgSpeedKmh: 0,
      maxSpeedKmh: 0,
      totalDistanceKm: 0,
      durationMins: 0,
      co2FactorKgPerKm: 0,
    };
  }

  const totalDistanceKm = computeTrajectoryDistance(points);
  const startTime = points[0].timestamp;
  const endTime = points[points.length - 1].timestamp;
  const durationHours = Math.max((endTime - startTime) / (1000 * 3600), 0.001);
  const durationMins = Math.round(durationHours * 60);

  const avgSpeedKmh = totalDistanceKm / durationHours;

  // Calculate speeds between consecutive points
  let maxSpeedKmh = 0;
  let stopCount = 0;

  for (let i = 1; i < points.length; i++) {
    const d = calculateHaversineDistance(
      points[i - 1].latitude,
      points[i - 1].longitude,
      points[i].latitude,
      points[i].longitude
    );
    const dtHours = (points[i].timestamp - points[i - 1].timestamp) / (1000 * 3600);
    if (dtHours > 0) {
      const segSpeed = d / dtHours;
      if (segSpeed > maxSpeedKmh) maxSpeedKmh = segSpeed;
      if (segSpeed < 2) stopCount++; // Speed under 2 km/h counted as a stop
    }
  }

  // Emission Factors (kg CO2e per passenger-km)
  // Walking & Cycling: 0
  // Electric Bike: 0.008
  // Train: 0.035
  // Public Bus: 0.089
  // Electric Car: 0.053
  // Gasoline Car: 0.192

  let mode: TransportMode = 'Walking';
  let co2FactorKgPerKm = 0;

  if (avgSpeedKmh <= 6 && maxSpeedKmh <= 10) {
    mode = 'Walking';
    co2FactorKgPerKm = 0;
  } else if (avgSpeedKmh <= 20 && maxSpeedKmh <= 30) {
    mode = 'Cycling';
    co2FactorKgPerKm = 0;
  } else if (avgSpeedKmh <= 32 && maxSpeedKmh <= 45 && stopCount < 2) {
    mode = 'Electric Bike';
    co2FactorKgPerKm = 0.008;
  } else if (avgSpeedKmh > 50 && maxSpeedKmh > 80 && stopCount <= 2) {
    mode = 'Train';
    co2FactorKgPerKm = 0.035;
  } else if (stopCount >= 3 && maxSpeedKmh < 75) {
    mode = 'Public Bus';
    co2FactorKgPerKm = 0.089;
  } else if (avgSpeedKmh > 30) {
    mode = 'Gasoline Car';
    co2FactorKgPerKm = 0.192;
  } else {
    mode = 'Public Bus';
    co2FactorKgPerKm = 0.089;
  }

  return {
    mode,
    avgSpeedKmh: Number(avgSpeedKmh.toFixed(1)),
    maxSpeedKmh: Number(maxSpeedKmh.toFixed(1)),
    totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    durationMins,
    co2FactorKgPerKm,
  };
}

/**
 * Emission factors dictionary (kg CO2 per km)
 */
export const EMISSION_FACTORS_PER_KM: Record<TransportMode, number> = {
  Walking: 0.0,
  Cycling: 0.0,
  'Electric Bike': 0.008,
  'Train': 0.035,
  'Public Bus': 0.089,
  'Electric Car': 0.053,
  'Gasoline Car': 0.192,
};
