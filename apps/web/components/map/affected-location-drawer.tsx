'use client';

import {
  REPORT_STATUS_COLOR_MAP,
  SEVERITY_COLOR_MAP,
} from '@/lib/utils/get-color-map';
import {
  IconCircleCheck,
  IconClock,
  IconExclamationCircle,
  IconHelpCircle,
  IconInfoCircle,
  IconSend,
  IconShield,
  IconShieldCheck,
  IconUser,
} from '@tabler/icons-react';
import { clsx } from 'clsx';
import { format, formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Drawer } from 'vaul';
import PostComposer from '@/components/shared/comment-composer';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { Separator } from '@/components/ui/separator';
import { useReportDetail } from '@/hooks/use-report-detail';
import NoPhotoEmpty from '../shared/no-photo-empty';
import { Button } from '../ui/button';
import { AffectedLocationDrawerSkeleton } from './skeletons/affected-location-drawer-skeleton';
import CommentsList from '../shared/comments-list';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import ReportPaginationOverlay from './report-pagination-overlay';
import { useMyVote } from '@/hooks/use-my-vote';
import VoteButtons from './vote-buttons';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { useReportMapPins } from '@/hooks/use-report-map-pins';
import { useDirections } from '@/hooks/use-directions';
import { useMapRouting } from '@/contexts/map-routing-context';
import { Spinner } from '../ui/spinner';

const snapPoints = ['0px', '355px', 1];

