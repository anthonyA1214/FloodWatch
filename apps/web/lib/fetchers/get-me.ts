import { apiFetchClient } from '@/lib/api-fetch-client';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export async function getMe() {
  const res = await apiFetchClient(SWR_KEYS.me, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch user data');

  return res.json();
}
