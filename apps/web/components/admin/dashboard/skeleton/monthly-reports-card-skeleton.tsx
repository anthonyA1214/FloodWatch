import { Skeleton } from '@/components/ui/skeleton';

export default function MonthlyReportsCardSkeleton() {
  // fixed px heights so bars are always visible
  const bars = [120, 160, 80, 175, 110, 140];

  return (
    <div className='h-full flex flex-col rounded-2xl border shadow-xs p-4 gap-4'>
      {/* Header */}
      <div className='flex flex-col gap-1.5'>
        <Skeleton className='h-6 w-44' />
        <Skeleton className='h-4 w-60' />
      </div>

      {/* Chart area */}
      <div className='flex gap-3 px-2'>
        {/* Y-axis ticks */}
        <div
          className='flex flex-col justify-between shrink-0 pb-6'
          style={{ height: 220 }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-3 w-6' />
          ))}
        </div>

        {/* Bars + X labels */}
        <div className='flex-1 flex flex-col gap-2'>
          {/* Bar area — fixed height, bars align to bottom */}
          <div className='flex items-end gap-3' style={{ height: 195 }}>
            {bars.map((h, i) => (
              <div key={i} className='flex-1 flex flex-col items-center gap-1'>
                <Skeleton className='h-3 w-5 shrink-0' />
                <Skeleton className='w-full rounded-lg' style={{ height: h }} />
              </div>
            ))}
          </div>
          {/* X-axis labels */}
          <div className='flex gap-3'>
            {bars.map((_, i) => (
              <Skeleton key={i} className='flex-1 h-3' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
