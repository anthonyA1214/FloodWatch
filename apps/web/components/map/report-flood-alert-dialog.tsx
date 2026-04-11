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
} from './interactive-map-current-location';
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
import { useSWRConfig } from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { toast } from 'sonner';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { z } from 'zod';
import { reportFloodAlertSchema } from '@repo/schemas';
import Image from 'next/image';

export default function ReportFloodAlertDialog() {
  const interactiveMapRef = useRef<InteractiveMapHandle>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  // form data
  const [formData, setFormData] = useState<{
    severity: 'low' | 'moderate' | 'high' | 'critical';
    range: number;
    description: string;
    image: File | null;
    location: { longitude: number; latitude: number } | null;
  }>({
    severity: 'low',
    range: 0,
    description: '',
    image: null,
    location: null,
  });

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

  const resetForm = () => {
    setPreview(null);
    setFormData({
      severity: 'low',
      range: 0,
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
      return toast.error('Location is required to create a flood alert.');

    const parsedData = reportFloodAlertSchema.safeParse({
      latitude: formData.location!.latitude,
      longitude: formData.location!.longitude,
      range: formData.range,
      description: formData.description,
      severity: formData.severity,
    });

    if (!parsedData.success) {
      setState({
        status: 'error',
        errors: z.flattenError(parsedData.error).fieldErrors,
      });
      return;
    }

    const { latitude, longitude, range, description, severity } =
      parsedData.data;

    const form = new FormData();
    form.append('latitude', latitude.toString());
    form.append('longitude', longitude.toString());
    form.append('severity', severity);
    form.append('range', range.toString());
    if (description) form.append('description', description);
    if (formData.image) form.append('image', formData.image);

    try {
      setIsPending(true);
      await apiFetchClient('/reports/create', {
        method: 'POST',
        body: form,
      });
      setState({ status: 'success', errors: null });
      toast.success('Flood alert created successfully!');
      resetForm();
      mutate(SWR_KEYS.reportMapPins);
      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.reports);
      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.reportList);
      setOpen(false);
    } catch {
      toast.error('Failed to create flood alert. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          className='font-poppins flex justify-center items-center gap-2 bg-white
            text-[#FB2C36] hover:text-white hover:bg-[#FB2C36] border border-[#FB2C36]
              rounded-md transition-colors px-2 2xl:px-4 py-1.5 text-xs md:text-sm whitespace-nowrap'
        >
          <span className='font-poppins font-medium'>REPORT FLOOD</span>
        </button>
      </DialogTrigger>
      <DialogContent
        className='flex flex-col w-full max-w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'
        onCloseAutoFocus={() => {
          mutate(SWR_KEYS.reportMapPins);
          mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.reports);
        }}
        onAnimationEnd={(e) => {
          if (e.target !== e.currentTarget) return; // ignore bubbled events
          if (!open) resetForm();
        }}
      >
        {/* ── Blue Header ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl px-5 py-4 shrink-0'>
          <DialogTitle className='font-poppins text-base font-medium text-white'>
            REPORT FLOOD ALERT
          </DialogTitle>
        </DialogHeader>

        {/* ── Content Area ── */}
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <div className='flex flex-col p-4 gap-4'>
            <div className='flex items-center justify-between'>
              <span className='font-poppins text-sm font-medium text-gray-600'>
                LOCATION
              </span>
              <button
                className='font-poppins text-[12px]  flex gap-2 border px-3 py-1.5 rounded-lg items-center text-gray-600 hover:bg-gray-100'
                onClick={handleUseCurrentLocation}
              >
                {loadingLocation ? (
                  <>
                    <Spinner />
                    <span>GETTING YOUR LOCATION...</span>
                  </>
                ) : (
                  <>
                    <IconCurrentLocation className='w-[1.25em]! h-[1.25em]! sm:w-[1.5em]! sm:h-[1.5em]!' />
                    {/* Mobile: shorter label, Desktop: full label */}
                    <span className='whitespace-nowrap sm:hidden'>
                      CURRENT LOCATION
                    </span>
                    <span className='whitespace-nowrap hidden sm:inline'>
                      USE MY CURRENT LOCATION
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* interactive map */}
            <div className='relative flex-1 flex aspect-video rounded-2xl overflow-hidden border h-fit'>
              <InteractiveMap
                ref={interactiveMapRef}
                severity={formData?.severity}
                range={formData?.range}
                mode='flood-alert'
                onLocationSelect={(loc) =>
                  setFormData((prev) => ({ ...prev, location: loc }))
                }
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
            </div>

            {/* severity and range */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              <Field data-invalid={!!state.errors?.severity?.length}>
                <FieldLabel
                  htmlFor='severity'
                  className='font-poppins text-sm font-medium'
                >
                  SEVERITY LEVEL
                </FieldLabel>
                <Select
                  name='severity'
                  value={formData?.severity}
                  onValueChange={handleSelectChange('severity')}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Severity Level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Severity Level</SelectLabel>
                      <SelectItem value='low'>Low</SelectItem>
                      <SelectItem value='moderate'>Moderate</SelectItem>
                      <SelectItem value='high'>High</SelectItem>
                      <SelectItem value='critical'>Critical</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {state.errors?.severity && (
                  <FieldError>{state.errors.severity[0]}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!state.errors?.range?.length}>
                <FieldLabel
                  htmlFor='range'
                  className='font-poppins text-sm font-medium'
                >
                  AFFECTED RANGE
                  <span className='font-inter text-xs opacity-50'>
                    (meters)
                  </span>
                </FieldLabel>

                <Input
                  id='range'
                  name='range'
                  type='number'
                  placeholder='e.g., 100'
                  min={1}
                  value={formData?.range ?? ''}
                  aria-invalid={!!state.errors?.range?.length}
                  onChange={handleChange}
                />
                {state.errors?.range && (
                  <FieldError>{state.errors.range[0]}</FieldError>
                )}
              </Field>
            </div>

            {/* description */}
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
                style={{ wordBreak: 'break-word' }}
                aria-invalid={!!state.errors?.description?.length}
                value={formData.description}
                onChange={handleChange}
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
          </div>
        </div>

        <div className='bg-[#F9F9F9] rounded-t-2xl p-4 shrink-0'>
          <Button
            className='font-poppins w-full py-6 flex items-center justify-center gap-2'
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner />
                <span>SUBMITTING...</span>
              </>
            ) : (
              <span>SUBMIT REPORT</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
