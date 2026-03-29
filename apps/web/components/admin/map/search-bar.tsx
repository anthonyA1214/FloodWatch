'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useMapFilterAdmin } from '@/contexts/map-filter-admin-context';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const { setQ, activeTab } = useMapFilterAdmin();

  const handleSearch = useDebouncedCallback((term: string) => {
    setQ(term);
  }, 300);

  return (
    <InputGroup className='h-12 rounded-full'>
      <InputGroupInput
        placeholder={
          activeTab === 'affected'
            ? 'Search affected locations...'
            : activeTab === 'safe'
              ? 'Search safety locations...'
              : 'Search locations...'
        }
        onChange={
          activeTab === 'affected' || activeTab === 'safe'
            ? (e) => handleSearch(e.currentTarget.value)
            : undefined
        }
      />
      <InputGroupAddon>
        <IconSearch />
      </InputGroupAddon>
    </InputGroup>
  );
}
