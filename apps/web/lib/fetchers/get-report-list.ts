'use server';

import { ReportListQueryInput, reportListQuerySchema } from '@repo/schemas';
import { apiFetchServer } from '../api-fetch-server';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getReportList(params: ReportListQueryInput) {
  const parsed = reportListQuerySchema.safeParse(params);

  if (!parsed.success) {
    throw new Error('Invalid query parameters');
  }

  const { page = 1, limit = 10, severities, q } = parsed.data;

  if (severities && severities.length === 0) {
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

  severities?.forEach((severity) => querySearch.append('severities', severity));

  try {
    const res = await apiFetchServer(
      `${SWR_KEYS.reportList}?${querySearch.toString()}`,
      {
        method: 'GET',
      },
    );

    return res.json();
  } catch (error) {
    console.error('Error fetching affected locations list data:', error);
    throw new Error('Failed to fetch affected locations list data');
  }
}
