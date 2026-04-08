'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ActionState } from '@/lib/types/action-state';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema } from '@repo/schemas';
import z from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { mapResetPasswordAuthError } from '@/lib/services/auth/reset-password-auth-error';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function ResetPasswordForm() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<ActionState>({
    status: null,
    errors: null,
  });

  const [formData, setFormData] = useState({
    new_password: '',
    confirm_new_password: '',
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setState((prev) => ({
      ...prev,
      errors: prev.errors ? { ...prev.errors, [name]: [] } : null,
    }));
  };

  useEffect(() => {
    sessionStorage.removeItem('reset_email');
    sessionStorage.removeItem('otp_cooldown');
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const resetSessionId = sessionStorage.getItem('resetSessionId');

    const parsed = resetPasswordSchema.safeParse({
      resetSessionId,
      new_password: formData.new_password,
      confirm_new_password: formData.confirm_new_password,
    });

    if (!parsed.success) {
      console.log(
        'Validation errors:',
        z.flattenError(parsed.error).fieldErrors,
      );
      setState({
        errors: z.flattenError(parsed.error).fieldErrors,
        status: 'error',
      });
      setFormData({ new_password: '', confirm_new_password: '' });
      setIsPending(false);
      return;
    }

    const { new_password, confirm_new_password } = parsed.data;

    try {
      await apiFetchClient('/auth/forgot-password/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetSessionId,
          new_password,
          confirm_new_password,
        }),
      });

      setState({
        errors: {},
        status: 'success',
      });

      sessionStorage.removeItem('resetSessionId');
      router.replace('/auth/login');
    } catch (err) {
      setState(await mapResetPasswordAuthError(err));
      setFormData({ new_password: '', confirm_new_password: '' });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* New Password */}
      <Field data-invalid={!!state.errors?.new_password?.length}>
        <FieldLabel
          htmlFor='new_password'
          className='font-poppins text-sm font-medium'
        >
          New Password
        </FieldLabel>
        <InputGroup className='rounded-full'>
          <InputGroupInput
            id='new_password'
            name='new_password'
            type={showNewPassword ? 'text' : 'password'}
            placeholder='Enter your new password'
            className='rounded-full'
            value={formData.new_password}
            onChange={handleChange}
            aria-invalid={!!state.errors?.new_password?.length}
          />
          {formData.new_password.length > 0 && (
            <InputGroupAddon align='inline-end'>
              <InputGroupButton
                className='bg-transparent! hover:bg-transparent!'
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? (
                  <IconEyeOff className='size-[1.5em]! shrink-0' />
                ) : (
                  <IconEye className='size-[1.5em]! shrink-0' />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        {!!state.errors?.new_password?.length && (
          <FieldError>{state.errors.new_password[0]}</FieldError>
        )}
      </Field>

      {/* Confirm New Password */}
      <Field data-invalid={!!state.errors?.confirm_new_password?.length}>
        <FieldLabel
          htmlFor='confirm_new_password'
          className='font-poppins text-sm font-medium'
        >
          Confirm Password
        </FieldLabel>
        <InputGroup className='rounded-full'>
          <InputGroupInput
            id='confirm_new_password'
            name='confirm_new_password'
            type={showConfirmNewPassword ? 'text' : 'password'}
            placeholder='Re-enter your new password'
            className='rounded-full'
            value={formData.confirm_new_password}
            onChange={handleChange}
            aria-invalid={!!state.errors?.confirm_new_password?.length}
          />
          {formData.confirm_new_password.length > 0 && (
            <InputGroupAddon align='inline-end'>
              <InputGroupButton
                className='bg-transparent! hover:bg-transparent!'
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
              >
                {showConfirmNewPassword ? (
                  <IconEyeOff className='size-[1.5em]! shrink-0' />
                ) : (
                  <IconEye className='size-[1.5em]! shrink-0' />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        {!!state.errors?.confirm_new_password?.length && (
          <FieldError>{state.errors.confirm_new_password[0]}</FieldError>
        )}
        {!!state.errors?._form?.length && (
          <FieldError>{state.errors._form[0]}</FieldError>
        )}
      </Field>

      <Button disabled={isPending} className='w-full rounded-full'>
        {isPending ? (
          <>
            Resetting... <Spinner />
          </>
        ) : (
          'Reset password'
        )}
      </Button>
    </form>
  );
}
