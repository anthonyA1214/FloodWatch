'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { SafetyLocationMapPinInput } from '@repo/schemas';
import { getSafetyLocationMapPins } from '@/lib/fetchers/get-safety-location-map-pins';
import { useHospitals } from './use-hospitals';

export function useSafetyLocationMapPins() {
  const { hospitals } = useHospitals();

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    SafetyLocationMapPinInput[]
  >(SWR_KEYS.safetyLocationMapPins, getSafetyLocationMapPins);

  const hospitalPins: SafetyLocationMapPinInput[] =
    hospitals?.map((hospital) => ({
      id: hospital.id,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
      type: 'hospital',
    })) ?? [];

  const mergedPins = [...(data ?? []), ...hospitalPins];

  return {
    safetyMapPins: mergedPins,
    isLoading,
    isValidating,
    isError: error,
    mutateSafetyMapPins: mutate,
  };
}
