import { formatDistanceToNow } from 'date-fns';
import { IconClock, IconMapPin } from '@tabler/icons-react';
import { SEVERITY_COLOR_MAP } from '@/lib/utils/get-color-map';

export default function AffectedLocationsCard({
  severity = 'high',
  isActive = false,
  location = 'Barangay 176',
  description = 'Floodwaters reaching waist level, residents advised to evacuate immediately.',
  reportedAt = new Date(),
  onClick,
}: {
  severity: 'critical' | 'high' | 'moderate' | 'low';
  isActive?: boolean;
  location: string;
  description: string | null;
  reportedAt: Date;
  onClick?: () => void;
}) {
  const color = SEVERITY_COLOR_MAP[severity];

  return (
    <div
      className='grid rounded-lg p-4 gap-3 border cursor-pointer'
      onClick={onClick}
      style={{
        borderColor: isActive ? color : '',
        backgroundColor: isActive ? `${color}25` : '',
      }}
    >
      <div className='flex justify-between gap-8 items-start'>
        {/* Location */}
        <div className='font-poppins flex items-start gap-2 text-sm font-semibold'>
          <IconMapPin
            className='w-[1.5em]! h-[1.5em]! shrink-0!'
            style={{ color: color }}
          />
          {location}
        </div>

        {/* Badge */}
        <div
          className='flex items-center rounded-full px-3 py-1'
          style={{ color: color, backgroundColor: `${color}25` }}
        >
          <span className='text-xs font-medium'>{severity.toUpperCase()}</span>
        </div>
      </div>

      {/* description */}
      <p className='text-sm'>{description}</p>

      {/* reported at */}
      <div className='flex items-center text-xs gap-2 text-gray-600'>
        <IconClock className='w-[1.5em]! h-[1.5em]!' />
        {formatDistanceToNow(new Date(reportedAt), { addSuffix: true })}
      </div>
    </div>
  );
}
