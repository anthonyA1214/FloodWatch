'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { NavItems } from './nav-items';
import LogoutButton from './logout-button';
import { useMe } from '@/hooks/use-me';
import { Skeleton } from '../ui/skeleton';

export default function SideNav() {
  const { me, isLoading } = useMe();

  return (
    <div className='p-4 h-screen'>
      <Sidebar collapsible='none' className='flex rounded-2xl bg-white'>
        <SidebarHeader className='w-full py-6 flex items-center'>
          <Link href='/' className='flex items-center gap-x-2'>
            <Image
              src='/logo.svg'
              alt='FloodWatch Logo'
              width={32}
              height={32}
            />
            <h1 className='text-[#0066CC] font-bold text-xl'>FloodWatch</h1>
          </Link>
        </SidebarHeader>

        <SidebarContent className='w-full flex-1 min-h-0'>
          {/* profile */}
          <SidebarGroup>
            <SidebarGroupContent className='flex flex-col items-center justify-center py-2'>
              <div className='py-1'>
                {isLoading ? (
                  <Skeleton className='size-24 rounded-full' />
                ) : (
                  <UIAvatar className='size-24 border'>
                    <AvatarImage src={me?.profilePicture} />
                    <AvatarFallback>
                      <Avatar
                        name={`${me?.name} ${me?.id}`}
                        variant='beam'
                        className='size-24'
                      />
                    </AvatarFallback>
                  </UIAvatar>
                )}
              </div>

              <div className='flex flex-col text-center gap-0.5'>
                {isLoading ? (
                  <>
                    <Skeleton className='h-6 w-28' />
                    <Skeleton className='h-4 w-20 mx-auto' />
                  </>
                ) : (
                  <>
                    <span className='text-base font-bold leading-tight'>
                      {me?.name}
                    </span>
                    <span className='text-sm text-muted-foreground leading-tight'>
                      {me?.role.toUpperCase()}
                    </span>
                  </>
                )}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent className='space-y-2'>
              <NavItems />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className='border-t py-4 w-full'>
          <SidebarGroup>
            <SidebarGroupContent>
              <LogoutButton />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
