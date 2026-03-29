'use client';

import { ReportMapPinInput, SafetyMapPinInput } from '@repo/schemas';
import { createContext, useContext, useState } from 'react';

type FloodSeverity = ReportMapPinInput['severity'];
type SafetyType = SafetyMapPinInput['type'];

type MapFilters = {
  severities: Set<FloodSeverity>;
  safetyTypes: Set<SafetyType>;
};

type MapFilterContextType = {
  filters: MapFilters;
  toggleSeverity: (severity: FloodSeverity) => void;
  toggleSafetyType: (safetyType: SafetyType) => void;
  resetFilters: () => void;
  q: string;
  setQ: (q: string) => void;
};

const MapFilterContext = createContext<MapFilterContextType | null>(null);

const ALL_SEVERITIES: FloodSeverity[] = ['critical', 'high', 'moderate', 'low'];
const ALL_SAFETY_TYPES: SafetyType[] = ['shelter', 'hospital'];

const DEFAULT_FILTERS: MapFilters = {
  severities: new Set(ALL_SEVERITIES),
  safetyTypes: new Set(ALL_SAFETY_TYPES),
};

export function MapFilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [q, setQ] = useState('');

  const toggleSeverity = (severity: FloodSeverity) =>
    setFilters((prev) => {
      const newSet = new Set(prev.severities);
      if (newSet.has(severity)) {
        newSet.delete(severity);
      } else {
        newSet.add(severity);
      }

      return { ...prev, severities: newSet };
    });

  const toggleSafetyType = (type: SafetyType) =>
    setFilters((prev) => {
      const newSet = new Set(prev.safetyTypes);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return { ...prev, safetyTypes: newSet };
    });

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <MapFilterContext.Provider
      value={{
        filters,
        toggleSeverity,
        toggleSafetyType,
        resetFilters,
        q,
        setQ,
      }}
    >
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
