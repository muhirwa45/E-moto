
import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import ActionPanel from './components/ActionPanel';
import SearchBar from './components/SearchBar';
import { useGeolocation } from './hooks/useGeolocation';
import type { Station, Delivery } from './types';
import { AppState } from './types';
import { MOCK_STATIONS } from './constants';
import { getDistance } from './utils';

function App() {
  const { coordinates: userLocation, loading: geoLoading, error: geoError } = useGeolocation();
  const [stations, setStations] = useState<Station[]>(MOCK_STATIONS);
  const [appState, setAppState] = useState<AppState>(AppState.Idle);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);

  const handleSelectStation = (station: Station) => {
    setSelectedStation(station);
    setAppState(AppState.StationSelected);
  };
  
  const handleRecenter = () => {
    // Deselecting the station will cause the map to recenter on the user's location
    setSelectedStation(null);
    if (appState === AppState.StationSelected) {
      setAppState(AppState.Idle);
    }
  };

  const handleRequest = (station: Station, batteryType: '60V' | '72V') => {
    if (!userLocation) return;
    
    setAppState(AppState.Requesting);

    // Simulate API call to confirm request (1.5s)
    setTimeout(() => {
      const eta = Math.round(getDistance(station.coords, userLocation) * 4 + 3); // 4 min/km + 3 min flat
      const newDelivery: Delivery = {
        id: new Date().toISOString(),
        station,
        userLocation,
        vehicleLocation: station.coords, // Vehicle starts at the station
        startTime: Date.now(),
        eta: eta,
      };

      setDelivery(newDelivery);
      setAppState(AppState.Delivering);

      // Simulate the entire delivery duration with a single 5-second timeout
      setTimeout(() => {
        setAppState(AppState.Delivered);
        // Update the delivery to its final state: arrived at user's location with 0 ETA.
        setDelivery(prev => prev ? { ...prev, eta: 0, vehicleLocation: userLocation } : null);
      }, 5000); // 5-second delivery simulation

    }, 1500);
  };

  const handleCancel = () => {
    // In a real app with cancellable timeouts, you'd clear the timeout here.
    // For this simulation, simply resetting the state is sufficient.
    setDelivery(null);
    setSelectedStation(null);
    setAppState(AppState.Idle);
  };
  
  const handleRate = (stationId: number, rating: number) => {
    setStations(prevStations =>
      prevStations.map(s =>
        s.id === stationId
          ? {
              ...s,
              rating: (s.rating * s.ratingCount + rating) / (s.ratingCount + 1),
              ratingCount: s.ratingCount + 1,
            }
          : s
      )
    );
    setDelivery(null);
    setSelectedStation(null);
    setAppState(AppState.Idle);
  };
  
  return (
    <main className="relative w-screen h-screen font-sans">
      {geoLoading && (
        <div className="absolute inset-0 bg-white z-[2000] flex flex-col items-center justify-center">
            <p className="text-lg font-semibold">Finding your location...</p>
        </div>
      )}
      {geoError && (
          <div className="absolute inset-0 bg-white z-[2000] flex flex-col items-center justify-center p-4 text-center">
              <p className="text-lg font-semibold text-red-600">Location Error</p>
              <p className="mt-2 text-gray-700">{geoError}</p>
              <p className="mt-2 text-sm text-gray-500">Please enable location services in your browser settings and refresh the page.</p>
          </div>
      )}
      <Map
        userLocation={userLocation}
        stations={stations}
        selectedStation={selectedStation}
        delivery={delivery}
        onSelectStation={handleSelectStation}
      />
      <SearchBar 
        stations={stations}
        onSelectStation={handleSelectStation}
        onRecenter={handleRecenter}
        userLocation={!!userLocation}
      />
      <ActionPanel
        appState={appState}
        userLocation={userLocation}
        selectedStation={selectedStation}
        delivery={delivery}
        onRequest={handleRequest}
        onCancel={handleCancel}
        onRate={handleRate}
      />
    </main>
  );
}

export default App;