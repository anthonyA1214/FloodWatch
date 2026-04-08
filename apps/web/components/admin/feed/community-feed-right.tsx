'use client';

import InteractiveMapLocation from '@/components/shared/interactive-map-location';
import AffectedLocationsList from './affected-locations-list';
import { useCommunityFeed } from '@/contexts/community-feed-context';
import { useReportDetail } from '@/hooks/use-report-detail';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { IconClock, IconMapPin } from '@tabler/icons-react';
import { SEVERITY_COLOR_MAP } from '@/lib/utils/get-color-map';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useEffect, useRef } from 'react';

export default function CommunityFeedRight() {
  const { reportId } = useCommunityFeed();
  const { reportDetail, isLoading, isValidating } = useReportDetail(reportId);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [reportId]);

  return (
    <div
      ref={scrollRef}
      id='community-feed-scroll'
      className='flex flex-col flex-1 min-h-0 h-full gap-4 overflow-y-auto'
    >
      {isLoading || isValidating ? (
        <div className='flex-none flex flex-col rounded-2xl overflow-hidden border'>
          {/* Carousel skeleton */}
          <div className='relative flex-none flex aspect-4/3'>
            <Skeleton className='absolute inset-0' />
          </div>

          <Separator />

          {/* Info section skeleton */}
          <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-48' />
            </div>
            <div className='flex justify-between items-center'>
              <Skeleton className='h-5 w-16 rounded-full' />
              <Skeleton className='h-4 w-24' />
            </div>
          </div>
        </div>
      ) : (
        reportDetail && (
          <div className='flex-none flex flex-col rounded-2xl overflow-hidden border'>
            {/* Carousel - no border */}
            <Carousel
              className='w-full'
              plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
              opts={{
                loop: true,
                watchDrag: false,
                containScroll: 'keepSnaps',
              }}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className='aspect-4/3 overflow-hidden'>
                    <InteractiveMapLocation
                      key={reportDetail.id}
                      variant='report'
                      latitude={reportDetail.latitude}
                      longitude={reportDetail.longitude}
                      range={reportDetail.range}
                      severity={reportDetail.severity}
                    />
                  </div>
                </CarouselItem>
                {reportDetail.image && (
                  <CarouselItem>
                    <div className='relative aspect-4/3 overflow-hidden'>
                      <Image
                        src={reportDetail.image}
                        alt='Affected location'
                        fill
                        className='object-cover'
                      />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className='left-2' />
              <CarouselNext className='right-2' />
            </Carousel>

            {/* Divider */}
            <Separator />

            {/* Info section - no border, no rounded */}
            <div className='flex flex-col gap-4 p-4'>
              <div className='flex flex-col gap-2'>
                <span className='font-poppins font-medium text-sm'>
                  PREVIEW LOCATION
                </span>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <IconMapPin
                    className='size-[1.5em]! shrink-0'
                    style={{ color: SEVERITY_COLOR_MAP[reportDetail.severity] }}
                  />
                  <span>{reportDetail.location}</span>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <Badge
                  className='text-xs'
                  style={{
                    color: SEVERITY_COLOR_MAP[reportDetail?.severity || 'low'],
                    backgroundColor: `${SEVERITY_COLOR_MAP[reportDetail?.severity || 'low']}25`,
                  }}
                >
                  {reportDetail?.severity?.toUpperCase()}
                </Badge>
                <div className='flex items-center text-xs gap-2 tabular-nums opacity-50'>
                  <IconClock className='w-[1.5em]! h-[1.5em]!' />
                  {formatDistanceToNow(reportDetail?.reportedAt, {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      )}

      <div className='flex-1 flex flex-col gap-4'>
        <AffectedLocationsList />
      </div>
    </div>
  );
}
