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
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

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

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {items.map((item) => {
        const isActive = pathname === item.url;
        return (
          <SidebarMenuItem
            key={item.title}
            className='relative'
            onMouseEnter={() => setHoveredItem(item.url)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <AnimatePresence>
              {hoveredItem === item.url && !isActive && (
                <motion.div
                  key='hover'
                  layoutId='hover-nav-indicator'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='absolute inset-0 rounded-md bg-[#0066CC]/5'
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </AnimatePresence>

            {isActive && (
              <motion.div
                layoutId='active-nav-indicator'
                className='absolute inset-0 rounded-md bg-[#0066CC]/10'
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            {/* Left border pill */}
            {isActive && (
              <motion.div
                layoutId='active-nav-border'
                className='absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[#0066CC]'
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            <SidebarMenuButton
              asChild
              className='text-base relative z-10 hover:bg-transparent active:bg-transparent'
            >
              <Link
                href={item.url}
                className={cn(
                  'flex items-center gap-4 py-6 pl-4 transition-colors duration-200',
                  isActive
                    ? 'text-[#0066CC]'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <item.icon className='w-[1.5em]! h-[1.5em]!' aria-hidden />
                <span className='font-poppins'>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </AnimatePresence>
  );
}
