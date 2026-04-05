import { SWR_KEYS } from '@/lib/constants/swr-keys';
import { apiFetchClient } from '../api-fetch-client';
import { CommentResponseInput } from '@repo/schemas';

type Cursor = { cursorDate: string; cursorId: number } | null;

export async function getComments(
  reportId: number,
  cursor?: Cursor,
): Promise<CommentResponseInput | null> {
  const params = new URLSearchParams({ limit: '5' });

  if (cursor) {
    params.set('cursorDate', cursor.cursorDate);
    params.set('cursorId', String(cursor.cursorId));
  }

  const res = await apiFetchClient(
    `${SWR_KEYS.reportComments(reportId)}?${params.toString()}`,
    { method: 'GET' },
  );

  if (!res.ok) throw new Error('Failed to fetch comments');

  return res.json();
}
