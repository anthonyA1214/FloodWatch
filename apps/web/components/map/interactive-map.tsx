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
import { useSafetyMapPins } from '@/hooks/use-safety-map-pins';
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

    const { route, clearRoute } = useMapRouting();

    // clear route when overlay is closed
    useEffect(() => {
      if (!activeOverlay) clearRoute();
    }, [activeOverlay, clearRoute]);

    // fly to fit route bounds after route is set
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
          if (pos && mapRef.current && (mapRef.current as any)._loaded) {
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

        {/* OSRM route line */}
        {route && (
          <Source id='osrm-route' type='geojson' data={route}>
            {/* casing / outline for contrast */}
            <Layer
              id='osrm-route-casing'
              type='line'
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              paint={{
                'line-color': '#ffffff',
                'line-width': 8,
                'line-opacity': 0.9,
              }}
            />
            {/* main route line */}
            <Layer
              id='osrm-route-line'
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