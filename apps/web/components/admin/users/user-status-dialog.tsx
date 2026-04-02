'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useUserStatusDialog } from '@/contexts/user-status-dialog-context';
import { blockUser, unblockUser } from '@/lib/actions/update-user-status';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { IconBan } from '@tabler/icons-react';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { cn } from '@/lib/utils';

export default function UserStatusDialog() {
  const { userId, action, open, closeDialog } = useUserStatusDialog();
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useSWRConfig();

  const isBlocking = action === 'block';

  const handleSubmit = async () => {
    if (!userId || !action) return;
    setIsPending(true);
    try {
      if (isBlocking) {
        await blockUser(userId);
      } else {
        await unblockUser(userId);
      }
      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.users);
      closeDialog();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {/* ── Blue Header ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl p-4 shrink-0 text-white'>
          {/* Text */}
          <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
            {isBlocking ? 'BLOCK USER' : 'UNBLOCK USER'}
          </DialogTitle>
        </DialogHeader>

        {/* ── Content Area ── */}
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <div className='flex flex-col p-4 gap-4'>
            <div className='flex items-start gap-4'>
              <div
                className={cn(
                  'flex rounded-full shrink-0 p-3 w-fit',
                  isBlocking ? 'bg-[#FB2C36]/10' : 'bg-[#00D69B]/10',
                )}
              >
                <IconBan
                  className={cn(
                    'size-7 shrink-0',
                    isBlocking ? 'text-[#FB2C36]' : 'text-[#00D69B]',
                  )}
                />
              </div>
              <div className='flex flex-col'>
                <span className='text-base font-bold'>
                  {isBlocking
                    ? 'Are you sure you want to block this user?'
                    : 'Are you sure you want to unblock this user?'}
                </span>
                <span className='text-sm text-black opacity-50'>
                  {isBlocking
                    ? 'Are you sure you want to block this user? They will no longer be able to log in or use the app.'
                    : 'Are you sure you want to unblock this user? They will regain access to the app.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className='grid grid-cols-2  bg-[#F9F9F9] rounded-t-2xl p-4 shrink-0'>
          <Button
            variant='ghost'
            onClick={closeDialog}
            className='font-poppins'
          >
            <span>CANCEL</span>
          </Button>
          <Button
            variant='outline'
            disabled={isPending}
            onClick={handleSubmit}
            className={cn(
              'font-poppins flex items-center gap-2  bg-white',
              isBlocking
                ? 'border-[#FB2C36] text-[#FB2C36] hover:bg-[#FB2C36]/10 hover:text-[#FB2C36]'
                : 'border-[#00D69B] text-[#00D69B] hover:bg-[#00D69B]/10 hover:text-[#00D69B]',
            )}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <IconBan className='w-[1.5em]! h-[1.5em]! shrink-0' />
            )}

            <span>
              {isPending
                ? isBlocking
                  ? 'BLOCKING...'
                  : 'UNBLOCKING...'
                : isBlocking
                  ? 'BLOCK USER'
                  : 'UNBLOCK USER'}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
