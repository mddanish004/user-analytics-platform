# Mini Analytics Platform

## Features

- Tracker Script
- Session Tracking
- Heatmap
- Timeline
- React Dashboard

## Tech Stack

- React
- Express
- MongoDB
- Mongoose

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Tracker

Open `http://localhost:5000/demo/demo.html` with the backend running.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/events | Store a tracker event |
| GET | /api/sessions | List all sessions |
| GET | /api/sessions/:id | Get a session's event journey |
| GET | /api/heatmap?url= | Get click coordinates for a URL |
| GET | /api/stats | Get dashboard statistics |
| GET | /api/urls | Get all distinct tracked URLs |
