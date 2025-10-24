import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, LayersControl } from 'react-leaflet';
import type { Station, Coordinates, Delivery } from '../types';
import { StationStatus } from '../types';
import { KIGALI_CENTER } from '../constants';
import { userIcon, deliveryIcon, createStationIcon } from './MapIcons';

// Component to change map view dynamically
const ChangeView = ({ center, zoom }: { center: Coordinates | null, zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], zoom);
    }
  }, [center, zoom, map]);
  return null;
};

interface MapProps {
  userLocation: Coordinates | null;
  stations: Station[];
  selectedStation: Station | null;
  delivery: Delivery | null;
  onStationSelect: (station: Station) => void;
}

const Map = ({ userLocation, stations, selectedStation, delivery, onStationSelect }: MapProps) => {
  const mapCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : [KIGALI_CENTER.lat, KIGALI_CENTER.lng];
  
  return (
    <div className="relative w-full h-full bg-gray-200">
      <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={true} className="w-full h-full">
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street View">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        <ChangeView center={userLocation} zoom={15} />

        {/* Stations */}
        {stations.map(station => {
          const isSelected = selectedStation?.id === station.id;
          return (
            <Marker
              key={station.id}
              position={[station.coords.lat, station.coords.lng]}
              icon={createStationIcon(station, isSelected)}
              eventHandlers={{
                click: () => {
                    if (station.status !== StationStatus.Offline) {
                        onStationSelect(station)
                    }
                },
              }}
              zIndexOffset={isSelected ? 1000 : 0}
            />
          );
        })}

        {/* User Location */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} zIndexOffset={500} />
        )}

        {/* Delivery Vehicle */}
        {delivery && (
            <Marker 
                position={[delivery.vehicleLocation.lat, delivery.vehicleLocation.lng]} 
                icon={deliveryIcon}
                zIndexOffset={2000}
            />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;