import { useState, useEffect } from 'react';

interface DeviceOrientation {
  alpha: number | null; // Compass direction (0-360)
  beta: number | null;  // Front-to-back tilt (-180 to 180)
  gamma: number | null; // Left-to-right tilt (-90 to 90)
}

export const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      });
    };
    
    // Feature detection
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      setError("Device orientation not supported on this device or browser.");
    }
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return { orientation, error };
};
