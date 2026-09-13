import express from "express";

import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import skillRoutes from "./skill.routes.js";
import achievementRoutes from "./achievement.routes.js";
import activityRoutes from "./activity.routes.js";
import collectibleRoutes from "./collectible.routes.js";
import pageRoutes from "./page.routes.js";
import taskRoutes from "./task.routes.js";
import projectRoutes from "./project.routes.js";
import gamificationRoutes from "./gamification.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/skills", skillRoutes);
router.use("/achievements", achievementRoutes);
router.use("/activity", activityRoutes);
router.use("/collectibles", collectibleRoutes);
router.use("/pages", pageRoutes);
router.use("/tasks", taskRoutes);
router.use("/projects", projectRoutes);
router.use("/gamification", gamificationRoutes);

export default router;
