import { formatDistanceToNow } from 'date-fns';
import { IconClock, IconMapPin } from '@tabler/icons-react';
import { SEVERITY_COLOR_MAP } from '@/lib/utils/get-color-map';
import { Badge } from '@/components/ui/badge';

export default function AffectedLocationCard({
  severity,
  location,
  description,
  reportedAt,
}: {
  severity: 'critical' | 'high' | 'moderate' | 'low';
  location: string;
  description?: string;
  reportedAt: Date;
}) {
  const color = SEVERITY_COLOR_MAP[severity];

  return (
    <div
      className='grid border-l-4 rounded-lg p-4 gap-4'
      style={{ borderLeftColor: color, backgroundColor: `${color}10` }}
    >
      <div className='flex justify-between gap-8 items-center'>
        {/* Location */}
        <div className='font-poppins flex items-start gap-2 text-base font-semibold'>
          <IconMapPin
            className='size-[1.5em]! shrink-0'
            style={{ color: color }}
          />
          {location}
        </div>

        {/* Badge */}
        <Badge
          className='text-sm self-start'
          style={{ color: color, backgroundColor: `${color}25` }}
        >
          {severity?.toUpperCase()}
        </Badge>
      </div>

      {/* description */}
      {description && <p className='text-sm line-clamp-2'>{description}</p>}

      {/* reported at */}
      <div className='flex items-center text-sm gap-2 text-gray-600'>
        <IconClock className='size-[1.5em]! shrink-0' />
        {formatDistanceToNow(new Date(reportedAt), { addSuffix: true })}
      </div>
    </div>
  );
}
