function HeatmapCanvas({ clicks }) {
  if (clicks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-3">📭</p>
        <p className="text-lg">No Clicks Found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
      {clicks.map((click, i) => (
        <div
          key={i}
          className="absolute w-5 h-5 rounded-full bg-red-500 opacity-25 blur-[2px] -translate-x-1/2 -translate-y-1/2"
          style={{ left: click.x, top: click.y }}
        />
      ))}
    </div>
  );
}

export default HeatmapCanvas;
