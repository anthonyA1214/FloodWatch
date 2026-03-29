'use server';

import {
  SafetyLocationListQueryInput,
  safetyLocationListQuerySchema,
} from '@repo/schemas';
import { apiFetchServer } from '../api-fetch-server';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getSafetyList(params: SafetyLocationListQueryInput) {
  const parsed = safetyLocationListQuerySchema.safeParse(params);

  if (!parsed.success) {
    throw new Error('Invalid query parameters');
  }

  const { page = 1, limit = 10, types, q } = parsed.data;

  if (types && types.length === 0) {
    return {
      data: [],
      meta: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  const querySearch = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(q && { q }),
  });

  types?.forEach((type) => querySearch.append('types', type));

  try {
    const res = await apiFetchServer(
      `${SWR_KEYS.safetyList}?${querySearch.toString()}`,
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
