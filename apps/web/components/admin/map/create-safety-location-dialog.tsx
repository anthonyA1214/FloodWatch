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
    } catch {
      toast.error('Failed to create safety location. Please try again.');
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
        <Button className='font-poppins py-6'>CREATE SAFETY LOCATION</Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {/* ── Blue Header ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0 text-white'>
          {/* Text */}
          <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
            CREATE SAFETY LOCATION
          </DialogTitle>
        </DialogHeader>

        {/* ── Content Area ── */}
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <div className='flex flex-col p-4 gap-4'>
            {/**/}
            <div className='flex items-center justify-between'>
              <span className='font-poppins text-sm font-medium text-gray-600'>
                PIN LOCATION ON MAP
              </span>
              <button
                className='font-poppins text-xs flex gap-2 border px-3 py-1.5 rounded-lg items-center hover:bg-gray-100'
                onClick={handleUseCurrentLocation}
              >
                {loadingLocation ? (
                  <>
                    <Spinner />
                    <span>GETTING YOUR LOCATION...</span>
                  </>
                ) : (
                  <>
                    <IconCurrentLocation className='size-[1.5em]! shrink-0' />
                    <span>USE MY CURRENT LOCATION</span>
                  </>
                )}
              </button>
            </div>
            {/*interactive map*/}
            <div className='relative flex-1 flex aspect-video rounded-2xl overflow-hidden border h-fit'>
              <InteractiveMapPinLocation
                ref={interactiveMapRef}
                variant='safety'
                type={formData.type}
                onLocationSelect={(location) =>
                  setFormData((prev) => ({ ...prev, location }))
                }
              />
              {/*map controls*/}
              <div className='absolute flex flex-col top-4 left-4 z-1 w-fit gap-2 h-fit'>
                <div className='flex flex-col bg-white/80 rounded-md shadow-lg p-0.5 text-xs'>
                  <button
                    onClick={() => interactiveMapRef.current?.zoomIn()}
                    className='aspect-square hover:bg-gray-200 rounded-md p-1'
                    title='Zoom In'
                  >
                    <IconPlus
                      className='w-[1.5em]! h-[1.5em]!'
                      strokeWidth={1.5}
                    />
                  </button>
                  <button
                    onClick={() => interactiveMapRef.current?.zoomOut()}
                    className='aspect-square hover:bg-gray-200 rounded-md p-1'
                    title='Zoom Out'
                  >
                    <IconMinus
                      className='w-[1.5em]! h-[1.5em]!'
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>
              {/*  */}
            </div>

            {/* latitude and longitude */}
            <div className='grid grid-cols-2 gap-2'>
              {/*latitude*/}
              <Field data-invalid={!!state.errors?.latitude?.length}>
                <FieldLabel
                  htmlFor='latitude'
                  className='font-poppins text-sm font-medium'
                >
                  LATITUDE
                </FieldLabel>
                <Input
                  id='latitude'
                  name='latitude'
                  type='latitude'
                  placeholder='--'
                  value={formData.location?.latitude ?? ''}
                  readOnly
                  onChange={handleChange}
                  aria-invalid={!!state.errors?.latitude?.length}
                />

                {state.errors?.latitude && (
                  <FieldError>{state.errors.latitude[0]}</FieldError>
                )}
              </Field>

              {/*longitude*/}
              <Field data-invalid={!!state.errors?.longitude?.length}>
                <FieldLabel
                  htmlFor='longitude'
                  className='font-poppins text-sm font-medium'
                >
                  LONGITUDE
                </FieldLabel>
                <Input
                  id='longitude'
                  name='longitude'
                  type='longitude'
                  placeholder='--'
                  value={formData.location?.longitude ?? ''}
                  readOnly
                  onChange={handleChange}
                  aria-invalid={!!state.errors?.longitude?.length}
                />

                {state.errors?.longitude && (
                  <FieldError>{state.errors.longitude[0]}</FieldError>
                )}
              </Field>
            </div>

            {/*location name*/}
            <Field data-invalid={!!state.errors?.locationName?.length}>
              <FieldLabel
                htmlFor='locationName'
                className='font-poppins text-sm font-medium'
              >
                LOCATION NAME
              </FieldLabel>
              <Input
                id='locationName'
                name='locationName'
                type='text'
                placeholder='e.g., Riverside Park'
                value={formData.locationName}
                onChange={handleChange}
                aria-invalid={!!state.errors?.locationName?.length}
              />

              {state.errors?.locationName && (
                <FieldError>{state.errors.locationName[0]}</FieldError>
              )}
            </Field>

            {/*safety type and availability*/}
            <div className='grid grid-cols-2 gap-2'>
              {/*safety type*/}
              <Field data-invalid={!!state.errors?.type?.length}>
                <FieldLabel
                  htmlFor='type'
                  className='font-poppins text-sm font-medium'
                >
                  SAFETY LOCATION TYPE
                </FieldLabel>
                <Select
                  name='type'
                  value={formData.type}
                  onValueChange={handleSelectChange('type')}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Safety Location Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Safety Location Type</SelectLabel>
                      <SelectItem value='shelter'>Shelter</SelectItem>
                      <SelectItem value='hospital'>Hospital</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {state.errors?.type && (
                  <FieldError>{state.errors.type[0]}</FieldError>
                )}
              </Field>

              {/*availability*/}
              <Field data-invalid={!!state.errors?.availability?.length}>
                <FieldLabel
                  htmlFor='availability'
                  className='font-poppins text-sm font-medium'
                >
                  AVAILABILITY
                  <span className='font-inter text-xs opacity-50'>
                    (Optional)
                  </span>
                </FieldLabel>
                <Input
                  id='availability'
                  name='availability'
                  type='text'
                  placeholder='e.g., 24/7, 9am-5pm'
                  value={formData.availability}
                  onChange={handleChange}
                  aria-invalid={!!state.errors?.availability?.length}
                />

                {state.errors?.availability && (
                  <FieldError>{state.errors.availability[0]}</FieldError>
                )}
              </Field>
            </div>

            {/*contact number*/}
            <Field data-invalid={!!state.errors?.contactNumber?.length}>
              <FieldLabel
                htmlFor='contactNumber'
                className='font-poppins text-sm font-medium'
              >
                CONTACT NUMBER
              </FieldLabel>
              <Input
                id='contactNumber'
                name='contactNumber'
                type='text'
                placeholder='e.g., +1 234 567 8900'
                maxLength={20}
                value={formData.contactNumber}
                onChange={handleChange}
                aria-invalid={!!state.errors?.contactNumber?.length}
              />

              {state.errors?.contactNumber && (
                <FieldError>{state.errors.contactNumber[0]}</FieldError>
              )}
            </Field>

            {/*address*/}
            <Field data-invalid={!!state.errors?.address?.length}>
              <FieldLabel
                htmlFor='address'
                className='font-poppins text-sm font-medium'
              >
                ADDRESS
              </FieldLabel>
              <Input
                id='address'
                name='address'
                type='text'
                placeholder='e.g., 123 Main St, Springfield'
                value={formData.address}
                onChange={handleChange}
                aria-invalid={!!state.errors?.address?.length}
              />

              {state.errors?.address && (
                <FieldError>{state.errors.address[0]}</FieldError>
              )}
            </Field>

            {/*description*/}
            <Field data-invalid={!!state.errors?.description?.length}>
              <FieldLabel
                htmlFor='description'
                className='font-poppins text-sm font-medium'
              >
                ADDITIONAL DETAILS
                <span className='font-inter text-xs opacity-50'>
                  (Optional)
                </span>
              </FieldLabel>
              <Textarea
                id='description'
                name='description'
                placeholder='Enter the description'
                className='no-scrollbar min-h-[120px] max-h-[120px]'
                maxLength={300}
                style={{ wordBreak: 'break-word' }}
                value={formData.description}
                onChange={handleChange}
                aria-invalid={!!state.errors?.description?.length}
              />

              {state.errors?.description && (
                <FieldError>{state.errors.description[0]}</FieldError>
              )}
            </Field>

            {/*image upload*/}
            <Field data-invalid={!!state.errors?.image?.length}>
              <FieldLabel
                htmlFor='image'
                className='font-poppins text-sm font-medium'
              >
                UPLOAD IMAGE
                <span className='font-inter text-xs opacity-50'>
                  (Optional)
                </span>
              </FieldLabel>
              <Input
                ref={fileInputRef}
                id='image'
                type='file'
                accept='image/*'
                name='image'
                onChange={handleImageChange}
                aria-invalid={!!state.errors?.image?.length}
              />

              {state.errors?.image && (
                <FieldError>{state.errors.image[0]}</FieldError>
              )}
            </Field>

            {/*image preview*/}
            {preview && (
              <div className='relative w-fit'>
                {/* group only wraps the image + overlay */}
                <div className='relative group w-fit'>
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
                    <span className='font-poppins font-medium text-sm'>
                      REPLACE
                    </span>
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

            {/**/}
          </div>
        </div>

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
