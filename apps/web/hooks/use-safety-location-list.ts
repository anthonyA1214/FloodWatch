'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { SafetyLocationListQueryInput } from '@repo/schemas';
import { getSafetyLocationList } from '@/lib/fetchers/get-safety-location-list';

export function useSafetyLocationList(params: SafetyLocationListQueryInput) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [SWR_KEYS.safetyLocationList, params],
    () => getSafetyLocationList(params),
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
