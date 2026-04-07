import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardStatCardSkeleton() {
  return (
    <div className='flex items-center rounded-2xl border shadow-xs p-6 gap-6'>
      {/* Icon circle */}
      <Skeleton className='rounded-full size-16 shrink-0' />

      {/* Label + count */}
      <div className='grid space-y-2'>
        <Skeleton className='h-5 w-24' />
        <Skeleton className='h-9 w-16' />
      </div>
    </div>
  );
}
