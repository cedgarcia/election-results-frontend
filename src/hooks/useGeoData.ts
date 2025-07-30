import { useEffect, useState } from 'react';
import type { GeoJSON as GeoJSONType } from 'geojson';

export const useGeoData = (level: number) => {
  const [geoData, setGeoData] = useState<GeoJSONType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/map-data/level_${level}.json`);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data: GeoJSONType = await response.json();
        setGeoData(data);
      } catch (err) {
        console.error('Error loading GeoJSON:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load map data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, [level]);

  return { geoData, loading, error };
};
