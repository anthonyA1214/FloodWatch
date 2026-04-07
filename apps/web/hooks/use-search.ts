'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { SearchQueryInput } from '@repo/schemas';
import { getSearch } from '@/lib/fetchers/get-search';

export function useSearch(params: SearchQueryInput, enabled: boolean = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    enabled ? [SWR_KEYS.search, params] : null,
    () => getSearch(params),
    { keepPreviousData: true },
  );

  return {
    reports: data?.reports,
    safetyLocations: data?.safety,
    isLoading,
    isValidating,
    isError: error,
    mutateReportList: mutate,
  };
}
