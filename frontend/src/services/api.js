const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const BACKEND_ORIGIN = API_URL.replace(/\/api\/?$/, "");

async function apiRequest(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export const getSessions = () => apiRequest("/sessions");
export const getSessionById = (id) => apiRequest(`/sessions/${id}`);
export const getHeatmap = (url) =>
  apiRequest(`/heatmap?url=${encodeURIComponent(url)}`);
export const getStats = () => apiRequest("/stats");
export const getUrls = () => apiRequest("/urls");
