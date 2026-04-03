'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { SafetyLocationDetailInput } from '@repo/schemas';
import { getSafetyDetail } from '@/lib/fetchers/get-safety-detail';

export function useSafetyDetail(safetyId: number | null) {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<SafetyLocationDetailInput>(
      safetyId ? SWR_KEYS.safetyDetail(safetyId) : null,
      () => getSafetyDetail(safetyId!),
    );

  return {
    safetyDetail: data,
    isLoading,
    isValidating,
    isError: error,
    mutateSafetyDetail: mutate,
  };
}
