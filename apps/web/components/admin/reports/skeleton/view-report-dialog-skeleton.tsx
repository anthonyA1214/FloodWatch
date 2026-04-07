import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function ViewReportDialogSkeleton() {
  return (
    <>
      {/* Blue Header */}
      <div className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0'>
        <Skeleton className='h-4 w-32 bg-white/20' />
      </div>

      {/* Content */}
      <div className='flex-1 min-h-0 overflow-y-auto'>
        <div className='flex flex-col p-4 gap-4'>
          <div className='flex gap-4'>
            {/* Left — Map */}
            <div className='flex-1'>
              <Skeleton className='w-full aspect-4/3 rounded-2xl' />
            </div>

            {/* Right — Details card */}
            <div className='flex-1'>
              <div className='flex flex-col gap-4 bg-accent border rounded-2xl py-4'>
                {/* Reporter */}
                <div className='flex flex-col gap-2 px-4'>
                  <Skeleton className='h-3 w-16' />
                  <div className='flex items-center gap-3'>
                    <Skeleton className='size-8 rounded-full shrink-0' />
                    <div className='flex flex-col gap-1.5'>
                      <Skeleton className='h-3.5 w-24' />
                      <Skeleton className='h-3 w-36' />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Severity + Status */}
                <div className='grid grid-cols-2 gap-4 px-4'>
                  <div className='flex flex-col gap-2'>
                    <Skeleton className='h-3 w-16' />
                    <Skeleton className='h-5 w-14 rounded-full' />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <Skeleton className='h-3 w-14' />
                    <Skeleton className='h-5 w-20 rounded-full' />
                  </div>
                </div>

                <Separator />

                {/* Reported At */}
                <div className='flex flex-col gap-2 px-4'>
                  <Skeleton className='h-3 w-24' />
                  <div className='flex items-center gap-2 h-4'>
                    <Skeleton className='h-3 w-28' />
                    <Separator orientation='vertical' />
                    <Skeleton className='h-3 w-16' />
                  </div>
                </div>

                <Separator />

                {/* Confirms / Denies / Credibility */}
                <div className='grid grid-cols-3 gap-4 px-4'>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className='flex flex-col gap-2 items-center'>
                      <Skeleton className='h-3 w-14' />
                      <Skeleton className='h-4 w-8' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className='flex items-center gap-2 bg-accent border rounded-2xl p-4'>
            <Skeleton className='size-5 shrink-0 rounded' />
            <Skeleton className='h-3 w-3/4' />
          </div>

          {/* Description */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-28' />
            <div className='bg-accent border rounded-2xl p-4 flex flex-col gap-2'>
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-[85%]' />
              <Skeleton className='h-3 w-[65%]' />
            </div>
          </div>

          {/* Image */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='w-full aspect-video rounded-2xl' />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between bg-[#F9F9F9] rounded-t-2xl px-5 py-4 shrink-0'>
        <Skeleton className='h-3 w-52' />
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-20 rounded-md' />
          <Skeleton className='h-9 w-32 rounded-md' />
        </div>
      </div>
    </>
  );
}
