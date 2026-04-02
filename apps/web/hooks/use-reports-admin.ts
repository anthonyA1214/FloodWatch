'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { getReportsAdmin } from '@/lib/fetchers/get-reports-admin';
import { ReportQueryInput } from '@repo/schemas';

export function useReportsAdmin(params: ReportQueryInput) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [SWR_KEYS.reports, params],
    () => getReportsAdmin(params),
    { keepPreviousData: true },
  );

  return {
    reports: data?.data,
    meta: data?.meta,
    stats: data?.stats,
    isLoading,
    isValidating,
    isError: error,
    mutateReports: mutate,
  };
}
