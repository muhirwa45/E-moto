export interface Coordinates {
  lat: number;
  lng: number;
}

export enum StationStatus {
  Available = 'Available',
  Busy = 'Busy',
  Offline = 'Offline',
}

export interface Battery {
  type: '60V' | '72V';
  quantity: number;
  price: number; // in RWF
}

export interface Station {
  id: number;
  name: string;
  coords: Coordinates;
  status: StationStatus;
  batteries: Battery[];
  isVan: boolean;
  isFavorite?: boolean;
}

export interface Delivery {
  id: string;
  station: Station;
  userLocation: Coordinates;
  vehicleLocation: Coordinates;
  startTime: number;
  eta: number; // in minutes
}

export enum AppState {
  Idle,
  StationSelected,
  Requesting,
  Delivering,
  Delivered,
}