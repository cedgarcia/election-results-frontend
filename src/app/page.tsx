/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const PhilippinesMap = dynamic(() => import('@/components/PhilippinesMap'), {
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
      setSelectedArea(null);
    } else {
      setSelectedArea(feature);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="overflow-hidden rounded-lg border shadow-lg">
        <PhilippinesMap
          onAreaClick={handleAreaClick}
          selectedArea={selectedArea}
          // You can now add additional layers or custom styles here
          // additionalLayers={yourAdditionalLayers}
          // customStyles={yourCustomStyles}
        />
      </div>
    </div>
  );
};

export default PhilippinesMapPage;
