'use client';

import { Button } from '@/components/ui/button';
import { ActionState } from '@/lib/types/action-state';
import React, { useState } from 'react';
import { signUpSchema } from '@repo/schemas';
import z from 'zod';
import { mapSignupAuthError } from '@/lib/services/auth/signup-auth-error';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function SignUpForm() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<ActionState>({
    status: null,
    errors: null,
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    home_address: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setState((prev) => ({
      ...prev,
      errors: prev.errors ? { ...prev.errors, [name]: [] } : null,
    }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const form = e.currentTarget;

    const parsed = signUpSchema.safeParse({
      first_name: formData.first_name,
      last_name: formData.last_name,
      home_address: formData.home_address,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
    });

    if (!parsed.success) {
      setState({
        status: 'error',
        errors: z.flattenError(parsed.error).fieldErrors,
      });
      setFormData((prev) => ({ ...prev, password: '', confirm_password: '' }));
      setIsPending(false);
      return;
    }

    const {
      first_name,
      last_name,
      home_address,
      email,
      password,
      confirm_password,
    } = parsed.data;

    try {
      const res = await apiFetchClient('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name,
          last_name,
          home_address,
          email,
          password,
          confirm_password,
        }),
      });

      const { user } = await res.json();

      setState({
        status: 'success',
        errors: {},
      });

      form.reset();
      await mutate(SWR_KEYS.me);

      if (user?.role === 'admin') router.replace('/admin');
      else router.push('/map');
      router.refresh();
    } catch (err) {
      setState({
        errors: (await mapSignupAuthError(err)).errors,
        status: 'error',
      });
      setFormData((prev) => ({ ...prev, password: '', confirm_password: '' }));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Full name */}
      <div className='space-y-2'>
        <FieldLabel
          className={`font-poppins text-sm font-medium ${
            !!state.errors?.first_name?.length ||
            !!state.errors?.last_name?.length
              ? 'text-destructive'
              : ''
          }`}
        >
          Full name
        </FieldLabel>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <Field data-invalid={!!state.errors?.first_name?.length}>
            <Input
              id='first_name'
              name='first_name'
              placeholder='First name'
              className='rounded-full px-4 shadow-sm'
              value={formData.first_name}
              onChange={handleChange}
              aria-invalid={!!state.errors?.first_name?.length}
            />
            {!!state.errors?.first_name?.length && (
              <FieldError>{state.errors.first_name[0]}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!state.errors?.last_name?.length}>
            <Input
              id='last_name'
              name='last_name'
              placeholder='Last name'
              className='rounded-full px-4 shadow-sm'
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

      {/* Email */}
      <Field data-invalid={!!state.errors?.email?.length}>
        <FieldLabel
          htmlFor='email'
          className='font-poppins text-sm font-medium'
        >
          Email
        </FieldLabel>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='Enter your email'
          className='rounded-full px-4 shadow-sm'
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!state.errors?.email?.length}
        />
        {!!state.errors?.email?.length && (
          <FieldError>{state.errors.email[0]}</FieldError>
        )}
      </Field>

      {/* Home Address */}
      <Field data-invalid={!!state.errors?.home_address?.length}>
        <FieldLabel
          htmlFor='home_address'
          className='font-poppins text-sm font-medium'
        >
          Home Address
        </FieldLabel>
        <Input
          id='home_address'
          name='home_address'
          placeholder='Enter your home address'
          className='rounded-full px-4 shadow-sm'
          value={formData.home_address}
          onChange={handleChange}
          aria-invalid={!!state.errors?.home_address?.length}
        />
        {!!state.errors?.home_address?.length && (
          <FieldError>{state.errors.home_address[0]}</FieldError>
        )}
      </Field>

      {/* Password */}
      <Field
        data-invalid={!!state.errors?.password?.length}
        className='rounded-full'
      >
        <FieldLabel
          htmlFor='password'
          className='font-poppins text-sm font-medium'
        >
          Password
        </FieldLabel>
        <InputGroup className='rounded-full'>
          <InputGroupInput
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            className='rounded-full'
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
        {!!state.errors?.password?.length && (
          <FieldError>{state.errors.password[0]}</FieldError>
        )}
      </Field>

      {/* Confirm Password */}
      <Field
        data-invalid={!!state.errors?.confirm_password?.length}
        className='rounded-full'
      >
        <FieldLabel
          htmlFor='confirm_password'
          className='font-poppins text-sm font-medium'
        >
          Confirm Password
        </FieldLabel>
        <InputGroup className='rounded-full'>
          <InputGroupInput
            id='confirm_password'
            name='confirm_password'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Re-enter your password'
            className='rounded-full'
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
        {!!state.errors?.confirm_password?.length && (
          <FieldError>{state.errors.confirm_password[0]}</FieldError>
        )}
      </Field>

      <Button disabled={isPending} className='w-full rounded-full'>
        {isPending ? (
          <>
            Signing up... <Spinner />
          </>
        ) : (
          'Sign up'
        )}
      </Button>
    </form>
  );
}
