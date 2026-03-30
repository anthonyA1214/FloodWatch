'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconShield } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SAFETY_TYPE_COLOR_MAP } from '@/lib/utils/get-color-map';
import { useSafetyLocationsDialog } from '@/contexts/safety-locations-dialog-context';
import { format } from 'date-fns';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function EditSafetyLocationDialog() {
  // ✅ USE THE CONTEXT DATA
  const { safetyLocations, isOpen, closeDialog } = useSafetyLocationsDialog();

  // ✅ Local state for form fields
  const [formData, setFormData] = useState({
    location: safetyLocations?.location || '',
    address: safetyLocations?.address || '',
    type: safetyLocations?.type || 'hospital',
    description: safetyLocations?.description || '',
  });

  const [isPending, setIsPending] = useState(false);

  // ✅ If no safety location is selected, don't render anything
  if (!safetyLocations) {
    return (
      <Dialog open={false}>
        <DialogContent />
      </Dialog>
    );
  }

  // ✅ Format the createdAt date
  const createdAt = safetyLocations.createdAt || new Date();
  const formattedTime = format(new Date(createdAt), 'hh:mm a');
  const formattedDate = format(new Date(createdAt), 'MMMM dd, yyyy');

  const safetyTypeColor = SAFETY_TYPE_COLOR_MAP[formData.type] || '#0066CC';

  // ✅ Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Handle save
  const handleSave = async () => {
    setIsPending(true);
    try {
      // TODO: Add your API call here to update the safety location
      // await updateSafetyLocation(safetyLocations.id, formData);
      console.log('Saving:', formData);
      closeDialog();
    } finally {
      setIsPending(false);
    }
  };

  // ✅ Handle cancel
  const handleCancel = () => {
    // Reset form to original data
    setFormData({
      location: safetyLocations?.location || '',
      address: safetyLocations?.address || '',
      type: safetyLocations?.type || 'hospital',
      description: safetyLocations?.description || '',
    });
    closeDialog();
  };

  return (
    <Dialog open={isOpen('edit')} onOpenChange={handleCancel}>
      <DialogContent className='flex flex-col min-w-[50vw] h-[80vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {/* ── Blue Header with Shield Icon ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-6 py-5 shrink-0'>
          {/* ✅ Shield Icon */}
          <div className='flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg'>
            <IconShield className='w-6 h-6 text-white' />
          </div>

          {/* ✅ Text Section */}
          <div className='flex flex-col space-y-0 text-white'>
            <DialogTitle className='font-poppins text-base font-medium'>
              Edit Safety Location
            </DialogTitle>
            <DialogDescription className='text-sm text-blue-100'>
              {formattedDate} {formattedTime}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* ── Content Area (Scrollable) ── */}
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <div className='flex flex-col p-6 gap-6'>
            {/* ── Map and Details Section (Equal Height) ── */}
            <div className='flex gap-6 h-80'>
              {/* ✅ Left Column: Image */}
              <div className='flex-1'>
                <div className='relative w-full h-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100'>
                  {safetyLocations.image ? (
                    <Image
                      src={safetyLocations.image}
                      alt={safetyLocations.location}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <Image
                      src='/no-data-rafiki.svg'
                      alt='No image available'
                      fill
                      className='object-cover opacity-40'
                    />
                  )}
                </div>
              </div>

              {/* ✅ Right Column: Editable Details */}
              <div className='flex-1'>
                <div className='w-full h-full flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl p-6 overflow-y-auto'>
                  {/* ── Location Name ── */}
                  <div className='flex flex-col gap-2'>
                    <label className='font-poppins font-medium text-gray-600 text-xs uppercase'>
                      NAME
                    </label>
                    <Input
                      type='text'
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange('location', e.target.value)
                      }
                      placeholder='Enter location name'
                      className='text-sm'
                    />
                  </div>

                  <Separator className='my-0' />

                  {/* ── Type Dropdown ── */}
                  <div className='flex flex-col gap-2'>
                    <label className='font-poppins font-medium text-gray-600 text-xs uppercase'>
                      TYPE
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange('type', value)
                      }
                    >
                      <SelectTrigger className='text-sm'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='hospital'>Hospital</SelectItem>
                        <SelectItem value='shelter'>Shelter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className='my-0' />

                  {/* ── Address ── */}
                  <div className='flex flex-col gap-2 flex-1 overflow-y-auto'>
                    <label className='font-poppins font-medium text-gray-600 text-xs uppercase'>
                      ADDRESS
                    </label>
                    <Input
                      type='text'
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
                      }
                      placeholder='Enter address'
                      className='text-sm'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Description Section (Full Width) ── */}
            <div className='flex flex-col gap-4'>
              <label className='font-poppins text-sm font-semibold text-gray-800 uppercase'>
                DESCRIPTION
              </label>
              <div className='flex flex-col gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-6'>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Enter description'
                  className='text-sm min-h-32 resize-none'
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer with Action Buttons ── */}
        <DialogFooter className='flex justify-end gap-3 bg-[#F9F9F9] border-t border-gray-200 rounded-t-2xl px-6 py-4 shrink-0'>
          <Button variant='outline' disabled={isPending} onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={isPending} onClick={handleSave}>
            {isPending ? (
              <>
                Saving... <Spinner />
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
