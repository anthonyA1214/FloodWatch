'use client';

import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ActionState } from '@/lib/types/action-state';
import { logInSchema } from '@repo/schemas';
import z from 'zod';
import { mapLoginAuthError } from '@/lib/services/auth/login-auth-error';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useMe } from '@/hooks/use-me';
import { apiFetchClient } from '@/lib/api-fetch-client';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function LoginForm() {
  const { mutateMe } = useMe();
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<ActionState>({
    status: null,
    errors: null,
  });
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

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

    const parsed = logInSchema.safeParse({
      email: formData.email,
      password: formData.password,
    });

    if (!parsed.success) {
      setState({
        errors: z.flattenError(parsed.error).fieldErrors,
        status: 'error',
      });
      setFormData((prev) => ({ ...prev, password: '' }));
      setIsPending(false);
      return;
    }

    const { email, password } = parsed.data;

    try {
      const res = await apiFetchClient('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const { user } = await res.json();

      setState({ errors: {}, status: 'success' });
      setFormData({ email: '', password: '' });
      await mutateMe();

      if (user?.role === 'admin') router.replace('/admin');
      else router.replace('/map');
    } catch (err) {
      setState({
        errors: (await mapLoginAuthError(err)).errors,
        status: 'error',
      });
      setFormData((prev) => ({ ...prev, password: '' }));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* email */}
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
          className='rounded-full'
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!state.errors?.email?.length}
        />
        {!!state.errors?.email?.length && (
          <FieldError>{state.errors.email}</FieldError>
        )}
      </Field>

      {/* password */}
      <Field data-invalid={!!state.errors?.password?.length}>
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
          <FieldError>{state.errors.password}</FieldError>
        )}
        {state.errors && '_form' in state.errors && state.errors._form && (
          <FieldError>{state.errors._form}</FieldError>
        )}
        <div className='text-right text-sm text-gray-500 hover:underline cursor-pointer'>
          <Link href='/auth/forgot-password'>Forgot password?</Link>
        </div>
      </Field>

      <Button
        disabled={isPending}
        type='submit'
        className='w-full rounded-full'
      >
        {isPending ? (
          <>
            Logging in... <Spinner />
          </>
        ) : (
          'Login'
        )}
      </Button>
    </form>
  );
}
