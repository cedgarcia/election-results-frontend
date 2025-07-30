/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { DrilldownState } from '@/types';
import { Breadcrumb } from '@/components/map/BreadCrumb';
import { Instructions } from '@/components/map/Instruction';
import { PageHeader } from '@/components/map/PageHeader';

// Dynamically import the map component with no SSR
const PhilippinesMap = dynamic(
  () => import('@/components/map/PhilippinesMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] w-full items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading map...</div>
      </div>
    ),
  }
);

const ZOOM_LEVELS = [6, 10, 12]; // Zoom levels for each drill-down level
const MAX_LEVEL = 3;
const INITIAL_LEVEL = 0; // Start at level 1 instead of 0

const PhilippinesMapPage = () => {
  const [drilldownState, setDrilldownState] = useState<DrilldownState>({
    level: INITIAL_LEVEL,
    focusArea: null,
    selectedFeature: null,
  });

  const handleAreaClick = (feature: any, bounds: any) => {
    if (drilldownState.level < MAX_LEVEL) {
      const nextLevel = drilldownState.level + 1;

      setDrilldownState({
        level: nextLevel,
        focusArea: {
          bounds: bounds,
          zoom: ZOOM_LEVELS[nextLevel] || 10,
        },
        selectedFeature: feature,
      });
    }
  };

  const handleReset = () => {
    setDrilldownState({
      level: INITIAL_LEVEL,
      focusArea: null,
      selectedFeature: null,
    });
  };

  const handleBack = () => {
    if (drilldownState.level > INITIAL_LEVEL) {
      const prevLevel = drilldownState.level - 1;
      setDrilldownState({
        level: prevLevel,
        focusArea:
          prevLevel === INITIAL_LEVEL ? null : drilldownState.focusArea,
        selectedFeature:
          prevLevel === INITIAL_LEVEL ? null : drilldownState.selectedFeature,
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <PageHeader level={drilldownState.level} onReset={handleReset} />

      <Breadcrumb
        selectedFeature={drilldownState.selectedFeature}
        level={drilldownState.level}
      />

      {/* Map Container */}
      <div className="overflow-hidden rounded-lg border shadow-lg">
        <PhilippinesMap
          level={drilldownState.level}
          onAreaClick={handleAreaClick}
          focusArea={drilldownState.focusArea}
          onBack={handleBack}
          maxLevel={MAX_LEVEL}
        />
      </div>

      <Instructions />
    </div>
  );
};

export default PhilippinesMapPage;
