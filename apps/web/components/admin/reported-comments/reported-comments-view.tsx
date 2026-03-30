'use client';

import SearchBar from '@/components/shared/search-bar';
import { DataTable } from '@/components/shared/data-table';
import PagePagination from '@/components/shared/page-pagination';
import { useSearchParams } from 'next/navigation';
import StatCardSkeleton from '@/components/shared/admin/skeleton/stat-card-skeleton';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PaginationSkeleton from '../pagination-skeleton';
import { ReportedCommentQueryInput } from '@repo/schemas';
import { columns } from './columns';
import { ReportedCommentsDataTableSkeleton } from './skeleton/reported-comments-data-table-skeleton';
import ReportedCommentsStatCards from './reported-comments-stat-cards';
import { useReportedComments } from '@/hooks/use-reported-comments';
import ReportedCommentsPageSkeleton from './skeleton/reported-comments-page-skeleton';

export default function ReportedCommentsView() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    'total' | 'pending' | 'resolved' | 'dismissed'
  >(
    (searchParams.get('status') as
      | 'total'
      | 'pending'
      | 'resolved'
      | 'dismissed') || 'total',
  );
  const [page, setPage] = useState(1);
  const [q, setQ] = useState(searchParams.get('q') || '');

  const params: ReportedCommentQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    status: status === 'total' ? undefined : status,
    q: q || undefined,
  };

  const { reports, meta, stats, isLoading, isValidating } =
    useReportedComments(params);

  const isFirstLoad = !reports;

  if (isLoading && isFirstLoad) return <ReportedCommentsPageSkeleton />;

  return (
    <div className='flex-1 flex flex-col bg-white p-8 rounded-2xl gap-8 min-h-0'>
      {/* Header */}
      <h1 className='font-poppins text-3xl font-bold'>Reported Comments</h1>

      <div className='flex justify-between gap-4'>
        <div className='flex-1'>
          <SearchBar
            placeholder='Search by name...'
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
          <div className='grid grid-cols-4 gap-8'>
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ReportedCommentsStatCards
            stats={stats}
            activeStatus={status}
            onStatusChange={(newStatus) => {
              setStatus(newStatus);
              setPage(1);
            }}
          />
        )}

        {isLoading && isValidating ? (
          <>
            <ReportedCommentsDataTableSkeleton />
          </>
        ) : (
          <>
            <DataTable columns={columns} data={reports ?? []} />
          </>
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
