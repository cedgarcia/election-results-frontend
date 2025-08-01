/* eslint-disable @typescript-eslint/no-explicit-any */
import { LEVEL1_STYLES, LEVEL2_STYLES } from '@/constants/map';
import type { FeatureCollection, GeoJSON as GeoJSONType } from 'geojson';
import type { LayerStyleConfig, MapFeature } from '@/types/map';

// Type guard for FeatureCollection
export const isFeatureCollection = (
  geojson: GeoJSONType | null
): geojson is FeatureCollection => {
  return geojson !== null && geojson.type === 'FeatureCollection';
};

// Generate unique feature identifier
export const getFeatureId = (feature: MapFeature): string => {
  return JSON.stringify({
    NAME_1: feature.properties?.NAME_1,
    NAME_2: feature.properties?.NAME_2,
    name: feature.properties?.name,
    ADM1_EN: feature.properties?.ADM1_EN,
    ADM2_EN: feature.properties?.ADM2_EN,
    id: feature.properties?.id,
    fid: feature.properties?.fid,
  });
};

// Check if feature is highlighted
export const isFeatureHighlighted = (
  feature: MapFeature,
  highlightedFeature: MapFeature | null
): boolean => {
  if (!highlightedFeature) return false;
  return getFeatureId(feature) === getFeatureId(highlightedFeature);
};

// Get feature display name
export const getFeatureName = (
  feature: MapFeature,
  isLevel2: boolean = false
): string => {
  if (isLevel2) {
    return (
      feature.properties?.NAME_2 ||
      feature.properties?.ADM2_EN ||
      feature.properties?.name ||
      feature.properties?.city ||
      feature.properties?.municipality ||
      'City/Municipality'
    );
  } else {
    return (
      feature.properties?.NAME_1 ||
      feature.properties?.ADM1_EN ||
      feature.properties?.name ||
      feature.properties?.province ||
      'Province/Region'
    );
  }
};

// Get area name for filtering
export const getAreaName = (area: MapFeature): string | null => {
  return (
    area.properties?.name ||
    area.properties?.NAME_1 ||
    area.properties?.ADM1_EN ||
    null
  );
};

// Filter level 2 data based on selected area
export const filterLevel2Data = (
  level2Data: GeoJSONType | null,
  selectedArea: MapFeature | null
): GeoJSONType | null => {
  if (!level2Data || !selectedArea) return null;

  const selectedAreaName = getAreaName(selectedArea);
  if (!selectedAreaName) return null;

  if (!isFeatureCollection(level2Data)) return null;

  const filteredFeatures = level2Data.features.filter((feature: any) => {
    // Cast to MapFeature to access our custom properties
    const mapFeature = feature as MapFeature;
    return (
      mapFeature.properties?.NAME_1 === selectedAreaName ||
      mapFeature.properties?.ADM1_EN === selectedAreaName ||
      mapFeature.properties?.parent === selectedAreaName ||
      mapFeature.properties?.province === selectedAreaName
    );
  });

  if (filteredFeatures.length === 0) {
    return level2Data; // Fallback to all features
  }

  return {
    ...level2Data,
    features: filteredFeatures,
  };
};

// Get layer styles based on level and state
export const getLayerStyle = (
  feature: MapFeature,
  isLevel2: boolean,
  isHighlighted: boolean,
  selectedArea: MapFeature | null
): LayerStyleConfig => {
  if (isLevel2) {
    return isHighlighted ? LEVEL2_STYLES.highlighted : LEVEL2_STYLES.default;
  } else {
    if (selectedArea) {
      return isHighlighted
        ? LEVEL1_STYLES.selectedAreaHighlighted
        : LEVEL1_STYLES.selectedAreaDefault;
    } else {
      return isHighlighted ? LEVEL1_STYLES.highlighted : LEVEL1_STYLES.default;
    }
  }
};

// Get hover style
export const getHoverStyle = (isLevel2: boolean): LayerStyleConfig => {
  return isLevel2 ? LEVEL2_STYLES.hover : LEVEL1_STYLES.hover;
};

// Load map data
export const loadMapData = async (): Promise<{
  level1: GeoJSONType | null;
  level2: GeoJSONType | null;
  level3: GeoJSONType | null;
}> => {
  try {
    const [level1Response, level2Response, level3Response] = await Promise.all([
      fetch('/map-data/level_1.json'),
      fetch('/map-data/level_2.json'),
      fetch('/map-data/level_3.json').catch(() => null),
    ]);

    const level1Data = await level1Response.json();
    const level2Data = await level2Response.json();
    const level3Data = level3Response ? await level3Response.json() : null;

    return {
      level1: level1Data,
      level2: level2Data,
      level3: level3Data,
    };
  } catch (error) {
    console.error('Error loading map data:', error);
    throw error;
  }
};
