import { formatDistanceToNow } from 'date-fns';
import {
  IconCircleCheck,
  IconClock,
  IconEye,
  IconMapPin,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useReportDialog } from '@/contexts/report-dialog-context';

export default function NeedsAttentionCard({
  id,
  location,
  description,
  reportedAt,
  confirms,
}: {
  id: number;
  location: string;
  description?: string;
  reportedAt: Date;
  confirms: number;
}) {
  const { openDialog } = useReportDialog();

  const color = '#F97316';

  return (
    <div
      className='grid border-l-4 rounded-lg p-4 gap-4'
      style={{ borderLeftColor: color, backgroundColor: `${color}10` }}
    >
      <div className='flex justify-between gap-8 items-center'>
        {/* Location */}
        <div className='font-poppins flex items-center gap-2 text-base font-semibold'>
          <IconMapPin
            className='size-[1.5em]! shrink-0'
            style={{ color: color }}
          />
          {location}
        </div>

        {/* Badge */}
        <Badge
          className='text-sm'
          style={{
            color: color,
            backgroundColor: `${color}10`,
            border: `1px solid ${color}`,
          }}
        >
          <IconCircleCheck className='size-[1.5em]! shrink-0' />
          {confirms}
        </Badge>
      </div>

      {/* description */}
      {description && <p className='text-sm line-clamp-2'>{description}</p>}

      <div className='flex items-center justify-between'>
        {/* reported at */}
        <div className='flex items-center text-sm gap-2 opacity-50'>
          <IconClock className='size-[1.5em]! shrink-0' />
          {formatDistanceToNow(new Date(reportedAt), { addSuffix: true })}
        </div>

        {/*review*/}
        <Button
          variant='ghost'
          size='sm'
          className='font-poppins flex items-center gap-2 text-[#0066CC] hover:bg-[#0066CC10] hover:text-[#0066CC]'
          onClick={() => openDialog('view', id)}
        >
          <span>REVIEW</span>
          <IconEye className='size-[1.25em]! shrink-0' />
        </Button>
      </div>
    </div>
  );
}
