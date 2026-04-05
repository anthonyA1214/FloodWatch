'use client';

import ReportDistributionCard from '@/components/admin/dashboard/report-distribution-card';
import LocationMonitorPanel from '@/components/admin/dashboard/location-monitor-panel';
import MonthlyReportsCard from '@/components/admin/dashboard/monthly-reports-card';
import NeedsAttentionPanel from '@/components/admin/dashboard/needs-attention-panel';
import WeatherHorizontalCard from '@/components/admin/dashboard/weather-horizontal-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMe } from '@/hooks/use-me';
import DashboardStatCards from './dashboard-stat-cards';

export default function DashboardView() {
  const { me, isLoading } = useMe();

  return (
    <div className='flex-1 flex flex-col bg-white p-8 rounded-2xl gap-8 min-h-0 overflow-y-auto overflow-x-auto'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='font-poppins text-3xl font-bold'>
          {isLoading ? <Skeleton className='h-9 w-64' /> : `Hello, ${me?.name}`}
        </h1>
        <p>Here&apos;s what is happening with FloodWatch today</p>
      </div>

      <div className='flex-1 flex flex-col gap-4'>
        {/*stat cards*/}
        <DashboardStatCards />

        {/* Weather Row */}
        <WeatherHorizontalCard />

        <div className='grid grid-cols-2 gap-4'>
          <div className='min-h-[500px] max-h-[500px]'>
            <LocationMonitorPanel />
          </div>

          <div className='min-h-[500px] max-h-[500px]'>
            <NeedsAttentionPanel />
          </div>

          <MonthlyReportsCard />
          <ReportDistributionCard />
        </div>
      </div>

      {/**/}
    </div>
  );
}
