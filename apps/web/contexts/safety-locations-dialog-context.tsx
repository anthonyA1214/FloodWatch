'use client';

import { SafetyDetailInput } from '@repo/schemas';
import { createContext, useContext, useState } from 'react';

type DialogType = 'view' | 'delete' | 'edit';

interface SafetyLocationsDialogContextType {
  safetyLocations: SafetyDetailInput | null;
  openDialogType: DialogType | null;
  openDialog: (type: DialogType, safetyLocations: SafetyDetailInput) => void;
  closeDialog: () => void;
  isOpen: (type: DialogType) => boolean;
}

const SafetyLocationsDialogContext =
  createContext<SafetyLocationsDialogContextType | null>(null);

export default function SafetyLocationsDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [safetyLocations, setSafetyLocations] =
    useState<SafetyDetailInput | null>(null);
  const [openDialogType, setOpenDialogType] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType, safetyLocations: SafetyDetailInput) => {
    setSafetyLocations(safetyLocations);
    setOpenDialogType(type);
  };

  const closeDialog = () => {
    setOpenDialogType(null);
    setTimeout(() => {
      setSafetyLocations(null);
    }, 150);
  };

  const isOpen = (type: DialogType) => openDialogType === type;

  return (
    <SafetyLocationsDialogContext.Provider
      value={{
        safetyLocations,
        openDialogType,
        openDialog,
        closeDialog,
        isOpen,
      }}
    >
      {children}
    </SafetyLocationsDialogContext.Provider>
  );
}

export function useSafetyLocationsDialog() {
  const ctx = useContext(SafetyLocationsDialogContext);
  if (!ctx)
    throw new Error(
      'useSafetyLocationsDialog must be used within SafetyLocationsDialogProvider',
    );
  return ctx;
}
