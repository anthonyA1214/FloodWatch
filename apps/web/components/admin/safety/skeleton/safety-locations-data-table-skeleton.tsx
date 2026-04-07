import { Skeleton } from '@/components/ui/skeleton';

export function SafetyLocationsDataTableSkeleton() {
  return (
    <div className='overflow-hidden rounded-lg flex flex-col flex-1 min-h-0 h-0'>
      {/* Header */}
      <div className='bg-[#0066CC] flex items-center px-4 py-3 gap-4'>
        {/* LOCATION */}
        <div className='flex-[1.5]'>
          <Skeleton className='h-3 w-20 bg-blue-400' />
        </div>

        {/* ADDRESS */}
        <div className='flex-2'>
          <Skeleton className='h-3 w-24 bg-blue-400' />
        </div>

        {/* TYPE */}
        <div className='flex-1 flex justify-center'>
          <Skeleton className='h-3 w-12 bg-blue-400' />
        </div>

        {/* ACTIONS */}
        <div className='flex-1 flex justify-center'>
          <Skeleton className='h-3 w-16 bg-blue-400' />
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className='flex items-center px-4 py-3 gap-4 border-b border-gray-100 last:border-0'
        >
          {/* LOCATION */}
          <div className='flex-[1.5]'>
            <Skeleton className='h-3 w-32' />
          </div>

          {/* ADDRESS */}
          <div className='flex-2'>
            <Skeleton className='h-3 w-48' />
          </div>

          {/* TYPE (pill) */}
          <div className='flex-1 flex justify-center'>
            <Skeleton className='h-7 w-28 rounded-full' />
          </div>

          {/* ACTIONS */}
          <div className='flex-1 flex justify-center gap-2'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-8 w-8 rounded-lg' />
          </div>
        </div>
      ))}
    </div>
  );
}
