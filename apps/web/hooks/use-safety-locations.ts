'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { SafetyLocationQueryInput } from '@repo/schemas';
import { getSafetyLocations } from '@/lib/fetchers/get-safety-locations';

export function useSafetyLocations(params: SafetyLocationQueryInput) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [SWR_KEYS.safetyLocations, params],
    () => getSafetyLocations(params),
    { keepPreviousData: true },
  );

  return {
    safetyLocations: data?.data,
    meta: data?.meta,
    stats: data?.stats,
    isLoading,
    isValidating,
    isError: error,
    mutateSafetyLocations: mutate,
  };
}
