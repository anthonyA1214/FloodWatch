import { Skeleton } from '@/components/ui/skeleton';

export default function ReportDistributionCardSkeleton() {
  return (
    <div className='flex flex-col rounded-2xl border shadow-xs p-4 gap-4'>
      {/* Header */}
      <div className='flex flex-col gap-1.5'>
        <Skeleton className='h-6 w-48' /> {/* Title */}
        <Skeleton className='h-4 w-64' /> {/* Subtitle */}
      </div>

      <div className='grid grid-cols-[1fr_2fr] gap-4 items-center'>
        {/* Donut chart */}
        <div className='aspect-square max-h-[250px] flex items-center justify-center'>
          <div className='relative w-[160px] h-[160px]'>
            <Skeleton className='w-full h-full rounded-full' />
            {/* Inner cutout */}
            <div className='absolute inset-[30px] rounded-full bg-white dark:bg-background flex flex-col items-center justify-center gap-1'>
              <Skeleton className='h-7 w-10' />
              <Skeleton className='h-3 w-14' />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className='flex flex-col justify-center space-y-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Skeleton className='w-3 h-3 rounded-full shrink-0' />
              <Skeleton className='h-4 flex-1' />
              <Skeleton className='h-4 w-6' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
