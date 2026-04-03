'use client';

import { Layer, Map, Marker, Source } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import RadiusCircle from '@/components/shared/radius-circle';
import { Spinner } from '@/components/ui/spinner';
import { useBoundary } from '@/hooks/use-boundary';
import { FloodMarker } from './markers/flood-marker';
import { SafetyMarker } from './markers/safety-marker';

type BaseProps = {
  longitude: number | null;
  latitude: number | null;
};

type SafetyProps = BaseProps & {
  variant: 'safety';
  type: 'hospital' | 'shelter';
};

type ReportProps = BaseProps & {
  variant: 'report';
  longitude: number | null;
  latitude: number | null;
  range: number;
  severity: 'critical' | 'high' | 'moderate' | 'low';
};

type InteractiveMapLocationProps = SafetyProps | ReportProps;

export default function InteractiveMapLocation(
  props: InteractiveMapLocationProps,
) {
  const { variant, longitude, latitude } = props;
  const { caloocanGeoJSON, caloocanOutlineGeoJSON } = useBoundary();

  const severity = variant === 'report' ? props.severity : undefined;
  const range = variant === 'report' ? props.range : undefined;
  const type = variant === 'safety' ? props.type : undefined;

  if (longitude === null || latitude === null) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-2'>
        <Spinner className='size-16 text-[#0066CC]' />
      </div>
    );
  }

  return (
    <Map
      initialViewState={{
        longitude: longitude,
        latitude: latitude,
        zoom: 13.5,
      }}
      mapStyle='https://tiles.openfreemap.org/styles/bright'
      attributionControl={false}
      dragRotate={false}
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

      {variant === 'report' && (
        <>
          <RadiusCircle
            longitude={longitude}
            latitude={latitude}
            range={range}
            severity={severity as ReportProps['severity']}
          />
          <Marker
            key={severity}
            longitude={longitude}
            latitude={latitude}
            anchor='bottom'
          >
            <FloodMarker severity={severity as ReportProps['severity']} />
          </Marker>
        </>
      )}

      {variant === 'safety' && (
        <>
          <Marker
            key={type}
            longitude={longitude}
            latitude={latitude}
            anchor='bottom'
          >
            <SafetyMarker type={type as SafetyProps['type']} />
          </Marker>
        </>
      )}
    </Map>
  );
}
