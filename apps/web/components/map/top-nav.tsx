'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import {
  IconBell,
  IconMapPinExclamation,
  IconShieldPin,
} from '@tabler/icons-react';
import AuthButtons from '@/components/shared/auth-buttons';
import { useMe } from '@/hooks/use-me';
import { Skeleton } from '@/components/ui/skeleton';
import ReportFloodAlertDialog from './report-flood-alert-dialog';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { cn } from '@/lib/utils';
import { useMapFilter } from '@/contexts/map-filter-context';
import { useNotificationsUnreadCount } from '@/hooks/use-notifications-unread-count';

export default function TopNav() {
  const { toggle, openLocations, activeOverlay } = useMapOverlay();
  const { setQ, setInputValue } = useMapFilter();
  const { me, isLoading } = useMe();
  const { unreadCount } = useNotificationsUnreadCount();

  return (
    <header className='w-full bg-[#0066CC] relative z-50'>
      <nav className='flex flex-wrap lg:flex-nowrap w-full justify-between px-3 md:px-4 py-2 mx-auto items-center gap-y-2'>
        {/* logo and time */}
        <div className='flex items-center gap-3 sm:gap-6 shrink-0 order-first'>
          <Link href='/' className='flex items-center gap-2'>
            <Image src='/logo-white.svg' alt='Logo' width={32} height={32} />
            <h1 className='hidden sm:block text-white font-bold text-lg md:text-xl'>
              FloodWatch
            </h1>
          </Link>
        </div>

        {/* mobile row buttons — full-width second row */}
        <div className='flex basis-full gap-2 order-last lg:hidden'>
          <button
            className={cn(
              'flex flex-1 w-0 items-center justify-center gap-2 text-white min-w-0',
              'bg-white/10 border border-white/10',
              'px-2 py-1.5 rounded-lg text-xs',
              'hover:bg-white/20 hover:border-white/20',
              'active:bg-white/30',
              'transition-colors duration-200',
              activeOverlay?.type === 'affected-list' &&
                'bg-white/30 border-white/30',
            )}
            data-tour='topnav-affected-locations-mobile'
            onClick={() => openLocations('affected-list')}
          >
            <IconMapPinExclamation className='size-[1.5em]! shrink-0' />
            <span className='font-medium truncate'>AFFECTED LOCATIONS</span>
          </button>

          <button
            className={cn(
              'flex flex-1 w-0 items-center justify-center gap-2 text-white min-w-0',
              'bg-white/10 border border-white/10',
              'px-2 py-1.5 rounded-lg text-xs',
              'hover:bg-white/20 hover:border-white/20',
              'active:bg-white/30',
              'transition-colors duration-200',
              activeOverlay?.type === 'safety-list' &&
                'bg-white/30 border-white/30',
            )}
            data-tour='topnav-safety-locations-mobile'
            onClick={() => openLocations('safety-list')}
          >
            <IconShieldPin className='size-[1.5em]! shrink-0' />
            <span className='font-medium truncate'>SAFETY LOCATIONS</span>
          </button>
        </div>

        <div className='flex items-center gap-3 sm:gap-6 ml-auto'>
          {/* desktop tabs beside report */}
          <div className='hidden lg:flex items-center gap-4'>
            <button
              className={cn(
                'flex items-center justify-center gap-2 text-white',
                'bg-white/10 border border-white/10',
                'px-2 md:px-4 py-1.5 rounded-lg text-xs md:text-sm',
                'hover:bg-white/20 hover:border-white/20',
                'active:bg-white/30',
                'transition-colors duration-200 shrink-0 whitespace-nowrap',
                activeOverlay?.type === 'affected-list' &&
                  'bg-white/30 border-white/30',
              )}
              data-tour='topnav-affected-locations-desktop'
              onClick={() => {
                setInputValue('');
                setQ('');
                openLocations('affected-list');
              }}
            >
              <IconMapPinExclamation className='size-[1.5em]! shrink-0' />
              <span className='font-medium'> AFFECTED LOCATIONS</span>
            </button>

            <button
              className={cn(
                'flex items-center justify-center gap-2 text-white',
                'bg-white/10 border border-white/10',
                'px-2 md:px-4 py-1.5 rounded-lg text-xs md:text-sm',
                'hover:bg-white/20 hover:border-white/20',
                'active:bg-white/30',
                'transition-colors duration-200 shrink-0 whitespace-nowrap',
                activeOverlay?.type === 'safety-list' &&
                  'bg-white/30 border-white/30',
              )}
              data-tour='topnav-safety-locations-desktop'
              onClick={() => {
                setInputValue('');
                setQ('');
                openLocations('safety-list');
              }}
            >
              <IconShieldPin className='size-[1.5em]! shrink-0' />
              <span className='font-medium'>SAFETY LOCATIONS</span>
            </button>
          </div>

          {/* user actions */}
          {isLoading ? (
            <div className='flex items-center gap-3 ml-auto'>
              <Skeleton className='w-24 h-9 rounded-md bg-white/20' />
              <Skeleton className='w-6 h-6 rounded-md bg-white/20' />
              <Skeleton className='size-8 rounded-full bg-white/20' />
            </div>
          ) : me ? (
            <div className='flex items-center gap-3 ml-auto'>
              <div data-tour='report-flood-alert'>
                <ReportFloodAlertDialog />
              </div>

              <button
                className={cn(
                  'relative text-base text-white/70 hover:text-white transition-colors shrink-0 p-1.5 rounded-full bg-white/10 hover:bg-white/20',
                  activeOverlay?.type === 'notification' &&
                    'text-white bg-white/20',
                )}
                onClick={() => toggle('notification')}
              >
                <IconBell className='size-[1.5em]! shrink-0' />
                {unreadCount > 0 && (
                  <span className='absolute top-0 right-0 size-2 rounded-full bg-[#FB2C36]' />
                )}
              </button>

              <button
                onClick={() => toggle('profile')}
                className={cn(
                  activeOverlay?.type === 'profile' &&
                    'ring-2 ring-white ring-offset-2 ring-offset-[#0066CC] rounded-full',
                )}
              >
                <UIAvatar className='size-8 border'>
                  <AvatarImage src={me?.profilePicture} />
                  <AvatarFallback>
                    <Avatar
                      name={`${me?.name} ${me?.id}`}
                      variant='beam'
                      className='size-8'
                    />
                  </AvatarFallback>
                </UIAvatar>
              </button>
            </div>
          ) : (
            <div className='ml-auto'>
              <AuthButtons />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
