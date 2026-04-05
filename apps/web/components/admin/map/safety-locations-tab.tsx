'use client';

import CreateSafetyLocationDialog from './create-safety-location-dialog';
import { useMapFilterAdmin } from '@/contexts/map-filter-admin-context';
import { startTransition, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  SafetyLocationListItemInput,
  SafetyLocationListQueryInput,
} from '@repo/schemas';
import { useSafetyLocationList } from '@/hooks/use-safety-location-list';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SafetyLocationsCardSkeleton from '@/components/map/skeletons/safety-locations-card-skeleton';
import LocationsListEmpty from '@/components/map/empty/locations-list-empty';
import SafetyLocationsCard from '@/components/shared/safety-locations-card';
import PagePagination from '@/components/shared/page-pagination';
import { useSafetyLocationMapPins } from '@/hooks/use-safety-location-map-pins';
import { useMapHighlight } from '@/contexts/map-highlight-context';

export default function SafetyLocationsTab() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<'all-types' | 'shelter' | 'hospital'>(
    (searchParams.get('status') as 'all-types' | 'shelter' | 'hospital') ||
      'all-types',
  );
  const { q, filters } = useMapFilterAdmin();

  const activeTypes =
    type !== 'all-types'
      ? filters.safetyTypes.has(type)
        ? [type]
        : [] // dropdown pick is unchecked in popover = empty
      : [...filters.safetyTypes];

  const params: SafetyLocationListQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    types: activeTypes,
    q: q || undefined,
  };

  const { safetyMapPins } = useSafetyLocationMapPins();
  const { activePin, setActivePin } = useMapHighlight();

  const handleCardClick = (safetyId: number) => {
    const pin = safetyMapPins?.find((p) => p.id === safetyId);
    if (pin) {
      setActivePin({ type: 'safety', safety: pin });
    }
  };

  const { safetyList, meta, isLoading } = useSafetyLocationList(params);

  useEffect(() => {
    if (type !== 'all-types' && !filters.safetyTypes.has(type)) {
      startTransition(() => {
        setType('all-types');
        setPage(1);
      });
    }
  }, [filters.safetyTypes, type]);

  // reset page when popover filter changes
  useEffect(() => {
    startTransition(() => {
      setPage(1);
    });
  }, [filters.safetyTypes, q]);

  return (
    <>
      <CreateSafetyLocationDialog />
      <div className='flex-1 flex flex-col rounded-2xl border min-h-0 overflow-hidden'>
        <Select
          value={type}
          onValueChange={(value) => {
            setType(value as 'all-types' | 'shelter' | 'hospital');
            setPage(1);
          }}
        >
          <SelectTrigger className='w-full text-sm text-gray-600 py-3 justify-between'>
            <SelectValue placeholder='All Types' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='all-types'>All Types</SelectItem>
            {(['shelter', 'hospital'] as const).map((type) =>
              filters.safetyTypes.has(type) ? (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ) : null,
            )}
          </SelectContent>
        </Select>

        <div className='flex-1 overflow-hidden min-h-0'>
          <div className='flex flex-col p-4 overflow-y-auto h-full'>
            {isLoading ? (
              <div className='space-y-4'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SafetyLocationsCardSkeleton key={i} />
                ))}
              </div>
            ) : safetyList && safetyList.length > 0 ? (
              <div className='space-y-4'>
                {safetyList?.map((safety: SafetyLocationListItemInput) => (
                  <SafetyLocationsCard
                    key={safety.id}
                    isActive={
                      activePin?.type === 'safety' &&
                      activePin.safety.id === safety.id
                    }
                    type={safety.type}
                    location={safety.location}
                    address={safety.address}
                    availability={safety.availability}
                    onClick={() => handleCardClick(safety.id)}
                  />
                ))}
              </div>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <LocationsListEmpty
                  title='No safety locations found'
                  description='Try adjusting your filters or check back later for updates.'
                />
              </div>
            )}
          </div>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className='mt-auto border-t p-2 rounded-b-2xl'>
            <PagePagination
              currentPage={meta?.page ?? 1}
              totalPages={meta?.totalPages ?? 1}
              hasNextPage={meta?.hasNextPage ?? false}
              hasPrevPage={meta?.hasPrevPage ?? false}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </>
  );
}
