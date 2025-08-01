// Philippines bounding coordinates
export const PH_BOUNDS: [number, number][] = [
  [5.0, 115.0], // Southwest
  [21.0, 127.0], // Northeast
];

// Calculate center point
export const CENTER: [number, number] = [
  (PH_BOUNDS[0][0] + PH_BOUNDS[1][0]) / 2,
  (PH_BOUNDS[0][1] + PH_BOUNDS[1][1]) / 2,
];

// Map configuration
export const MAP_CONFIG = {
  initialZoom: 6,
  minZoom: 5,
  maxZoom: 12,
  detailZoom: 9,
  animationDuration: 0.8,
  padding: [40, 40] as [number, number],
  debounceDelay: 200,
  zoomResetDelay: 1000,
} as const;

// Style configurations
export const LEVEL1_STYLES = {
  default: {
    fillColor: '#3388ff',
    weight: 1,
    color: '#0c4da2',
    fillOpacity: 0.7,
    dashArray: '0',
  },
  highlighted: {
    fillColor: '#00b894',
    weight: 4,
    color: '#00a085',
    fillOpacity: 0.9,
    dashArray: '0',
  },
  selectedAreaDefault: {
    fillColor: '#3388ff',
    weight: 1,
    color: '#0c4da2',
    fillOpacity: 0.4,
    dashArray: '0',
  },
  selectedAreaHighlighted: {
    fillColor: '#00b894',
    weight: 4,
    color: '#00a085',
    fillOpacity: 0.8,
    dashArray: '0',
  },
  hover: {
    fillColor: '#ff7800',
    weight: 2,
    fillOpacity: 0.9,
    color: '#d63031',
    dashArray: '0',
  },
} as const;

export const LEVEL2_STYLES = {
  default: {
    fillColor: '#ff6b6b',
    weight: 1,
    color: '#d63031',
    fillOpacity: 0.8,
    dashArray: '0',
  },
  highlighted: {
    fillColor: '#74b9ff',
    weight: 4,
    color: '#0984e3',
    fillOpacity: 0.9,
    dashArray: '0',
  },
  hover: {
    fillColor: '#fd79a8',
    weight: 2,
    fillOpacity: 0.9,
    color: '#e84393',
    dashArray: '0',
  },
} as const;
