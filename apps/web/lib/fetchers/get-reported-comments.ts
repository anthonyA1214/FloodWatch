'use server';

import {
  ReportedCommentQueryInput,
  reportedCommentQuerySchema,
} from '@repo/schemas';
import { apiFetchServer } from '../api-fetch-server';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getReportedComments(params: ReportedCommentQueryInput) {
  const parsed = reportedCommentQuerySchema.safeParse(params);

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
    const res = await apiFetchServer(
      `${SWR_KEYS.reportedComments}?${querySearch.toString()}`,
      {
        method: 'GET',
      },
    );

    return res.json();
  } catch (error) {
    console.error('Error fetching reports data:', error);
    throw new Error('Failed to fetch reports data');
  }
}
