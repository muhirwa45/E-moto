import type { Coordinates } from './types';

// Haversine formula to calculate distance between two lat/lng points
export const getDistance = (p1: Coordinates, p2: Coordinates): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(p2.lat - p1.lat);
  const dLon = deg2rad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(p1.lat)) * Math.cos(deg2rad(p2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Calculate the bearing from point 1 to point 2
export const getBearing = (p1: Coordinates, p2: Coordinates): number => {
    const lat1 = deg2rad(p1.lat);
    const lon1 = deg2rad(p1.lng);
    const lat2 = deg2rad(p2.lat);
    const lon2 = deg2rad(p2.lng);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const brng = Math.atan2(y, x);
    
    // Convert bearing from radians to degrees and normalize to 0-360
    return (brng * (180 / Math.PI) + 360) % 360;
};