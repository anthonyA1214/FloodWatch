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

export const description = 'A bar chart with a label';

const chartData = [
  { month: 'January', reports: 186 },
  { month: 'February', reports: 305 },
  { month: 'March', reports: 237 },
  { month: 'April', reports: 73 },
  { month: 'May', reports: 209 },
  { month: 'June', reports: 214 },
];

const chartConfig = {
  reports: {
    label: 'Reports',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function MonthlyReportsCard() {
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
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
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
