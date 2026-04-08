'use client';

import { colorMap, iconMap, titleMap } from '@/lib/utils/notifications.helper';
import { NotificationItemInput } from '@repo/schemas';
import { IconCheck, IconClock, IconDots, IconTrash } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type NotificationItemProps = NotificationItemInput & {
  onMarkAsRead?: (id: number) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
};

export default function NotificationItem({
  id,
  type,
  message,
  isRead,
  createdAt,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [open, setOpen] = useState(false);
  const color = colorMap[type];
  const Icon = iconMap[type];
  const title = titleMap[type];

  const handleMarkAsRead = async () => {
    await onMarkAsRead?.(id);
  };

  const handleDelete = async () => {
    await onDelete?.(id);
  };

  return (
    <div
      className='relative grid border-l-4 rounded-lg p-4 gap-4 group'
      style={{ borderLeftColor: color, backgroundColor: `${color}10` }}
    >
      {!isRead && (
        <div
          className='absolute top-2 right-2 size-2 rounded-full shrink-0'
          style={{ backgroundColor: color }}
        />
      )}

      <div
        className={cn(
          'absolute top-2 right-2 z-10 transition-all duration-200',
          open
            ? 'opacity-100 visible'
            : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
        )}
      >
        <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button className='rounded-full bg-white/80 hover:bg-white data-[state=open]:bg-white shadow-sm p-1.5 sm:p-2 transition text-xs'>
              <IconDots className='size-[1.5em]! shrink-0' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleMarkAsRead} disabled={isRead}>
              <IconCheck className='size-[1.5em]! shrink-0' />
              <span className='font-poppins'>
                {isRead ? 'Already read' : 'Mark as read'}
              </span>
            </DropdownMenuItem>

            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive' onClick={handleDelete}>
                <IconTrash className='size-[1.5em]! shrink-0' />
                <span className='font-poppins'>Delete this notification</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex justify-between gap-8 items-center'>
        {/* Location */}
        <div className='font-poppins flex items-center gap-2 text-sm font-semibold'>
          <Icon
            className='size-[1.5em]! shrink-0 self-start'
            style={{ color: color }}
          />
          {title}
        </div>

        {/* reported at */}
        <div className='flex items-center text-xs gap-2'>
          <IconClock className='size-[1.5em]! shrink-0 self-start' />
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </div>
      </div>

      <p className='text-sm wrap-break-word min-w-0'>{message}</p>
    </div>
  );
}
