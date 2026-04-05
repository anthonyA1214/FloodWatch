'use client';

import { Label, Pie, PieChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useMemo } from 'react';
import { useReportDistribution } from '@/hooks/use-dashboard';
import { SEVERITY_COLOR_MAP } from '@/lib/utils/get-color-map';
import ReportDistributionCardSkeleton from './skeleton/report-distribution-card-skeleton';

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

export default function ReportDistributionCard() {
  const { reportDistribution, isLoading } = useReportDistribution();

  const chartData = useMemo(() => {
    return (reportDistribution ?? []).map((item) => ({
      ...item,
      fill: SEVERITY_COLOR_MAP[item.severity],
    }));
  }, [reportDistribution]);

  const totalReports = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.reports, 0);
  }, [chartData]);

  if (isLoading) return <ReportDistributionCardSkeleton />;

  return (
    <div className='flex flex-col rounded-2xl border shadow-xs p-4 gap-4'>
      {/*header*/}
      <div className='flex flex-col'>
        <h3 className='font-poppins font-medium text-lg'>
          REPORT DISTRIBUTION
        </h3>
        <span className='opacity-50'>
          Distribution of reports by severity level
        </span>
      </div>

      <div className='grid grid-cols-[1fr_2fr] gap-4 items-center'>
        <ChartContainer
          config={chartConfig}
          className='aspect-square max-h-[250px]'
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
              innerRadius={60}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalReports.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Reports
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
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
