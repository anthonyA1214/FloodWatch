'use server';

import {
  SafetyLocationQueryInput,
  safetyLocationQuerySchema,
} from '@repo/schemas';
import { apiFetchServer } from '../api-fetch-server';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getSafetyLocationsAdmin(
  params: SafetyLocationQueryInput,
) {
  const parsed = safetyLocationQuerySchema.safeParse(params);

  if (!parsed.success) {
    throw new Error('Invalid query parameters');
  }

  const { page = 1, limit = 10, type, q } = parsed.data;

  const querySearch = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(type && { type }),
    ...(q && { q }),
  });

  try {
    const res = await apiFetchServer(
      `${SWR_KEYS.safetyAdmin}?${querySearch.toString()}`,
      {
        method: 'GET',
      },
    );

    return res.json();
  } catch (error) {
    console.error('Error fetching safety locations data:', error);
    throw new Error('Failed to fetch safety locations data');
  }
}
