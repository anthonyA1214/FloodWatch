import { apiFetchClient } from '@/lib/api-fetch-client';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export async function getNotifications() {
  const res = await apiFetchClient(SWR_KEYS.notifications, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch notifications');

  return res.json();
}
