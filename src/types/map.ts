/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Feature,
  FeatureCollection,
  GeoJSON as GeoJSONType,
} from 'geojson';
import type { Layer } from 'leaflet';

export interface MapFeature extends Feature {
  properties: {
    NAME_1?: string;
    NAME_2?: string;
    name?: string;
    ADM1_EN?: string;
    ADM2_EN?: string;
    id?: string;
    fid?: string;
    city?: string;
    municipality?: string;
    province?: string;
    parent?: string;
  };
}

export interface MapData {
  level1: GeoJSONType | null;
  level2: GeoJSONType | null;
  level3: GeoJSONType | null;
}

export interface PhilippinesMapProps {
  onAreaClick?: (feature: MapFeature | null, bounds: any) => void;
  selectedArea?: MapFeature | null;
}

export interface LayerStyleConfig {
  fillColor: string;
  weight: number;
  color: string;
  fillOpacity: number;
  dashArray: string;
  cursor?: string;
}

export interface MapBounds {
  southwest: [number, number];
  northeast: [number, number];
}

export interface MapEventHandlers {
  onMouseOver: (feature: MapFeature, layer: Layer) => void;
  onMouseOut: (feature: MapFeature, layer: Layer) => void;
  onClick: (feature: MapFeature, layer: Layer) => void;
}
