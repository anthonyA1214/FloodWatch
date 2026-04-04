'use client';

import { Pie, PieChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { severity: 'critical', reports: 275, fill: '#FB2C36' },
  { severity: 'high', reports: 200, fill: '#FF6900' },
  { severity: 'moderate', reports: 187, fill: '#F0B204' },
  { severity: 'low', reports: 173, fill: '#2B7FFF' },
];

const chartConfig = {
  critical: {
    label: 'Critical',
    color: 'var(--chart-0)',
  },
  high: {
    label: 'High',
    color: 'var(--chart-1)',
  },
  moderate: {
    label: 'Moderate',
    color: 'var(--chart-2)',
  },
  low: {
    label: 'Low',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export default function AlertDistributionCard() {
  return (
    <div className='flex flex-col rounded-2xl border shadow-xs p-4 gap-4'>
      {/*header*/}
      <div className='flex flex-col'>
        <h3 className='font-poppins font-medium text-lg'>ALERT DISTRIBUTION</h3>
        <span className='opacity-50'>
          Overview of active alerts by severity level
        </span>
      </div>

      <div className='grid grid-cols-2 gap-4 items-center'>
        <ChartContainer
          config={chartConfig}
          className='aspect-square max-h-[350px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='reports'
              nameKey='severity'
              innerRadius={80}
            />
          </PieChart>
        </ChartContainer>

        <div className='flex flex-col justify-center space-y-2'>
          {chartData.map((item) => (
            <div key={item.severity} className='flex items-center gap-2'>
              <div
                className='w-3 h-3 rounded-full shrink-0'
                style={{ backgroundColor: item.fill }}
              />
              <span className='capitalize text-sm flex-1'>{item.severity}</span>
              <span className='text-sm font-medium'>{item.reports}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
