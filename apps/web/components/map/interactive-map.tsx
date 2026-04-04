'use client';

import '@/styles/maplibre-popup-overrides.css';
import {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Map, {
  Layer,
  Marker,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
  Popup,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { GeoJSONSource } from 'maplibre-gl';
import RadiusCircle from '@/components/shared/radius-circle';
import { FloodMarker } from '../shared/markers/flood-marker';
import { getUserLocation } from '@/lib/utils/get-user-location';
import { UserLocationMarker } from '../shared/markers/user-location-marker';
// import { SearchLocationMarker } from '../shared/markers/search-location-marker';
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

const CLUSTER_ZOOM_THRESHOLD = 14;
const CLUSTER_CLICK_EXTRA_ZOOM = 0.8;

const REPORT_SEVERITY_STYLES = {
  low: '#14B8A6',
  moderate: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
} as const;

const SAFETY_CLUSTER_COLOR = '#156CC2';

type ClusterSource = GeoJSONSource & {
  getClusterExpansionZoom: (clusterId: number) => Promise<number>;
};

type CombinedPin =
  | {
      id: number;
      longitude: number;
      latitude: number;
      kind: 'report';
      severity: 'low' | 'moderate' | 'high' | 'critical';
      status: 'verified' | 'unverified';
      range: number;
    }
  | {
      id: number;
      longitude: number;
      latitude: number;
      kind: 'safety';
    };

type ReportSeverity = keyof typeof REPORT_SEVERITY_STYLES;

const hasValidCoordinates = (longitude: number, latitude: number) =>
  Number.isFinite(longitude) && Number.isFinite(latitude);

const InteractiveMap = forwardRef<InteractiveMapHandle, object>(
  (props, ref) => {
    const mapRef = useRef<MapRef | null>(null);
    const { caloocanGeoJSON, caloocanOutlineGeoJSON } = useBoundary();
    const [userLocation, setUserLocation] = useState<{
      longitude: number;
      latitude: number;
    } | null>(null);
    const [zoom, setZoom] = useState(11.5);
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

    const combinedPins = useMemo<CombinedPin[]>(
      () => [
        ...(filteredReportMapPins
          ?.filter((report) =>
            hasValidCoordinates(report.longitude, report.latitude),
          )
          .map((report) => ({
            id: report.id,
            longitude: report.longitude,
            latitude: report.latitude,
            kind: 'report' as const,
            severity: report.severity,
            status: report.status,
            range: report.range,
          })) ?? []),
        ...(filteredSafetyMapPins
          ?.filter((safety) =>
            hasValidCoordinates(safety.longitude, safety.latitude),
          )
          .map((safety) => ({
            id: safety.id,
            longitude: safety.longitude,
            latitude: safety.latitude,
            kind: 'safety' as const,
          })) ?? []),
      ],
      [filteredReportMapPins, filteredSafetyMapPins],
    );

    const reportPinsBySeverity = useMemo(() => {
      const grouped: Record<ReportSeverity, CombinedPin[]> = {
        low: [],
        moderate: [],
        high: [],
        critical: [],
      };

      for (const pin of combinedPins) {
        if (pin.kind !== 'report') continue;
        grouped[pin.severity].push(pin);
      }

      return grouped;
    }, [combinedPins]);

    const safetyPins = useMemo(
      () => combinedPins.filter((pin) => pin.kind === 'safety'),
      [combinedPins],
    );

    const reportPinsGeoJsonBySeverity = useMemo(
      () =>
        Object.fromEntries(
          (Object.keys(REPORT_SEVERITY_STYLES) as ReportSeverity[]).map(
            (severity) => [
              severity,
              {
                type: 'FeatureCollection' as const,
                features: reportPinsBySeverity[severity].map((pin) => ({
                  type: 'Feature' as const,
                  geometry: {
                    type: 'Point' as const,
                    coordinates: [pin.longitude, pin.latitude] as [
                      number,
                      number,
                    ],
                  },
                  properties: {
                    id: pin.id,
                    kind: pin.kind,
                    severity,
                  },
                })),
              },
            ],
          ),
        ) as Record<
          ReportSeverity,
          {
            type: 'FeatureCollection';
            features: Array<{
              type: 'Feature';
              geometry: { type: 'Point'; coordinates: [number, number] };
              properties: {
                id: number;
                kind: 'report';
                severity: ReportSeverity;
              };
            }>;
          }
        >,
      [reportPinsBySeverity],
    );

    const safetyPinsGeoJson = useMemo(
      () => ({
        type: 'FeatureCollection' as const,
        features: safetyPins.map((pin) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [pin.longitude, pin.latitude] as [number, number],
          },
          properties: {
            id: pin.id,
            kind: pin.kind,
          },
        })),
      }),
      [safetyPins],
    );

    // Clusters are fully hidden slightly before pins appear to avoid remnants
    const showClusters = zoom < CLUSTER_ZOOM_THRESHOLD - 0.05;
    const showPins = zoom >= CLUSTER_ZOOM_THRESHOLD;

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

    const handleMapMouseMove = (event: MapLayerMouseEvent) => {
      const canvas = mapRef.current?.getMap().getCanvas();
      if (!canvas) return;

      const hoveringCluster = event.features?.some(
        (feature) =>
          feature.layer.id === 'report-low-clusters' ||
          feature.layer.id === 'report-low-cluster-count' ||
          feature.layer.id === 'report-moderate-clusters' ||
          feature.layer.id === 'report-moderate-cluster-count' ||
          feature.layer.id === 'report-high-clusters' ||
          feature.layer.id === 'report-high-cluster-count' ||
          feature.layer.id === 'report-critical-clusters' ||
          feature.layer.id === 'report-critical-cluster-count' ||
          feature.layer.id === 'safety-clusters' ||
          feature.layer.id === 'safety-cluster-count',
      );
      canvas.style.cursor = hoveringCluster ? 'pointer' : '';
    };

    const handleMapClick = (event: MapLayerMouseEvent) => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      const clickedCluster = map
        .queryRenderedFeatures(event.point, {
          layers: [
            'report-low-clusters',
            'report-low-cluster-count',
            'report-moderate-clusters',
            'report-moderate-cluster-count',
            'report-high-clusters',
            'report-high-cluster-count',
            'report-critical-clusters',
            'report-critical-cluster-count',
            'safety-clusters',
            'safety-cluster-count',
          ],
        })
        .find((feature) => feature.properties?.cluster);

      if (!clickedCluster) {
        closePopup();
        return;
      }

      if (clickedCluster.geometry.type !== 'Point') return;

      const clusterIdRaw = clickedCluster.properties?.cluster_id;
      const clusterId = Number(clusterIdRaw);
      if (!Number.isFinite(clusterId)) return;

      const sourceId = clickedCluster.source;
      const source = map.getSource(sourceId) as ClusterSource | undefined;
      if (!source || typeof source.getClusterExpansionZoom !== 'function') {
        return;
      }

      source
        .getClusterExpansionZoom(clusterId)
        .then((expansionZoom) => {
          const pointGeometry = clickedCluster.geometry as GeoJSON.Point;
          const [longitude, latitude] = pointGeometry.coordinates;
          const nextZoom = Math.max(
            expansionZoom + CLUSTER_CLICK_EXTRA_ZOOM,
            CLUSTER_ZOOM_THRESHOLD + 0.25,
          );
          map.easeTo({
            center: [longitude, latitude],
            zoom: nextZoom,
            duration: 350,
          });
        })
        .catch(() => {
          // no-op: ignore if source is not ready yet
        });
    };

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
        interactiveLayerIds={[
          'report-low-clusters',
          'report-low-cluster-count',
          'report-moderate-clusters',
          'report-moderate-cluster-count',
          'report-high-clusters',
          'report-high-cluster-count',
          'report-critical-clusters',
          'report-critical-cluster-count',
          'safety-clusters',
          'safety-cluster-count',
        ]}
        onZoom={(event) => setZoom(event.viewState.zoom)}
        onClick={handleMapClick}
        onMouseMove={handleMapMouseMove}
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

        {/* Report clusters by severity */}
        {showClusters &&
          (Object.keys(REPORT_SEVERITY_STYLES) as ReportSeverity[]).map(
            (severity) => {
              const sourceId = `report-${severity}`;
              const clusterLayerId = `${sourceId}-clusters`;
              const countLayerId = `${sourceId}-cluster-count`;

              return (
                <Source
                  key={sourceId}
                  id={sourceId}
                  type='geojson'
                  data={reportPinsGeoJsonBySeverity[severity]}
                  cluster={true}
                  clusterMaxZoom={CLUSTER_ZOOM_THRESHOLD}
                  clusterRadius={56}
                >
                  {/* Outer glow ring layer - static, tight to circle, fades out before pins */}
                  <Layer
                    id={`${clusterLayerId}-glow`}
                    type='circle'
                    filter={['has', 'point_count']}
                    paint={{
                      'circle-color': REPORT_SEVERITY_STYLES[severity],
                      'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        34,
                        10,
                        38,
                        25,
                        42,
                      ],
                      'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        13.4,
                        0.18,
                        13.95,
                        0,
                      ],
                    }}
                  />
                  <Layer
                    id={clusterLayerId}
                    type='circle'
                    filter={['has', 'point_count']}
                    paint={{
                      'circle-color': REPORT_SEVERITY_STYLES[severity],
                      'circle-stroke-color': '#FFFFFF',
                      'circle-stroke-width': 3,
                      'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        28,
                        10,
                        32,
                        25,
                        36,
                      ],
                      'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        13.4,
                        1,
                        13.95,
                        0,
                      ],
                    }}
                  />
                  {/* Cluster count label */}
                  <Layer
                    id={countLayerId}
                    type='symbol'
                    filter={['has', 'point_count']}
                    layout={{
                      'text-field': [
                        'format',
                        ['get', 'point_count_abbreviated'],
                        {},
                        '\n',
                        {},
                        severity,
                      ],
                      'text-anchor': 'center',
                      'text-justify': 'center',
                      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                      'text-size': 12,
                      'text-max-width': 56,
                      'text-line-height': 0.9,
                      'text-allow-overlap': true,
                    }}
                    paint={{
                      'text-color': '#FFFFFF',
                      'text-halo-color': 'rgba(0, 0, 0, 0.15)',
                      'text-halo-width': 0.75,
                      'text-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        13.4,
                        1,
                        13.95,
                        0,
                      ],
                    }}
                  />
                </Source>
              );
            },
          )}

        {/* Safety clusters - Pill shaped with animated glow */}
        {showClusters && safetyPinsGeoJson.features.length > 0 && (
          <Source
            id='safety-source'
            type='geojson'
            data={safetyPinsGeoJson}
            cluster={true}
            clusterMaxZoom={CLUSTER_ZOOM_THRESHOLD}
            clusterRadius={56}
          >
            {/* Outer glow ring layer - static, tight to circle, fades out before pins */}
            <Layer
              id='safety-clusters-glow'
              type='circle'
              filter={['has', 'point_count']}
              paint={{
                'circle-color': SAFETY_CLUSTER_COLOR,
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  34,
                  10,
                  38,
                  25,
                  42,
                ],
                'circle-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13.4,
                  0.18,
                  13.95,
                  0,
                ],
              }}
            />
            {/* Pill shape background layer */}
            <Layer
              id='safety-clusters-pill-bg'
              type='circle'
              filter={['has', 'point_count']}
              paint={{
                'circle-color': SAFETY_CLUSTER_COLOR,
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  32,
                  10,
                  38,
                  25,
                  42,
                ],
                'circle-opacity': 0.2,
              }}
            />
            {/* Main cluster circle - pill look, fades out before pins */}
            <Layer
              id='safety-clusters'
              type='circle'
              filter={['has', 'point_count']}
              paint={{
                'circle-color': SAFETY_CLUSTER_COLOR,
                'circle-stroke-color': '#FFFFFF',
                'circle-stroke-width': 3,
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  28,
                  10,
                  32,
                  25,
                  36,
                ],
                'circle-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13.4,
                  1,
                  13.95,
                  0,
                ],
              }}
            />
            <Layer
              id='safety-cluster-count'
              type='symbol'
              filter={['has', 'point_count']}
              layout={{
                'text-field': [
                  'format',
                  ['get', 'point_count_abbreviated'],
                  {},
                  '\n',
                  {},
                  'safety',
                ],
                'text-anchor': 'center',
                'text-justify': 'center',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 12,
                'text-max-width': 56,
                'text-line-height': 0.9,
                'text-allow-overlap': true,
              }}
              paint={{
                'text-color': '#FFFFFF',
                'text-halo-color': 'rgba(0, 0, 0, 0.15)',
                'text-halo-width': 0.75,
                'text-opacity': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13.4,
                  1,
                  13.95,
                  0,
                ],
              }}
            />
          </Source>
        )}

        {/* Flood report pins */}
        {showPins &&
          filteredReportMapPins
            ?.filter((report) =>
              hasValidCoordinates(report.longitude, report.latitude),
            )
            .map((report) => (
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
                  <FloodMarker
                    severity={report.severity}
                    status={report.status}
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
        {showPins &&
          filteredSafetyMapPins
            ?.filter((safety) =>
              hasValidCoordinates(safety.longitude, safety.latitude),
            )
            .map((safety) => (
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
