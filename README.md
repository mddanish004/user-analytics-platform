# User Analytics Platform

A full-stack web analytics application built as a technical selection task submission. The project captures user interactions on a website through a lightweight JavaScript tracker, stores events in MongoDB, and presents the collected data in a React dashboard with session listings, per-session event timelines, and click heatmaps.

## Live Links

| Resource | URL |
|----------|-----|
| Demo page | [user-analytics-platform-bch6.onrender.com/demo/demo.html](https://user-analytics-platform-bch6.onrender.com/demo/demo.html) |
| Dashboard | [user-analytics-platform-phi.vercel.app](https://user-analytics-platform-phi.vercel.app/) |
| Backend API | [user-analytics-platform-bch6.onrender.com](https://user-analytics-platform-bch6.onrender.com/) |

**Note:** The backend is hosted on Render's free tier. Services sleep after approximately 15 minutes of inactivity. The first request after sleep can take 30–60 seconds to respond. If the demo page or dashboard appears slow to load, wait a moment and refresh.

### Contact

- LinkedIn: [linkedin.com/in/mddanish004](https://www.linkedin.com/in/mddanish004/)
- Email: [m.danishansari400@gmail.com](mailto:m.danishansari400@gmail.com)

### Quick start for reviewers

1. Open the [demo page](https://user-analytics-platform-bch6.onrender.com/demo/demo.html) and click around the page (navigation, product cards, buttons).
2. Open the [dashboard](https://user-analytics-platform-phi.vercel.app/) to view the session, event timeline, and heatmap for the interactions you just generated.
3. If either page is slow on first load, allow up to a minute for the backend to wake up, then refresh.

---

## Table of Contents

1. [Live Links](#live-links)
2. [Overview](#overview)
3. [What This Project Demonstrates](#what-this-project-demonstrates)
4. [System Architecture](#system-architecture)
5. [Features](#features)
6. [Tech Stack](#tech-stack)
7. [Project Structure](#project-structure)
8. [Data Model](#data-model)
9. [API Reference](#api-reference)
10. [How the Tracker Works](#how-the-tracker-works)
11. [How the Heatmap Works](#how-the-heatmap-works)
12. [Demo Page](#demo-page)
13. [Getting Started (Local Development)](#getting-started-local-development)
14. [Deployment](#deployment)
15. [Design Decisions](#design-decisions)
16. [Known Limitations](#known-limitations)
17. [Possible Extensions](#possible-extensions)
18. [Author](#author)

---

## Overview

This application is divided into three main parts:

| Component | Role |
|-----------|------|
| **Tracker** (`tracker/`) | A small JavaScript snippet embedded on any page to record page views and click coordinates |
| **Backend** (`backend/`) | A Node.js REST API that ingests events, persists them in MongoDB, and serves aggregated analytics data |
| **Dashboard** (`frontend/`) | A React single-page application for viewing sessions, event timelines, and click heatmaps |

A sample e-commerce page (`demo/demo.html`) is included so reviewers can interact with a realistic page and immediately see data appear in the dashboard. A live version is available at [user-analytics-platform-bch6.onrender.com/demo/demo.html](https://user-analytics-platform-bch6.onrender.com/demo/demo.html); collected data can be viewed on the [dashboard](https://user-analytics-platform-phi.vercel.app/).

---

## What This Project Demonstrates

- Building a client-side event collection script with session persistence
- Designing a REST API with clear separation between routes, controllers, and models
- Aggregating raw event data into session-level summaries using MongoDB aggregation
- Rendering click heatmaps with viewport-aware coordinate scaling
- Deploying a multi-service application (API on Render, dashboard on Vercel)
- Handling cross-origin requests between a tracker, API, and dashboard

---

## System Architecture

```
┌─────────────────────┐
│   Website / Demo    │
│  (with tracker.js)  │
└──────────┬──────────┘
           │ POST /api/events
           ▼
┌─────────────────────┐       ┌─────────────────────┐
│   Express Backend   │◄──────│  React Dashboard    │
│   (Node.js + API)   │  GET  │  (Vite + React)     │
└──────────┬──────────┘       └─────────────────────┘
           │
           ▼
┌─────────────────────┐
│   MongoDB Atlas     │
│   (events store)    │
└─────────────────────┘
```

**Event flow:**

1. A user visits a page that includes `tracker.js`.
2. The tracker assigns or retrieves a session ID from `localStorage`, then sends a `page_view` event to the API.
3. Each click on the page sends a `click` event with page coordinates and viewport width.
4. The dashboard fetches aggregated session data and click coordinates from the API to render tables, timelines, and heatmaps.

---

## Features

### Event Tracking

- Automatic `page_view` recording on page load
- `click` event capture with `x`, `y` coordinates and viewport width
- Session identification via a UUID stored in `localStorage` (persists across page reloads within the same browser)

### Sessions Dashboard

- Summary statistics: total sessions, total events, total clicks
- Sortable session table showing session ID, event count, and last activity timestamp
- Link to view the full event timeline for any session

### Session Journey (Timeline)

- Chronological list of all events for a selected session
- Distinguishes between page views (shows URL) and clicks (shows coordinates)

### Click Heatmap

- Dropdown to select from all tracked URLs
- Renders the target page inside an iframe with click positions overlaid as semi-transparent markers
- Coordinates are scaled to account for different viewport widths at capture time

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Tracker | Vanilla JavaScript (no dependencies) |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB (Atlas) |
| Frontend | React 19, React Router 7, Vite 6 |
| Styling | Tailwind CSS 4 |
| Backend hosting | Render |
| Frontend hosting | Vercel |

---

## Project Structure

```
user-analytics-platform/
├── tracker/
│   └── tracker.js              # Client-side analytics snippet
├── demo/
│   └── demo.html               # Sample page for testing the tracker
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── eventController.js  # Event ingestion and stats
│   │   ├── sessionController.js# Session aggregation queries
│   │   └── heatmapController.js# Click data for heatmaps
│   ├── models/
│   │   └── Event.js            # Mongoose event schema
│   ├── routes/
│   │   ├── eventRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── heatmapRoutes.js
│   ├── server.js               # Express app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level page components
│   │   ├── services/
│   │   │   └── api.js          # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
└── render.yaml                   # Render deployment config
```

---

## Data Model

Events are stored in a single MongoDB collection. Each document represents one tracked interaction.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | String | Yes | UUID identifying the browser session |
| `type` | String | Yes | `"page_view"` or `"click"` |
| `url` | String | Yes | Page pathname where the event occurred (e.g. `/demo/demo.html`) |
| `timestamp` | Date | Yes | ISO 8601 timestamp of the event |
| `x` | Number | No | Horizontal click position (page coordinates); present for click events |
| `y` | Number | No | Vertical click position (page coordinates); present for click events |
| `viewport` | Number | No | Browser viewport width in pixels at click time |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**Example `page_view` event:**

```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "type": "page_view",
  "url": "/demo/demo.html",
  "timestamp": "2024-06-15T10:30:00.000Z"
}
```

**Example `click` event:**

```json
{
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "type": "click",
  "url": "/demo/demo.html",
  "timestamp": "2024-06-15T10:30:05.000Z",
  "x": 420,
  "y": 315,
  "viewport": 1440
}
```

---

## API Reference

| Environment | Base URL |
|-------------|----------|
| Production | `https://user-analytics-platform-bch6.onrender.com/api` |
| Local | `http://localhost:5000/api` |

### `POST /api/events`

Ingest a new event from the tracker.

**Request body:**

```json
{
  "session_id": "string",
  "type": "page_view | click",
  "url": "string",
  "timestamp": "ISO 8601 string",
  "x": 0,
  "y": 0,
  "viewport": 1440
}
```

**Response:** `201 Created` with the saved event document.

---

### `GET /api/sessions`

Returns all sessions aggregated by `session_id`, sorted by most recent activity.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "session_id": "a1b2c3d4-...",
      "eventCount": 12,
      "lastActivity": "2024-06-15T10:35:00.000Z"
    }
  ]
}
```

---

### `GET /api/sessions/:id`

Returns all events for a specific session, ordered chronologically.

**Response:**

```json
{
  "success": true,
  "data": [ /* array of event documents */ ]
}
```

---

### `GET /api/heatmap?url=<pathname>`

Returns all click events for a given URL pathname.

**Query parameter:** `url` (required) — the pathname stored in events, e.g. `/demo/demo.html`

**Response:**

```json
{
  "success": true,
  "data": [
    { "x": 420, "y": 315, "viewport": 1440, "timestamp": "..." }
  ]
}
```

---

### `GET /api/stats`

Returns platform-wide aggregate statistics.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalSessions": 5,
    "totalEvents": 47,
    "totalClicks": 32,
    "totalPageViews": 15
  }
}
```

---

### `GET /api/urls`

Returns a list of distinct URL pathnames that have recorded events.

**Response:**

```json
{
  "success": true,
  "data": ["/demo/demo.html"]
}
```

---

### Static Assets

The backend also serves:

| Path | Description |
|------|-------------|
| `/tracker/tracker.js` | The analytics snippet |
| `/demo/demo.html` | The sample test page |

---

## How the Tracker Works

The tracker (`tracker/tracker.js`) is a self-contained script with no external dependencies. It is included on a page via a `<script>` tag:

```html
<script src="http://localhost:5000/tracker/tracker.js"></script>
```

For production, the API URL can be overridden with a `data-api` attribute:

```html
<script
  src="https://user-analytics-platform-bch6.onrender.com/tracker/tracker.js"
  data-api="https://user-analytics-platform-bch6.onrender.com/api/events"
></script>
```

**Session management:**

- On first visit, a UUID is generated with `crypto.randomUUID()` and stored in `localStorage` under the key `analytics_session_id`.
- On subsequent visits in the same browser, the existing session ID is reused.
- Clearing browser storage starts a new session.

**Events sent:**

1. **Page view** — fired once when the script loads, recording the current `window.location.pathname`.
2. **Click** — fired on every `document` click, recording `pageX`, `pageY`, and `document.documentElement.clientWidth` (viewport width).

Events are sent via `fetch` with `POST` to `/api/events`. Failures are logged to the console but do not interrupt page behaviour.

---

## How the Heatmap Works

The heatmap page combines three pieces of logic to display click positions accurately over a page preview.

**1. Page preview via iframe**

The dashboard loads the tracked page (served from the backend at `/demo/demo.html`) inside an iframe so the layout matches what users actually saw.

**2. Dynamic page height**

The demo page posts its `document.documentElement.scrollHeight` to the parent window via `postMessage`. The heatmap component listens for this message and sizes the iframe accordingly.

**3. Viewport-aware coordinate scaling**

Click coordinates are recorded relative to the viewport width at capture time. When rendering the heatmap, the component:

- Determines the most common viewport width among the click events for the selected URL
- Uses that width as the reference render width for the iframe
- Scales click marker positions by the ratio `renderWidth / click.viewport`
- Applies a CSS `transform: scale()` so the preview fits the dashboard container width

Click markers are rendered as absolutely positioned, semi-transparent yellow circles overlaid on top of the iframe.

---

## Demo Page

`demo/demo.html` is a static mock e-commerce page styled after a retail storefront. It exists solely to provide a realistic page for generating analytics data during review.

**Live demo:** [https://user-analytics-platform-bch6.onrender.com/demo/demo.html](https://user-analytics-platform-bch6.onrender.com/demo/demo.html)

After interacting with the demo page, open the [dashboard](https://user-analytics-platform-phi.vercel.app/) to inspect sessions, timelines, and the click heatmap.

To run it locally:

1. Start the backend server (see [Getting Started](#getting-started-local-development)).
2. Open `http://localhost:5000/demo/demo.html` in a browser.
3. Click around the page to generate events.
4. Open the dashboard at `http://localhost:5173` to view the collected data.

The demo page includes the tracker script and the `postMessage` height reporter used by the heatmap view.

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18 or later
- A MongoDB Atlas cluster (or a local MongoDB instance)
- npm

### 1. Clone the repository

```bash
git clone <repository-url>
cd user-analytics-platform
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MongoDB connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/analytics_platform
PORT=5000
```

Install dependencies and start the server:

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Set up the frontend

In a separate terminal:

```bash
cd frontend
cp .env.example .env
```

For local development, the default API URL (`http://localhost:5000/api`) is used automatically when `VITE_API_URL` is not set. To set it explicitly:

```
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

### 4. Generate test data

1. Visit `http://localhost:5000/demo/demo.html`.
2. Click on various elements (navigation links, product cards, buttons).
3. Return to the dashboard to see sessions, timelines, and the heatmap.

---

## Deployment

The application is deployed as a split setup: the API on Render and the dashboard on Vercel.

| Service | Platform | URL |
|---------|----------|-----|
| Backend API | Render | [user-analytics-platform-bch6.onrender.com](https://user-analytics-platform-bch6.onrender.com/) |
| Dashboard | Vercel | [user-analytics-platform-phi.vercel.app](https://user-analytics-platform-phi.vercel.app/) |

The backend runs on Render's free tier, which sleeps after ~15 minutes of inactivity. Expect a 30–60 second delay on the first request after sleep.

### Backend (Render)

`render.yaml` defines a web service that runs the Express API from the `backend/` directory.

Live service: [https://user-analytics-platform-bch6.onrender.com/](https://user-analytics-platform-bch6.onrender.com/)

The backend serves the tracker script and demo page. Tracked pages reference:

```
https://user-analytics-platform-bch6.onrender.com/tracker/tracker.js
```

To redeploy or replicate this setup:

1. Create a new Web Service on [Render](https://render.com) connected to this repository.
2. Set the `MONGO_URI` environment variable to your MongoDB Atlas connection string.
3. Render will run `npm install` and `npm start` automatically.

### Frontend (Vercel)

Live dashboard: [https://user-analytics-platform-phi.vercel.app/](https://user-analytics-platform-phi.vercel.app/)

The frontend is configured with:

```
VITE_API_URL=https://user-analytics-platform-bch6.onrender.com/api
```

To redeploy or replicate this setup:

1. Import the `frontend/` directory as a project on [Vercel](https://vercel.com).
2. Set `VITE_API_URL` to your Render backend URL with `/api` appended.
3. Vercel will run `npm run build` and serve the static output. `vercel.json` configures SPA routing so all paths fall back to `index.html`.

### CORS

The backend enables CORS for all origins (`cors({ origin: true })`) and sets `Access-Control-Allow-Private-Network: true` for local network requests. This allows the tracker (running on any domain) and the Vercel-hosted dashboard to communicate with the API without additional configuration.

---

## Design Decisions

**Vanilla JavaScript tracker**

The tracker has no build step and no dependencies. It can be dropped into any HTML page with a single `<script>` tag, which is how production analytics snippets (e.g. Google Analytics, Mixpanel) are typically distributed.

**Single event collection**

All interactions are stored in one `events` collection rather than separate `sessions` and `events` collections. Sessions are derived at query time via MongoDB aggregation (`$group` on `session_id`). This keeps ingestion simple and avoids synchronisation between collections.

**Pathname-only URL storage**

The tracker records `window.location.pathname` rather than the full URL. This keeps events consistent regardless of protocol or hostname, and makes heatmap URL matching straightforward.

**Viewport width stored with clicks**

Screen sizes vary across users. Storing the viewport width at click time allows the heatmap renderer to normalise coordinates when overlaying markers on a fixed-width iframe preview.

**Backend serves static assets**

The tracker and demo page are served from the same origin as the API. This simplifies local development (one server for everything) and avoids CORS issues when loading the demo page in the heatmap iframe.

---

## Known Limitations

These are intentional simplifications for the scope of a selection task:

- **No authentication** — the dashboard and API are open. A production system would require login and API key validation for event ingestion.
- **No event batching** — each click sends an individual HTTP request. High-traffic sites would batch events and flush periodically.
- **Session scope is browser-local** — clearing `localStorage` or switching browsers creates a new session. There is no cross-device user identification.
- **Single-page heatmap** — the heatmap renders one URL at a time. Multi-page journey visualisation is limited to the session timeline view.
- **No scroll or hover tracking** — only page views and clicks are captured.
- **No data retention policy** — events are stored indefinitely with no TTL or archival.
- **Render free tier cold starts** — the hosted backend sleeps after inactivity; the first request after sleep can take 30–60 seconds.

---

## Possible Extensions

If this project were taken further, these would be natural next steps:

- Add API key authentication for the tracker endpoint
- Implement event batching with a `sendBeacon` fallback for page unload
- Track scroll depth, form submissions, and rage clicks
- Add date-range filtering on the sessions and heatmap views
- Introduce a proper `sessions` collection with first-seen and last-seen timestamps
- Add unit and integration tests for the API and tracker
- Support multiple tracked websites via a `site_id` field

---

## Author

Built as a technical selection task submission.

- LinkedIn: [linkedin.com/in/mddanish004](https://www.linkedin.com/in/mddanish004/)
- Email: [m.danishansari400@gmail.com](mailto:m.danishansari400@gmail.com)

