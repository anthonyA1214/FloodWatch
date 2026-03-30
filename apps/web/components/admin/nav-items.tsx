'use client';

import { usePathname } from 'next/navigation';
import {
  IconArchive,
  IconClipboard,
  IconMap,
  IconMessageReport,
  IconReportAnalytics,
  IconSettings2,
  IconShieldPin,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function NavItems() {
  const items = [
    {
      title: 'DASHBOARD',
      url: '/admin',
      icon: IconClipboard,
    },
    {
      title: 'USER MANAGEMENT',
      url: '/admin/users',
      icon: IconUserCog,
    },
    {
      title: 'INTERACTIVE MAP',
      url: '/admin/map',
      icon: IconMap,
    },
    {
      title: 'FLOOD REPORTS',
      url: '/admin/reports',
      icon: IconReportAnalytics,
    },
    {
      title: 'SAFETY LOCATIONS',
      url: '/admin/safety',
      icon: IconShieldPin,
    },
    {
      title: 'REPORTED COMMENTS',
      url: '/admin/reported-comments',
      icon: IconMessageReport,
    },
    // {
    //   title: 'ARCHIVE & RECORDS',
    //   url: '/admin/archive',
    //   icon: IconArchive,
    // },
    {
      title: 'COMMUNITY FEED',
      url: '/admin/feed',
      icon: IconUsers,
    },

    {
      title: 'SETTINGS',
      url: '/admin/settings',
      icon: IconSettings2,
    },
  ];

  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.url;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className='text-base'>
              <Link
                href={item.url}
                className={cn(
                  'flex items-center gap-4 py-6 pl-4 border-l-4 border-transparent',
                  isActive &&
                    'border-[#0066CC] text-[#0066CC] hover:text-[#0066CC]! hover:bg-transparent',
                )}
              >
                <item.icon className='w-[1.5em]! h-[1.5em]!' aria-hidden />
                <span className='font-poppins'>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
