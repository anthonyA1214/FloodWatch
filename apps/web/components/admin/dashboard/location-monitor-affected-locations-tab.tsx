import { useRecentReports } from '@/hooks/use-dashboard';
import LocationsListEmpty from '@/components/map/empty/locations-list-empty';
import AffectedLocationCard from './affected-location-card';
import AffectedLocationCardSkeleton from './skeleton/affected-location-card-skeleton';

export default function LocationMonitorAfftedLocationsTab() {
  const { recentReports, isLoading } = useRecentReports();

  return (
    <div className='flex flex-col h-full overflow-y-auto'>
      {isLoading ? (
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <AffectedLocationCardSkeleton key={i} />
          ))}
        </div>
      ) : recentReports && recentReports.length > 0 ? (
        <div className='space-y-4'>
          {recentReports.map((location) => (
            <AffectedLocationCard
              key={location.id}
              severity={location.severity}
              location={location.location}
              description={location.description}
              reportedAt={location.reportedAt}
            />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <LocationsListEmpty
            title='No affected locations'
            description='There are no recent reports of affected locations at the moment.'
          />
        </div>
      )}
    </div>
  );
}
