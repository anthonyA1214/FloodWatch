'use client';

import { ReportDetailInput, ReportsInput } from '@repo/schemas';
import { createContext, useContext, useState } from 'react';

type DialogType = 'view' | 'delete';

interface ReportDialogContextType {
  reportId: number | null;
  report: ReportsInput | null;
  isOpen: (type: DialogType) => boolean;
  openDialogType: DialogType | null;
  openDialog: {
    (type: 'view', commentId: number): void;
    (type: 'delete', reportId: ReportsInput): void;
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
  const [report, setReport] = useState<ReportsInput | null>(null);
  const [openDialogType, setOpenDialogType] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType, arg: number | ReportsInput) => {
    if (type === 'view') {
      setReportId(arg as number);
    } else {
      setReport(arg as ReportsInput);
    }
    setOpenDialogType(type);
  };

  const closeDialog = () => {
    setOpenDialogType(null);
    setTimeout(() => {
      setReport(null);
    }, 150);
  };

  const isOpen = (type: DialogType) => openDialogType === type;

  return (
    <ReportDialogContext.Provider
      value={{
        reportId,
        report,
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
