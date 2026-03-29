'use client';

import InteractiveMap, {
  InteractiveMapHandle,
} from '@/components/admin/map/interactive-map';
import MapLegendPopover from '@/components/shared/map-legend-popover';
import { IconCurrentLocation, IconMinus, IconPlus } from '@tabler/icons-react';
import { useRef } from 'react';

export default function MapLeft() {
  const interactiveMapRef = useRef<InteractiveMapHandle>(null);

  return (
    <div className='relative flex-2 bg-gray-100 min-h-0 rounded-2xl overflow-hidden border'>
      <InteractiveMap ref={interactiveMapRef} />

      <div className='absolute top-4 right-4 z-10 pointer-events-none flex flex-col gap-2 h-fit'>
        {/* zoom buttons */}
        <div className='flex flex-col bg-white/80 rounded-md shadow-lg p-0.5 pointer-events-auto'>
          <button
            onClick={() => interactiveMapRef.current?.zoomIn()}
            className='aspect-square hover:bg-gray-200 rounded-md p-1'
            title='Zoom In'
          >
            <IconPlus className='w-[1.5em]! h-[1.5em]!' strokeWidth={1.5} />
          </button>
          <button
            onClick={() => interactiveMapRef.current?.zoomOut()}
            className='aspect-square hover:bg-gray-200 rounded-md p-1'
            title='Zoom Out'
          >
            <IconMinus className='w-[1.5em]! h-[1.5em]!' strokeWidth={1.5} />
          </button>
        </div>

        {/* geolocate */}
        <div className='flex flex-col bg-white/80 rounded-md shadow-lg p-0.5 pointer-events-auto'>
          <button
            onClick={() => interactiveMapRef.current?.geolocate()}
            className='aspect-square hover:bg-gray-200 rounded-md p-1'
            title='Geolocate'
          >
            <IconCurrentLocation
              className='w-[1.5em]! h-[1.5em]!'
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* toggle legend */}
        <MapLegendPopover />
      </div>
    </div>
  );
}
