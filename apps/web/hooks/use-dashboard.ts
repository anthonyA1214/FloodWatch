'use client';

import useSWR from 'swr';
import { SWR_KEYS } from '@/lib/constants/swr-keys';
import {
  getDashboardStats,
  getMonthlyReports,
  getRecentReports,
  getRecentSafetyLocations,
  getReportDistribution,
  getReportsNeedingAttention,
} from '@/lib/fetchers/get-dashboard-data';
import {
  RecentReportInput,
  RecentSafetyLocationsInput,
  ReportDistributionInput,
  ReportNeedingAttentionInput,
} from '@repo/schemas';

export function useDashboardStats() {
  const { data, error, isLoading } = useSWR(
    SWR_KEYS.dashboardStats,
    getDashboardStats,
  );

  return {
    dashboardStats: data,
    isLoading,
    isError: error,
  };
}

export function useRecentReports() {
  const { data, error, isLoading } = useSWR<RecentReportInput[]>(
    SWR_KEYS.recentReports,
    getRecentReports,
  );

  return {
    recentReports: data,
    isLoading,
    isError: error,
  };
}

export function useRecentSafetyLocations() {
  const { data, error, isLoading } = useSWR<RecentSafetyLocationsInput[]>(
    SWR_KEYS.recentSafetyLocations,
    getRecentSafetyLocations,
  );

  return {
    recentSafetyLocations: data,
    isLoading,
    isError: error,
  };
}

export function useReportsNeedingAttention() {
  const { data, error, isLoading } = useSWR<ReportNeedingAttentionInput[]>(
    SWR_KEYS.reportsNeedingAttention,
    getReportsNeedingAttention,
  );

  return {
    reportsNeedingAttention: data,
    isLoading,
    isError: error,
  };
}

export function useMonthlyReports() {
  const { data, error, isLoading } = useSWR(
    SWR_KEYS.monthlyReports,
    getMonthlyReports,
  );

  return {
    monthlyReports: data,
    isLoading,
    isError: error,
  };
}

export function useReportDistribution() {
  const { data, error, isLoading } = useSWR<ReportDistributionInput[]>(
    SWR_KEYS.reportDistribution,
    getReportDistribution,
  );

  return {
    reportDistribution: data,
    isLoading,
    isError: error,
  };
}
