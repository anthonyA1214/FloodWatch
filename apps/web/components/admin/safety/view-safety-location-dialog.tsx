'use client';

import InteractiveMapLocation from '@/components/shared/interactive-map-location';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconMapPin, IconPhone, IconPointFilled } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { SAFETY_TYPE_COLOR_MAP } from '@/lib/utils/get-color-map';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSafetyLocationDialog } from '@/contexts/safety-location-dialog-context';
import { useSafetyLocationDetail } from '@/hooks/use-safety-location-detail';
import ViewSafetyLocationDialogSkeleton from './skeleton/view-safety-location-dialog-skeleton';

export default function ViewSafetyLocationDialog() {
  const { safetyLocationId, isOpen, closeDialog } = useSafetyLocationDialog();
  const { safetyDetail, isLoading } = useSafetyLocationDetail(safetyLocationId);

  const formattedTime = safetyDetail
    ? format(safetyDetail.createdAt, 'hh:mm a')
    : '';
  const formattedDate = safetyDetail
    ? format(safetyDetail.createdAt, 'MMMM dd, yyyy')
    : '';

  return (
    <Dialog open={isOpen('view')} onOpenChange={closeDialog}>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-2xl max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {isLoading ? (
          <>
            <VisuallyHidden>
              <DialogTitle>Safety Location</DialogTitle>
            </VisuallyHidden>
            <ViewSafetyLocationDialogSkeleton />
          </>
        ) : (
          safetyDetail && (
            <>
              {/* ── Blue Header ── */}
              <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl p-4 shrink-0 text-white'>
                {/* Text */}
                <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
                  SAFETY LOCATION
                </DialogTitle>
              </DialogHeader>

              {/* ── Content Area ── */}
              <div className='flex-1 min-h-0 overflow-y-auto'>
                <div className='flex flex-col p-4 gap-4'>
                  <div className='flex flex-col gap-4'>
                    <div className='flex-1 flex gap-4'>
                      {/* left column map */}
                      <div className='flex-1 flex flex-col gap-4 h-fit'>
                        <div className='flex-1 flex aspect-4/3 rounded-2xl overflow-hidden border h-fit'>
                          <InteractiveMapLocation
                            variant='safety'
                            latitude={safetyDetail?.latitude}
                            longitude={safetyDetail?.longitude}
                            type={safetyDetail?.type}
                          />
                        </div>
                      </div>

                      {/* right column details */}
                      <div className='flex-1 flex items-center'>
                        <div className='flex-1 flex flex-col gap-4 bg-accent border rounded-2xl py-4 h-fit'>
                          {/*location name*/}
                          <div className='flex flex-col gap-2 px-4'>
                            <span className='font-poppins font-medium text-gray-600 text-sm'>
                              LOCATION NAME
                            </span>

                            <span className='text-sm'>
                              {safetyDetail?.location}
                            </span>
                          </div>

                          <Separator />

                          {/*type and availability*/}
                          <div className='grid grid-cols-2 gap-4 px-4'>
                            {/* type */}
                            <div className='flex flex-col gap-2'>
                              <span className='font-poppins font-medium text-gray-600 text-sm'>
                                TYPE
                              </span>

                              {/* type badge */}
                              <Badge
                                className='text-xs'
                                style={{
                                  color:
                                    SAFETY_TYPE_COLOR_MAP[
                                      safetyDetail?.type || 'shelter'
                                    ],
                                  backgroundColor: `${SAFETY_TYPE_COLOR_MAP[safetyDetail?.type || 'shelter']}25`,
                                }}
                              >
                                {safetyDetail?.type?.toUpperCase()}
                              </Badge>
                            </div>

                            {/* status */}
                            <div className='flex flex-col gap-2'>
                              <span className='font-poppins font-medium text-gray-600 text-sm'>
                                AVAILABILITY
                              </span>

                              {safetyDetail?.availability ? (
                                <span className='text-sm'>
                                  {safetyDetail?.availability}
                                </span>
                              ) : (
                                <span className='text-sm italic opacity-50'>
                                  Not provided.
                                </span>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/*contact number*/}
                          <div className='flex flex-col gap-2 px-4'>
                            <span className='font-poppins font-medium text-gray-600 text-sm'>
                              CONTACT NUMBER
                            </span>

                            {safetyDetail?.contactNumber ? (
                              <div className='flex items-center gap-2 text-sm'>
                                <IconPhone className='size-[1.5em]! shrink-0 text-[#0066CC]' />

                                <span>{safetyDetail?.contactNumber}</span>
                              </div>
                            ) : (
                              <span className='text-sm italic opacity-50'>
                                Not provided.
                              </span>
                            )}
                          </div>

                          <Separator />

                          {/*added on*/}
                          <div className='flex flex-col gap-4 px-4'>
                            <div className='flex flex-col gap-2'>
                              <span className='font-poppins font-medium text-gray-600 text-sm'>
                                ADDED ON
                              </span>
                              <div className='flex gap-2 items-center h-4'>
                                <span className='text-sm'>{formattedDate}</span>

                                <IconPointFilled className='size-[0.5em]! shrink-0' />

                                <span className='text-sm'>{formattedTime}</span>
                              </div>
                            </div>
                          </div>

                          {/**/}
                        </div>
                      </div>
                    </div>

                    {/* ── Map Pin (single, full-width) ── */}
                    <div className='flex flex-col gap-4 bg-accent border rounded-2xl p-4 h-fit'>
                      <div className='flex items-center gap-2'>
                        <IconMapPin className='w-[1.5em]! h-[1.5em]! text-[#0066CC] mb-auto shrink-0' />
                        <span className='text-sm'>{safetyDetail?.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* description */}
                  <div className='flex flex-col gap-2'>
                    <span className='font-poppins text-base font-semibold text-gray-600'>
                      DESCRIPTION
                    </span>

                    <div className='flex flex-col gap-4 bg-accent border rounded-2xl p-4 h-fit'>
                      {safetyDetail?.description ? (
                        <span className='text-sm'>
                          {safetyDetail?.description}
                        </span>
                      ) : (
                        <span className='text-sm italic opacity-50'>
                          No description provided.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* image */}
                  {safetyDetail?.image && (
                    <div className='flex flex-col gap-2'>
                      <span className='font-poppins text-base font-semibold text-gray-600'>
                        IMAGE
                      </span>

                      <div className='relative h-full w-full aspect-video rounded-2xl overflow-hidden border border-dashed'>
                        <Image
                          src={safetyDetail.image}
                          alt='Affected location'
                          fill
                          className='object-cover'
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
