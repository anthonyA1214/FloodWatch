import { Skeleton } from '@/components/ui/skeleton';

export default function NeedsAttentionCardSkeleton() {
  return (
    <div className='grid border-l-4 rounded-lg p-4 gap-4 border-l-gray-200 bg-gray-50'>
      <div className='flex justify-between gap-8 items-center'>
        {/* Location */}
        <div className='flex items-center gap-2'>
          <Skeleton
            className='size-6 shrink-0'
            style={{ borderRadius: '9999px' }}
          />
          <Skeleton className='h-5 w-36' />
        </div>
        {/* Badge */}
        <Skeleton className='h-6 w-12 rounded-full' />
      </div>

      {/* Description */}
      <div className='flex flex-col gap-1.5'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>

      {/* Bottom row */}
      <div className='flex items-center justify-between'>
        {/* Reported at */}
        <div className='flex items-center gap-2'>
          <Skeleton className='size-5 rounded-full shrink-0' />
          <Skeleton className='h-4 w-28' />
        </div>
        {/* Review button */}
        <Skeleton className='h-8 w-24 rounded-md' />
      </div>
    </div>
  );
}
