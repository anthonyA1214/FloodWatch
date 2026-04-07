import { Badge } from '@/components/ui/badge';
import { SAFETY_TYPE_COLOR_MAP } from '@/lib/utils/get-color-map';
import { IconClock, IconMapPin } from '@tabler/icons-react';

export default function SafetyLocationCard({
  type = 'hospital',
  location = 'Community Safe Haven',
  address = '123 Safety St, Safeville',
  availability = 'Open 24/7',
}: {
  type: 'hospital' | 'shelter';
  location: string;
  address: string;
  availability: string;
}) {
  const color = SAFETY_TYPE_COLOR_MAP[type];

  return (
    <div
      className='grid border-l-4 rounded-lg p-4 gap-4'
      style={{ borderLeftColor: color, backgroundColor: `${color}10` }}
    >
      <div className='flex justify-between items-center gap-8'>
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
          {type?.toUpperCase()}
        </Badge>
      </div>

      {/* address */}
      {address && <p className='text-sm line-clamp-2'>{address}</p>}

      {/* availability */}
      {availability && (
        <div className='flex items-center text-sm gap-2 text-gray-600'>
          <IconClock className='size-[1.5em]! shrink-0' />
          {availability}
        </div>
      )}
    </div>
  );
}
