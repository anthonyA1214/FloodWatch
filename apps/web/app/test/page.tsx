'use client';

import { getApiUrl } from '@/lib/utils/get-api-url';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useEffect } from 'react';

const getCsrfToken = () => {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrf_token='))
    ?.split('=')[1];
};

async function refreshToken() {
  const res = await fetch(`${getApiUrl()}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'x-csrf-token': getCsrfToken() || '' },
  });
  if (!res.ok) throw new Error('Failed to refresh token');
}

export default function TestPage() {
  useEffect(() => {
    let retried = false;

    function connect() {
      fetchEventSource(`${getApiUrl()}/events/reports/sse`, {
        credentials: 'include',
        headers: {
          'x-csrf-token': getCsrfToken() || '',
        },

        async onopen(response) {
          if (response.ok) return; // Connection established successfully

          if (response.status === 401 && !retried) {
            retried = true;
            try {
              await refreshToken();
              connect(); // Retry connection after refreshing token
            } catch (error) {
              console.error('Token refresh failed:', error);
            }
          }

          if (response.status === 403) {
            await fetch(`${getApiUrl()}/auth/logout`, {
              method: 'DELETE',
              credentials: 'include',
            });
            window.location.href = '/auth/login';
            throw new Error('Forbidden');
          }

          throw new Error(`SSE connection failed: ${response.status}`);
        },

        onmessage(event) {
          console.log(event.data);
        },
      });
    }

    connect();
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page to demonstrate dynamic routing in Next.js.</p>
    </div>
  );
}
