'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  IconAlertTriangle,
  IconPointFilled,
  IconTrash,
} from '@tabler/icons-react';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { REPORT_COMMENT_STATUS_COLOR_MAP } from '@/lib/utils/get-color-map';

import { useReportedCommentsDialog } from '@/contexts/reported-comments-dialog-context';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DeleteReportedCommentDialog() {
  const { isOpen, closeDialog, reportedComment } = useReportedCommentsDialog();
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useSWRConfig();

  const handleSubmit = async () => {
    setIsPending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      mutate(
        (key) => Array.isArray(key) && key[0] === SWR_KEYS.reportedComments,
      );
      closeDialog();
    } catch {
      toast.error('Failed to delete the report. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const color = reportedComment
    ? REPORT_COMMENT_STATUS_COLOR_MAP[reportedComment?.status]
    : undefined;

  return (
    <Dialog open={isOpen('delete')} onOpenChange={closeDialog}>
      <DialogContent
        className='flex flex-col p-0 overflow-hidden gap-0 border-0
        w-full max-w-full sm:max-w-md
      [&>button]:text-white [&>button]:hover:text-white
        [&>button]:opacity-70 [&>button]:hover:opacity-100'
      >
        {reportedComment && (
          <>
            <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0 text-white'>
              {/* Text */}
              <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
                DELETE REPORTED COMMENT
              </DialogTitle>
            </DialogHeader>

            {/*content area*/}
            <div className='flex-1 flex flex-col items-center gap-4 p-6 min-h-0'>
              <div className='flex rounded-full shrink-0 p-3 w-fit bg-[#FB2C36]/10'>
                <IconAlertTriangle className='size-7 shrink-0 text-[#FB2C36]' />
              </div>

              {/* header */}
              <div className='text-center'>
                <h3 className='text-base font-bold'>
                  Are you sure you want to delete this report?
                </h3>
                <span className='text-sm opacity-50'>
                  This action cannot be undone. The report record will be
                  permanently removed from the system.
                </span>
              </div>

              <div className='flex w-full items-center justify-between rounded-2xl p-3 border gap-3'>
                <div className='flex items-center gap-2 w-auto'>
                  <UIAvatar className='size-6'>
                    <AvatarImage
                      src={
                        reportedComment?.commenter?.profilePicture || undefined
                      }
                    />
                    <AvatarFallback>
                      <Avatar
                        name={`${reportedComment?.commenter?.name} ${reportedComment?.commenter?.id}`}
                        variant='beam'
                      />
                    </AvatarFallback>
                  </UIAvatar>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>
                      {reportedComment?.commenter?.name}
                    </span>
                    <div className='flex items-center gap-1.5 h-4 opacity-50'>
                      <span className='text-xs'>
                        {reportedComment?.commenter?.email}
                      </span>
                      <IconPointFilled className='size-[0.5em]! shrink-0' />
                      <span className='text-xs '>
                        {reportedComment?.reportCount}{' '}
                        {reportedComment?.reportCount === 1
                          ? 'report'
                          : 'reports'}
                      </span>
                    </div>
                  </div>
                </div>

                {/*badge*/}
                <Badge
                  className='text-xs'
                  style={{ backgroundColor: `${color}25`, color }}
                >
                  {reportedComment.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <DialogFooter className='grid grid-cols-2  bg-[#F9F9F9] rounded-t-2xl px-5 py-4 shrink-0'>
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
                className='font-poppins flex items-center gap-2 border-[#FB2C36] bg-white text-[#FB2C36] hover:bg-[#FB2C3610] hover:text-[#FB2C36]'
              >
                {isPending ? (
                  <Spinner />
                ) : (
                  <IconTrash className='size-[1.5em]!' />
                )}
                <span>{isPending ? 'DELETING...' : 'DELETE REPORT'}</span>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
