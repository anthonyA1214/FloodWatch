import { apiFetchClient } from '../api-fetch-client';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getSafetyLocationDetail(safetyId: number) {
  const res = await apiFetchClient(SWR_KEYS.safetyLocationDetail(safetyId), {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch safety location detail');

  return res.json();
}
