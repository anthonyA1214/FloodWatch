import { apiFetchClient } from '../api-fetch-client';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getReportedCommentDetail(commentId: number) {
  const res = await apiFetchClient(SWR_KEYS.reportedCommentDetail(commentId), {
    method: 'GET',
  });

  if (!res.ok) {
    console.error('REPORTED COMMENT DETAIL ERROR:', res.status);
    return null;
  }

  const data = await res.json();
  return data;
}
