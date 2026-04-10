import {
  IconCircleCheck,
  IconExclamationCircle,
  IconReportAnalytics,
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

type UserStatCardProps = {
  label: string;
  count: number;
  status: 'total' | 'verified' | 'unverified' | 'resolved';
  isActive: boolean;
  onClick: () => void;
};

export default function ReportStatCard({
  label,
  count,
  status,
  isActive,
  onClick,
}: UserStatCardProps) {
  const iconMap = {
    total: IconReportAnalytics,
    verified: IconCircleCheck,
    unverified: IconExclamationCircle,
    resolved: IconCircleCheck,
  };

  const statusColorMap = {
    total: '#0066CC',
    verified: '#00D69B',
    unverified: '#F0B204',
    resolved: '#6B7280',
  };

  const statusTextMap = {
    total: 'Showing all reports',
    verified: 'Filtered by verified reports',
    unverified: 'Filtered by unverified reports',
    resolved: 'Filtered by resolved reports',
  };

  const Icon = iconMap[status];
  const color = statusColorMap[status];
  const statusText = statusTextMap[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex flex-col rounded-2xl border shadow-md p-4 xl:p-6 gap-2',
        isActive
          ? 'cursor-default'
          : 'cursor-pointer text-[#9E9E9E] hover:shadow-xl transition-shadow',
      )}
      style={
        isActive
          ? {
              borderColor: color,
              boxShadow: `0 0 10px ${color}40`,
              backgroundColor: `${color}10`,
            }
          : { borderColor: '#BDBDBD' }
      }
    >
      {isActive && (
        <div
          className='absolute inset-0 rounded-2xl pointer-events-none'
          style={{ backgroundColor: `${color}10` }}
        />
      )}
      <h3 className='font-poppins font-semibold text-base xl:text-xl'>
        {label.toUpperCase()}
      </h3>
      <div className='flex flex-col gap-2 flex-1'>
        <div className='flex justify-between flex-1'>
          <h2 className='font-bold text-2xl xl:text-4xl mt-auto'>{count}</h2>
          <div
            className='rounded-full p-3 xl:p-4 text-xl xl:text-2xl mt-auto'
            style={
              isActive
                ? { backgroundColor: `${color}25`, color: color }
                : { backgroundColor: '#E0E0E0' }
            }
          >
            <Icon className='size-[1.5em]!' />
          </div>
        </div>

        {isActive && (
          <div className='flex gap-2 items-center text-sm' style={{ color }}>
            <IconCircleCheck className='size-[1.5em]!' />
            <p>{statusText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
