import MapLeft from '@/components/admin/map/map-left';
import MapRight from '@/components/admin/map/map-right';
import SearchBar from '@/components/admin/map/search-bar';
import { MapFilterAdminProvider } from '@/contexts/map-filter-admin-context';
import { MapHighlightProvider } from '@/contexts/map-highlight-context';

export default function InteractiveMapPage() {
  return (
    <MapFilterAdminProvider>
      <MapHighlightProvider>
        <div className='flex-1 flex flex-col bg-white p-8 rounded-2xl gap-8 min-h-0'>
          {/* Header */}
          <h1 className='font-poppins text-3xl font-bold'>Interactive Map</h1>

          <div className='flex-1 flex flex-col min-h-0 gap-6'>
            <SearchBar />

            <div className='flex flex-1 gap-6 min-h-0'>
              {/* Map Panel */}
              <MapLeft />

              {/* Locations Panel */}
              <MapRight />
            </div>
          </div>
        </div>
      </MapHighlightProvider>
    </MapFilterAdminProvider>
  );
}
