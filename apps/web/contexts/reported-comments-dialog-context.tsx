'use client';

import { createContext, useContext, useState } from 'react';

type DialogType = 'view' | 'delete';

interface ReportedCommentsDialogContextType {
  commentId: number | null;
  isOpen: (type: DialogType) => boolean;
  openDialogType: DialogType | null;
  openDialog: (type: DialogType, commentId: number) => void;
  closeDialog: () => void;
}

const ReportedCommentsDialogContext =
  createContext<ReportedCommentsDialogContextType | null>(null);

export function ReportedCommentsDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [commentId, setCommentId] = useState<number | null>(null);
  const [openDialogType, setOpenDialogType] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType, id: number) => {
    setCommentId(id);
    setOpenDialogType(type);
  };

  const closeDialog = () => {
    setOpenDialogType(null);
    setTimeout(() => {
      setCommentId(null);
    }, 150);
  };

  const isOpen = (type: DialogType) => openDialogType === type;

  return (
    <ReportedCommentsDialogContext.Provider
      value={{
        commentId,
        isOpen,
        openDialog,
        closeDialog,
        openDialogType,
      }}
    >
      {children}
    </ReportedCommentsDialogContext.Provider>
  );
}

export function useReportedCommentsDialog() {
  const ctx = useContext(ReportedCommentsDialogContext);
  if (!ctx)
    throw new Error(
      'useReportedCommentsDialog must be used within ReportedCommentsDialogProvider',
    );
  return ctx;
}
