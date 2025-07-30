/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { GeoJSON, MapContainer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoJSON as GeoJSONType } from 'geojson';
import type { Layer, Map as LeafletMap } from 'leaflet';

// Philippines bounding coordinates
const PH_BOUNDS: [number, number][] = [
  [5.0, 115.0], // Southwest
  [21.0, 127.0], // Northeast
];

// Calculate center point
const CENTER: [number, number] = [
  (PH_BOUNDS[0][0] + PH_BOUNDS[1][0]) / 2,
  (PH_BOUNDS[0][1] + PH_BOUNDS[1][1]) / 2,
];

type PhilippinesMapProps = {
  onAreaClick?: (feature: any, bounds: any) => void;
  selectedArea?: any;
};

const PhilippinesMap = ({ onAreaClick, selectedArea }: PhilippinesMapProps) => {
  const [allData, setAllData] = useState<{
    level1: GeoJSONType | null;
    level2: GeoJSONType | null;
    level3: GeoJSONType | null;
  }>({
    level1: null,
    level2: null,
    level3: null,
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [highlightedFeature, setHighlightedFeature] = useState<any>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const isZoomingRef = useRef(false);

  // Load ALL data once at component mount - no refetching during drill-downs
  useEffect(() => {
    const loadAllMapData = async () => {
      try {
        setInitialLoading(true);

        // Load all levels simultaneously
        const [level1Response, level2Response, level3Response] =
          await Promise.all([
            fetch('/map-data/level_1.json'),
            fetch('/map-data/level_2.json'),
            fetch('/map-data/level_3.json').catch(() => null), // Level 3 might not exist
          ]);

        const level1Data = await level1Response.json();
        const level2Data = await level2Response.json();
        const level3Data = level3Response ? await level3Response.json() : null;

        setAllData({
          level1: level1Data,
          level2: level2Data,
          level3: level3Data,
        });
      } catch (error) {
        console.error('Error loading map data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadAllMapData();
  }, []); // Only run once on mount

  // Handle zoom to selected area and clear highlighting when drilling down
  useEffect(() => {
    if (selectedArea && mapRef.current && !isZoomingRef.current) {
      isZoomingRef.current = true;

      // Clear highlighting when drilling down to level 2
      setHighlightedFeature(null);

      // Find the layer that matches the selected area
      const findAndZoomToLayer = () => {
        let foundLayer = null;

        mapRef.current?.eachLayer((layer: any) => {
          if (
            layer.feature &&
            (layer.feature.properties?.NAME_1 ===
              selectedArea.properties?.NAME_1 ||
              layer.feature.properties?.name === selectedArea.properties?.name)
          ) {
            foundLayer = layer;
          }
        });

        if (foundLayer) {
          try {
            mapRef.current?.fitBounds(foundLayer.getBounds(), {
              padding: [40, 40],
              maxZoom: 9,
              animate: true,
              duration: 0.8,
            });
          } catch (error) {
            console.warn('Error fitting bounds:', error);
          }
        }

        // Reset zoom flag after animation
        setTimeout(() => {
          isZoomingRef.current = false;
        }, 1000);
      };

      // Small delay to ensure layers are rendered
      setTimeout(findAndZoomToLayer, 200);
    } else if (!selectedArea && mapRef.current && !isZoomingRef.current) {
      // Reset to full Philippines view and clear highlighting
      isZoomingRef.current = true;
      setHighlightedFeature(null);

      try {
        mapRef.current.setView(CENTER, 6, {
          animate: true,
          duration: 0.8,
        });
      } catch (error) {
        console.warn('Error resetting view:', error);
      }

      setTimeout(() => {
        isZoomingRef.current = false;
      }, 1000);
    }
  }, [selectedArea]);

  const handleFeatureClick = (
    feature: any,
    layer: Layer,
    isLevel2: boolean = false
  ) => {
    if (!isZoomingRef.current) {
      if (isLevel2) {
        // For level 2 clicks, only handle highlighting
        const isCurrentlyHighlighted = isFeatureHighlighted(feature);
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
  };

  // Filter level 2 data to show only features within the selected area
  const getFilteredLevel2Data = () => {
    if (!allData.level2 || !selectedArea) return null;

    const selectedAreaName =
      selectedArea.properties?.name ||
      selectedArea.properties?.NAME_1 ||
      selectedArea.properties?.ADM1_EN;
    if (!selectedAreaName) return null;

    const filteredFeatures = (allData.level2 as any).features.filter(
      (feature: any) => {
        // Match based on the parent area name (adjust property names as needed)
        return (
          feature.properties?.NAME_1 === selectedAreaName ||
          feature.properties?.ADM1_EN === selectedAreaName ||
          feature.properties?.parent === selectedAreaName ||
          feature.properties?.province === selectedAreaName
        );
      }
    );

    if (filteredFeatures.length === 0) {
      // If no exact match, return all level 2 features (fallback)
      return allData.level2;
    }

    return {
      ...allData.level2,
      features: filteredFeatures,
    };
  };

  const isFeatureHighlighted = (feature: any) => {
    if (!highlightedFeature) return false;

    // Create a unique identifier by combining multiple properties
    const getFeatureId = (f: any) => {
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

  const createOnEachFeature =
    (isLevel2 = false) =>
    (feature: any, layer: Layer) => {
      const currentLayer = layer;

      // Different styles for level 1 and level 2
      const getDefaultStyle = () => {
        const isHighlighted = isFeatureHighlighted(feature);

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
            fillOpacity: selectedArea
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

      const hoverStyle = isLevel2
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

      // Set initial style
      currentLayer.setStyle(getDefaultStyle());

      const mouseoverHandler = (e: any) => {
        if (e.target && e.target.setStyle && !isZoomingRef.current) {
          try {
            // Don't change style if it's highlighted, just show tooltip
            if (!isFeatureHighlighted(feature)) {
              e.target.setStyle(hoverStyle);
            }
            if (!e.target.isPopupOpen()) {
              e.target.openTooltip();
            }
          } catch (error) {
            // Ignore styling errors
          }
        }
      };

      const mouseoutHandler = (e: any) => {
        if (e.target && e.target.setStyle && !isZoomingRef.current) {
          try {
            // Reset to default style (which includes highlight if applicable)
            e.target.setStyle(getDefaultStyle());
            e.target.closeTooltip();
          } catch (error) {
            // Ignore styling errors
          }
        }
      };

      const clickHandler = (e: any) => {
        // Prevent during zoom and ensure single click only
        if (!isZoomingRef.current) {
          handleFeatureClick(feature, currentLayer, isLevel2);
        }
      };

      // Add event listeners
      currentLayer.on({
        mouseover: mouseoverHandler,
        mouseout: mouseoutHandler,
        click: clickHandler,
      });

      // Add tooltip with improved naming for level 2
      const getFeatureName = () => {
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

      try {
        currentLayer.bindTooltip(getFeatureName(), {
          permanent: false,
          direction: 'center',
          className: `custom-tooltip ${isLevel2 ? 'level2-tooltip' : 'level1-tooltip'}`,
          opacity: 0.9,
        });
      } catch (error) {
        console.warn('Error binding tooltip:', error);
      }
    };

  // Re-render layers when highlightedFeature changes
  useEffect(() => {
    // Force re-render of layers by updating their styles
    if (mapRef.current) {
      mapRef.current.eachLayer((layer: any) => {
        if (layer.feature && layer.setStyle) {
          try {
            const isLevel2Layer =
              layer.feature.properties?.NAME_2 ||
              layer.feature.properties?.ADM2_EN;
            const isHighlighted = isFeatureHighlighted(layer.feature);

            if (isLevel2Layer) {
              layer.setStyle({
                fillColor: isHighlighted ? '#74b9ff' : '#ff6b6b',
                weight: isHighlighted ? 4 : 1,
                color: isHighlighted ? '#0984e3' : '#d63031',
                fillOpacity: isHighlighted ? 0.9 : 0.8,
                dashArray: isHighlighted ? '0' : '0',
              });
            } else {
              layer.setStyle({
                fillColor: isHighlighted ? '#00b894' : '#3388ff',
                weight: isHighlighted ? 4 : 1,
                color: isHighlighted ? '#00a085' : '#0c4da2',
                fillOpacity: selectedArea
                  ? isHighlighted
                    ? 0.8
                    : 0.4
                  : isHighlighted
                    ? 0.9
                    : 0.7,
                dashArray: isHighlighted ? '0' : '0',
              });
            }
          } catch (error) {
            // Ignore styling errors
          }
        }
      });
    }
  }, [highlightedFeature, selectedArea]);

  const filteredLevel2Data = getFilteredLevel2Data();

  if (initialLoading) {
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
        {/* Always render level 1 data - no re-fetching, just style changes */}
        {allData.level1 && (
          <GeoJSON
            key={`level1-${highlightedFeature ? 'highlighted' : 'normal'}`}
            data={allData.level1}
            style={(feature) => {
              const isHighlighted = isFeatureHighlighted(feature);
              return {
                fillColor: isHighlighted ? '#00b894' : '#3388ff',
                weight: isHighlighted ? 4 : 1,
                color: isHighlighted ? '#00a085' : '#0c4da2',
                fillOpacity: selectedArea
                  ? isHighlighted
                    ? 0.8
                    : 0.4
                  : isHighlighted
                    ? 0.9
                    : 0.7,
                cursor: 'pointer',
                dashArray: isHighlighted ? '0' : '0',
              };
            }}
            onEachFeature={createOnEachFeature(false)}
          />
        )}

        {/* Render level 2 data only for selected area - smooth show/hide */}
        {filteredLevel2Data && filteredLevel2Data.features.length > 0 && (
          <GeoJSON
            key={`level2-${selectedArea?.properties?.name || selectedArea?.properties?.NAME_1 || 'selected'}-${highlightedFeature ? JSON.stringify(highlightedFeature.properties) : 'normal'}`}
            data={filteredLevel2Data}
            style={(feature) => {
              const isHighlighted = isFeatureHighlighted(feature);
              return {
                fillColor: isHighlighted ? '#74b9ff' : '#ff6b6b',
                weight: isHighlighted ? 4 : 1,
                color: isHighlighted ? '#0984e3' : '#d63031',
                fillOpacity: isHighlighted ? 0.9 : 0.8,
                cursor: 'pointer',
                dashArray: isHighlighted ? '0' : '0',
              };
            }}
            onEachFeature={createOnEachFeature(true)}
          />
        )}
      </MapContainer>

      {/* Level indicator */}
      <div className="absolute top-2 left-2 z-[1000] rounded bg-white/90 px-3 py-1 shadow-md backdrop-blur-sm transition-all duration-300">
        <span className="text-sm font-semibold">
          {selectedArea
            ? `${selectedArea.properties?.name || selectedArea.properties?.NAME_1 || 'Selected Area'} - Detailed View`
            : 'Philippines - Provinces & Regions'}
        </span>
        <span className="block text-xs text-gray-600">
          {selectedArea
            ? 'Cities & Municipalities - Click to highlight'
            : 'Click any area to explore'}
        </span>
        {highlightedFeature && (
          <span className="block text-xs font-medium text-blue-600">
            Selected:{' '}
            {highlightedFeature.properties?.NAME_1 ||
              highlightedFeature.properties?.NAME_2 ||
              highlightedFeature.properties?.name ||
              highlightedFeature.properties?.ADM1_EN ||
              highlightedFeature.properties?.ADM2_EN ||
              'Unknown Area'}
          </span>
        )}
      </div>

      {/* Back button when area is selected */}
      {selectedArea && (
        <div className="absolute top-2 right-2 z-[1000] transition-all duration-300">
          <button
            onClick={() => {
              if (onAreaClick && !isZoomingRef.current) {
                onAreaClick(null, null); // Signal to reset
              }
            }}
            className="rounded border bg-white/90 px-3 py-1 text-sm shadow-md backdrop-blur-sm transition-colors duration-200 hover:bg-gray-100"
            disabled={isZoomingRef.current}
          >
            ← Back to Philippines
          </button>
        </div>
      )}
    </div>
  );
};

export default PhilippinesMap;
