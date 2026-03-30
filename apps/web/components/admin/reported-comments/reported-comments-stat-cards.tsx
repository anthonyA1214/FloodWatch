'use client';

import ReportedCommentsStatCard from '../reported-comments/reported-comments-stat-card';

type ReportStatCardsProps = {
  stats: {
    totalCount: number;
    pendingCount: number;
    resolvedCount: number;
    dismissedCount: number;
  };
  activeStatus: 'total' | 'pending' | 'resolved' | 'dismissed';
  onStatusChange: (
    status: 'total' | 'pending' | 'resolved' | 'dismissed',
  ) => void;
};

export default function ReportedCommentsStatCards({
  stats,
  activeStatus,
  onStatusChange,
}: ReportStatCardsProps) {
  return (
    <div className='grid grid-cols-4 gap-8'>
      <ReportedCommentsStatCard
        label='Total'
        count={stats.totalCount}
        status='total'
        isActive={activeStatus === 'total'}
        onClick={() => onStatusChange('total')}
      />
      <ReportedCommentsStatCard
        label='Pending'
        count={stats.pendingCount}
        status='pending'
        isActive={activeStatus === 'pending'}
        onClick={() => onStatusChange('pending')}
      />
      <ReportedCommentsStatCard
        label='Resolved'
        count={stats.resolvedCount}
        status='resolved'
        isActive={activeStatus === 'resolved'}
        onClick={() => onStatusChange('resolved')}
      />
      <ReportedCommentsStatCard
        label='Dismissed'
        count={stats.dismissedCount}
        status='dismissed'
        isActive={activeStatus === 'dismissed'}
        onClick={() => onStatusChange('dismissed')}
      />
    </div>
  );
}
