'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { getReportList } from '@/lib/fetchers/get-report-list';
import { ReportListQueryInput } from '@repo/schemas';

export function useReportList(params: ReportListQueryInput) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [SWR_KEYS.reportList, params],
    () => getReportList(params),
    { keepPreviousData: true },
  );

  return {
    reportList: data?.data,
    meta: data?.meta,
    isLoading,
    isValidating,
    isError: error,
    mutateReportList: mutate,
  };
}
