'use client';

import ReportStatCard from './report-stat-card';

type ReportStatCardsProps = {
  totalCount: number;
  verifiedCount: number;
  unverifiedCount: number;
  resolvedCount: number;
  activeStatus: 'total' | 'verified' | 'unverified' | 'resolved';
  onStatusChange: (
    status: 'total' | 'verified' | 'unverified' | 'resolved',
  ) => void;
};

export default function ReportStatCards({
  totalCount,
  verifiedCount,
  unverifiedCount,
  resolvedCount,
  activeStatus,
  onStatusChange,
}: ReportStatCardsProps) {
  return (
    <div className='grid grid-cols-4 gap-8'>
      <ReportStatCard
        label='Total Reports'
        count={totalCount}
        status='total'
        isActive={activeStatus === 'total'}
        onClick={() => onStatusChange('total')}
      />
      <ReportStatCard
        label='Verified Reports'
        count={verifiedCount}
        status='verified'
        isActive={activeStatus === 'verified'}
        onClick={() => onStatusChange('verified')}
      />
      <ReportStatCard
        label='Unverified Reports'
        count={unverifiedCount}
        status='unverified'
        isActive={activeStatus === 'unverified'}
        onClick={() => onStatusChange('unverified')}
      />
      <ReportStatCard
        label='Resolved Reports'
        count={resolvedCount}
        status='resolved'
        isActive={activeStatus === 'resolved'}
        onClick={() => onStatusChange('resolved')}
      />
    </div>
  );
}
