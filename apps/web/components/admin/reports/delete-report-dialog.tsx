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
import { useReportDialog } from '@/contexts/report-dialog-context';
import { deleteReport } from '@/lib/actions/report-actions';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';

export default function DeleteReportDialog() {
  const { reportId, isOpen, closeDialog } = useReportDialog();
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useSWRConfig();

  console.log(reportId);

  const handleDelete = async () => {
    if (!reportId) return;
    setIsPending(true);
    try {
      await deleteReport(reportId);
      mutate(SWR_KEYS.reportMapPins);
      mutate(SWR_KEYS.reportDetail(reportId), null);
      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.reportList);
      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.reports);
      closeDialog();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen('delete')} onOpenChange={closeDialog}>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {/* ── Blue Header ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl p-4 shrink-0 text-white'>
          {/* Text */}
          <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
            DELETE REPORT
          </DialogTitle>
        </DialogHeader>

        {/* ── Content Area ── */}
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <div className='flex flex-col p-4 gap-4'>
            <div className='flex items-start gap-4'>
              <div className='flex rounded-full shrink-0 p-3 w-fit bg-[#FB2C36]/10'>
                <IconAlertTriangle className='size-7 shrink-0 text-[#FB2C36]' />
              </div>
              <div className='flex flex-col'>
                <span className='text-base font-bold'>
                  Are you sure you want to delete this report?
                </span>
                <span className='text-sm text-black opacity-50'>
                  This action cannot be undone. The report will be permanently
                  removed from the system.
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
            onClick={handleDelete}
            className='font-poppins flex items-center gap-2  bg-white border-[#FB2C36] text-[#FB2C36] hover:bg-[#FB2C36]/10 hover:text-[#FB2C36]'
          >
            {isPending ? (
              <Spinner />
            ) : (
              <IconTrash className='w-[1.5em]! h-[1.5em]! shrink-0' />
            )}
            <span>{isPending ? 'DELETING...' : 'DELETE REPORT'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
