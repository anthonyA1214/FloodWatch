import { useIsMobile } from '@/hooks/use-mobile';
import WeatherAccordion from './weather-accordion';
import WeatherDrawer from './weather-drawer';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { toast } from 'sonner';
import { useWeather } from '@/hooks/use-weather';

export default function WeatherOverlay({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const isMobile = useIsMobile();
  const { activeOverlay } = useMapOverlay();

  const { isError } = useWeather(latitude, longitude);

  if (isError) {
    toast.error('Unable to fetch weather data for your location.');
    return null;
  }

  if (activeOverlay) return null; // Don't show weather if any other overlay is active

  if (isMobile) {
    return (
      <div className='absolute inset-0 flex flex-col h-full w-full'>
        <WeatherDrawer
          latitude={latitude ?? null}
          longitude={longitude ?? null}
        />
      </div>
    );
  }

  return (
    <div className='absolute bottom-4 left-4 max-w-xs w-full z-10 flex flex-col'>
      <WeatherAccordion
        latitude={latitude ?? null}
        longitude={longitude ?? null}
      />
    </div>
  );
}
