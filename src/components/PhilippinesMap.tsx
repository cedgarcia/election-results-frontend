import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoJSON as GeoJSONType } from 'geojson';

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
};

const PhilippinesMap = ({ level = 0 }: PhilippinesMapProps) => {
  const [geoData, setGeoData] = useState<GeoJSONType | null>(null);
  const [loading, setLoading] = useState(true);

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
          minZoom={5}
          maxBounds={PH_BOUNDS}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          className="z-0 h-full w-full bg-white"
          // Disable all map controls
          attributionControl={false}
          zoomControl={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          dragging={true}
        >
          {geoData && (
            <GeoJSON
              data={geoData}
              style={() => ({
                fillColor: '#3388ff',
                weight: 1,
                color: '#0c4da2',
                fillOpacity: 0.7,
              })}
              onEachFeature={(feature, layer) => {
                // Add interactivity
                layer.on({
                  mouseover: (e) => {
                    e.target.setStyle({
                      fillColor: '#ff7800',
                      weight: 2,
                    });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({
                      fillColor: '#3388ff',
                      weight: 1,
                    });
                  },
                });
              }}
            />
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default PhilippinesMap;
