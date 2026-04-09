'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { getNotificationsUnreadCount } from '@/lib/fetchers/get-notification-unread-count';

export function useNotificationsUnreadCount() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    SWR_KEYS.notificationsUnreadCount,
    getNotificationsUnreadCount,
  );

  return {
    unreadCount: data?.count,
    isLoading,
    isValidating,
    isError: error,
    mutateUnreadCount: mutate,
  };
}
