import React, { useEffect, useRef, useState } from 'react';
import type { Coordinates, Station } from '../types';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { getDistance, getBearing } from '../utils';
import { CloseIcon } from './Icons';

interface ArViewProps {
  userLocation: Coordinates;
  stations: Station[];
  onClose: () => void;
}

// Assumed horizontal field of view for a typical smartphone camera
const HORIZONTAL_FOV = 65; 

const ArView: React.FC<ArViewProps> = ({ userLocation, stations, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { orientation, error: orientationError } = useDeviceOrientation();
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          setCameraError("Camera access is not supported by your browser.");
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setCameraError("Could not access camera. Please grant permission and try again.");
      }
    };
    
    startCamera();

    return () => {
      // Stop camera stream when component unmounts
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const renderMarkers = () => {
    if (!orientation.alpha) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 text-white p-4 rounded-lg">
                <p>Calibrating sensors...</p>
                <p>Please move your device in a figure-eight pattern.</p>
            </div>
        </div>
      );
    }
    
    return stations.map(station => {
      const distance = getDistance(userLocation, station.coords);
      const bearing = getBearing(userLocation, station.coords);
      
      let angleDifference = bearing - orientation.alpha!;
      
      // Normalize angle to be between -180 and 180
      if (angleDifference > 180) angleDifference -= 360;
      if (angleDifference < -180) angleDifference += 360;

      // Only render markers within the camera's field of view
      if (Math.abs(angleDifference) > HORIZONTAL_FOV / 2) {
        return null;
      }

      // Map angle difference to a screen position (-50% to 50%)
      const horizontalPosition = (angleDifference / (HORIZONTAL_FOV / 2)) * 50;
      
      // Make closer markers slightly larger and more opaque
      const maxVisibleDistance = 5; // km
      const scale = 1.2 - (Math.min(distance, maxVisibleDistance) / maxVisibleDistance) * 0.5;
      const opacity = 1 - (Math.min(distance, maxVisibleDistance) / maxVisibleDistance) * 0.4;
      
      return (
        <div 
          key={station.id}
          className="absolute top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-lg shadow-xl text-center transition-transform duration-200 ease-linear"
          style={{
            left: `calc(50% + ${horizontalPosition}%)`,
            transform: `translateX(-50%) translateY(-50%) scale(${scale})`,
            opacity: opacity,
          }}
        >
            <p className="font-bold whitespace-nowrap">{station.name}</p>
            <p className="text-sm">{distance.toFixed(1)} km</p>
        </div>
      );
    });
  };

  return (
    <div className="absolute inset-0 bg-black z-[1500]">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
      <div className="absolute inset-0">
        {renderMarkers()}
      </div>
      {(cameraError || orientationError) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-100 text-red-800 p-4 rounded-lg shadow-lg">
            <p className="font-bold">AR Error</p>
            <p>{cameraError || orientationError}</p>
        </div>
      )}
       <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition">
            <CloseIcon />
       </button>
    </div>
  );
};

export default ArView;
