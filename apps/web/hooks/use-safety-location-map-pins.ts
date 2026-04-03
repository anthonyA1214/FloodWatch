'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { SafetyLocationMapPinInput } from '@repo/schemas';
import { getSafetyLocationMapPins } from '@/lib/fetchers/get-safety-location-map-pins';

export function useSafetyLocationMapPins() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    SafetyLocationMapPinInput[]
  >(SWR_KEYS.safetyLocationMapPins, getSafetyLocationMapPins);

  return {
    safetyMapPins: data,
    isLoading,
    isValidating,
    isError: error,
    mutateSafetyMapPins: mutate,
  };
}
