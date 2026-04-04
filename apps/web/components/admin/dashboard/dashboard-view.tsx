'use client';

import AlertDistributionCard from '@/components/admin/dashboard/alert-distribution-card';
import LocationMonitorPanel from '@/components/admin/dashboard/location-monitor-panel';
import MonthlyReportsChart from '@/components/admin/dashboard/monthly-reports-card';
import NeedsAttentionCard from '@/components/admin/dashboard/needs-attention-panel';
import StatCard from '@/components/admin/dashboard/stat-card';
import WeatherHorizontalCard from '@/components/admin/dashboard/weather-horizontal-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMe } from '@/hooks/use-me';
import {
  IconAlertTriangle,
  IconClipboardData,
  IconClock,
  IconShield,
} from '@tabler/icons-react';

export default function DashboardView() {
  const { me, isLoading } = useMe();

  return (
    <div className='flex-1 flex flex-col bg-white p-8 rounded-2xl gap-8 min-h-0 overflow-y-auto'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='font-poppins text-3xl font-bold'>
          {isLoading ? <Skeleton className='h-9 w-64' /> : `Hello, ${me?.name}`}
        </h1>
        <p>Here&apos;s what is happening with FloodWatch today</p>
      </div>

      <div className='flex-1 flex flex-col gap-4'>
        {/*stat cards*/}
        <div className='grid grid-cols-4 gap-4'>
          <StatCard
            icon={IconAlertTriangle}
            color='#FF0000'
            label='ACTIVE ALERTS'
            count={1}
          />
          <StatCard
            icon={IconShield}
            color='#00B306'
            label='SAFETY LOCATIONS'
            count={42}
          />
          <StatCard
            icon={IconClipboardData}
            color='#0066FF'
            label='TOTAL REPORTS'
            count={42}
          />
          <StatCard
            icon={IconClock}
            color='#D08700'
            label='PENDING REVIEW'
            count={42}
          />
        </div>

        {/* Weather Row */}
        <WeatherHorizontalCard />

        <div className='grid grid-cols-2 gap-4'>
          {/*left side*/}
          <div className='flex flex-col gap-4'>
            <div className='flex-1'>
              <LocationMonitorPanel />
            </div>
            <div className='flex-1'>
              <MonthlyReportsChart />
            </div>
          </div>

          {/*right side*/}
          <div className='flex flex-col gap-4'>
            <div className='flex-2 max-h-[500px]'>
              <NeedsAttentionCard />
            </div>
            <div className='flex-1'>
              <AlertDistributionCard />
            </div>
          </div>
        </div>
      </div>

      {/**/}
    </div>
  );
}
