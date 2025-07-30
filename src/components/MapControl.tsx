import React from 'react';
import { GeoJSONFeature } from '../types';

type MapControlsProps = {
  selectedArea: GeoJSONFeature | null;
  highlightedFeature: GeoJSONFeature | null;
  onReset: () => void;
  isZooming: boolean;
};

const MapControls: React.FC<MapControlsProps> = ({
  selectedArea,
  highlightedFeature,
  onReset,
  isZooming,
}) => {
  return (
    <>
      {/* LEVEL INDICATOR */}
      <div className="absolute top-2 left-2 z-[1000] rounded bg-white/90 px-3 py-1 shadow-md backdrop-blur-sm transition-all duration-300">
        <span className="text-sm font-semibold">
          {selectedArea
            ? `${selectedArea.properties?.name || selectedArea.properties?.NAME_1 || 'Selected Area'} - Detailed View`
            : 'Philippines - Provinces & Regions'}
        </span>
        <span className="block text-xs text-gray-600">
          {selectedArea
            ? 'Cities & Municipalities - Click to highlight'
            : 'Click any area to explore'}
        </span>
        {highlightedFeature && (
          <span className="block text-xs font-medium text-blue-600">
            Selected:{' '}
            {highlightedFeature.properties?.NAME_1 ||
              highlightedFeature.properties?.NAME_2 ||
              highlightedFeature.properties?.name ||
              highlightedFeature.properties?.ADM1_EN ||
              highlightedFeature.properties?.ADM2_EN ||
              'Unknown Area'}
          </span>
        )}
      </div>

      {/* BACK BUTTON WHEN AREA IS SELECTED */}
      {selectedArea && (
        <div className="absolute top-2 right-2 z-[1000] transition-all duration-300">
          <button
            onClick={onReset}
            className="rounded border bg-white/90 px-3 py-1 text-sm shadow-md backdrop-blur-sm transition-colors duration-200 hover:bg-gray-100"
            disabled={isZooming}
          >
            ← Back to Philippines
          </button>
        </div>
      )}
    </>
  );
};

export default MapControls;
