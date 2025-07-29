'use client';

import { useState } from 'react';
import Head from 'next/head';
import PhilippinesMap from '../components/PhilippinesMap';

const PhilippinesMapPage = () => {
  const [currentLevel, setCurrentLevel] = useState(0);

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Head>
        <title>Philippines Administrative Map</title>
      </Head>

      <h1 className="mb-4 text-2xl font-bold">
        Philippines Administrative Map
      </h1>

      <div className="mb-4 flex space-x-2">
        {[0, 1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() => setCurrentLevel(level)}
            className={`rounded px-4 py-2 ${
              currentLevel === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Level {level}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border shadow-lg">
        <PhilippinesMap level={currentLevel} />
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Displaying administrative level {currentLevel} data for the Philippines
      </p>
    </div>
  );
};

export default PhilippinesMapPage;
