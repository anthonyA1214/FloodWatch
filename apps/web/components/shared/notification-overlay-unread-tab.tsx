import { useNotifications } from '@/hooks/use-notifications';
import NotificationItem from './notification-item';
import EmptyNotifications from '../map/empty/empty-notifications';
import NotificationItemsSkeleton from './skeletons/notification-items-skeleton';

export default function NotificationOverlayUnreadTab() {
  const { notifications, isLoading } = useNotifications();

  const unreadNotifications = notifications?.filter(
    (notification) => !notification.isRead,
  );

  if (unreadNotifications?.length === 0)
    return (
      <EmptyNotifications
        title='No unread notifications'
        description="You're all caught up!"
      />
    );

  return (
    <div className='flex flex-col gap-4'>
      {isLoading ? (
        <NotificationItemsSkeleton />
      ) : (
        unreadNotifications?.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            type={notification.type}
            message={notification.message}
            isRead={notification.isRead}
            createdAt={notification.createdAt}
          />
        ))
      )}
    </div>
  );
}
