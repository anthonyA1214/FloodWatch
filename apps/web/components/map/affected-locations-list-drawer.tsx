'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { Drawer } from 'vaul';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { IconAlertTriangle } from '@tabler/icons-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { useReportList } from '@/hooks/use-report-list';
import { useMapPopup } from '@/contexts/map-popup-context';
import { useReportMapPins } from '@/hooks/use-report-map-pins';
import { useMapFilter } from '@/contexts/map-filter-context';
import AffectedLocationsCardSkeleton from './skeletons/affected-locations-card-skeleton';
import LocationsListEmpty from './empty/locations-list-empty';
import { useSearchParams } from 'next/navigation';
import { ReportListItemInput, ReportListQueryInput } from '@repo/schemas';
import PagePagination from '../shared/page-pagination';
import AffectedLocationsCard from '../shared/affected-locations-card';

const snapPoints = ['0px', '355px', 1];

export default function AffectedLocationsListDrawer() {
  const searchParams = useSearchParams();
  const [severity, setSeverity] = useState<
    'all-levels' | 'critical' | 'high' | 'moderate' | 'low'
  >('all-levels');
  const [page, setPage] = useState(1);
  const { q, filters } = useMapFilter();

  const activeSeverities =
    severity !== 'all-levels'
      ? filters.severities.has(severity)
        ? [severity]
        : [] // dropdown pick is unchecked in popover = empty
      : [...filters.severities];

  const params: ReportListQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    severities: activeSeverities,
    q: q || undefined,
  };

  const { reportList, meta, isLoading } = useReportList(params);
  const { close } = useMapOverlay();
  const { activePopup, openReportPopup } = useMapPopup();
  const { reportMapPins } = useReportMapPins();

  const handleCardClick = (reportId: number) => {
    const pin = reportMapPins?.find((p) => p.id === reportId);
    if (pin) {
      openReportPopup(pin);
    }
  };

  const [snap, setSnap] = useState<number | string | null>(snapPoints[1]);
  const [open, setOpen] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) close?.();
  };

  return (
    <Drawer.Root
      modal={false}
      dismissible={true}
      handleOnly={true}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
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

      <Drawer.Content
        data-testid='content'
        className='z-1 absolute flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-full -mx-px'
      >
        <Drawer.Handle className='w-16! my-3! rounded-full! shrink-0!' />

        <VisuallyHidden>
          <Drawer.Title>Affected Locations</Drawer.Title>
        </VisuallyHidden>

        <div
          className={clsx('flex flex-col max-w-lg mx-auto w-full pt-5 gap-2', {
            'overflow-y-auto': snap === 1,
            'overflow-hidden': snap !== 1,
          })}
        >
          <div className='flex flex-col gap-4 flex-1 min-h-0'>
            {/* Header */}

            <div className='flex items-center gap-2 font-semibold text-lg px-3'>
              <IconAlertTriangle className='w-[1.5em]! h-[1.5em]! text-[#FB2C36]' />
              <span>Affected Locations</span>
            </div>

            <Separator />

            {/* Filter using Select */}
            <div className='px-3'>
              <Select
                defaultValue={severity}
                onValueChange={(value) =>
                  setSeverity(
                    value as
                      | 'all-levels'
                      | 'critical'
                      | 'high'
                      | 'moderate'
                      | 'low',
                  )
                }
              >
                <SelectTrigger className='w-full text-sm text-gray-600 py-3 justify-between'>
                  <SelectValue placeholder='All Levels' />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='all-levels'>All Levels</SelectItem>
                  {(['critical', 'high', 'moderate', 'low'] as const).map(
                    (s) =>
                      filters.severities.has(s) ? (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ) : null,
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 px-3 pb-3'>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <AffectedLocationsCardSkeleton key={i} />
                ))
              ) : !reportList || reportList.length === 0 ? (
                <LocationsListEmpty />
              ) : (
                reportList?.map((report: ReportListItemInput) => (
                  <AffectedLocationsCard
                    key={report.id}
                    isActive={
                      activePopup?.type === 'report' &&
                      activePopup?.report?.id === report.id
                    }
                    severity={report.severity}
                    location={report?.location}
                    description={report?.description}
                    reportedAt={report?.reportedAt}
                    onClick={() => handleCardClick(report.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className='mt-auto flex justify-center py-2 border-t border-gray-200'>
            <PagePagination
              currentPage={meta?.page ?? 1}
              totalPages={meta?.totalPages ?? 1}
              hasNextPage={meta?.hasNextPage ?? false}
              hasPrevPage={meta?.hasPrevPage ?? false}
              onPageChange={setPage}
            />
          </div>
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
