'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Feature, LineString } from 'geojson';

interface MapRoutingContextType {
  route: Feature<LineString> | null;
  isLoadingRoute: boolean;
  setRoute: (route: Feature<LineString>) => void;
  clearRoute: () => void;
  setIsLoadingRoute: (loading: boolean) => void;
}

const MapRoutingContext = createContext<MapRoutingContextType | null>(null);

export function MapRoutingProvider({ children }: { children: ReactNode }) {
  const [route, setRouteState] = useState<Feature<LineString> | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const setRoute = (route: Feature<LineString>) => setRouteState(route);
  const clearRoute = () => setRouteState(null);

  return (
    <MapRoutingContext.Provider
      value={{ route, isLoadingRoute, setRoute, clearRoute, setIsLoadingRoute }}
    >
      {children}
    </MapRoutingContext.Provider>
  );
}

export function useMapRouting() {
  const context = useContext(MapRoutingContext);
  if (!context)
    throw new Error('useMapRouting must be used within MapRoutingProvider');
  return context;
}