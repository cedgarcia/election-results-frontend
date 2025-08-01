import {
  getLayerStyle,
  isFeatureCollection,
  isFeatureHighlighted,
} from '@/utils/mapUtils';
import type { GeoJSON as GeoJSONType } from 'geojson';
import type { Layer } from 'leaflet';
import { GeoJSON } from 'react-leaflet';
import type { MapFeature } from '@/types/map';

interface Level1LayerProps {
  data: GeoJSONType;
  highlightedFeature: MapFeature | null;
  selectedArea: MapFeature | null;
  onEachFeature: (feature: MapFeature, layer: Layer) => void;
}

export const Level1Layer = ({
  data,
  highlightedFeature,
  selectedArea,
  onEachFeature,
}: Level1LayerProps) => {
  return (
    <GeoJSON
      key={`level1-${highlightedFeature ? 'highlighted' : 'normal'}`}
      data={data}
      style={(feature) => {
        const highlighted = isFeatureHighlighted(
          feature as MapFeature,
          highlightedFeature
        );
        return {
          ...getLayerStyle(
            feature as MapFeature,
            false,
            highlighted,
            selectedArea
          ),
          cursor: 'pointer',
        };
      }}
      onEachFeature={onEachFeature}
    />
  );
};

interface Level2LayerProps {
  data: GeoJSONType;
  highlightedFeature: MapFeature | null;
  selectedArea: MapFeature | null;
  onEachFeature: (feature: MapFeature, layer: Layer) => void;
}

export const Level2Layer = ({
  data,
  highlightedFeature,
  selectedArea,
  onEachFeature,
}: Level2LayerProps) => {
  if (!isFeatureCollection(data) || data.features.length === 0) {
    return null;
  }

  const getSelectedAreaName = () => {
    return (
      selectedArea?.properties?.name ||
      selectedArea?.properties?.NAME_1 ||
      'selected'
    );
  };

  const getHighlightedFeatureKey = () => {
    return highlightedFeature
      ? JSON.stringify(highlightedFeature.properties)
      : 'normal';
  };

  return (
    <GeoJSON
      key={`level2-${getSelectedAreaName()}-${getHighlightedFeatureKey()}`}
      data={data}
      style={(feature) => {
        const highlighted = isFeatureHighlighted(
          feature as MapFeature,
          highlightedFeature
        );
        return {
          ...getLayerStyle(
            feature as MapFeature,
            true,
            highlighted,
            selectedArea
          ),
          cursor: 'pointer',
        };
      }}
      onEachFeature={onEachFeature}
    />
  );
};
