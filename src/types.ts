/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Layer } from 'leaflet';

export type MapBounds = [number, number][];

export type FocusArea = {
  bounds: any;
  zoom: number;
} | null;

export type DrilldownState = {
  level: number;
  focusArea: FocusArea;
  selectedFeature: any;
};

export type MapFeatureClickHandler = (feature: any, layer: Layer) => void;

export type PhilippinesMapProps = {
  level?: number;
  onAreaClick?: (feature: any, bounds: any) => void;
  focusArea?: FocusArea;
  onBack?: () => void;
  maxLevel?: number;
};
