import express from "express";
import {
  getSessions,
  getSessionById,
  getHeatmap,
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getSessions);

router.get("/heatmap", getHeatmap);

router.get("/:id", getSessionById);

export default router;
