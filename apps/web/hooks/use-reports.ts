'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { getReports } from '@/lib/fetchers/get-reports';
import { ReportQueryInput } from '@repo/schemas';

export function useReports(params: ReportQueryInput) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [SWR_KEYS.reports, params],
    () => getReports(params),
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
