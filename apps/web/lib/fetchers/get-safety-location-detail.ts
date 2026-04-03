import { apiFetchClient } from '../api-fetch-client';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getSafetyLocationDetail(safetyId: number) {
  const res = await apiFetchClient(SWR_KEYS.safetyLocationDetail(safetyId), {
    method: 'GET',
  });

  if (!res.ok) {
    console.error('SAFETY DETAIL ERROR:', res.status);
    return null;
  }

  const data = await res.json();
  return data;
}
