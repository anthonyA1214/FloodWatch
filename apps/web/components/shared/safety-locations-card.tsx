import { SAFETY_TYPE_COLOR_MAP } from '@/lib/utils/get-color-map';
import { IconCircleCheck, IconMapPin } from '@tabler/icons-react';
import { Badge } from '../ui/badge';

export default function SafetyLocationsCard({
  type,
  isActive,
  location,
  address,
  availability,
  onClick,
}: {
  type: 'hospital' | 'shelter';
  isActive?: boolean;
  location: string;
  address: string;
  availability?: string;
  onClick?: () => void;
}) {
  const color = SAFETY_TYPE_COLOR_MAP[type];

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
            className='size-[1.5em]! shrink-0!'
            style={{ color: color }}
          />
          {location}
        </div>

        {/* Badge */}
        <Badge
          className='text-xs'
          style={{ backgroundColor: `${color}25`, color }}
        >
          {type.toUpperCase()}
        </Badge>
      </div>

      {/* address */}
      <p className='text-sm line-clamp-2'>{address}</p>

      {/* availability */}
      {availability && (
        <div className='flex items-center text-xs gap-2 text-gray-600'>
          <IconCircleCheck className='size-[1.5em]! shrink-0' />
          {availability}
        </div>
      )}
    </div>
  );
}
