'use client';

import { IconLogout } from '@tabler/icons-react';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useState } from 'react';
import { logout } from '@/lib/services/auth/logout';
import { Spinner } from '@/components/ui/spinner';

export default function LogoutButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsPending(true);

    try {
      await logout();
      window.location.replace('/');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className='text-base cursor-pointer transition-colors duration-200 hover:bg-[#0066CC]/5 active:bg-[#0066CC]/10'
        disabled={isPending}
        onClick={handleLogout}
      >
        <div className='flex items-center gap-4 py-6 pl-4 border-l-4 border-transparent text-base font-poppins'>
          {isPending ? (
            <>
              <Spinner />
              <span>SIGNING OUT...</span>
            </>
          ) : (
            <>
              <IconLogout className='w-[1.5em]! h-[1.5em]!' aria-hidden />
              <span>SIGN OUT</span>
            </>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
