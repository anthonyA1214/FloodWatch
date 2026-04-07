'use client';

import { ReportedCommentInput } from '@repo/schemas';
import { createContext, useContext, useState } from 'react';

type DialogType = 'view' | 'delete';

interface ReportedCommentsDialogContextType {
  commentId: number | null;
  reportedComment: ReportedCommentInput | null;
  isOpen: (type: DialogType) => boolean;
  openDialogType: DialogType | null;
  openDialog: {
    (type: 'view', commentId: number): void;
    (type: 'delete', reportedComment: ReportedCommentInput): void;
  };
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
  const [reportedComment, setReportedComment] =
    useState<ReportedCommentInput | null>(null);
  const [openDialogType, setOpenDialogType] = useState<DialogType | null>(null);

  const openDialog = (type: DialogType, arg: number | ReportedCommentInput) => {
    if (type === 'view') {
      setCommentId(arg as number);
    } else {
      setReportedComment(arg as ReportedCommentInput);
    }
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
        reportedComment,
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
