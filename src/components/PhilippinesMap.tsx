/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoJSON as GeoJSONType } from 'geojson';
import type { Layer, Map as LeafletMap } from 'leaflet';

// Philippines bounding coordinates
const PH_BOUNDS: [number, number][] = [
  [5.0, 115.0], // Southwest
  [21.0, 127.0], // Northeast
];

// Calculate center point
const CENTER: [number, number] = [
  (PH_BOUNDS[0][0] + PH_BOUNDS[1][0]) / 2,
  (PH_BOUNDS[0][1] + PH_BOUNDS[1][1]) / 2,
];

type PhilippinesMapProps = {
  level?: number;
  onAreaClick?: (feature: any, bounds: any) => void;
  focusArea?: {
    bounds: any;
    zoom: number;
  } | null;
};

// Component to handle map focus/zoom changes
const MapController = ({
  focusArea,
}: {
  focusArea: PhilippinesMapProps['focusArea'];
}) => {
  const map = useMap();

  useEffect(() => {
    if (focusArea && focusArea.bounds) {
      // Fit the map to the clicked area bounds with some padding
      map.fitBounds(focusArea.bounds, {
        padding: [20, 20],
        maxZoom: focusArea.zoom,
      });
    }
  }, [focusArea, map]);

  return null;
};

const PhilippinesMap = ({
  level = 0,
  onAreaClick,
  focusArea,
}: PhilippinesMapProps) => {
  const [geoData, setGeoData] = useState<GeoJSONType | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/map-data/level_${level}.json`);
        const data: GeoJSONType = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGeoData();
  }, [level]);

  const handleFeatureClick = (feature: any, layer: Layer) => {
    if (onAreaClick && level < 3) {
      // Only allow drill-down up to level 3
      // Get the bounds of the clicked feature
      const bounds = (layer as any).getBounds();
      onAreaClick(feature, bounds);
    }
  };

  return (
    <div className="relative h-[500px] w-full bg-white">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          Loading map...
        </div>
      ) : (
        <MapContainer
          center={CENTER}
          zoom={5}
          minZoom={4}
          maxZoom={10}
          maxBounds={PH_BOUNDS}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          className="z-0 h-full w-full bg-white"
          attributionControl={false}
          zoomControl={true}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          dragging={true}
          ref={mapRef}
        >
          <MapController focusArea={focusArea} />
          {geoData && (
            <GeoJSON
              key={`geojson-${level}`} // Force re-render when level changes
              data={geoData}
              style={() => ({
                fillColor: '#3388ff',
                weight: 1,
                color: '#0c4da2',
                fillOpacity: 0.7,
                cursor: level < 3 ? 'pointer' : 'default', // Show pointer cursor if clickable
              })}
              onEachFeature={(feature, layer) => {
                // Add interactivity
                layer.on({
                  mouseover: (e) => {
                    if (level < 3) {
                      // Only show hover effect if clickable
                      e.target.setStyle({
                        fillColor: '#ff7800',
                        weight: 2,
                        fillOpacity: 0.9,
                      });
                    }
                  },
                  mouseout: (e) => {
                    e.target.setStyle({
                      fillColor: '#3388ff',
                      weight: 1,
                      fillOpacity: 0.7,
                    });
                  },
                  click: (e) => {
                    handleFeatureClick(feature, layer);
                  },
                });

                // Add tooltip if feature has name property
                if (feature.properties && feature.properties.name) {
                  layer.bindTooltip(feature.properties.name, {
                    permanent: false,
                    direction: 'center',
                    className: 'custom-tooltip',
                  });
                }
              }}
            />
          )}
        </MapContainer>
      )}

      {/* Level indicator */}
      <div className="absolute top-2 left-2 z-[1000] rounded bg-white px-3 py-1 shadow-md">
        <span className="text-sm font-semibold">Level {level}</span>
        {level < 3 && (
          <span className="block text-xs text-gray-600">
            Click area to drill down
          </span>
        )}
      </div>

      {/* Back button for levels > 0 */}
      {level > 0 && (
        <div className="absolute top-2 right-2 z-[1000]">
          <button
            onClick={() => window.history.back()}
            className="rounded border bg-white px-3 py-1 text-sm shadow-md hover:bg-gray-100"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
};

export default PhilippinesMap;
