'use client';

import { IconCheck, IconClock, IconPhoto, IconX } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import Avatar from 'boring-avatars';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface CommentEditForm {
  author: {
    id: number | undefined;
    name: string;
    profilePicture?: string;
  };
  initialContent: string;
  initialImage?: string;
  timestamp: Date;
  onSave: (
    content: string,
    image: File | null,
    removeImage: boolean,
  ) => Promise<void>;
  onCancel: () => void;
}

export default function CommentEditForm({
  author,
  initialContent,
  initialImage,
  timestamp,
  onSave,
  onCancel,
}: CommentEditForm) {
  const formattedTime = format(timestamp, 'hh:mm a');
  const formattedDate = format(timestamp, 'MMMM dd, yyyy');

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImage ?? null);
  const [content, setContent] = useState(initialContent);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, setIsPending] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImage(null);
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.warning('Please select a valid image file.');
      e.target.value = ''; // reset input
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('File size must be less than 5MB.');
      e.target.value = '';
      return;
    }

    if (preview && preview !== initialImage) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (preview && preview !== initialImage) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setRemoveImage(true);
  };

  const handleSubmit = async () => {
    if (!content && !image && !initialImage) {
      toast.error('Please enter content or add an image.');
      return;
    }

    try {
      setIsPending(true);
      await onSave(content, image, removeImage);
    } catch {
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className='flex flex-col gap-3 sm:gap-4 rounded-2xl p-3 sm:p-4 md:p-5 border'>
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
          </div>
          <div className='flex items-center gap-1 text-xs text-gray-600'>
            <IconClock className='w-[1.5em]! h-[1.5em]!' />
            <span>
              {formattedDate}, {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* textarea */}
      <Textarea
        id='content'
        name='content'
        placeholder='Share an update with the community...'
        className='min-h-[100px] sm:min-h-[130px] md:min-h-[150px] max-h-[150px] sm:max-h-[180px] bg-gray-100 text-sm'
        style={{ wordBreak: 'break-word' }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* image preview */}
      {preview && (
        <div className='relative w-fit'>
          {/* group only wraps the image + overlay */}
          <div className='relative group'>
            <Image
              src={preview}
              alt='Preview'
              width={320}
              height={180}
              unoptimized
              className='rounded-lg object-cover border max-h-48 w-auto'
            />
            {/* overlay */}
            <div
              className='absolute inset-0 bg-black/50
                top-0 left-0 flex flex-col gap-1 items-center
                justify-center text-white opacity-0 cursor-pointer
                group-hover:opacity-100 transition-opacity rounded-lg'
              onClick={() => fileInputRef.current?.click()}
            >
              <IconPhoto className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins font-medium text-sm'>REPLACE</span>
            </div>
          </div>

          {/* X button outside the group */}
          <button
            type='button'
            onClick={handleRemoveImage}
            className='absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-0.5 hover:bg-gray-700 z-10'
          >
            <IconX className='size-3.5' />
          </button>
        </div>
      )}

      {/* hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleImageChange}
        className='hidden'
      />

      {/* buttons */}
      <div className='flex justify-end gap-4'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          disabled={isPending}
          className='text-xs sm:text-sm'
          onClick={onCancel}
        >
          <span className='font-poppins'>CANCEL</span>
        </Button>
        <Button
          type='button'
          variant='outline'
          disabled={isPending}
          className='text-xs sm:text-sm'
          onClick={() => fileInputRef.current?.click()}
        >
          <IconPhoto />
          <span className='font-poppins'>
            {preview ? 'CHANGE IMAGE' : 'ADD IMAGE'}
          </span>
        </Button>
        <Button
          disabled={isPending}
          className='text-xs sm:text-sm'
          onClick={handleSubmit}
        >
          {isPending ? (
            <>
              <Spinner />
              <span className='font-poppins'>SAVING...</span>
            </>
          ) : (
            <>
              <IconCheck className='w-[1.5em]! h-[1.5em]!' />
              <span className='font-poppins'>SAVE</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
