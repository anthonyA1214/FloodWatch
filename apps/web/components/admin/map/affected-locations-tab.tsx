'use client';

import CreateFloodAlertDialog from './create-flood-alert-dialog';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ReportListItemInput, ReportListQueryInput } from '@repo/schemas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMapFilterAdmin } from '@/contexts/map-filter-admin-context';
import { useReportList } from '@/hooks/use-report-list';
import AffectedLocationsCardSkeleton from '@/components/map/skeletons/affected-locations-card-skeleton';
import LocationsListEmpty from '@/components/map/empty/locations-list-empty';
import AffectedLocationsCard from '@/components/shared/affected-locations-card';
import PagePagination from '@/components/shared/page-pagination';
import { useMapHighlight } from '@/contexts/map-highlight-context';
import { useReportMapPins } from '@/hooks/use-report-map-pins';

export default function AffectedLocationsTab() {
  const searchParams = useSearchParams();
  const [severity, setSeverity] = useState<
    'all-levels' | 'critical' | 'high' | 'moderate' | 'low'
  >('all-levels');
  const [page, setPage] = useState(1);
  const { q } = useMapFilterAdmin();
  const { reportMapPins } = useReportMapPins();

  const params: ReportListQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    severities: severity !== 'all-levels' ? [severity] : undefined,
    q: q || undefined,
  };

  const { reportList, meta, isLoading } = useReportList(params);
  const { activePin, setActivePin } = useMapHighlight();

  const handleCardClick = (reportId: number) => {
    const pin = reportMapPins?.find((p) => p.id === reportId);
    if (pin) {
      setActivePin({ type: 'report', report: pin });
    }
  };

  return (
    <>
      <CreateFloodAlertDialog />

      <div className='flex-1 flex flex-col rounded-2xl border min-h-0 overflow-hidden'>
        <Select
          value={severity}
          onValueChange={(value) => {
            setSeverity(
              value as 'all-levels' | 'critical' | 'high' | 'moderate' | 'low',
            );
            setPage(1);
          }}
        >
          <SelectTrigger className='w-full text-sm text-gray-600 py-3 justify-between'>
            <SelectValue placeholder='All Levels' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='all-levels'>All Levels</SelectItem>
            <SelectItem value='critical'>Critical</SelectItem>
            <SelectItem value='high'>High</SelectItem>
            <SelectItem value='moderate'>Moderate</SelectItem>
            <SelectItem value='low'>Low</SelectItem>
          </SelectContent>
        </Select>

        <div className='flex-1 overflow-hidden min-h-0'>
          <div className='space-y-4 p-4 overflow-y-auto h-full'>
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
                    activePin?.type === 'report' &&
                    activePin?.report?.id === report.id
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
          <div className='mt-auto border-t p-2 rounded-b-2xl'>
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
    </>
  );
}
