import React, { useState, useEffect, useCallback } from 'react';
import Map from './components/Map';
import ActionPanel from './components/ActionPanel';
import { useGeolocation } from './hooks/useGeolocation';
import type { Station, Coordinates, Delivery } from './types';
import { StationStatus } from './types';
import { MOCK_STATIONS } from './constants';
import { getDistance } from './utils';

const App: React.FC = () => {
  const { coordinates: userLocation, loading: geoLoading, error: geoError } = useGeolocation();
  const [stations] = useState<Station[]>(MOCK_STATIONS);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isSOS, setIsSOS] = useState(false);

  // Find the nearest available station
  const findNearestStation = useCallback((loc: Coordinates): Station | null => {
    let closest: Station | null = null;
    let minDistance = Infinity;

    stations.forEach(station => {
      if (station.status === StationStatus.Available && station.batteries.some(b => b.quantity > 0)) {
        const distance = getDistance(loc, station.coords);
        if (distance < minDistance) {
          minDistance = distance;
          closest = station;
        }
      }
    });
    return closest;
  }, [stations]);


  const handleRequest = (station: Station, batteryType: '60V' | '72V') => {
    if (!userLocation) return;
    const distance = getDistance(userLocation, station.coords);
    const eta = Math.round(distance * 5 + 2); // 5 min per km + 2 min prep

    const newDelivery: Delivery = {
      id: `del_${Date.now()}`,
      station,
      userLocation,
      vehicleLocation: station.coords,
      startTime: Date.now(),
      eta: eta
    };
    setDelivery(newDelivery);
    setSelectedStation(null);
    setIsSOS(false);
  };
  
  const handleSOS = () => {
    if (!userLocation) return;
    const nearest = findNearestStation(userLocation);
    if (nearest) {
      setIsSOS(true);
      // Find the best battery type (or default to first available)
      const batteryToRequest = nearest.batteries.find(b => b.quantity > 0)?.type;
      if (batteryToRequest) {
        handleRequest(nearest, batteryToRequest);
      } else {
          alert("No batteries available at the nearest station.");
          setIsSOS(false);
      }
    } else {
        alert("No available stations found nearby.");
    }
  };


  const handleCancel = () => {
    setDelivery(null);
  };

  const handleStationSelect = (station: Station) => {
    if (station.status !== StationStatus.Offline) {
        setSelectedStation(station);
    }
  };
  
  // Effect to simulate delivery vehicle movement
  useEffect(() => {
    if (!delivery || !userLocation) return;
    
    const interval = setInterval(() => {
        setDelivery(d => {
            if (!d) return null;

            const now = Date.now();
            const elapsedTime = (now - d.startTime) / (1000 * 60); // in minutes
            const totalDuration = getDistance(d.station.coords, userLocation) * 5 + 2;

            if (elapsedTime >= totalDuration) {
                // Arrived
                clearInterval(interval);
                alert("Your battery has arrived!");
                return null;
            }

            const progress = elapsedTime / totalDuration;
            const newVehicleLat = d.station.coords.lat + (userLocation.lat - d.station.coords.lat) * progress;
            const newVehicleLng = d.station.coords.lng + (userLocation.lng - d.station.coords.lng) * progress;
            
            return {
                ...d,
                vehicleLocation: { lat: newVehicleLat, lng: newVehicleLng },
                eta: totalDuration - elapsedTime
            };
        })
    }, 2000); // update every 2 seconds

    return () => clearInterval(interval);

  }, [delivery, userLocation]);

  return (
    <div className="w-screen h-screen bg-gray-800 flex flex-col overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-[1001] p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-white text-xl font-bold drop-shadow-lg">E-Moto Swap</h1>
        <button 
          onClick={handleSOS} 
          disabled={!userLocation || delivery != null}
          className="bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-red-700 transition-transform active:scale-95 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          SOS Delivery
        </button>
      </header>

      <main className="flex-grow">
        {geoLoading && <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white">Getting your location...</div>}
        {geoError && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-red-800/90 text-white p-4 text-center rounded-lg shadow-lg">Error: {geoError}. Please enable location services.</div>}
        
        <Map
          userLocation={userLocation}
          stations={stations}
          selectedStation={selectedStation}
          delivery={delivery}
          onStationSelect={handleStationSelect}
        />
      </main>

      <ActionPanel
        userLocation={userLocation}
        selectedStation={selectedStation}
        delivery={delivery}
        onRequest={handleRequest}
        onCancel={handleCancel}
      />

       {isSOS && (
            <div className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <h2 className="text-xl font-bold mt-4">Finding Nearest Help!</h2>
                    <p className="text-gray-600">We've received your SOS. Dispatching the closest available unit to your location.</p>
                </div>
            </div>
        )}
    </div>
  );
};

export default App;
