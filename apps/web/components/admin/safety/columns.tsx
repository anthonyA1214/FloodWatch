'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SafetyDetailInput } from '@repo/schemas';
import { IconEye, IconTrash, IconEdit } from '@tabler/icons-react'; // ✅ Added IconEdit import
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SAFETY_TYPE_COLOR_MAP } from '@/lib/utils/get-color-map';
import { useSafetyLocationsDialog } from '@/contexts/safety-locations-dialog-context';

export const columns: ColumnDef<SafetyDetailInput>[] = [
  {
    accessorKey: 'location',
    header: 'LOCATION',
    cell: ({ row }) => {
      const safetyLocation = row.original;

      return <span className='font-medium'>{safetyLocation.location}</span>;
    },
  },
  {
    accessorKey: 'address',
    header: 'ADDRESS',
    cell: ({ row }) => {
      const safetyLocation = row.original;

      return <span className='text-gray-600'>{safetyLocation.address}</span>;
    },
  },
  {
    accessorKey: 'type',
    header: () => <span className='flex justify-center'>TYPE</span>,
    cell: ({ row }) => {
      const safetyLocation = row.original;

      const color = SAFETY_TYPE_COLOR_MAP[safetyLocation.type];

      return (
        <div className='flex justify-center w-full'>
          <div
            className='inline-flex items-center rounded-full px-4 py-1.5'
            style={{ backgroundColor: `${color}25`, color }}
          >
            <span className='text-sm font-medium capitalize'>
              {safetyLocation.type.toUpperCase()}
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
      const safetyLocation = row.original;
      return <ActionCell safetyLocation={safetyLocation} />;
    },
  },
];

function ActionCell({ safetyLocation }: { safetyLocation: SafetyDetailInput }) {
  // ✅ Get the openDialog function from context
  const { openDialog } = useSafetyLocationsDialog();

  return (
    <div className='flex justify-center gap-2'>
      {/* ✅ NEW EDIT BUTTON - ADDED ON THE LEFT */}
      <Tooltip>
        <TooltipTrigger
          // ✅ Purple color styling for the edit button
          className='text-[#7C3AED] bg-[#7C3AED]/10 rounded-lg p-1.5 hover:bg-[#7C3AED]/20 transition'
          // ✅ Trigger the dialog in 'edit' mode when clicked
          onClick={() => openDialog('edit', safetyLocation)}
        >
          {/* ✅ IconEdit icon from tabler */}
          <IconEdit className='w-[1.5em]! h-[1.5em]!' />
        </TooltipTrigger>
        {/* ✅ Tooltip text that appears on hover */}
        <TooltipContent>
          <p>Edit safety location</p>
        </TooltipContent>
      </Tooltip>

      {/* ✅ VIEW BUTTON - EXISTING (moved to the middle) */}
      <Tooltip>
        <TooltipTrigger
          // ✅ Blue color styling for the view button
          className='text-[#0066CC] bg-[#0066CC]/10 rounded-lg p-1.5 hover:bg-[#0066CC]/20 transition'
          // ✅ Trigger the dialog in 'view' mode when clicked
          onClick={() => openDialog('view', safetyLocation)}
        >
          {/* ✅ IconEye icon from tabler */}
          <IconEye className='w-[1.5em]! h-[1.5em]!' />
        </TooltipTrigger>
        {/* ✅ Tooltip text that appears on hover */}
        <TooltipContent>
          <p>View safety location</p>
        </TooltipContent>
      </Tooltip>

      {/* ✅ DELETE BUTTON - EXISTING (moved to the right) */}
      <Tooltip>
        <TooltipTrigger
          // ✅ Red color styling for the delete button
          className={cn(
            `text-[#FB323B] bg-[#FB323B]/10 rounded-lg p-1.5 hover:bg-[#FB323B]/20 transition`,
          )}
          // ✅ Trigger the dialog in 'delete' mode when clicked
          onClick={() => openDialog('delete', safetyLocation)}
        >
          {/* ✅ IconTrash icon from tabler */}
          <IconTrash className='w-[1.5em]! h-[1.5em]!' />
        </TooltipTrigger>
        {/* ✅ Tooltip text that appears on hover */}
        <TooltipContent>
          <p>Delete safety location</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
