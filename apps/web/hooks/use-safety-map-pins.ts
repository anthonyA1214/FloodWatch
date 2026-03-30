'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { SafetyMapPinInput } from '@repo/schemas';
import { getSafetyMapPins } from '@/lib/fetchers/get-safety-map-pins';
import { useHospitals } from './use-hospitals';

export function useSafetyMapPins() {
  const { hospitals } = useHospitals();

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    SafetyMapPinInput[]
  >(SWR_KEYS.safetyMapPins, getSafetyMapPins);

  const hospitalPins: SafetyMapPinInput[] =
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
