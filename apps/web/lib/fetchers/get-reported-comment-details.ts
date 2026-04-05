import { apiFetchClient } from '../api-fetch-client';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getReportedCommentDetail(commentId: number) {
  const res = await apiFetchClient(SWR_KEYS.reportedCommentDetail(commentId), {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch reported comment detail');

  return res.json();
}
