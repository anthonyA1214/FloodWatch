'use client';

import InteractiveMapLocation from '@/components/shared/interactive-map-location';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  IconCheck,
  IconMapPin,
  IconPointFilled,
  IconShield,
} from '@tabler/icons-react';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { Separator } from '@/components/ui/separator';
import {
  REPORT_STATUS_COLOR_MAP,
  SEVERITY_COLOR_MAP,
} from '@/lib/utils/get-color-map';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useReportDialog } from '@/contexts/report-dialog-context';
import { format } from 'date-fns';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { verifyReport, resolveReport } from '@/lib/actions/report-actions';
import { useSWRConfig } from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { Badge } from '@/components/ui/badge';
import { useReportDetail } from '@/hooks/use-report-detail';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import ViewReportDialogSkeleton from './skeleton/view-report-dialog-skeleton';
import { cn } from '@/lib/utils';

export default function ViewReportDialog() {
  const { reportId, isOpen, closeDialog } = useReportDialog();
  const { reportDetail, isLoading, mutateReportDetail } =
    useReportDetail(reportId);
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useSWRConfig();

  const handleSubmit = async () => {
    if (!reportDetail) return;
    setIsPending(true);
    try {
      await verifyReport(reportDetail.id);
      mutate(SWR_KEYS.reportMapPins);
      mutateReportDetail();
      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.reports);
      closeDialog();
    } finally {
      setIsPending(false);
    }
  };

  const handleResolve = async () => {
    if (!reportDetail) return;
    setIsPending(true);
    try {
      await resolveReport(reportDetail.id);
      mutate(SWR_KEYS.reportMapPins);
      mutateReportDetail();
      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.reports);
      closeDialog();
    } finally {
      setIsPending(false);
    }
  };

  const formattedTime = reportDetail
    ? format(reportDetail.reportedAt, 'hh:mm a')
    : '';
  const formattedDate = reportDetail
    ? format(reportDetail.reportedAt, 'MMMM dd, yyyy')
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
    <Dialog open={isOpen('view')} onOpenChange={closeDialog}>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-2xl max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {isLoading ? (
          <>
            <VisuallyHidden>
              <DialogTitle>Flood Report</DialogTitle>
            </VisuallyHidden>
            <ViewReportDialogSkeleton />
          </>
        ) : (
          reportDetail && (
            <>
              {/* ── Blue Header ── */}
              <div
                className={cn(reportDetail?.isAdmin ? 'bg-[#9B32E4]/10' : '')}
              >
                <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl p-4 shrink-0 text-white'>
                  {/* Text */}
                  <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
                    FLOOD REPORT
                  </DialogTitle>
                </DialogHeader>
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
                    className={cn(
                      reportDetail?.isAdmin ? 'bg-[#9B32E4]/30' : '',
                    )}
                  />
                </>
              )}

              {/* ── Content Area ── */}
              <div className='flex-1 min-h-0 overflow-y-auto'>
                <div className='flex flex-col p-4 gap-4'>
                  <div className='flex flex-col gap-4'>
                    <div className='flex-1 flex gap-4'>
                      {/* left column map */}
                      <div className='flex-1 flex flex-col gap-4 h-fit'>
                        <div className='flex-1 flex aspect-4/3 rounded-2xl overflow-hidden border h-fit'>
                          <InteractiveMapLocation
                            variant='report'
                            latitude={reportDetail?.latitude}
                            longitude={reportDetail?.longitude}
                            range={reportDetail?.range}
                            severity={reportDetail?.severity}
                          />
                        </div>
                      </div>

                      {/* right column details */}
                      <div className='flex-1 flex items-center'>
                        <div className='flex-1 flex flex-col gap-4 bg-accent border rounded-2xl py-4 h-fit'>
                          {/*reporter*/}
                          <div className='flex flex-col gap-2 px-4'>
                            <span className='font-poppins font-medium text-gray-600 text-sm'>
                              REPORTER
                            </span>
                            {/* avatar and user information */}
                            <div className='flex items-center gap-3 w-auto'>
                              <UIAvatar className='size-8'>
                                <AvatarImage
                                  src={
                                    reportDetail?.reporter?.profilePicture || ''
                                  }
                                />
                                <AvatarFallback>
                                  <Avatar
                                    name={`${reportDetail?.reporter?.name} ${reportDetail?.reporter?.id || ''}`}
                                    variant='beam'
                                    className='size-8'
                                  />
                                </AvatarFallback>
                              </UIAvatar>
                              <div className='flex flex-col'>
                                <span className='text-sm font-medium'>
                                  {reportDetail?.reporter?.name}
                                </span>
                                <span className='text-sm opacity-50'>
                                  {reportDetail?.reporter?.email}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/*severity and status*/}
                          <div className='grid grid-cols-2 gap-4 px-4'>
                            {/* severity */}
                            <div className='flex flex-col gap-2'>
                              <span className='font-poppins font-medium text-gray-600 text-sm'>
                                SEVERITY
                              </span>

                              {/* severity badge */}
                              <Badge
                                className='text-xs'
                                style={{
                                  color:
                                    SEVERITY_COLOR_MAP[
                                      reportDetail?.severity || 'low'
                                    ],
                                  backgroundColor: `${SEVERITY_COLOR_MAP[reportDetail?.severity || 'low']}25`,
                                }}
                              >
                                {reportDetail?.severity?.toUpperCase()}
                              </Badge>
                            </div>

                            {/* status */}
                            <div className='flex flex-col gap-2'>
                              <span className='font-poppins font-medium text-gray-600 text-sm'>
                                STATUS
                              </span>

                              {/* status badge */}
                              <Badge
                                className='text-xs'
                                style={{
                                  color:
                                    REPORT_STATUS_COLOR_MAP[
                                      reportDetail?.status || 'unverified'
                                    ],
                                  backgroundColor: `${REPORT_STATUS_COLOR_MAP[reportDetail?.status || 'unverified']}25`,
                                }}
                              >
                                {reportDetail?.status?.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <Separator />

                          {/*reported at*/}
                          <div className='flex flex-col gap-4 px-4'>
                            <div className='flex flex-col gap-2'>
                              <span className='font-poppins font-medium text-gray-600 text-sm'>
                                REPORTED AT
                              </span>
                              <div className='flex gap-2 items-center h-4'>
                                <span className='text-sm'>{formattedDate}</span>

                                <IconPointFilled className='size-[0.5em]! shrink-0' />

                                <span className='text-sm'>{formattedTime}</span>
                              </div>
                            </div>
                          </div>

                          {/*confirms, denies and credibility*/}
                          {reportDetail?.status !== 'resolved' && (
                            <>
                              <Separator />

                              <div className='flex flex-col gap-2 px-4'>
                                {reportDetail?.status === 'verified' && (
                                  <span className='font-poppins font-medium text-gray-600 text-sm'>
                                    IS THIS FLOOD STILL HAPPENING?
                                  </span>
                                )}

                                <div
                                  className={cn(
                                    'grid gap-4',
                                    reportDetail?.status === 'verified'
                                      ? 'grid-cols-2'
                                      : 'grid-cols-3',
                                  )}
                                >
                                  {/*confirms*/}
                                  <div className='flex flex-col gap-2 text-center'>
                                    <span className='font-poppins font-medium text-gray-600 text-sm'>
                                      CONFIRMS
                                    </span>
                                    <span className='font-poppins font-medium  text-[#16a34a]'>
                                      {confirms !== undefined
                                        ? confirms
                                        : 'N/A'}
                                    </span>
                                  </div>

                                  {/*denies*/}
                                  <div className='flex flex-col gap-2 text-center'>
                                    <span className='font-poppins font-medium text-gray-600 text-sm'>
                                      DENIES
                                    </span>
                                    <span className='font-poppins font-medium text-[#dc2626]'>
                                      {denies !== undefined ? denies : 'N/A'}
                                    </span>
                                  </div>

                                  {/*credibility*/}
                                  {reportDetail?.status === 'unverified' && (
                                    <div className='flex flex-col gap-2 text-center'>
                                      <span className='font-poppins font-medium text-gray-600 text-sm'>
                                        CREDIBILITY
                                      </span>
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
                                        {credibility !== undefined
                                          ? `${credibility}%`
                                          : 'N/A'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}

                          {/**/}
                        </div>
                      </div>
                    </div>

                    {/* ── Map Pin (single, full-width) ── */}
                    <div className='flex flex-col gap-4 bg-accent border rounded-2xl p-4 h-fit'>
                      <div className='flex items-center gap-2'>
                        <IconMapPin className='w-[1.5em]! h-[1.5em]! text-[#0066CC] mb-auto shrink-0' />
                        <span className='text-sm '>
                          {reportDetail?.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* description */}
                  <div className='flex flex-col gap-2'>
                    <span className='font-poppins text-base font-semibold text-gray-600'>
                      DESCRIPTION
                    </span>

                    <div className='flex flex-col gap-4 bg-accent border rounded-2xl p-4 h-fit'>
                      {reportDetail?.description ? (
                        <span className='text-sm'>
                          {reportDetail?.description}
                        </span>
                      ) : (
                        <span className='text-sm italic opacity-50'>
                          No description provided.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* image */}
                  {reportDetail?.image && (
                    <div className='flex flex-col gap-2'>
                      <span className='font-poppins text-base font-semibold text-gray-600'>
                        IMAGE
                      </span>

                      <div className='relative h-full w-full aspect-video rounded-2xl overflow-hidden border border-dashed'>
                        <Image
                          src={reportDetail.image}
                          alt='Affected location'
                          fill
                          className='object-cover'
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {reportDetail?.status === 'unverified' ? (
                <DialogFooter className='flex items-center bg-[#F9F9F9] rounded-t-2xl p-4 shrink-0'>
                  <div className='flex w-full items-center justify-between'>
                    <span className='text-start opacity-50 text-sm'>
                      Review the report before verifying.
                    </span>
                    <div className='flex gap-2'>
                      <Button
                        variant='ghost'
                        onClick={closeDialog}
                        className='font-poppins'
                      >
                        <span>CANCEL</span>
                      </Button>

                      <Button
                        variant='outline'
                        disabled={isPending}
                        onClick={handleSubmit}
                        className='font-poppins flex items-center gap-2 border-[#0066CC] bg-white text-[#0066CC] hover:bg-[#0066CC10] hover:text-[#0066CC]'
                      >
                        {isPending ? (
                          <Spinner />
                        ) : (
                          <IconCheck className='w-[1.5em]! h-[1.5em]!' />
                        )}
                        <span>
                          {isPending ? 'VERIFYING...' : 'VERIFY REPORT'}
                        </span>
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              ) : (
                reportDetail?.status === 'verified' && (
                  <DialogFooter className='flex bg-[#F9F9F9] rounded-t-2xl p-4 shrink-0'>
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex flex-col gap-2'>
                        <span className='font-poppins font-semibold text-gray-600 text-sm'>
                          VERIFIED BY
                        </span>
                        <div className='flex items-center gap-2 w-auto '>
                          <UIAvatar className='size-8'>
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
                                className='size-8'
                              />
                            </AvatarFallback>
                          </UIAvatar>
                          <div className='flex flex-col'>
                            <span className='text-sm font-medium'>
                              {reportDetail?.verifier?.name}
                            </span>
                            {reportDetail?.verifiedAt && (
                              <span className='text-xs text-gray-600'>
                                {format(reportDetail?.verifiedAt, 'PPP p')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-2 self-end'>
                        <Button
                          variant='ghost'
                          onClick={closeDialog}
                          className='font-poppins'
                        >
                          <span>CANCEL</span>
                        </Button>

                        <Button
                          variant='outline'
                          disabled={isPending}
                          onClick={handleResolve}
                          className='font-poppins flex items-center gap-2 border-[#0066CC] bg-white text-[#0066CC] hover:bg-[#0066CC10] hover:text-[#0066CC]'
                        >
                          {isPending ? (
                            <Spinner />
                          ) : (
                            <IconCheck className='w-[1.5em]! h-[1.5em]!' />
                          )}
                          <span>
                            {isPending ? 'MARKING...' : 'MARK AS RESOLVED'}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </DialogFooter>
                )
              )}
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
