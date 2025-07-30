/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

type MapControllerProps = {
  focusArea:
    | {
        bounds: any;
        zoom: number;
      }
    | null
    | undefined; // Allow undefined
};

export const MapController = ({ focusArea }: MapControllerProps) => {
  const map = useMap();

  useEffect(() => {
    if (focusArea && focusArea.bounds && map) {
      // Add a small delay to ensure the map is fully rendered
      const timer = setTimeout(() => {
        try {
          // Check if the map container still exists
          if (map.getContainer() && map.getContainer().offsetParent !== null) {
            // Invalidate size first to ensure proper rendering
            map.invalidateSize();

            // Then fit bounds
            map.fitBounds(focusArea.bounds, {
              padding: [20, 20],
              maxZoom: focusArea.zoom,
              animate: true,
              duration: 0.5,
            });
          }
        } catch (error) {
          console.warn('Error fitting bounds:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [focusArea, map]);

  return null;
};
