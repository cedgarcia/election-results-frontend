import { useEffect, useRef, useState } from 'react';
import { GeoJSONFeature } from '../types';

// CUSTOM HOOK TO HANDLE MAP INTERACTIONS AND STATE
export const useMapInteractions = (
  initialSelectedArea: GeoJSONFeature | null
) => {
  const [selectedArea, setSelectedArea] = useState<GeoJSONFeature | null>(
    initialSelectedArea
  );
  const [highlightedFeature, setHighlightedFeature] =
    useState<GeoJSONFeature | null>(null);
  const isZoomingRef = useRef(false);

  // HANDLE FEATURE CLICKS
  const handleFeatureClick = (
    feature: GeoJSONFeature,
    isLevel2: boolean = false
  ) => {
    if (!isZoomingRef.current) {
      if (isLevel2) {
        // FOR LEVEL 2 CLICKS, ONLY HANDLE HIGHLIGHTING
        const isCurrentlyHighlighted = isFeatureHighlighted(feature);
        setHighlightedFeature(isCurrentlyHighlighted ? null : feature);
      } else {
        // FOR LEVEL 1 CLICKS, CLEAR HIGHLIGHTING AND UPDATE SELECTED AREA
        setHighlightedFeature(null);
        setSelectedArea(feature);
      }
    }
  };

  // CHECK IF A FEATURE IS CURRENTLY HIGHLIGHTED
  const isFeatureHighlighted = (feature: GeoJSONFeature) => {
    if (!highlightedFeature) return false;

    // CREATE A UNIQUE IDENTIFIER BY COMBINING MULTIPLE PROPERTIES
    const getFeatureId = (f: GeoJSONFeature) => {
      return JSON.stringify({
        NAME_1: f.properties?.NAME_1,
        NAME_2: f.properties?.NAME_2,
        name: f.properties?.name,
        ADM1_EN: f.properties?.ADM1_EN,
        ADM2_EN: f.properties?.ADM2_EN,
        id: f.properties?.id,
        fid: f.properties?.fid,
      });
    };

    return getFeatureId(feature) === getFeatureId(highlightedFeature);
  };

  // RESET TO FULL PHILIPPINES VIEW
  const resetToDefaultView = () => {
    setSelectedArea(null);
    setHighlightedFeature(null);
  };

  return {
    selectedArea,
    highlightedFeature,
    isZoomingRef,
    handleFeatureClick,
    isFeatureHighlighted,
    resetToDefaultView,
    setHighlightedFeature,
  };
};
