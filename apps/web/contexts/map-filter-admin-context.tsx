'use client';

import { createContext, useContext, useState } from 'react';

type MapFilterAdminContextType = {
  q: string;
  setQ: (q: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const MapFilterAdminContext = createContext<
  MapFilterAdminContextType | undefined
>(undefined);

export function MapFilterAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [q, setQ] = useState('');
  const [activeTab, setActiveTab] = useState('affected');

  return (
    <MapFilterAdminContext.Provider
      value={{ q, setQ, activeTab, setActiveTab }}
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
