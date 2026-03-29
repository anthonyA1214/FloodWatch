'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { Drawer } from 'vaul';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { IconShieldCheck } from '@tabler/icons-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { useSafetyList } from '@/hooks/use-safety-list';
import { useMapPopup } from '@/contexts/map-popup-context';
import { useSafetyMapPins } from '@/hooks/use-safety-map-pins';
import { useMapFilter } from '@/contexts/map-filter-context';
import SafetyLocationsCardSkeleton from './skeletons/safety-locations-card-skeleton';
import LocationsListEmpty from './empty/locations-list-empty';
import { SafetyListItemInput, SafetyLocationQueryInput } from '@repo/schemas';
import { useSearchParams } from 'next/navigation';
import PagePagination from '../shared/page-pagination';
import SafetyLocationsCard from '../shared/safety-locations-card';

const snapPoints = ['0px', '355px', 1];

export default function SafetyLocationsListDrawer() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<'all-types' | 'shelter' | 'hospital'>(
    (searchParams.get('status') as 'all-types' | 'shelter' | 'hospital') ||
      'all-types',
  );
  const { q } = useMapFilter();

  const params: SafetyLocationQueryInput = {
    page: Number(page),
    limit: Number(searchParams.get('limit') || '10'),
    type: type === 'all-types' ? undefined : type,
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

  const [snap, setSnap] = useState<number | string | null>(snapPoints[1]);
  const [open, setOpen] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) close();
  };

  return (
    <Drawer.Root
      modal={false}
      dismissible={true}
      handleOnly={true}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={(newSnap) => {
        if (newSnap === snapPoints[0]) {
          handleOpenChange(false);
        } else {
          setSnap(newSnap);
        }
      }}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Drawer.Overlay className='absolute inset-0 bg-black/40 pointer-events-none' />

      <Drawer.Content
        data-testid='content'
        className='z-1 absolute flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-full -mx-px'
      >
        <Drawer.Handle className='w-16! my-3! rounded-full! shrink-0!' />

        <VisuallyHidden>
          <Drawer.Title>Safety Locations</Drawer.Title>
        </VisuallyHidden>

        <div
          className={clsx('flex flex-col max-w-lg mx-auto w-full pt-5 gap-2', {
            'overflow-y-auto': snap === 1,
            'overflow-hidden': snap !== 1,
          })}
        >
          <div className='flex flex-col gap-4 flex-1 min-h-0'>
            {/* Header */}

            <div className='flex items-center gap-2 font-semibold text-lg px-3'>
              <IconShieldCheck className='w-[1.5em]! h-[1.5em]! text-[#0066CC]' />
              <span>Safety Locations</span>
            </div>

            <Separator />

            {/* Filter using Select */}
            <div className='px-3'>
              <Select
                defaultValue={type}
                onValueChange={(value) =>
                  setType(value as 'all-types' | 'shelter' | 'hospital')
                }
              >
                <SelectTrigger className='w-full text-sm text-gray-600 py-3 justify-between'>
                  <SelectValue placeholder='All Types' />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value='all-types'>All Types</SelectItem>
                  <SelectItem value='shelter'>Shelter</SelectItem>
                  <SelectItem value='hospital'>Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 px-3 pb-3'>
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
      </Drawer.Content>
    </Drawer.Root>
  );
}
