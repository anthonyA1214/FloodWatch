'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CommentInput } from '@repo/schemas';
import DeleteCommentPreview from './delete-comment-preview';
import { IconTrash } from '@tabler/icons-react';
import { Spinner } from '../ui/spinner';
import { useEffect, useState } from 'react';

export default function DeleteCommentDialog({
  open,
  comment,
  onClose,
  onConfirm,
}: {
  open: boolean;
  comment?: CommentInput | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [activeComment, setActiveComment] = useState(comment);

  useEffect(() => {
    if (open) {
      setActiveComment(comment); // set when opening
    }
    // don't clear on close — let it persist through the animation
  }, [open, comment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsPending(true);
    try {
      await onConfirm();
    } catch {
      // errors are handled by the caller (CommentsList)
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className='flex flex-col p-0 overflow-hidden gap-0 border-0
        w-full max-w-full sm:max-w-md
      [&>button]:text-white [&>button]:hover:text-white
        [&>button]:opacity-70 [&>button]:hover:opacity-100'
      >
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0 text-white'>
          {/* Text */}
          <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
            DELETE COMMENT
          </DialogTitle>
        </DialogHeader>

        {/* body */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 gap-4 sm:gap-6 min-h-0 overflow-y-auto'>
          {/* header */}
          <div>
            <h3 className='text-base sm:text-lg font-bold'>
              Are you sure you want to delete this comment?
            </h3>
            <span className='text-xs sm:text-sm opacity-50'>
              This action is permanent and cannot be undone.
            </span>
          </div>

          <DeleteCommentPreview comment={activeComment as CommentInput} />

          {/* buttons */}
          <div className='flex-1 flex gap-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 flex items-center gap-1.5 sm:gap-2 justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs sm:text-sm py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg font-medium transition-colors disabled:opacity-50'
            >
              <span>CANCEL</span>
            </button>

            <button
              type='button'
              onClick={handleSubmit}
              disabled={isPending}
              className='flex-1 flex items-center gap-1.5 sm:gap-2 justify-center bg-destructive hover:bg-destructive/90 text-white text-xs sm:text-sm py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg font-medium transition-colors disabled:opacity-50'
            >
              {isPending ? (
                <>
                  <Spinner />
                  <span>DELETING...</span>
                </>
              ) : (
                <>
                  <IconTrash className='w-[1em]! h-[1em]!' />
                  <span className='sm:hidden'>DELETE</span>
                  <span className='hidden sm:inline'>DELETE COMMENT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
