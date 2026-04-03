'use server';

import { apiFetchServer } from '../api-fetch-server';

export async function verifyReport(reportId: number) {
  try {
    await apiFetchServer(`/reports/${reportId}/verify`, {
      method: 'PATCH',
    });

    return { status: 'success' };
  } catch (error) {
    console.error('Error verifying report:', error);
    return { status: 'error', message: 'Failed to verify report' };
  }
}

export async function deleteReport(reportId: number) {
  try {
    await apiFetchServer(`/reports/${reportId}`, {
      method: 'DELETE',
    });

    return { status: 'success' };
  } catch (error) {
    console.error('Error deleting report:', error);
    return { status: 'error', message: 'Failed to delete report' };
  }
}
