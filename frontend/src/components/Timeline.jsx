function Timeline({ events }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-3">📭</p>
        <p className="text-lg">No Events Found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {events.map((event) => (
        <div
          key={event._id}
          className="bg-white border border-gray-200 rounded-lg px-5 py-4"
        >
          <p className="font-semibold mb-1">
            {event.type === "page_view" ? "🟢 Page View" : "🖱 Click"}
          </p>
          <p className="text-gray-600 text-sm mb-1">
            {event.type === "page_view" ? event.url : `${event.x}, ${event.y}`}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(event.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
