type MapUIControlsProps = {
  level: number;
  onBack?: () => void;
  maxLevel?: number;
};

export const MapUIControls = ({
  level,
  onBack,
  maxLevel = 3,
}: MapUIControlsProps) => {
  return (
    <>
      {/* Level indicator */}
      <div className="absolute top-2 left-2 z-[1000] rounded bg-white px-3 py-1 shadow-md">
        <span className="text-sm font-semibold">Level {level}</span>
        {level < maxLevel && (
          <span className="block text-xs text-gray-600">
            Click area to drill down
          </span>
        )}
      </div>

      {/* Back button for levels > 1 */}
      {level > 1 && onBack && (
        <div className="absolute top-2 right-2 z-[1000]">
          <button
            onClick={onBack}
            className="rounded border bg-white px-3 py-1 text-sm shadow-md hover:bg-gray-100"
          >
            ← Back
          </button>
        </div>
      )}
    </>
  );
};
