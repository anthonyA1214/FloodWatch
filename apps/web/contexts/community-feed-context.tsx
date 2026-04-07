'use client';

import { createContext, useContext, useState } from 'react';

interface CommunityFeedContextType {
  reportId: number | null;
  openReport: (id: number) => void;
  closeReport: () => void;
  q: string;
  setQ: (q: string) => void;
}

const CommunityFeedContext = createContext<CommunityFeedContextType | null>(
  null,
);

export function CommunityFeedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reportId, setReportId] = useState<number | null>(null);
  const [q, setQ] = useState('');

  const openReport = (id: number) => {
    setReportId(id);
  };

  const closeReport = () => {
    setReportId(null);
  };

  return (
    <CommunityFeedContext.Provider
      value={{ reportId, openReport, closeReport, q, setQ }}
    >
      {children}
    </CommunityFeedContext.Provider>
  );
}

export function useCommunityFeed() {
  const context = useContext(CommunityFeedContext);
  if (!context)
    throw new Error(
      'useCommunityFeed must be used within CommunityFeedProvider',
    );
  return context;
}
