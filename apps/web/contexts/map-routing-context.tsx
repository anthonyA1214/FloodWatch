'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from 'react';
import type { Feature, LineString, MultiLineString } from 'geojson';

interface MapRoutingContextType {
  route: Feature<LineString> | null;
  offRoadPath: Feature<MultiLineString> | null;
  routeOrigin: [number, number] | null;
  isLoadingRoute: boolean;
  isNoRoad: boolean;
  setRoute: (route: Feature<LineString>) => void;
  setOffRoadPath: (path: Feature<MultiLineString> | null) => void;
  setRouteOrigin: (origin: [number, number] | null) => void;
  clearRoute: () => void;
  setIsLoadingRoute: (loading: boolean) => void;
  setIsNoRoad: (noRoad: boolean) => void;
}

const MapRoutingContext = createContext<MapRoutingContextType | null>(null);

export function MapRoutingProvider({ children }: { children: ReactNode }) {
  const [route, setRouteState] = useState<Feature<LineString> | null>(null);
  const [offRoadPath, setOffRoadPathState] =
    useState<Feature<MultiLineString> | null>(null);
  const [routeOrigin, setRouteOriginState] = useState<[number, number] | null>(
    null,
  );
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isNoRoad, setIsNoRoad] = useState(false);

  const setRoute = useCallback(
    (r: Feature<LineString>) => setRouteState(r),
    [],
  );

  const setOffRoadPath = useCallback(
    (p: Feature<MultiLineString> | null) => setOffRoadPathState(p),
    [],
  );

  const setRouteOrigin = useCallback(
    (o: [number, number] | null) => setRouteOriginState(o),
    [],
  );

  const clearRoute = useCallback(() => {
    setRouteState(null);
    setOffRoadPathState(null);
    setRouteOriginState(null);
    setIsNoRoad(false);
  }, []);

  return (
    <MapRoutingContext.Provider
      value={{
        route,
        offRoadPath,
        routeOrigin,
        isLoadingRoute,
        isNoRoad,
        setRoute,
        setOffRoadPath,
        setRouteOrigin,
        clearRoute,
        setIsLoadingRoute,
        setIsNoRoad,
      }}
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