export default function AffectedLocationDrawer({
  reportId,
}: {
  reportId: number;
}) {
  const { close } = useMapOverlay();
  const [snap, setSnap] = useState<number | string | null>(snapPoints[1]);
  const [open, setOpen] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) close?.();
  };

  const { reportDetail, isLoading } = useReportDetail(reportId);
  const { isLoading: isMyVoteLoading } = useMyVote(reportId);

  const { reportMapPins } = useReportMapPins();
  const { getDirections } = useDirections();
  const { isLoadingRoute } = useMapRouting();

  const destination = reportMapPins?.find((p) => p.id === reportId);

  const scrollRef = useRef<HTMLDivElement>(null);

  // scroll to top when report changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [reportId]);

  const formattedTime = reportDetail
    ? format(reportDetail?.reportedAt, 'hh:mm a')
    : '';
  const formattedDate = reportDetail
    ? format(reportDetail?.reportedAt, 'MMMM dd, yyyy')
    : '';

  const confirms = reportDetail?.confirms;
  const denies = reportDetail?.denies;

  const credibility =
    confirms !== undefined && denies !== undefined
      ? confirms + denies === 0
        ? 0
        : Math.round((confirms / (confirms + denies)) * 100)
      : 0;

  return (
    <Drawer.Root
      modal={false}
      dismissible={true}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      handleOnly={true}
      setActiveSnapPoint={(newSnap) => {
        if (newSnap === snapPoints[0]) {
          handleOpenChange(false);
        } else {
          setSnap(newSnap);
        }
      }}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Drawer.Overlay className='absolute inset-0 bg-black/40 pointer-events-none' />

      <VisuallyHidden>
        <Drawer.Title>Reported Location</Drawer.Title>
      </VisuallyHidden>

      <Drawer.Content
        data-testid='content'
        className='z-1001 absolute flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-full -mx-px'
      >
        <Drawer.Handle className='w-16! my-3! rounded-full! shrink-0!' />

        {isLoading || isMyVoteLoading || !reportDetail ? (
          <AffectedLocationDrawerSkeleton />
        ) : (
          <div
            ref={scrollRef}
            id='report-drawer-scroll'
            className={clsx('flex flex-col max-w-lg mx-auto w-full gap-2', {
              'overflow-y-auto': snap === 1,
              'overflow-hidden': snap !== 1,
            })}
          >
            {/* report details */}
            <div
              className='flex flex-col p-2 sm:p-3 gap-2 lg:gap-3 border-l-4 shrink-0'
              style={{
                borderLeftColor: SEVERITY_COLOR_MAP[reportDetail?.severity],
              }}
            >
              {reportDetail?.isAdmin && (
                <div className='flex items-center gap-1.5 lg:gap-2 p-3 lg:p-4 bg-[#9B32E4]/10 text-[#9B32E4] rounded-lg text-sm lg:text-base'>
                  <IconShield className='w-[1.5em]! h-[1.5em]!' />
                  <span className='font-poppins font-medium'>
                    OFFICIAL INFORMATION
                  </span>
                </div>
              )}

              {/* row 1 */}
              <Drawer.Title className='font-poppins text-sm lg:text-base font-semibold'>
                {reportDetail?.location}
              </Drawer.Title>

              <Separator />

              {/* badge and distance to now */}
              <div className='flex flex-row justify-between gap-3'>
                <div className='flex items-center text-xs lg:text-sm gap-1.5 lg:gap-2 tabular-nums opacity-50'>
                  <IconClock className='w-[1.5em]! h-[1.5em]!' />
                  {formatDistanceToNow(reportDetail?.reportedAt, {
                    addSuffix: true,
                  })}
                </div>

                <div
                  className='flex items-center rounded-full px-3 py-1 w-fit h-fit'
                  style={{
                    color: REPORT_STATUS_COLOR_MAP[reportDetail?.status],
                    backgroundColor: `${REPORT_STATUS_COLOR_MAP[reportDetail?.status]}25`,
                  }}
                >
                  <div className='flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm'>
                    {reportDetail?.status === 'verified' ? (
                      <IconCircleCheck className='w-[1.5em]! h-[1.5em]!' />
                    ) : (
                      <IconHelpCircle className='w-[1.5em]! h-[1.5em]!' />
                    )}
                    <span className='font-poppins font-medium'>
                      {reportDetail?.status.toUpperCase()} REPORT
                    </span>
                  </div>
                </div>
              </div>

              {/* details */}
              <div className='flex flex-col border rounded-lg text-xs lg:text-sm'>
                <div className='flex justify-between items-center p-3 lg:p-4'>
                  <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                    <IconUser className='w-[1.5em]! h-[1.5em]!' />
                    <span className='font-poppins font-medium'>
                      REPORTED BY
                    </span>
                  </div>

                  <div className='flex items-center gap-2'>
                    <UIAvatar className='size-5'>
                      <AvatarImage
                        src={
                          reportDetail?.reporter?.profilePicture || undefined
                        }
                      />
                      <AvatarFallback>
                        <Avatar
                          name={`${reportDetail?.reporter?.name} ${reportDetail?.reporter?.id}`}
                          variant='beam'
                        />
                      </AvatarFallback>
                    </UIAvatar>
                    <span>{reportDetail?.reporter?.name}</span>
                  </div>
                </div>

                <Separator />

                {!reportDetail?.isAdmin && (
                  <>
                    <div className='flex justify-between items-center p-3 lg:p-4'>
                      <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                        <IconShield className='w-[1.5em]! h-[1.5em]!' />
                        <span className='font-poppins font-medium'>
                          VERIFIED BY
                        </span>
                      </div>

                      {reportDetail?.status === 'verified' ? (
                        <div className='flex items-center gap-2'>
                          <UIAvatar className='size-5'>
                            <AvatarImage
                              src={
                                reportDetail?.verifier?.profilePicture ||
                                undefined
                              }
                            />
                            <AvatarFallback>
                              <Avatar
                                name={`${reportDetail?.verifier?.name} ${reportDetail?.verifier?.id}`}
                                variant='beam'
                              />
                            </AvatarFallback>
                          </UIAvatar>
                          <span>{reportDetail?.verifier?.name}</span>
                        </div>
                      ) : (
                        <span className='font-poppins opacity-50 italic font-medium'>
                          PENDING
                        </span>
                      )}
                    </div>

                    <Separator />
                  </>
                )}

                <div className='flex justify-between items-start p-3 lg:p-4'>
                  <div className='flex items-center gap-1.5 lg:gap-2 opacity-50 shrink-0'>
                    <IconClock className='w-[1.5em]! h-[1.5em]!' />
                    <span className='font-poppins font-medium'>
                      DATE & TIME
                    </span>
                  </div>

                  <div className='flex flex-col items-end gap-0.5 text-xs lg:text-sm text-right'>
                    <span>{formattedDate}</span>
                    <span className='opacity-50'>{formattedTime}</span>
                  </div>
                </div>

                <Separator />

                <div className='flex justify-between items-center p-3 lg:p-4'>
                  <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                    <IconExclamationCircle className='w-[1.5em]! h-[1.5em]!' />
                    <span className='font-poppins font-medium'>
                      SEVERITY LEVEL
                    </span>
                  </div>

                  <div
                    className='flex items-center rounded-full px-3 py-1'
                    style={{
                      color: SEVERITY_COLOR_MAP[reportDetail?.severity],
                      backgroundColor: `${SEVERITY_COLOR_MAP[reportDetail?.severity]}25`,
                    }}
                  >
                    <span className='font-poppins text-xs font-medium'>
                      {reportDetail?.severity?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* image */}
              <div className='aspect-video w-full relative bg-muted shrink-0'>
                {reportDetail?.image ? (
                  <Image
                    src={reportDetail.image}
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

              {/* description */}
              {reportDetail?.description && (
                <div className='flex flex-col border rounded-lg text-xs lg:text-sm p-3 lg:p-4 gap-0.5'>
                  <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                    <IconInfoCircle className='w-[1.5em]! h-[1.5em]!' />
                    <span className='font-poppins font-medium'>
                      DESCRIPTION
                    </span>
                  </div>

                  <p>{reportDetail?.description}</p>
                </div>
              )}

              {/* credibility and confirm and deny */}
              {!reportDetail?.isAdmin && (
                <div className='flex flex-col border rounded-lg text-xs lg:text-sm'>
                  <div className='flex justify-between items-center p-3 lg:p-4'>
                    <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                      <IconShieldCheck className='w-[1.5em]! h-[1.5em]!' />
                      <span className='font-poppins font-medium'>
                        CREDIBILITY
                      </span>
                    </div>

                    <span className='font-poppins font-bold'>
                      {credibility}%
                    </span>
                  </div>

                  <VoteButtons reportId={reportId} />
                </div>
              )}

              <Button
                className='rounded-lg h-12'
                disabled={!destination || isLoadingRoute}
                onClick={() => destination && getDirections(destination)}
              >
                {isLoadingRoute ? (
                  <Spinner />
                ) : (
                  <IconSend className='w-[1.5em]! h-[1.5em]!' />
                )}
                <span className='font-poppins font-medium'>
                  {isLoadingRoute ? 'GETTING DIRECTIONS...' : 'GET DIRECTIONS'}
                </span>
              </Button>

              <Separator />

              <ReportPaginationOverlay />
            </div>

            <div className='flex gap-3 text-xs items-center px-2 lg:px-0'>
              <div className='h-px flex-1 bg-gray-200' />
              <span className='font-poppins font-bold opacity-50'>
                COMMUNITY UPDATES
              </span>
              <div className='h-px flex-1 bg-gray-200' />
            </div>

            {/* comments */}
            <div className='flex flex-col gap-3 p-3 lg:p-4'>
              <PostComposer reportId={reportId} />

              <CommentsList
                reportId={reportId}
                scrollContainerId='report-drawer-scroll'
              />
            </div>
          </div>
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
