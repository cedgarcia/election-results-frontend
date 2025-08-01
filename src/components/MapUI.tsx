import type { MapFeature } from '@/types/map';

interface MapIndicatorProps {
  selectedArea: MapFeature | null;
  highlightedFeature: MapFeature | null;
}

export const MapIndicator = ({
  selectedArea,
  highlightedFeature,
}: MapIndicatorProps) => {
  const getHighlightedFeatureName = () => {
    if (!highlightedFeature) return '';

    return (
      highlightedFeature.properties?.NAME_1 ||
      highlightedFeature.properties?.NAME_2 ||
      highlightedFeature.properties?.name ||
      highlightedFeature.properties?.ADM1_EN ||
      highlightedFeature.properties?.ADM2_EN ||
      'Unknown Area'
    );
  };

  const getSelectedAreaName = () => {
    if (!selectedArea) return '';

    return (
      selectedArea.properties?.name ||
      selectedArea.properties?.NAME_1 ||
      'Selected Area'
    );
  };

  return (
    <div className="absolute top-2 left-2 z-[1000] rounded bg-white/90 px-3 py-1 shadow-md backdrop-blur-sm transition-all duration-300">
      <span className="text-sm font-semibold">
        {selectedArea
          ? `${getSelectedAreaName()} - Detailed View`
          : 'Philippines - Provinces & Regions'}
      </span>
      <span className="block text-xs text-gray-600">
        {selectedArea
          ? 'Cities & Municipalities - Click to highlight'
          : 'Click any area to explore'}
      </span>
      {highlightedFeature && (
        <span className="block text-xs font-medium text-blue-600">
          Selected: {getHighlightedFeatureName()}
        </span>
      )}
    </div>
  );
};

interface BackButtonProps {
  selectedArea: MapFeature | null;
  isZoomingRef: React.MutableRefObject<boolean>;
  onBackClick: () => void;
}

export const BackButton = ({
  selectedArea,
  isZoomingRef,
  onBackClick,
}: BackButtonProps) => {
  if (!selectedArea) return null;

  return (
    <div className="absolute top-2 right-2 z-[1000] transition-all duration-300">
      <button
        onClick={onBackClick}
        className="rounded border bg-white/90 px-3 py-1 text-sm shadow-md backdrop-blur-sm transition-colors duration-200 hover:bg-gray-100"
        disabled={isZoomingRef.current}
      >
        ← Back to Philippines
      </button>
    </div>
  );
};

interface LoadingIndicatorProps {
  isLoading: boolean;
}

export const LoadingIndicator = ({ isLoading }: LoadingIndicatorProps) => {
  if (!isLoading) return null;

  return (
    <div className="relative h-[500px] w-full bg-white">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-gray-600">Loading map data...</div>
      </div>
    </div>
  );
};
