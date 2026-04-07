'use server';

import { SearchQueryInput, searchQuerySchema } from '@repo/schemas';
import { apiFetchServer } from '../api-fetch-server';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getSearch(params: SearchQueryInput) {
  const parsed = searchQuerySchema.safeParse(params);

  if (!parsed.success) {
    throw new Error('Invalid query parameters');
  }

  const { types, severities, q } = parsed.data;

  const querySearch = new URLSearchParams({
    ...(q && { q }),
  });

  severities?.forEach((severity) => querySearch.append('severities', severity));
  types?.forEach((type) => querySearch.append('types', type));

  try {
    const res = await apiFetchServer(
      `${SWR_KEYS.search}?${querySearch.toString()}`,
      {
        method: 'GET',
      },
    );

    return res.json();
  } catch {
    throw new Error('Failed to fetch search results');
  }
}
