import { apiFetchClient } from '../api-fetch-client';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getSafetyLocationDetail(safetyId: number) {
  // Synthetic hospital IDs are stored as negative OSM ids in the static JSON file.
  if (safetyId < 0) {
    const res = await fetch('/data/hospitals-caloocan.json');
    if (!res.ok) {
      console.error('HOSPITAL DETAIL ERROR:', res.status);
      return null;
    }

    const hospitals = await res.json();
    const hospital = hospitals.find((h: { id: number }) => h.id === safetyId);

    if (!hospital) {
      console.error('HOSPITAL DETAIL NOT FOUND:', safetyId);
      return null;
    }

    return {
      ...hospital,
      createdAt: new Date(hospital.createdAt),
    };
  }

  const res = await apiFetchClient(SWR_KEYS.safetyLocationDetail(safetyId), {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch safety location detail');

  return res.json();
}
