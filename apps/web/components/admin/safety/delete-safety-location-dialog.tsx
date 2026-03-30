'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useSafetyLocationsDialog } from '@/contexts/safety-locations-dialog-context';
import { useState } from 'react';

export default function DeleteSafetyLocationDialog() {
  const { safetyLocations, isOpen, closeDialog } = useSafetyLocationsDialog();
  const [isPending, setIsPending] = useState(false);

  // ✅ If no safety location is selected, don't render anything
  if (!safetyLocations) {
    return (
      <Dialog open={false}>
        <DialogContent />
      </Dialog>
    );
  }

  // ✅ Handle delete (static for now)
  const handleDelete = async () => {
    setIsPending(true);
    try {
      // TODO: Add your API call here to delete the safety location
      // await deleteSafetyLocation(safetyLocations.id);
      console.log('Deleting safety location:', safetyLocations.id);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      closeDialog();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen('delete')} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Safety Location</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className='font-semibold text-gray-900'>
              {safetyLocations.location}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button
            type='submit'
            disabled={isPending}
            onClick={handleDelete}
            className='flex items-center gap-2 '
          >
            {isPending ? (
              <>
                Deleting... <Spinner />
              </>
            ) : (
              'Delete Safety Location'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
