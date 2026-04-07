'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useCommunityFeed } from '@/contexts/community-feed-context';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const { setQ } = useCommunityFeed();

  const handleSearch = useDebouncedCallback((term: string) => {
    setQ(term);
  }, 300);

  return (
    <InputGroup className='h-12 rounded-full'>
      <InputGroupInput
        placeholder='Search location...'
        onChange={(e) => handleSearch(e.target.value)}
      />
      <InputGroupAddon>
        <IconSearch />
      </InputGroupAddon>
    </InputGroup>
  );
}
