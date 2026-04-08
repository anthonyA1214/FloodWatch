'use client';
import { createContext, useContext, useState } from 'react';
import { MapFilterContextType, useMapFilterState } from './map-filter-base';

type MapFilterAdminContextType = MapFilterContextType & {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const MapFilterAdminContext = createContext<MapFilterAdminContextType | null>(
  null,
);

export function MapFilterAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = useMapFilterState();
  const [activeTab, setActiveTab] = useState('affected');

  return (
    <MapFilterAdminContext.Provider
      value={{ ...base, activeTab, setActiveTab }}
    >
      {children}
    </MapFilterAdminContext.Provider>
  );
}

export function useMapFilterAdmin() {
  const context = useContext(MapFilterAdminContext);
  if (!context)
    throw new Error(
      'useMapFilterAdmin must be used within MapFilterAdminProvider',
    );
  return context;
}
