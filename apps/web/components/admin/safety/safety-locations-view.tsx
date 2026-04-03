'use client';

import SearchBar from '@/components/shared/search-bar';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './columns';
import PagePagination from '@/components/shared/page-pagination';
import { useSearchParams } from 'next/navigation';
import PaginationSkeleton from '@/components/admin/pagination-skeleton';
import StatCardSkeleton from '@/components/shared/admin/skeleton/stat-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import SafetyStatCards from './safety-stat-cards';
import { useSafetyLocationsAdmin } from '@/hooks/use-safety-admin';
import { SafetyLocationQueryInput } from '@repo/schemas';
import { SafetyLocationsDataTableSkeleton } from './skeleton/safety-locations-data-table-skeleton';
import SafetyLocationsPageSkeleton from './skeleton/safety-locations-page-skeleton';

export default function SafetyLocationsView() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<'total' | 'shelter' | 'hospital'>(
    (searchParams.get('status') as 'total' | 'shelter' | 'hospital') || 'total',
  );
  const [page, setPage] = useState(1);
  const [q, setQ] = useState(searchParams.get('q') || '');

  const params: SafetyLocationQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    type: type === 'total' ? undefined : type,
    q: q || undefined,
  };

  const { safetyLocations, meta, stats, isLoading, isValidating } =
    useSafetyLocationsAdmin(params);

  const isFirstLoad = !safetyLocations;

  if (isLoading && isFirstLoad) return <SafetyLocationsPageSkeleton />;

  return (
    <div className='flex-1 flex flex-col bg-white p-8 rounded-2xl gap-8 min-h-0'>
      {/* Header */}
      <h1 className='font-poppins text-3xl font-bold'>Safety Locations</h1>

      <div className='flex justify-between gap-4'>
        <div className='flex-1'>
          <SearchBar
            placeholder='Search safety locations...'
            defaultValue={q}
            onSearch={(value) => {
              setQ(value);
              setPage(1);
            }}
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
          <SafetyStatCards
            totalCount={stats?.totalCount ?? 0}
            shelterCount={stats?.shelterCount ?? 0}
            hospitalCount={stats?.hospitalCount ?? 0}
            activeStatus={type}
            onStatusChange={(newType) => {
              setType(newType);
              setPage(1);
            }}
          />
        )}

        {isLoading && isValidating ? (
          <SafetyLocationsDataTableSkeleton />
        ) : (
          <DataTable columns={columns} data={safetyLocations || []} />
        )}

        {isFirstLoad ? (
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-40' />
            <PaginationSkeleton />
          </div>
        ) : (
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-600'>
              Showing {safetyLocations?.length ?? 0} of {stats?.totalCount ?? 0}{' '}
              safety locations
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
