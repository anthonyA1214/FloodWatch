import { SAFETY_TYPE_COLOR_MAP } from '@/lib/utils/get-color-map';
import { IconCircleCheck, IconMapPin } from '@tabler/icons-react';

export default function SafetyLocationsCard({
  type = 'hospital',
  isActive = false,
  location = 'Community Safe Haven',
  address = '123 Safety St, Safeville',
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
          <span className='text-xs font-medium'>{type.toUpperCase()}</span>
        </div>
      </div>

      {/* address */}
      <p className='text-sm'>{address}</p>

      {/* availability */}
      {availability && (
        <div className='flex items-center text-xs gap-2 text-gray-600'>
          <IconCircleCheck className='w-[1.5em]! h-[1.5em]!' />
          {availability}
        </div>
      )}
    </div>
  );
}
