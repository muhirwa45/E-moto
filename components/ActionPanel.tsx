
import React from 'react';
import type { Station, Delivery } from '../types';
import { StationStatus } from '../types';
import { getDistance } from '../utils';
import { PhoneIcon, BatteryIcon } from './Icons';

interface ActionPanelProps {
  userLocation: any;
  selectedStation: Station | null;
  delivery: Delivery | null;
  onRequest: (station: Station, batteryType: '60V' | '72V') => void;
  onCancel: () => void;
}

const StationDetails = ({ station, distance, onRequest }: { station: Station; distance: number; onRequest: (station: Station, batteryType: '60V' | '72V') => void; }) => (
  <div className="p-4">
    <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{station.name}</h2>
        <a href="tel:+250788123456" className="flex items-center justify-center bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors">
            <PhoneIcon /> Call
        </a>
    </div>
    <div className="flex items-center text-sm text-gray-500 mt-1">
      <span className={`h-2.5 w-2.5 rounded-full mr-2 ${station.status === StationStatus.Available ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
      {station.status} - {distance.toFixed(1)} km away
    </div>
    <div className="mt-4 space-y-3">
      <h3 className="text-md font-semibold text-gray-700">Available Batteries for Delivery</h3>
      {station.batteries.filter(b => b.quantity > 0).map(battery => (
        <div key={battery.type} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
          <div className="flex items-center">
            <BatteryIcon />
            <div className="ml-3">
                <p className="font-semibold text-gray-800">{battery.type} Battery</p>
                <p className="text-sm text-gray-500">{battery.quantity} available</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-gray-800">{battery.price.toLocaleString()} RWF</p>
            <button 
                onClick={() => onRequest(station, battery.type)} 
                className="mt-1 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                disabled={station.status !== StationStatus.Available}
            >
              Request
            </button>
          </div>
        </div>
      ))}
      {station.batteries.every(b => b.quantity === 0) && (
        <p className="text-center text-gray-500 py-4">No batteries available at this station.</p>
      )}
    </div>
  </div>
);

const DeliveryTracker = ({ delivery, onCancel }: { delivery: Delivery; onCancel: () => void; }) => (
  <div className="p-4 text-center">
    <h2 className="text-xl font-bold text-gray-800">Delivery In Progress</h2>
    <p className="text-gray-600 mt-2">Your battery is on the way from <span className="font-semibold">{delivery.station.name}</span>.</p>
    
    <div className="my-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">Estimated Arrival Time</p>
        <p className="text-4xl font-extrabold text-blue-600">{Math.max(1, Math.round(delivery.eta))} min</p>
    </div>

    <div className="flex items-center justify-center mt-2">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
        {delivery.station.isVan ? '🚚' : '🛵'}
      </div>
      <div>
        <p className="font-semibold">Your Delivery Rider</p>
        <p className="text-sm text-gray-500">Tracking vehicle in real-time...</p>
      </div>
    </div>
    
    <button onClick={onCancel} className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
      Cancel Delivery
    </button>
  </div>
);


const ActionPanel = ({ userLocation, selectedStation, delivery, onRequest, onCancel }: ActionPanelProps) => {
  const isPanelOpen = !!selectedStation || !!delivery;
  let distance = 0;
  if (selectedStation && userLocation) {
      distance = getDistance(userLocation, selectedStation.coords);
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-500 ease-in-out ${isPanelOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-white rounded-t-2xl shadow-2xl max-w-lg mx-auto">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2"></div>
        {delivery ? (
            <DeliveryTracker delivery={delivery} onCancel={onCancel} />
        ) : selectedStation ? (
            <StationDetails station={selectedStation} distance={distance} onRequest={onRequest} />
        ) : null}
      </div>
    </div>
  );
};

export default ActionPanel;
