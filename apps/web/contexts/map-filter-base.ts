import { ReportMapPinInput, SafetyLocationMapPinInput } from '@repo/schemas';
import { useState } from 'react';

export type FloodSeverity = ReportMapPinInput['severity'];
export type SafetyType = SafetyLocationMapPinInput['type'];

export type MapFilters = {
  severities: Set<FloodSeverity>;
  safetyTypes: Set<SafetyType>;
};

export type MapFilterContextType = {
  filters: MapFilters;
  resetFilters: () => void;
  q: string;
  setQ: (q: string) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  toggleSeverity: (severity: FloodSeverity) => void;
  toggleSafetyType: (safetyType: SafetyType) => void;
};

export const ALL_SEVERITIES: FloodSeverity[] = [
  'critical',
  'high',
  'moderate',
  'low',
];
export const ALL_SAFETY_TYPES: SafetyType[] = ['shelter', 'hospital'];

export const DEFAULT_FILTERS: MapFilters = {
  severities: new Set(ALL_SEVERITIES),
  safetyTypes: new Set(ALL_SAFETY_TYPES),
};

export function useMapFilterState(): MapFilterContextType {
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [q, setQ] = useState('');
  const [inputValue, setInputValue] = useState('');

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

  return {
    filters,
    resetFilters,
    q,
    setQ,
    inputValue,
    setInputValue,
    toggleSeverity,
    toggleSafetyType,
  };
}
