'use client';

import { IconAlertTriangle, IconChevronLeft } from '@tabler/icons-react';
import AffectedLocationsCard from '../shared/affected-locations-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { useReportList } from '@/hooks/use-report-list';
import AffectedLocationsCardSkeleton from './skeletons/affected-locations-card-skeleton';
import { useMapPopup } from '@/contexts/map-popup-context';
import { useReportMapPins } from '@/hooks/use-report-map-pins';
import { startTransition, useEffect, useState } from 'react';
import { useMapFilter } from '@/contexts/map-filter-context';
import LocationsListEmpty from './empty/locations-list-empty';
import { ReportListItemInput, ReportListQueryInput } from '@repo/schemas';
import { useSearchParams } from 'next/navigation';
import PagePagination from '../shared/page-pagination';

export default function AffectedLocationsListPanel() {
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

  // reset severity dropdown if its selection gets unchecked in popover
  useEffect(() => {
    if (severity !== 'all-levels' && !filters.severities.has(severity)) {
      startTransition(() => {
        setSeverity('all-levels');
        setPage(1);
      });
    }
  }, [filters.severities, severity]);

  // reset page when popover filter changes
  useEffect(() => {
    startTransition(() => {
      setPage(1);
    });
  }, [filters.severities, q]);

  return (
    <div className='relative w-full h-full bg-white z-50 min-h-0 flex flex-col pointer-events-auto pt-16'>
      <button
        className='absolute bg-white top-1/2 translate-x-full right-0 h-16 -translate-y-1/2
        rounded-r-2xl ps-1 py-1 pr-1.5 text-xs z-30 shadow-[4px_0px_6px_-1px_rgba(0,0,0,0.1)]'
        onClick={close}
      >
        <IconChevronLeft className='w-[1.5em]! h-[1.5em]!' />
      </button>

      <div className='flex flex-col flex-1 min-h-0'>
        <div className='flex flex-col flex-1 min-h-0 gap-4 pt-4'>
          {/* Header */}
          <div className='flex items-center gap-2 font-semibold text-lg px-4'>
            <IconAlertTriangle className='w-[1.5em]! h-[1.5em]! text-[#FB2C36]' />
            <span>Affected Locations</span>
          </div>

          <Separator />

          {/* Filter using Select */}
          <div className='px-4'>
            <Select
              value={severity}
              onValueChange={(value) => {
                setSeverity(
                  value as
                    | 'all-levels'
                    | 'critical'
                    | 'high'
                    | 'moderate'
                    | 'low',
                );
                setPage(1);
              }}
            >
              <SelectTrigger className='w-full text-sm text-gray-600 py-3 justify-between'>
                <SelectValue placeholder='All Levels' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value='all-levels'>All Levels</SelectItem>
                {(['critical', 'high', 'moderate', 'low'] as const).map((s) =>
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
          <div className='flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 px-4 pb-4'>
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
      </div>
    </div>
  );
}
