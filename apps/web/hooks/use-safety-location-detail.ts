'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { SafetyLocationDetailInput } from '@repo/schemas';
import { getSafetyLocationDetail } from '@/lib/fetchers/get-safety-location-detail';

export function useSafetyLocationDetail(safetyId: number | null) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<SafetyLocationDetailInput>(
      safetyId ? SWR_KEYS.safetyLocationDetail(safetyId) : null,
      () => getSafetyLocationDetail(safetyId!),
    );

  return {
    safetyDetail: data,
    isLoading,
    isValidating,
    isError: error,
    mutateSafetyDetail: mutate,
  };
}
