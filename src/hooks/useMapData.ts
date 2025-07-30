import { useEffect, useState } from 'react';
import { MapDataLevels } from '../types';

// CUSTOM HOOK TO LOAD ALL MAP DATA ONCE
export const useMapData = () => {
  const [mapData, setMapData] = useState<MapDataLevels>({
    level1: null,
    level2: null,
    level3: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllMapData = async () => {
      try {
        setIsLoading(true);

        // LOAD ALL LEVELS SIMULTANEOUSLY
        const [level1Response, level2Response, level3Response] =
          await Promise.all([
            fetch('/map-data/level_1.json'),
            fetch('/map-data/level_2.json'),
            fetch('/map-data/level_3.json').catch(() => null), // LEVEL 3 MIGHT NOT EXIST
          ]);

        const level1Data = await level1Response.json();
        const level2Data = await level2Response.json();
        const level3Data = level3Response ? await level3Response.json() : null;

        setMapData({
          level1: level1Data,
          level2: level2Data,
          level3: level3Data,
        });
      } catch (error) {
        console.error('ERROR LOADING MAP DATA:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllMapData();
  }, []);

  return { mapData, isLoading };
};
