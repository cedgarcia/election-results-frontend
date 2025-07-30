// MapLayer.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Feature, Geometry } from 'geojson';
import { GeoJSON } from 'react-leaflet';
import { GeoJSONData, GeoJSONFeature } from '../types';
import {
  getDefaultStyle,
  getFeatureName,
  getHoverStyle,
} from '../utils/mapStyles';

type MapLayerProps = {
  data: GeoJSONData;
  isLevel2: boolean;
  selectedArea: GeoJSONFeature | null;
  highlightedFeature: GeoJSONFeature | null;
  onFeatureClick: (feature: GeoJSONFeature, isLevel2: boolean) => void;
};

const MapLayer: React.FC<MapLayerProps> = ({
  data,
  isLevel2,
  selectedArea,
  highlightedFeature,
  onFeatureClick,
}) => {
  // CREATE EVENT HANDLERS FOR EACH FEATURE
  const createOnEachFeature = (
    feature: Feature<Geometry, any> | undefined,
    layer: any
  ) => {
    if (!feature) return;

    const currentLayer = layer;
    const geoJSONFeature = feature as GeoJSONFeature;

    // SET INITIAL STYLE
    const isHighlighted = highlightedFeature
      ? JSON.stringify(highlightedFeature) === JSON.stringify(geoJSONFeature)
      : false;
    currentLayer.setStyle(
      getDefaultStyle(geoJSONFeature, isLevel2, isHighlighted, !!selectedArea)
    );

    // EVENT HANDLERS
    const mouseoverHandler = (e: any) => {
      if (e.target && e.target.setStyle) {
        try {
          if (!isHighlighted) {
            e.target.setStyle(getHoverStyle(isLevel2));
          }
          if (!e.target.isPopupOpen()) {
            e.target.openTooltip();
          }
        } catch (error) {
          console.warn('Error in mouseover:', error);
        }
      }
    };

    const mouseoutHandler = (e: any) => {
      if (e.target && e.target.setStyle) {
        try {
          e.target.setStyle(
            getDefaultStyle(
              geoJSONFeature,
              isLevel2,
              isHighlighted,
              !!selectedArea
            )
          );
          e.target.closeTooltip();
        } catch (error) {
          console.warn('Error in mouseout:', error);
        }
      }
    };

    const clickHandler = () => {
      onFeatureClick(geoJSONFeature, isLevel2);
    };

    // ADD EVENT LISTENERS
    currentLayer.on({
      mouseover: mouseoverHandler,
      mouseout: mouseoutHandler,
      click: clickHandler,
    });

    // ADD TOOLTIP
    try {
      currentLayer.bindTooltip(getFeatureName(geoJSONFeature, isLevel2), {
        permanent: false,
        direction: 'center',
        className: `custom-tooltip ${isLevel2 ? 'level2-tooltip' : 'level1-tooltip'}`,
        opacity: 0.9,
      });
    } catch (error) {
      console.warn('Error binding tooltip:', error);
    }
  };

  const styleFunction = (feature: Feature<Geometry, any> | undefined) => {
    if (!feature) return {};

    const geoJSONFeature = feature as GeoJSONFeature;
    return getDefaultStyle(
      geoJSONFeature,
      isLevel2,
      highlightedFeature
        ? JSON.stringify(highlightedFeature) === JSON.stringify(geoJSONFeature)
        : false,
      !!selectedArea
    );
  };

  return (
    <GeoJSON
      key={`${isLevel2 ? 'level2' : 'level1'}-${
        selectedArea ? 'selected' : 'default'
      }-${highlightedFeature ? 'highlighted' : 'normal'}`}
      data={data}
      style={styleFunction}
      onEachFeature={createOnEachFeature}
    />
  );
};

export default MapLayer;
