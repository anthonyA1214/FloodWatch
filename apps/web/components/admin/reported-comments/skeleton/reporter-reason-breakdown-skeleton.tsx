import { Skeleton } from '@/components/ui/skeleton';

export default function ReporterReasonBreakdownSkeleton() {
  return (
    <div className='flex flex-col gap-4 w-full'>
      {[90, 70, 110].map((w, i) => (
        <div key={i} className='flex flex-col gap-1.5 w-full'>
          {/* Label row: color swatch + reason label + percentage */}
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <Skeleton className='size-4 rounded-sm' />
              <Skeleton style={{ width: w }} className='h-3' />
            </div>
            <Skeleton className='h-3 w-8' />
          </div>
          {/* Progress bar */}
          <Skeleton className='h-2 w-full rounded-full' />
        </div>
      ))}
    </div>
  );
}
