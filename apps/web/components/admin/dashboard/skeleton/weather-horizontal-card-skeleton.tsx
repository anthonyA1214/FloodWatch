import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Fragment } from 'react';

export default function WeatherHorizontalCardSkeleton() {
  return (
    <div className='flex items-center rounded-2xl border shadow-xs p-4 gap-4'>
      {/* Col 1 - Current weather */}
      <div className='flex-[1.5] flex flex-col items-center justify-center gap-2 w-full'>
        <div className='flex items-center gap-2'>
          <Skeleton className='w-9 h-9 rounded-full' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-3 w-20' />
          </div>
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-3 w-14' />
          <Skeleton className='h-3 w-14' />
        </div>
      </div>

      {/* Daily cols 2-8 */}
      {Array.from({ length: 7 }).map((_, i) => (
        <Fragment key={i}>
          <Separator orientation='vertical' />
          <div className='flex-1 flex flex-col items-center gap-1'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-4 w-10' />
              <Skeleton className='h-3 w-10' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-7 h-7 rounded-full' />
              <Skeleton className='h-4 w-10' />
              <Skeleton className='h-4 w-10' />
            </div>
            <Skeleton className='h-3 w-10' />
          </div>
        </Fragment>
      ))}
    </div>
  );
}
