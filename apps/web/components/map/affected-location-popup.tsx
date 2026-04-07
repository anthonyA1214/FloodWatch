import { useReportDetail } from '@/hooks/use-report-detail';
import {
  IconCircleCheck,
  IconClock,
  IconExclamationCircle,
  IconHelpCircle,
  IconMapPin,
  IconSend,
  IconShield,
  IconShieldCheck,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import { Separator } from '../ui/separator';
import {
  REPORT_STATUS_COLOR_MAP,
  SEVERITY_COLOR_MAP,
} from '@/lib/utils/get-color-map';
import { format, formatDistanceToNow } from 'date-fns';
import AffectedLocationPopupSkeleton from './skeletons/affected-location-popup-skeleton';
import VoteButtons from './vote-buttons';
import ReportPaginationPopup from './report-pagination-popup';
import { useMyVote } from '@/hooks/use-my-vote';
import { cn } from '@/lib/utils';
import { useDirections } from '@/hooks/use-directions';
import { useMapRouting } from '@/contexts/map-routing-context';
import { Spinner } from '../ui/spinner';

export default function AffectedLocationPopup({
  onClose,
  reportId,
  latitude,
  longitude,
  onSelectReport,
  nextReport,
  prevReport,
  hasNext,
  hasPrev,
  currentReportIndex,
  total,
}: {
  onClose: () => void;
  reportId: number;
  latitude: number;
  longitude: number;
  onSelectReport?: () => void;
  nextReport: () => void;
  prevReport: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  currentReportIndex: number;
  total: number;
}) {
  const { reportDetail, isLoading } = useReportDetail(reportId);
  const { isLoading: isMyVoteLoading } = useMyVote(reportId);
  const { getDirections } = useDirections();
  const { isLoadingRoute } = useMapRouting();

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

  if (isLoading || isMyVoteLoading || !reportDetail)
    return <AffectedLocationPopupSkeleton />;

  return (
    <div
      className='flex flex-col justify-center rounded-lg overflow-hidden w-[300px] max-h-[70vh] overflow-y-auto bg-white'
      onClick={(e) => e.stopPropagation()}
    >
      {/* header */}
      <div className={cn(reportDetail?.isAdmin ? 'bg-[#9B32E4]/10' : '')}>
        <div className='flex items-center justify-between bg-[#0066CC] p-3 text-white rounded-b-2xl'>
          <span className='font-poppins font-medium text-sm'>FLOOD REPORT</span>
          <button onClick={onClose} className='text-[10px]'>
            <IconX className='opacity-70 hover:opacity-100 w-[1.5em]! h-[1.5em]! duration-200' />
          </button>
        </div>
      </div>

      {reportDetail?.isAdmin && (
        <>
          <div className='flex w-full gap-1.5 p-3 bg-[#9B32E4]/10 text-[#9B32E4] text-xs items-center'>
            <IconShield className='w-[1.5em]! h-[1.5em]!' />
            <span className='font-poppins font-medium'>
              OFFICIAL INFORMATION
            </span>
          </div>

          <Separator
            className={cn(reportDetail?.isAdmin ? 'bg-[#9B32E4]/30' : '')}
          />
        </>
      )}

      <div className='flex flex-col'>
        {/* badge and distance to now */}
        <div className='flex flex-row justify-between gap-4 p-3'>
          <div className='flex items-center text-xs gap-1.5 tabular-nums opacity-50'>
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
            <div className='flex items-center gap-1.5 text-xs'>
              {reportDetail?.status === 'verified' ? (
                <IconCircleCheck className='w-[1.5em]! h-[1.5em]!' />
              ) : (
                <IconHelpCircle className='w-[1.5em]! h-[1.5em]!' />
              )}
              <span className='font-poppins font-medium'>
                {reportDetail?.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* report details */}
        <div className='flex flex-col gap-2 p-3'>
          <div className='flex justify-between gap-2'>
            <div className='flex items-center gap-1.5 opacity-50'>
              <IconExclamationCircle className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins font-medium'>SEVERITY LEVEL</span>
            </div>

            <div
              className='flex items-center rounded-full px-3 py-1 w-fit'
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

          <Separator />

          <div className='flex justify-between items-start gap-2'>
            <div className='flex items-center gap-1.5 lg:gap-2 opacity-50 shrink-0'>
              <IconClock className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins font-medium'>DATE & TIME</span>
            </div>

            <div className='flex flex-col items-end gap-0.5 text-xs text-right'>
              <span>{formattedDate}</span>
              <span className='opacity-50'>{formattedTime}</span>
            </div>
          </div>

          <Separator />

          <div className='flex justify-between gap-2'>
            <div className='flex items-center gap-1.5 opacity-50 h-fit shrink-0'>
              <IconMapPin className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins font-medium'>LOCATION</span>
            </div>

            <span className='text-right line-clamp-2'>
              {reportDetail?.location}
            </span>
          </div>
        </div>

        <Separator />

        {/* credibility and confirm and deny */}
        {!reportDetail?.isAdmin && (
          <div className='flex flex-col text-xs'>
            <div className='flex justify-between items-center p-3'>
              <div className='flex items-center gap-1.5 lg:gap-2 opacity-50'>
                <IconShieldCheck className='w-[1.5em]! h-[1.5em]!' />
                <span className='font-poppins font-medium'>CREDIBILITY</span>
              </div>

              <div className='flex items-center gap-2'>
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
            </div>

            <VoteButtons reportId={reportId} />
          </div>
        )}

        <div className='flex justify-between items-center p-3 gap-2'>
          <button
            className='flex items-center gap-1.5 w-full bg-primary text-primary-foreground hover:bg-primary/90 duration-200 px-4 py-2.5 rounded-lg justify-center'
            onClick={onSelectReport}
          >
            <IconUsers className='w-[1.5em]! h-[1.5em]!' />
            <span className='font-poppins font-medium'>COMMUNITY</span>
          </button>

          <button
            className='flex items-center gap-1.5 w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 duration-200 px-4 py-2.5 rounded-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={isLoadingRoute}
            onClick={() => getDirections({ latitude, longitude })}
          >
            {isLoadingRoute ? (
              <Spinner />
            ) : (
              <IconSend className='w-[1.5em]! h-[1.5em]!' />
            )}
            <span className='font-poppins font-medium'>
              {isLoadingRoute ? 'LOADING...' : 'DIRECTIONS'}
            </span>
          </button>
        </div>

        <Separator />

        <div className='p-3'>
          <ReportPaginationPopup
            nextReport={nextReport}
            prevReport={prevReport}
            hasNext={hasNext}
            hasPrev={hasPrev}
            currentReportIndex={currentReportIndex}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
