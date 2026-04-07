import { Skeleton } from '@/components/ui/skeleton';
import DashboardStatCardSkeleton from './dashboard-stat-card-skeleton';
import AffectedLocationCardSkeleton from './affected-location-card-skeleton';
import NeedsAttentionCardSkeleton from './needs-attention-card-skeleton';
import WeatherHorizontalCardSkeleton from './weather-horizontal-card-skeleton';
import ReportDistributionCardSkeleton from './report-distribution-card-skeleton';
import MonthlyReportsCardSkeleton from './monthly-reports-card-skeleton';

export default function DashboardSkeleton() {
  return (
    <div className='flex-1 flex flex-col bg-white p-8 rounded-2xl gap-8 min-h-0 overflow-y-auto overflow-x-auto'>
      {/* Header */}
      <div className='space-y-2'>
        <Skeleton className='h-9 w-64' />
        <Skeleton className='h-5 w-80' />
      </div>

      <div className='flex-1 flex flex-col gap-4'>
        {/* Stat Cards */}
        <div className='grid grid-cols-4 gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardStatCardSkeleton key={i} />
          ))}
        </div>

        {/* Weather Row */}
        <WeatherHorizontalCardSkeleton />

        {/* Grid */}
        <div className='grid grid-cols-2 gap-4'>
          {/* Location Monitor Panel */}
          <div className='min-h-[500px] max-h-[500px] flex flex-col rounded-2xl border shadow-xs p-4 gap-4'>
            {/* Header */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Skeleton
                  className='size-6'
                  style={{ borderRadius: '9999px' }}
                />
                <Skeleton className='h-6 w-44' />
              </div>
              <Skeleton className='h-8 w-24 rounded-md' />
            </div>
            {/* Tabs */}
            <div className='flex gap-4 border-b pb-2'>
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-5 w-40' />
            </div>
            {/* Cards */}
            <div className='flex flex-col gap-4 overflow-hidden'>
              {Array.from({ length: 3 }).map((_, i) => (
                <AffectedLocationCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Needs Attention Panel */}
          <div className='min-h-[500px] max-h-[500px] flex flex-col rounded-2xl border shadow-xs p-4 gap-4'>
            {/* Header */}
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center gap-2'>
                <Skeleton
                  className='size-2'
                  style={{ borderRadius: '9999px' }}
                />
                <Skeleton className='h-6 w-44' />
              </div>
              <Skeleton className='h-4 w-72' />
            </div>
            {/* Cards */}
            <div className='flex flex-col gap-4 overflow-hidden'>
              {Array.from({ length: 3 }).map((_, i) => (
                <NeedsAttentionCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Monthly Reports */}
          <MonthlyReportsCardSkeleton />

          {/* Report Distribution */}
          <ReportDistributionCardSkeleton />
        </div>
      </div>
    </div>
  );
}
