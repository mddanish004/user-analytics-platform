const script = document.currentScript;
const BACKEND_URL =
  script?.getAttribute("data-api") ||
  (script?.src
    ? new URL("../api/events", script.src).href
    : "http://localhost:5000/api/events");

const SESSION_KEY = "analytics_session_id";

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

async function sendEvent(eventData) {
  try {
    await fetch(BACKEND_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.error("Failed to send analytics event", error);
  }
}

function trackPageView() {
  sendEvent({
    session_id: getSessionId(),

    type: "page_view",

    url: window.location.pathname,

    timestamp: new Date().toISOString(),
  });
}

function trackClicks() {
  document.addEventListener("click", (event) => {
    sendEvent({
      session_id: getSessionId(),

      type: "click",

      url: window.location.pathname,

      timestamp: new Date().toISOString(),

      x: event.pageX,

      y: event.pageY,

      viewport: document.documentElement.clientWidth,
    });
  });
}

trackPageView();

trackClicks();
