import { useEffect, useState } from "react";
import { getHeatmap, getUrls } from "../services/api";
import HeatmapCanvas from "../components/HeatmapCanvas";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function Heatmap() {
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [urlsLoading, setUrlsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUrls() {
      try {
        const data = await getUrls();
        setUrls(data.data);
        if (data.data.length > 0) {
          setSelectedUrl(data.data[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setUrlsLoading(false);
      }
    }
    fetchUrls();
  }, []);

  useEffect(() => {
    if (!selectedUrl) return;
    async function fetchClicks() {
      setLoading(true);
      try {
        const data = await getHeatmap(selectedUrl);
        setClicks(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClicks();
  }, [selectedUrl]);

  if (urlsLoading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-7">
      <h1 className="text-2xl font-bold mb-6">Heatmap</h1>
      <div className="flex items-center gap-3 mb-5">
        <label htmlFor="url-select" className="font-medium">
          Select URL:
        </label>
        <select
          id="url-select"
          value={selectedUrl}
          onChange={(e) => setSelectedUrl(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm bg-white"
        >
          {urls.map((url) => (
            <option key={url} value={url}>
              {url}
            </option>
          ))}
        </select>
      </div>
      {loading ? <Loader /> : <HeatmapCanvas clicks={clicks} />}
    </div>
  );
}

export default Heatmap;
