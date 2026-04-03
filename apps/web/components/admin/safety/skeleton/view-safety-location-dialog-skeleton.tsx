import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function ViewSafetyLocationDialogSkeleton() {
  return (
    <>
      {/* Blue Header */}
      <div className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl p-4 shrink-0'>
        <Skeleton className='h-4 w-36 bg-white/20' />
      </div>

      {/* Content Area */}
      <div className='flex-1 min-h-0 overflow-y-auto'>
        <div className='flex flex-col p-4 gap-4'>
          <div className='flex flex-col gap-4'>
            <div className='flex-1 flex gap-4'>
              {/* Left column — map */}
              <div className='flex-1 flex flex-col gap-4 h-fit'>
                <Skeleton className='flex-1 aspect-4/3 rounded-2xl w-full' />
              </div>

              {/* Right column — details */}
              <div className='flex-1 flex items-center'>
                <div className='flex-1 flex flex-col gap-4 bg-accent border rounded-2xl py-4 h-fit'>
                  {/* Location Name */}
                  <div className='flex flex-col gap-2 px-4'>
                    <Skeleton className='h-3 w-28' />
                    <Skeleton className='h-3.5 w-40' />
                  </div>

                  <Separator />

                  {/* Type + Availability */}
                  <div className='grid grid-cols-2 gap-4 px-4'>
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='h-3 w-10' />
                      <Skeleton className='h-5 w-20 rounded-full' />
                    </div>
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='h-3 w-24' />
                      <Skeleton className='h-3.5 w-20' />
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Number */}
                  <div className='flex flex-col gap-2 px-4'>
                    <Skeleton className='h-3 w-32' />
                    <div className='flex items-center gap-2'>
                      <Skeleton className='size-5 rounded-full shrink-0' />
                      <Skeleton className='h-3.5 w-28' />
                    </div>
                  </div>

                  <Separator />

                  {/* Added On */}
                  <div className='flex flex-col gap-2 px-4'>
                    <Skeleton className='h-3 w-20' />
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-3.5 w-28' />
                      <Skeleton className='size-1.5 rounded-full' />
                      <Skeleton className='h-3.5 w-16' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Row */}
            <div className='flex flex-col gap-4 bg-accent border rounded-2xl p-4 h-fit'>
              <div className='flex items-center gap-2'>
                <Skeleton className='size-5 shrink-0' />
                <Skeleton className='h-3.5 w-3/4' />
              </div>
            </div>
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
    </>
  );
}
