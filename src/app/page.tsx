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

const PhilippinesMapPage = () => {
  const [selectedArea, setSelectedArea] = useState<any>(null);

  const handleAreaClick = (feature: any, bounds: any) => {
    if (feature === null && bounds === null) {
      // Reset to initial state
      setSelectedArea(null);
    } else {
      // Set the selected area (zoom will be handled internally by the map component)
      setSelectedArea(feature);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="overflow-hidden rounded-lg border shadow-lg">
        <PhilippinesMap
          onAreaClick={handleAreaClick}
          selectedArea={selectedArea}
        />
      </div>
    </div>
  );
};

export default PhilippinesMapPage;
