'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { SafetyLocationListQueryInput } from '@repo/schemas';
import { getSafetyList } from '@/lib/fetchers/get-safety-list';

export function useSafetyList(params: SafetyLocationListQueryInput) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [SWR_KEYS.safetyList, params],
    () => getSafetyList(params),
    { keepPreviousData: true },
  );

  return {
    safetyList: data?.data,
    meta: data?.meta,
    isLoading,
    isValidating,
    isError: error,
    mutateSafetyList: mutate,
  };
}
