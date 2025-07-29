/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoJSON as GeoJSONType } from 'geojson';
// Fix missing marker icons in Leaflet
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

  // Philippines bounding box coordinates
  const phBounds: L.LatLngBoundsExpression = [
    [4.5, 114], // SW corner
    [21.5, 127], // NE corner
  ];

  return (
    <div className="relative h-[500px] w-full">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          Loading map...
        </div>
      ) : (
        <MapContainer
          bounds={phBounds}
          zoom={5}
          scrollWheelZoom={true}
          className="z-0 h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoData && (
            <GeoJSON
              data={geoData}
              style={() => ({
                fillColor: '#3388ff',
                weight: 1,
                color: '#fff',
                fillOpacity: 0.5,
              })}
            />
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default PhilippinesMap;
