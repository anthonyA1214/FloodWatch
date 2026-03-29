'use client';

import { ReportMapPinInput, SafetyMapPinInput } from '@repo/schemas';
import { createContext, RefObject, useContext, useRef, useState } from 'react';

type ActivePin =
  | { type: 'report'; report: ReportMapPinInput }
  | { type: 'safety'; safety: SafetyMapPinInput }
  | null;

type MapHighlightContextType = {
  activePin: ActivePin;
  setActivePin: (pin: ActivePin) => void;
  flyToRef: RefObject<
    ((loc: { longitude: number; latitude: number }) => void) | null
  >;
};

const MapHighlightContext = createContext<MapHighlightContextType | null>(null);

export function MapHighlightProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activePin, setActivePin] = useState<ActivePin>(null);
  const flyToRef = useRef<
    ((loc: { longitude: number; latitude: number }) => void) | null
  >(null);

  const flyTo = (loc: { longitude: number; latitude: number }) => {
    flyToRef.current?.(loc);
  };

  const setActivePinWithFlyTo = (pin: ActivePin) => {
    setActivePin(pin);
    if (pin) {
      const loc =
        pin.type === 'report'
          ? { longitude: pin.report.longitude, latitude: pin.report.latitude }
          : { longitude: pin.safety.longitude, latitude: pin.safety.latitude };
      flyTo(loc);
    }
  };

  return (
    <MapHighlightContext.Provider
      value={{
        activePin,
        setActivePin: setActivePinWithFlyTo,
        flyToRef,
      }}
    >
      {children}
    </MapHighlightContext.Provider>
  );
}

export function useMapHighlight() {
  const context = useContext(MapHighlightContext);
  if (!context) {
    throw new Error(
      'useMapHighlight must be used within a MapHighlightProvider',
    );
  }
  return context;
}
