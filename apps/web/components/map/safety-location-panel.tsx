import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  IconCalendarPlus,
  IconChevronLeft,
  IconCircleCheck,
  IconInfoCircle,
  IconPhone,
  IconRoad,
  IconSend,
  IconShield,
} from '@tabler/icons-react';
import { SAFETY_TYPE_COLOR_MAP } from '@/lib/utils/get-color-map';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import NoPhotoEmpty from '../shared/no-photo-empty';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { useSafetyLocationDetail } from '@/hooks/use-safety-location-detail';
import { format } from 'date-fns';
import { SafetyLocationPanelSkeleton } from './skeletons/safety-location-panel-skeleton';

export default function SafetyLocationPanel({
  safetyId,
}: {
  safetyId: number;
}) {
  const { close } = useMapOverlay();
  const { safetyDetail, isLoading } = useSafetyLocationDetail(safetyId);

  const scrollRef = useRef<HTMLDivElement>(null);

  // scroll to top when report changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [safetyId]);

  const formattedTime = safetyDetail
    ? format(safetyDetail?.createdAt, 'hh:mm a')
    : '';
  const formattedDate = safetyDetail
    ? format(safetyDetail?.createdAt, 'MMMM dd, yyyy')
    : '';

  return (
    <div className='relative w-full h-full bg-white z-50 min-h-0 flex flex-col pointer-events-auto'>
      <button
        className='absolute bg-white top-1/2 translate-x-full right-0 h-16 -translate-y-1/2
        rounded-r-2xl ps-1 py-1 pr-1.5 text-xs z-30 shadow-[4px_0px_6px_-1px_rgba(0,0,0,0.1)]'
        onClick={close}
      >
        <IconChevronLeft className='w-[1.5em]! h-[1.5em]!' />
      </button>

      {isLoading || !safetyDetail ? (
        <SafetyLocationPanelSkeleton />
      ) : (
        <div
          ref={scrollRef}
          id='report-panel-scroll'
          className='flex-1 min-h-0 overflow-y-auto'
        >
          {/* image */}
          <div className='aspect-video w-full relative bg-muted shrink-0 '>
            {safetyDetail?.image ? (
              <Image
                src={safetyDetail.image}
                alt='Affected location'
                fill
                className='object-cover'
              />
            ) : (
              <div className='absolute inset-0'>
                <NoPhotoEmpty />
              </div>
            )}
          </div>

          <div
            className='flex flex-col p-4 gap-4 border-l-4 shrink-0'
            style={{
              borderLeftColor: SAFETY_TYPE_COLOR_MAP[safetyDetail?.type],
            }}
          >
            <div className='flex items-center gap-1.5 lg:gap-2 p-3 lg:p-4 bg-[#9B32E4]/10 text-[#9B32E4] rounded-lg text-base'>
              <IconShield className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins font-medium'>
                OFFICIAL INFORMATION
              </span>
            </div>

            {/* location name */}
            <h3 className='font-poppins text-base font-semibold'>
              {safetyDetail?.location}
            </h3>

            <Separator />

            {/* details */}
            <div className='flex flex-col border rounded-lg text-xs lg:text-sm'>
              {/* safety type */}
              <div className='flex justify-between items-center p-3 lg:p-4'>
                <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                  <IconShield className='w-[1.5em]! h-[1.5em]!' />
                  <span className='font-poppins font-medium'>SAFETY TYPE</span>
                </div>

                <div
                  className='flex items-center rounded-full px-3 py-1'
                  style={{
                    color: SAFETY_TYPE_COLOR_MAP[safetyDetail?.type],
                    backgroundColor: `${SAFETY_TYPE_COLOR_MAP[safetyDetail?.type]}25`,
                  }}
                >
                  <span className='font-poppins text-xs font-medium'>
                    {safetyDetail?.type?.toUpperCase()}
                  </span>
                </div>
              </div>

              <Separator />

              <div className='flex justify-between items-center p-3 lg:p-4'>
                <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                  <IconRoad className='w-[1.5em]! h-[1.5em]!' />
                  <span className='font-poppins font-medium'>ADDRESS</span>
                </div>

                <span>{safetyDetail?.address || 'No address provided'}</span>
              </div>

              <Separator />

              {/* added on */}
              <div className='flex justify-between items-start p-3 lg:p-4'>
                <div className='flex items-center gap-1.5 lg:gap-2 opacity-50 shrink-0'>
                  <IconCalendarPlus className='w-[1.5em]! h-[1.5em]!' />
                  <span className='font-poppins font-medium'>ADDED ON</span>
                </div>

                <div className='flex flex-col items-end gap-0.5 text-xs lg:text-sm text-right'>
                  <span>{formattedDate}</span>
                  <span className='opacity-50'>{formattedTime}</span>
                </div>
              </div>

              {safetyDetail?.availability && (
                <>
                  <Separator />

                  <div className='flex justify-between items-center p-3 lg:p-4'>
                    <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                      <IconCircleCheck className='w-[1.5em]! h-[1.5em]!' />
                      <span className='font-poppins font-medium'>
                        AVAILABILITY
                      </span>
                    </div>

                    <span>{safetyDetail?.availability}</span>
                  </div>
                </>
              )}

              {safetyDetail?.contactNumber && (
                <>
                  <Separator />

                  <div className='flex justify-between items-center p-3 lg:p-4'>
                    <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                      <IconPhone className='w-[1.5em]! h-[1.5em]!' />
                      <span className='font-poppins font-medium'>
                        CONTACT NUMBER
                      </span>
                    </div>

                    <span>{safetyDetail?.contactNumber}</span>
                  </div>
                </>
              )}

              {/**/}
            </div>

            {/* description */}
            {safetyDetail?.description && (
              <div className='flex flex-col border rounded-lg text-xs lg:text-sm p-3 lg:p-4 gap-0.5'>
                <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                  <IconInfoCircle className='w-[1.5em]! h-[1.5em]!' />
                  <span className='font-poppins font-medium'>DESCRIPTION</span>
                </div>

                <p>{safetyDetail?.description}</p>
              </div>
            )}

            <Button className='rounded-lg h-12'>
              <IconSend className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins font-medium'>GET DIRECTIONS</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
