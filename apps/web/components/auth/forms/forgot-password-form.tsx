'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ActionState } from '@/lib/types/action-state';
import { sendOtpSchema } from '@repo/schemas';
import z from 'zod';
import { Spinner } from '@/components/ui/spinner';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<ActionState>({
    status: null,
    errors: null,
  });

  const [formData, setFormData] = useState({ email: '' });

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

    const parsed = sendOtpSchema.safeParse({
      email: formData.email,
    });

    if (!parsed.success) {
      setState({
        errors: z.flattenError(parsed.error).fieldErrors,
        status: 'error',
      });
      setFormData({ email: '' });
      setIsPending(false);
      return;
    }

    const { email } = parsed.data;
    sessionStorage.setItem('reset_email', email);

    try {
      await apiFetchClient('/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setState({
        errors: {},
        status: 'success',
      });

      setFormData({ email: '' });
      router.replace('/auth/verify-otp');
    } catch {
      // swallowed
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <Field data-invalid={!!state.errors?.email?.length}>
        <FieldLabel
          htmlFor='email'
          className='font-poppins text-sm font-medium'
        >
          Email
        </FieldLabel>
        <Input
          id='email'
          type='email'
          name='email'
          placeholder='Enter your email'
          className='rounded-full shadow-sm'
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!state.errors?.email?.length}
        />
        {!!state.errors?.email?.length && (
          <FieldError>{state.errors.email[0]}</FieldError>
        )}
      </Field>

      <Button disabled={isPending} className='w-full rounded-full'>
        {isPending ? (
          <>
            Sending... <Spinner />
          </>
        ) : (
          'Send code'
        )}
      </Button>
    </form>
  );
}
