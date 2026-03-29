'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InteractiveMap, {
  InteractiveMapHandle,
} from './interactive-map-location';
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
import { Field, FieldLabel } from '@/components/ui/field';
import { IconCurrentLocation, IconMinus, IconPlus } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { createSafetyLocationSchema } from '@repo/schemas';
import { z } from 'zod';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { useSWRConfig } from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export default function CreateSafetyLocationDialog() {
  const interactiveMapRef = useRef<InteractiveMapHandle>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  // form data
  const [locationNameValue, setLocationNameValue] = useState<
    string | undefined
  >(undefined);
  const [addressValue, setAddressValue] = useState<string | undefined>(
    undefined,
  );
  const [availabilityValue, setAvailabilityValue] = useState<
    string | undefined
  >(undefined);
  const [contactNumberValue, setContactNumberValue] = useState<
    string | undefined
  >(undefined);
  const [typeValue, setTypeValue] = useState<'shelter' | 'hospital'>('shelter');
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const [descriptionValue, setDescriptionValue] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);

  // errors
  const [state, setState] = useState<{
    status: 'error' | 'success' | null;
    errors: Record<string, string[]> | null;
  }>({
    status: null,
    errors: null,
  });

  const resetForm = () => {
    setLocationNameValue(undefined);
    setAddressValue(undefined);
    setTypeValue('shelter');
    setAvailabilityValue(undefined);
    setContactNumberValue(undefined);
    setRadius(undefined);
    setDescriptionValue('');
    setImage(null);
    setLocation(null);
    setState({ status: null, errors: null });
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
      e.target.value = ''; // reset input
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!location)
      return toast.error('Location is required to create a safety location.');

    const parsedData = createSafetyLocationSchema.safeParse({
      latitude: location!.latitude,
      longitude: location!.longitude,
      locationName: locationNameValue,
      address: addressValue,
      availability: availabilityValue,
      contactNumber: contactNumberValue,
      type: typeValue,
      range: radius,
      description: descriptionValue,
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

    const formData = new FormData();
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('locationName', locationName);
    formData.append('address', address);
    formData.append('type', type);
    if (availability) formData.append('availability', availability);
    if (contactNumber) formData.append('contactNumber', contactNumber);
    if (description) formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      setIsPending(true);
      await apiFetchClient('/safety/create', {
        method: 'POST',
        body: formData,
      });
      setState({ status: 'success', errors: null });
      toast.success('Safety location created successfully!');
      resetForm();
      mutate(SWR_KEYS.safetyMapPins);
      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.safetyAdmin);
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
        <Button className='font-poppins py-6'>CREATE SAFETY LOCATION</Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col min-w-[750px] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {/* ── Blue Header ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0'>
          {/* Text */}
          <DialogTitle className='font-poppins text-base font-semibold text-white'>
            CREATE SAFETY LOCATION
          </DialogTitle>
        </DialogHeader>

        {/* ── Content Area ── */}
        <div className='no-scrollbar flex flex-col ps-4 py-4 overflow-y-auto'>
          <div className='flex-1 flex'>
            {/* left column */}
            <div className='flex-2 flex flex-col gap-4 h-fit'>
              <div className='flex items-center justify-between'>
                <span className='font-poppins text-sm font-medium opacity-50'>
                  LOCATION
                </span>
                <button
                  className='font-poppins text-xs flex gap-2 border px-3 py-1.5 rounded-lg items-center opacity-50 hover:bg-gray-100'
                  onClick={handleUseCurrentLocation}
                >
                  {loadingLocation ? (
                    <>
                      <Spinner />
                      <span>GETTING YOUR LOCATION...</span>
                    </>
                  ) : (
                    <>
                      <IconCurrentLocation className='w-[1.5em]! h-[1.5em]!' />
                      <span>USE MY CURRENT LOCATION</span>
                    </>
                  )}
                </button>
              </div>
              <div className='relative flex-1 flex aspect-square rounded-2xl overflow-hidden border h-fit'>
                <InteractiveMap
                  ref={interactiveMapRef}
                  type={typeValue}
                  mode='safety-location'
                  onLocationSelect={setLocation}
                />
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
            </div>

            {/* right column */}
            <div
              className='no-scrollbar flex-[1.5] flex flex-col overflow-y-auto'
              style={{ aspectRatio: '1 / 1' }}
            >
              <div className='flex flex-col gap-4 px-4'>
                {/* location name */}
                <Field className='flex items-center'>
                  <FieldLabel
                    htmlFor='location-name'
                    className='font-poppins text-sm font-medium'
                  >
                    LOCATION NAME
                  </FieldLabel>
                  <Input
                    id='location-name'
                    name='location-name'
                    type='text'
                    placeholder='e.g., Riverside Park'
                    defaultValue={locationNameValue}
                    onChange={(e) => setLocationNameValue(e.target.value)}
                  />
                  {state.errors?.locationName && (
                    <span className='text-sm text-red-600'>
                      {state.errors.locationName[0]}
                    </span>
                  )}
                </Field>

                {/* address */}
                <Field className='flex items-center'>
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
                    defaultValue={addressValue}
                    onChange={(e) => setAddressValue(e.target.value)}
                  />
                  {state.errors?.address && (
                    <span className='text-sm text-red-600'>
                      {state.errors.address[0]}
                    </span>
                  )}
                </Field>

                {/* safety location type */}
                <Field className='flex items-center'>
                  <FieldLabel
                    htmlFor='type'
                    className='font-poppins text-sm font-medium'
                  >
                    SAFETY LOCATION TYPE
                  </FieldLabel>
                  <Select
                    name='type'
                    defaultValue={typeValue}
                    onValueChange={(value) =>
                      setTypeValue(value as 'shelter' | 'hospital')
                    }
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
                    <span className='text-sm text-red-600'>
                      {state.errors.type[0]}
                    </span>
                  )}
                </Field>

                {/*availability*/}
                <Field className='flex items-center'>
                  <FieldLabel
                    htmlFor='availability'
                    className='font-poppins text-sm font-medium'
                  >
                    AVAILABILITY
                    <span className='font-inter opacity-50 text-xs'>
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id='availability'
                    name='availability'
                    type='text'
                    placeholder='e.g., 24/7, 9am-5pm'
                    defaultValue={availabilityValue}
                    maxLength={100}
                    onChange={(e) => setAvailabilityValue(e.target.value)}
                  />
                  {state.errors?.availability && (
                    <span className='text-sm text-red-600'>
                      {state.errors.availability[0]}
                    </span>
                  )}
                </Field>

                {/*contact number*/}
                <Field className='flex items-center'>
                  <FieldLabel
                    htmlFor='contactNumber'
                    className='font-poppins text-sm font-medium'
                  >
                    CONTACT NUMBER
                    <span className='font-inter opacity-50 text-xs'>
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id='contactNumber'
                    name='contactNumber'
                    type='text'
                    placeholder='e.g., +1 234 567 8900'
                    defaultValue={contactNumberValue}
                    maxLength={20}
                    onChange={(e) => setContactNumberValue(e.target.value)}
                  />
                  {state.errors?.contactNumber && (
                    <span className='text-sm text-red-600'>
                      {state.errors.contactNumber[0]}
                    </span>
                  )}
                </Field>

                {/* Description */}
                <Field className='flex items-center'>
                  <FieldLabel
                    htmlFor='description'
                    className='font-poppins text-sm font-medium'
                  >
                    ADDITIONAL DETAILS
                    <span className='font-inter opacity-50 text-xs'>
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id='description'
                    placeholder='Enter the description'
                    className='no-scrollbar min-h-[120px] max-h-[120px]'
                    style={{ wordBreak: 'break-word' }}
                    defaultValue={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                  />
                  {state.errors?.description && (
                    <span className='text-sm text-red-600'>
                      {state.errors.description[0]}
                    </span>
                  )}
                </Field>

                {/* Upload image */}
                <Field className='flex items-center'>
                  <FieldLabel className='font-poppins text-sm font-medium'>
                    UPLOAD IMAGE
                    <span className='font-inter opacity-50 text-xs'>
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id='image'
                    type='file'
                    accept='image/*'
                    name='image'
                    onChange={handleImageChange}
                  />
                  {state.errors?.image && (
                    <span className='text-sm text-red-600'>
                      {state.errors.image[0]}
                    </span>
                  )}
                </Field>

                <Button
                  className='font-poppins py-6 mt-auto'
                  onClick={handleSubmit}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                      <span>CREATING...</span>
                    </>
                  ) : (
                    <span>CREATE SAFETY LOCATION</span>
                  )}
                </Button>
              </div>
              {/*  */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
