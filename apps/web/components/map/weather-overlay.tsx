import { useIsMobile } from '@/hooks/use-mobile';
import WeatherAccordion from './weather-accordion';
import WeatherDrawer from './weather-drawer';
import { useMapOverlay } from '@/contexts/map-overlay-context';

export default function WeatherOverlay({
  location,
}: {
  location: { latitude: number; longitude: number } | null;
}) {
  const isMobile = useIsMobile();
  const { activeOverlay } = useMapOverlay();

  if (activeOverlay) return null; // Don't show weather if any other overlay is active

  if (isMobile) {
    return (
      <div className='absolute inset-0 flex flex-col h-full w-full'>
        <WeatherDrawer
          latitude={location?.latitude ?? null}
          longitude={location?.longitude ?? null}
        />
      </div>
    );
  }

  return (
    <div className='absolute bottom-4 left-4 max-w-xs w-full z-10 flex flex-col'>
      <WeatherAccordion
        latitude={location?.latitude ?? null}
        longitude={location?.longitude ?? null}
      />
    </div>
  );
}
