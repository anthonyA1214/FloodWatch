'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { ReportDetailInput } from '@repo/schemas';
import { getReportDetail } from '@/lib/fetchers/get-report-detail';

export function useReportDetail(reportId: number | null) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ReportDetailInput>(
      reportId ? SWR_KEYS.reportDetail(reportId) : null,
      () => getReportDetail(reportId!),
    );

  return {
    reportDetail: data,
    isLoading,
    isValidating,
    isError: error,
    mutateReportDetail: mutate,
  };
}
