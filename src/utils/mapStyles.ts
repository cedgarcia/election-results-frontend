import { GeoJSONFeature } from '../types';

// GET DEFAULT STYLE FOR A FEATURE BASED ON ITS LEVEL AND STATE
export const getDefaultStyle = (
  feature: GeoJSONFeature,
  isLevel2: boolean,
  isHighlighted: boolean,
  hasSelectedArea: boolean
) => {
  if (isLevel2) {
    return {
      fillColor: isHighlighted ? '#74b9ff' : '#ff6b6b',
      weight: isHighlighted ? 4 : 1,
      color: isHighlighted ? '#0984e3' : '#d63031',
      fillOpacity: isHighlighted ? 0.9 : 0.8,
      dashArray: isHighlighted ? '0' : '0',
    };
  } else {
    return {
      fillColor: isHighlighted ? '#00b894' : '#3388ff',
      weight: isHighlighted ? 4 : 1,
      color: isHighlighted ? '#00a085' : '#0c4da2',
      fillOpacity: hasSelectedArea
        ? isHighlighted
          ? 0.8
          : 0.4
        : isHighlighted
          ? 0.9
          : 0.7,
      dashArray: isHighlighted ? '0' : '0',
    };
  }
};

// GET HOVER STYLE FOR A FEATURE
export const getHoverStyle = (isLevel2: boolean) => {
  return isLevel2
    ? {
        fillColor: '#fd79a8',
        weight: 2,
        fillOpacity: 0.9,
        color: '#e84393',
      }
    : {
        fillColor: '#ff7800',
        weight: 2,
        fillOpacity: 0.9,
        color: '#d63031',
      };
};

// GET FEATURE NAME FOR TOOLTIPS
export const getFeatureName = (feature: GeoJSONFeature, isLevel2: boolean) => {
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
