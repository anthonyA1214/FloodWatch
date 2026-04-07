import { apiFetchClient } from '@/lib/api-fetch-client';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export async function getMyVote(reportId: number) {
  const res = await apiFetchClient(SWR_KEYS.myVote(reportId), {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch my vote');

  return res.json();
}
