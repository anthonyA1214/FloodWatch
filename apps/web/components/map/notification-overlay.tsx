'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import NotificationOverlayAllTab from '@/components/shared/notification-overlay-all-tab';
import NotificationOverlayUnreadTab from '@/components/shared/notification-overlay-unread-tab';
import { useNotificationsUnreadCount } from '@/hooks/use-notifications-unread-count';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { useNotifications } from '@/hooks/use-notifications';
import { toast } from 'sonner';

export default function NotificationOverlay() {
  const { unreadCount } = useNotificationsUnreadCount();
  const { mutateNotifications } = useNotifications();
  const { mutateUnreadCount } = useNotificationsUnreadCount();

  const handleMarkAllAsRead = async () => {
    try {
      await apiFetchClient('/me/notifications/read-all', {
        method: 'PATCH',
      });

      await Promise.all([
        mutateNotifications((prev) =>
          prev?.map((notification) => ({ ...notification, isRead: true })),
        ),
        mutateUnreadCount((prev: number) => (prev ?? 1) - 1, {
          revalidate: false,
        }),
      ]);
      mutateUnreadCount(); // background revalidate to sync with server
    } catch {
      toast.error(
        'Failed to mark all notifications as read. Please try again.',
      );
    }
  };

  return (
    <div className='flex flex-col gap-2 bg-white w-screen md:w-[400px] md:h-[80vh] rounded-xl shadow-md pointer-events-auto'>
      <div className='flex items-center justify-between pt-4 px-4 shrink-0'>
        <h3 className='font-poppins font-semibold'>Notifications</h3>
        <Button
          variant='outline'
          size='xs'
          className='font-poppins flex items-center gap-2 border-[#0066CC] bg-white text-[#0066CC] hover:bg-[#0066CC10] hover:text-[#0066CC]'
          onClick={handleMarkAllAsRead}
        >
          <span>MARK ALL AS READ</span>
        </Button>
      </div>

      <Tabs defaultValue='all' className='flex-1 flex flex-col min-h-0'>
        <div className='w-full border-b shrink-0'>
          <TabsList className='font-poppins bg-transparent gap-2 text-xs mb-2 px-4'>
            <TabsTrigger
              value='all'
              className='border border-gray-300 rounded-full
                data-[state=active]:text-white
                data-[state=active]:bg-[#0066CC]
                data-[state=active]:border-[#0066CC]'
            >
              ALL
            </TabsTrigger>
            <TabsTrigger
              value='unread'
              className='border border-gray-300 rounded-full
                data-[state=active]:text-white
                data-[state=active]:bg-[#0066CC]
                data-[state=active]:border-[#0066CC]'
            >
              UNREAD
              {unreadCount > 0 && (
                <div className='text-[10px] text-white bg-[#FB2C36] size-5 rounded-full flex items-center justify-center'>
                  {unreadCount}
                </div>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value='all'
          className='flex-1 min-h-0 overflow-y-auto px-4 pb-4'
        >
          <NotificationOverlayAllTab />
        </TabsContent>
        <TabsContent
          value='unread'
          className='flex-1 min-h-0 overflow-y-auto px-4 pb-4'
        >
          <NotificationOverlayUnreadTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
