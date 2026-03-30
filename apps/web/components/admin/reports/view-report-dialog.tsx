'use client';

import InteractiveMapReportedLocation from '@/components/shared/interactive-map-reported-location';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconMapPin } from '@tabler/icons-react';
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
import { verifyReport } from '@/lib/actions/report-actions';
import { useSWRConfig } from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export default function ViewReportDialog() {
  const { report, isOpen, closeDialog } = useReportDialog();
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useSWRConfig();

  const handleVerify = async () => {
    if (!report) return;
    setIsPending(true);
    try {
      await verifyReport(report.id);
      mutate(SWR_KEYS.reportMapPins);
      mutate(SWR_KEYS.reportDetail(report.id));
      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.reportsAdmin);
      closeDialog();
    } finally {
      setIsPending(false);
    }
  };

  const formattedTime = report ? format(report.reportedAt, 'hh:mm a') : '';
  const formattedDate = report
    ? format(report.reportedAt, 'MMMM dd, yyyy')
    : '';

  return (
    <Dialog open={isOpen('view')} onOpenChange={closeDialog}>
      <DialogContent className='flex flex-col min-w-[50vw] h-[80vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {report && (
          <>
            {/* ── Blue Header ── */}
            <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0 text-white'>
              {/* Text */}
              <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
                FLOOD REPORT
              </DialogTitle>
            </DialogHeader>

            {/* ── Content Area ── */}
            <div className='flex-1 min-h-0 overflow-y-auto'>
              <div className='flex flex-col p-6 gap-6'>
                <div className='flex flex-col gap-4'>
                  <div className='flex-1 flex gap-6'>
                    {/* Left Column: Map */}
                    <div className='flex-1 flex flex-col gap-4 h-fit'>
                      <div className='flex-1 flex aspect-square rounded-2xl overflow-hidden border h-fit'>
                        <InteractiveMapReportedLocation
                          latitude={report?.latitude}
                          longitude={report?.longitude}
                          range={report?.range}
                          severity={report?.severity}
                        />
                      </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className='flex-2 flex items-center'>
                      <div className='flex-1 flex flex-col gap-4 bg-accent border rounded-2xl p-4 h-fit'>
                        <span className='font-poppins font-semibold text-gray-600 text-base'>
                          REPORT DETAILS
                        </span>

                        <div className='flex flex-col gap-2'>
                          <span className='font-poppins font-medium text-gray-600 text-sm'>
                            REPORTER
                          </span>
                          {/* avatar and user information */}
                          <div className='flex items-center gap-3 w-auto'>
                            <UIAvatar className='size-8'>
                              <AvatarImage
                                src={report?.reporter?.profilePicture || ''}
                              />
                              <AvatarFallback>
                                <Avatar
                                  name={`${report?.reporter?.name} ${report?.reporter?.id || ''}`}
                                  variant='beam'
                                  className='size-8'
                                />
                              </AvatarFallback>
                            </UIAvatar>
                            <div className='flex flex-col'>
                              <span className='font-medium'>
                                {report?.reporter?.name}
                              </span>
                              <span className='text-sm text-gray-600'>
                                {report?.reporter?.email}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Separator className='my-2' />

                        <div className='grid grid-cols-3 gap-4'>
                          {/* severity */}
                          <div className='flex flex-col gap-2'>
                            <span className='font-poppins font-medium text-gray-600 text-sm'>
                              SEVERITY
                            </span>

                            {/* severity badge */}
                            <div
                              className='flex items-center rounded-full px-3 py-1 w-fit'
                              style={{
                                color:
                                  SEVERITY_COLOR_MAP[report?.severity || 'low'],
                                backgroundColor: `${SEVERITY_COLOR_MAP[report?.severity || 'low']}25`,
                              }}
                            >
                              <span className='text-xs font-bold'>
                                {report?.severity?.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* status */}
                          <div className='flex flex-col gap-2'>
                            <span className='font-poppins font-medium text-gray-600 text-sm'>
                              STATUS
                            </span>

                            {/* status badge */}
                            <div
                              className='flex items-center rounded-full px-3 py-1 w-fit'
                              style={{
                                color:
                                  REPORT_STATUS_COLOR_MAP[
                                    report?.status || 'unverified'
                                  ],
                                backgroundColor: `${REPORT_STATUS_COLOR_MAP[report?.status || 'unverified']}25`,
                              }}
                            >
                              <span className='text-xs font-bold capitalize'>
                                {report?.status?.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* reported at */}
                          <div className='flex flex-col gap-2'>
                            <span className='font-poppins font-medium text-gray-600 text-sm'>
                              REPORTED AT
                            </span>
                            <div className='flex flex-col'>
                              <span className='text-sm text-gray-600'>
                                {formattedDate}
                              </span>
                              <span className='text-xs text-gray-600'>
                                {formattedTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Map Pin (single, full-width) ── */}
                  <div className='flex items-center gap-2'>
                    <IconMapPin className='w-[1.5em]! h-[1.5em]! text-[#0066CC] mb-auto' />
                    <span className='text-sm text-gray-600'>
                      {report?.location}
                    </span>
                  </div>
                </div>

                {/* description */}
                <div className='flex flex-col gap-2'>
                  <span className='font-poppins text-base font-semibold text-gray-600'>
                    DESCRIPTION
                  </span>

                  <div className='flex flex-col gap-4 bg-accent border rounded-2xl p-4 h-fit'>
                    <p className='text-sm text-gray-600'>
                      {report?.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* image */}
                <div className='flex flex-col gap-2'>
                  <span className='font-poppins text-base font-semibold text-gray-600'>
                    IMAGE
                  </span>

                  <div className='relative h-full w-full aspect-video rounded-2xl overflow-hidden'>
                    {report?.image ? (
                      <Image
                        src={report.image}
                        alt='Affected location'
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <Image
                        src='/no-data-rafiki.svg'
                        alt='No image available'
                        fill
                        className='object-cover opacity-40'
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {report?.status !== 'verified' && (
              <DialogFooter className='flex justify-end bg-[#F9F9F9] rounded-t-2xl px-5 py-4 shrink-0'>
                <Button disabled={isPending} onClick={handleVerify}>
                  {isPending ? (
                    <>
                      Verifying... <Spinner />
                    </>
                  ) : (
                    'Verify Report'
                  )}
                </Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
