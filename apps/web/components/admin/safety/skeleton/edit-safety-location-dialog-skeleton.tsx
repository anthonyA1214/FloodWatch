import { Skeleton } from '@/components/ui/skeleton';

export default function EditSafetyLocationDialogSkeleton() {
  return (
    <>
      {/* Blue Header */}
      <div className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0'>
        <Skeleton className='h-4 w-48 bg-white/20' />
      </div>

      {/* Content */}
      <div className='flex-1 min-h-0 overflow-y-auto'>
        <div className='flex flex-col p-4 gap-4'>
          {/* Map Header Row */}
          <div className='flex items-center justify-between'>
            <Skeleton className='h-3.5 w-40' />
            <Skeleton className='h-8 w-52 rounded-lg' />
          </div>

          {/* Map */}
          <Skeleton className='w-full aspect-video rounded-2xl' />

          {/* Latitude + Longitude */}
          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-3.5 w-20' />
              <Skeleton className='h-9 w-full rounded-md' />
            </div>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-3.5 w-24' />
              <Skeleton className='h-9 w-full rounded-md' />
            </div>
          </div>

          {/* Location Name */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3.5 w-32' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Safety Type + Availability */}
          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-3.5 w-44' />
              <Skeleton className='h-9 w-full rounded-md' />
            </div>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-3.5 w-28' />
              <Skeleton className='h-9 w-full rounded-md' />
            </div>
          </div>

          {/* Contact Number */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3.5 w-36' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Address */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3.5 w-20' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Description */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3.5 w-36' />
            <Skeleton className='h-[120px] w-full rounded-md' />
          </div>

          {/* Image Upload */}
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3.5 w-32' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='grid grid-cols-2 gap-2 bg-[#F9F9F9] rounded-t-2xl p-4 shrink-0'>
        <Skeleton className='h-9 w-full rounded-md' />
        <Skeleton className='h-9 w-full rounded-md' />
      </div>
    </>
  );
}
