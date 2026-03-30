'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { ReportedCommentQueryInput } from '@repo/schemas';
import { getReportedComments } from '@/lib/fetchers/get-reported-comments';

export function useReportedComments(params: ReportedCommentQueryInput) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [SWR_KEYS.reportedComments, params],
    () => getReportedComments(params),
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
