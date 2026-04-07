import { Skeleton } from '@/components/ui/skeleton';

export default function AffectedLocationCardSkeleton() {
  return (
    <div className='grid border-l-4 border-gray-200 rounded-lg p-4 gap-4 bg-gray-50'>
      <div className='flex justify-between gap-8 items-center'>
        {/* Location: icon + name */}
        <div className='flex items-center gap-2'>
          <Skeleton className='size-5 rounded' />
          <Skeleton className='h-4 w-28' />
        </div>
        {/* Severity badge */}
        <Skeleton className='h-7 w-20 rounded-full' />
      </div>
      {/* Message: 2 lines */}
      <div className='space-y-1.5'>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-3/4' />
      </div>
      {/* Reported at */}
      <div className='flex items-center gap-2'>
        <Skeleton className='size-4 rounded' />
        <Skeleton className='h-3 w-24' />
      </div>
    </div>
  );
}
