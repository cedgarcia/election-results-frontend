/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CENTER, MAP_CONFIG, PH_BOUNDS } from '@/constants/map';
// Utils and hooks
import {
  filterLevel2Data,
  getLayerStyle,
  isFeatureHighlighted,
  loadMapData,
} from '@/utils/mapUtils';
import type { Layer, Map as LeafletMap } from 'leaflet';
// Types and constants
import type { MapData, MapFeature, PhilippinesMapProps } from '@/types/map';
import { useMapLayerHandlers } from '@/hooks/useMapLayerHandlers';
import { useMapZoomControls } from '@/hooks/useMapZoomControls';
// Components
import { Level1Layer, Level2Layer } from '@/components/MapLayers';
import { BackButton, LoadingIndicator, MapIndicator } from '@/components/MapUI';

const PhilippinesMap = ({ onAreaClick, selectedArea }: PhilippinesMapProps) => {
  // State
  const [allData, setAllData] = useState<MapData>({
    level1: null,
    level2: null,
    level3: null,
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [highlightedFeature, setHighlightedFeature] =
    useState<MapFeature | null>(null);

  // Refs
  const mapRef = useRef<LeafletMap | null>(null);
  const isZoomingRef = useRef(false);

  // Normalize selectedArea to handle undefined
  const normalizedSelectedArea = selectedArea ?? null;

  // Custom hooks
  const { createOnEachFeature } = useMapLayerHandlers({
    highlightedFeature,
    selectedArea: normalizedSelectedArea,
    isZoomingRef,
    onFeatureClick: handleFeatureClick,
  });

  useMapZoomControls({
    mapRef,
    isZoomingRef,
    selectedArea: normalizedSelectedArea,
    setHighlightedFeature,
  });

  // Load all map data on mount
  useEffect(() => {
    const loadAllMapData = async () => {
      try {
        setInitialLoading(true);
        const data = await loadMapData();
        setAllData(data);
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadAllMapData();
  }, []);

  // Handle feature clicks
  function handleFeatureClick(
    feature: MapFeature,
    layer: Layer,
    isLevel2: boolean = false
  ) {
    if (!isZoomingRef.current) {
      if (isLevel2) {
        // For level 2 clicks, only handle highlighting
        const isCurrentlyHighlighted = isFeatureHighlighted(
          feature,
          highlightedFeature
        );
        setHighlightedFeature(isCurrentlyHighlighted ? null : feature);
      } else {
        // For level 1 clicks, clear highlighting and call parent callback
        setHighlightedFeature(null);
        if (onAreaClick) {
          try {
            const bounds = (layer as any).getBounds();
            onAreaClick(feature, bounds);
          } catch (error) {
            console.warn('Error handling feature click:', error);
          }
        }
      }
    }
  }

  // Handle back button click
  const handleBackClick = () => {
    if (onAreaClick && !isZoomingRef.current) {
      onAreaClick(null, null);
    }
  };

  // Update layer styles when highlighting changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer: any) => {
        if (layer.feature && layer.setStyle) {
          try {
            const isLevel2Layer = !!(
              layer.feature.properties?.NAME_2 ||
              layer.feature.properties?.ADM2_EN
            );
            const highlighted = isFeatureHighlighted(
              layer.feature,
              highlightedFeature
            );
            const style = getLayerStyle(
              layer.feature,
              isLevel2Layer,
              highlighted,
              normalizedSelectedArea
            );
            layer.setStyle(style);
          } catch (error) {
            // Ignore styling errors
          }
        }
      });
    }
  }, [highlightedFeature, normalizedSelectedArea]);

  // Get filtered level 2 data
  const filteredLevel2Data = filterLevel2Data(
    allData.level2,
    normalizedSelectedArea
  );

  // Show loading indicator
  if (initialLoading) {
    return <LoadingIndicator isLoading={initialLoading} />;
  }

  return (
    <div className="relative h-[500px] w-full bg-white">
      <MapContainer
        center={CENTER}
        zoom={MAP_CONFIG.initialZoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        maxBounds={PH_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="z-0 h-full w-full bg-white"
        attributionControl={false}
        zoomControl={true}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        dragging={true}
        ref={mapRef}
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
      >
        {/* Level 1 Layer - Always rendered */}
        {allData.level1 && (
          <Level1Layer
            data={allData.level1}
            highlightedFeature={highlightedFeature}
            selectedArea={normalizedSelectedArea}
            onEachFeature={createOnEachFeature(false)}
          />
        )}

        {/* Level 2 Layer - Rendered when area is selected */}
        {filteredLevel2Data && (
          <Level2Layer
            data={filteredLevel2Data}
            highlightedFeature={highlightedFeature}
            selectedArea={normalizedSelectedArea}
            onEachFeature={createOnEachFeature(true)}
          />
        )}
      </MapContainer>

      {/* UI Components */}
      <MapIndicator
        selectedArea={normalizedSelectedArea}
        highlightedFeature={highlightedFeature}
      />

      <BackButton
        selectedArea={normalizedSelectedArea}
        isZoomingRef={isZoomingRef}
        onBackClick={handleBackClick}
      />
    </div>
  );
};

export default PhilippinesMap;
