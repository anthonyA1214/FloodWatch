'use client';

import useSWR from 'swr';
import { SafetyLocationDetailInput } from '@repo/schemas';

/**
 * Hospital detail shape saved in /public/data/hospitals-caloocan.json.
 * This intentionally mirrors the safety detail schema so existing safety UI
 * (popup/panel/drawer) can be reused without custom hospital-specific UI.
 */
export type HospitalSafetyDetail = {
  id: number;
  latitude: number;
  longitude: number;
  type: 'hospital';
  location: string;
  address: string;
  description: string | null;
  availability: string | null;
  contactNumber: string | null;
  image: string | null;
  createdAt: string;
  source?: string;
  osmType?: 'node' | 'way' | 'relation' | null;
  osmId?: number;
};

/**
 * Hook to fetch and cache Caloocan hospitals from static JSON file
 *
 * Usage:
 *   const { hospitals, isLoading, isError } = useHospitals();
 *   hospitals?.map(h => <Marker key={h.id} longitude={h.longitude} latitude={h.latitude} />)
 */
export function useHospitals() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    SafetyLocationDetailInput[]
  >(
    'hospitals-caloocan',
    async () => {
      const res = await fetch('/data/hospitals-caloocan.json');
      if (!res.ok) {
        console.error('HOSPITALS FETCH ERROR:', res.status);
        return [];
      }

      const hospitals = (await res.json()) as HospitalSafetyDetail[];

      // Coerce createdAt back to Date so it matches SafetyDetailInput expectations.
      const mapped = hospitals.map((hospital) => ({
        ...hospital,
        createdAt: new Date(hospital.createdAt),
      }));

      return mapped;
    },
    { revalidateOnFocus: false },
  );

  return {
    hospitals: data ?? null,
    isLoading,
    isValidating,
    isError: !!error,
    mutateHospitals: mutate,
  };
}
