'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCircleFilled,
  IconMessageCircle,
  IconTrash,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type NotificationSheetProps = {
  children: React.ReactNode;
};

type NotificationItem = {
  title: string;
  message: string;
  time: string;
  tag?: string;
  tone: 'critical' | 'resolved' | 'neutral';
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const recentNotifications: NotificationItem[] = [
  {
    title: 'Flood Report',
    message:
      'Critical flood levels have been detected in Barangay 176-C. Water has risen above the designated safety threshold and may continue to increase due to ongoing rainfall and drainage overflow.',
    time: '2 mins ago',
    tag: 'CRITICAL',
    tone: 'critical',
    icon: IconAlertTriangle,
  },
  {
    title: 'Flood Report',
    message:
      'The flooding previously reported in Barangay 174, Caloocan has now subsided and water levels have returned to safe conditions. Local authorities have confirmed that the area is no longer under flood threat.',
    time: '2 mins ago',
    tag: 'RESOLVED',
    tone: 'resolved',
    icon: IconAlertTriangle,
  },
  {
    title: 'Comment',
    message:
      'Juan commented on your post: "Critical flood level detected in Barangay 176-C. Residents are advised to stay alert and prepare for possible evacuation."',
    time: '2 mins ago',
    tone: 'neutral',
    icon: IconMessageCircle,
  },
];

const earlierNotifications: NotificationItem[] = [
  {
    title: 'Delete Report',
    message:
      'Critical flood level detected in Barangay 176-C. This post is no longer visible to other users.',
    time: '2 days ago',
    tone: 'neutral',
    icon: IconAlertTriangle,
  },
  {
    title: 'Reported a Flood Post',
    message:
      'Critical flood level detected in Barangay 176-C. The authorities have been notified and will review the report.',
    time: '1 week ago',
    tone: 'neutral',
    icon: IconTrash,
  },
];

const toneStyles: Record<NotificationItem['tone'], string> = {
  critical: 'border-l-[#FB2C36] bg-[#FFF8F8]',
  resolved: 'border-l-[#0066CC] bg-[#F5FFF8]',
  neutral: 'border-l-[#2B7FFF] bg-white',
};

const tagStyles: Record<NonNullable<NotificationItem['tag']>, string> = {
  CRITICAL: 'border-[#FB2C36] text-[#FB2C36] bg-[#FFF1F1]',
  RESOLVED: 'border-[#2B7FFF] text-[#2B7FFF] bg-[#F0F7FF]',
};

function NotificationCard({ item }: { item: NotificationItem }) {
  const Icon = item.icon;

  return (
    <article
      className={cn(
        'relative rounded-xl border border-[#D7DEE8] border-l-4 p-3 pr-6',
        toneStyles[item.tone],
      )}
    >
      <div className='mb-1.5 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <Icon className='size-4 text-[#0066CC]' strokeWidth={1.8} />
          <h3 className='font-semibold text-[13px] text-[#1F2937]'>
            {item.title}
          </h3>
          {item.tag ? (
            <Badge
              variant='outline'
              className={cn(
                'h-5 px-2 text-[10px] font-semibold',
                tagStyles[item.tag],
              )}
            >
              {item.tag}
            </Badge>
          ) : null}
        </div>
        <span className='shrink-0 text-[10px] text-[#6B7280]'>{item.time}</span>
      </div>

      <p className='pr-2 text-[11px] leading-relaxed text-[#6B7280]'>
        {item.message}
      </p>

      <IconCircleFilled className='absolute top-1/2 right-2 size-2 -translate-y-1/2 text-[#2B7FFF]' />
    </article>
  );
}

export default function NotificationSheet({
  children,
}: NotificationSheetProps) {
  const animationMs = 220;
  const closeTimeoutRef = React.useRef<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'unread'>(
    'all',
  );

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
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closePanel();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePanel, open]);

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            openPanel();
          } else {
            closePanel();
          }
        }}
      >
        <PopoverTrigger asChild>
          <span className='contents'>{children}</span>
        </PopoverTrigger>
      </Popover>

      {mounted &&
        shouldRender &&
        createPortal(
          <div
            className={cn(
              'fixed inset-0 z-120 bg-transparent py-2 pr-2 pl-0 sm:py-4 sm:pr-4 sm:pl-0 transition-opacity duration-200',
              open ? 'opacity-100' : 'opacity-0',
            )}
            onClick={closePanel}
          >
            <div className='flex h-full w-full items-start justify-start pl-0 ml-72 md:pl-(--sidebar-width)'>
              <section
                className={cn(
                  'flex h-[calc(100vh-2rem)] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-[#C7CFDA] bg-[#F8FAFC] shadow-2xl transition-all duration-200 ease-out',
                  open
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-8 opacity-0',
                )}
                onClick={(event) => event.stopPropagation()}
              >
                <header className='space-y-1 border-b border-[#D4D9E2] px-8 pt-6 pb-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <button
                      type='button'
                      className='flex items-center gap-2 text-black'
                      onClick={closePanel}
                    >
                      <span className='flex size-6 items-center justify-center rounded-full border border-[#C7CFDA]'>
                        <IconArrowLeft className='size-4' strokeWidth={2} />
                      </span>
                      <h2 className='text-[42px] leading-none font-semibold'>
                        Notifications
                      </h2>
                    </button>

                    <button
                      type='button'
                      className='h-9 rounded-full bg-[#DCE7F8] px-4 text-xs font-medium text-[#0066CC]'
                    >
                      Mark all as read
                    </button>
                  </div>

                  <p className='text-xs text-[#374151]'>3 unread alerts</p>
                </header>

                <div className='flex-1 space-y-5 overflow-y-auto px-8 py-4'>
                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      className={cn(
                        'h-7 rounded-full px-4 text-[11px] font-semibold uppercase tracking-wide transition-colors',
                        activeFilter === 'all'
                          ? 'bg-[#0066CC] text-white'
                          : 'bg-white text-[#374151] ring-1 ring-inset ring-[#D1D5DB]',
                      )}
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </button>

                    <button
                      type='button'
                      className={cn(
                        'flex h-7 items-center rounded-full px-3 text-[11px] font-semibold uppercase tracking-wide transition-colors',
                        activeFilter === 'unread'
                          ? 'bg-[#0066CC] text-white'
                          : 'border border-[#D1D5DB] text-[#374151]',
                      )}
                      onClick={() => setActiveFilter('unread')}
                    >
                      Unread
                      <Badge
                        className={cn(
                          'ml-1.5 h-4 min-w-4 px-1 text-[9px] leading-none',
                          activeFilter === 'unread'
                            ? 'bg-white text-[#0066CC]'
                            : 'bg-[#FF3B30] text-white',
                        )}
                      >
                        3
                      </Badge>
                    </button>
                  </div>

                  {(activeFilter === 'all' ||
                    recentNotifications.length > 0) && (
                    <section className='space-y-2.5'>
                      <h4 className='border-b border-[#C7CFDA] pb-1 text-[11px] font-semibold text-[#4B5563]'>
                        RECENT
                      </h4>
                      <div className='space-y-2.5'>
                        {recentNotifications.map((item) => (
                          <NotificationCard
                            key={`${item.title}-${item.time}-${item.message}`}
                            item={item}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {activeFilter === 'all' && (
                    <section className='space-y-2.5'>
                      <h4 className='border-b border-[#C7CFDA] pb-1 text-[11px] font-semibold text-[#4B5563]'>
                        EARLIER
                      </h4>
                      <div className='space-y-2.5'>
                        {earlierNotifications.map((item) => (
                          <NotificationCard
                            key={`${item.title}-${item.time}`}
                            item={item}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <footer className='border-t border-[#D4D9E2] px-8 py-4'>
                  <button
                    type='button'
                    className='h-9 w-full rounded-md bg-[#E5E7EB] text-sm font-normal text-[#4B5563]'
                  >
                    See Previous Notifications
                  </button>
                </footer>
              </section>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
