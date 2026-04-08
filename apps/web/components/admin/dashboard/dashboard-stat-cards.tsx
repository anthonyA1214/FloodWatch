import {
  IconAlertTriangle,
  IconClipboardData,
  IconClock,
  IconShield,
} from '@tabler/icons-react';
import DashboardStatCard from './dashboard-stat-card';
import { useDashboardStats } from '@/hooks/use-dashboard';
import DashboardStatCardSkeleton from './skeleton/dashboard-stat-card-skeleton';

export default function DashboardStatCards() {
  const { dashboardStats, isLoading } = useDashboardStats();

  return (
    <div className='grid grid-cols-4 gap-4'>
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <DashboardStatCardSkeleton key={i} />
        ))
      ) : (
        <>
          <DashboardStatCard
            icon={IconAlertTriangle}
            color='#FF0000'
            label='ACTIVE ALERTS'
            count={dashboardStats?.activeAlerts ?? 0}
          />
          <DashboardStatCard
            icon={IconShield}
            color='#00B306'
            label='SAFETY LOCATIONS'
            count={dashboardStats?.safetyLocations ?? 0}
          />
          <DashboardStatCard
            icon={IconClipboardData}
            color='#0066FF'
            label='TOTAL REPORTS'
            count={dashboardStats?.totalReports ?? 0}
          />
          <DashboardStatCard
            icon={IconClock}
            color='#D08700'
            label='PENDING REVIEW'
            count={dashboardStats?.pendingReview ?? 0}
          />
        </>
      )}
    </div>
  );
}
