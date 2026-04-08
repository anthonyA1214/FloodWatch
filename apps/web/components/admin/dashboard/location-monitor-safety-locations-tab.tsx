import { useRecentSafetyLocations } from '@/hooks/use-dashboard';
import SafetyLocationCardSkeleton from './skeleton/safety-location-card-skeleton';
import SafetyLocationCard from './safety-location-card';
import LocationsListEmpty from '@/components/map/empty/locations-list-empty';

export default function LocationMonitorSafetyLocationsTab() {
  const { recentSafetyLocations, isLoading } = useRecentSafetyLocations();

  return (
    <div className='flex flex-col h-full overflow-y-auto'>
      {isLoading ? (
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <SafetyLocationCardSkeleton key={i} />
          ))}
        </div>
      ) : recentSafetyLocations && recentSafetyLocations.length > 0 ? (
        <div className='space-y-4'>
          {recentSafetyLocations.map((location) => (
            <SafetyLocationCard
              key={location.id}
              type={location.type}
              location={location.location}
              address={location.address}
              availability={location.availability}
            />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <LocationsListEmpty
            title='No Recent Safety Locations'
            description='Please check back later or add new safety locations.'
          />
        </div>
      )}
    </div>
  );
}
