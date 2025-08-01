/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import {
  getFeatureName,
  getHoverStyle,
  getLayerStyle,
  isFeatureHighlighted,
} from '@/utils/mapUtils';
import type { Layer } from 'leaflet';
import type { MapFeature } from '@/types/map';

interface UseMapLayerHandlersProps {
  highlightedFeature: MapFeature | null;
  selectedArea: MapFeature | null;
  isZoomingRef: React.MutableRefObject<boolean>;
  onFeatureClick: (
    feature: MapFeature,
    layer: Layer,
    isLevel2: boolean
  ) => void;
}

export const useMapLayerHandlers = ({
  highlightedFeature,
  selectedArea,
  isZoomingRef,
  onFeatureClick,
}: UseMapLayerHandlersProps) => {
  const createOnEachFeature = useCallback(
    (isLevel2: boolean = false) => {
      return (feature: MapFeature, layer: Layer) => {
        const currentLayer = layer as L.Path;

        const getDefaultStyle = () => {
          const highlighted = isFeatureHighlighted(feature, highlightedFeature);
          return getLayerStyle(feature, isLevel2, highlighted, selectedArea);
        };

        const hoverStyle = getHoverStyle(isLevel2);

        // Set initial style
        currentLayer.setStyle(getDefaultStyle());

        const mouseoverHandler = (e: any) => {
          const target = e.target as L.Path;
          if (target && !isZoomingRef.current) {
            try {
              if (!isFeatureHighlighted(feature, highlightedFeature)) {
                target.setStyle(hoverStyle);
              }
              if (!target.isPopupOpen()) {
                target.openTooltip();
              }
            } catch (error) {
              // Ignore styling errors
            }
          }
        };

        const mouseoutHandler = (e: any) => {
          const target = e.target as L.Path;
          if (target && !isZoomingRef.current) {
            try {
              target.setStyle(getDefaultStyle());
              target.closeTooltip();
            } catch (error) {
              // Ignore styling errors
            }
          }
        };

        const clickHandler = (e: any) => {
          if (!isZoomingRef.current) {
            onFeatureClick(feature, currentLayer, isLevel2);
          }
        };

        // Add event listeners
        currentLayer.on({
          mouseover: mouseoverHandler,
          mouseout: mouseoutHandler,
          click: clickHandler,
        });

        // Add tooltip
        try {
          currentLayer.bindTooltip(getFeatureName(feature, isLevel2), {
            permanent: false,
            direction: 'center',
            className: `custom-tooltip ${isLevel2 ? 'level2-tooltip' : 'level1-tooltip'}`,
            opacity: 0.9,
          });
        } catch (error) {
          console.warn('Error binding tooltip:', error);
        }
      };
    },
    [highlightedFeature, selectedArea, isZoomingRef, onFeatureClick]
  );

  return { createOnEachFeature };
};
