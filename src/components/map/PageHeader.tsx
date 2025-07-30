type PageHeaderProps = {
  level: number;
  onReset: () => void;
};

export const PageHeader = ({ level, onReset }: PageHeaderProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Philippines Interactive Map
        </h1>
        <p className="text-gray-600">
          Click on any area to drill down and explore
        </p>
      </div>

      {level > 1 && (
        <button
          onClick={onReset}
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
  );
};
