import { Skeleton } from '@/components/ui/skeleton';

export default function SafetyLocationCardSkeleton() {
  return (
    <div className='grid border-l-4 rounded-lg p-4 gap-4 border-l-gray-200 bg-gray-50'>
      <div className='flex justify-between items-center gap-8'>
        {/* Location */}
        <div className='flex items-center gap-2'>
          <Skeleton className='w-6 h-6 rounded-full' /> {/* Icon */}
          <Skeleton className='h-5 w-40' /> {/* Location name */}
        </div>
        {/* Badge */}
        <Skeleton className='h-6 w-20 rounded-full' />
      </div>

      {/* Address */}
      <Skeleton className='h-4 w-3/4' />

      {/* Availability */}
      <div className='flex items-center gap-2'>
        <Skeleton className='w-5 h-5 rounded-full' /> {/* Clock icon */}
        <Skeleton className='h-4 w-28' />
      </div>
    </div>
  );
}
