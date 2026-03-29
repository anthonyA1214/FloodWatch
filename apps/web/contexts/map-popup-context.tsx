'use client';

import { useReportMapPins } from '@/hooks/use-report-map-pins';
import { ReportMapPinInput, SafetyMapPinInput } from '@repo/schemas';
import { createContext, RefObject, useContext, useRef, useState } from 'react';
import { useMapFilter } from './map-filter-context';

type ActivePopup =
  | { type: 'report'; report: ReportMapPinInput }
  | { type: 'safety'; safety: SafetyMapPinInput }
  | null;

type MapPopupContextType = {
  activePopup: ActivePopup;
  openReportPopup: (report: ReportMapPinInput) => void;
  openSafetyPopup: (safety: SafetyMapPinInput) => void;
  closePopup: () => void;
  nextReport: () => void;
  prevReport: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  currentReportIndex: number;
  total: number;
  flyToRef: RefObject<
    ((loc: { longitude: number; latitude: number }) => void) | null
  >;
};

const MapPopupContext = createContext<MapPopupContextType | null>(null);

export function MapPopupProvider({ children }: { children: React.ReactNode }) {
  const { reportMapPins } = useReportMapPins();
  const { filters } = useMapFilter();
  const [activePopup, setActivePopup] = useState<ActivePopup>(null);
  const flyToRef = useRef<
    ((loc: { longitude: number; latitude: number }) => void) | null
  >(null);

  const filteredPins = reportMapPins?.filter((pin) =>
    filters.severities.has(pin.severity),
  );

  const flyTo = (loc: { longitude: number; latitude: number }) => {
    flyToRef.current?.(loc);
  };

  const openReportPopup = (report: ReportMapPinInput) => {
    setActivePopup({ type: 'report', report });
    flyTo(report);
  };

  const openSafetyPopup = (safety: SafetyMapPinInput) => {
    setActivePopup({ type: 'safety', safety });
    flyTo(safety);
  };

  const closePopup = () => setActivePopup(null);

  // navigation for report pop up
  const activeReportId =
    activePopup?.type === 'report' ? activePopup.report.id : null;
  const currentIndex =
    filteredPins?.findIndex((r) => r.id === activeReportId) ?? -1;
  const hasNext =
    currentIndex >= 0 && currentIndex < (filteredPins?.length ?? 0) - 1;
  const hasPrev = currentIndex > 0;
  const currentReportIndex = currentIndex + 1;
  const total = filteredPins?.length ?? 0;

  const nextReport = () => {
    if (!hasNext || !filteredPins) return;
    const next = filteredPins[currentIndex + 1];
    setActivePopup({ type: 'report', report: next });
    flyTo(next);
  };

  const prevReport = () => {
    if (!hasPrev || !filteredPins) return;
    const prev = filteredPins[currentIndex - 1];
    setActivePopup({ type: 'report', report: prev });
    flyTo(prev);
  };

  return (
    <MapPopupContext.Provider
      value={{
        activePopup,
        openReportPopup,
        openSafetyPopup,
        closePopup,
        nextReport,
        prevReport,
        hasNext,
        hasPrev,
        currentReportIndex,
        total,
        flyToRef,
      }}
    >
      {children}
    </MapPopupContext.Provider>
  );
}

export function useMapPopup() {
  const context = useContext(MapPopupContext);
  if (!context)
    throw new Error('useMapPopup must be used within MapPopupProvider');
  return context;
}
