'use client';

import { SafetyLocationInput } from '@repo/schemas';
import { createContext, useContext, useState } from 'react';

type DialogType = 'view' | 'delete' | 'edit';

interface SafetyLocationsDialogContextType {
  safetyLocationId: number | null;
  safetyLocation: SafetyLocationInput | null;
  isOpen: (type: DialogType) => boolean;
  openDialogType: DialogType | null;
  openDialog: {
    (type: 'view', safetyLocationId: number): void;
    (type: 'delete', safetyLocation: SafetyLocationInput): void;
    (type: 'edit', safetyLocationId: number): void;
  };
  closeDialog: () => void;
}

const SafetyLocationsDialogContext =
  createContext<SafetyLocationsDialogContextType | null>(null);

export default function SafetyLocationsDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [safetyLocationId, setSafetyLocationId] = useState<number | null>(null);
  const [safetyLocation, setSafetyLocation] =
    useState<SafetyLocationInput | null>(null);
  const [openDialogType, setOpenDialogType] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType, arg: number | SafetyLocationInput) => {
    if (type === 'view' || type === 'edit') {
      setSafetyLocationId(arg as number);
    } else {
      setSafetyLocation(arg as SafetyLocationInput);
    }
    setOpenDialogType(type);
  };

  const closeDialog = () => {
    setOpenDialogType(null);
    setTimeout(() => {
      setSafetyLocation(null);
    }, 150);
  };

  const isOpen = (type: DialogType) => openDialogType === type;

  return (
    <SafetyLocationsDialogContext.Provider
      value={{
        safetyLocationId,
        safetyLocation,
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
