'use client';

import { Spinner } from '@/components/ui/spinner';
import dynamic from 'next/dynamic';
import { MapProvider } from 'react-map-gl/maplibre';
import { MapRoutingProvider } from '@/contexts/map-routing-context';
import { useEffect } from 'react';
import { useMapOnboardingTour } from '@/hooks/use-map-onboarding-tour';

const InteractiveMapPage = dynamic(
  () => import('@/components/map/interactive-map-page'),
  {
    ssr: false,
    loading: () => (
      <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 pointer-events-none'>
        <Spinner className='size-16' />
        <span className='text-lg font-medium'>Loading map...</span>
      </div>
    ),
  },
);

export default function InteractiveMapPageWrapper() {
  const { maybeStartOnboardingTourForNewUser, forceStartOnboardingTour } =
    useMapOnboardingTour();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem('start_map_tour') === 'true'
    ) {
      window.localStorage.removeItem('start_map_tour');
      forceStartOnboardingTour();
    } else {
      maybeStartOnboardingTourForNewUser();
    }
  }, [maybeStartOnboardingTourForNewUser, forceStartOnboardingTour]);

  return (
    <MapProvider>
      <MapRoutingProvider>
        <InteractiveMapPage />
      </MapRoutingProvider>
    </MapProvider>
  );
}
