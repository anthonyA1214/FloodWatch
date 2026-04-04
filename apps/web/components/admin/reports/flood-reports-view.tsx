'use client';

import ReportStatCards from '@/components/admin/reports/report-stat-cards';
import SearchBar from '@/components/shared/search-bar';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './columns';
import PagePagination from '@/components/shared/page-pagination';
import { useReports } from '@/hooks/use-reports';
import { useSearchParams } from 'next/navigation';
import StatCardSkeleton from '@/components/shared/admin/skeleton/stat-card-skeleton';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationSkeleton from '../pagination-skeleton';
import { FloodReportsDataTableSkeleton } from './skeleton/flood-reports-data-table-skeleton';
import { ReportQueryInput } from '@repo/schemas';
import FloodReportsPageSkeleton from './skeleton/flood-reports-page-skeleton';

export default function FloodReportsView() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'total' | 'verified' | 'unverified'>(
    (searchParams.get('status') as 'total' | 'verified' | 'unverified') ||
      'total',
  );
  const [page, setPage] = useState(1);
  const [q, setQ] = useState(searchParams.get('q') || '');

  const params: ReportQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    status: status === 'total' ? undefined : status,
    q: q || undefined,
  };

  const { reports, meta, stats, isLoading, isValidating } = useReports(params);

  const isFirstLoad = !reports;

  if (isLoading && isFirstLoad) return <FloodReportsPageSkeleton />;

  return (
    <div className='flex-1 flex flex-col bg-white px-8 pt-8 rounded-2xl gap-8 min-h-0 overflow-y-auto'>
      {/* Header */}
      <h1 className='font-poppins text-3xl font-bold'>FLOOD REPORTS</h1>

      <div className='flex justify-between gap-4'>
        <div className='flex-1'>
          <SearchBar
            placeholder='Search flood reports...'
            onSearch={(value) => {
              setQ(value);
              setPage(1);
            }}
            defaultValue={q}
          />
        </div>
      </div>

      <div className='flex-1 flex flex-col min-h-0 gap-4'>
        {isFirstLoad ? (
          <div className='grid grid-cols-3 gap-8'>
            {Array.from({ length: 3 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ReportStatCards
            totalCount={stats?.totalCount ?? 0}
            verifiedCount={stats?.verifiedCount ?? 0}
            unverifiedCount={stats?.unverifiedCount ?? 0}
            activeStatus={status}
            onStatusChange={(newStatus) => {
              setStatus(newStatus);
              setPage(1);
            }}
          />
        )}

        {isLoading && isValidating ? (
          <>
            <FloodReportsDataTableSkeleton />
          </>
        ) : (
          <>
            <DataTable columns={columns} data={reports ?? []} />
          </>
        )}

        <div className='flex items-center justify-between pb-8'>
          {isFirstLoad ? (
            <>
              <Skeleton className='h-4 w-40' />
              <PaginationSkeleton />
            </>
          ) : (
            <>
              <span className='text-sm text-gray-600'>
                Showing {reports?.length ?? 0} of {stats?.totalCount ?? 0}{' '}
                reports
              </span>

              <div>
                <PagePagination
                  currentPage={meta?.page ?? 1}
                  totalPages={meta?.totalPages ?? 1}
                  hasNextPage={meta?.hasNextPage ?? false}
                  hasPrevPage={meta?.hasPrevPage ?? false}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
