'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { useMapFilter } from '@/contexts/map-filter-context';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const { activeOverlay, close } = useMapOverlay();
  const { setQ } = useMapFilter();

  const handleSearch = useDebouncedCallback((term: string) => {
    setQ(term);
  }, 300);

  return (
    <div className='flex flex-col z-50 w-full h-fit pointer-events-auto'>
      <InputGroup className='h-12 rounded-xl bg-white shadow-md'>
        <InputGroupInput
          placeholder={
            activeOverlay?.type === 'affected-list'
              ? 'Search affected locations...'
              : activeOverlay?.type === 'safety-list'
                ? 'Search safety locations...'
                : 'Search locations...'
          }
          onChange={
            activeOverlay?.type === 'affected-list' ||
            activeOverlay?.type === 'safety-list'
              ? (e) => handleSearch(e.currentTarget.value)
              : undefined
          }
        />

        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>

        {activeOverlay && (
          <InputGroupAddon align='inline-end'>
            <button
              className='mr-2 opacity-70 hover:opacity-100 transition'
              onClick={close}
            >
              <IconX className='w-[1.5em]! h-[1.5em]!' />
            </button>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
