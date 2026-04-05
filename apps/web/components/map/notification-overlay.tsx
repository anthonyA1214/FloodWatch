'use client';

import * as React from 'react';
import {
  IconAlertTriangle,
  IconCircleFilled,
  IconFileCheck,
  IconMessageCircle,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type NotificationItem = {
  section: 'new' | 'earlier';
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  message: string;
  time: string;
  tone: 'critical' | 'warning' | 'neutral' | 'safe';
  tag?: 'CRITICAL' | 'RESOLVED';
};

const notifications: NotificationItem[] = [
  {
    section: 'new',
    icon: IconAlertTriangle,
    title: 'Flood Alert',
    message:
      'A danger-level flood has been detected 1.2 km from your area. Stay alert and prepare to move to higher ground.',
    time: '2 mins ago',
    tone: 'critical',
    tag: 'CRITICAL',
  },

  {
    section: 'earlier',
    icon: IconMessageCircle,
    title: 'Comment',
    message:
      'A community member has provided additional context or commentary regarding your submitted report; this information has been attached to your case file for further administrative review.',
    time: '1 hr ago',
    tone: 'neutral',
  },
  {
    section: 'earlier',
    icon: IconFileCheck,
    title: 'Flood Report',
    message:
      'Your report regarding the detected flood activity has been officially confirmed and verified by the administrative team.',
    time: '3 hrs ago',
    tone: 'safe',
  },
];

const toneStyles: Record<NotificationItem['tone'], string> = {
  critical: 'border-l-[#FB2C36] bg-[#FFF8F8]',
  warning: 'border-l-[#F59E0B] bg-[#FFFBEB]',
  neutral: 'border-l-[#2B7FFF] bg-white',
  safe: 'border-l-[#16A34A] bg-[#F0FDF4]',
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

export default function NotificationOverlay() {
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'unread'>(
    'all',
  );
  const unreadCount = notifications.filter(
    (item) => item.section === 'new',
  ).length;
  const newNotifications = notifications.filter(
    (item) => item.section === 'new',
  );
  const earlierNotifications = notifications.filter(
    (item) => item.section === 'earlier',
  );

  return (
    <div className='pointer-events-auto flex h-full w-full flex-col overflow-hidden border border-[#C7CFDA] bg-white shadow-2xl rounded-none md:h-[80vh] md:max-w-[420px] md:rounded-xl'>
      <header className='space-y-1 b px-5 pt-5 pb-3'>
        <div className='flex items-center justify-between gap-3'>
          <h3 className='text-2xl leading-none font-semibold text-[#111827]'>
            Notifications
          </h3>
          <button
            type='button'
            className='h-8 rounded-full bg-[#DCE7F8] px-3 text-[11px] font-medium text-[#0066CC]'
          >
            Mark all as read
          </button>
        </div>

        <p className='text-[11px] text-[#374151]'>
          {unreadCount} unread alerts
        </p>
      </header>

      <div className='border-b border-[#D4D9E2] px-5 py-3'>
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
              {unreadCount}
            </Badge>
          </button>
        </div>
      </div>

      <div className='flex-1 space-y-4 overflow-y-auto px-5 py-4'>
        <section className='space-y-2.5'>
          <h4 className='border-b border-[#C7CFDA] pb-1 text-[11px] font-semibold text-[#4B5563]'>
            NEW
          </h4>
          <div className='space-y-2.5'>
            {newNotifications.map((item) => (
              <NotificationCard
                key={`${item.title}-${item.time}-${item.message}`}
                item={item}
              />
            ))}
          </div>
        </section>

        {activeFilter === 'all' && (
          <section className='space-y-2.5'>
            <h4 className='border-b border-[#C7CFDA] pb-1 text-[11px] font-semibold text-[#4B5563]'>
              EARLIER
            </h4>
            <div className='space-y-2.5'>
              {earlierNotifications.map((item) => (
                <NotificationCard
                  key={`${item.title}-${item.time}-${item.message}`}
                  item={item}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className='border-t border-[#D4D9E2] px-5 py-3'>
        <button
          type='button'
          className='h-9 w-full rounded-md bg-[#E5E7EB] text-sm font-normal text-[#4B5563]'
        >
          See Previous Notifications
        </button>
      </footer>
    </div>
  );
}
