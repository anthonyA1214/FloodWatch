'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { getNotifications } from '@/lib/fetchers/get-notifications';
import { NotificationItemInput } from '@repo/schemas';

export function useNotifications() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    NotificationItemInput[]
  >(SWR_KEYS.notifications, getNotifications, {
    refreshInterval: 30000,
  });

  return {
    notifications: data,
    isLoading,
    isValidating,
    isError: error,
    mutateNotifications: mutate,
  };
}
