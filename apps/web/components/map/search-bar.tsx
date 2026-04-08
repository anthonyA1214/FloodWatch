'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { IconMapPin, IconSearch, IconX } from '@tabler/icons-react';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import { useMapFilter } from '@/contexts/map-filter-context';
import { useDebouncedCallback } from 'use-debounce';
import { useSearch } from '@/hooks/use-search';
import {
  ReportResultInput,
  SafetyResultInput,
  SearchQueryInput,
} from '@repo/schemas';
import {
  SAFETY_TYPE_COLOR_MAP,
  SEVERITY_COLOR_MAP,
} from '@/lib/utils/get-color-map';
import { Badge } from '../ui/badge';
import { useMapPopup } from '@/contexts/map-popup-context';
import { useState } from 'react';

export default function SearchBar() {
  const { activeOverlay, close } = useMapOverlay();
  const { q, setQ, inputValue, setInputValue, filters } = useMapFilter();
  const { openReportPopup, openSafetyPopup } = useMapPopup();
  const [showSuggestions, setShowSuggestions] = useState(true);

  const params: SearchQueryInput = {
    types: Array.from(filters.safetyTypes),
    severities: Array.from(filters.severities),
    q: q || undefined,
  };

  const { reports, safetyLocations } = useSearch(params, !activeOverlay);

  const hasSuggestions =
    activeOverlay?.type !== 'affected-list' &&
    activeOverlay?.type !== 'safety-list' &&
    q &&
    showSuggestions &&
    ((reports?.length ?? 0) > 0 || (safetyLocations?.length ?? 0) > 0);

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
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
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

      {/*suggestions*/}
      {hasSuggestions && (
        <div className='mt-1 rounded-xl bg-white shadow-md overflow-hidden'>
          {(reports?.length ?? 0) > 0 && (
            <div onMouseDown={(e) => e.preventDefault()}>
              <p className='px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground tracking-wider uppercase'>
                Affected Locations
              </p>
              {reports!.map((report: ReportResultInput) => (
                <button
                  key={report.id}
                  className='w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition text-left'
                  onClick={() => {
                    openReportPopup(report);
                    setShowSuggestions(false);
                  }}
                >
                  <IconMapPin className='size-[1.5em]! shrink-0 opacity-50' />
                  <span className='flex-1 text-sm truncate'>
                    {report.location}
                  </span>
                  <Badge
                    className='text-xs'
                    style={{
                      color: SEVERITY_COLOR_MAP[report?.severity || 'low'],
                      backgroundColor: `${SEVERITY_COLOR_MAP[report?.severity || 'low']}25`,
                    }}
                  >
                    {report?.severity?.toUpperCase()}
                  </Badge>
                </button>
              ))}
            </div>
          )}

          {(safetyLocations?.length ?? 0) > 0 && (
            <div onMouseDown={(e) => e.preventDefault()}>
              <p className='px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground tracking-wider uppercase'>
                Safety Locations
              </p>
              {safetyLocations!.map((safety: SafetyResultInput) => (
                <button
                  key={safety.id}
                  className='w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition text-left'
                  onClick={() => {
                    openSafetyPopup(safety);
                    setShowSuggestions(false);
                  }}
                >
                  <IconMapPin className='size-[1.5em]! shrink-0 opacity-50' />
                  <span className='flex-1 text-sm truncate'>
                    {safety.location}
                  </span>
                  <Badge
                    className='text-xs'
                    style={{
                      color: SAFETY_TYPE_COLOR_MAP[safety?.type || 'shelter'],
                      backgroundColor: `${SAFETY_TYPE_COLOR_MAP[safety?.type || 'shelter']}25`,
                    }}
                  >
                    {safety?.type?.toUpperCase()}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
