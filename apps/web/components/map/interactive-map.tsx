'use client';

import '@/styles/maplibre-popup-overrides.css';
import {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Map, {
  Layer,
  Marker,
  Source,
  type MapRef,
  Popup,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import RadiusCircle from '@/components/shared/radius-circle';
import { FloodMarker } from '../shared/markers/flood-marker';
import { getUserLocation } from '@/lib/utils/get-user-location';
import { UserLocationMarker } from '../shared/markers/user-location-marker';
import { SearchLocationMarker } from '../shared/markers/search-location-marker';
import { useReportMapPins } from '@/hooks/use-report-map-pins';
import { useBoundary } from '@/hooks/use-boundary';
import { useSafetyMapPins } from '@/hooks/use-safety-map-pins';
import { SafetyMarker } from '../shared/markers/safety-marker';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import SafetyLocationPopup from './safety-location-popup';
import { useMapFilter } from '@/contexts/map-filter-context';
import { useMapPopup } from '@/contexts/map-popup-context';
import AffectedLocationPopup from './affected-location-popup';

export type InteractiveMapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  geolocate: () => void;
};

const InteractiveMap = forwardRef<InteractiveMapHandle, object>(
  (props, ref) => {
    const mapRef = useRef<MapRef | null>(null);
    const { caloocanGeoJSON, caloocanOutlineGeoJSON } = useBoundary();
    const [userLocation, setUserLocation] = useState<{
      longitude: number;
      latitude: number;
    } | null>(null);
    const { reportMapPins } = useReportMapPins();
    const { safetyMapPins } = useSafetyMapPins();
    const { activeOverlay, openReport, openSafety } = useMapOverlay();
    const isMobile = useIsMobile();

    const { filters } = useMapFilter();
    const filteredReportMapPins = reportMapPins?.filter((r) =>
      filters.severities.has(r.severity),
    );
    const filteredSafetyMapPins = safetyMapPins?.filter((r) =>
      filters.safetyTypes.has(r.type),
    );

    const {
      activePopup,
      openReportPopup,
      openSafetyPopup,
      closePopup,
      nextReport,
      prevReport,
      hasNext,
      hasPrev,
      currentReportIndex,
      total,
      flyToRef,
    } = useMapPopup();

    useEffect(() => {
      flyToRef.current = (loc) => {
        mapRef.current?.flyTo({
          center: [loc.longitude, loc.latitude],
          zoom: Math.max(mapRef.current.getZoom(), 16),
          essential: true,
          padding: isMobile
            ? { top: 0, bottom: 350, left: 0, right: 0 }
            : { top: 250, bottom: 0, left: 0, right: 0 },
        });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    // for next and prev panel, fly to the next or prev report
    useEffect(() => {
      if (activeOverlay?.type !== 'report') return;

      const report = reportMapPins?.find(
        (r) => r.id === activeOverlay.reportId,
      );
      if (!report) return;

      mapRef.current?.flyTo({
        center: [report.longitude, report.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 16),
        essential: true,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
      });
    }, [activeOverlay, reportMapPins]);

    // map controls exposed to parent component
    useImperativeHandle(ref, () => ({
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),
      geolocate: () =>
        getUserLocation().then((pos) => {
          if (pos && mapRef.current) {
            const { longitude, latitude } = pos;
            setUserLocation({ longitude, latitude });
            mapRef.current!.flyTo({
              center: [longitude, latitude],
              zoom: 16,
              essential: true,
              padding: { top: 0, bottom: 0, left: 0, right: 0 },
            });
          }
        }),
    }));

    return (
      <Map
        id='interactive-map'
        ref={mapRef}
        initialViewState={{
          latitude: 14.69906,
          longitude: 120.99772,
          zoom: 11.5,
        }}
        mapStyle='https://tiles.openfreemap.org/styles/bright'
        attributionControl={false}
        dragRotate={false}
        onClick={() => closePopup()}
      >
        {/* boundary fill */}
        {caloocanGeoJSON && (
          <Source id='caloocan' type='geojson' data={caloocanGeoJSON}>
            <Layer
              id='caloocan-fill'
              type='fill'
              paint={{
                'fill-color': '#0066CC',
                'fill-opacity': 0.05,
              }}
            />
          </Source>
        )}

        {/* boundary outline */}
        {caloocanOutlineGeoJSON && (
          <Source
            id='caloocan-outline'
            type='geojson'
            data={caloocanOutlineGeoJSON}
          >
            <Layer
              id='caloocan-outline-line'
              type='line'
              paint={{
                'line-color': '#0066CC',
                'line-width': 2,
              }}
            />
          </Source>
        )}

        {/* Flood report pins */}
        {filteredReportMapPins?.map((report) => (
          <Fragment key={report.id}>
            <Marker
              key={report.id}
              longitude={report.longitude}
              latitude={report.latitude}
              anchor='bottom'
              onClick={(e) => {
                e.originalEvent.stopPropagation(); // prevent the map's onClick from firing
                openReportPopup(report);
              }}
            >
              <FloodMarker severity={report.severity} status={report.status} />
            </Marker>
            <RadiusCircle
              id={`${report.id}`}
              longitude={report.longitude}
              latitude={report.latitude}
              range={report.range}
              severity={report.severity}
            />
          </Fragment>
        ))}

        {/* safety locations pin */}
        {filteredSafetyMapPins?.map((safety) => (
          <Marker
            key={safety.id}
            longitude={safety.longitude}
            latitude={safety.latitude}
            anchor='bottom'
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              openSafetyPopup(safety);
            }}
          >
            <SafetyMarker type={safety.type} />
          </Marker>
        ))}

        {/* user location pin */}
        {userLocation && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            anchor='bottom'
            style={{ pointerEvents: 'none', opacity: 0.8 }} // allow clicks to pass through to the map
          >
            <UserLocationMarker />
          </Marker>
        )}

        {/* Search-selected location pin */}
        {/*{selectedLocation && (
        <Marker
          longitude={selectedLocation.longitude}
          latitude={selectedLocation.latitude}
          anchor='bottom'
          style={{ pointerEvents: 'none', opacity: 0.8 }} // allow clicks to pass through to the map
        >
          <SearchLocationMarker />
        </Marker>
      )}*/}

        {activePopup?.type === 'report' && (
          <Popup
            longitude={activePopup.report.longitude}
            latitude={activePopup.report.latitude}
            anchor={isMobile ? 'top' : 'bottom'}
            offset={isMobile ? 10 : 50}
            maxWidth='none'
            onClose={closePopup}
            closeOnClick={false}
          >
            <AffectedLocationPopup
              onClose={closePopup}
              reportId={activePopup.report.id}
              onSelectReport={() => {
                openReport(activePopup.report.id);
                closePopup();
              }}
              nextReport={nextReport}
              prevReport={prevReport}
              hasNext={hasNext}
              hasPrev={hasPrev}
              currentReportIndex={currentReportIndex}
              total={total}
            />
          </Popup>
        )}

        {activePopup?.type === 'safety' && (
          <Popup
            longitude={activePopup.safety.longitude}
            latitude={activePopup.safety.latitude}
            anchor={isMobile ? 'top' : 'bottom'}
            offset={isMobile ? 10 : 50}
            maxWidth='none'
            onClose={closePopup}
            closeOnClick={false}
          >
            <SafetyLocationPopup
              onClose={closePopup}
              safetyId={activePopup.safety.id}
              onSelectSafety={() => {
                openSafety(activePopup.safety.id);
                closePopup();
              }}
            />
          </Popup>
        )}
      </Map>
    );
  },
);

InteractiveMap.displayName = 'InteractiveMap';

export default InteractiveMap;
