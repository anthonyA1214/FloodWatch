import { apiFetchClient } from '@/lib/api-fetch-client';
import { SWR_KEYS } from '@/lib/constants/swr-keys';

export async function getDashboardStats() {
  const res = await apiFetchClient(SWR_KEYS.dashboardStats, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function getRecentReports() {
  const res = await apiFetchClient(SWR_KEYS.recentReports, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to fetch recent reports');
  return res.json();
}

export async function getRecentSafetyLocations() {
  const res = await apiFetchClient(SWR_KEYS.recentSafetyLocations, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to fetch recent safety locations');
  return res.json();
}

export async function getReportsNeedingAttention() {
  const res = await apiFetchClient(SWR_KEYS.reportsNeedingAttention, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to fetch reports needing attention');
  return res.json();
}

export async function getMonthlyReports() {
  const res = await apiFetchClient(SWR_KEYS.monthlyReports, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to fetch monthly report');
  return res.json();
}

export async function getReportDistribution() {
  const res = await apiFetchClient(SWR_KEYS.reportDistribution, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Failed to fetch report distribution');
  return res.json();
}
