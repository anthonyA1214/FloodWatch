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
import { useReportMapPins } from '@/hooks/use-report-map-pins';
import { useBoundary } from '@/hooks/use-boundary';
import { useSafetyLocationMapPins } from '@/hooks/use-safety-location-map-pins';
import { SafetyMarker } from '../shared/markers/safety-marker';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMapOverlay } from '@/contexts/map-overlay-context';
import SafetyLocationPopup from './safety-location-popup';
import { useMapFilter } from '@/contexts/map-filter-context';
import { useMapPopup } from '@/contexts/map-popup-context';
import AffectedLocationPopup from './affected-location-popup';
import { useMapRouting } from '@/contexts/map-routing-context';

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
    const { safetyMapPins } = useSafetyLocationMapPins();
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

    const { route, offRoadPath, routeOrigin, isNoRoad, clearRoute } =
      useMapRouting();

    // Clear route only when the overlay is dismissed.
    useEffect(() => {
      if (!activeOverlay) clearRoute();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeOverlay]);

    // Fly to fit route bounds after route is set
    useEffect(() => {
      if (!route || !mapRef.current) return;

      const coords = route.geometry.coordinates as [number, number][];
      const lngs = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);

      mapRef.current.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        {
          padding: isMobile
            ? { top: 60, bottom: 400, left: 60, right: 60 }
            : { top: 60, bottom: 60, left: 480, right: 80 },
          essential: true,
          duration: 1000,
        },
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);

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

    // For next/prev panel navigation, fly to that report
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

    // Map controls exposed to parent
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
        onClick={() => closePopup()}
        attributionControl={false}
      >
        {/* Boundary fill */}
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

        {/* Boundary outline */}
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

        {/* ── Normal OSRM route (solid blue) ───────────────────────────── */}
        {route && !isNoRoad && (
          <Source id='route-road' type='geojson' data={route}>
            {/* White casing for contrast */}
            <Layer
              id='route-road-casing'
              type='line'
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#ffffff',
                'line-width': 8,
                'line-opacity': 0.9,
              }}
            />
            {/* Solid blue line */}
            <Layer
              id='route-road-line'
              type='line'
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#0066CC',
                'line-width': 5,
                'line-opacity': 0.95,
              }}
            />
          </Source>
        )}

        {/* ── No-road fallback (round dotted line) ─────────────────────── */}
        {route && isNoRoad && (
          <Source id='route-noroad' type='geojson' data={route}>
            <Layer
              id='route-noroad-halo'
              type='line'
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': '#ffffff',
                'line-width': 9,
                'line-opacity': 0.6,
                'line-dasharray': [0, 2.2],
              }}
            />
            <Layer
              id='route-noroad-dots'
              type='line'
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': '#0066CC',
                'line-width': 6,
                'line-opacity': 0.9,
                'line-dasharray': [0, 2.2],
              }}
            />
          </Source>
        )}

        {/* ── Off-Road Connection Gaps (round dotted line) ──────────── */}
        {offRoadPath && (
          <Source id='route-offroad' type='geojson' data={offRoadPath}>
            <Layer
              id='route-offroad-halo'
              type='line'
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': '#ffffff',
                'line-width': 9,
                'line-opacity': 0.6,
                'line-dasharray': [0, 2.2],
              }}
            />
            <Layer
              id='route-offroad-dots'
              type='line'
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': '#0066CC',
                'line-width': 6,
                'line-opacity': 0.9,
                'line-dasharray': [0, 2.2],
              }}
            />
          </Source>
        )}

        {/* ── Pulsing blue user dot — shown at true origin ─────────────── */}
        {routeOrigin && (
          <Marker
            longitude={routeOrigin[0]}
            latitude={routeOrigin[1]}
            anchor='bottom'
            style={{ pointerEvents: 'none' }}
          >
            <UserLocationMarker />
          </Marker>
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
                e.originalEvent.stopPropagation();
                openReportPopup(report);
              }}
            >
              <FloodMarker
                severity={report.severity}
                status={report.status}
                isFocused={
                  activePopup?.type === 'report' &&
                  activePopup.report.id === report.id
                }
              />
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

        {/* Safety location pins */}
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
            <SafetyMarker
              type={safety.type}
              isFocused={
                activePopup?.type === 'safety' &&
                activePopup.safety.id === safety.id
              }
            />
          </Marker>
        ))}

        {/* User location pin (geolocate button) */}
        {userLocation && !routeOrigin && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            anchor='bottom'
            style={{ pointerEvents: 'none', opacity: 0.8 }}
          >
            <UserLocationMarker />
          </Marker>
        )}

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
              latitude={activePopup.report.latitude}
              longitude={activePopup.report.longitude}
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
              latitude={activePopup.safety.latitude}
              longitude={activePopup.safety.longitude}
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
