import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { apiFetchClient } from '../api-fetch-client';
import { CommentsResponseInput } from '@repo/schemas';

type Cursor = { cursorDate: string; cursorId: number } | null;

export async function getComments(
  reportId: number,
  cursor?: Cursor,
): Promise<CommentsResponseInput | null> {
  const params = new URLSearchParams({ limit: '5' });

  if (cursor) {
    params.set('cursorDate', cursor.cursorDate);
    params.set('cursorId', String(cursor.cursorId));
  }

  const res = await apiFetchClient(
    `${SWR_KEYS.reportComments(reportId)}?${params.toString()}`,
    { method: 'GET' },
  );

  if (!res.ok) {
    console.error('COMMENTS ERROR:', res.status);
    return null;
  }

  return res.json();
}
