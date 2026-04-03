import { apiFetchClient } from '@/lib/api-fetch-client';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export async function getSafetyLocationMapPins() {
  const res = await apiFetchClient(SWR_KEYS.safetyLocationMapPins, {
    method: 'GET',
  });

  if (!res.ok) {
    console.error('SAFETY LOCATIONS ERROR:', res.status);
    return null;
  }

  const data = await res.json();
  return data;
}
