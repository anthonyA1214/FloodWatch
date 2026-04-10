'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import NotificationOverlayUnreadTab from '../shared/notification-overlay-unread-tab';
import NotificationOverlayAllTab from '../shared/notification-overlay-all-tab';
import { useNotificationsUnreadCount } from '@/hooks/use-notifications-unread-count';
import { useNotifications } from '@/hooks/use-notifications';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { toast } from 'sonner';

interface NotificationSheetProps {
  children: React.ReactNode;
}

export default function NotificationSheet({
  children,
}: NotificationSheetProps) {
  const animationMs = 220;
  const closeTimeoutRef = React.useRef<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const { unreadCount } = useNotificationsUnreadCount();
  const { mutateNotifications } = useNotifications();
  const { mutateUnreadCount } = useNotificationsUnreadCount();

  const handleMarkAllAsRead = async () => {
    try {
      await apiFetchClient('/me/notifications/read-all', { method: 'PATCH' });
      await Promise.all([
        mutateNotifications((prev) =>
          prev?.map((notification) => ({ ...notification, isRead: true })),
        ),
        mutateUnreadCount((prev: number) => (prev ?? 1) - 1, {
          revalidate: false,
        }),
      ]);
      mutateUnreadCount();
    } catch {
      toast.error(
        'Failed to mark all notifications as read. Please try again.',
      );
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const openPanel = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setShouldRender(true);
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const closePanel = React.useCallback(() => {
    setOpen(false);
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setShouldRender(false);
      closeTimeoutRef.current = null;
    }, animationMs);
  }, [animationMs]);

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closePanel();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePanel, open]);

  const triggerChild = React.useMemo(
    () =>
      React.isValidElement(children)
        ? React.cloneElement(
            children as React.ReactElement<{ 'data-open'?: string }>,
            {
              'data-open': open ? 'true' : 'false',
            },
          )
        : children,
    [children, open],
  );

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) openPanel();
          else closePanel();
        }}
      >
        <PopoverTrigger asChild>
          <span className='contents'>{triggerChild}</span>
        </PopoverTrigger>
      </Popover>

      {mounted &&
        shouldRender &&
        createPortal(
          <div
            className={cn(
              'fixed inset-0  bg-transparent py-2 pr-2 pl-0 sm:py-4 sm:pr-4 sm:pl-0 transition-opacity duration-200',
              open ? 'opacity-100' : 'opacity-0',
            )}
            onClick={closePanel}
          >
            <div className='flex h-full w-full items-start justify-start ml-72 md:pl-(--sidebar-width)'>
              <section
                className={cn(
                  'flex h-[calc(100vh-2rem)] w-full max-w-[580px] flex-col overflow-hidden rounded-2xl border border-[#C7CFDA] bg-[#F8FAFC] shadow-2xl transition-all duration-200 ease-out',
                  open
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-8 opacity-0',
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <header className='border-b border-[#D4D9E2] px-4 pt-4 pb-3 shrink-0'>
                  <button
                    type='button'
                    className='flex items-center gap-2 text-black'
                    onClick={closePanel}
                  >
                    <span className='flex size-6 items-center justify-center rounded-full border border-[#C7CFDA]'>
                      <IconArrowLeft className='size-4' strokeWidth={2} />
                    </span>
                  </button>
                </header>

                <div className='flex flex-col flex-1 min-h-0'>
                  <div className='flex items-center justify-between pt-4 px-4 shrink-0'>
                    <h3 className='font-poppins font-semibold'>
                      Notifications
                    </h3>
                    <Button
                      variant='outline'
                      size='xs'
                      className='font-poppins flex items-center gap-2 border-[#0066CC] bg-white text-[#0066CC] hover:bg-[#0066CC10] hover:text-[#0066CC]'
                      onClick={handleMarkAllAsRead}
                    >
                      <span>MARK ALL AS READ</span>
                    </Button>
                  </div>

                  <Tabs
                    defaultValue='all'
                    className='flex-1 flex flex-col min-h-0'
                  >
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
              </section>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
