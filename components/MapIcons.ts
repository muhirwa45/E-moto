import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import type { Station } from '../types';
import { UserLocationIcon, StationIcon, DeliveryVehicleIcon } from './Icons';

// Helper to create a divIcon from a React component
const createDivIcon = (component: React.ReactElement, size: [number, number], anchor: [number, number]) => {
  return new L.DivIcon({
    html: ReactDOMServer.renderToString(component),
    className: 'leaflet-div-icon', // Use a custom class to remove default styles
    iconSize: size,
    iconAnchor: anchor,
  });
};

// FIX: Replaced JSX with React.createElement to be compatible with a .ts file and resolve parsing errors.
export const userIcon = createDivIcon(React.createElement(UserLocationIcon, null), [24, 24], [12, 12]);

// FIX: Replaced JSX with React.createElement to be compatible with a .ts file and resolve parsing errors.
export const deliveryIcon = createDivIcon(React.createElement(DeliveryVehicleIcon, null), [32, 32], [16, 16]);

export const createStationIcon = (station: Station, isSelected: boolean) => {
    const scaleClass = isSelected ? 'scale-125' : 'scale-100';
    const zIndexClass = isSelected ? 'z-[1000]' : 'z-auto';
    
    // Wrap the icon and label in a container for styling
    // FIX: Replaced JSX with React.createElement to be compatible with a .ts file and resolve parsing errors.
    const iconComponent = React.createElement(
      'div',
      { className: `relative flex flex-col items-center transition-transform duration-300 ${scaleClass} ${zIndexClass}` },
      React.createElement(StationIcon, { status: station.status, isVan: station.isVan }),
      React.createElement(
        'span',
        { className: `text-xs font-bold px-2 py-0.5 rounded-full shadow-md -mt-2 ${isSelected ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}` },
        station.name
      )
    );
  
    return createDivIcon(iconComponent, [40, 50], [20, 45]);
};
