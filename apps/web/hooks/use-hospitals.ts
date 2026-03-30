'use client';

import useSWR from 'swr';

/**
 * Hospital data type as stored in hospitals-caloocan.json
 */
export type Hospital = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  source: string;
  osmType: 'node' | 'way' | 'relation';
  osmId: number;
  tags: {
    amenity: string | null;
    healthcare: string | null;
    operator: string | null;
  };
};

/**
 * Hook to fetch and cache Caloocan hospitals from static JSON file
 *
 * Usage:
 *   const { hospitals, isLoading, isError } = useHospitals();
 *   hospitals?.map(h => <Marker key={h.id} longitude={h.longitude} latitude={h.latitude} />)
 */
export function useHospitals() {
  // Fetch the static JSON file from public/data folder
  const { data, error, isLoading, isValidating, mutate } = useSWR<Hospital[]>(
    'hospitals-caloocan', // SWR key for caching
    async () => {
      const res = await fetch('/data/hospitals-caloocan.json');
      if (!res.ok) {
        console.error('HOSPITALS FETCH ERROR:', res.status);
        return [];
      }
      const hospitals = await res.json();
      console.log(`Loaded ${hospitals.length} hospitals from Caloocan`);
      return hospitals;
    },
    { revalidateOnFocus: false }, // Don't refetch when window regains focus
  );

  return {
    hospitals: data ?? null,
    isLoading,
    isValidating,
    isError: !!error,
    mutateHospitals: mutate,
  };
}
