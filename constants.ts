import type { Station } from './types';
import { StationStatus } from './types';

// Mock coordinates around Kigali, Rwanda
export const KIGALI_CENTER = { lat: -1.9441, lng: 30.0619 };

export const MOCK_STATIONS: Station[] = [
  {
    id: 1,
    name: "Remera Battery Hub",
    coords: { lat: KIGALI_CENTER.lat + 0.02, lng: KIGALI_CENTER.lng + 0.05 },
    status: StationStatus.Available,
    batteries: [
      { type: '60V', quantity: 8, price: 1500 },
      { type: '72V', quantity: 5, price: 1800 },
    ],
    isVan: false,
    rating: 4.8,
    ratingCount: 182,
  },
  {
    id: 2,
    name: "Kimironko Swap Point",
    coords: { lat: KIGALI_CENTER.lat + 0.04, lng: KIGALI_CENTER.lng + 0.08 },
    status: StationStatus.Available,
    batteries: [
      { type: '60V', quantity: 12, price: 1500 },
      { type: '72V', quantity: 3, price: 1800 },
    ],
    isVan: false,
    rating: 4.5,
    ratingCount: 250,
  },
  {
    id: 3,
    name: "Nyamirambo Power Van",
    coords: { lat: KIGALI_CENTER.lat - 0.015, lng: KIGALI_CENTER.lng - 0.02 },
    status: StationStatus.Available,
    batteries: [
      { type: '60V', quantity: 20, price: 1600 },
      { type: '72V', quantity: 10, price: 1900 },
    ],
    isVan: true,
    rating: 4.9,
    ratingCount: 95,
  },
  {
    id: 4,
    name: "Kacyiru Central Station",
    coords: { lat: KIGALI_CENTER.lat + 0.01, lng: KIGALI_CENTER.lng + 0.01 },
    status: StationStatus.Busy,
    batteries: [
      { type: '60V', quantity: 2, price: 1500 },
      { type: '72V', quantity: 0, price: 1800 },
    ],
    isVan: false,
    rating: 4.2,
    ratingCount: 312,
  },
  {
    id: 5,
    name: "Gikondo Mobile Charger",
    coords: { lat: KIGALI_CENTER.lat - 0.03, lng: KIGALI_CENTER.lng + 0.03 },
    status: StationStatus.Offline,
    batteries: [],
    isVan: true,
    rating: 3.8,
    ratingCount: 45,
  },
];