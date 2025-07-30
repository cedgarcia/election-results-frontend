/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { Map as LeafletMap } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapInteractions } from '@/hooks/useMapInteraction';
import { useMapData } from '../hooks/useMapData';
import {
  CENTER,
  GeoJSONFeature,
  PH_BOUNDS,
  PhilippinesMapProps,
} from '../types';
import MapControls from './MapControl';
import MapLayer from './MapLayer';

const PhilippinesMap: React.FC<PhilippinesMapProps> = ({
  onAreaClick,
  selectedArea: initialSelectedArea,
}) => {
  // LOAD MAP DATA
  const { mapData, isLoading } = useMapData();

  // MANAGE MAP INTERACTIONS AND STATE
  const {
    selectedArea,
    highlightedFeature,
    isZoomingRef,
    handleFeatureClick,
    resetToDefaultView,
    setHighlightedFeature,
  } = useMapInteractions(initialSelectedArea || null);

  const mapRef = useRef<LeafletMap | null>(null);

  // HANDLE ZOOM TO SELECTED AREA AND CLEAR HIGHLIGHTING WHEN DRILLING DOWN
  useEffect(() => {
    if (selectedArea && mapRef.current && !isZoomingRef.current) {
      isZoomingRef.current = true;

      // CLEAR HIGHLIGHTING WHEN DRILLING DOWN TO LEVEL 2
      setHighlightedFeature(null);

      // FIND THE LAYER THAT MATCHES THE SELECTED AREA
      const findAndZoomToLayer = () => {
        let foundLayer: any = null;

        mapRef.current?.eachLayer((layer: any) => {
          if (
            layer.feature &&
            layer.getBounds &&
            (layer.feature.properties?.NAME_1 ===
              selectedArea.properties?.NAME_1 ||
              layer.feature.properties?.name === selectedArea.properties?.name)
          ) {
            foundLayer = layer;
          }
        });

        if (foundLayer && foundLayer.getBounds) {
          try {
            mapRef.current?.fitBounds(foundLayer.getBounds(), {
              padding: [40, 40],
              maxZoom: 9,
              animate: true,
              duration: 0.8,
            });
          } catch (error) {
            console.warn('ERROR FITTING BOUNDS:', error);
          }
        }

        // RESET ZOOM FLAG AFTER ANIMATION
        setTimeout(() => {
          isZoomingRef.current = false;
        }, 1000);
      };

      // SMALL DELAY TO ENSURE LAYERS ARE RENDERED
      setTimeout(findAndZoomToLayer, 200);
    } else if (!selectedArea && mapRef.current && !isZoomingRef.current) {
      // RESET TO FULL PHILIPPINES VIEW AND CLEAR HIGHLIGHTING
      isZoomingRef.current = true;
      setHighlightedFeature(null);

      try {
        mapRef.current.setView(CENTER, 6, {
          animate: true,
          duration: 0.8,
        });
      } catch (error) {
        console.warn('ERROR RESETTING VIEW:', error);
      }

      setTimeout(() => {
        isZoomingRef.current = false;
      }, 1000);
    }
  }, [selectedArea, isZoomingRef, setHighlightedFeature]);

  // FILTER LEVEL 2 DATA TO SHOW ONLY FEATURES WITHIN THE SELECTED AREA
  const getFilteredLevel2Data = () => {
    if (!mapData.level2 || !selectedArea) return null;

    const selectedAreaName =
      selectedArea.properties?.name ||
      selectedArea.properties?.NAME_1 ||
      selectedArea.properties?.ADM1_EN;
    if (!selectedAreaName) return null;

    const filteredFeatures = mapData.level2.features.filter(
      (feature: GeoJSONFeature) => {
        // MATCH BASED ON THE PARENT AREA NAME
        return (
          feature.properties?.NAME_1 === selectedAreaName ||
          feature.properties?.ADM1_EN === selectedAreaName ||
          feature.properties?.parent === selectedAreaName ||
          feature.properties?.province === selectedAreaName
        );
      }
    );

    if (filteredFeatures.length === 0) {
      // IF NO EXACT MATCH, RETURN ALL LEVEL 2 FEATURES (FALLBACK)
      return mapData.level2;
    }

    return {
      ...mapData.level2,
      features: filteredFeatures,
    };
  };

  const filteredLevel2Data = getFilteredLevel2Data();

  // HANDLE RESET BUTTON CLICK
  const handleReset = () => {
    resetToDefaultView();
    if (onAreaClick) {
      onAreaClick(null, null);
    }
  };

  // HANDLE FEATURE CLICK AND NOTIFY PARENT
  const handleFeatureClickWithCallback = (
    feature: GeoJSONFeature,
    isLevel2: boolean
  ) => {
    handleFeatureClick(feature, isLevel2);
    if (onAreaClick) {
      // For level 2 clicks, we might want to pass bounds or other info
      onAreaClick(feature, null);
    }
  };

  if (isLoading) {
    return (
      <div className="relative h-[500px] w-full bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-600">Loading map data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] w-full bg-white">
      <MapContainer
        center={CENTER}
        zoom={6}
        minZoom={5}
        maxZoom={12}
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
        {/* RENDER LEVEL 1 DATA */}
        {mapData.level1 && (
          <MapLayer
            data={mapData.level1}
            isLevel2={false}
            selectedArea={selectedArea}
            highlightedFeature={highlightedFeature}
            onFeatureClick={handleFeatureClickWithCallback}
          />
        )}

        {/* RENDER LEVEL 2 DATA ONLY FOR SELECTED AREA */}
        {filteredLevel2Data && filteredLevel2Data.features.length > 0 && (
          <MapLayer
            data={filteredLevel2Data}
            isLevel2={true}
            selectedArea={selectedArea}
            highlightedFeature={highlightedFeature}
            onFeatureClick={handleFeatureClickWithCallback}
          />
        )}
      </MapContainer>

      {/* MAP CONTROLS */}
      <MapControls
        selectedArea={selectedArea}
        highlightedFeature={highlightedFeature}
        onReset={handleReset}
        isZooming={isZoomingRef.current}
      />
    </div>
  );
};

export default PhilippinesMap;
