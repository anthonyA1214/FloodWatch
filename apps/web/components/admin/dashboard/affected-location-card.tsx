import { formatDistanceToNow } from 'date-fns';
import { IconClock, IconMapPin } from '@tabler/icons-react';
import { SEVERITY_COLOR_MAP } from '@/lib/utils/get-color-map';
import { Badge } from '@/components/ui/badge';

export default function AffectedLocationCard({
  severity = 'high',
  location = 'Barangay 176',
  description = 'Floodwaters reaching waist level, residents advised to evacuate immediately.',
  reportedAt = '2026-01-28T10:30:00Z',
}: {
  severity: 'critical' | 'high' | 'moderate' | 'low';
  location: string;
  description: string;
  reportedAt: string;
}) {
  const color = SEVERITY_COLOR_MAP[severity];

  return (
    <div
      className='grid border-l-4 rounded-lg p-4 gap-4'
      style={{ borderLeftColor: color, backgroundColor: `${color}10` }}
    >
      <div className='flex justify-between gap-8 items-center'>
        {/* Location */}
        <div className='font-poppins flex items-center gap-2 text-base font-semibold'>
          <IconMapPin
            className='w-[1.5em]! h-[1.5em]!'
            style={{ color: color }}
          />
          {location}
        </div>

        {/* Badge */}
        <Badge
          className='text-sm'
          style={{ color: color, backgroundColor: `${color}25` }}
        >
          {severity?.toUpperCase()}
        </Badge>
      </div>

      {/* description */}
      <p>{description}</p>

      {/* reported at */}
      <div className='flex items-center text-sm gap-2 text-gray-600'>
        <IconClock className='w-[1.5em]! h-[1.5em]!' />
        {formatDistanceToNow(new Date(reportedAt), { addSuffix: true })}
      </div>
    </div>
  );
}
