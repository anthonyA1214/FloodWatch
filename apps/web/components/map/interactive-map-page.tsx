'use client';

import SearchBar from '@/components/map/search-bar';
import InteractiveMap, {
  InteractiveMapHandle,
} from '@/components/map/interactive-map';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { GoogleLinkToastHandler } from '@/components/shared/google-link-toast-handler';
import { IconCurrentLocation, IconMinus, IconPlus } from '@tabler/icons-react';
import NotificationOverlay from '@/components/map/notification-overlay';
import ProfileOverlay from '@/components/map/profile-overlay';
import AffectedLocationOverlay from './affected-location-overlay';
import AffectedLocationsListOverlay from './affected-locations-list-overlay';
import SafetyLocationsListOverlay from './safety-locations-list-overlay';
import WeatherOverlay from './weather-overlay';
import SafetyLocationOverlay from './safety-location-overlay';
import MapLegendPopover from '../shared/map-legend-popover';
import MapFilterPopover from '../shared/map-filter-popover';
import { useMapFilter } from '@/contexts/map-filter-context';
import HotlinesAccordion from './hotlines-accordion';
import { useWeather } from '@/hooks/use-weather';
import { getUserLocation } from '@/lib/utils/get-user-location';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function InteractiveMapPage() {
  const { activeOverlay } = useMapOverlay();
  const interactiveMapRef = useRef<InteractiveMapHandle>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const pos = await getUserLocation();
        setLocation(pos);
      } catch {
        toast.error('Unable to retrieve your location.');
      }
    };

    fetchLocation();
  }, []);

  const { isError } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null,
  );

  const { filters, toggleSeverity, toggleSafetyType, resetFilters } =
    useMapFilter();

  return (
    <div className='relative w-full h-full'>
      <InteractiveMap ref={interactiveMapRef} />

      {/* static hotlines pill (only when no overlay is active) */}
      {!activeOverlay && (
        <div
          className={cn(
            'absolute right-4 z-10 ',
            isError ? 'bottom-4 md:bottom-4' : 'bottom-20 md:bottom-4',
          )}
        >
          <HotlinesAccordion />
        </div>
      )}

      {/* Top bar: search + controls in one row */}
      <div className='absolute top-0 left-0 right-0 flex items-start gap-4 pointer-events-none h-full'>
        {/* Search bar + affected panel share the left flex slot */}
        <div className='pointer-events-none flex-1 min-w-0 flex items-start h-full'>
          <div className='md:relative md:max-w-md w-full h-full'>
            <div className='md:absolute flex-1 w-full sm:flex-none pt-4 ps-4 md:px-4 z-20'>
              <SearchBar />
            </div>

            {activeOverlay?.type === 'report' && (
              <AffectedLocationOverlay reportId={activeOverlay.reportId} />
            )}

            {activeOverlay?.type === 'safety' && (
              <SafetyLocationOverlay safetyId={activeOverlay.safetyId} />
            )}

            {activeOverlay?.type === 'affected-list' && (
              <AffectedLocationsListOverlay />
            )}

            {activeOverlay?.type === 'safety-list' && (
              <SafetyLocationsListOverlay />
            )}
          </div>

          {!isError && location && (
            <WeatherOverlay
              latitude={location?.latitude ?? null}
              longitude={location?.longitude ?? null}
            />
          )}
        </div>

        {/* Map controls — fixed to right */}
        <div className='pointer-events-none flex flex-col gap-2 h-fit pt-4 pe-4'>
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

          {/*  */}
          <MapFilterPopover
            filters={filters}
            toggleSeverity={toggleSeverity}
            toggleSafetyType={toggleSafetyType}
            resetFilters={resetFilters}
          />
        </div>

        {(activeOverlay?.type === 'notification' ||
          activeOverlay?.type === 'profile') && (
          <div className='absolute z-10 flex gap-4 inset-0 md:inset-auto md:top-0 md:right-0 md:p-4'>
            {activeOverlay.type === 'notification' && <NotificationOverlay />}
            {activeOverlay.type === 'profile' && <ProfileOverlay />}
          </div>
        )}

        <Suspense fallback={null}>
          <GoogleLinkToastHandler />
        </Suspense>
      </div>
    </div>
  );
}
