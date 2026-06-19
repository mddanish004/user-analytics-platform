const BASE_URL = "http://localhost:5000/api";

async function apiRequest(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);

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
