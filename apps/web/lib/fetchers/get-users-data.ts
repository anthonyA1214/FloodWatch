'use server';

import { UserQueryInput, userQuerySchema } from '@repo/schemas';
import { apiFetchServer } from '../api-fetch-server';

export async function getUsersData(params: UserQueryInput) {
  const parsed = userQuerySchema.safeParse(params);

  if (!parsed.success) {
    throw new Error('Invalid query parameters');
  }

  const { page = 1, limit = 10, status, q } = parsed.data;

  const querySearch = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    ...(q && { q }),
  });

  try {
    const res = await apiFetchServer(`/users?${querySearch.toString()}`, {
      method: 'GET',
    });

    return res.json();
  } catch {
    throw new Error('Failed to fetch users data');
  }
}
