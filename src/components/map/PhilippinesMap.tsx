/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PhilippinesMapProps } from '@/types';
import type { Layer } from 'leaflet';
import { useGeoData } from '@/hooks/useGeoData';
import { InteractiveGeoJSON } from './InteractiveGeoJSON';
import { MapController } from './MapController';
import { MapUIControls } from './MapUIControls';

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

const PhilippinesMap = ({
  level = 0,
  onAreaClick,
  focusArea,
  onBack,
  maxLevel = 3,
}: PhilippinesMapProps) => {
  const { geoData, loading, error } = useGeoData(level);

  const handleFeatureClick = (feature: any, layer: Layer) => {
    if (onAreaClick && level < maxLevel) {
      try {
        // Get the bounds of the clicked feature
        const bounds = (layer as any).getBounds();
        if (bounds) {
          onAreaClick(feature, bounds);
        }
      } catch (error) {
        console.warn('Error getting feature bounds:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="relative h-[500px] w-full bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-600">Loading map...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-[500px] w-full bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] w-full bg-white">
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
      >
        <MapController focusArea={focusArea} />

        {geoData && (
          <InteractiveGeoJSON
            data={geoData}
            level={level}
            maxLevel={maxLevel}
            onFeatureClick={handleFeatureClick}
          />
        )}
      </MapContainer>

      <MapUIControls level={level} onBack={onBack} maxLevel={maxLevel} />
    </div>
  );
};

export default PhilippinesMap;
