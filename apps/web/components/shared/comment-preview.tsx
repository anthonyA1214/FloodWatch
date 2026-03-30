import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { IconClock } from '@tabler/icons-react';
import Avatar from 'boring-avatars';
import Image from 'next/image';
import { format } from 'date-fns';
import { CommentPreviewInput } from '@repo/schemas';

export default function CommentPreview({
  comment,
}: {
  comment: CommentPreviewInput;
}) {
  const formattedTime = comment?.createdAt
    ? format(comment?.createdAt, 'hh:mm a')
    : '';
  const formattedDate = comment?.createdAt
    ? format(comment?.createdAt, 'MMMM dd, yyyy')
    : '';

  return (
    <div className='flex flex-col rounded-2xl p-3 border gap-3'>
      {/* 1st */}
      <div className='flex gap-2 items-center'>
        <UIAvatar className='size-8 rounded-full shrink-0'>
          <AvatarImage src={comment?.author?.profilePicture ?? undefined} />
          <AvatarFallback>
            <Avatar
              name={`${comment?.author?.name} ${comment?.author?.id}`}
              variant='beam'
              className='size-8'
            />
          </AvatarFallback>
        </UIAvatar>

        <div className='flex flex-col w-full'>
          <div className='flex justify-between w-full items-center'>
            <span className='font-semibold text-sm truncate'>
              {comment?.author?.name}
            </span>
          </div>
          <div className='flex items-center gap-1 text-xs text-gray-600'>
            <IconClock className='w-[1.5em]! h-[1.5em]!' />
            <span>
              {formattedDate}, {formattedTime}
            </span>
          </div>
        </div>
      </div>
      <div className='min-w-0'>
        <p className='text-sm'>{comment?.content}</p>
      </div>
      {comment?.image && (
        <div className='aspect-video w-full relative bg-muted shrink-0 rounded-lg overflow-hidden'>
          <Image
            src={comment?.image}
            alt='Post Image'
            fill
            className='object-cover'
          />
        </div>
      )}
    </div>
  );
}
