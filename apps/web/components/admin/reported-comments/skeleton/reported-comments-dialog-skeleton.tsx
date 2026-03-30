// reported-comments-dialog-skeleton.tsx

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import ReporterReasonBreakdownSkeleton from './reporter-reason-breakdown-skeleton';

export default function ReportedCommentsDialogSkeleton() {
  return (
    <>
      {/* Blue Header */}
      <div className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0'>
        <Skeleton className='h-4 w-40 bg-white/20' />
      </div>

      {/* Content */}
      <div className='flex-1 min-h-0 overflow-y-auto'>
        <div className='flex flex-col p-6 gap-4'>
          {/* Reported User + Badge */}
          <div className='flex w-full justify-between items-start'>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-3 w-28' />
              <div className='flex items-center gap-3'>
                <Skeleton className='size-8 rounded-full' />
                <div className='flex flex-col gap-1.5'>
                  <Skeleton className='h-3.5 w-28' />
                  <Skeleton className='h-3 w-40' />
                </div>
              </div>
            </div>
            <Skeleton className='h-7 w-20 rounded-full' />
          </div>

          {/* Reported Comment */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3 w-36' />
            <div className='border rounded-md p-3 flex flex-col gap-2'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-[88%]' />
              <Skeleton className='h-3 w-[72%]' />
            </div>
          </div>

          {/* Report Summary */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3 w-32' />
            <ReporterReasonBreakdownSkeleton />
          </div>

          {/* Reporters */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3 w-20' />
            <div className='flex flex-col gap-3 max-h-56 overflow-y-auto p-2'>
              {[0, 1, 2].map((i) => (
                <div key={i} className='flex flex-col gap-2'>
                  {i !== 0 && <Separator />}
                  <div className='flex w-full justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                      <Skeleton className='size-8 rounded-full shrink-0' />
                      <div className='flex flex-col gap-1.5'>
                        <Skeleton className='h-3.5 w-24' />
                        <Skeleton className='h-3 w-32' />
                      </div>
                    </div>
                    <Skeleton className='h-6 w-20 rounded-full shrink-0' />
                  </div>
                  {i === 0 && <Skeleton className='h-3 w-3/4 ml-11' />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='grid grid-cols-3 gap-2 bg-[#F9F9F9] rounded-t-2xl px-5 py-4 shrink-0'>
        <Skeleton className='h-9 w-full' />
        <Skeleton className='h-9 w-full' />
        <Skeleton className='h-9 w-full' />
      </div>
    </>
  );
}
