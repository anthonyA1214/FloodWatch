'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ReportListItemInput, ReportListQueryInput } from '@repo/schemas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReportList } from '@/hooks/use-report-list';
import AffectedLocationsCardSkeleton from '@/components/map/skeletons/affected-locations-card-skeleton';
import LocationsListEmpty from '@/components/map/empty/locations-list-empty';
import AffectedLocationsCard from '@/components/shared/affected-locations-card';
import PagePagination from '@/components/shared/page-pagination';
import { useReportMapPins } from '@/hooks/use-report-map-pins';
import { useCommunityFeed } from '@/contexts/community-feed-context';

export default function AffectedLocationsList() {
  const searchParams = useSearchParams();
  const [severity, setSeverity] = useState<
    'all-levels' | 'critical' | 'high' | 'moderate' | 'low'
  >('all-levels');
  const [page, setPage] = useState(1);
  const { q, openReport, reportId } = useCommunityFeed();
  const { reportMapPins } = useReportMapPins();

  const params: ReportListQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    severities: severity !== 'all-levels' ? [severity] : undefined,
    q: q || undefined,
  };

  const { reportList, meta, isLoading } = useReportList(params);

  const handleCardClick = (reportId: number) => {
    const pin = reportMapPins?.find((p) => p.id === reportId);
    if (pin) {
      openReport(reportId);
    }
  };

  useEffect(() => {
    document
      .getElementById('community-feed-scroll')
      ?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
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

      <div className='flex-1 overflow-hidden min-h-0 h-full'>
        <div className='flex flex-col p-4 h-full'>
          {isLoading ? (
            <div className='space-y-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <AffectedLocationsCardSkeleton key={i} />
              ))}
            </div>
          ) : reportList && reportList.length > 0 ? (
            <div className='space-y-4'>
              {reportList?.map((report: ReportListItemInput) => (
                <AffectedLocationsCard
                  key={report.id}
                  isActive={report.id === reportId}
                  severity={report.severity}
                  location={report?.location}
                  description={report?.description}
                  reportedAt={report?.reportedAt}
                  onClick={() => handleCardClick(report.id)}
                />
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <LocationsListEmpty
                title='No affected locations found'
                description='Try adjusting your filters or check back later for new reports.'
              />
            </div>
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
  );
}
