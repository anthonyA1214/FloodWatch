'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ReportedCommentInput } from '@repo/schemas';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { IconArrowsUpDown, IconEye, IconTrash } from '@tabler/icons-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { REPORT_COMMENT_STATUS_COLOR_MAP } from '@/lib/utils/get-color-map';
import { useReportedCommentsDialog } from '@/contexts/reported-comments-dialog-context';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<ReportedCommentInput>[] = [
  {
    accessorKey: 'name',
    header: 'COMMENTER',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className='flex items-center gap-3 w-auto'>
          <UIAvatar className='size-8'>
            <AvatarImage src={user.commenter?.profilePicture || undefined} />
            <AvatarFallback>
              <Avatar
                name={`${user.commenter?.name} ${user.commenter?.id}`}
                variant='beam'
                className='size-8'
              />
            </AvatarFallback>
          </UIAvatar>
          <div className='flex flex-col'>
            <span className='font-medium'>{user.commenter?.name}</span>
            <span className='text-sm text-gray-600'>
              {user.commenter?.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'reportCount',
    header: 'REPORTS',
    cell: ({ row }) => {
      const data = row.original;

      return (
        <span className='text-gray-600'>
          {data.reportCount} {data.reportCount === 1 ? 'report' : 'reports'}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: () => <span className='flex justify-center'>STATUS</span>,
    cell: ({ row }) => {
      const data = row.original;

      const color = REPORT_COMMENT_STATUS_COLOR_MAP[data.status];

      return (
        <div className='flex justify-center w-full'>
          <Badge
            className='text-sm'
            style={{ backgroundColor: `${color}25`, color }}
          >
            {data.status.toUpperCase()}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: () => <span className='flex justify-center'>ACTIONS</span>,
    cell: ({ row }) => {
      const report = row.original;
      return <ActionCell report={report} />;
    },
  },
];

function ActionCell({ report }: { report: ReportedCommentInput }) {
  const { openDialog } = useReportedCommentsDialog();

  return (
    <div className='flex justify-center gap-2'>
      <Tooltip>
        <TooltipTrigger
          className='text-[#0066CC] bg-[#0066CC]/10 rounded-lg p-1.5 hover:bg-[#0066CC]/20 transition'
          onClick={() => openDialog('view', report?.id)}
        >
          <IconEye className='w-[1.5em]! h-[1.5em]!' />
        </TooltipTrigger>
        <TooltipContent>
          <p>View report</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          className={cn(
            `text-[#FB2C36] bg-[#FB2C36]/10 rounded-lg p-1.5 hover:bg-[#FB2C36]/20 transition`,
          )}
          onClick={() => openDialog('delete', report)}
        >
          <IconTrash className='w-[1.5em]! h-[1.5em]!' />
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete report</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
