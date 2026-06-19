import "dotenv/config";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import eventRoutes from "./routes/eventRoutes.js";
import connectDB from "./config/db.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { getHeatmap } from "./controllers/eventController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;

// Allow requests from any origin and explicitly permit private-network access
// (Chrome 94+ requires Access-Control-Allow-Private-Network on preflight)
app.use(
  cors({
    origin: true,
  }),
);
app.use((req, res, next) => {
  if (req.headers["access-control-request-private-network"]) {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }
  next();
});

app.use(express.json());

// Serve the demo page and the tracker script as static assets so the demo
// runs on http://localhost:5000 (same origin as the API — no CORS friction).
app.use("/tracker", express.static(join(__dirname, "../tracker")));
app.use("/demo", express.static(join(__dirname, "../demo")));

app.use("/api/events", eventRoutes);
app.use("/api/sessions", sessionRoutes);
app.get("/api/heatmap", getHeatmap);

app.get("/", (req, res) => {
  res.send("API Running");
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
