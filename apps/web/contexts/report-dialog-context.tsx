'use client';

import { createContext, useContext, useState } from 'react';

type DialogType = 'view' | 'delete';

interface ReportDialogContextType {
  reportId: number | null;
  isOpen: (type: DialogType) => boolean;
  openDialogType: DialogType | null;
  openDialog: {
    (type: 'view', reportId: number): void;
    (type: 'delete', reportId: number): void;
  };
  closeDialog: () => void;
}

const ReportDialogContext = createContext<ReportDialogContextType | null>(null);

export default function ReportDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reportId, setReportId] = useState<number | null>(null);
  const [openDialogType, setOpenDialogType] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType, arg: number) => {
    setReportId(arg);
    setOpenDialogType(type);
  };

  const closeDialog = () => {
    setOpenDialogType(null);
    setTimeout(() => {
      setReportId(null);
    }, 150);
  };

  const isOpen = (type: DialogType) => openDialogType === type;

  return (
    <ReportDialogContext.Provider
      value={{
        reportId,
        openDialogType,
        openDialog,
        closeDialog,
        isOpen,
      }}
    >
      {children}
    </ReportDialogContext.Provider>
  );
}

export function useReportDialog() {
  const ctx = useContext(ReportDialogContext);
  if (!ctx)
    throw new Error('useReportDialog must be used within ReportDialogProvider');
  return ctx;
}
