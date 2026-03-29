'use client';

import { getApiUrl } from './utils/get-api-url';

let refreshing: Promise<void> | null = null;

const getCsrfToken = () => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrf_token='))
    ?.split('=')[1];
};

async function refreshToken() {
  if (refreshing) {
    return refreshing; // return the promise directly instead of awaiting and returning void
  }

  refreshing = (async () => {
    try {
      const res = await fetch(`${getApiUrl()}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'x-csrf-token': getCsrfToken() || '', // include CSRF token in headers
        },
      });

      if (!res.ok) {
        throw new Error('Failed to refresh token');
      }
    } finally {
      refreshing = null;
    }
  })();

  return refreshing; // return instead of await
}

export async function apiFetchClient(path: string, init: RequestInit = {}) {
  async function request() {
    return fetch(`${getApiUrl()}${path}`, {
      ...init,
      credentials: 'include', // important for browser cookies
      headers: {
        'x-csrf-token': getCsrfToken() || '', // include CSRF token in headers
        ...init.headers,
      },
    });
  }

  let res = await request();

  if (res.status === 401) {
    await refreshToken();
    res = await request();
  }

  if (res.status === 403) {
    await fetch(`${getApiUrl()}/auth/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });
    window.location.href = '/auth/login';
  }

  if (!res.ok) {
    throw res;
  }

  return res;
}
