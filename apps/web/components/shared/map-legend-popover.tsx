import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IconInfoCircle, IconStack2 } from '@tabler/icons-react';
import LegendItem from '../map/legend-item';

export default function MapLegendPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='relative flex flex-col bg-white/80 rounded-md shadow-lg p-0.5 pointer-events-auto'>
          <button
            className='aspect-square hover:bg-gray-200 rounded-md p-1'
            title='Toggle Legend'
          >
            <IconStack2 className='w-[1.5em]! h-[1.5em]!' strokeWidth={1.5} />
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side='left'
        className='flex flex-col bg-white rounded-xl shadow-md p-4 min-w-[200px] gap-3 h-fit'
      >
        <h3 className='text-sm font-semibold text-gray-600 flex items-center gap-2'>
          <IconInfoCircle className='w-[1.5em]! h-[1.5em]!' />{' '}
          <span>Flood Severity Level</span>
        </h3>

        <div className='space-y-2'>
          <LegendItem color='bg-[#FB2C36]' label='Critical' />
          <LegendItem color='bg-[#FF6900]' label='High' />
          <LegendItem color='bg-[#F0B204]' label='Moderate' />
          <LegendItem color='bg-[#2B7FFF]' label='Low' />
        </div>
      </PopoverContent>
    </Popover>
  );
}
