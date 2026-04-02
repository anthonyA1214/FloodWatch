'use client';

import { getUserLocation } from '@/lib/utils/get-user-location';
import { useMapRouting } from '@/contexts/map-routing-context';
import { toast } from 'sonner';
import type { Feature, LineString } from 'geojson';

export function useDirections() {
  const {
    setRoute,
    setOffRoadPath,
    setRouteOrigin,
    clearRoute,
    setIsLoadingRoute,
    setIsNoRoad,
  } = useMapRouting();

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

      // Set the true origin so the pulsing dot is accurate
      setRouteOrigin([oLng, oLat]);

      const url = `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('OSRM request failed');

      const data = await res.json();

      if (data.code !== 'Ok' || !data.routes?.length) {
        // No drivable road found — draw a dashed straight line to the
        // destination's existing pin so the user can see where it is.
        const fallbackLine: Feature<LineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [oLng, oLat],
              [dLng, dLat],
            ],
          },
        };
        setIsNoRoad(true);
        setRoute(fallbackLine);
        setOffRoadPath(null);
        toast.warning('No drivable road found. Showing straight-line path.');
        return;
      }

      setIsNoRoad(false);

      const routeGeometry = data.routes[0].geometry;
      setRoute({
        type: 'Feature',
        properties: {},
        geometry: routeGeometry,
      });

      // Check for gaps between the real pins and the snapped road route
      const coords = routeGeometry.coordinates;
      const startSnap = coords[0];
      const endSnap = coords[coords.length - 1];

      const offRoadLines: [number, number][][] = [];

      // If snapped origin differs from actual user location
      if (startSnap[0] !== oLng || startSnap[1] !== oLat) {
        offRoadLines.push([[oLng, oLat], startSnap]);
      }

      // If snapped destination differs from actual destination pin
      if (endSnap[0] !== dLng || endSnap[1] !== dLat) {
        offRoadLines.push([endSnap, [dLng, dLat]]);
      }

      if (offRoadLines.length > 0) {
        setOffRoadPath({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiLineString',
            coordinates: offRoadLines,
          },
        });
      } else {
        setOffRoadPath(null);
      }
    } catch {
      toast.error('Failed to get directions. Please try again.');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  return { getDirections, clearRoute };
}
