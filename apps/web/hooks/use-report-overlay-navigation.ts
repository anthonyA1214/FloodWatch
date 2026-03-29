// hooks/use-report-overlay-navigation.ts
import { useMapFilter } from '@/contexts/map-filter-context';
import { useReportMapPins } from '@/hooks/use-report-map-pins';

export function useReportOverlayNavigation(
  activeReportId: number | null,
  setActiveReportId: (id: number) => void,
) {
  const { reportMapPins } = useReportMapPins();
  const { filters } = useMapFilter();

  const filteredPins = reportMapPins?.filter((pin) =>
    filters.severities.has(pin.severity),
  );

  const currentIndex = activeReportId
    ? (filteredPins?.findIndex((pin) => pin.id === activeReportId) ?? -1)
    : -1;
  const totalReports = filteredPins?.length ?? 0;
  const currentReportIndex = currentIndex + 1;
  const hasNext = currentIndex >= 0 && currentIndex < totalReports - 1;
  const hasPrev = currentIndex > 0;

  const nextReport = () => {
    if (hasNext && filteredPins) {
      setActiveReportId(filteredPins[currentIndex + 1].id);
    }
  };

  const prevReport = () => {
    if (hasPrev && filteredPins) {
      setActiveReportId(filteredPins[currentIndex - 1].id);
    }
  };

  return {
    nextReport,
    prevReport,
    hasNext,
    hasPrev,
    currentReportIndex,
    totalReports,
  };
}
