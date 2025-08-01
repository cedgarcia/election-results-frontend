/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect } from 'react';
import { CENTER, MAP_CONFIG } from '@/constants/map';
import type { Map as LeafletMap } from 'leaflet';
import type { MapFeature } from '@/types/map';

interface UseMapZoomControlsProps {
  mapRef: React.MutableRefObject<LeafletMap | null>;
  isZoomingRef: React.MutableRefObject<boolean>;
  selectedArea: MapFeature | null;
  setHighlightedFeature: (feature: MapFeature | null) => void;
}

export const useMapZoomControls = ({
  mapRef,
  isZoomingRef,
  selectedArea,
  setHighlightedFeature,
}: UseMapZoomControlsProps) => {
  const findAndZoomToLayer = useCallback(() => {
    if (!selectedArea || !mapRef.current) return;

    let foundLayer = null;

    mapRef.current.eachLayer((layer: any) => {
      if (
        layer.feature &&
        (layer.feature.properties?.NAME_1 === selectedArea.properties?.NAME_1 ||
          layer.feature.properties?.name === selectedArea.properties?.name)
      ) {
        foundLayer = layer;
      }
    });

    if (foundLayer) {
      try {
        mapRef.current.fitBounds((foundLayer as any).getBounds(), {
          padding: MAP_CONFIG.padding,
          maxZoom: MAP_CONFIG.detailZoom,
          animate: true,
          duration: MAP_CONFIG.animationDuration,
        });
      } catch (error) {
        console.warn('Error fitting bounds:', error);
      }
    }

    // Reset zoom flag after animation
    setTimeout(() => {
      isZoomingRef.current = false;
    }, MAP_CONFIG.zoomResetDelay);
  }, [selectedArea, mapRef, isZoomingRef]);

  const resetToFullView = useCallback(() => {
    if (!mapRef.current) return;

    isZoomingRef.current = true;
    setHighlightedFeature(null);

    try {
      mapRef.current.setView(CENTER, MAP_CONFIG.initialZoom, {
        animate: true,
        duration: MAP_CONFIG.animationDuration,
      });
    } catch (error) {
      console.warn('Error resetting view:', error);
    }

    setTimeout(() => {
      isZoomingRef.current = false;
    }, MAP_CONFIG.zoomResetDelay);
  }, [mapRef, isZoomingRef, setHighlightedFeature]);

  // Handle zoom to selected area
  useEffect(() => {
    if (selectedArea && mapRef.current && !isZoomingRef.current) {
      isZoomingRef.current = true;
      setHighlightedFeature(null);

      setTimeout(findAndZoomToLayer, MAP_CONFIG.debounceDelay);
    } else if (!selectedArea && mapRef.current && !isZoomingRef.current) {
      resetToFullView();
    }
  }, [selectedArea, findAndZoomToLayer, resetToFullView]);

  return {
    findAndZoomToLayer,
    resetToFullView,
  };
};
