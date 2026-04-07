import { Skeleton } from '@/components/ui/skeleton';

export function ReportedCommentsDataTableSkeleton() {
  return (
    <div className='overflow-hidden rounded-lg flex flex-col flex-1 min-h-0 h-0'>
      {/* Header */}
      <div className='bg-[#0066CC] flex items-center px-4 py-3 gap-4'>
        {/* USER col */}
        <div className='flex-2'>
          <Skeleton className='h-3 w-10 bg-blue-400' />
        </div>
        {/* REPORTS col */}
        <div className='flex-1'>
          <Skeleton className='h-3 w-16 bg-blue-400' />
        </div>
        {/* STATUS col */}
        <div className='flex-1 flex justify-center'>
          <Skeleton className='h-3 w-12 bg-blue-400' />
        </div>
        {/* ACTIONS col */}
        <div className='flex-1 flex justify-center'>
          <Skeleton className='h-3 w-14 bg-blue-400' />
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className='flex items-center px-4 py-3 gap-4 border-b border-gray-100 last:border-0'
        >
          {/* USER: avatar + name/email */}
          <div className='flex-2 flex items-center gap-3'>
            <Skeleton className='size-8 rounded-full shrink-0' />
            <div className='flex flex-col gap-1.5'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-2.5 w-32' />
            </div>
          </div>

          {/* REPORTS: count */}
          <div className='flex-1'>
            <Skeleton className='h-3 w-20' />
          </div>

          {/* STATUS: pill */}
          <div className='flex-1 flex justify-center'>
            <Skeleton className='h-7 w-24 rounded-full' />
          </div>

          {/* ACTIONS: eye + trash */}
          <div className='flex-1 flex justify-center gap-2'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-8 w-8 rounded-lg' />
          </div>
        </div>
      ))}
    </div>
  );
}
