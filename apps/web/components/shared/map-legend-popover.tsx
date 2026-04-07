'use client';

import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IconStack2 } from '@tabler/icons-react';
import {
  SAFETY_TYPE_COLOR_MAP,
  SEVERITY_COLOR_MAP,
} from '@/lib/utils/get-color-map';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

export default function MapLegendPopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className='relative flex flex-col bg-white/80 rounded-md shadow-lg p-0.5 pointer-events-auto'>
          <button
            className={cn(
              'aspect-square rounded-md p-1',
              open ? 'bg-gray-200 ' : 'hover:bg-gray-200',
            )}
            title='Toggle Legend'
          >
            <IconStack2 className='w-[1.5em]! h-[1.5em]!' strokeWidth={1.5} />
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side='left'
        className='flex flex-col bg-white rounded-xl shadow-md p-4 gap-3 h-fit w-[220px] sm:w-[260px] max-w-[calc(100vw-4rem)]'
      >
        <span className='font-poppins font-medium text-sm'>MAP LEGEND</span>

        <Separator />

        <div className='flex flex-col gap-2 text-xs'>
          <span className='font-poppins font-medium opacity-50'>
            FLOOD SEVERITY
          </span>

          {(['critical', 'high', 'moderate', 'low'] as const).map(
            (severity) => (
              <div key={severity}>
                <div className='font-poppins font-normal gap-2 flex items-center text-sm'>
                  <span
                    className=' inline-block w-3 h-3 rounded-full'
                    style={{ backgroundColor: SEVERITY_COLOR_MAP[severity] }}
                  />
                  {severity.toUpperCase()}
                </div>
              </div>
            ),
          )}
        </div>

        <Separator />
        <div className='flex flex-col gap-2 text-xs'>
          <span className='font-poppins font-medium opacity-50 '>
            SAFETY LOCATIONS
          </span>

          {(['shelter', 'hospital'] as const).map((type) => (
            <div key={type}>
              <div className='font-poppins font-normal gap-2 flex items-center text-sm'>
                <span
                  className=' inline-block w-3 h-3 rounded-sm'
                  style={{ backgroundColor: SAFETY_TYPE_COLOR_MAP[type] }}
                />
                {type.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
