// types.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Feature, FeatureCollection, Geometry } from 'geojson';

// TYPES FOR PHILIPPINES MAP COMPONENT
export type GeoJSONFeature = Feature<
  Geometry,
  {
    NAME_1?: string;
    NAME_2?: string;
    ADM1_EN?: string;
    ADM2_EN?: string;
    name?: string;
    id?: string;
    fid?: string;
    parent?: string;
    province?: string;
    city?: string;
    municipality?: string;
    [key: string]: any;
  }
>;

export type GeoJSONData = FeatureCollection<
  Geometry,
  {
    NAME_1?: string;
    NAME_2?: string;
    ADM1_EN?: string;
    ADM2_EN?: string;
    name?: string;
    id?: string;
    fid?: string;
    parent?: string;
    province?: string;
    city?: string;
    municipality?: string;
    [key: string]: any;
  }
>;

export type MapDataLevels = {
  level1: GeoJSONData | null;
  level2: GeoJSONData | null;
  level3: GeoJSONData | null;
};

export type PhilippinesMapProps = {
  onAreaClick?: (feature: GeoJSONFeature | null, bounds: any) => void;
  selectedArea?: GeoJSONFeature | null;
};

// PHILIPPINES BOUNDS AND CENTER COORDINATES
export const PH_BOUNDS: [[number, number], [number, number]] = [
  [5.0, 115.0], // SOUTHWEST
  [21.0, 127.0], // NORTHEAST
];

export const CENTER: [number, number] = [
  (PH_BOUNDS[0][0] + PH_BOUNDS[1][0]) / 2,
  (PH_BOUNDS[0][1] + PH_BOUNDS[1][1]) / 2,
];
