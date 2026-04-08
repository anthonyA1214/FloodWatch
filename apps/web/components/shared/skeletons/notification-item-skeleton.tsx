import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationItemSkeleton() {
  return (
    <div className='relative grid border-l-4 border-l-muted-foreground/20 rounded-lg p-4 gap-4 bg-muted/30'>
      {/* Header row */}
      <div className='flex justify-between gap-8 items-center'>
        {/* Title with icon */}
        <div className='flex items-center gap-2'>
          <Skeleton className='size-5 rounded-sm shrink-0' />
          <Skeleton className='h-4 w-28' />
        </div>
        {/* Timestamp */}
        <div className='flex items-center gap-2'>
          <Skeleton className='size-4 rounded-sm shrink-0' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>

      {/* Message body */}
      <div className='space-y-1.5'>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-4/5' />
      </div>
    </div>
  );
}
