'use client';
import { createContext, useContext } from 'react';
import { MapFilterContextType, useMapFilterState } from './map-filter-base';

const MapFilterContext = createContext<MapFilterContextType | null>(null);

export function MapFilterProvider({ children }: { children: React.ReactNode }) {
  const value = useMapFilterState();
  return (
    <MapFilterContext.Provider value={value}>
      {children}
    </MapFilterContext.Provider>
  );
}

export function useMapFilter() {
  const context = useContext(MapFilterContext);
  if (!context)
    throw new Error('useMapFilter must be used within MapFilterProvider');
  return context;
}
