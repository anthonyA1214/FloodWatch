'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InteractiveMapPinLocation, {
  InteractiveMapHandle,
} from './interactive-map-pin-location';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  IconCurrentLocation,
  IconMinus,
  IconPhoto,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { createSafetyLocationSchema } from '@repo/schemas';
import { z } from 'zod';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { useSWRConfig } from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import Image from 'next/image';

export default function CreateSafetyLocationDialog() {
  const interactiveMapRef = useRef<InteractiveMapHandle>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // errors
  const [state, setState] = useState<{
    status: 'error' | 'success' | null;
    errors: Record<string, string[]> | null;
  }>({
    status: null,
    errors: null,
  });

  // form data
  const [formData, setFormData] = useState<{
    locationName: string;
    address: string;
    availability: string;
    contactNumber: string;
    type: 'shelter' | 'hospital';
    description: string;
    image: File | null;
    location: { longitude: number; latitude: number } | null;
  }>({
    locationName: '',
    address: '',
    availability: '',
    contactNumber: '',
    type: 'shelter',
    description: '',
    image: null,
    location: null,
  });

  const resetForm = () => {
    setPreview(null);
    setFormData({
      locationName: '',
      address: '',
      availability: '',
      contactNumber: '',
      type: 'shelter',
      description: '',
      image: null,
      location: null,
    });
    setState({ status: null, errors: null });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setState((prev) => ({
      ...prev,
      errors: prev.errors ? { ...prev.errors, [name]: [] } : null,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setState((prev) => ({
      ...prev,
      errors: prev.errors ? { ...prev.errors, [name]: [] } : null,
    }));
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      await interactiveMapRef.current?.geolocate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({ ...prev, image: null }));
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
      e.target.value = ''; // reset input
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData?.location)
      return toast.error('Location is required to create a safety location.');

    const parsedData = createSafetyLocationSchema.safeParse({
      latitude: formData.location!.latitude,
      longitude: formData.location!.longitude,
      locationName: formData.locationName,
      address: formData.address,
      availability: formData.availability,
      contactNumber: formData.contactNumber,
      type: formData.type,
      description: formData.description,
    });

    if (!parsedData.success) {
      setState({
        status: 'error',
        errors: z.flattenError(parsedData.error).fieldErrors,
      });
      return;
    }

    const {
      latitude,
      longitude,
      description,
      type,
      locationName,
      address,
      availability,
      contactNumber,
    } = parsedData.data;

    const form = new FormData();
    form.append('latitude', latitude.toString());
    form.append('longitude', longitude.toString());
    form.append('locationName', locationName);
    form.append('address', address);
    form.append('type', type);
    if (availability) form.append('availability', availability);
    if (contactNumber) form.append('contactNumber', contactNumber);
    if (description) form.append('description', description);
    if (formData.image) form.append('image', formData.image);

    try {
      setIsPending(true);
      await apiFetchClient('/safety/create', {
        method: 'POST',
        body: form,
      });
      setState({ status: 'success', errors: null });
      toast.success('Safety location created successfully!');
      resetForm();
      mutate(SWR_KEYS.safetyLocationMapPins);
      mutate(
        (key) => Array.isArray(key) && key[0] === SWR_KEYS.safetyLocations,
      );
      mutate(
        (key) => Array.isArray(key) && key[0] === SWR_KEYS.safetyLocationList,
      );
      setOpen(false);
    } catch (err) {
      console.error('Failed to create safety location:', err);
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={() => handleOpenChange(!open)}>
      <DialogTrigger asChild>
        <Button className='font-poppins py-6'>CREATE FLOOD ALERT</Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {/* ── Blue Header ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0 text-white'>
          {/* Text */}
          <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
            CREATE FLOOD ALERT
          </DialogTitle>
        </DialogHeader>

        {/* ── Content Area ── */}

        <DialogFooter className='grid grid-cols-2  bg-[#F9F9F9] rounded-t-2xl p-4 shrink-0'>
          <Button
            variant='ghost'
            onClick={() => setOpen(false)}
            className='font-poppins'
          >
            <span>CANCEL</span>
          </Button>
          <Button
            variant='outline'
            disabled={isPending}
            onClick={handleSubmit}
            className='font-poppins flex items-center gap-2 border-[#0066CC] bg-white text-[#0066CC] hover:bg-[#0066CC10] hover:text-[#0066CC]'
          >
            {isPending ? (
              <Spinner />
            ) : (
              <IconPlus className='size-[1.5em]! shrink-0' />
            )}
            <span>{isPending ? 'CREATING...' : 'CREATE SAFETY LOCATION'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
