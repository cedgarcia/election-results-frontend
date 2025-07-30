export const Instructions = () => {
  return (
    <div className="mt-4 rounded-lg bg-gray-50 p-4">
      <h3 className="mb-2 font-semibold text-gray-800">How to use:</h3>
      <ul className="space-y-1 text-sm text-gray-600">
        <li>
          • <strong>Click</strong> on any area to drill down to the next level
        </li>
        <li>
          • <strong>Hover</strong> over areas to see them highlighted in orange
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
  );
};
