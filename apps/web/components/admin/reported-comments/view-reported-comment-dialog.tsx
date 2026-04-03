'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconAlertTriangle, IconBan, IconX } from '@tabler/icons-react';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { Separator } from '@/components/ui/separator';
import {
  REASON_COLORS,
  REPORT_COMMENT_STATUS_COLOR_MAP,
} from '@/lib/utils/get-color-map';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { useReportedCommentsDialog } from '@/contexts/reported-comments-dialog-context';
import CommentPreview from '@/components/shared/comment-preview';
import { useReportedCommentDetail } from '@/hooks/use-reported-comment-detail';
import ReporterReasonBreakdown from './reporter-reason-breakdown';
import {
  ACTION_TAKEN_LABELS,
  REASON_LABELS,
} from '@/lib/utils/get-reason-labels';
import ReportedCommentsDialogSkeleton from './skeleton/reported-comments-dialog-skeleton';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { cn } from '@/lib/utils';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { Badge } from '@/components/ui/badge';

export default function ViewReportedCommentDialog() {
  const { commentId, isOpen, closeDialog } = useReportedCommentsDialog();
  const { reportedComment, isLoading, mutateReportedComment } =
    useReportedCommentDetail(commentId);
  const [pendingAction, setPendingAction] = useState<
    'warn' | 'block' | 'dismiss' | null
  >(null);
  const { mutate } = useSWRConfig();

  const handleAction = async (action: 'warn' | 'block' | 'dismiss') => {
    setPendingAction(action);
    try {
      await apiFetchClient(`/comments/reports/${commentId}/action`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      mutateReportedComment();
      mutate(
        (key) => Array.isArray(key) && key[0] === SWR_KEYS.reportedComments,
      );
      closeDialog();
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setPendingAction(null);
    }
  };

  const color = reportedComment
    ? REPORT_COMMENT_STATUS_COLOR_MAP[reportedComment.status]
    : undefined;

  return (
    <Dialog open={isOpen('view')} onOpenChange={closeDialog}>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {isLoading ? (
          <>
            <VisuallyHidden>
              <DialogTitle>Reported Comment</DialogTitle>
            </VisuallyHidden>
            <ReportedCommentsDialogSkeleton />
          </>
        ) : (
          reportedComment && (
            <>
              {/* ── Blue Header ── */}
              <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0 text-white'>
                {/* Text */}
                <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
                  REPORTED COMMENT
                </DialogTitle>
              </DialogHeader>

              {/* ── Content Area ── */}
              <div className='flex-1 min-h-0 overflow-y-auto'>
                <div className='flex flex-col p-4 gap-4'>
                  <div className='flex w-full justify-between'>
                    {/*commenter*/}
                    <div className='flex flex-col gap-2'>
                      <span className='font-poppins font-semibold text-gray-600 text-base'>
                        REPORTED USER
                      </span>

                      <div className='flex items-center gap-3 w-auto'>
                        <UIAvatar className='size-8'>
                          <AvatarImage
                            src={
                              reportedComment?.commenter?.profilePicture ||
                              undefined
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
                          <span className='font-medium'>
                            {reportedComment?.commenter?.name}
                          </span>
                          <span className='text-sm text-gray-600'>
                            {reportedComment?.commenter?.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/*badge*/}
                    <Badge
                      className='font-poppins h-fit text-sm'
                      style={{ backgroundColor: `${color}25`, color }}
                    >
                      {reportedComment.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/*comment content*/}
                  <div className='flex flex-col gap-2'>
                    <span className='font-poppins font-semibold text-gray-600 text-base'>
                      REPORTED COMMENT
                    </span>
                    <CommentPreview comment={reportedComment?.comment} />
                  </div>

                  {/*report summary*/}
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2 h-4'>
                      <span className='font-poppins font-semibold text-gray-600 text-base'>
                        REPORT SUMMARY
                      </span>
                      <Separator orientation='vertical' />
                      <span className='font-poppins font-semibold text-gray-600 text-base'>
                        {reportedComment?.reportCount}{' '}
                        <span className='font-medium'>TOTAL</span>
                      </span>
                    </div>
                    <ReporterReasonBreakdown
                      reporters={reportedComment?.reporters}
                    />
                  </div>

                  {/*reporters*/}
                  <div className='flex flex-col gap-2'>
                    <span className='font-poppins font-semibold text-gray-600 text-base'>
                      REPORTERS
                    </span>
                    <div className='flex flex-col gap-3 max-h-56 overflow-y-auto p-2'>
                      {reportedComment?.reporters.map((reporter, index) => (
                        <div key={reporter.id} className='flex flex-col gap-2'>
                          {index !== 0 && <Separator />}

                          {/* top row: avatar + info + badge */}
                          <div className='flex w-full justify-between gap-3'>
                            <div className='flex items-center gap-2 w-auto'>
                              <UIAvatar className='size-6'>
                                <AvatarImage
                                  src={reporter?.profilePicture || undefined}
                                />
                                <AvatarFallback>
                                  <Avatar
                                    name={`${reporter?.name} ${reporter?.id}`}
                                    variant='beam'
                                  />
                                </AvatarFallback>
                              </UIAvatar>
                              <div className='flex flex-col'>
                                <span className='text-sm font-medium'>
                                  {reporter?.name}
                                </span>
                                {reporter?.createdAt && (
                                  <span className='text-xs text-gray-600'>
                                    {format(reporter.createdAt, 'PPP p')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge
                              className='font-poppins h-fit text-xs'
                              style={{
                                backgroundColor: `${REASON_COLORS[reporter?.reason]}25`,
                                color: REASON_COLORS[reporter?.reason],
                              }}
                            >
                              {REASON_LABELS[reporter?.reason].toUpperCase()}
                            </Badge>
                          </div>

                          {reporter?.description && (
                            <span className='text-sm italic'>
                              &quot;{reporter.description}&quot;
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {reportedComment?.status === 'pending' ? (
                <DialogFooter className='grid grid-cols-3  bg-[#F9F9F9] rounded-t-2xl px-5 py-4 shrink-0'>
                  <Button
                    variant='outline'
                    disabled={!!pendingAction}
                    onClick={() => handleAction('warn')}
                    className='font-poppins flex items-center gap-2 border-[#F0B204] bg-white text-[#F0B204] hover:bg-[#F0B20410] hover:text-[#F0B204]'
                  >
                    {pendingAction === 'warn' ? (
                      <Spinner />
                    ) : (
                      <IconAlertTriangle className='w-[1.5em]! h-[1.5em]!' />
                    )}
                    <span>
                      {pendingAction === 'warn' ? 'WARNING...' : 'WARN USER'}
                    </span>
                  </Button>
                  <Button
                    variant='outline'
                    disabled={!!pendingAction}
                    onClick={() => handleAction('block')}
                    className='font-poppins flex items-center gap-2 border-[#FB2C36] bg-white text-[#FB2C36] hover:bg-[#FB2C3610] hover:text-[#FB2C36]'
                  >
                    {pendingAction === 'block' ? (
                      <Spinner />
                    ) : (
                      <IconBan className='w-[1.5em]! h-[1.5em]!' />
                    )}
                    <span>
                      {pendingAction === 'block' ? 'BLOCKING...' : 'BLOCK USER'}
                    </span>
                  </Button>
                  <Button
                    variant='outline'
                    disabled={!!pendingAction}
                    onClick={() => handleAction('dismiss')}
                    className='font-poppins flex items-center gap-2 border-[#6B7280] bg-white text-[#6B7280] hover:bg-[#6B728010] hover:text-[#6B7280]'
                  >
                    {pendingAction === 'dismiss' ? (
                      <Spinner />
                    ) : (
                      <IconX className='w-[1.5em]! h-[1.5em]!' />
                    )}
                    <span>
                      {pendingAction === 'dismiss'
                        ? 'DISMISSING...'
                        : 'DISMISS'}
                    </span>
                  </Button>
                </DialogFooter>
              ) : reportedComment?.status === 'resolved' ||
                reportedComment?.status === 'dismissed' ? (
                <DialogFooter className='flex w-full bg-[#F9F9F9] rounded-t-2xl p-4 shrink-0'>
                  <div className='flex w-full justify-between'>
                    <div className='flex flex-col gap-2'>
                      <span className='font-poppins font-semibold text-gray-600 text-sm'>
                        REVIEWED BY
                      </span>
                      <div className='flex items-center gap-2 w-auto'>
                        <UIAvatar className='size-6'>
                          <AvatarImage
                            src={
                              reportedComment?.reviewer?.profilePicture ||
                              undefined
                            }
                          />
                          <AvatarFallback>
                            <Avatar
                              name={`${reportedComment?.reviewer?.name} ${reportedComment?.reviewer?.id}`}
                              variant='beam'
                            />
                          </AvatarFallback>
                        </UIAvatar>
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>
                            {reportedComment?.reviewer?.name}
                          </span>
                          {reportedComment?.reviewedAt && (
                            <span className='text-xs text-gray-600'>
                              {format(reportedComment?.reviewedAt, 'PPP p')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <span className='font-poppins font-semibold text-gray-600 text-sm'>
                        ACTION TAKEN
                      </span>
                      <span
                        className={cn(
                          'font-poppins text-sm font-medium',
                          reportedComment?.actionTaken === 'dismiss'
                            ? 'text-[#6B7280]'
                            : reportedComment?.actionTaken === 'block'
                              ? 'text-[#FB2C36]'
                              : reportedComment?.actionTaken === 'warn'
                                ? 'text-[#F0B204]'
                                : '',
                        )}
                      >
                        {ACTION_TAKEN_LABELS[
                          reportedComment.actionTaken
                        ].toUpperCase()}
                      </span>
                    </div>
                  </div>
                </DialogFooter>
              ) : null}
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
