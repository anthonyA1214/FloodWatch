'use client';

import { useNotifications } from '@/hooks/use-notifications';
import NotificationItem from './notification-item';
import EmptyNotifications from '../map/empty/empty-notifications';
import NotificationItemsSkeleton from './skeletons/notification-items-skeleton';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { toast } from 'sonner';
import { useNotificationsUnreadCount } from '@/hooks/use-notifications-unread-count';

export default function NotificationOverlayAllTab() {
  const { notifications, isLoading, mutateNotifications } = useNotifications();
  const { mutateUnreadCount } = useNotificationsUnreadCount();

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiFetchClient(`/me/notifications/${id}/read`, {
        method: 'PATCH',
      });
      await Promise.all([
        mutateNotifications(
          (prev) =>
            prev?.map((notification) =>
              notification.id === id
                ? { ...notification, isRead: true }
                : notification,
            ),
          { revalidate: false },
        ),
        mutateUnreadCount((prev: number) => (prev ?? 1) - 1, {
          revalidate: false,
        }),
      ]);
      mutateUnreadCount(); // background revalidate to sync with server
    } catch {
      toast.error('Failed to mark notification as read. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiFetchClient(`/me/notifications/${id}`, {
        method: 'DELETE',
      });
      await mutateNotifications(
        (prev) => prev?.filter((notification) => notification.id !== id),
        { revalidate: false },
      );
    } catch {
      toast.error('Failed to delete notification. Please try again.');
    }
  };

  if (notifications?.length === 0) return <EmptyNotifications />;

  return (
    <div className='flex flex-col gap-4'>
      {isLoading ? (
        <NotificationItemsSkeleton />
      ) : (
        notifications?.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            type={notification.type}
            message={notification.message}
            isRead={notification.isRead}
            createdAt={notification.createdAt}
            onMarkAsRead={() => handleMarkAsRead(notification.id)}
            onDelete={() => handleDelete(notification.id)}
          />
        ))
      )}
    </div>
  );
}
