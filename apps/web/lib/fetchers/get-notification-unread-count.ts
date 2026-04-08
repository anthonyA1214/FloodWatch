import { apiFetchClient } from '@/lib/api-fetch-client';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export async function getNotificationsUnreadCount() {
  const res = await apiFetchClient(SWR_KEYS.notificationsUnreadCount, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch unread notifications count');

  return res.json();
}
