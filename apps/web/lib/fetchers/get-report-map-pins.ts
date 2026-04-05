import { apiFetchClient } from '@/lib/api-fetch-client';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export async function getReportMapPins() {
  const res = await apiFetchClient(SWR_KEYS.reportMapPins, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch report map pins');

  return res.json();
}
