import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { apiFetchClient } from '../api-fetch-client';

export async function getNews() {
  const res = await apiFetchClient(SWR_KEYS.news, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch news');

  return res.json();
}
