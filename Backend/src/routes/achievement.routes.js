import express from "express";
import {
  getAchievements,
  getMyAchievements,
  recheckAchievements,
} from "../controllers/achievement.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAchievements);
router.get("/me", protect, getMyAchievements);
router.post("/check", protect, recheckAchievements);

export default router;
