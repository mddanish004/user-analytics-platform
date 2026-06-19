import express from "express";
import {
  getSessions,
  getSessionById,
} from "../controllers/sessionController.js";

const router = express.Router();

router.get("/", getSessions);
router.get("/:id", getSessionById);

export default router;
