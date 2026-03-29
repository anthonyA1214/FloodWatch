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
import Map, { Layer, Marker, Source, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import RadiusCircle from '@/components/shared/radius-circle';
import { FloodMarker } from '@/components/shared/markers/flood-marker';
import { getUserLocation } from '@/lib/utils/get-user-location';
import { UserLocationMarker } from '@/components/shared/markers/user-location-marker';
import { useReportMapPins } from '@/hooks/use-report-map-pins';
import { useBoundary } from '@/hooks/use-boundary';
import { useSafetyMapPins } from '@/hooks/use-safety-map-pins';
import { SafetyMarker } from '@/components/shared/markers/safety-marker';
import { useMapHighlight } from '@/contexts/map-highlight-context';

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

    const { flyToRef, activePin, setActivePin } = useMapHighlight();

    useEffect(() => {
      flyToRef.current = (loc) => {
        mapRef.current?.flyTo({
          center: [loc.longitude, loc.latitude],
          zoom: Math.max(mapRef.current.getZoom(), 16),
          essential: true,
        });
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),
      geolocate: () =>
        getUserLocation().then((pos) => {
          if (pos && mapRef.current) {
            const { longitude, latitude } = pos;
            setUserLocation({ longitude, latitude });

            mapRef.current.flyTo({
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
          // Center around Metro Manila area (so your sample pins are visible)
          latitude: 14.69906,
          longitude: 120.99772,
          zoom: 11.5,
        }}
        mapStyle='https://tiles.openfreemap.org/styles/bright'
        attributionControl={false}
        dragRotate={false}
        onClick={() => setActivePin(null)} // Deselect pins when clicking on the map
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
        {reportMapPins?.map((report) => (
          <Fragment key={report.id}>
            <Marker
              key={report.id}
              longitude={report.longitude}
              latitude={report.latitude}
              anchor='bottom'
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setActivePin({ type: 'report', report });
              }}
            >
              <FloodMarker
                severity={report.severity}
                status={report.status}
                isFocused={
                  activePin?.type === 'report' &&
                  activePin.report.id === report.id
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

        {/* safety locations pin */}
        {safetyMapPins?.map((location) => (
          <Marker
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor='bottom'
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActivePin({ type: 'safety', safety: location });
            }}
          >
            <SafetyMarker
              type={location.type}
              isFocused={
                activePin?.type === 'safety' &&
                activePin.safety.id === location.id
              }
            />
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
      </Map>
    );
  },
);

InteractiveMap.displayName = 'InteractiveMap';

export default InteractiveMap;
