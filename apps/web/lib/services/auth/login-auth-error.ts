// lib/services/auth/login-auth-error.ts
import { ActionState } from '@/lib/types/action-state';

export async function mapLoginAuthError(err: unknown): Promise<ActionState> {
  // If the error is a Response from fetch
  if (err instanceof Response) {
    const status = err.status;

    // Optional: parse server JSON for more detailed errors
    let data: Record<string, unknown> | null = null;
    try {
      data = (await err.json().catch(() => null)) as Record<
        string,
        unknown
      > | null;
    } catch (parseErr) {
      console.error('Failed to parse JSON', parseErr);
    }

    // 401 Unauthorized → invalid credentials
    if (status === 401) {
      return {
        status: 'error',
        errors: { _form: ['Invalid email or password.'] },
      };
    }

    // 403 Forbidden → blocked account
    if (status === 403) {
      return {
        status: 'error',
        errors: {
          _form: ['Your account has been blocked. Please contact support.'],
        },
      };
    }

    // Optional: handle server-provided validation errors
    if (data?.errors && typeof data.errors === 'object') {
      return {
        status: 'error',
        errors: data.errors as Record<string, string[]>,
      };
    }

    // Generic fallback
    return {
      status: 'error',
      errors: { _form: ['Something went wrong. Please try again.'] },
    };
  }

  // Network or unknown error
  console.error(err);
  return {
    status: 'error',
    errors: { _form: ['An unexpected error occurred.'] },
  };
}
