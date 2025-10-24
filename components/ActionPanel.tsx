import React, { useState, useEffect } from 'react';
import type { Station, Delivery, Coordinates, Battery } from '../types';
import { AppState } from '../types';
import { getDistance } from '../utils';
import { PhoneIcon, BatteryIcon, BookmarkIcon, BookmarkFilledIcon, StarIcon } from './Icons';

interface ActionPanelProps {
  appState: AppState;
  userLocation: Coordinates | null;
  selectedStation: Station | null;
  delivery: Delivery | null;
  onRequest: (station: Station, batteryType: '60V' | '72V') => void;
  onCancel: () => void;
  onRate: (stationId: number, rating: number) => void;
}

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < Math.round(rating)} />
      ))}
    </div>
  );
};

const ActionPanel: React.FC<ActionPanelProps> = ({
  appState,
  userLocation,
  selectedStation,
  delivery,
  onRequest,
  onCancel,
  onRate,
}) => {
  const [selectedBattery, setSelectedBattery] = useState<'60V' | '72V' | null>(null);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    setSelectedBattery(null);
    if (appState !== AppState.Delivered) {
        setUserRating(0);
    }
  }, [selectedStation, appState]);

  const renderIdleState = () => (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-gray-800">Welcome to E-Moto Swap</h2>
      <p className="mt-2 text-gray-600">
        {userLocation ? 'Select a station on the map to request a battery delivery.' : 'Please enable location services to find nearby stations.'}
      </p>
      <div className="mt-6">
        <div className="animate-pulse rounded-full h-24 w-24 bg-blue-100 mx-auto flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
    </div>
  );

  const renderStationDetails = (station: Station) => {
    const distance = userLocation ? getDistance(userLocation, station.coords).toFixed(1) : 'N/A';
    
    return (
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold">{station.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                    <StarRatingDisplay rating={station.rating} />
                    <span className="text-sm text-gray-500">{station.rating.toFixed(1)} ({station.ratingCount} reviews)</span>
                </div>
                 <p className="text-sm text-gray-500 mt-1">{distance} km away</p>
            </div>
            <button className="p-2 text-gray-500 hover:text-yellow-500">
                {station.isFavorite ? <BookmarkFilledIcon /> : <BookmarkIcon />}
            </button>
        </div>

        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-700">
             <a href={`tel:${station.phone}`} className="flex items-center hover:text-blue-600 transition-colors">
                <PhoneIcon />
                <span>{station.phone}</span>
             </a>
        </div>
        <div className="mt-2">
            <div className="flex flex-wrap gap-2">
                {station.paymentMethods.map(method => (
                    <span key={method} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md">{method}</span>
                ))}
            </div>
        </div>

        <div className="mt-3 border-t pt-3">
            <h3 className="font-semibold text-gray-700">Available Batteries:</h3>
            <div className="mt-2 space-y-2">
                {station.batteries.map((battery: Battery) => (
                    <button 
                        key={battery.type}
                        onClick={() => battery.quantity > 0 && setSelectedBattery(battery.type)}
                        disabled={battery.quantity === 0}
                        className={`w-full flex justify-between items-center p-3 rounded-lg border-2 transition-all ${
                            selectedBattery === battery.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                        } ${battery.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}`}
                    >
                        <div className="flex items-center">
                            <BatteryIcon />
                            <div className="ml-3 text-left">
                                <p className="font-bold text-lg">{battery.type} Battery</p>
                                <p className="text-sm text-gray-500">{battery.quantity > 0 ? `${battery.quantity} available` : 'Out of stock'}</p>
                            </div>
                        </div>
                        <span className="font-semibold text-gray-800">{battery.price} RWF</span>
                    </button>
                ))}
            </div>
        </div>
        <div className="mt-auto pt-3">
             <button
                onClick={() => selectedBattery && onRequest(station, selectedBattery)}
                disabled={!selectedBattery}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition-transform active:scale-95 disabled:bg-blue-300 disabled:cursor-not-allowed"
             >
                {selectedBattery ? `Request ${selectedBattery} Battery` : 'Select a Battery'}
             </button>
        </div>
      </div>
    );
  };
  
  const renderDeliveryStatus = (delivery: Delivery) => {
    const progress = Math.min(100, Math.max(0, 100 - (delivery.eta / (getDistance(delivery.station.coords, delivery.userLocation) * 5 + 2)) * 100));

    return (
        <div className="p-6 text-center h-full flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold">Delivery In Progress</h2>
                <p className="text-gray-600 mt-1">Your battery from <span className="font-semibold">{delivery.station.name}</span> is on its way!</p>
            </div>

            <div className="my-6">
                <div className="relative">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{Math.ceil(delivery.eta)} min</p>
                    <p className="text-sm text-gray-500">Estimated Arrival Time</p>
                </div>
            </div>

            <div className="space-y-3">
                <button className="w-full flex items-center justify-center bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
                    <PhoneIcon />
                    Contact Driver
                </button>
                <button 
                    onClick={onCancel}
                    className="w-full bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200 transition"
                >
                    Cancel Delivery
                </button>
            </div>
        </div>
    );
  };

  const renderRateDelivery = (delivery: Delivery) => {
      return (
          <div className="p-6 text-center h-full flex flex-col justify-between">
              <div>
                  <h2 className="text-2xl font-bold">Delivery Complete!</h2>
                  <p className="text-gray-600 mt-1">Please rate your experience with <span className="font-semibold">{delivery.station.name}</span>.</p>
              </div>
              <div className="flex justify-center my-6 space-x-2">
                  {[...Array(5)].map((_, i) => (
                      <button key={i} onClick={() => setUserRating(i + 1)}>
                          <StarIcon filled={i < userRating} />
                      </button>
                  ))}
              </div>
              <button
                  onClick={() => onRate(delivery.station.id, userRating)}
                  disabled={userRating === 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition-transform active:scale-95 disabled:bg-gray-400"
              >
                  Submit Rating
              </button>
          </div>
      )
  }

  const getPanelContent = () => {
    switch(appState) {
        case AppState.Delivering:
            return delivery ? renderDeliveryStatus(delivery) : renderIdleState();
        case AppState.Delivered:
            return delivery ? renderRateDelivery(delivery) : renderIdleState();
        case AppState.StationSelected:
             return selectedStation ? renderStationDetails(selectedStation) : renderIdleState();
        case AppState.Idle:
        default:
            return renderIdleState();
    }
  }

  const getPanelHeight = () => {
      switch(appState) {
          case AppState.Delivering: return 300;
          case AppState.Delivered: return 280;
          case AppState.StationSelected: return 420; // Increased height to accommodate new info
          case AppState.Idle:
          default:
            return 280;
      }
  }

  const isVisible = appState !== AppState.Idle || !!selectedStation;

  return (
    <aside className="absolute bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-2xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 ease-in-out"
      style={{
        height: `${getPanelHeight()}px`,
        transform: isVisible ? 'translateY(0)' : `translateY(calc(100% - 80px))` // Show a peek when idle
      }}
    >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2 cursor-grab"></div>
      
        {getPanelContent()}
    </aside>
  );
};

export default ActionPanel;