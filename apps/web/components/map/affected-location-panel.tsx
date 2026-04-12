import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  IconChevronLeft,
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
import { format, formatDistanceToNow } from 'date-fns';

import {
  REPORT_STATUS_COLOR_MAP,
  SEVERITY_COLOR_MAP,
} from '@/lib/utils/get-color-map';
import CommentComposer from '@/components/shared/comment-composer';
import { useReportDetail } from '@/hooks/use-report-detail';
import { Separator } from '../ui/separator';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { Button } from '../ui/button';
import { AffectedLocationPanelSkeleton } from './skeletons/affected-location-panel-skeleton';
import NoPhotoEmpty from '../shared/no-photo-empty';
import CommentsList from '../shared/comments-list';
import VoteButtons from './vote-buttons';
import ReportPaginationOverlay from './report-pagination-overlay';
import { useMyVote } from '@/hooks/use-my-vote';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { useReportMapPins } from '@/hooks/use-report-map-pins';
import { useDirections } from '@/hooks/use-directions';
import { useMapRouting } from '@/contexts/map-routing-context';
import { Spinner } from '../ui/spinner';

export default function AffectedLocationPanel({
  reportId,
}: {
  reportId: number;
}) {
  const { close } = useMapOverlay();
  const { isLoading: isMyVoteLoading } = useMyVote(reportId);
  const { reportDetail, isLoading } = useReportDetail(reportId);

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
    <div className='relative w-full h-full bg-white z-50 min-h-0 flex flex-col pointer-events-auto'>
      <button
        className='absolute bg-white top-1/2 translate-x-full right-0 h-16 -translate-y-1/2
        rounded-r-2xl ps-1 py-1 pr-1.5 text-xs z-30 shadow-[4px_0px_6px_-1px_rgba(0,0,0,0.1)]'
        onClick={() => close()}
      >
        <IconChevronLeft className='w-[1.5em]! h-[1.5em]!' />
      </button>

      {isLoading || isMyVoteLoading || !reportDetail ? (
        <AffectedLocationPanelSkeleton />
      ) : (
        <div
          ref={scrollRef}
          id='report-panel-scroll'
          className='flex-1 min-h-0 overflow-y-auto'
        >
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

          <div
            className='flex flex-col p-4 gap-4 border-l-4 shrink-0'
            style={{
              borderLeftColor: SEVERITY_COLOR_MAP[reportDetail?.severity],
            }}
          >
            {reportDetail?.isAdmin && (
              <div className='flex items-center gap-1.5 lg:gap-2 p-3 lg:p-4 bg-[#9B32E4]/10 text-[#9B32E4] rounded-lg text-base'>
                <IconShield className='w-[1.5em]! h-[1.5em]!' />
                <span className='font-poppins font-medium'>
                  OFFICIAL INFORMATION
                </span>
              </div>
            )}

            <h3 className='font-poppins text-base font-semibold'>
              {reportDetail?.location}
            </h3>

            <Separator />

            <div className='flex flex-row justify-between gap-4'>
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
                  <span className='font-poppins font-medium'>REPORTED BY</span>
                </div>

                <div className='flex items-center gap-2'>
                  <UIAvatar className='size-5'>
                    <AvatarImage
                      src={reportDetail?.reporter?.profilePicture || undefined}
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
                  <span className='font-poppins font-medium'>DATE & TIME</span>
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

            {/* description */}
            {reportDetail?.description && (
              <div className='flex flex-col border rounded-lg text-xs lg:text-sm p-3 lg:p-4 gap-0.5'>
                <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                  <IconInfoCircle className='w-[1.5em]! h-[1.5em]!' />
                  <span className='font-poppins font-medium'>DESCRIPTION</span>
                </div>

                <p>{reportDetail?.description}</p>
              </div>
            )}

            {/* credibility and confirm and deny */}
            {['unverified', 'verified'].includes(reportDetail?.status) && (
              <div className='flex flex-col border rounded-lg text-xs lg:text-sm'>
                <div className='flex justify-between items-center p-3 lg:p-4'>
                  <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                    <IconShieldCheck className='w-[1.5em]! h-[1.5em]!' />
                    <span className='font-poppins font-medium'>
                      {reportDetail?.status === 'verified'
                        ? 'IS THIS FLOOD STILL HAPPENING?'
                        : 'CREDIBILITY'}
                    </span>
                  </div>

                  <span
                    className='font-poppins font-medium'
                    style={{
                      color:
                        credibility >= 70
                          ? '#16a34a'
                          : credibility >= 40
                            ? '#d97706'
                            : '#dc2626',
                    }}
                  >
                    {credibility !== undefined ? `${credibility}%` : 'N/A'}
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

          <div className='flex gap-4 text-xs items-center px-2 lg:px-0'>
            <div className='h-px flex-1 bg-gray-200' />
            <span className='font-poppins font-bold opacity-50'>
              COMMUNITY UPDATES
            </span>
            <div className='h-px flex-1 bg-gray-200' />
          </div>

          {/* comments */}
          <div className='flex flex-col gap-4 p-3 lg:p-4'>
            <CommentComposer reportId={reportId} />

            <CommentsList
              reportId={reportId}
              scrollContainerId='report-panel-scroll'
            />
          </div>
        </div>
      )}
    </div>
  );
}
