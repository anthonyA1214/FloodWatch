'use client';

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Map, { Layer, Marker, Source, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getUserLocation } from '@/lib/utils/get-user-location';
import { useBoundary } from '@/hooks/use-boundary';
import { FloodMarker } from '@/components/shared/markers/flood-marker';
import RadiusCircle from '@/components/shared/radius-circle';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import type { Feature, Polygon, MultiPolygon } from 'geojson';
import { toast } from 'sonner';
import { SafetyMarker } from '@/components/shared/markers/safety-marker';
import { UserLocationMarker } from '@/components/shared/markers/user-location-marker';
import { Spinner } from '../ui/spinner';

type Props = {
  severity?: 'low' | 'moderate' | 'high' | 'critical';
  range?: number;
  type?: 'shelter' | 'hospital';
  mode: 'flood-alert' | 'safety-location';
  onLocationSelect?: (location: {
    longitude: number;
    latitude: number;
  }) => void;
};

export type InteractiveMapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  geolocate: () => void;
};

const InteractiveMapCurrentLocation = forwardRef<InteractiveMapHandle, Props>(
  ({ severity, range, type, mode, onLocationSelect }, ref) => {
    const mapRef = useRef<MapRef | null>(null);
    const { caloocanGeoJSON, caloocanOutlineGeoJSON } = useBoundary();
    const [location, setLocation] = useState<{
      longitude: number;
      latitude: number;
    } | null>(null);
    const [isOutside, setIsOutside] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const handleGeolocate = useCallback(() => {
      setIsLocating(true);
      return getUserLocation()
        .then((pos) => {
          if (pos && mapRef.current) {
            const { longitude, latitude } = pos;

            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 16,
              essential: true,
            });

            if (caloocanGeoJSON) {
              const locatedPoint = point([longitude, latitude]);
              const features =
                caloocanGeoJSON.type === 'FeatureCollection'
                  ? caloocanGeoJSON.features
                  : [caloocanGeoJSON];

              const isInsideBoundary = features.some(
                (feature: Feature<Polygon | MultiPolygon>) =>
                  booleanPointInPolygon(locatedPoint, feature),
              );

              if (!isInsideBoundary) {
                toast.error(
                  'Your current location is outside of Caloocan boundaries.',
                );
                setIsOutside(true);
                setLocation({ longitude, latitude });
                setIsLocating(false);
                return;
              }
              setIsOutside(false);
            }

            const newLocation = { longitude, latitude };
            setLocation(newLocation);
            onLocationSelect?.(newLocation);
          }
          setIsLocating(false);
        })
        .catch(() => {
          setIsLocating(false);
        });
    }, [caloocanGeoJSON, onLocationSelect]);

    useImperativeHandle(ref, () => ({
      zoomIn: () => mapRef.current?.zoomIn(),
      zoomOut: () => mapRef.current?.zoomOut(),
      geolocate: handleGeolocate,
    }));

    return (
      <div className='relative flex-1'>
        {isLocating && (
          <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/70 rounded-2xl pointer-events-none'>
            <Spinner className='size-16 text-gray-600' />
            <span className='text-lg font-medium text-gray-600'>
              Getting your location...
            </span>
          </div>
        )}
        <Map
          id='interactive-map-location'
          ref={mapRef}
          initialViewState={{
            latitude: 14.69906,
            longitude: 120.99772,
            zoom: 11.5,
          }}
          mapStyle='https://tiles.openfreemap.org/styles/bright'
          onLoad={() => {
            setIsLocating(true);
            handleGeolocate();
          }}
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

          {/* user location marker */}
          {location && (
            <Marker
              longitude={location.longitude}
              latitude={location.latitude}
              anchor='bottom'
            >
              {isOutside ? (
                <UserLocationMarker />
              ) : mode === 'flood-alert' ? (
                <>
                  <RadiusCircle
                    longitude={location.longitude}
                    latitude={location.latitude}
                    range={range}
                    severity={severity || 'low'}
                  />
                  <FloodMarker severity={severity || 'low'} />
                </>
              ) : mode === 'safety-location' ? (
                <SafetyMarker type={type || 'shelter'} />
              ) : null}
            </Marker>
          )}
        </Map>
      </div>
    );
  },
);

InteractiveMapCurrentLocation.displayName = 'InteractiveMapCurrentLocation';

export default InteractiveMapCurrentLocation;
