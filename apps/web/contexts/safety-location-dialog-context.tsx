'use client';

import { createContext, useContext, useState } from 'react';

type DialogType = 'view' | 'delete' | 'edit';

interface SafetyLocationDialogContextType {
  safetyLocationId: number | null;
  isOpen: (type: DialogType) => boolean;
  openDialogType: DialogType | null;
  openDialog: {
    (type: 'view', safetyLocationId: number): void;
    (type: 'delete', safetyLocation: number): void;
    (type: 'edit', safetyLocationId: number): void;
  };
  closeDialog: () => void;
}

const SafetyLocationDialogContext =
  createContext<SafetyLocationDialogContextType | null>(null);

export default function SafetyLocationDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [safetyLocationId, setSafetyLocationId] = useState<number | null>(null);
  const [openDialogType, setOpenDialogType] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType, arg: number) => {
    setSafetyLocationId(arg);
    setOpenDialogType(type);
  };

  const closeDialog = () => {
    setOpenDialogType(null);
    setTimeout(() => {
      setSafetyLocationId(null);
    }, 150);
  };

  const isOpen = (type: DialogType) => openDialogType === type;

  return (
    <SafetyLocationDialogContext.Provider
      value={{
        safetyLocationId,
        openDialogType,
        openDialog,
        closeDialog,
        isOpen,
      }}
    >
      {children}
    </SafetyLocationDialogContext.Provider>
  );
}

export function useSafetyLocationDialog() {
  const ctx = useContext(SafetyLocationDialogContext);
  if (!ctx)
    throw new Error(
      'useSafetyLocationDialog must be used within SafetyLocationDialogProvider',
    );
  return ctx;
}
