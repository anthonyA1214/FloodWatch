'use client';

import SearchBar from '@/components/shared/search-bar';
import { DataTable } from '@/components/shared/data-table';
// import { columns } from './columns';
import PagePagination from '@/components/shared/page-pagination';
import { useReports } from '@/hooks/use-reports';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationSkeleton from '../pagination-skeleton';
// import { FloodReportsDataTableSkeleton } from './skeleton/flood-reports-data-table-skeleton';
import { ReportQueryInput } from '@repo/schemas';
// import FloodReportsPageSkeleton from './skeleton/flood-reports-page-skeleton';

export default function ArchiveAndRecordsView() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState(searchParams.get('q') || '');

  const params: ReportQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    q: q || undefined,
  };

  const { reports, meta, stats, isLoading, isValidating } = useReports(params);

  const isFirstLoad = !reports;

  // if (isLoading && isFirstLoad) return <FloodReportsPageSkeleton />;

  return (
    <div className='flex-1 flex flex-col bg-white p-8 rounded-2xl gap-8 min-h-0'>
      {/* Header */}
      <h1 className='font-poppins text-3xl font-bold'>Flood Reports</h1>

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
        {isLoading && isValidating ? (
          <>{/* <FloodReportsDataTableSkeleton /> */}</>
        ) : (
          <>{/* <DataTable columns={columns} data={reports ?? []} /> */}</>
        )}

        {isFirstLoad ? (
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-40' />
            <PaginationSkeleton />
          </div>
        ) : (
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-600'>
              Showing {reports?.length ?? 0} of {stats?.totalCount ?? 0} reports
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
          </div>
        )}
      </div>
    </div>
  );
}
