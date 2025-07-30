/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GeoJSON as GeoJSONType } from 'geojson';
import type { Layer } from 'leaflet';
import { GeoJSON } from 'react-leaflet';

type InteractiveGeoJSONProps = {
  data: GeoJSONType;
  level: number;
  maxLevel?: number;
  onFeatureClick?: (feature: any, layer: Layer) => void;
};

export const InteractiveGeoJSON = ({
  data,
  level,
  maxLevel = 3,
  onFeatureClick,
}: InteractiveGeoJSONProps) => {
  const isClickable = level < maxLevel;

  const handleFeatureClick = (feature: any, layer: Layer) => {
    if (onFeatureClick && isClickable) {
      try {
        // Ensure the layer has bounds before proceeding
        if (layer && typeof (layer as any).getBounds === 'function') {
          onFeatureClick(feature, layer);
        }
      } catch (error) {
        console.warn('Error handling feature click:', error);
      }
    }
  };

  return (
    <GeoJSON
      key={`geojson-${level}`} // Force re-render when level changes
      data={data}
      style={() => ({
        fillColor: '#3388ff',
        weight: 1,
        color: '#0c4da2',
        fillOpacity: 0.7,
        cursor: isClickable ? 'pointer' : 'default',
      })}
      onEachFeature={(feature, layer) => {
        // Add interactivity
        layer.on({
          mouseover: (e) => {
            if (isClickable) {
              e.target.setStyle({
                fillColor: '#ff7800',
                weight: 2,
                fillOpacity: 0.9,
              });
            }
          },
          mouseout: (e) => {
            e.target.setStyle({
              fillColor: '#3388ff',
              weight: 1,
              fillOpacity: 0.7,
            });
          },
          click: (e) => {
            handleFeatureClick(feature, layer);
          },
        });

        // Add tooltip if feature has name property
        if (feature.properties && feature.properties.name) {
          layer.bindTooltip(feature.properties.name, {
            permanent: false,
            direction: 'center',
            className: 'custom-tooltip',
          });
        }
      }}
    />
  );
};
