'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { cn } from '@/lib/utils';
import { createAdminSchema } from '@repo/schemas';
import { IconEye, IconEyeOff, IconUserPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';

export default function AddNewAdminDialog() {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const [state, setState] = useState<{
    status: 'error' | 'success' | null;
    errors: Record<string, string[]> | null;
  }>({
    status: null,
    errors: null,
  });

  const [isPending, setIsPending] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // form data
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    home_address: '',
    password: '',
    confirm_password: '',
  });

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      home_address: '',
      password: '',
      confirm_password: '',
    });
    setState({
      status: null,
      errors: null,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setState((prev) => ({
      ...prev,
      errors: prev.errors ? { ...prev.errors, [name]: [] } : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsPending(true);

    const parsedData = createAdminSchema.safeParse({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      home_address: formData.home_address,
      password: formData.password,
      confirm_password: formData.confirm_password,
    });

    if (!parsedData.success) {
      setState({
        status: 'error',
        errors: parsedData.error.flatten().fieldErrors,
      });
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirm_password: '',
      }));
      setIsPending(false);
      return;
    }

    const {
      first_name,
      last_name,
      email,
      home_address,
      password,
      confirm_password,
    } = parsedData.data;

    try {
      await apiFetchClient('/users/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          home_address,
          password,
          confirm_password,
        }),
      });

      setState({
        status: 'success',
        errors: null,
      });

      mutate((key) => Array.isArray(key) && key[0] === SWR_KEYS.users);
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Response && err.status === 409) {
        setState({
          status: 'error',
          errors: { email: ['Email is already in use.'] },
        });
      } else {
        toast.error('Something went wrong.');
      }
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirm_password: '',
      }));
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setTimeout(() => {
      if (!isOpen) {
        resetForm();
      }
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='font-poppins py-6'>ADD NEW ADMIN</Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col w-full max-w-full sm:max-w-lg max-h-[85vh] p-0 overflow-hidden gap-0 border-0 [&>button]:text-white [&>button]:hover:text-white [&>button]:opacity-70 [&>button]:hover:opacity-100'>
        {/* ── Blue Header ── */}
        <DialogHeader className='flex flex-row items-center gap-4 bg-[#0066CC] rounded-b-2xl p-4 shrink-0 text-white'>
          {/* Text */}
          <DialogTitle className='flex items-center gap-3 sm:gap-4 font-poppins text-sm sm:text-base font-medium'>
            ADD NEW ADMIN
          </DialogTitle>
        </DialogHeader>

        {/* ── Content Area ── */}
        <div className='flex-1 min-h-0 overflow-y-auto'>
          <div className='flex flex-col p-4 gap-4'>
            {/* full name */}
            <div className='flex flex-col gap-1'>
              <FieldLabel
                className={cn(
                  'font-poppins text-sm font-medium',
                  (!!state.errors?.first_name?.length ||
                    !!state.errors?.last_name?.length) &&
                    'text-destructive',
                )}
              >
                FULL NAME
              </FieldLabel>
              <div className='flex gap-2'>
                <Field
                  data-invalid={!!state.errors?.first_name?.length}
                  className='flex-1'
                >
                  <Input
                    id='first_name'
                    name='first_name'
                    placeholder='First name'
                    value={formData.first_name}
                    onChange={handleChange}
                    aria-invalid={!!state.errors?.first_name?.length}
                  />
                  {!!state.errors?.first_name?.length && (
                    <FieldError>{state.errors.first_name[0]}</FieldError>
                  )}
                </Field>

                <Field
                  data-invalid={!!state.errors?.last_name?.length}
                  className='flex-1'
                >
                  <Input
                    id='last_name'
                    name='last_name'
                    placeholder='Last name'
                    value={formData.last_name}
                    onChange={handleChange}
                    aria-invalid={!!state.errors?.last_name?.length}
                  />
                  {!!state.errors?.last_name?.length && (
                    <FieldError>{state.errors.last_name[0]}</FieldError>
                  )}
                </Field>
              </div>
            </div>

            {/* email */}
            <Field data-invalid={!!state.errors?.email?.length}>
              <FieldLabel
                htmlFor='email'
                className='font-poppins text-sm font-medium'
              >
                EMAIL
              </FieldLabel>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='e.g. admin@example.com'
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!state.errors?.email?.length}
              />

              {state.errors?.email && (
                <FieldError>{state.errors.email[0]}</FieldError>
              )}
            </Field>

            {/* home address */}
            <Field data-invalid={!!state.errors?.home_address?.length}>
              <FieldLabel
                htmlFor='home_address'
                className='font-poppins text-sm font-medium'
              >
                HOME ADDRESS
              </FieldLabel>
              <Input
                id='home_address'
                name='home_address'
                placeholder='Enter home address'
                value={formData.home_address}
                onChange={handleChange}
                aria-invalid={!!state.errors?.home_address?.length}
              />

              {state.errors?.home_address && (
                <FieldError>{state.errors.home_address[0]}</FieldError>
              )}
            </Field>

            {/*password*/}
            <Field data-invalid={!!state.errors?.password?.length}>
              <FieldLabel
                htmlFor='password'
                className='font-poppins text-sm font-medium'
              >
                PASSWORD
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter password'
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={!!state.errors?.password?.length}
                />
                {formData.password.length > 0 && (
                  <InputGroupAddon align='inline-end'>
                    <InputGroupButton
                      className='bg-transparent! hover:bg-transparent!'
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <IconEyeOff className='size-[1.5em]! shrink-0' />
                      ) : (
                        <IconEye className='size-[1.5em]! shrink-0' />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>

              {state.errors?.password && (
                <FieldError>{state.errors.password[0]}</FieldError>
              )}
            </Field>

            {/* confirm password */}
            <Field data-invalid={!!state.errors?.confirm_password?.length}>
              <FieldLabel
                htmlFor='confirm_password'
                className='font-poppins text-sm font-medium'
              >
                CONFIRM PASSWORD
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id='confirm_password'
                  name='confirm_password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Enter confirm password'
                  value={formData.confirm_password}
                  onChange={handleChange}
                  aria-invalid={!!state.errors?.confirm_password?.length}
                />
                {formData.confirm_password.length > 0 && (
                  <InputGroupAddon align='inline-end'>
                    <InputGroupButton
                      className='bg-transparent! hover:bg-transparent!'
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <IconEyeOff className='size-[1.5em]! shrink-0' />
                      ) : (
                        <IconEye className='size-[1.5em]! shrink-0' />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>

              {state.errors?.confirm_password && (
                <FieldError>{state.errors.confirm_password[0]}</FieldError>
              )}
            </Field>
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
              <IconUserPlus className='w-[1.5em]! h-[1.5em]!' />
            )}
            <span>{isPending ? 'ADDING...' : 'ADD NEW ADMIN'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
