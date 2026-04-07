'use client';

import { useReportsNeedingAttention } from '@/hooks/use-dashboard';
import NeedsAttentionCard from './needs-attention-card';
import NeedsAttentionCardSkeleton from './skeleton/needs-attention-card-skeleton';
import LocationsListEmpty from '@/components/map/empty/locations-list-empty';

export default function NeedsAttentionPanel() {
  const { reportsNeedingAttention, isLoading } = useReportsNeedingAttention();

  return (
    <div className='flex flex-col rounded-2xl border shadow-xs p-4 gap-4 h-full'>
      {/*header*/}
      <div className='flex flex-col'>
        <div className='flex items-center gap-2'>
          <div className='relative flex'>
            <div className='relative size-2 shrink-0 rounded-full bg-[#FB2C36]' />
            <div className='absolute animate-ping size-2 shrink-0 rounded-full bg-[#FB2C36]' />
          </div>

          <h3 className='font-poppins font-medium text-lg'>NEEDS ATTENTION</h3>
        </div>
        <span className='opacity-50'>
          Reports that require your attention. Please review and take necessary
          actions.
        </span>
      </div>

      <div className='flex flex-col overflow-y-auto h-full'>
        {isLoading ? (
          <div className='space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <NeedsAttentionCardSkeleton key={i} />
            ))}
          </div>
        ) : reportsNeedingAttention && reportsNeedingAttention.length > 0 ? (
          <div className='space-y-4'>
            {reportsNeedingAttention.map((report) => (
              <NeedsAttentionCard
                key={report.id}
                id={report.id}
                location={report.location}
                description={report.description}
                reportedAt={report.reportedAt}
                confirms={report.confirms}
              />
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <LocationsListEmpty
              title='No reports needing attention'
              description='There are currently no reports requiring attention.'
            />
          </div>
        )}
      </div>
    </div>
  );
}
