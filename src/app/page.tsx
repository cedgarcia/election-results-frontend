/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR
const PhilippinesMap = dynamic(() => import('../components/PhilippinesMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center bg-gray-100">
      <div className="text-gray-600">Loading map...</div>
    </div>
  ),
});

type DrilldownState = {
  level: number;
  focusArea: {
    bounds: any;
    zoom: number;
  } | null;
  selectedFeature: any;
};

const PhilippinesMapPage = () => {
  const [drilldownState, setDrilldownState] = useState<DrilldownState>({
    level: 0,
    focusArea: null,
    selectedFeature: null,
  });

  const handleAreaClick = (feature: any, bounds: any) => {
    if (drilldownState.level < 3) {
      // Calculate appropriate zoom level based on current level
      const zoomLevels = [6, 8, 10, 12]; // Zoom levels for each drill-down level
      const nextLevel = drilldownState.level + 1;

      setDrilldownState({
        level: nextLevel,
        focusArea: {
          bounds: bounds,
          zoom: zoomLevels[nextLevel] || 10,
        },
        selectedFeature: feature,
      });
    }
  };

  const handleReset = () => {
    setDrilldownState({
      level: 0,
      focusArea: null,
      selectedFeature: null,
    });
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* Header with controls */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Philippines Interactive Map
          </h1>
          <p className="text-gray-600">
            Click on any area to drill down and explore
          </p>
        </div>

        {drilldownState.level > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            Reset to Philippines
          </button>
        )}
      </div>

      {/* Breadcrumb */}
      {drilldownState.selectedFeature && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Current Location:</span>
            <span className="font-semibold text-blue-800">
              {drilldownState.selectedFeature.properties?.name ||
                `Level ${drilldownState.level} Area`}
            </span>
            <span className="text-gray-500">
              • Level {drilldownState.level}
            </span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="overflow-hidden rounded-lg border shadow-lg">
        <PhilippinesMap
          level={drilldownState.level}
          onAreaClick={handleAreaClick}
          focusArea={drilldownState.focusArea}
        />
      </div>

      {/* Instructions */}
      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold text-gray-800">How to use:</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            • <strong>Click</strong> on any area to drill down to the next level
          </li>
          <li>
            • <strong>Hover</strong> over areas to see them highlighted in
            orange
          </li>
          <li>
            • Use the <strong>Reset</strong> button to return to the main
            Philippines view
          </li>
          <li>
            • <strong>Zoom</strong> and <strong>pan</strong> the map to explore
            different areas
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PhilippinesMapPage;
