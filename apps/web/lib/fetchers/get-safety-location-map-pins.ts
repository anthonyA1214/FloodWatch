import { apiFetchClient } from '@/lib/api-fetch-client';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export async function getSafetyLocationMapPins() {
  const res = await apiFetchClient(SWR_KEYS.safetyLocationMapPins, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch safety location map pins');

  return res.json();
}
