import { apiFetchClient } from '../api-fetch-client';
import { SWR_KEYS } from '../constants/swr-keys';

export async function getReportDetail(reportId: number) {
  const res = await apiFetchClient(SWR_KEYS.reportDetail(reportId), {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch report detail');

  return res.json();
}
