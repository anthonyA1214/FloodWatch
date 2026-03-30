'use client';

import { getUserLocation } from '@/lib/utils/get-user-location';
import { useMapRouting } from '@/contexts/map-routing-context';
import { toast } from 'sonner';

export function useDirections() {
  const { setRoute, clearRoute, setIsLoadingRoute } = useMapRouting();

  const getDirections = async (destination: {
    latitude: number;
    longitude: number;
  }) => {
    clearRoute();
    setIsLoadingRoute(true);

    try {
      const origin = await getUserLocation();

      if (!origin) {
        toast.error('Could not get your current location.');
        return;
      }

      const { longitude: oLng, latitude: oLat } = origin;
      const { longitude: dLng, latitude: dLat } = destination;

      const url = `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('OSRM request failed');

      const data = await res.json();

      if (data.code !== 'Ok' || !data.routes?.length) {
        toast.error('No route found to this location.');
        return;
      }

      setRoute({
        type: 'Feature',
        properties: {},
        geometry: data.routes[0].geometry,
      });
    } catch {
      toast.error('Failed to get directions. Please try again.');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  return { getDirections, clearRoute };
}