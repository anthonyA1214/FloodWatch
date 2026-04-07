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
  const { setQ, inputValue, setInputValue } = useMapFilter();

  const handleSearch = useDebouncedCallback((term: string) => {
    setQ(term);
  }, 300);

  const handleClose = () => {
    if (
      activeOverlay?.type === 'affected-list' ||
      activeOverlay?.type === 'safety-list'
    ) {
      setInputValue('');
      setQ('');
    }
    close();
  };

  return (
    <div className='flex flex-col z-50 w-full h-fit pointer-events-auto'>
      <InputGroup className='h-12 rounded-xl bg-white shadow-md'>
        <InputGroupInput
          value={inputValue}
          placeholder={
            activeOverlay?.type === 'affected-list'
              ? 'Search affected locations...'
              : activeOverlay?.type === 'safety-list'
                ? 'Search safety locations...'
                : 'Search locations...'
          }
          onChange={(e) => {
            setInputValue(e.currentTarget.value);
            handleSearch(e.currentTarget.value);
          }}
        />

        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>

        {activeOverlay && (
          <InputGroupAddon align='inline-end'>
            <button
              className='mr-2 opacity-70 hover:opacity-100 transition'
              onClick={handleClose}
            >
              <IconX className='size-[1.5em]! shrink-0' />
            </button>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
