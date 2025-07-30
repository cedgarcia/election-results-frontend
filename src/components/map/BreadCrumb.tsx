/* eslint-disable @typescript-eslint/no-explicit-any */
type BreadcrumbProps = {
  selectedFeature: any;
  level: number;
};

export const Breadcrumb = ({ selectedFeature, level }: BreadcrumbProps) => {
  if (!selectedFeature) return null;

  return (
    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Current Location:</span>
        <span className="font-semibold text-blue-800">
          {selectedFeature.properties?.name || `Level ${level} Area`}
        </span>
        <span className="text-gray-500">• Level {level}</span>
      </div>
    </div>
  );
};
