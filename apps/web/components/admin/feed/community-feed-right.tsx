import PreviewLocationCard from '@/components/admin/feed/preview-location-card';
import InteractiveMapLocation from '@/components/shared/interactive-map-location';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CommunityFeedRight() {
  return (
    <div className='flex-1 min-h-0 h-full'>
      <ScrollArea className='h-full w-full'>
        <div className='flex flex-col pr-4 gap-4'>
          <div className='flex-1 flex aspect-square rounded-2xl overflow-hidden border'>
            <InteractiveMapLocation
              variant='report'
              latitude={14.75665}
              longitude={121.04439}
              range={0.5}
              severity='high'
            />
          </div>

          <PreviewLocationCard />
        </div>
      </ScrollArea>
    </div>
  );
}
