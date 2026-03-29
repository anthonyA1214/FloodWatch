'use client';

import { IconChevronLeft, IconShieldCheck } from '@tabler/icons-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import SafetyLocationsCard from '../shared/safety-locations-card';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { useSafetyList } from '@/hooks/use-safety-list';
import { useMapFilter } from '@/contexts/map-filter-context';
import { useSafetyMapPins } from '@/hooks/use-safety-map-pins';
import { useMapPopup } from '@/contexts/map-popup-context';
import { startTransition, useEffect, useState } from 'react';
import SafetyLocationsCardSkeleton from './skeletons/safety-locations-card-skeleton';
import LocationsListEmpty from './empty/locations-list-empty';
import { useSearchParams } from 'next/navigation';
import {
  SafetyListItemInput,
  SafetyLocationListQueryInput,
} from '@repo/schemas';
import PagePagination from '../shared/page-pagination';

export default function SafetyLocationsListPanel() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<'all-types' | 'shelter' | 'hospital'>(
    (searchParams.get('status') as 'all-types' | 'shelter' | 'hospital') ||
      'all-types',
  );
  const { q, filters } = useMapFilter();

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

  const { safetyList, meta, isLoading } = useSafetyList(params);
  const { close } = useMapOverlay();
  const { activePopup, openSafetyPopup } = useMapPopup();
  const { safetyMapPins } = useSafetyMapPins();

  const handleCardClick = (safetyId: number) => {
    const pin = safetyMapPins?.find((p) => p.id === safetyId);
    if (pin) {
      openSafetyPopup(pin);
    }
  };

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
    <div className='relative w-full h-full bg-white z-50 min-h-0 flex flex-col pointer-events-auto pt-16'>
      <button
        className='absolute bg-white top-1/2 translate-x-full right-0 h-16 -translate-y-1/2
        rounded-r-2xl ps-1 py-1 pr-1.5 text-xs z-30 shadow-[4px_0px_6px_-1px_rgba(0,0,0,0.1)]'
        onClick={close}
      >
        <IconChevronLeft className='w-[1.5em]! h-[1.5em]!' />
      </button>

      <div className='flex flex-col flex-1 min-h-0'>
        <div className='flex flex-col flex-1 min-h-0 gap-4 pt-4'>
          {/* Header */}
          <div className='flex items-center gap-2 font-semibold text-lg px-4'>
            <IconShieldCheck className='w-[1.5em]! h-[1.5em]! text-[#0066CC]' />
            <span>Safety Locations</span>
          </div>

          <Separator />

          {/* Filter using Select */}
          <div className='px-4'>
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
          </div>

          {/* Content */}
          <div className='flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 px-4 pb-4'>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SafetyLocationsCardSkeleton key={i} />
              ))
            ) : !safetyList || safetyList?.length === 0 ? (
              <LocationsListEmpty />
            ) : (
              safetyList?.map((safety: SafetyListItemInput) => (
                <SafetyLocationsCard
                  key={safety.id}
                  isActive={
                    activePopup?.type === 'safety' &&
                    activePopup?.safety?.id === safety.id
                  }
                  type={safety.type}
                  location={safety.location}
                  address={safety.address}
                  availability={safety.availability}
                  onClick={() => handleCardClick(safety.id)}
                />
              ))
            )}
          </div>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className='mt-auto flex justify-center py-2 border-t border-gray-200'>
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
    </div>
  );
}
