'use client';

import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { Separator } from '../ui/separator';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Checkbox } from '../ui/checkbox';
import {
  SAFETY_TYPE_COLOR_MAP,
  SEVERITY_COLOR_MAP,
} from '@/lib/utils/get-color-map';
import {
  FloodSeverity,
  MapFilters,
  SafetyType,
} from '@/contexts/map-filter-base';
import { cn } from '@/lib/utils';

type MapFilterPopoverProps = {
  filters: MapFilters;
  toggleSeverity: (severity: FloodSeverity) => void;
  toggleSafetyType: (safetyType: SafetyType) => void;
  resetFilters: () => void;
};

export default function MapFilterPopover({
  filters,
  toggleSeverity,
  toggleSafetyType,
  resetFilters,
}: MapFilterPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className='flex flex-col bg-white/80 rounded-md shadow-lg p-0.5 pointer-events-auto'>
          <button
            className={cn(
              'aspect-square rounded-md p-1',
              open ? 'bg-gray-200' : 'hover:bg-gray-200',
            )}
            title='Filter'
          >
            <IconAdjustmentsHorizontal
              className='w-[1.5em]! h-[1.5em]!'
              strokeWidth={1.5}
            />
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side='left'
        className='flex flex-col bg-white rounded-xl shadow-md p-4 min-w-[200px] gap-4 h-fit'
      >
        <div className='flex items-center justify-between text-sm'>
          <span className='font-poppins font-medium'>MAP FILTERS</span>

          <button
            className='font-poppins font-medium opacity-50'
            onClick={resetFilters}
          >
            RESET
          </button>
        </div>

        <Separator />

        {/*flood severity*/}
        <div className='flex flex-col gap-2 text-xs'>
          <h3 className='font-semibold flex items-center gap-2'>
            <span className='font-poppins font-medium opacity-50'>
              FLOOD SEVERITY
            </span>
          </h3>

          <div className='space-y-2'>
            {(['critical', 'high', 'moderate', 'low'] as const).map(
              (severity) => (
                <FieldGroup key={severity}>
                  <Field
                    orientation='horizontal'
                    className='flex items-center justify-between'
                  >
                    <FieldLabel
                      htmlFor={severity}
                      className='font-poppins font-normal'
                    >
                      <span
                        className='w-3 h-3 rounded-full'
                        style={{
                          backgroundColor: SEVERITY_COLOR_MAP[severity],
                        }}
                      />
                      {severity.toUpperCase()}
                    </FieldLabel>
                    <Checkbox
                      id={severity}
                      name={severity}
                      checked={filters.severities.has(severity)}
                      onCheckedChange={() => toggleSeverity(severity)}
                    />
                  </Field>
                </FieldGroup>
              ),
            )}
          </div>
        </div>

        <Separator />

        {/*safety locations*/}
        <div className='flex flex-col gap-2 text-xs'>
          <h3 className='font-semibold flex items-center gap-2'>
            <span className='font-poppins font-medium opacity-50'>
              SAFETY LOCATIONS
            </span>
          </h3>

          <div className='space-y-2'>
            {(['shelter', 'hospital'] as const).map((type) => (
              <FieldGroup key={type}>
                <Field
                  orientation='horizontal'
                  className='flex items-center justify-between'
                >
                  <FieldLabel
                    htmlFor={type}
                    className='font-poppins font-normal'
                  >
                    <span
                      className='w-3 h-3 rounded-sm'
                      style={{ backgroundColor: SAFETY_TYPE_COLOR_MAP[type] }}
                    />
                    {type.toUpperCase()}
                  </FieldLabel>
                  <Checkbox
                    id={type}
                    name={type}
                    checked={filters.safetyTypes.has(type)}
                    onCheckedChange={() => toggleSafetyType(type)}
                  />
                </Field>
              </FieldGroup>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
