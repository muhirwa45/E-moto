import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import type { Coordinates, Station, Delivery } from '../types';
import { userIcon, deliveryIcon, createStationIcon } from './MapIcons';

interface MapProps {
  userLocation: Coordinates | null;
  stations: Station[];
  selectedStation: Station | null;
  delivery: Delivery | null;
  onSelectStation: (station: Station) => void;
}

// Component to handle map view changes
const MapUpdater: React.FC<{
  center: L.LatLngExpression;
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5
    });
  }, [center, zoom, map]);
  return null;
};


const Map: React.FC<MapProps> = ({ userLocation, stations, selectedStation, delivery, onSelectStation }) => {
  const defaultCenter: L.LatLngExpression = userLocation ? [userLocation.lat, userLocation.lng] : [-1.9441, 30.0619];
  const defaultZoom = userLocation ? 14 : 12;

  const mapCenter = selectedStation ? [selectedStation.coords.lat, selectedStation.coords.lng] : defaultCenter;
  const mapZoom = selectedStation ? 15 : defaultZoom;


  return (
    <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true} className="w-full h-full z-0" zoomControl={false}>
      <LayersControl position="bottomright">
        <LayersControl.BaseLayer checked name="Street View">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
        </LayersControl.BaseLayer>
      </LayersControl>
      
      <MapUpdater center={mapCenter} zoom={mapZoom} />

      {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />}
      
      {stations.map(station => (
        <Marker
          key={station.id}
          position={[station.coords.lat, station.coords.lng]}
          icon={createStationIcon(station, selectedStation?.id === station.id)}
          eventHandlers={{
            click: () => {
              onSelectStation(station);
            },
          }}
        />
      ))}

      {delivery && (
        <>
            <Marker position={[delivery.vehicleLocation.lat, delivery.vehicleLocation.lng]} icon={deliveryIcon} />
            <Polyline 
                positions={[[delivery.vehicleLocation.lat, delivery.vehicleLocation.lng], [delivery.userLocation.lat, delivery.userLocation.lng]]} 
                color="blue"
                dashArray="5, 10"
            />
        </>
      )}

    </MapContainer>
  );
};

export default Map;