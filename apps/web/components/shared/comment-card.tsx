import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  IconClock,
  IconDots,
  IconEdit,
  IconFlag,
  IconTrash,
} from '@tabler/icons-react';
import Avatar from 'boring-avatars';
import { format } from 'date-fns';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMe } from '@/hooks/use-me';

interface CommentCardProps {
  author: {
    id: number | undefined;
    name: string;
    profilePicture?: string;
  };
  content: string;
  image?: string;
  timestamp: Date;
  reportCount: number;
  hasReported?: boolean;
  isAdmin?: boolean;
  isOwner?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onReportClick?: () => void;
}

export default function CommentCard({
  author,
  content,
  image,
  timestamp,
  reportCount,
  hasReported = false,
  isAdmin = false,
  isOwner = false,
  onEditClick,
  onDeleteClick,
  onReportClick,
}: CommentCardProps) {
  const formattedTime = timestamp ? format(timestamp, 'hh:mm a') : '';
  const formattedDate = timestamp ? format(timestamp, 'MMMM dd, yyyy') : '';

  const { me } = useMe();

  return (
    <div className='flex flex-col rounded-2xl p-3 sm:p-4 border gap-3 sm:gap-4'>
      {/* 1st */}
      <div className='flex gap-2 items-center'>
        <UIAvatar className='size-8 sm:size-10 rounded-full shrink-0'>
          <AvatarImage src={author.profilePicture} />
          <AvatarFallback>
            <Avatar
              name={`${author.name} ${author.id}`}
              variant='beam'
              className='size-8 sm:size-10'
            />
          </AvatarFallback>
        </UIAvatar>

        <div className='flex flex-col w-full'>
          <div className='flex justify-between w-full items-center'>
            <span className='font-semibold text-sm sm:text-base truncate'>
              {author.name}
            </span>

            <div className='flex items-center gap-2'>
              {isAdmin && reportCount > 0 && (
                <span className='flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-0.5'>
                  <IconFlag className='w-[1.5em]! h-[1.5em]! shrink-0' />
                  {reportCount} {reportCount === 1 ? 'report' : 'reports'}
                </span>
              )}

              {me && (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className='rounded-full hover:bg-gray-100 data-[state=open]:bg-gray-100 p-1.5 sm:p-2 transition text-xs'>
                      <IconDots className='w-[1.5em]! h-[1.5em]!' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {isOwner && (
                      <DropdownMenuItem onClick={onEditClick}>
                        <IconEdit className='w-[1.5em]! h-[1.5em]!' />
                        <span className='font-poppins'>Edit Comment</span>
                      </DropdownMenuItem>
                    )}
                    {!isOwner && (
                      <DropdownMenuItem
                        onClick={!hasReported ? onReportClick : undefined}
                        disabled={hasReported}
                        className={hasReported ? 'text-muted-foreground' : ''}
                      >
                        <IconFlag className='w-[1.5em]! h-[1.5em]!' />
                        <span className='font-poppins'>
                          {hasReported ? 'Reported' : 'Report Comment'}
                        </span>
                      </DropdownMenuItem>
                    )}

                    {(isAdmin || isOwner) && (
                      <DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant='destructive'
                          onClick={onDeleteClick}
                        >
                          <IconTrash className='w-[1.5em]! h-[1.5em]!' />
                          <span className='font-poppins'>Delete Comment</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
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
        <p className='text-sm'>{content}</p>
      </div>
      {image && (
        <div className='aspect-video w-full relative bg-muted shrink-0 rounded-lg overflow-hidden'>
          <Image src={image} alt='Post Image' fill className='object-cover' />
        </div>
      )}
    </div>
  );
}
