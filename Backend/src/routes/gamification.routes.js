import express from "express";
import {
  getOverview,
  recordDailyActivity,
} from "../controllers/gamification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/overview", getOverview);
router.post("/daily-activity", recordDailyActivity);

export default router;
