'use client';

import SearchBar from '@/components/shared/search-bar';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './columns';
import AddNewAdminDialog from '@/components/admin/users/add-new-admin-dialog';
import UserStatCards from '@/components/admin/users/user-stat-cards';
import PagePagination from '@/components/shared/page-pagination';
import { useUsers } from '@/hooks/use-users';
import { useSearchParams } from 'next/navigation';
import { UserDataTableSkeleton } from '@/components/admin/users/skeleton/user-data-table-skeleton';
import PaginationSkeleton from '@/components/admin/pagination-skeleton';
import StatCardSkeleton from '@/components/shared/admin/skeleton/stat-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { UserQueryInput } from '@repo/schemas';
import UserManagementPageSkeleton from './skeleton/user-management-page-skeleton';

export default function UserManagementView() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'total' | 'active' | 'blocked'>(
    (searchParams.get('status') as 'total' | 'active' | 'blocked') || 'total',
  );
  const [page, setPage] = useState(1);
  const [q, setQ] = useState(searchParams.get('q') || '');

  const params: UserQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    status: status === 'total' ? undefined : status,
    q: q || undefined,
  };

  const { users, meta, stats, isLoading, isValidating } = useUsers(params);

  const isFirstLoad = !users;

  if (isLoading && isFirstLoad) return <UserManagementPageSkeleton />;

  return (
    <div className='flex-1 flex flex-col bg-white px-8 pt-8 rounded-2xl gap-8 min-h-0 overflow-y-auto'>
      {/* Header */}
      <h1 className='font-poppins text-3xl font-bold'>USER MANAGEMENT</h1>

      {/* Search + Add Admin - always visible */}
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
        <div className='flex w-fit'>
          <AddNewAdminDialog />
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
          <UserStatCards
            totalCount={stats?.totalCount ?? 0}
            activeCount={stats?.activeCount ?? 0}
            blockedCount={stats?.blockedCount ?? 0}
            activeStatus={status}
            onStatusChange={(newStatus) => {
              setStatus(newStatus);
              setPage(1);
            }}
          />
        )}

        {isLoading && isValidating ? (
          <>
            <UserDataTableSkeleton />
          </>
        ) : (
          <>
            <DataTable columns={columns} data={users ?? []} />
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
                Showing {users?.length ?? 0} of {stats?.totalCount ?? 0} users
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
