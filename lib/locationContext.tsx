'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationData {
  city: string;
  latitude: number;
  timezone: string;
  loading: boolean;
}

const LocationContext = createContext<LocationData>({
  city: '',
  latitude: 48, // default northern hemisphere
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  loading: true,
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationData>({
    city: '',
    latitude: 48,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    loading: true,
  });

  useEffect(() => {
    // Try browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              'Your location';
            setLocation({
              city,
              latitude,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              loading: false,
            });
          } catch {
            setLocation((prev) => ({ ...prev, latitude, loading: false }));
          }
        },
        () => {
          // Permission denied — use timezone to estimate hemisphere
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const southernZones = ['Australia', 'Pacific/Auckland', 'America/Sao_Paulo', 'Africa/Johannesburg'];
          const isSouth = southernZones.some((z) => tz.startsWith(z));
          setLocation((prev) => ({
            ...prev,
            latitude: isSouth ? -33 : 48,
            loading: false,
          }));
        }
      );
    } else {
      setLocation((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  return useContext(LocationContext);
}
