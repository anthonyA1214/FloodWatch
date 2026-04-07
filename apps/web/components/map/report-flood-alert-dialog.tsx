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
import { Field, FieldLabel } from '@/components/ui/field';
import { IconCurrentLocation, IconMinus, IconPlus } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useSWRConfig } from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { toast } from 'sonner';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { z } from 'zod';
import { reportFloodAlertSchema } from '@repo/schemas';

export default function ReportFloodAlertDialog() {
  const interactiveMapRef = useRef<InteractiveMapHandle>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  // form data
  const [severityValue, setSeverityValue] = useState<
    'low' | 'moderate' | 'high' | 'critical'
  >('low');
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
    setSeverityValue('low');
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
      return toast.error('Location is required to create a flood alert.');

    const parsedData = reportFloodAlertSchema.safeParse({
      latitude: location!.latitude,
      longitude: location!.longitude,
      range: radius,
      description: descriptionValue,
      severity: severityValue,
    });

    if (!parsedData.success) {
      const fieldErrors = z.flattenError(parsedData.error).fieldErrors;

      // Normalize range errors so we don't show raw "received NaN" messages
      const normalizedErrors: Record<string, string[]> | null = fieldErrors
        ? { ...fieldErrors }
        : null;

      if (normalizedErrors?.range?.length) {
        normalizedErrors.range = normalizedErrors.range.map((msg) =>
          msg.toLowerCase().includes('nan')
            ? 'Affected range is required.'
            : msg,
        );
      }

      setState({
        status: 'error',
        errors: normalizedErrors,
      });
      return;
    }

    const { latitude, longitude, range, description, severity } =
      parsedData.data;

    const formData = new FormData();
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('severity', severity);
    formData.append('range', range.toString());
    if (description) formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      setIsPending(true);
      await apiFetchClient('/reports/create', {
        method: 'POST',
        body: formData,
      });
      setState({ status: 'success', errors: null });
      toast.success('Flood alert created successfully!');
      setOpen(false);
    } catch (err) {
      console.error('Failed to create flood alert:', err);
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
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
                PIN LOCATION ON MAP
              </span>
              <button
                className='font-poppins text-xs flex gap-2 border px-3 py-1.5 rounded-lg items-center text-gray-600 hover:bg-gray-100'
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

            {/* interactive map */}
            <div className='relative flex-1 flex aspect-video rounded-2xl overflow-hidden border h-fit'>
              <InteractiveMap
                ref={interactiveMapRef}
                severity={severityValue}
                range={radius}
                mode='flood-alert'
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
                  value={severityValue}
                  onValueChange={(value) =>
                    setSeverityValue(
                      value as 'critical' | 'high' | 'moderate' | 'low',
                    )
                  }
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
                  <span className='text-sm text-red-600'>
                    {state.errors.severity[0]}
                  </span>
                )}
              </Field>

              <Field data-invalid={!!state.errors?.range?.length}>
                <FieldLabel
                  htmlFor='range'
                  className='font-poppins text-sm font-medium'
                >
                  AFFECTED RANGE
                  <span className='font-inter text-xs text-gray-600'>
                    (meters)
                  </span>
                </FieldLabel>
                <Input
                  id='range'
                  name='range'
                  type='number'
                  placeholder='e.g., 100'
                  min={1}
                  value={radius ?? ''}
                  aria-invalid={!!state.errors?.range?.length}
                  onChange={(e) => {
                    setRadius(Number(e.target.value));
                    setState((prev) => ({
                      ...prev,
                      errors: prev.errors
                        ? { ...prev.errors, range: [] }
                        : null,
                    }));
                  }}
                />
                {state.errors?.range && (
                  <span className='text-sm text-red-600'>
                    {state.errors.range[0]}
                  </span>
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
                <span className='font-inter text-gray-600 text-xs'>
                  (Optional)
                </span>
              </FieldLabel>
              <Textarea
                id='description'
                placeholder='Enter the description'
                className='no-scrollbar min-h-[120px] max-h-[120px]'
                style={{ wordBreak: 'break-word' }}
                value={descriptionValue}
                aria-invalid={!!state.errors?.description?.length}
                onChange={(e) => {
                  setDescriptionValue(e.target.value);
                  setState((prev) => ({
                    ...prev,
                    errors: prev.errors
                      ? { ...prev.errors, description: [] }
                      : null,
                  }));
                }}
              />
              {state.errors?.description && (
                <span className='text-sm text-red-600'>
                  {state.errors.description[0]}
                </span>
              )}
            </Field>

            {/* image upload */}
            <Field data-invalid={!!state.errors?.image?.length}>
              <FieldLabel className='font-poppins text-sm font-medium'>
                UPLOAD IMAGE
                <span className='font-inter text-gray-600 text-xs'>
                  (Optional)
                </span>
              </FieldLabel>
              <Input
                id='image'
                type='file'
                accept='image/*'
                name='image'
                aria-invalid={!!state.errors?.image?.length}
                onChange={(e) => {
                  handleImageChange(e);
                  setState((prev) => ({
                    ...prev,
                    errors: prev.errors ? { ...prev.errors, image: [] } : null,
                  }));
                }}
              />
              {state.errors?.image && (
                <span className='text-sm text-red-600'>
                  {state.errors.image[0]}
                </span>
              )}
            </Field>
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
