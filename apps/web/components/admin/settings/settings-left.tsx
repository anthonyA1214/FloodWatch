'use client';

import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useMe } from '@/hooks/use-me';
import SettingsLeftSkeleton from './skeleton/settings-left-skeleton';
import { ProfilePhotoDialog } from './profile-photo-dialog';

export default function SettingsLeft() {
  const { me, isLoading } = useMe();

  if (isLoading) return <SettingsLeftSkeleton />;

  let formatted;
  if (me) {
    formatted = format(new Date(me?.createdAt), 'MMMM d, yyyy');
  }

  return (
    <div className='flex flex-col items-center border-r p-4 gap-8'>
      <div className='relative'>
        <UIAvatar className='size-40 border'>
          <AvatarImage src={me?.profilePicture} />
          <AvatarFallback>
            <Avatar
              name={`${me?.name} ${me?.id}`}
              variant='beam'
              className='size-40'
            />
          </AvatarFallback>
        </UIAvatar>

        {/* Button */}
        <ProfilePhotoDialog />
      </div>

      <div className='flex flex-col text-center'>
        <span className='font-semibold text-2xl'>{me?.name}</span>
        <span className='text-gray-600'>{me?.email}</span>
      </div>

      <Separator />

      <div className='flex flex-col text-center w-full max-w-md text-gray-600 gap-4'>
        <div className='flex justify-between'>
          <span>Member since</span>
          <span className='font-semibold'>{formatted}</span>
        </div>
        {/*<div className='flex justify-between'>
          <span>Post</span>
          <span className='font-semibold'>3</span>
        </div>
        <div className='flex justify-between'>
          <span>Reports Submitted</span>
          <span className='font-semibold'>5</span>
        </div>*/}
      </div>
    </div>
  );
}
