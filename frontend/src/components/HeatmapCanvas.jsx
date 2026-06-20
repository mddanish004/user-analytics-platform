import { useState, useEffect, useLayoutEffect, useRef } from "react";

function HeatmapCanvas({ clicks, pageUrl }) {
  const [iframeHeight, setIframeHeight] = useState(1100);
  const [containerWidth, setContainerWidth] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleMessage(e) {
      if (e.data && e.data.type === "heatmap-page-height") {
        setIframeHeight(e.data.height);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  if (!pageUrl) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-3">📭</p>
        <p className="text-lg">No Clicks Found</p>
      </div>
    );
  }

  const viewportCounts = {};
  for (const click of clicks) {
    if (click.viewport) {
      viewportCounts[click.viewport] = (viewportCounts[click.viewport] || 0) + 1;
    }
  }

  let renderWidth = 1280;
  let mostCommonCount = 0;
  for (const viewport in viewportCounts) {
    if (viewportCounts[viewport] > mostCommonCount) {
      mostCommonCount = viewportCounts[viewport];
      renderWidth = Number(viewport);
    }
  }

  const scale = containerWidth > 0 ? containerWidth / renderWidth : 1;

  const scaledHeight = Math.round(iframeHeight * scale);

  return (
    <div
      ref={wrapperRef}
      className="w-full rounded-lg border border-gray-300 overflow-hidden"
      style={{ height: scaledHeight }}
    >
      <div
        className="relative"
        style={{
          width: renderWidth,
          height: iframeHeight,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        <iframe
          src={pageUrl}
          style={{ width: renderWidth, height: iframeHeight }}
          className="border-none block"
          title="Page Preview"
          scrolling="no"
        />
        {clicks.map((click, i) => {
          const ratio = click.viewport ? renderWidth / click.viewport : 1;
          return (
            <div
              key={i}
              className="absolute w-5 h-5 rounded-full bg-yellow-400 opacity-70 blur-[2px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
              style={{ left: click.x * ratio, top: click.y * ratio }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HeatmapCanvas;
