'use client';

import ProfileInformationForm from '../forms/profile-information-form';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import LogoutButton from '@/components/map/logout-button';
import { useState } from 'react';
import { useMe } from '@/hooks/use-me';
import { format } from 'date-fns';
import { Spinner } from '@/components/ui/spinner';
import { ProfilePhotoDialog } from './profile-photo-dialog';

export default function AccountTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { me } = useMe();

  const formatted = me ? format(new Date(me.createdAt), 'MMMM d, yyyy') : '';

  const handleButtonClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const form = document.getElementById(
      'profile-information-form',
    ) as HTMLFormElement | null;

    form?.requestSubmit();
  };

  return (
    <div className='flex flex-col gap-8 md:gap-16 h-full p-4'>
      <div className='flex flex-col gap-8'>
        <h3 className='font-poppins font-semibold'>Profile Information</h3>
        <ProfileInformationForm
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setIsSubmitting={setIsSubmitting}
        />
      </div>

      <div className='flex flex-col gap-8 h-full w-full mt-auto'>
        <div className='flex flex-col w-full mt-auto'>
          <Button
            className='w-full py-6 flex gap-2 justify-center items-center'
            onClick={handleButtonClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span>Saving...</span>
                <Spinner className='size-4' />
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Edit Profile'
            )}
          </Button>
        </div>

        <div className='flex flex-col gap-2 w-full text-xs'>
          <div className='flex justify-between'>
            <span>Member since</span>
            <span>{formatted}</span>
          </div>

          {/*<div className='flex justify-between'>
            <span>Posts</span>
            <span>5</span>
          </div>*/}
        </div>

        <Separator />

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 w-auto'>
            <ProfilePhotoDialog />

            <div className='flex flex-col'>
              <span className='font-medium text-sm'>{me?.name}</span>
              <span className='text-xs text-gray-600'>{me?.email}</span>
            </div>
          </div>

          <LogoutButton />
        </div>

        <div className='md:hidden' />
      </div>
    </div>
  );
}
