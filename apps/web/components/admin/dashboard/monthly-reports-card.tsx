'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useMonthlyReports } from '@/hooks/use-dashboard';
import MonthlyReportsCardSkeleton from './skeleton/monthly-reports-card-skeleton';

const chartConfig = {
  reports: {
    label: 'Reports',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function MonthlyReportsCard() {
  const { monthlyReports, isLoading } = useMonthlyReports();

  if (isLoading) return <MonthlyReportsCardSkeleton />;

  return (
    <div className='h-full flex flex-col rounded-2xl border shadow-xs p-4 gap-4'>
      {/*header*/}
      <div className='flex flex-col'>
        <h3 className='font-poppins font-medium text-lg'>MONTHLY REPORTS</h3>
        <span className='opacity-50'>
          Submitted reports for the last 6 months
        </span>
      </div>

      <div>
        <ChartContainer config={chartConfig} className='h-[250px] w-full'>
          <BarChart
            accessibilityLayer
            data={monthlyReports}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <XAxis
              dataKey='monthName'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='reports' fill='#0066CC' radius={8}>
              <LabelList
                position='top'
                offset={12}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
