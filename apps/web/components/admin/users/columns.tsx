'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UsersDto } from '@repo/schemas';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { format, parseISO } from 'date-fns';
import { IconArrowsUpDown, IconBan } from '@tabler/icons-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useUserStatusDialog } from '@/contexts/user-status-dialog-context';

export const columns: ColumnDef<UsersDto>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button
          className='inline-flex gap-2 items-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          USER <IconArrowsUpDown className='w-[1em]! h-[1em]!' />
        </button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className='flex items-center gap-3 w-auto'>
          <UIAvatar className='size-8'>
            <AvatarImage src={user.profilePicture || undefined} />
            <AvatarFallback>
              <Avatar name={`${user.name} ${user.id}`} variant='beam' />
            </AvatarFallback>
          </UIAvatar>
          <div className='flex flex-col'>
            <span className='font-medium'>{user.name}</span>
            <span className='text-sm text-gray-600'>{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'ROLE',
    cell: ({ row }) => {
      const user = row.original;
      const roleColorMap = {
        admin: '#9B32E4',
        user: '#4A5565',
      };

      const color = roleColorMap[user.role];

      return (
        <span className='font-semibold' style={{ color }}>
          {user.role.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: 'joinDate',
    header: 'JOIN DATE',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <span className='text-gray-600'>
          {format(parseISO(user.joinDate), 'MMMM dd, yyyy')}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: () => <span className='flex justify-center'>STATUS</span>,
    cell: ({ row }) => {
      const user = row.original;
      const statusColorMap = {
        active: '#00D69B',
        blocked: '#FB323B',
      };

      const color = statusColorMap[user.status];

      return (
        <div className='flex justify-center w-full'>
          <div
            className='inline-flex items-center rounded-full px-4 py-1.5'
            style={{ backgroundColor: `${color}25`, color }}
          >
            <span className='text-sm font-medium capitalize'>
              {user.status.toUpperCase()}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: () => <span className='flex justify-center'>ACTIONS</span>,
    cell: ({ row }) => {
      const user = row.original;
      return <ActionCell user={user} />;
    },
  },
];

function ActionCell({ user }: { user: UsersDto }) {
  const { openDialog } = useUserStatusDialog();

  const buttonColorMap = {
    active: 'text-[#FB323B] bg-[#FB323B]/10 hover:bg-[#FB323B]/20',
    blocked: 'text-[#00D69B] bg-[#00D69B]/10 hover:bg-[#00D69B]/20',
  };

  const color = buttonColorMap[user.status];

  return (
    <div className='flex justify-center gap-2'>
      <Tooltip>
        <TooltipTrigger
          className={cn(`rounded-lg p-1.5 hover:`, color)}
          onClick={() =>
            openDialog(user.id, user.status === 'active' ? 'block' : 'unblock')
          }
        >
          <IconBan className='w-[1.5em]! h-[1.5em]!' />
        </TooltipTrigger>
        <TooltipContent>
          <p>{user.status === 'active' ? 'Block user' : 'Unblock user'}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
